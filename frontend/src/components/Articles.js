import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  getHitsFromQuery,
  getTotalHits
} from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  MenuList,
  MenuItem
} from "@material-ui/core";

import Footer from "./Footer";

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedId: ""
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    const itemFind = this.state.data.find(function(item) {
      return item["_id"] === event.target.id;
    });

    this.setState({
      selectedId: event.target.id,
      item: itemFind ? itemFind._source : this.state.item
    });
  }

  handleMoreClick(item) {
    return function(e) {
      document.location.href =
        getParamConfig("web_url") + "/articles/" + item["_id"];
    };
  }

  defaultQuery() {
    return {
      query: {
        term: {
          type: 1
        }
      }
    };
  }

  componentDidUpdate() {
    const url = document.location.href;
    const idx = url.lastIndexOf("articles/");
    if (idx === -1 && Boolean(this.state.item)) {
      this.setState({
        item: null
      });
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("articles/");
    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    )
      .then(res => {
        const total = typeof res === "object" ? res.value : res;
        getHitsFromQuery(
          getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
          JSON.stringify({
            size: total,
            query: {
              term: {
                type: 1
              }
            },
            sort: [{ created: { order: "desc" } }]
          })
        )
          .then(data => {
            if (idx !== -1) {
              const id_query = url.substring(idx + 9).split("/");
              getHitsFromQuery(
                getParamConfig("es_host") +
                  "/" +
                  getParamConfig("es_index_cms"),
                JSON.stringify({
                  query: {
                    term: {
                      _id: id_query[0]
                    }
                  }
                })
              )
                .then(hits => {
                  this.setState({
                    data: data,
                    selectedId:
                      hits.length > 0 ? hits[0]["_id"] : data[0]["_id"]
                  });
                })
                .catch(error => {
                  console.log("error: ", error);
                });
            } else {
              this.setState({
                data: data,
                selectedId: data.length > 0 ? data[0]["_id"] : ""
              });
            }
          })
          .catch(error => {
            console.log("error: ", error);
          });
      })
      .catch(error => {
        console.log("error: ", error);
      });
  }

  render() {
    const curItem =
      this.state.selectedId === ""
        ? this.state.data[0]
        : this.state.data.find(
            function(item) {
              return item["_id"] === this.state.selectedId;
            }.bind(this)
          );

    const currLink = !Boolean(this.state.item) ? (
      <Link
        id="articles"
        key={1}
        color="textPrimary"
        component={RouterLink}
        to="/articles"
      >
        {" "}
        L'état de la recherche{" "}
      </Link>
    ) : (
      [
        <Typography key={2} color="textPrimary">
          {" "}
          L'état de la recherche{" "}
        </Typography>,
        <Typography key={2} color="textPrimary">
          {this.state.item["title"]}
        </Typography>
      ]
    );
    const navLink = (
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

    const menuArticles = (
      <Paper className="menu_articles">
        <MenuList>
          {this.state.data.map((item, i) => (
            <MenuItem key={i}>
              <Link
                id={item["_id"]}
                className={
                  this.state.selectedId === item["_id"] ? "activedLink" : "link"
                }
                component={RouterLink}
                to={"/articles/" + item["_id"]}
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
    return [
      Boolean(curItem) ? (
        <div className="articles">
          {navLink}

          <h2>ETAT DE LA RECHERCHE</h2>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={2}>
              {menuArticles}
            </Grid>
            <Grid item xs={10}>
              <div className="detail">
                <Paper className="item" key={0}>
                  <h1 className="title_article">{curItem._source["title"]} </h1>
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
                          : curItem._source["summary"]
                    }}
                  ></div>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Typography variant="h4">Articles introuvables !</Typography>
      ),
      <Footer />
    ];
  }
}

export default Articles;
