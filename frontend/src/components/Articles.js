import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  getParamConfig,
  getHitsFromQuery,
  getTotalHits,
} from "../utils/functions";
import {
  Breadcrumbs,
  Box,
  Link,
  Grid,
  MenuList,
  MenuItem,
} from "@material-ui/core";

class Articles extends Component {
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
        getParamConfig("web_url") + "/articles/" + item["_id"];
    };
  }

  defaultQuery() {
    return {
      query: {
        term: {
          type: 1,
        },
      },
    };
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("articles/");
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
                type: 1,
              },
            },
            sort: [{ order: { order: "asc" } }],
          })
        )
          .then((data) => {
            if (idx !== -1) {
              const id_query = url.substring(idx + 9).split("/");
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
                  console.log("error: ", error);
                });
            } else {
              this.setState({
                data: data,
                selectedId: data.length > 0 ? data[0]["_id"] : "",
              });
            }
          })
          .catch((error) => {
            console.log("error: ", error);
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
        id="articles"
        key={0}
        color="textPrimary"
        component={RouterLink}
        to="/articles"
      >
        L'État de la recherche
      </Link>
    ) : (
      [
        <div key={1}>L'état de la recherche</div>,
        <div key={2}>{curItem._source["title"]}</div>,
      ]
    );
    const navLink = (
      <Breadcrumbs
        separator={<i className="fas fa-caret-right"></i>}
        aria-label="Breadcrumb"
        className="breadcrumbs"
      >
        <Link
          id="home"
          key={0}
          color="inherit"
          component={RouterLink}
          to="/accueil"
        >
          Accueil
        </Link>
        {currLink}
      </Breadcrumbs>
    );

    const menuArticles = (
      <Box 
        display={{xs: "none", sm: "block"}}
        className="leftMenu bg-gray">
        <h2 className="card-title bg-primaryMain text-uppercase">
          <i className="far fa-newspaper"></i> état de la recherche
        </h2>
        <MenuList>
          {this.state.data.map((item, i) => (
            <MenuItem key={i * 10}>
              <Link
                id={item["_id"]}
                className={
                  this.state.selectedId === item["_id"] ? "active" : ""
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
      </Box>
    );

    const date = Boolean(curItem) ? new Date(curItem._source["created"]) : null;
    return Boolean(curItem) ? (
      <div className="content item">
        {navLink}

        <Grid container direction="row" spacing={2}>
          <Grid item sm={4} md={3}>
            {menuArticles}
          </Grid>
          <Grid item sm={8} md={9} className="typography">
            <div className="bg-white" key={0}>
              <h1>{curItem._source["title"]} </h1>
              <Box
                className="bg-gray"
                display={{xs: "block", md: "flex"}}
                justifyContent="space-between"
              >
                <div className="authors fontWeightMedium text-secondaryMain">
                  {curItem._source["author"]}
                </div>
                <div className="date fontWeightMedium">
                  {Boolean(date)
                    ? "Mise à jour le " +
                      date.toLocaleDateString() +
                      " à " +
                      date.toLocaleTimeString()
                    : ""}
                </div>
              </Box>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    curItem._source["detail"] !== ""
                      ? curItem._source["detail"]
                      : curItem._source["summary"],
                }}
              ></div>
            </div>
          </Grid>
        </Grid>
      </div>
    ) : (
      <div className="text-error">Articles introuvables !</div>
    );
  }
}

export default Articles;
