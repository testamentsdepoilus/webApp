import React from "react";
import { SingleList } from "@appbaseio/reactivesearch";

const InstitutionFilters = () => (
  <SingleList
    react={{
      and: ["mainSearch", "cote", "testatorSearch", "date", "ProvenanceTag"]
    }}
    componentId="institution"
    dataField="will_identifier.institution.keyword"
    title="Institution"
    sortBy="count"
    URLParams
    showCount={true}
    showSearch={false}
    className="contributors"
    filterLabel="Institution"
  />
);

export default InstitutionFilters;
