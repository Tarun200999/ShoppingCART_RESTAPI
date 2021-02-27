const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/key");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add All the fields" });
  } else {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return res.json({ error: "Enter valid email" });
    }
    Users.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          res.status(422).json({ error: "User already Exists Please Sign In" });
        } else {
          bcrypt
            .hash(password, 12)
            .then((hashedpassword) => {
              const newUser = new Users({
                name: name,
                email: email,
                password: hashedpassword,
              });
              newUser
                .save()
                .then((user) => {
                  res.json({ message: "User is Succesfully registered" });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide both Email and password" });
  } else {
    Users.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Please Sign In" });
        }
        bcrypt
          .compare(password, savedUser.password)
          .then((match) => {
            if (match) {
              const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET_KEY);
              const { _id, name, email } = savedUser;
              return res.json({ token: token, user: { _id, name, email } });
            } else {
              res.status(422).json({ error: "Invalid email or password" });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  }
});

module.exports = router;
