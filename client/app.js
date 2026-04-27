const API_BASE = "https://pocket-invest.onrender.com/";

const userId = "user1";

async function load() {
  const res = await fetch(`${API_BASE}/api/portfolio/${userId}`);
  const data = await res.json();

  document.getElementById("balance").innerText =
    "Balance: £" + data.balance;

  const portfolioDiv = document.getElementById("portfolio");
  portfolioDiv.innerHTML = "";

  for (let asset in data.portfolio) {
    const p = document.createElement("p");
    p.innerText = `${asset}: £${data.portfolio[asset]}`;
    portfolioDiv.appendChild(p);
  }
}

async function invest(asset) {
  await fetch(`${API_BASE}/api/invest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      asset,
      amount: 5
    })
  });

  load();
}

load();
