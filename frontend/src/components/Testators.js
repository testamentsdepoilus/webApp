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
import "../styles/Testator.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  equalsArray,
  createStyled
} from "../utils/functions";
import TestatorDisplay from "./TestatorDisplay";
import { ExplorMenu } from "./Wills";
import ClearIcon from "@material-ui/icons/Clear";

const Styled = createStyled(theme => ({
  ul: {
    listStyleType: "none",
    marginTop: theme.spacing(1)
  },
  li: {
    marginTop: theme.spacing(1),
    fontSize: "0.9em"
  },
  typoSurname: {
    fontVariantCaps: "small-caps"
  }
}));

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
      <ReactiveBase
        app={getParamConfig("es_index_testators")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <ExplorMenu selectedId="testators" />
        <div className="testator_menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="search"
                key={0}
                color="inherit"
                component={RouterLink}
                to="/recherche"
              >
                {" "}
                Recherche{" "}
              </Link>
              <Typography color="textPrimary">Les testateurs</Typography>
            </Breadcrumbs>
          </Paper>
        </div>
        <div className="wills_order">
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <SingleDropdownList
                componentId="testatorId"
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
                innerClass={{
                  list: "list_testators",
                  input: "input_testator"
                }}
                onChange={this.handleValueChange}
              />
            </Grid>
            <Grid item>
              <IconButton
                onClick={this.handleClear("")}
                title="Supprimer le filtre"
              >
                <ClearIcon style={{ color: "red" }} />
              </IconButton>
            </Grid>
            <Grid item>
              Trier par :
              <Select value={this.state.value} onChange={this.handleChange}>
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
            </Grid>
          </Grid>
        </div>

        <div>
          <ReactiveList
            react={{
              and: ["testatorId"]
            }}
            dataField={this.state.field}
            componentId="pers"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={10}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={function(stats) {
              return `${stats.numberOfResults} testateurs trouvés.`;
            }}
            URLParams={false}
            render={function(res) {
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
                return (
                  <div key={j}>
                    <Grid container direction="row" spacing={1}>
                      <Grid item xs={2}>
                        <Styled>
                          {({ classes }) => (
                            <ul className={classes.ul}>
                              {this.state.cur_list.map((item, i) => (
                                <li key={item["_id"]} className={classes.li}>
                                  {curPage_ + i + 1}
                                  {". "}
                                  {item._source[
                                    "persName.fullIndexEntryForm.forename"
                                  ]
                                    .toString()
                                    .replace(/,/g, " ") + " "}
                                  <span className={classes.typoSurname}>
                                    {
                                      item._source[
                                        "persName.fullIndexEntryForm.surname"
                                      ]
                                    }
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Styled>
                      </Grid>
                      <Grid item xs={10}>
                        <TestatorDisplay id={item["_id"]} data={item} />
                      </Grid>
                    </Grid>
                  </div>
                );
              });
            }.bind(this)}
          ></ReactiveList>
        </div>
      </ReactiveBase>
    );
  }
}

export default Testators;
