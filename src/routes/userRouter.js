const express = require("express");
const validateAndSanitizeSignUp = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    validateAndSanitizeSignUp(req.body);
    const { firstName, lastName, emailId, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "successfully signuped" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
