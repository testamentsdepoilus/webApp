import React from "react";
import { ReactiveOpenStreetMap } from "@appbaseio/reactivemaps";

let onPopoverClick = function(item) {
  return <div>{item.will_name}</div>;
};

const GeoMap = () => (
  <ReactiveOpenStreetMap
    componentId="geoMap"
    dataField="will_place"
    title="Carte des testaments"
    size={100}
    defaultZoom={5}
    autoCenter
    style={{ height: "400px" }}
    onPopoverClick={onPopoverClick}
    stream={true}
    // 'react' defines when and how the map component should update
    react={{
      and: ["mainSearch", "contributors", "date"]
    }}
    showMarkers={true}
  />
);

export default GeoMap;
