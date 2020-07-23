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
         <div className="text-error">Pas de résultat</div>
      );
    }
  }
  handleBackUp(e) {
    document.location.href = document.referrer;
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
    /*const prevLink = localStorage.uriSearch
      ? "/recherche?" + localStorage.uriSearch.split("?")[1]
    : "/recherche";*/

    const unit_link =
      this.state.data.length > 0 ? (
        <div key={2}>
          {this.state.data[0]._source["unit"]}
        </div>
      ) : null;

    return (


    
      <div className="unit">

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
                  {unit_link}
          </Breadcrumbs>
          <Box px={1}>
            {document.referrer.length > 0 &&
            document.referrer !== document.location.href ? (
              <Tooltip title="Revenir à la recherche">
                <Button className="button outlined secondary-light" id="btnBack" onClick={this.handleBackUp} aria-label="page précédente">
                 <i className="fas fa-undo-alt"></i> Revenir en arrière
                </Button>
              </Tooltip>
            ) : null}
          </Box>
       </Box>

        <div>{this.renderFunc()}</div>

      </div>

    );
  }
}

export default Unit;
