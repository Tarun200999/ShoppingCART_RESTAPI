const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/key");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Please Login First" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "User must me Logged in" });
    }
    const { _id } = payload;
    Users.findById(_id)
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(401).json("User not found");
        }
        req.user = savedUser;
        console.log("User verifed");
        next();
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
