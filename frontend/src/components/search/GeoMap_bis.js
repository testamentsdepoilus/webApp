import L from "leaflet";
import "leaflet.markercluster";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Checkbox, Grid } from "@material-ui/core";
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
      curData: [],
      checkedA: true,
      checkedB: true
    };
    this.handleCheckA = this.handleCheckA.bind(this);
    this.handleCheckB = this.handleCheckB.bind(this);
    this.blueIcon = L.icon({
      iconUrl:
        "http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-icon-blue.png",
      shadowUrl:
        "http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-shadow.png"
    });
    this.redIcon = L.icon({
      iconUrl:
        "http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-icon-red.png",
      shadowUrl:
        "http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-shadow.png"
    });
  }

  handleCheckA(event) {
    this.setState({
      checkedA: event.target.checked
    });
  }
  handleCheckB(event) {
    this.setState({
      checkedB: event.target.checked
    });
  }

  /*
    addMarkers(){
        var markers = L.markerClusterGroup();
        markers.addLayer(L.marker(getRandomLatLng(map)));
        ... Add more layers ...
        map.addLayer(markers);
    }*/

  static getDerivedStateFromProps(nextProps, prevState) {
    const new_data = nextProps.data.filter(
      (item, i) =>
        nextProps.data
          .map(function(e) {
            return e["testator.name"];
          })
          .indexOf(item["testator.name"]) === i
    );
    if (new_data !== prevState.curData && nextProps.data !== undefined) {
      return {
        curData: new_data
      };
    }
    return null;
  }

  componentDidUpdate() {
    let element = (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item container direction="row">
          <Grid item>
            <img
              alt="blue-icon"
              src="http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-icon-blue.png"
            ></img>
          </Grid>
          <Grid item>
            <span>Lieu de naissance</span>
          </Grid>
          <Grid item>
            <Checkbox
              checked={this.state.checkedA}
              onChange={this.handleCheckA}
              value="checked"
              inputProps={{
                "aria-label": "primary checkbox"
              }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item>
            <img
              alt="red-icon"
              src="http://patrimeph.ensea.fr/testaments-de-poilus/images/marker-icon-red.png"
            ></img>
          </Grid>
          <Grid item>
            <span>Lieu de décès</span>
          </Grid>
          <Grid item></Grid>
          <Checkbox
            checked={this.state.checkedB}
            onChange={this.handleCheckB}
            value="checkedB"
            inputProps={{
              "aria-label": "primary checkbox"
            }}
          />
        </Grid>
      </Grid>
    );

    ReactDOM.render(element, document.getElementById("legend"));

    this.markers.clearLayers();
    this.state.curData.forEach((point, i) => {
      if (
        point["will_contents.birth_place"] !== undefined &&
        this.state.checkedA
      ) {
        let marker = L.marker(point["will_contents.birth_place"], {
          icon: this.blueIcon
        });
        const popupContent = (
          <p>
            <h4>{point["testator.name"]}</h4>
            Né{" "}
            {point["will_contents.birth_date"]
              ? " le " + point["will_contents.birth_date"]
              : ""}
            {point["will_contents.birth_place_norm"]
              ? " à " + point["will_contents.birth_place_norm"]
              : ""}
          </p>
        );
        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
        this.markers.addLayer(marker);
      }
      if (
        point["will_contents.death_place"] !== undefined &&
        this.state.checkedB
      ) {
        let marker = L.marker(point["will_contents.death_place"], {
          icon: this.redIcon
        });
        const popupContent = (
          <p>
            <h4>{point["testator.name"]}</h4>
            Mort pour la France{" "}
            {point["will_contents.death_date"]
              ? "le " + point["will_contents.death_date"]
              : ""}
            {point["will_contents.death_place_norm"]
              ? "à " + point["will_contents.death_place_norm"]
              : ""}
          </p>
        );

        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
        this.markers.addLayer(marker);
      }
    });
    this.map.addLayer(this.markers);
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

    let legend = L.control({ position: "bottomleft" });
    legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "legend");
      div.innerHTML += '<div id="legend"> </div>';
      return div;
    };
    legend.addTo(this.map);

    let markerCG = L.markerClusterGroup();
    this.state.curData.forEach((point, i) => {
      if (point.birth_place !== undefined) {
        let marker = L.marker(point.birth_place, { icon: this.blueIcon });
        const popupContent = (
          <div>
            <p>{point.testator.name}</p>{" "}
            <p>
              Né le {point.birth_date} à {point.birth_place}
            </p>
          </div>
        );
        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
        markerCG.addLayer(marker);
        this.markers.push(marker);
      }
      if (point.death_place !== undefined) {
        let marker = L.marker(point.death_place, { icon: this.redIcon });
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
    return <div className={"map-container"}> </div>;
  }
}
