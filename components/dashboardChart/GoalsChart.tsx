// components/GoalsChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { TbMoneybag } from "react-icons/tb";
import { PiChartLineDuotone } from "react-icons/pi";
import { formatNumberWithCommas } from "@utils/helpers";

interface Props {
  revenueMonthly: number[];
}

const GoalsChart: React.FC<Props> = (props) => {
  const { revenueMonthly } = props;

  const targetMultiplier = 1.2;

  const targetMonthly = revenueMonthly.map((revenue) => Math.round(revenue * targetMultiplier));

  const data = {
    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: ["Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Doanh thu thực",
        data: revenueMonthly,
        backgroundColor: "#49b58c",
        borderRadius: 4,
      },
      {
        label: "Mục tiêu",
        data: targetMonthly,
        backgroundColor: "#fece03",
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

  const CustomLegend = () => {
    const legends = [
      {
        icon: <TbMoneybag color="#49b58c" />,
        title: "Doanh thu thực",
        type: "Global",
        text: lastMonthTotal,
        color: "#49b58c",
      },
      {
        icon: <PiChartLineDuotone color="#fece03" />,
        title: "Mục tiêu",
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
              {formatNumberWithCommas(legend.text)} VNĐ
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
                text: "Mục tiêu và thực tế",
                color: "#333",
                align: "start",
                font: {
                  size: 20,
                  weight: "bold",
                  family: "Arial",
                },
              },
              legend: {
                display: false, 
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
      <CustomLegend /> 
    </>
  );
};

export default GoalsChart;
