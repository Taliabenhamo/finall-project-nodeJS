const express = require("express");
const Router = express.Router();
const verify_logged_in = require("../middleware/auth");
const lodash = require("lodash");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
require("../app");
const UserModel = require("../models/users");
const { validate } = require("../models/usersJoi");

const secret = "my-super-secret-am-israel";
const time = "1d";

const signToken = (id, biz) => {
  return JWT.sign({ id, biz }, secret, { expiresIn: time });
};

const cookieOptions = {
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

// Task number 1***
Router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { username, email, password } = req.body;
    const duplicateEmail = await UserModel.findOne({ email: email });
    if (duplicateEmail) {
      return res .status(409).
      json({ status: "Fail",
          message: "Email already exist" });
    }
    const newUser = await UserModel.create(req.body);
    const { _id } = newUser;
    res.status(200).json({
      data: { username, email, _id },
      message: "User has been registered successfully.",
    });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: err.message });
  }
});

// Task number 2***
Router.post("/login", async (req, res) => {
  try {
    // open variabul that includ our body ,(in this case our password &email)
    const { email, password } = req.body;
    //If one of the fields is empty We are going to print an error.
    if (!email || !password)
      return res.status(400).send("Fill in email/password");
    const user = await UserModel.findOne({ email: email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ status: "Email or password invalid." });
    }
// If we were able to log in without errors, we will be given a unique token, which we will use to identify ourselves in the system later
    const token = signToken(user._id, user.biz);
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ status: "success", token: token });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// find my user by  given token in headers
// Task number 3***
Router.get("/find", verify_logged_in, async (req, res) => {
  try {
    const decoded = req.user;
    // We will use select-("password") to not reveal the encrypted password we received, but  it will be possible to see it in the Mongoose collection.
    const current_user = await UserModel.findById(decoded.id).select("-password");
    res.status(200).json({ status: "succses", "user details": current_user });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
    console.log(err);
  }
});

module.exports = Router;
