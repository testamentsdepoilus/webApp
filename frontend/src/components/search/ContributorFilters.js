import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";

const ContributorFilters = () => (
  <SingleDropdownList
    className="contributors"
    react={{
      and: [
        "mainSearch",
        "cote",
        "date",
        "testatorSearch",
        "institution",
        "collection",
        "will_place",
        "birth_place",
        "death_place",
        "provenance",
        "occupation",
        "affiliation"
      ]
    }}
    componentId="contributors"
    nestedField="contributions"
    dataField="contributions.persName.keyword"
    size={1000}
    showCount={true}
    autosuggest={true}
    placeholder="Nom du contributeur"
    URLParams={true}
    loader="En chargement ..."
    showSearch={true}
    searchPlaceholder="Taper le nom ici"
    innerClass={{
      list: "list"
    }}
  />
);

export default ContributorFilters;
