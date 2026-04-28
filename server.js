

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));


// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.send("User already exists");

  await User.create({ name, email, password });

  res.send("Signup successful");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) return res.send("Invalid credentials");

  res.send("Login successful");
});

// SAVE ORDER
app.post("/order", async (req, res) => {
  const items = req.body.items;

  for (let item of items) {
    await Order.create({
      name: item.name,
      price: item.price,
      status: "Processing"
    });
  }

  res.send("Order saved");
});

// GET ORDERS
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
