import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";

const VolumeServiceLevel = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Volume",
        data: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
        backgroundColor: "#0195fe",
        barThickness: 15,
      },
      {
        label: "Services",
        data: [600, 700, 800, 900, 1000, 1100, 1200],
        backgroundColor: "#03de97",
        barThickness: 15,
        borderRadius: 4,
      },
    ],
  };

  const lastMonthTotal = data.datasets[0].data.reduce(
    (acc, val) => acc + val,
    0
  );
  const thisMonthTotal = data.datasets[1].data.reduce(
    (acc, val) => acc + val,
    0
  );

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Volume vs Services Level",
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
                  const total = label.text.includes(data.datasets[0].label)
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
            stacked: true,
            display: false,
          },
          y: {
            stacked: true,
            display: false,
          },
        },
      }}
    />
  );
};

export default VolumeServiceLevel;
