import React from "react";
import Barchart from "./barchart";

const ApexBarChartWrapper = (props) => {
  const { dataField, aggregations, chartOptions } = props;
  const keys = [];
  const values = [];
  if (
    aggregations &&
    aggregations[dataField] &&
    aggregations[dataField].buckets
  ) {
    aggregations[dataField].buckets.forEach(({ key: itemKey, doc_count }) => {
      keys.push(itemKey.split("(")[0].trim());
      values.push(doc_count);
    });
  }

  return (
    <Barchart labels={keys} barData={values} chartOptions={chartOptions} />
  );
};

export default ApexBarChartWrapper;
