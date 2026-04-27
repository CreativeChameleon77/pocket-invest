const API_BASE = "https://pocket-invest.onrender.com";
const userId = "user1";

async function load() {
  const res = await fetch(`${API_BASE}/api/portfolio/${userId}`);
  const data = await res.json();

  document.getElementById("balance").innerText =
    "£" + data.balance;

  const portfolioDiv = document.getElementById("portfolio");
  portfolioDiv.innerHTML = "";

  if (Object.keys(data.portfolio).length === 0) {
    portfolioDiv.innerHTML = "<p class='text-gray-500'>No investments yet</p>";
    return;
  }

  for (let asset in data.portfolio) {
    const el = document.createElement("div");
    el.className = "flex justify-between border-b border-gray-800 py-1";
    el.innerHTML = `
      <span>${asset}</span>
      <span>£${data.portfolio[asset]}</span>
    `;
    portfolioDiv.appendChild(el);
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