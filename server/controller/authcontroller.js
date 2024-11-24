const jwt = require("jsonwebtoken");
const User = require("../model/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Registration Logic
const register = async (req, res, next) => {
  const { username, email, password, createdDate } = req.body;
  const currentDate = new Date();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password,
    createdDate: currentDate,
  });

  // Generate JWT token
  const token = await newUser.generateToken();

  try {
    console.log(newUser);
    res.status(201).json({
      msg: "Registration successful",
      token,
      userId: newUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// Login Logic
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Check password validity using custom method
    const isUserValid = await userExists.comparePassword(password);

    if (isUserValid) {
      // Generate JWT token
      const token = await userExists.generateToken();
      res.status(200).json({
        msg: "Login successful",
        token,
        userId: userExists._id.toString(),
      });
    } else {
      res.status(400).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

// Send User Info Logic
const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`User Error: ${error}`);
  }
};

// Forgot Password Logic
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Email not found" });
  }

  // Generate reset token
  const token = await user.generateToken();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "modiaastha01@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Reset password link
  const resetPageLink =
    "http://localhost:8000/resetPassword?token=" + token + "&email=" + email;

  var mailOptions = {
    from: "Affworld Assignment 1",
    to: email,
    subject: "Reset your Password",
    html: `<p>
    Click <a href="${resetPageLink}">here</a> to Reset Password
  </p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.json({ message: "Email Sent" });
    }
  });
};

// Reset Password Logic
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(newPassword, saltRound);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hash_password }
    );
    if (user) {
      res.status(200).json({ msg: "Password reset successful" });
    } else {
      res.status(400).json({ msg: "User Not Found" });
    }
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized, Invalid Token." });
  }
};

module.exports = { register, login, user, forgotPassword, resetPassword };
