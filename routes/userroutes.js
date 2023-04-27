const express = require("express");
const { UserModel } = require("../model/usermodel");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auhtenticator } = require("../middleware/authenticator");
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
    let { profile, name, bio, phone, email, password } = req.body;
    console.log(req.body);
    try {
      bcrypt.hash(password, 5, async function (err, hashed_pass) {
        if (err) {
          res.send({ msg: "error in encrypting password" });
        } else {
          let user = new UserModel({
            profile,
            name,
            bio,
            phone,
            email,
            password: hashed_pass,
          });
          await user.save();
          res.send({ mst: "user has been created successfully", user });
        }
      });
    } catch (error) {
      res.send({ mst: "error creating user" });
      console.log("error creating user");
    }
  });
  
  userRouter.post("/login", async (req, res) => {
    let { email, password } = req.body;
    console.log(req.body);
    try {
      let find = await UserModel.findOne({ email });
      bcrypt.compare(password, find.password, async function (err, result) {
        if (err) {
          res.send({ msg: "error in encrypting password" });
        } else {
          let userID = find._id;
          let token = jwt.sign({ userID: userID }, process.env.token);
          res.send({ mst: "user has been login successfully", token });
        }
      });
    } catch (error) {
      res.send({ mst: "error in login " });
      console.log("error login");
    }
  });
  
  userRouter.get("/getProfile", auhtenticator, async (req, res) => {
    let userID = req.body.userID;
    try {
      let user = await UserModel.findOne({ _id: userID });
      if (user) {
        res.send({ msg: "profile detials ", user });
      } else {
        res.send({ msg: "profile not found" });
      }
    } catch (error) {
      res.send({ msg: "server error" });
      console.log("server error", error);
    }
  });
  
  
  userRouter.patch("/getProfile", auhtenticator, async (req, res) => {
    let userID = req.body.userID;
    let payload = req.body;
    try {
      let user = await UserModel.findOne({ _id: userID });
      if (user) {
        let user = await UserModel.findByIdAndUpdate({ _id: userID }, payload);
        res.send({ msg: "profile detials updated successfully ", user });
      } else {
        res.send({ msg: "profile not found" });
      }
    } catch (error) {
      res.send({ msg: "server error" });
      console.log("server error", error);
    }
  });
  
  module.exports = {
    userRouter
  }