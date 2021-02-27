const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  cartUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  items: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    default: 0,
  },
});

mongoose.model("Carts", cartSchema);
