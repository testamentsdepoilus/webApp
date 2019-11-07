import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { createStyled, getParamConfig } from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/More";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

const { ResultListWrapper } = ReactiveList;

const Styled = createStyled(theme => ({
  root: {
    flexWrap: "wrap",
    margin: theme.spacing(1, 0, 0, 2)
  },
  paper: {
    width: "60%",
    border: "1px solid #dadce0",
    margin: "auto"
  },
  item: {
    textAlign: "justify",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: "#efebe9"
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
    color: "#0d47a1",
    fontSize: 26
  },
  icon: {
    fontSize: 20
  }
}));

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query_term: "",
      item: null
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
  }

  handleMoreClick(item) {
    return function(e) {
      //document.location.href = "/news/" + item["_id"];
      if (window.history.pushState) {
        window.history.pushState(
          "object or string",
          "Page Title",
          "/articles/" + item["_id"]
        );
        this.setState({
          item: item
        });
      } else {
        document.location.href = "/articles/" + item["_id"];
      }
    }.bind(this);
  }

  defaultQuery() {
    const query_term_ = this.state.query_term;
    if (query_term_ !== "") {
      return {
        query: {
          term: {
            _id: query_term_
          }
        }
      };
    } else {
      return {
        query: {
          term: {
            type: 1
          }
        }
      };
    }
  }

  componentDidUpdate() {
    const url = document.location.href;
    const idx = url.lastIndexOf("articles/");
    if (
      idx === -1 &&
      (Boolean(this.state.item) || this.state.query_term !== "")
    ) {
      this.setState({
        item: null,
        query_term: ""
      });
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("articles/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 5).split("/");
      this.setState({
        query_term: url_query.length > 0 && url_query[0] ? url_query[0] : ""
      });
    }
  }

  render() {
    const prevLink = document.referrer.includes("search?")
      ? "/search?" + document.referrer.split("?")[1]
      : "/search";
    const currLink = !Boolean(this.state.item) ? (
      <Link
        id="articles"
        key={1}
        color="textPrimary"
        component={RouterLink}
        to="/articles"
      >
        {" "}
        L'état de l'art{" "}
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
          L'état de l'art{" "}
        </Link>,
        <Typography color="textPrimary">{this.state.item["title"]}</Typography>
      ]
    );
    const navLink = (
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
          {currLink}
        </Breadcrumbs>
      </Paper>
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
              <div id="paper" className={classes.paper}>
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
            </div>
          ) : (
            <ReactiveBase
              app={getParamConfig("es_index_cms")}
              url={getParamConfig("es_host")}
              type="_doc"
            >
              <div id="root" className={classes.root}>
                {navLink}
                <div id="paper" className={classes.paper}>
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
              </div>
            </ReactiveBase>
          )
        }
      </Styled>
    );
  }
}

export default Articles;
