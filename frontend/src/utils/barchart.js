import React from "react";
import Chart from "react-apexcharts";

const Barchart = (props) => {
  const { barData, labels, chartOptions } = props;
  return (
    <Chart
      type="bar"
      series={[
        {
          name: "Nombre de Poilus",
          data: barData,
        },
      ]}
      options={{
        chart: {
          height: "auto",
          type: "bar",
          zoom: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: 2,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
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
        },
        yaxis: {
          title: {
            text: "Nombre de Poilus",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100],
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

export default Barchart;
