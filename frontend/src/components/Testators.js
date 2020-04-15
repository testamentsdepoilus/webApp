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
  getHitsFromQuery,
  equalsArray,
} from "../utils/functions";
import TestatorDisplay from "./TestatorDisplay";

class Testators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "persName.norm.keyword",
      order: "asc",
      value: 1,
      testator_name: "",
      cur_list: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleClear(value) {
    return function (event) {
      this.setState({
        testator_name: value,
      });
    }.bind(this);
  }

  handleValueChange(value) {
    this.setState({
      testator_name: value,
    });
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "asc",
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "desc",
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "birth.date",
          order: "asc",
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "birth.date",
          order: "desc",
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "death.date",
          order: "asc",
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "death.date",
          order: "desc",
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "asc",
        });
        break;
    }
  }

  render() {
    return (
      <div className="notices testators">
        <ReactiveBase
          app={getParamConfig("es_index_testators")}
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
            <div>Les testateurs</div>
          </Breadcrumbs>

          <Box
            className="headingBar bg-gray"
            display="flex"
            justifyContent="space-between"
          >
            <h2 className="card-title bg-primaryMain">
              <i className="far fa-address-book"></i> Découvrir les testateurs
            </h2>
            <div className="selectList d-flex">
              <SingleDropdownList
                componentId="testatorId"
                className="select selectName"
                dataField="persName.norm.keyword"
                value={this.state.testator_name}
                size={1000}
                sortBy="asc"
                showCount={false}
                autosuggest={true}
                placeholder="Nom du testateur"
                showSearch={true}
                searchPlaceholder="Saisir un nom"
                onChange={this.handleValueChange}
                URLParams={true}
                renderItem={(label, count, isSelected) => (
                  <div>
                    {label.split("+")[1][0].toUpperCase() +
                      label.split("+")[1].slice(1) +
                      " "}
                    <span className="typoSurname">{label.split("+")[0]}</span>
                  </div>
                )}
                innerClass={{
                  list: "list",
                  select: "select",
                }}
              />
              <Button
                onClick={this.handleClear("")}
                title="Supprimer le filtre"
                className="button iconButton"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </Box>

          <div className="testators_result">
            <ReactiveList
              react={{
                and: ["testatorId"],
              }}
              className="testators"
              dataField={this.state.field}
              componentId="pers"
              stream={true}
              pagination={true}
              paginationAt="top"
              size={1}
              pages={10}
              sortBy={this.state.order}
              showEndPage={false}
              URLParams={false}
              innerClass={{
                resultsInfo: "countResults",
                pagination: "pagination",
              }}
              renderResultStats={function (stats) {
                return `${stats.numberOfResults} testateurs`;
              }}
              render={function (res) {
                return res.data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "testator",
                    getParamConfig("web_url") + "/testateur/" + item["_id"]
                  );
                  const curPage_ =
                    Math.floor(res.resultStats.currentPage / 10) * 10;
                  let sort_ = {};
                  sort_[this.state.field] = { order: this.state.order };
                  getHitsFromQuery(
                    getParamConfig("es_host") +
                      "/" +
                      getParamConfig("es_index_testators"),
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
                              date de naissance{" "}
                              <i className="fas fa-long-arrow-alt-up"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={4}>
                              date de naissance{" "}
                              <i className="fas fa-long-arrow-alt-down"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={5}>
                              date de décès{" "}
                              <i className="fas fa-long-arrow-alt-up"></i>
                            </MenuItem>
                            <MenuItem className="sortBy" value={6}>
                              date de décès{" "}
                              <i className="fas fa-long-arrow-alt-down"></i>
                            </MenuItem>
                          </Select>
                        </Box>
                      </Box>
                      <div className="resultList">
                        <ul>
                          {this.state.cur_list.map((item, i) =>
                            Boolean(
                              res.resultStats.currentPage === curPage_ + i
                            ) ? (
                              <li key={item["_id"]} className="active">
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
                              <li key={item["_id"]}>
                                {curPage_ + i + 1}
                                {". "}
                                {item._source[
                                  "persName.fullIndexEntryForm.forename"
                                ]
                                  .toString()
                                  .replace(/,/g, " ") + " "}
                                <span className="smallcaps">
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
                    </div>
                  );
                  return (
                    <div key={j}>
                      <TestatorDisplay
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

export default Testators;
