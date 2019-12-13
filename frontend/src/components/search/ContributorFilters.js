import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";

const ContributorFilters = () => (
  <SingleDropdownList
    className="contributors"
    react={{
      and: [
        "texte",
        "cote",
        "date_redaction",
        "date_deces",
        "nom_testateur",
        "institution",
        "collection",
        "lieu",
        "notoriale",
        "profession",
        "unite"
      ]
    }}
    componentId="contributeur"
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
