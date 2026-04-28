const API_BASE = "https://pocket-invest.onrender.com";
const userId = "user1";

let chart;

// store fake history locally (simple MVP version)
let chart;

function renderChart(balance) {
  const canvas = document.getElementById("chart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Start", "Now"],
      datasets: [{
        data: [100, balance],
        borderWidth: 2
      }]
    }
  });
}
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

window.load = async function () {
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

window.invest = async function (asset) {
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