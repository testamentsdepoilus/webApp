import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Grid, Tooltip, Button } from "@material-ui/core";
import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import WillCompare from "./WillCompare";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ids_term: "",
    };
  }
  handleBackUp(e) {
    document.location.href = document.referrer;
  }
  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("compare/");
    if (idx !== -1) {
      const ids_term_ = url.substring(idx + 8);
      if (ids_term_.length > 0) {
        const ids = ids_term_.split("+");
        getHitsFromQuery(
          getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
          JSON.stringify({
            query: {
              ids: {
                values: ids,
              },
            },
          })
        )
          .then((data) => {
            const dataFilter = data.map((will) => {
              return {
                will: will._source["will_pages"],
                id: will["_id"],
                forename: will._source["testator.forename"],
                surname: will._source["testator.surname"],
              };
            });

            this.setState({
              data: dataFilter,
              ids_term: ids_term_,
            });
          })
          .catch((error) => {
            console.log("error :", error);
          });
      }
    }
  }

  render() {
    return (
      <div className="compare">
        <Breadcrumbs
          separator={<i className="fas fa-caret-right"></i>}
          aria-label="Breadcrumb"
          className="breadcrumbs"
        >
          <Link
            id="home"
            key={0}
            color="inherit"
            component={RouterLink}
            to="/accueil"
          >
            Accueil
          </Link>
          <div>Comparer</div>
        </Breadcrumbs>

        <h1 className="heading">
          <i className="remove fas fa-random"></i> Comparaison des testaments
        </h1>

        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            {document.referrer.length > 0 &&
            document.referrer !== document.location.href ? (
              <Tooltip title="Revenir à la recherche">
                <Button
                  className="button outlined secondary-light"
                  id="btnBack"
                  onClick={this.handleBackUp}
                  aria-label="back up"
                >
                  <i className="fas fa-undo-alt"></i> Revenir à la recherche
                </Button>
              </Tooltip>
            ) : null}
          </Grid>
        </Grid>
        <div>
          {this.state.data.length > 0 ? (
            <WillCompare data={this.state.data} />
          ) : (
            <div className="text-error">Pas de testaments à comparer</div>
          )}
        </div>
      </div>
    );
  }
}

export default Compare;
