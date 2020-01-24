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
  MenuList,
  MenuItem
} from "@material-ui/core";

import classNames from "classnames";
import Footer from "./Footer";

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
      <Styled>
        {({ classes }) => (
          <Paper className={classes.menu}>
            <Typography>List des articles :</Typography>
            <MenuList>
              {this.state.data.map((item, i) => (
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

    const date = Boolean(curItem) ? new Date(curItem._source["created"]) : null;
    return [
      <Styled>
        {({ classes }) =>
          Boolean(curItem) ? (
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
                        {curItem._source["title"]}{" "}
                      </Typography>
                      <Paper className={classes.head}>
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
          )
        }
      </Styled>,
      <Footer />
    ];
  }
}

export default Articles;
