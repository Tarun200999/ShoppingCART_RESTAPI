const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config/key");
const PORT = process.env.PORT || 3000;
//DATABSE CONNECTION
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("database is connected succesfully");
});
mongoose.connection.on("error", (err) => {
  console.log("error while connecting", err);
});

//DATABASE CONNECTION END
require("./modals/user"); //user modal is registered
require("./modals/product");
require("./modals/cart");
app.use(express.json());
app.use(express.static("uploads"));
app.use(require("./routes/auth"));
app.use(require("./routes/product"));
app.use(require("./routes/cart"));

app.listen(PORT, () => {
  console.log(`Server is runnning  at localhost:${PORT}`);
});
