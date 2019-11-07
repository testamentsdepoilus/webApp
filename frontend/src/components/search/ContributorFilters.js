import React from "react";
import { MultiList } from "@appbaseio/reactivesearch";

const ContributorFilters = () => (
  <MultiList
    react={{
      and: ["mainSearch", "cote", "testatorSearch", "date", "ProvenanceTag"]
    }}
    componentId="contributors"
    dataField="contributions.persName.keyword"
    nestedField="contributions"
    title="Contributeurs"
    sortBy="count"
    queryFormat="and"
    URLParams
    showCheckbox={false}
    showSearch={true}
    className="contributors"
    innerClass={{
      list: "list"
    }}
    placeholder="Nom du contributeur"
    filterLabel="contributeurs"
  />
);

export default ContributorFilters;
