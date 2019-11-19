import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Breadcrumbs, Link, Typography } from "@material-ui/core";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import WillCompare from "./WillCompare";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ids_term: ""
    };
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("compare/");
    if (idx !== -1) {
      const ids_term_ = url.substring(idx + 8);
      if (ids_term_.length > 0) {
        const ids = ids_term_.split("+");
        const newData = getHitsFromQuery(
          getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
          JSON.stringify({
            query: {
              ids: {
                values: ids
              }
            }
          })
        );
        const dataFilter = newData.map(will => {
          return {
            will: will._source["will_pages"],
            id: will["_id"],
            name: will._source["testator.name"]
          };
        });

        this.setState({
          data: dataFilter,
          ids_term: ids_term_
        });
      }
    }
  }

  render() {
    const prevLink = document.referrer.includes("search?")
      ? "/search?" + document.referrer.split("?")[1]
      : "/search";

    const will_link =
      this.state.ids_term !== "" ? (
        <Typography color="textPrimary" key={2}>
          {this.state.ids_term}
        </Typography>
      ) : null;

    return (
      <div>
        <div className="wills_menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="search"
                key={0}
                color="inherit"
                component={RouterLink}
                to={prevLink}
              >
                {" "}
                Recherche{" "}
              </Link>
              {will_link}
            </Breadcrumbs>
          </Paper>
        </div>

        <div>
          {this.state.data.length > 0 ? (
            <WillCompare data={this.state.data} />
          ) : (
            <h3>Pas de testaments à comparer</h3>
          )}
        </div>
      </div>
    );
  }
}

export default Compare;
