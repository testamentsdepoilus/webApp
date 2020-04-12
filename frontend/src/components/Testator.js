import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Breadcrumbs,
  Link,
  Tooltip,
  Button,
  Box,
} from "@material-ui/core";

import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import TestatorDisplay from "./TestatorDisplay";

class Testator extends Component {
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
        <div className="testator_detail">
            <TestatorDisplay
              id={this.state.data[0]["_id"]}
              data={this.state.data[0]._source}
            />
        </div>
      );
    } else {
      return (
         <div className="text-error">Pas de résultat</div>
      );
    }
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("testateur/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 10).split("/");
      const query_id = url_query.length > 0 ? url_query[0] : "";
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
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
    /*const prevLink = localStorage.uriSearch
      ? "/recherche?" + localStorage.uriSearch.split("?")[1]
      : "/recherche";
    */

    const testator_link =
      this.state.data.length > 0 ? (
        <div key={2}>
          {this.state.data[0]._source["persName.fullProseForm"]}
        </div>
      ) : null;

    return (

      <div className="testator">
        <Box className="d-block d-md-flex"  justifyContent="space-between"> 
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
                  {testator_link}
          </Breadcrumbs>
          <div>
            {document.referrer.length > 0 &&
            document.referrer !== document.location.href ? (
              <Tooltip title="Revenir à la recherche">
                <Button className="button outlined secondary-light" id="btnBack" onClick={this.handleBackUp} aria-label="page précédente">
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

export default Testator;
