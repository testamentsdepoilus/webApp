import React from "react";
import Donutchart from "./donutchart";

const ApexDonutChartWrapper = (props) => {
  const { dataField, aggregations } = props;
  const keys = [];
  const values = [];
  if (
    aggregations &&
    aggregations[dataField] &&
    aggregations[dataField].buckets
  ) {
    aggregations[dataField].buckets.forEach(({ key: itemKey, doc_count }) => {
      keys.push(itemKey);
      values.push(doc_count);
    });
  }
  return <Donutchart labels={keys} donutData={values} />;
};

export default ApexDonutChartWrapper;
