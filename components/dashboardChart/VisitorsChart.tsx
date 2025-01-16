import { DomainType } from "@models/statistic";
import { Line } from "react-chartjs-2";

interface Props {
  domainData: DomainType;
}

const VisitorsChart: React.FC<Props> = (props) => {
  const { domainData } = props;

  const data = {
    // labels: [
    //   "Jan",
    //   "Feb",
    //   "Mar",
    //   "Apr",
    //   "May",
    //   "Jun",
    //   "Jul",
    //   "Aug",
    //   "Sep",
    //   "Oct",
    //   "Nov",
    //   "Dec",
    // ],
    labels: ["Sep", "Oct", "Nov"],
    datasets: [
      {
        label: "Visiter",
        data: domainData.visit,
        borderColor: "#b233f5",
        backgroundColor: "#b233f5",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#b233f5",
        pointRadius: 0,
      },
      // {
      //   label: "New Customers",
      //   data: domainData.visit,
      //   borderColor: "#ed6a69",
      //   backgroundColor: "#ed6a69",
      //   fill: false,
      //   tension: 0.4,
      //   pointBackgroundColor: "#ed6a69",
      //   pointRadius: 0,
      // },
      // {
      //   label: "Unique Customers",
      //   data: [100, 170, 250, 350, 150, 270, 370, 100, 170, 250, 350, 150],
      //   borderColor: "#4cd660",
      //   backgroundColor: "#4cd660",
      //   fill: false,
      //   tension: 0.4,
      //   pointBackgroundColor: "#4cd660",
      //   pointRadius: 0,
      // },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Lượt ghé thăm",
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
              boxWidth: 12,
              padding: 15,
              generateLabels: (chart: any) => {
                const originalLabels = chart.data.datasets.map((dataset, i) => {
                  return {
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 2,
                    hidden: !chart.isDatasetVisible(i),
                    datasetIndex: i,
                  };
                });

                return originalLabels;
              },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (tooltipItems) => `Month: ${tooltipItems[0].label}`,
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.dataset.label || "";
                const value = tooltipItem.raw;
                return `${datasetLabel}: ${value}`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
        },
      }}
    />
  );
};

export default VisitorsChart;
