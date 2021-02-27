const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Carts = mongoose.model("Carts");
const Products = mongoose.model("Products");
const requireLogin = require("../middleware/requireLogin");

router.post("/addtocart", requireLogin, (req, res) => {
  const { productID, quantity } = req.body;
  const q = parseInt(quantity);
  if (!productID || !quantity) {
    return res.json({ error: "Enter the all the fields" });
  }
  var productdetail;
  Products.find({ _id: productID }).then((product) => {
    if (!product) {
      return res.json({ error: "No product with this ID found" });
    }
    Carts.find({ cartUser: req.user._id }).then((cart) => {
      if (cart.length == 0) {
        const newcart = new Carts({
          cartUser: req.user._id,
          items: [
            {
              productID: productID,
              quantity: quantity,
              price: product[0].price,
              total: parseInt(product[0].price * quantity),
            },
          ],
          subtotal: parseInt(product[0].price * quantity),
        });
        newcart
          .save()
          .then((saved) => {
            res.json({ message: saved });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const indexFound = cart[0].items.findIndex(
          (item) => item.productID == productID
        );
        if (indexFound !== -1 && quantity <= 0) {
          cart[0].items.splice(indexFound, 1);
          if (cart[0].items.length == 0) {
            cart[0].subtotal = 0;
          } else {
            cart[0].subtotal = cart[0].items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
          }
        } else if (indexFound !== -1) {
          cart[0].items[indexFound].quantity =
            cart[0].items[indexFound].quantity + parseInt(quantity);
          cart[0].items[indexFound].total =
            cart[0].items[indexFound].quantity * product[0].price;
          cart[0].subtotal = cart[0].items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        } else if (quantity > 0) {
          cart[0].items.push({
            productID: productID,
            quantity: quantity,
            price: product[0].price,
            total: parseInt(product[0].price * quantity),
          });
          cart[0].subtotal = cart[0].items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        } else {
          res.json({ error: "Invalid request" });
        }

        cart[0]
          .save()
          .then((saved) => {
            res.json({ status: true, cart: saved });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  });
});

router.get("/showcart", requireLogin, (req, res) => {
  Carts.find({ cartUser: req.user._id })
    .populate("cartUser", "_id name")
    .populate("items.productID")
    .populate("items.productID.productBY", "_id name email")
    .then((carts) => {
      res.json({ status: true, cart: carts });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
