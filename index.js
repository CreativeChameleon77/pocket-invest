const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// =======================
// SUPABASE SETUP
// =======================

const supabase = createClient(
  "https://ukidcqindhdxefcjbsfu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraWRjcWluZGhkeGVmY2pic2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExMDQsImV4cCI6MjA5Mjg3NzEwNH0.tEZis_cv-4OJNwmxgc378bjQvIjGhXg-yPLsnTu4B6I"
);

// =======================
// HEALTH CHECK
// =======================

app.get("/", (req, res) => {
  res.send("Pocket Invest API is running 🚀");
});

// =======================
// GET PORTFOLIO
// =======================

app.get("/api/portfolio/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", req.params.userId)
      .single();

    if (error || !data) {
      return res.json({
        balance: 100,
        portfolio: {}
      });
    }

    res.json({
      balance: data.balance ?? 100,
      portfolio: data.data ?? {}
    });

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// INVEST ROUTE
// =======================

app.post("/api/invest", async (req, res) => {
  try {
    const { userId, asset, amount } = req.body;

    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(500).json({ error: "User not found" });
    }

    let portfolio = data.data || {};
    let newBalance = data.balance - amount;

    portfolio[asset] = (portfolio[asset] || 0) + amount;

    const { error: updateError } = await supabase
      .from("portfolios")
      .update({
        balance: newBalance,
        data: portfolio
      })
      .eq("id", userId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({
      success: true,
      balance: newBalance,
      portfolio
    });

  } catch (err) {
    console.error("INVEST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});