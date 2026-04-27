const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// fake database
let users = {
  user1: {
    balance: 100,
    portfolio: {}
  }
};

// get user data
app.get("/api/portfolio/:userId", (req, res) => {
  res.json(users[req.params.userId]);
});

// invest
app.post("/api/invest", (req, res) => {
  const { userId, asset, amount } = req.body;

  const user = users[userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.balance < amount) return res.status(400).json({ error: "No funds" });

  user.balance -= amount;
  user.portfolio[asset] = (user.portfolio[asset] || 0) + amount;

  res.json(user);
});

app.get("/", (req, res) => {
  res.send("Pocket Invest API is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
