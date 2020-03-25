import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import WillDisplay from "./WillDisplay";
import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Grid
} from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";

import Footer from "./Footer";

class Wills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "will_contents.will_date",
      order: "asc",
      value: 3,
      curPage: 0,
      cur_list: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRenderStats = this.handleRenderStats.bind(this);
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
          field: "will_contents.will_date",
          order: "asc"
        });
        break;
    }
  }

  handleRenderStats(stats) {
    return `${stats.numberOfResults} testaments.`;
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  render() {
    return (
      <div className="wills">
        <ReactiveBase
          app={getParamConfig("es_index_wills")}
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
                <Typography color="textPrimary">Les testaments</Typography>
              </Breadcrumbs>
            </Paper>
          </div>

          <div className="willSearch">
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <h2>Découvrir les testaments</h2>
              </Grid>
            </Grid>
          </div>
          <div className="wills_result">
            <ReactiveList
              dataField={this.state.field}
              componentId="will"
              className="wills"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={5}
              sortBy={this.state.order}
              showEndPage={false}
              renderResultStats={this.handleRenderStats}
              URLParams={false}
              innerClass={{
                resultsInfo: "resultsInfo",
                pagination: "pagination"
              }}
              render={function(res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "will",
                    getParamConfig("web_url") + "/testament/" + item["_id"]
                  );

                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 5) * 5;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_wills"),
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
                      </div>
                      <ul>
                        {this.state.cur_list.map((item, i) =>
                          Boolean(
                            res.resultStats.currentPage === curPage_ + i
                          ) ? (
                            <li key={item["_id"]} className="li_active">
                              {curPage_ + i + 1}
                              {". "}
                              {item._source["testator.forename"] + " "}
                              <span className="typoSurname">
                                {item._source["testator.surname"]}
                              </span>
                            </li>
                          ) : (
                            <li key={item["_id"]} className="li">
                              {curPage_ + i + 1}
                              {". "}
                              {item._source["testator.forename"] + " "}
                              <span className="typoSurname">
                                {item._source["testator.surname"]}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  );
                  return (
                    <div>
                      <WillDisplay
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

export default Wills;
