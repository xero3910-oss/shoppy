const express = require("express");
const cors = require("cors");
const path = require("path");

// LOWDB v1 (correct version)
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// DATABASE
const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ users: [], orders: [] }).write();

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const exists = db.get("users").find({ email }).value();

  if (exists) {
    return res.send("User already exists");
  }

  db.get("users")
    .push({ name, email, password })
    .write();

  res.send("Signup successful");
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db
    .get("users")
    .find({ email, password })
    .value();

  if (!user) {
    return res.send("Invalid credentials");
  }

  res.json({ message: "Login successful", user });
});

// SAVE ORDER
app.post("/order", (req, res) => {
  const { userEmail, items } = req.body;

  const newOrder = {
    id: Date.now(),
    userEmail,
    items,
    status: "Processing"
  };

  db.get("orders").push(newOrder).write();

  res.send("Order saved");
});

// GET USER ORDERS
app.get("/orders/:email", (req, res) => {
  const email = req.params.email;

  const orders = db
    .get("orders")
    .filter({ userEmail: email })
    .value();

  res.json(orders);
});

// START SERVER
app.listen(3000, () => {
  console.log("SHOPPY REAL backend running 🚀");
});
