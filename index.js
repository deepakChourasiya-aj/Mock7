const express = require("express");
const app = express();

const cors = require("cors");
const { connection } = require("./config/db");
const { UserModel } = require("./model/usermodel");
app.use(express.json());
app.use(cors());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auhtenticator } = require("./middleware/authenticator");
const { userRouter } = require("./routes/userroutes");
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("okk");
});

app.use("/", userRouter);

app.listen(process.env.port || 9090, async () => {
  try {
    await connection;
    console.log("connected to db at 9090");
  } catch (error) {
    console.log("connection error");
    console.log(error);
  }
});
