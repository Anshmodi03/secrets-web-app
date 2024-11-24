const express = require("express");
const authRouter = express.Router(); // Corrected to Router()

const {
  register,
  login,
  user,
  forgotPassword,
  resetPassword,
} = require("../controller/authcontroller");
const { signupSchema, loginSchema } = require("../validator/auth-validator");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/auth");

authRouter.post("/register", validate(signupSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/user", authMiddleware, user);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword/:email/:token", resetPassword);

module.exports = authRouter;
