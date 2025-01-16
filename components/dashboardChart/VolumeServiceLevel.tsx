// components/VolumeServiceLevel.js
import { DomainType } from "@models/statistic";
import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";

interface Props {
  domainData: DomainType;
}

const VolumeServiceLevel: React.FC<Props> = (props) => {
  const { domainData } = props;

  const data = {
    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: ["Sep", "Oct", "Nov"],
    datasets: [
      {
        label: "Listen",
        data: domainData.podcast,
        backgroundColor: "#0195fe",
        barThickness: 15,
      },
      {
        label: "Survey",
        data: domainData.survey,
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
            text: "Number of Listen and Survey",
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
