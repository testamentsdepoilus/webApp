import L from "leaflet";
import "leaflet.markercluster";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Checkbox, Grid, Link } from "@material-ui/core";
import { getParamConfig } from "../../utils/functions";

export default class GeoMap extends React.Component {
  map = null;
  markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      var childCount = cluster.getChildCount();

      return new L.DivIcon({
        html: "<div><span>" + childCount + "</span></div>",
        className: "marker-cluster marker-mycluster",
        iconSize: new L.Point(40, 40)
      });
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      birth_data: [],
      death_data: [],
      checkedA: false,
      checkedB: true,
      count: 0
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
      checkedA: event.target.checked,
      count: 0
    });
  }
  handleCheckB(event) {
    this.setState({
      checkedB: event.target.checked,
      count: 0
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.birth_data) !==
        JSON.stringify(prevState.birth_data) ||
      JSON.stringify(nextProps.death_data) !==
        JSON.stringify(prevState.death_data)
    ) {
      return {
        birth_data: nextProps.birth_data,
        death_data: nextProps.death_data,
        count: 0
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.state.count === 0) {
      let element = (
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item container direction="row" alignItems="center">
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
          <Grid item container direction="row" alignItems="center">
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
          let marker = L.marker(point[0]["will_contents.birth_place"]);
          let contents = [];

          contents.push(
            <Link
              key={0}
              href={
                getParamConfig("web_url") +
                "/place/" +
                point[0]["will_contents.birth_place_ref"]
              }
              target="_blank"
            >
              <h4>{point[0]["will_contents.birth_place_norm"]}</h4>
            </Link>
          );
          if (point.length === 1) {
            contents.push(
              <h4 key={1}>Lieu de naissance du testateur suivant :</h4>
            );
          } else if (point.length > 1) {
            contents.push(
              <h4 key={1}>Lieu de naissance des testateurs suivants :</h4>
            );
          }
          let myList = [];
          point.forEach((item, i) => {
            myList.push(
              <li key={i}>
                <Link
                  href={
                    getParamConfig("web_url") +
                    "/testateur/" +
                    item["testator.ref"]
                  }
                  target="_blank"
                >
                  {item["testator.forename"]}{" "}
                  <span style={{ fontVariantCaps: "small-caps" }}>
                    {item["testator.surname"]}
                  </span>
                </Link>
              </li>
            );
          });
          if (myList.length > 0) {
            contents.push(<ul key={i * 10}>{myList}</ul>);
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
          let marker = L.marker(point[0]["will_contents.death_place"]);
          let contents = [];

          contents.push(
            <Link
              key={0}
              href={
                getParamConfig("web_url") +
                "/place/" +
                point[0]["will_contents.death_place_ref"]
              }
              target="_blank"
            >
              <h4>{point[0]["will_contents.death_place_norm"]}</h4>
            </Link>
          );
          if (point.length === 1) {
            contents.push(
              <h4 key={1}>Lieu de décès du testateur suivant :</h4>
            );
          } else if (point.length > 1) {
            contents.push(
              <h4 key={1}>Lieu de décès des testateurs suivants :</h4>
            );
          }
          let myList = [];
          point.forEach((item, i) => {
            myList.push(
              <li key={i}>
                <Link
                  href={
                    getParamConfig("web_url") +
                    "/testateur/" +
                    item["testator.ref"]
                  }
                  target="_blank"
                >
                  {item["testator.forename"]}{" "}
                  <span style={{ fontVariantCaps: "small-caps" }}>
                    {item["testator.surname"]}
                  </span>
                </Link>
              </li>
            );
          });
          if (myList.length > 0) {
            contents.push(<ul key={i * 10}>{myList}</ul>);
          }

          const popupContent = <div className="map-popup">{contents}</div>;
          marker.bindPopup(ReactDOMServer.renderToStaticMarkup(popupContent));
          this.markers.addLayer(marker);
        }
      });

      this.map.addLayer(this.markers);
      this.setState({
        count: this.state.count + 1
      });
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
        let marker = L.marker(point[0]["will_contents.birth_place"]);
        let contents = [];

        contents.push(
          <Link
            href={
              getParamConfig("web_url") +
              "/place/" +
              point[0]["will_contents.birth_place_ref"]
            }
            target="_blank"
          >
            <h4>{point[0]["will_contents.birth_place_norm"]}</h4>
          </Link>
        );
        if (point.length === 1) {
          contents.push(<h4>Lieu de naissance du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(<h4>Lieu de naissance des testateurs suivants :</h4>);
        }

        let myList = [];
        point.forEach(item => {
          myList.push(
            <li>
              {item["testator.forename"]}{" "}
              <span style={{ fontVariantCaps: "small-caps" }}>
                {item["testator.surname"]}
              </span>
            </li>
          );
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
        let marker = L.marker(point[0]["will_contents.death_place"]);
        let contents = [];

        contents.push(
          <Link
            key={i}
            href={
              getParamConfig("web_url") +
              "/place/" +
              point[0]["will_contents.death_place_ref"]
            }
            target="_blank"
          >
            <h4>{point[0]["will_contents.death_place_norm"]}</h4>
          </Link>
        );
        if (point.length === 1) {
          contents.push(<h4 key={i}>Lieu de décès du testateur suivant :</h4>);
        } else if (point.length > 1) {
          contents.push(
            <h4 key={i}>Lieu de décès des testateurs suivants :</h4>
          );
        }
        let myList = [];
        point.forEach((item, j) => {
          myList.push(
            <li key={j}>
              <Link
                href={
                  getParamConfig("web_url") +
                  "/testateur/" +
                  item["testator.ref"]
                }
                target="_blank"
              >
                {item["testator.forename"]}{" "}
                <span style={{ fontVariantCaps: "small-caps" }}>
                  {item["testator.surname"]}
                </span>
              </Link>
            </li>
          );
        });
        if (myList.length > 0) {
          contents.push(<ul key={i}>{myList}</ul>);
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
    return <div id="map-container" className={"map-container"}></div>;
  }
}
