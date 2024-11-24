const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: Token not provided" });
  }

  // Remove "Bearer" from the token if present
  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    // Find user in the database without the password field
    const userData = await User.findOne({ email: decoded.email }).select({
      password: 0,
    });

    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Attach user information to the request
    req.user = userData;
    req.token = jwtToken;
    req.userId = userData._id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
