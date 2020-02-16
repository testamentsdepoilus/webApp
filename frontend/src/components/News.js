import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  IconButton,
  MenuList,
  MenuItem
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/More";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

import Footer from "./Footer";

const { ResultListWrapper } = ReactiveList;

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      lastNews: [],
      selectedId: ""
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    const itemFind = this.state.lastNews.find(function(item) {
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
        getParamConfig("web_url") + "/news/" + item["_id"];
    };
  }

  defaultQuery() {
    return {
      query: {
        term: {
          type: 2
        }
      }
    };
  }

  componentDidUpdate() {
    const url = document.location.href;
    const idx = url.lastIndexOf("news/");
    if (idx === -1 && Boolean(this.state.item)) {
      this.setState({
        item: null
      });
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("news/");
    if (idx !== -1) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
        JSON.stringify({
          size: 5,
          query: {
            term: {
              type: 2
            }
          },
          sort: [{ created: { order: "desc" } }]
        })
      )
        .then(data => {
          const id_query = url.substring(idx + 5).split("/");
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
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
                lastNews: data,
                selectedId: hits.length > 0 ? hits[0]["_id"] : data[0]["_id"],
                item: hits.length > 0 ? hits[0]._source : null
              });
            })
            .catch(error => {
              console.log("error :", error);
            });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }

  render() {
    /*const prevLink = document.referrer.includes("recherche?")
      ? "/recherche?" + document.referrer.split("?")[1]
      : "/recherche";*/
    const currLink = !Boolean(this.state.item) ? (
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
        <Link
          id="news"
          key={1}
          color="inherit"
          component={RouterLink}
          to="/news"
        >
          {" "}
          Actualités{" "}
        </Link>,
        <Typography key={2} color="textPrimary">
          {this.state.item["title"]}
        </Typography>
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
        <Typography>Les dernières actualités :</Typography>
        <MenuList>
          {this.state.lastNews.map((item, i) => (
            <MenuItem key={i}>
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

    const date = Boolean(this.state.item)
      ? new Date(this.state.item["created"])
      : null;

    return [
      Boolean(this.state.item) ? (
        <div className="news">
          {navBar}

          <h1 className="heading">ACTUALITES</h1>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4}>
              {menuNews}
            </Grid>
            <Grid item xs={8}>
              <div className="detail">
                <Paper className="item" key={0}>
                  <Typography className="title">
                    {" "}
                    {this.state.item["title"]}{" "}
                  </Typography>
                  <Paper className="head">
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item>{this.state.item["author"]}</Grid>
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
                        this.state.item["detail"] !== ""
                          ? this.state.item["detail"]
                          : this.state.item["summary"]
                    }}
                  ></div>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <ReactiveBase
          app={getParamConfig("es_index_cms")}
          url={getParamConfig("es_host")}
          type="_doc"
        >
          <div className="news">
            {navBar}
            <h1 className="heading">ACTUALITES</h1>
            <div className="list_news">
              <ReactiveList
                dataField="created"
                componentId="news_id"
                stream={true}
                pagination={false}
                paginationAt="bottom"
                size={5}
                pages={10}
                sortBy="desc"
                showEndPage={false}
                renderResultStats={function(stats) {
                  return <h6>{stats.numberOfResults} actualités</h6>;
                }}
                URLParams={false}
                defaultQuery={this.defaultQuery}
              >
                {({ data, error, loading }) => (
                  <ResultListWrapper>
                    {data.map((item, j) => {
                      const date = new Date(item["created"]);
                      return (
                        <Paper className="item" key={j}>
                          <Typography className="title">
                            {" "}
                            {item["title"]}{" "}
                          </Typography>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                item["summary"] !== ""
                                  ? item["summary"]
                                  : item["detail"]
                            }}
                          ></div>
                          <Paper className="foot">
                            <Grid
                              container
                              direction="row"
                              justify="space-between"
                              alignItems="center"
                            >
                              <Grid item>{item["author"]}</Grid>
                              <Grid item>
                                {"Mise à jour le "}
                                {date.toLocaleDateString()}
                                {" à "}
                                {date.toLocaleTimeString()}
                              </Grid>
                              <Grid item>
                                <IconButton
                                  aria-label="More"
                                  onClick={this.handleMoreClick(item)}
                                >
                                  <MoreIcon className="icon" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Paper>
                      );
                    })}
                  </ResultListWrapper>
                )}
              </ReactiveList>
            </div>
          </div>
        </ReactiveBase>
      ),
      <Footer />
    ];
  }
}

export default News;
