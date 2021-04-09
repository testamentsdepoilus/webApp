import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
} from "@appbaseio/reactivesearch";

import {
  Box,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Button,
} from "@material-ui/core";
import {
  getParamConfig,
  equalsArray,
  getHitsFromQuery,
} from "../utils/functions";

import PlaceDisplay from "./PlaceDisplay";

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "city.keyword",
      order: "asc",
      value: 1,
      city: "",
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
          field: "city.keyword",
          order: "asc",
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "city.keyword",
          order: "desc",
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "region.keyword",
          order: "asc",
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "region.keyword",
          order: "desc",
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "country.keyword",
          order: "asc",
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "country.keyword",
          order: "desc",
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "city.keyword",
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
        city: value,
      });
    }.bind(this);
  }

  handleValueChange(value) {
    this.setState({
      city: value,
    });
  }

  render() {
    return (
      <div className="notices places">
        <ReactiveBase
          app={getParamConfig("es_index_places")}
          url={getParamConfig("es_host")}
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
            <div>Les lieux</div>
          </Breadcrumbs>

          <Box
            display={{ xs: "block", sm: "flex" }}
            className="headingBar bg-gray"
            justifyContent="space-between"
          >
            <h2 className="card-title bg-primaryMain">
              <i className="fas fa-map-marker-alt"></i> Découvrir les lieux
            </h2>

            <div className="selectList d-flex">
              <SingleDropdownList
                componentId="placeId"
                className="select selectName"
                dataField="city.keyword"
                value={this.state.city}
                size={1000}
                sortBy="asc"
                showCount={false}
                autosuggest={true}
                placeholder="Lieu"
                showSearch={true}
                searchPlaceholder="Saisir un lieu"
                onChange={this.handleValueChange}
                URLParams={true}
                innerClass={{
                  list: "list",
                  select: this.state.city === "" ? "select" : "select selected",
                }}
              />
              {this.state.city !== "" ? (
                <Button
                  onClick={this.handleClear("")}
                  title="Supprimer le filtre"
                  className="button clear iconButton"
                >
                  <i className="fas fa-times"></i>
                </Button>
              ) : (
                ""
              )}
            </div>
          </Box>
          <div className="places_result">
            <ReactiveList
              react={{
                and: ["placeId"],
              }}
              dataField={this.state.field}
              componentId="place"
              className="places"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={10}
              sortBy={this.state.order}
              showEndPage={false}
              renderResultStats={function (stats) {
                return `${stats.numberOfResults} lieux`;
              }}
              URLParams={false}
              innerClass={{
                resultsInfo: "countResults",
                pagination: "pagination",
              }}
              render={function (res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "place",
                    getParamConfig("web_url") + "/place/" + item["_id"]
                  );
                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 10) * 10;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_places"),
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
                              commune (A-Z)
                            </MenuItem>
                            <MenuItem className="sortBy" value={2}>
                              commune (Z-A)
                            </MenuItem>
                            <MenuItem className="sortBy" value={3}>
                              région{" "}
                              <i className="fas fa-long-arrow-alt-up"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={4}>
                              région{" "}
                              <i className="fas fa-long-arrow-alt-down"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={5}>
                              pays <i className="fas fa-long-arrow-alt-up"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={6}>
                              pays{" "}
                              <i className="fas fa-long-arrow-alt-down"></i>
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
                                {item._source["city"]}
                              </li>
                            ) : (
                              <li key={item["_id"]}>
                                {curPage_ + i + 1}
                                {". "}
                                {item._source["city"]}
                              </li>
                            )
                          )}
                        </ul>
                      </Box>
                    </div>
                  );
                  return (
                    <div key={j}>
                      <PlaceDisplay
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

export default Places;
