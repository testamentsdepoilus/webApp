import React from "react";
import { DateRange } from "@appbaseio/reactivesearch";

const DateFilter = () => (
  <DateRange
    componentId="date"
    dataField="will_contents.will_date"
    title="Date de rédaction"
    placeholder={{
      start: "Début ",
      end: "Fin"
    }}
    queryFormat="date"
    URLParams
    initialMonth={new Date("1914-07-01")}
  />
);

export default DateFilter;
