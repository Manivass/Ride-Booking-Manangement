const express = require("express");
const validateAndSanitizeSignUp = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    validateAndSanitizeSignUp(req.body);
    const { firstName, lastName, emailId, password, role } = req.body;
    const isEmailAvailabale = await User.findOne({ emailId });
    if (isEmailAvailabale) {
      return res.status(401).send("email is already exist!!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      role,
    });
    await newUser.save();
    const token = await newUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 24 * 24 * 1000),
    });
    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(401).send("pls fill  the credentials");
    }
    const isUserAlreadyLogged = await User.findOne({ emailId });
    if (!isUserAlreadyLogged) {
      return res.status(401).send("pls fill all the credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserAlreadyLogged.password,
    );
    if (!isPasswordCorrect) {
      return res.status(401).send("pls fill all the credentials");
    }
    const token = await isUserAlreadyLogged.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 24 * 24 * 1000),
    });
    res.status(200).json({ message: "successfully logged in" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
