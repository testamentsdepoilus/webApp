import React from "react";
import Chart from "react-apexcharts";

const Linechart = (props) => {
  const { lineData, labels, chartOptions } = props;
  return (
    <Chart
      type="line"
      series={[
        {
          name: "Nombre de Poilus",
          data: lineData,
        },
      ]}
      options={{
        chart: {
          height: "auto",
          type: "line",
        },

        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
          width: 2,
        },

        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          labels: {
            rotate: -60,
            maxHeight: 200,
            style: {
              fontSize: "8px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
          categories: labels,
          tickPlacement: "between",
        },
        yaxis: {
          title: {
            text: "Nombre de Poilus",
          },
        },
        title: {
          text: chartOptions.title,
          align: "left",
        },
      }}
    />
  );
};

export default Linechart;
