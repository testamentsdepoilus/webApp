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
import "../styles/Unit.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  createStyled,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";
import { ExplorMenu } from "./Wills";

import UnitDisplay from "./UnitDisplay";

const Styled = createStyled(theme => ({
  ul: {
    listStyleType: "none",
    marginTop: theme.spacing(1)
  },
  li: {
    marginTop: theme.spacing(1),
    fontSize: "0.9em"
  }
}));

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

  render() {
    return (
      <ReactiveBase
        app={getParamConfig("es_index_units")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <ExplorMenu selectedId="units" />
        <div className="unit_menu">
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
              <Typography color="textPrimary">Les unités militaires</Typography>
            </Breadcrumbs>
          </Paper>
        </div>
        <div className="unit_order">
          Trier par :
          <Select value={this.state.value} onChange={this.handleChange}>
            <MenuItem value={1}>corps (A-Z)</MenuItem>
            <MenuItem value={2}>corps (Z-A)</MenuItem>
          </Select>
        </div>

        <div>
          <ReactiveList
            dataField={this.state.field}
            componentId="unit"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={10}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={function(stats) {
              return `${stats.numberOfResults} unités militaires trouvés.`;
            }}
            URLParams={false}
            render={function(res) {
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
                                  {item._source["unit"]}
                                </li>
                              ))}
                            </ul>
                          )}
                        </Styled>
                      </Grid>
                      <Grid item xs={10}>
                        <UnitDisplay id={item["_id"]} data={item} />
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

export default Units;
