import L from "leaflet";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

export default class GeoMap extends React.Component {
  map = null;
  markers = L.markerClusterGroup();
  constructor(props) {
    super(props);
    this.state = {
      curData: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.data["city"] !== prevState.curData["city"] &&
      nextProps.data !== undefined
    ) {
      return {
        curData: nextProps.data
      };
    }
    return null;
  }

  componentDidUpdate() {
    this.markers.clearLayers();
    if (
      this.state.curData !== undefined &&
      Boolean(this.state.curData["geo"])
    ) {
      let marker = L.marker(this.state.curData["geo"]);
      const popupContent = (
        <div>
          <p>
            {this.state.curData["city"]} - ({this.state.curData["country"]})
          </p>
        </div>
      );
      marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));

      this.markers.addLayer(marker);
      this.map.addLayer(this.markers);
      this.map.setView(this.state.curData["geo"], 4);
    }
  }

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this)).setView(
      [45.0780911, 2.3631982],
      4
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    }).addTo(this.map);

    if (
      this.state.curData !== undefined &&
      Boolean(this.state.curData["geo"])
    ) {
      let marker = L.marker(this.state.curData["geo"]);
      const popupContent = (
        <div>
          <p>
            {this.state.curData["city"]} - ({this.state.curData["country"]})
          </p>
        </div>
      );
      marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));

      this.markers.addLayer(marker);
      this.map.addLayer(this.markers);
    }
  }
  componentWillUnmount() {
    if (!this.map) return;
    this.map = null;
  }
  render() {
    return <div className={"map-container"}> </div>;
  }
}
