import React, { Component } from "react";
import "./../styles/App.css";
import { ReactiveBase, ReactiveComponent } from "@appbaseio/reactivesearch";
import ContributorFilters from "./search/ContributorFilters";
import Results from "./search/Results";
import DateFilter from "./search/DateFilter";
import { Grid, Box, Breadcrumbs, Link } from "@material-ui/core";
import CustumerDataSearch from "./search/DataSearch";

import { getParamConfig } from "../utils/functions";
import { Link as RouterLink } from "react-router-dom";
import GeoMap from "./search/GeoMap_bis";

class Search extends Component {
  render() {
    return (
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host_with_auth")}
        type="_doc"
        enableAppbase={true}
      >
        <div className="search">
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
            <div>Rechercher</div>
          </Breadcrumbs>

          <h1 className="heading">
            <i className="fas fa-search"></i> Rechercher
          </h1>
          <Grid container justify="center" direction="row" spacing={5}>
            <Grid item xs={12} md={6} lg={4}>
              <Box className="searchForm leftSidebar">
                <CustumerDataSearch />

                <DateFilter />

                <ContributorFilters />
              </Box>
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
                    "unite",
                  ],
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
                    "will_contents.death_place_ref",
                    "will_contents.residence_geo",
                    "will_contents.residence_ref",
                    "will_contents.residence_norm",
                    "will_contents.will_place",
                    "will_contents.will_place_ref",
                    "will_contents.will_place_norm",
                  ],
                  size: 1000,
                  query: {
                    match_all: {},
                  },
                })}
                render={({ data }) => {
                  if (data.length > 0) {
                    let birth_data = {};
                    let death_data = {};
                    let residence_data = {};
                    let will_data = {};

                    let testators = data.map((item) => item["testator.ref"]);
                    let data_ = data.filter((item, index) => {
                      return testators.indexOf(item["testator.ref"]) === index;
                    });

                    data_.forEach((item) => {
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
                      if (Boolean(item["will_contents.residence_ref"])) {
                        if (
                          Boolean(
                            residence_data[item["will_contents.residence_ref"]]
                          )
                        ) {
                          residence_data[
                            item["will_contents.residence_ref"]
                          ].push(item);
                        } else {
                          residence_data[
                            item["will_contents.residence_ref"]
                          ] = [];
                          residence_data[
                            item["will_contents.residence_ref"]
                          ].push(item);
                        }
                      }
                      if (Boolean(item["will_contents.will_place_ref"])) {
                        if (
                          Boolean(
                            will_data[item["will_contents.will_place_ref"]]
                          )
                        ) {
                          will_data[item["will_contents.will_place_ref"]].push(
                            item
                          );
                        } else {
                          will_data[item["will_contents.will_place_ref"]] = [];
                          will_data[item["will_contents.will_place_ref"]].push(
                            item
                          );
                        }
                      }
                    });
                    return (
                      <GeoMap
                        birth_data={birth_data}
                        death_data={death_data}
                        will_data={will_data}
                        residence_data={residence_data}
                      />
                    );
                  } else {
                    return null;
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <Results />
            </Grid>
          </Grid>
        </div>
      </ReactiveBase>
    );
  }
}

export default Search;
