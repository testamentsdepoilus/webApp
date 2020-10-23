import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  getParamConfig,
  getHitsFromQuery,
  getTotalHits,
} from "../utils/functions";
import {
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  MenuList,
  MenuItem,
  Box,
} from "@material-ui/core";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedId: "",
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    /*const itemFind = this.state.lastNews.find(function (item) {
          return item["_id"] === event.target.id;
        });*/

    this.setState({
      selectedId: event.target.id,
    });
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("apropos/");

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    ).then((res) => {
      const total = typeof res === "object" ? res.value : res;
      console.log("total :", total);
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
        JSON.stringify({
          size: total,
          query: {
            term: {
              type: 3,
            },
          },
          sort: [{ order: { order: "asc" } }],
        })
      )
        .then((data) => {
          if (idx !== -1) {
            const id_query = url.substring(idx + 8).split("/");
            getHitsFromQuery(
              getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
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
                  selectedId: hits.length > 0 ? hits[0]["_id"] : data[0]["_id"],
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

    const currLink = [
      <div>À propos</div>,
      <div key={2}>{curItem ? curItem._source["title"] : null}</div>,
    ];

    const navBar = (
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

    const menuAbout = (
      <Box display={{ xs: "none", sm: "block" }} className="leftMenu bg-gray">
        <h2 className="card-title bg-primaryMain text-uppercase">
          <i className="far fa-newspaper"></i> à propos
        </h2>
        <MenuList>
          {this.state.data.map((item, i) => (
            <MenuItem key={i + 10}>
              <Link
                id={item["_id"]}
                className={
                  this.state.selectedId === item["_id"] ? "active" : ""
                }
                component={RouterLink}
                to={"/apropos/" + item["_id"]}
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
        {navBar}

        <Grid container direction="row" spacing={2}>
          <Grid item sm={4} md={3}>
            {menuAbout}
          </Grid>
          <Grid item sm={8} md={9} className="typography">
            <div className="typography">
              <div className="bg-white" key={0}>
                <h1>{curItem._source["title"]} </h1>
                <Box
                  className="bg-gray"
                  display={{ xs: "block", md: "flex" }}
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
            </div>
          </Grid>
        </Grid>
      </div>
    ) : (
      <Typography variant="h4">À PROPOS</Typography>
    );
  }
}

export default About;
