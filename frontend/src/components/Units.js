import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Grid
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";

import UnitDisplay from "./UnitDisplay";
import Footer from "./Footer";

class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "corps.keyword",
      order: "asc",
      value: 1,
      cur_list: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "desc"
        });
        break;

      default:
        this.setState({
          value: event.target.value,
          field: "corps.keyword",
          order: "asc"
        });
        break;
    }
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
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
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <h2>Découvrir les unités militaires</h2>
              </Grid>
            </Grid>
          </div>
          <div className="units_result">
            <ReactiveList
              dataField={this.state.field}
              componentId="unit"
              className="units"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={5}
              sortBy={this.state.order}
              showEndPage={false}
              renderResultStats={function(stats) {
                return `${stats.numberOfResults} unités militaires`;
              }}
              URLParams={false}
              innerClass={{
                resultsInfo: "resultsInfo",
                pagination: "pagination"
              }}
              render={function(res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "armee",
                    getParamConfig("web_url") + "/armee/" + item["_id"]
                  );
                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 5) * 5;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_units"),
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
