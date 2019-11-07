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
  Typography
} from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig } from "../utils/functions";

const { ResultListWrapper } = ReactiveList;

class Will extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query_term: "",
      page: 0
    };

    this.defaultQuery = this.defaultQuery.bind(this);
    this.renderFunc = this.renderFunc.bind(this);
  }

  renderFunc(res) {
    if (res.loading) {
      return (
        <div>
          <h3>En chargement</h3>
        </div>
      );
    } else if (res.data.length > 0) {
      return (
        <div className="root">
          <Paper>
            <WillDisplay data={res.data[0]} cur_page={this.state.page} />
          </Paper>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Pas de résultat</h3>
        </div>
      );
    }
  }
  defaultQuery() {
    const query_term_ = this.state.query_term;
    return {
      query: {
        term: {
          _id: query_term_
        }
      }
    };
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("will/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 5).split("/");
      this.setState({
        query_term: url_query.length > 0 ? url_query[0] : "",
        page:
          url_query.length > 1
            ? {
                type: url_query[1].split("_")[0],
                id: parseInt(url_query[1].split("_")[1])
              }
            : {}
      });
    }
  }

  render() {
    const prevLink = document.referrer.includes("search?")
      ? "/search?" + document.referrer.split("?")[1]
      : "/search";

    const will_link =
      this.state.query_term !== "" ? (
        <Typography color="textPrimary" key={2}>
          {this.state.query_term}
        </Typography>
      ) : null;

    return (
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <div className="wills_menu">
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
                to={prevLink}
              >
                {" "}
                Recherche{" "}
              </Link>
              {will_link}
            </Breadcrumbs>
          </Paper>
        </div>

        <div>
          <ReactiveList
            componentId="will"
            stream={true}
            pagination={false}
            URLParams={false}
            defaultQuery={this.defaultQuery}
            renderResultStats={function(stats) {
              return ``;
            }}
            render={this.renderFunc}
          />
        </div>
      </ReactiveBase>
    );
  }
}

export default Will;
