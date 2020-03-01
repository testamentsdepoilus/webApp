import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ReactiveBase,
  ReactiveList,
  SingleDropdownList
} from "@appbaseio/reactivesearch";

import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";
import TestatorDisplay from "./TestatorDisplay";
import ClearIcon from "@material-ui/icons/Clear";
import Footer from "./Footer";

class Testators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "persName.norm.keyword",
      order: "asc",
      value: 1,
      testator_name: "",
      cur_list: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleClear(value) {
    return function(event) {
      this.setState({
        testator_name: value
      });
    }.bind(this);
  }

  handleValueChange(value) {
    this.setState({
      testator_name: value
    });
  }
  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "desc"
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "birth.date",
          order: "asc"
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "birth.date",
          order: "desc"
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "death.date",
          order: "asc"
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "death.date",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "asc"
        });
        break;
    }
  }

  render() {
    return (
      <div className="testators">
        <ReactiveBase
          app={getParamConfig("es_index_testators")}
          url={getParamConfig("es_host")}
          type="_doc"
        >
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
                <Typography color="textPrimary">Les testateurs</Typography>
              </Breadcrumbs>
            </Paper>
          </div>

          <div className="testatorSearch">
            <h2>Découvrir les testateurs</h2>
            <div className="selectList">
              <Grid container direction="row">
                <Grid item xs={10}>
                  <SingleDropdownList
                    componentId="testatorId"
                    className="testators"
                    dataField="persName.norm.keyword"
                    value={this.state.testator_name}
                    size={1000}
                    sortBy="asc"
                    showCount={false}
                    autosuggest={true}
                    placeholder="Nom du testateur"
                    loader="En chargement ..."
                    showSearch={true}
                    searchPlaceholder="Taper le nom ici"
                    onChange={this.handleValueChange}
                    URLParams={true}
                    innerClass={{
                      list: "list",
                      select: "select"
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={this.handleClear("")}
                    title="Supprimer le filtre"
                  >
                    <ClearIcon style={{ color: "red" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="testators_result">
            <ReactiveList
              react={{
                and: ["testatorId"]
              }}
              className="testators"
              dataField={this.state.field}
              componentId="pers"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={5}
              sortBy={this.state.order}
              showEndPage={false}
              URLParams={false}
              innerClass={{
                resultsInfo: "resultsInfo",
                pagination: "pagination"
              }}
              renderResultStats={function(stats) {
                return `${stats.numberOfResults} testateurs trouvés.`;
              }}
              render={function(res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "testator",
                    getParamConfig("web_url") + "/testateur/" + item["_id"]
                  );
                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 5) * 5;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_testators"),
                    JSON.stringify({
                      from: curPage_,
                      size: 5,
                      sort: [sort_]
                    })
                  )
                    .then(data => {
                      if (!equalsArray(data, this.state.cur_list)) {
                        this.setState({
                          cur_list: data
                        });
                      }
                    })
                    .catch(error => {
                      console.log("error :", error);
                    });
                  const resultList = (
                    <div className="resultList">
                      <div className="sortResult">
                        Trier par :
                        <Select
                          value={this.state.value}
                          onChange={this.handleChange}
                        >
                          <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
                          <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
                          <MenuItem value={3}>
                            date de naissance <TrendingUpIcon />
                          </MenuItem>
                          <MenuItem value={4}>
                            date de naissance <TrendingDownIcon />
                          </MenuItem>
                          <MenuItem value={5}>
                            date de décès <TrendingUpIcon />
                          </MenuItem>
                          <MenuItem value={6}>
                            date de décès <TrendingDownIcon />
                          </MenuItem>
                        </Select>
                      </div>
                      <ul>
                        {this.state.cur_list.map((item, i) =>
                          Boolean(
                            res.resultStats.currentPage === curPage_ + i
                          ) ? (
                            <li key={item["_id"]} className="li_active">
                              {curPage_ + i + 1}
                              {". "}
                              {item._source[
                                "persName.fullIndexEntryForm.forename"
                              ]
                                .toString()
                                .replace(/,/g, " ") + " "}
                              <span className="typoSurname">
                                {
                                  item._source[
                                    "persName.fullIndexEntryForm.surname"
                                  ]
                                }
                              </span>
                            </li>
                          ) : (
                            <li key={item["_id"]} className="li">
                              {curPage_ + i + 1}
                              {". "}
                              {item._source[
                                "persName.fullIndexEntryForm.forename"
                              ]
                                .toString()
                                .replace(/,/g, " ") + " "}
                              <span className="typoSurname">
                                {
                                  item._source[
                                    "persName.fullIndexEntryForm.surname"
                                  ]
                                }
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  );
                  return (
                    <div className="testators_results" key={j}>
                      <TestatorDisplay
                        id={item["_id"]}
                        data={item}
                        resultList={resultList}
                      />
                      <Footer />
                    </div>
                  );
                });
              }.bind(this)}
            ></ReactiveList>
          </div>
        </ReactiveBase>
      </div>
    );
  }
}

export default Testators;
