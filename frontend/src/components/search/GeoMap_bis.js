import L from "leaflet";
import "leaflet.markercluster";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Checkbox, Grid, Link } from "@material-ui/core";
import { getParamConfig } from "../../utils/functions";
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
      birth_data: [],
      death_data: [],
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
    if (Boolean(nextProps.birth_data) && Boolean(nextProps.death_data)) {
      return {
        birth_data: nextProps.birth_data,
        death_data: nextProps.death_data
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
    Object.values(this.state.birth_data).forEach((point, i) => {
      if (
        Boolean(point[0]["will_contents.birth_place"]) &&
        this.state.checkedA
      ) {
        let marker = L.marker(point[0]["will_contents.birth_place"], {
          icon: this.blueIcon
        });
        let contents = [];

        contents.push(<h4>{point[0]["will_contents.birth_place_norm"]}</h4>);
        if (point.length === 1) {
          contents.push(<h4>Lieu de naissance du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(<h4>Lieu de naissance des testateurs suivants :</h4>);
        }
        let myList = [];
        point.forEach(item => {
          myList.push(
            <li>
              <Link
                href={
                  getParamConfig("web_url") +
                  "/testateur/" +
                  item["testator.ref"]
                }
                target="_blank"
              >
                {item["testator.name"]}
              </Link>
            </li>
          );
        });
        if (myList.length > 0) {
          contents.push(<ul>{myList}</ul>);
        }

        const popupContent = <div className="map-popup">{contents}</div>;
        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
        this.markers.addLayer(marker);
      }
    });
    Object.values(this.state.death_data).forEach((point, i) => {
      if (
        Boolean(point[0]["will_contents.death_place"]) &&
        this.state.checkedB
      ) {
        let marker = L.marker(point[0]["will_contents.death_place"], {
          icon: this.redIcon
        });
        let contents = [];

        contents.push(<h4>{point[0]["will_contents.death_place_norm"]}</h4>);
        if (point.length === 1) {
          contents.push(<h4>Lieu de décès du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(<h4>Lieu de décès des testateurs suivants :</h4>);
        }
        let myList = [];
        point.forEach(item => {
          myList.push(
            <li>
              <Link
                href={
                  getParamConfig("web_url") +
                  "/testateur/" +
                  item["testator.ref"]
                }
                target="_blank"
              >
                {item["testator.name"]}
              </Link>
            </li>
          );
        });
        if (myList.length > 0) {
          contents.push(<ul>{myList}</ul>);
        }

        const popupContent = <div className="map-popup">{contents}</div>;
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

    Object.values(this.state.birth_data).forEach((point, i) => {
      if (
        Boolean(point[0]["will_contents.birth_place"]) &&
        this.state.checkedA
      ) {
        let marker = L.marker(point[0]["will_contents.birth_place"], {
          icon: this.blueIcon
        });
        let contents = [];

        contents.push(<h4>{point[0]["will_contents.birth_place_norm"]}</h4>);
        if (point.length === 1) {
          contents.push(<h4>Lieu de naissance du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(<h4>Lieu de naissance des testateurs suivants :</h4>);
        }

        let myList = [];
        point.forEach(item => {
          myList.push(<li>{item["testator.name"]}</li>);
        });
        if (myList.length > 1) {
          contents.push(<ul>{myList}</ul>);
        }

        const popupContent = <div className="map-popup">{contents}</div>;
        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));

        this.markers.push(marker);
      }
    });
    Object.values(this.state.death_data).forEach((point, i) => {
      if (
        Boolean(point[0]["will_contents.death_place"]) &&
        this.state.checkedB
      ) {
        let marker = L.marker(point[0]["will_contents.death_place"], {
          icon: this.redIcon
        });
        let contents = [];

        contents.push(<h4>{point[0]["will_contents.death_place_norm"]}</h4>);
        if (point.length === 1) {
          contents.push(<h4>Lieu de décès du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(<h4>Lieu de décès des testateurs suivants :</h4>);
        }
        let myList = [];
        point.forEach(item => {
          myList.push(
            <li>
              <Link
                href={
                  getParamConfig("web_url") +
                  "/testateur/" +
                  item["testator.ref"]
                }
                target="_blank"
              >
                {item["testator.name"]}
              </Link>
            </li>
          );
        });
        if (myList.length > 0) {
          contents.push(<ul>{myList}</ul>);
        }

        const popupContent = <div className="map-popup">{contents}</div>;
        marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
        this.markers.addLayer(marker);
      }
    });
    this.map.addLayer(this.markers);
  }
  componentWillUnmount() {
    if (!this.map) return;
    this.map = null;
  }
  render() {
    return <div className={"map-container"}> </div>;
  }
}
