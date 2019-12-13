import React from "react";
import { SingleList } from "@appbaseio/reactivesearch";

const CollectionFilter = () => (
  <SingleList
    react={{
      and: [
        "texte",
        "cote",
        "nom_testateur",
        "date",
        "contributeur",
        "institution",
        "lieu_redaction",
        "lieu_naissance",
        "lieu_deces",
        "notoriale",
        "profession",
        "unite"
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
