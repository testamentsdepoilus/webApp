import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
} from "@appbaseio/reactivesearch";

import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray,
} from "../utils/functions";

import UnitDisplay from "./UnitDisplay";
import Footer from "./Footer";
import ClearIcon from "@material-ui/icons/Clear";

class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "corps.keyword",
      order: "asc",
      value: 1,
      unit: "",
      cur_list: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "asc",
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "desc",
        });
        break;

      default:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "asc",
        });
        break;
    }
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  handleClear(value) {
    return function (event) {
      this.setState({
        unit: value,
      });
    }.bind(this);
  }

  handleValueChange(value) {
    this.setState({
      unit: value,
    });
  }

  render() {
    return (
      <div className="units">
        <ReactiveBase
          app={getParamConfig("es_index_units")}
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
                <Typography color="textPrimary">
                  Les unités militaires
                </Typography>
              </Breadcrumbs>
            </Paper>
          </div>

          <div className="unitSearch">
            <h2>Découvrir les unités militaires</h2>
            <div className="selectList">
              <Grid container direction="row">
                <Grid item xs={10}>
                  <SingleDropdownList
                    componentId="unitId"
                    className="unit"
                    dataField="unit.keyword"
                    value={this.state.unit}
                    size={1000}
                    sortBy="asc"
                    showCount={false}
                    autosuggest={true}
                    placeholder="Unité militaire"
                    showSearch={true}
                    searchPlaceholder="Saisir une unité militaire"
                    onChange={this.handleValueChange}
                    URLParams={true}
                    innerClass={{
                      list: "list",
                      select: "select",
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
          <div className="units_result">
            <ReactiveList
              react={{
                and: ["unitId"],
              }}
              dataField={this.state.field}
              componentId="unit"
              className="units"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={10}
              sortBy={this.state.order}
              showEndPage={false}
              renderResultStats={function (stats) {
                return `${stats.numberOfResults} unités militaires`;
              }}
              URLParams={false}
              innerClass={{
                resultsInfo: "resultsInfo",
                pagination: "pagination",
              }}
              render={function (res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "armee",
                    getParamConfig("web_url") + "/armee/" + item["_id"]
                  );
                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 10) * 10;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_units"),
                    JSON.stringify({
                      from: curPage_,
                      size: 10,
                      sort: [sort_],
                    })
                  )
                    .then((data) => {
                      if (!equalsArray(data, this.state.cur_list)) {
                        this.setState({
                          cur_list: data,
                        });
                      }
                    })
                    .catch((error) => {
                      console.log("error :", error);
                    });
                  const resultList = (
                    <div className="resultList">
                      {" "}
                      <div className="sortResult">
                        Trier par :
                        <Select
                          value={this.state.value}
                          onChange={this.handleChange}
                        >
                          <MenuItem value={1}>unité (A-Z)</MenuItem>
                          <MenuItem value={2}>unité (Z-A)</MenuItem>
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
                              {item._source["unit"]}
                            </li>
                          ) : (
                            <li key={item["_id"]} className="li">
                              {curPage_ + i + 1}
                              {". "}
                              {item._source["unit"]}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  );
                  return (
                    <div className="units" key={j}>
                      <UnitDisplay
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

export default Units;
