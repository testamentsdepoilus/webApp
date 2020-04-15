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
            className="headingBar bg-gray"
            display="flex"
            justifyContent="space-between"
          >
            <h2 className="card-title bg-primaryMain">
              <i className="far fa-address-book"></i> Découvrir les unités
              militaires
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
                      <div className="resultList">
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
                      </div>
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
