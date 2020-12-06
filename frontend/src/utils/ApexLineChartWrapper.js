import React from "react";
import Linechart from "./linechart";

const ApexLineChartWrapper = (props) => {
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
    <Linechart labels={keys} lineData={values} chartOptions={chartOptions} />
  );
};

export default ApexLineChartWrapper;
