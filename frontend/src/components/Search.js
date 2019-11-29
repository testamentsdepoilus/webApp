import React, { Component } from "react";
import "./../styles/App.css";
import "./../styles/leftBar.css";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import ContributorFilters from "./search/ContributorFilters";
import InstitutionFilter from "./search/InstitutionFilter";
import Results from "./search/Results";
import DateFilter from "./search/DateFilter";
import { Grid, Select, MenuItem, Paper } from "@material-ui/core";
import CustumerDataSearch from "./search/DataSearch";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import { getParamConfig } from "../utils/functions";
import CollectionFilter from "./search/CollectionFilter";

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
    return (
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <div className="search">
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
                  <InstitutionFilter />
                </Paper>
                <Paper>
                  <ContributorFilters />
                </Paper>
              </div>
            </Grid>
            <Grid item xs={8}>
              <Results field={this.state.field} order={this.state.order} />
            </Grid>
          </Grid>
        </div>
      </ReactiveBase>
    );
  }
}

export default Search;
