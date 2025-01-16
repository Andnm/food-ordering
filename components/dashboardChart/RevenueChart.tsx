// components/RevenueChart.js
import { RevenueWeekType } from "@models/statistic";
import { Bar } from "react-chartjs-2";

interface Props {
  revenueCurrentWeek: RevenueWeekType;
}

const RevenueChart: React.FC<Props> = (props) => {
  const {revenueCurrentWeek} = props
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Khoá học",
        data: revenueCurrentWeek.dayOfWeekRevenuePayProduct,
        backgroundColor: "#0096fe",
        maxBarThickness: 15,
        borderRadius: 4,
      },
      {
        label: "Đặt lịch",
        data: revenueCurrentWeek.dayOfWeekRevenuePaySchedule,
        backgroundColor: "#00e097",
        maxBarThickness: 15,
        borderRadius: 4,
      },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Doanh thu trong tuần",
            color: "#333", // Title color
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
              color: "#444", // Legend text color
              font: {
                size: 12,
              },
              boxWidth: 20,
              usePointStyle: true,
            },
          },
        },
      }}
    />
  );
};

export default RevenueChart;
