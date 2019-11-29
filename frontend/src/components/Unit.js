import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import "../styles/Unit.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import UnitDisplay from "./UnitDisplay";

class Unit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.renderFunc = this.renderFunc.bind(this);
  }

  renderFunc() {
    if (this.state.data.length > 0) {
      return (
        <div className="unit_detail">
          <UnitDisplay
            id={this.state.data[0]["_id"]}
            data={this.state.data[0]._source}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h3>Pas de résultat</h3>
        </div>
      );
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("armee/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 6).split("/");
      const query_id = url_query.length > 0 ? url_query[0] : "";
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_units"),
        JSON.stringify({
          query: {
            term: {
              _id: query_id
            }
          }
        })
      )
        .then(data => {
          this.setState({
            data: data
          });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }

  render() {
    const prevLink = localStorage.uriSearch
      ? "/recherche?" + localStorage.uriSearch.split("?")[1]
      : "/recherche";

    const unit_link =
      this.state.data.length > 0 ? (
        <Typography color="textPrimary" key={2}>
          {this.state.data[0]._source["unit"]}
        </Typography>
      ) : null;

    return (
      <div>
        <div className="unit_menu">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="Breadcrumb"
          >
            <Link
              id="search"
              color="inherit"
              key={0}
              component={RouterLink}
              to={prevLink}
            >
              {localStorage.uriSearch ? "Modifier ma recherche" : "Recheche"}
            </Link>
            {unit_link}
          </Breadcrumbs>
        </div>

        <div>{this.renderFunc()}</div>
      </div>
    );
  }
}

export default Unit;
