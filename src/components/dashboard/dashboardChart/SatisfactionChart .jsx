// components/SatisfactionChart.js
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";

const SatisfactionChart = () => {
  const data = {
    labels: ["1", "8", "15", "22", "29", "30", "31"], // Updated labels to represent specific dates in a month
    datasets: [
      {
        label: "Last Month",
        data: [3, 4, 3.5, 4.5, 5, 4, 4.2],
        borderColor: "#1499f7",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#1499f7",
        pointRadius: 5,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "#1499f7";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(20, 153, 247, 0.4)");
          gradient.addColorStop(1, "rgba(20, 153, 247, 0)");
          return gradient;
        },
      },
      {
        label: "This Month",
        data: [3.5, 4.5, 4, 5, 4.5, 5, 4.8],
        borderColor: "#0adf97",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#0adf97",
        pointRadius: 5,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "#0adf97";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(10, 223, 151, 0.4)");
          gradient.addColorStop(1, "rgba(10, 223, 151, 0)");
          return gradient;
        },
      },
    ],
  };

  // Calculate total values for each dataset
  const lastMonthTotal = data.datasets[0].data.reduce(
    (acc, val) => acc + val,
    0
  );
  const thisMonthTotal = data.datasets[1].data.reduce(
    (acc, val) => acc + val,
    0
  );

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Satisfaction level",
            color: "#333",
            align: "start",
            font: {
              size: 20,
              weight: "bold",
              family: "Arial",
            },
          },
          legend: {
            position: "bottom",
            labels: {
              color: "#444",
              font: {
                size: 12,
              },
              boxWidth: 20,
              usePointStyle: true,
              generateLabels: (chart) => {
                const originalLabels =
                  Chart.defaults.plugins.legend.labels.generateLabels(chart);
                return originalLabels.map((label) => {
                  const total = label.text.includes("Last Month")
                    ? lastMonthTotal
                    : thisMonthTotal;
                  return {
                    ...label,
                    text: `${label.text} (${total})`, // Append total value
                  };
                });
              },
            },
          },
        },
        scales: {
          x: {
            display: false, // Hide x-axis labels
          },
          y: {
            display: false,
            // min: Math.max(
            //   Math.min(...data.datasets[0].data, ...data.datasets[1].data) - 1,
            //   0
            // ), // Set minimum value based on data
          },
        },
      }}
    />
  );
};

export default SatisfactionChart;
