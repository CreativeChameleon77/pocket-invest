const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://ukidcqindhdxefcjbsfu.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraWRjcWluZGhkeGVmY2pic2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExMDQsImV4cCI6MjA5Mjg3NzEwNH0.tEZis_cv-4OJNwmxgc378bjQvIjGhXg-yPLsnTu4B6I"
);
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
app.get("/api/portfolio/:userId", async (req, res) => {
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", req.params.userId)
    .single();

  if (error) return res.status(500).json(error);

  res.json({
    balance: data.balance,
    portfolio: data.data
  });
});

// invest
app.post("/api/invest", async (req, res) => {
  const { userId, asset, amount } = req.body;

  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", userId)
    .single();

  let portfolio = data.data || {};

  portfolio[asset] = (portfolio[asset] || 0) + amount;

  await supabase
    .from("portfolios")
    .update({
      balance: data.balance - amount,
      data: portfolio
    })
    .eq("id", userId);

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Pocket Invest API is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

