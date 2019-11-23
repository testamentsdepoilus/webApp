import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import WillDisplay from "./WillDisplay";
import {
  Paper,
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
  createStyled,
  getHitsFromQuery
} from "../utils/functions";
import classNames from "classnames";
import InsertLinkIcon from "@material-ui/icons/InsertLinkOutlined";
import TestatorDisplay from "./TestatorDisplay";

const Styled = createStyled(theme => ({
  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "-apple-system",
    "&:hover, &:focus": {
      color: "#0091EA",
      fontWeight: 600,
      backgroundColor: "#eceff1"
    },
    "&:active": {
      color: "#0091EA",
      fontWeight: 600
    }
  },
  activedLink: {
    color: "#0091EA",
    fontWeight: 600
  },

  linkPage: {
    color: "#212121",
    fontSize: 18,
    fontWeight: 400,
    "&:hover": {
      color: "#0091EA"
    }
  },
  selectedLink: {
    fontWeight: 600,
    color: "#0091EA",
    fontSize: 18
  }
}));

class Testator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.renderFunc = this.renderFunc.bind(this);
  }

  renderFunc() {
    if (this.state.data.length > 0) {
      return (
        <div className="testator_detail">
          <Paper>
            <TestatorDisplay
              id={this.state.data[0]["_id"]}
              data={this.state.data[0]._source}
            />
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

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("testateur/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 10).split("/");
      const query_id = url_query.length > 0 ? url_query[0] : "";
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            term: {
              _id: query_id
            }
          }
        })
      )
        .then(data => {
          this.setState({
            data: data
          });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }

  render() {
    const prevLink = localStorage.uriSearch
      ? "/recherche?" + localStorage.uriSearch.split("?")[1]
      : "/recherche";

    const testator_link =
      this.state.data.length > 0 ? (
        <Typography color="textPrimary" key={2}>
          {this.state.data[0]._source["persName.fullProseForm"]}
        </Typography>
      ) : null;

    return (
      <div>
        <div className="testator_menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="search"
                color="inherit"
                key={0}
                component={RouterLink}
                to={prevLink}
              >
                {localStorage.uriSearch ? "Modifier ma recherche" : "Recheche"}
              </Link>
              {testator_link}
            </Breadcrumbs>
          </Paper>
        </div>

        <div>{this.renderFunc()}</div>
      </div>
    );
  }
}

export default Testator;
