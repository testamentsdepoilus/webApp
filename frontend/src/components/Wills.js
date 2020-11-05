import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import WillDisplay from "./WillDisplay";
import { Select, MenuItem, Breadcrumbs, Link, Box } from "@material-ui/core";
import "../styles/Wills.css";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray,
} from "../utils/functions";

class Wills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "will_contents.will_date",
      order: "asc",
      value: 3,
      curPage: 0,
      cur_list: [],
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
          order: "asc",
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "desc",
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc",
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "desc",
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "asc",
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "desc",
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc",
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
      <div className="notices wills">
        <ReactiveBase
          app={getParamConfig("es_index_wills")}
          url={getParamConfig("es_host_with_auth")}
          type="_doc"
        >
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
            <div>Les testaments</div>
          </Breadcrumbs>

          <div className="headingBar bg-gray">
            <h2 className="card-title bg-primaryMain">
              <i className="fab fa-stack-overflow"></i> Parcourir les testaments
            </h2>
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
              pages={10}
              sortBy={this.state.order}
              showEndPage={false}
              renderResultStats={this.handleRenderStats}
              URLParams={false}
              innerClass={{
                resultsInfo: "countResults",
                pagination: "pagination",
              }}
              render={function (res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "will",
                    getParamConfig("web_url") + "/testament/" + item["_id"]
                  );

                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 10) * 10;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_wills"),
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
                    <div className="leftColumn bg-gray">
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        width="100%"
                      >
                        <Box display="flex" className="sort_results">
                          <Box>
                            <label className="fontWeightBold">Trier par </label>
                          </Box>
                          <Select
                            className="select"
                            value={this.state.value}
                            onChange={this.handleChange}
                          >
                            <MenuItem className="sortBy" value={1}>
                              nom de famille (A-Z)
                            </MenuItem>
                            <MenuItem className="sortBy" value={2}>
                              nom de famille (Z-A)
                            </MenuItem>
                            <MenuItem className="sortBy" value={3}>
                              date de rédaction{" "}
                              <i className="fas fa-long-arrow-alt-up"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={4}>
                              date de rédaction{" "}
                              <i className="fas fa-long-arrow-alt-down"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={5}>
                              Cote (A-Z)
                            </MenuItem>
                            <MenuItem className="sortBy" value={6}>
                              Cote (Z-A)
                            </MenuItem>
                          </Select>
                        </Box>
                      </Box>

                      <Box
                        className="resultList"
                        display={{ xs: "none", sm: "block" }}
                      >
                        <ul>
                          {this.state.cur_list.map((item, i) =>
                            Boolean(
                              res.resultStats.currentPage === curPage_ + i
                            ) ? (
                              <li key={item["_id"]} className="active">
                                {curPage_ + i + 1}
                                {". "}
                                {item._source["testator.forename"] + " "}
                                <span className="typoSurname">
                                  {item._source["testator.surname"]}
                                </span>
                              </li>
                            ) : (
                              <li key={item["_id"]}>
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
                      </Box>
                    </div>
                  );
                  return (
                    <div>
                      <WillDisplay
                        id={item["_id"]}
                        data={item}
                        resultList={resultList}
                      />
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
