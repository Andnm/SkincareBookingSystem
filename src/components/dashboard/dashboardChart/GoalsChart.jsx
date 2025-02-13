// components/GoalsChart.js
import { Bar } from "react-chartjs-2";
import { TbMoneybag } from "react-icons/tb";
import { PiChartLineDuotone } from "react-icons/pi";

const GoalsChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Real revenue", // Actual Revenue
        data: [3000, 4000, 3500, 4500, 5000, 5500, 6000],
        backgroundColor: "#49b58c",
        borderRadius: 4,
      },
      {
        label: "Target", // Target Revenue
        data: [4000, 4500, 5000, 6000, 6500, 7000, 8000],
        backgroundColor: "#fece03",
        borderRadius: 4,
      },
    ],
  };

  const formatPrice = (price) => {
    const numberString = String(price);
    const numberArray = numberString.split("");
    const dotPosition = numberArray.length % 3 || 3;
    for (let i = dotPosition; i < numberArray.length; i += 4) {
      numberArray.splice(i, 0, ".");
    }
    const formattedNumber = numberArray.join("");
    return formattedNumber;
  };

  const lastMonthTotal = data.datasets[0].data.reduce(
    (acc, val) => acc + val,
    0
  );
  const thisMonthTotal = data.datasets[1].data.reduce(
    (acc, val) => acc + val,
    0
  );

  // Custom legend component
  const CustomLegend = () => {
    const legends = [
      {
        icon: <TbMoneybag color="#49b58c" />,
        title: "Real revenue",
        type: "Global",
        text: lastMonthTotal,
        color: "#49b58c",
      },
      {
        icon: <PiChartLineDuotone color="#fece03" />,
        title: "Target revenue",
        type: "Commercial",
        text: thisMonthTotal,
        color: "#fece03",
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: "10px 20px",
        }}
      >
        {legends.map((legend, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span
              style={{
                display: "flex",
                width: 30,
                height: 30,
                backgroundColor: `rgba(${parseInt(
                  legend.color.slice(1, 3),
                  16
                )}, ${parseInt(legend.color.slice(3, 5), 16)}, ${parseInt(
                  legend.color.slice(5, 7),
                  16
                )}, 0.1)`,
                borderRadius: 4,
                marginRight: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {legend.icon}
            </span>
            <div>
              <div style={{ fontWeight: "600", fontSize: 14 }}>
                {legend.title}
              </div>
              <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 10 }}>
                {legend.type}
              </div>
            </div>

            <span
              style={{
                color: legend.color,
                fontSize: 14,
                marginLeft: 12,
                fontWeight: "bold",
              }}
            >
              {formatPrice(legend.text)}$
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Goals and reality",
                color: "#333",
                align: "start",
                font: {
                  size: 20,
                  weight: "bold",
                  family: "Arial",
                },
              },
              legend: {
                display: false, // Hide default legend to use custom legend
              },
            },
            scales: {
              x: {
                display: true,
                ticks: {
                  color: "#999",
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                display: true,
                ticks: {
                  color: "#999",
                  font: {
                    size: 12,
                  },
                },
              },
            },
          }}
        />
      </div>
      <CustomLegend /> {/* Render custom legend below the chart */}
    </>
  );
};

export default GoalsChart;
