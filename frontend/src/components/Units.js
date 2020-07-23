import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
} from "@appbaseio/reactivesearch";

import {
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Box,
  Button,
  SvgIcon,
} from "@material-ui/core";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray,
} from "../utils/functions";

import UnitDisplay from "./UnitDisplay";

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
      <div className="notices units">
        <ReactiveBase
          app={getParamConfig("es_index_units")}
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
            <div>Les unités militaires</div>
          </Breadcrumbs>

          <Box
            display={{ xs: "block", sm: "flex" }}
            className="headingBar bg-gray"
            justifyContent="space-between"
          >
            <h2 className="card-title bg-primaryMain">
              <SvgIcon>
                <path
                  className="st0"
                  d="M21.6,22.3H7.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8h14.1c1,0,1.8,0.8,1.8,1.8
                          C23.4,21.5,22.6,22.3,21.6,22.3 M21.6,17.2H7.4c-1.8,0-3.3,1.5-3.3,3.3c0,1.8,1.5,3.3,3.3,3.3h14.1c1.8,0,3.3-1.5,3.3-3.3
                          C24.8,18.6,23.4,17.2,21.6,17.2"
                />
                <path
                  className="st0"
                  d="M8.1,19.6C8.6,19.6,9,20,9,20.4s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S7.6,19.6,8.1,19.6"
                />
                <path
                  className="st0"
                  d="M10.7,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S10.2,19.6,10.7,19.6"
                />
                <path
                  className="st0"
                  d="M13.2,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S12.7,19.6,13.2,19.6"
                />
                <path
                  className="st0"
                  d="M15.8,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S15.3,19.6,15.8,19.6"
                />
                <path
                  className="st0"
                  d="M18.3,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S17.8,19.6,18.3,19.6"
                />
                <path
                  className="st0"
                  d="M21.6,19.6c0.9,0,1.7,0.7,1.7,1.7s-0.7,1.7-1.7,1.7c-0.9,0-1.7-0.7-1.7-1.7S20.7,19.6,21.6,19.6"
                />
                <path
                  className="st0"
                  d="M22.1,14.7H8.9l0.8-1h3.1h9.2V14.7z M14.3,11.7c0-0.8,0.7-1.5,1.5-1.5h3.3c0.8,0,1.5,0.7,1.5,1.5v0.6h-6.4
                          V11.7z M23.7,14.7h-0.2v-2.5h-1.4v-0.6c0-1.6-1.3-3-3-3h-1V7.4h-1.5v1.3h-0.9c-0.7,0-1.4,0.3-1.9,0.7L4.5,5L3.9,6.4l9.1,4.3
                          c-0.1,0.3-0.2,0.7-0.2,1.1v0.6H9l-2,2.5H5.3C3.5,14.7,2,16.2,2,18h1.5c0-1,0.8-1.8,1.8-1.8h18.4c1,0,1.8,0.8,1.8,1.8H27
                          C27,16.2,25.5,14.7,23.7,14.7"
                />
              </SvgIcon>{" "}
              Découvrir les unités militaires
            </h2>

            <div className="selectList d-flex">
              <SingleDropdownList
                componentId="unitId"
                className="select selectName"
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
                  select: this.state.unit === "" ? "select" : "select selected",
                }}
              />
              {this.state.unit !== "" ? (
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
                resultsInfo: "countResults",
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
                              unité (A-Z)
                            </MenuItem>
                            <MenuItem className="sortBy" value={2}>
                              unité (Z-A)
                            </MenuItem>
                          </Select>
                        </Box>
                      </Box>
                      <Box className="resultList" display={{ xs: "none", sm: "block" }}>
                        <ul>
                          {this.state.cur_list.map((item, i) =>
                            Boolean(
                              res.resultStats.currentPage === curPage_ + i
                            ) ? (
                              <li key={item["_id"]} className="active">
                                {curPage_ + i + 1}
                                {". "}
                                {item._source["unit"]}
                              </li>
                            ) : (
                              <li key={item["_id"]}>
                                {curPage_ + i + 1}
                                {". "}
                                {item._source["unit"]}
                              </li>
                            )
                          )}
                        </ul>
                      </Box>
                    </div>
                  );

                  return (
                    <div className="units" key={j}>
                      <UnitDisplay
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

export default Units;
