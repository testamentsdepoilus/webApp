import React from "react";
import { SingleList } from "@appbaseio/reactivesearch";

const CollectionFilter = () => (
  <SingleList
    react={{
      and: [
        "mainSearch",
        "cote",
        "testatorSearch",
        "date",
        "contributors",
        "institution",
        "will_place",
        "birth_place",
        "death_place",
        "provenance",
        "occupation",
        "affiliation"
      ]
    }}
    componentId="collection"
    dataField="will_identifier.collection.keyword"
    title="Notaire"
    sortBy="count"
    URLParams
    showCount={true}
    showSearch={false}
    filterLabel="collection"
  />
);

export default CollectionFilter;
