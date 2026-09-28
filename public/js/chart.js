export function ChartExpense(data) {
  let categoryCounts = data.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});
  let chartLabels = Object.keys(categoryCounts);
  let chartDataValues = Object.values(categoryCounts);
  const ctx = document.getElementById("myChart");
  let existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "# of Votes",
          data: chartDataValues,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
