import L from "leaflet";
import "leaflet.markercluster";
import React from "react";
import ReactDOM from "react-dom";

//import { OpenStreetMapProvider } from "leaflet-geosearch";

/*
// setup
const provider = new OpenStreetMapProvider();

// search
const results = provider.search({ query: "bordeaux" });
let suggestions = [];
results.then(function(result) {
  result.forEach(adress => {
    suggestions.push(adress["label"]);
  });
});*/

export default class GeoMap extends React.Component {
  map = null;
  markers = L.markerClusterGroup();
  constructor(props) {
    super(props);
    this.state = {
      curData: []
    };
  }

  /*
    addMarkers(){
        var markers = L.markerClusterGroup();
        markers.addLayer(L.marker(getRandomLatLng(map)));
        ... Add more layers ...
        map.addLayer(markers);
    }*/

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.curData && nextProps.data !== undefined) {
      return {
        curData: nextProps.data
      };
    }
    return null;
  }

  componentDidUpdate() {
    this.markers.clearLayers();
    this.state.curData.forEach((point, i) => {
      if (point["will_contents.will_place"] !== undefined) {
        let marker = L.marker(point["will_contents.will_place"]);
        marker.bindPopup(point["will_identifier.name"]);
        this.markers.addLayer(marker);
      }
    });
    this.map.addLayer(this.markers);
  }
  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this)).setView(
      [47.0780911, 2.3631982],
      5
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    }).addTo(this.map);
    let markerCG = L.markerClusterGroup();
    this.state.curData.forEach((point, i) => {
      if (point.will_place !== undefined) {
        let marker = L.marker(point.will_place);
        marker.bindPopup(point.will_name);
        markerCG.addLayer(marker);
        this.markers.push(marker);
      }
    });
    this.map.addLayer(markerCG);
  }
  componentWillUnmount() {
    if (!this.map) return;
    this.map = null;
  }
  render() {
    return <div className={"map-container"} />;
  }
}
