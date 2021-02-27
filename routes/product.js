const express = require("express");
const router = express.Router();
const fs = require("fs");
const mongoose = require("mongoose");
const Products = mongoose.model("Products");
const requireLogin = require("../middleware/requireLogin");
//MULTER CONFIG
const multer = require("multer");
const path = require("path");
global.__basedir = __dirname;

//definiting path where to store file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

//file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image.", 400), false);
  }
};

//creating a instance of multer to upload file
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  fileFilter: fileFilter,
});

//MULTER CONFIG END
router.get("/showproducts", requireLogin, (req, res) => {
  Products.find()
    .populate("productBY", "_id name email")
    .then((allproduct) => {
      res.json({ status: true, products: allproduct });
    })
    .catch((error) => {
      console.log(error);
    });
});
router.post(
  "/createproduct",
  [requireLogin, upload.single("image")],
  (req, res) => {
    const { name, price, description, quantity } = req.body;
    if (!name || !price || !description || !quantity) {
      return res.json({ error: "Add all the fields" });
    }
    if (!req.file) {
      return res.json({ error: "Choose image please" });
    }
    req.user.password = undefined;
    const newproduct = new Products({
      name: name,
      price: price,
      quantity: quantity,
      description: description,
      image: req.file.path,
      productBY: req.user,
    });

    newproduct
      .save()
      .then((savedproduct) => {
        res.json({ status: true, product: savedproduct });
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

module.exports = router;
