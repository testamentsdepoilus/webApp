import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import WillDisplay from "./WillDisplay";
import { Breadcrumbs, Link, Button, Tooltip, Box } from "@material-ui/core";

import { getParamConfig, getHitsFromQuery } from "../utils/functions";

class Will extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: {},
      idx: 0,
    };

    this.renderFunc = this.renderFunc.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  renderFunc() {
    if (this.state.data.length > 0) {
      return (
        <div key={100}>
          <WillDisplay
            id={this.state.data[0]["_id"]}
            data={this.state.data[0]._source}
            cur_page={this.state.page}
          />
        </div>
      );
    } else {
      return <div className="text-error">Pas de résultat</div>;
    }
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  handlePrev(e) {
    let new_idx = this.state.idx > 0 ? this.state.idx - 1 : 0;
    const willsIds = JSON.parse(localStorage.willsIds);

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        query: {
          term: {
            _id: willsIds[new_idx],
          },
        },
      })
    )
      .then((data) => {
        window.history.replaceState(
          getParamConfig("web_url"),
          "will",
          getParamConfig("web_url") + "/testament/" + willsIds[new_idx]
        );
        this.setState({
          data: data,
          idx: new_idx,
        });
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }

  handleNext(e) {
    const willsIds = JSON.parse(localStorage.willsIds);
    let new_idx =
      this.state.idx < willsIds.length - 1
        ? this.state.idx + 1
        : this.state.idx;

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        query: {
          term: {
            _id: willsIds[new_idx],
          },
        },
      })
    )
      .then((data) => {
        window.history.replaceState(
          getParamConfig("web_url"),
          "will",
          getParamConfig("web_url") + "/testament/" + willsIds[new_idx]
        );
        this.setState({
          data: data,
          idx: new_idx,
        });
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("testament/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 10).split("/");
      const query_id = url_query.length > 0 ? url_query[0] : "";
      let cur_idx = 0;
      if (localStorage.willsIds) {
        const willsIds = JSON.parse(localStorage.willsIds);
        console.log(willsIds);

        cur_idx = willsIds.indexOf(query_id);
      }
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          query: {
            term: {
              _id: query_id,
            },
          },
        })
      )
        .then((data) => {
          this.setState({
            data: data,
            page:
              url_query.length > 1
                ? {
                    type: url_query[1].split("_")[0],
                    id: parseInt(url_query[1].split("_")[1], 10),
                  }
                : {},
            idx: cur_idx,
          });
        })
        .catch((error) => {
          console.log("error :", error);
        });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("willsIds");
  }

  render() {
    const will_link =
      this.state.data.length > 0 ? (
        <div key={2}>{this.state.data[0]._source["will_identifier.name"]}</div>
      ) : null;

    return (
      <div className="will">
        <Box className="d-block d-md-flex" justifyContent="space-between">
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
            {will_link}
          </Breadcrumbs>
          {localStorage.willsIds &&
          JSON.parse(localStorage.willsIds).length > 1 ? (
            <div>
              <Tooltip title="Afficher le testatment précédent">
                <Button
                  id="prev"
                  onClick={this.handlePrev}
                  disabled={this.state.idx === 0}
                >
                  <i class="fas fa-caret-left"></i>
                </Button>
              </Tooltip>
              <Tooltip title="Afficher le testatment suivant">
                <Button
                  id="next"
                  disabled={
                    this.state.idx ===
                    JSON.parse(localStorage.willsIds).length - 1
                  }
                  onClick={this.handleNext}
                >
                  <i class="fas fa-caret-right"></i>
                </Button>
              </Tooltip>
            </div>
          ) : (
            ""
          )}

          <div>
            {document.referrer.length > 0 &&
            document.referrer !== document.location.href ? (
              <Tooltip title="Revenir à la recherche">
                <Button
                  className="button outlined secondary-light"
                  id="btnBack"
                  onClick={this.handleBackUp}
                  aria-label="page précédente"
                >
                  <i className="fas fa-undo-alt"></i> Revenir en arrière
                </Button>
              </Tooltip>
            ) : null}
          </div>
        </Box>

        <div>{this.renderFunc()}</div>
      </div>
    );
  }
}

export default Will;
