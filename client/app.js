const API_BASE = "https://pocket-invest.onrender.com";
const userId = "user1";

let chart;

// store fake history locally (simple MVP version)
let history = [100];

function renderChart(balance) {
  history.push(balance);

  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map((_, i) => i),
      datasets: [{
        label: "Portfolio",
        data: history,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false }
      }
    }
  });
}

async function load() {
  const res = await fetch(`${API_BASE}/api/portfolio/${userId}`);
  const data = await res.json();

  document.getElementById("balance").innerText = "£" + data.balance;

  renderChart(data.balance);

  const portfolioDiv = document.getElementById("portfolio");
  portfolioDiv.innerHTML = "";

  const assets = Object.keys(data.portfolio || {});

  if (assets.length === 0) {
    portfolioDiv.innerHTML =
      "<p class='text-gray-500'>No investments yet</p>";
    return;
  }

  assets.forEach(asset => {
    const el = document.createElement("div");
    el.className =
      "flex justify-between border-b border-gray-800 py-1";

    el.innerHTML = `
      <span>${asset}</span>
      <span>£${data.portfolio[asset]}</span>
    `;

    portfolioDiv.appendChild(el);
  });
}

async function invest(asset) {
  await fetch(`${API_BASE}/api/invest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      asset,
      amount: 5
    })
  });

  load();
}

load();