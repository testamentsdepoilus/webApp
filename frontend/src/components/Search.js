import React, { Component } from "react";
import "./../styles/App.css";
import { ReactiveBase, ReactiveComponent } from "@appbaseio/reactivesearch";
import ContributorFilters from "./search/ContributorFilters";
import Results from "./search/Results";
import DateFilter from "./search/DateFilter";
import { Grid, Paper, Breadcrumbs, Link, Typography } from "@material-ui/core";
import CustumerDataSearch from "./search/DataSearch";

import { getParamConfig } from "../utils/functions";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import GeoMap from "./search/GeoMap_bis";
import Footer from "./Footer";

class Search extends Component {
  render() {
    return [
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <div className="search">
          <div className="menu">
            <Paper elevation={0}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="Breadcrumb"
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
                <Typography color="textPrimary">Recherche</Typography>
              </Breadcrumbs>
            </Paper>
          </div>
          <h1 className="heading">RECHERCHE</h1>
          <Grid
            container
            justify="center"
            alignItems="baseline"
            direction="row"
          >
            <Grid item xs="auto">
              <div className="leftSidebar">
                <CustumerDataSearch />
                <Paper>
                  <DateFilter />
                </Paper>

                <Paper>
                  <ContributorFilters />
                </Paper>
                <ReactiveComponent
                  componentId="mapSearch"
                  react={{
                    and: [
                      "texte",
                      "contributeur",
                      "institution",
                      "collection",
                      "date_naissance",
                      "date_redaction",
                      "date_deces",
                      "cote",
                      "lieu",
                      "nom_testateur",
                      "notoriale",
                      "profession",
                      "unite"
                    ]
                  }}
                  defaultQuery={() => ({
                    _source: [
                      "will_contents.birth_place",
                      "testator.forename",
                      "testator.surname",
                      "testator.ref",
                      "will_contents.death_place",
                      "will_contents.death_date",
                      "will_contents.birth_date",
                      "will_contents.birth_place_norm",
                      "will_contents.death_place_norm",
                      "will_contents.birth_place_ref",
                      "will_contents.death_place_ref"
                    ],
                    size: 1000,
                    query: {
                      match_all: {}
                    }
                  })}
                  render={({ data }) => {
                    if (data.length > 0) {
                      let birth_data = {};
                      let death_data = {};

                      data.forEach(item => {
                        if (Boolean(item["will_contents.birth_place_ref"])) {
                          if (
                            Boolean(
                              birth_data[item["will_contents.birth_place_ref"]]
                            )
                          ) {
                            birth_data[
                              item["will_contents.birth_place_ref"]
                            ].push(item);
                          } else {
                            birth_data[
                              item["will_contents.birth_place_ref"]
                            ] = [];
                            birth_data[
                              item["will_contents.birth_place_ref"]
                            ].push(item);
                          }
                        }
                        if (Boolean(item["will_contents.death_place_ref"])) {
                          if (
                            Boolean(
                              death_data[item["will_contents.death_place_ref"]]
                            )
                          ) {
                            death_data[
                              item["will_contents.death_place_ref"]
                            ].push(item);
                          } else {
                            death_data[
                              item["will_contents.death_place_ref"]
                            ] = [];
                            death_data[
                              item["will_contents.death_place_ref"]
                            ].push(item);
                          }
                        }
                      });
                      return (
                        <GeoMap
                          birth_data={birth_data}
                          death_data={death_data}
                        />
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={8}>
              <Results />
            </Grid>
          </Grid>
        </div>
      </ReactiveBase>,
      <Footer />
    ];
  }
}

export default Search;
