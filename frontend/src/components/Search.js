import React, { Component } from "react";
import "./../styles/App.css";
import { ReactiveBase, ReactiveComponent } from "@appbaseio/reactivesearch";
import ContributorFilters from "./search/ContributorFilters";
import Results from "./search/Results";
import DateFilter from "./search/DateFilter";
import {
  Grid,
  Select,
  MenuItem,
  Paper,
  Breadcrumbs,
  Link,
  Typography
} from "@material-ui/core";
import CustumerDataSearch from "./search/DataSearch";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import { getParamConfig } from "../utils/functions";
import CollectionFilter from "./search/CollectionFilter";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import GeoMap from "./search/GeoMap_bis";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "",
      order: "",
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "desc"
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc"
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "desc"
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "asc"
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "",
          order: ""
        });
        break;
    }
  }

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
                <Paper>
                  Trier par :{" "}
                  <Select value={this.state.value} onChange={this.handleChange}>
                    <MenuItem value={0}>pertinence</MenuItem>
                    <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
                    <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
                    <MenuItem value={3}>
                      date de rédaction <TrendingUpIcon />
                    </MenuItem>
                    <MenuItem value={4}>
                      date de rédaction <TrendingDownIcon />
                    </MenuItem>
                    <MenuItem value={5}>Cote (A-Z)</MenuItem>
                    <MenuItem value={6}>Cote (Z-A)</MenuItem>
                  </Select>
                </Paper>
                <CustumerDataSearch />
                <Paper>
                  <DateFilter />
                </Paper>
                <Paper>
                  <CollectionFilter />
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
              <Results field={this.state.field} order={this.state.order} />
            </Grid>
          </Grid>
        </div>
      </ReactiveBase>
    ];
  }
}

export default Search;
