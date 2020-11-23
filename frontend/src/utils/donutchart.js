import React from "react";
import Chart from "react-apexcharts";

const Donutchart = (props) => {
  const { donutData, id, labels, chartOptions } = props;
  return (
    <Chart
      options={{
        chart: {
          id,
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "left",
          floating: false,
          fontSize: "14px",
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                width: "100%",
                height: 250,
              },
              legend: {
                show: true,
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        labels,
        ...chartOptions,
      }}
      height={400}
      series={donutData}
      type="donut"
    />
  );
};

export default Donutchart;
