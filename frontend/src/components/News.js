import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  getTotalHits,
} from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  MenuList,
  MenuItem,
} from "@material-ui/core";

import Footer from "./Footer";

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedId: "",
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id,
    });
  }

  handleMoreClick(item) {
    return function (e) {
      document.location.href =
        getParamConfig("web_url") + "/news/" + item["_id"];
    };
  }

  defaultQuery() {
    return {
      query: {
        term: {
          type: 2,
        },
      },
    };
  }

  componentDidUpdate() {}

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("news/");
    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    )
      .then((res) => {
        const total = typeof res === "object" ? res.value : res;

        getHitsFromQuery(
          getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
          JSON.stringify({
            size: total,
            query: {
              term: {
                type: 2,
              },
            },
            sort: [{ created: { order: "desc" } }],
          })
        )
          .then((data) => {
            if (idx !== -1) {
              const id_query = url.substring(idx + 5).split("/");
              getHitsFromQuery(
                getParamConfig("es_host") +
                  "/" +
                  getParamConfig("es_index_cms"),
                JSON.stringify({
                  query: {
                    term: {
                      _id: id_query[0],
                    },
                  },
                })
              )
                .then((hits) => {
                  this.setState({
                    data: data,
                    selectedId:
                      hits.length > 0 ? hits[0]["_id"] : data[0]["_id"],
                  });
                })
                .catch((error) => {
                  console.log("error :", error);
                });
            } else {
              this.setState({
                data: data,
                selectedId: data.length > 0 ? data[0]["_id"] : "",
              });
            }
          })
          .catch((error) => {
            console.log("error :", error);
          });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  render() {
    const curItem =
      this.state.selectedId === ""
        ? this.state.data[0]
        : this.state.data.find(
            function (item) {
              return item["_id"] === this.state.selectedId;
            }.bind(this)
          );
    const currLink = !Boolean(curItem) ? (
      <Link
        id="news"
        key={1}
        color="textPrimary"
        component={RouterLink}
        to="/news"
      >
        {" "}
        Actualités{" "}
      </Link>
    ) : (
      [
        <Typography key={1} color="textPrimary">
          Actualités
        </Typography>,
        <Typography key={2} color="textPrimary">
          {curItem._source["title"]}
        </Typography>,
      ]
    );
    const navBar = (
      <Paper elevation={0}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="Breadcrumb"
        >
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>
          {currLink}
        </Breadcrumbs>
      </Paper>
    );

    const menuNews = (
      <Paper className="menu_news">
        <MenuList>
          {this.state.data.map((item, i) => (
            <MenuItem key={i + 10}>
              <Link
                id={item["_id"]}
                className={
                  this.state.selectedId === item["_id"] ? "activedLink" : "link"
                }
                component={RouterLink}
                to={"/news/" + item["_id"]}
                onClick={this.handleListItemClick}
              >
                {item._source["title"]}
              </Link>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    );

    const date = Boolean(curItem) ? new Date(curItem._source["created"]) : null;
    return (
      <div>
        {Boolean(curItem) ? (
          <div className="news">
            {navBar}

            <h1 className="heading">ACTUALITES</h1>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={2}>
                {menuNews}
              </Grid>
              <Grid item xs={10}>
                <div className="detail">
                  <Paper className="item" key={0}>
                    <Typography className="title">
                      {" "}
                      {curItem._source["title"]}{" "}
                    </Typography>
                    <Paper className="head">
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item>{curItem._source["author"]}</Grid>
                        <Grid item>
                          {Boolean(date)
                            ? "Mise à jour le " +
                              date.toLocaleDateString() +
                              " à " +
                              date.toLocaleTimeString()
                            : ""}
                        </Grid>
                      </Grid>
                    </Paper>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          curItem._source["detail"] !== ""
                            ? curItem._source["detail"]
                            : curItem._source["summary"],
                      }}
                    ></div>
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <Typography variant="h4">Actualités introuvables !</Typography>
        )}
        <Footer />
      </div>
    );
  }
}

export default News;
