import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  createStyled,
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
  IconButton,
  MenuList,
  MenuItem
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/More";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import classNames from "classnames";

const { ResultListWrapper } = ReactiveList;

const Styled = createStyled(theme => ({
  root: {
    flexWrap: "wrap",
    margin: theme.spacing(2, 0, 0, 2)
  },
  list: {
    border: "1px solid #dadce0",
    margin: "auto",
    marginTop: theme.spacing(4)
  },
  detail: {
    border: "1px solid #dadce0",
    marginTop: theme.spacing(4)
  },
  item: {
    textAlign: "justify",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: "#f5f5f5"
  },
  foot: {
    fontSize: 14,
    margin: theme.spacing(1)
  },
  head: {
    fontSize: 14,
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  title: {
    color: "#000000",
    fontSize: "1.5em"
  },
  icon: {
    fontSize: 20
  },
  menu: {
    marginTop: theme.spacing(4),
    fontSize: 14,
    textAlign: "justify",
    display: "block",
    verticalAlign: "middle"
  },
  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
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
  }
}));

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastArticles: [],
      selectedId: "",
      item: null
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    const itemFind = this.state.lastArticles.find(function(item) {
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
                    lastArticles: data,
                    selectedId:
                      hits.length > 0 ? hits[0]["_id"] : data[0]["_id"],
                    item: hits.length > 0 ? hits[0]._source : null
                  });
                })
                .catch(error => {
                  console.log("error: ", error);
                });
            } else {
              this.setState({
                lastArticles: data
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
    /*const prevLink = document.referrer.includes("recherche?")
      ? "/recherche?" + document.referrer.split("?")[1]
      : "/recherche";*/
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
        <Link
          id="articles"
          key={1}
          color="inherit"
          component={RouterLink}
          to="/articles"
        >
          {" "}
          L'état de la recherche{" "}
        </Link>,
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
      <Styled>
        {({ classes }) => (
          <Paper className={classes.menu}>
            <Typography>List des articles :</Typography>
            <MenuList>
              {this.state.lastArticles.map((item, i) => (
                <MenuItem key={i}>
                  <Link
                    id={item["_id"]}
                    className={
                      this.state.selectedId === item["_id"]
                        ? classNames(classes.link, classes.activedLink)
                        : classes.link
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
        )}
      </Styled>
    );

    const date = Boolean(this.state.item)
      ? new Date(this.state.item["created"])
      : null;
    return (
      <Styled>
        {({ classes }) =>
          Boolean(this.state.item) ? (
            <div id="root" className={classes.root}>
              {navLink}

              <Grid container direction="row" spacing={2}>
                <Grid item xs={4}>
                  {menuArticles}
                </Grid>
                <Grid item xs={8}>
                  <div className={classes.detail}>
                    <Paper className={classes.item} key={0}>
                      <Typography className={classes.title}>
                        {" "}
                        {this.state.item["title"]}{" "}
                      </Typography>
                      <Paper className={classes.head}>
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
              <div id="root" className={classes.root}>
                {navLink}
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={4}>
                    {menuArticles}
                  </Grid>
                  <Grid item xs={8}>
                    <div className={classes.list}>
                      <ReactiveList
                        dataField="created"
                        componentId="articles_id"
                        stream={true}
                        pagination={false}
                        paginationAt="bottom"
                        size={5}
                        pages={10}
                        sortBy="desc"
                        showEndPage={false}
                        renderResultStats={function(stats) {
                          return <h6>{stats.numberOfResults} articles</h6>;
                        }}
                        URLParams={false}
                        defaultQuery={this.defaultQuery}
                      >
                        {({ data, error, loading }) => (
                          <ResultListWrapper>
                            {data.map((item, j) => {
                              const date = new Date(item["created"]);
                              return (
                                <Paper className={classes.item} key={j}>
                                  <Typography className={classes.title}>
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
                                  <Paper className={classes.foot}>
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
                                          <MoreIcon />
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
                  </Grid>
                </Grid>
              </div>
            </ReactiveBase>
          )
        }
      </Styled>
    );
  }
}

export default Articles;
