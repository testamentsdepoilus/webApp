import React, { Component } from "react";
import classNames from "classnames";
import {
  ReactiveList,
  ReactiveBase,
  ReactiveComponent,
  SingleDropdownList
} from "@appbaseio/reactivesearch";
import {
  createStyled,
  getTotalHits,
  getParamConfig,
  getHitsFromQuery
} from "../utils/functions";
import GeoMap from "./search/GeoMap_bis";
import ClearIcon from "@material-ui/icons/Clear";

import {
  ListItem,
  ListItemText,
  Tooltip,
  Link,
  Divider,
  Grid,
  Paper,
  Typography,
  IconButton,
  GridListTile,
  GridList,
  ListSubheader
} from "@material-ui/core";
import DateFilter from "./search/DateFilter";
import MoreIcon from "@material-ui/icons/More";
import ApexCharts from "apexcharts";

const Styled = createStyled(theme => ({
  root: {
    padding: theme.spacing(2),
    display: "block",
    width: "80%",
    margin: "auto",
    marginTop: theme.spacing(3)
  },
  search: {},
  result: {
    border: "1px solid"
  },
  statsResults: {
    border: "1px solid",
    margin: "auto"
  },
  menuFilter: {
    padding: theme.spacing(1),

    flexGrow: 1
  },
  bt_plus: {
    textDecoration: "none",
    boxShadow: "none",
    textTransform: "none",
    fontSize: "1rem",
    padding: "6px 12px",
    border: "1px solid",
    backgroundColor: "#81d4fa",
    color: "black",
    borderColor: "#81d4fa",
    marginTop: theme.spacing(5),
    "&:hover": {
      textDecoration: "none",
      backgroundColor: "#4fc3f7",
      borderColor: "#4fc3f7",
      boxShadow: "none"
    },
    "&:active": {
      textDecoration: "none",
      boxShadow: "none",
      backgroundColor: "#4fc3f7",
      borderColor: "#005cbf"
    }
  },
  chart: {
    marginTop: theme.spacing(10),
    alignItems: "center"
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  image: {
    width: "100%",
    height: "100%"
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  },
  typoName: {
    fontSize: "1rem",
    fontStyle: "oblique",
    color: "#424242"
  },
  typoSurname: {
    fontWeight: 600,
    fontVariantCaps: "small-caps"
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
  title: {
    color: "#000000",
    fontSize: "1.5em"
  }
}));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chart_data: [],
      testator_name: "",
      place: "",
      selectedNews: null,
      selectedArticle: null,
      images: []
    };
    this.chart = null;
    this.renderResultStats = this.renderResultStats.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleMoreNewClick = this.handleMoreNewClick.bind(this);
    this.handleMoreArticleClick = this.handleMoreArticleClick.bind(this);
  }

  renderResultStats(stats) {
    const total = this.state.chart_data.filter(
      item => Object.keys(item)[0] === "testaments"
    );

    if (Boolean(total[0]["testaments"])) {
      return (
        <Styled>
          {({ classes }) => (
            <div className={classes.statsResults}>
              {stats.numberOfResults} testaments sur {total[0]["testaments"]}{" "}
              correspondent à votre recherche
            </div>
          )}
        </Styled>
      );
    } else {
      return ` ${stats.numberOfResults} testaments correspondent à votre recherche`;
    }
  }
  handleClear(value) {
    return function(event) {
      this.setState({
        [value]: ""
      });
    }.bind(this);
  }

  handleNameChange(value) {
    this.setState({
      testator_name: value
    });
  }

  handlePlaceChange(value) {
    this.setState({
      place: value
    });
  }

  handleMoreNewClick() {
    document.location.href =
      getParamConfig("web_url") + "/news/" + this.state.selectedNews["_id"];
  }

  handleMoreArticleClick() {
    document.location.href =
      getParamConfig("web_url") +
      "/articles/" +
      this.state.selectedArticle["_id"];
  }

  componentDidUpdate() {
    if (!Boolean(this.chart) && this.state.chart_data.length === 4) {
      let series = this.state.chart_data.map(item => Object.values(item)[0]);
      let labels = this.state.chart_data.map(item => Object.keys(item)[0]);

      var options = {
        chart: {
          type: "pie"
        },
        series: series,
        labels: labels
      };

      this.chart = new ApexCharts(document.querySelector("#chart"), options);

      this.chart.render();
    }
  }
  componentDidMount() {
    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills")
    )
      .then(res => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ testaments: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data
          });
        }
      })
      .catch(e => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators")
    )
      .then(res => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ testateurs: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data
          });
        }
      })
      .catch(e => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_places")
    )
      .then(res => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ lieux: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data
          });
        }
      })
      .catch(e => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_units")
    )
      .then(res => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ "unités militaires": total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data
          });
        }
      })
      .catch(e => {
        console.error("error :", e);
      });

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
      JSON.stringify({
        size: 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  type: 2
                }
              },
              {
                term: {
                  selected: true
                }
              }
            ]
          }
        }
      })
    )
      .then(data => {
        this.setState({
          selectedNews: data[0]
        });
      })
      .catch(error => {
        console.log("error :", error);
      });

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
      JSON.stringify({
        size: 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  type: 1
                }
              },
              {
                term: {
                  selected: true
                }
              }
            ]
          }
        }
      })
    )
      .then(data => {
        this.setState({
          selectedArticle: data[0]
        });
      })
      .catch(error => {
        console.log("error :", error);
      });

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        size: 4,
        from: Math.floor(Math.random() * Math.floor(100)),
        _source: ["will_pages.picture_url"],
        query: { match_all: {} }
      })
    )
      .then(data => {
        this.setState({
          images: data
        });
      })
      .catch(error => {
        console.log("error :", error);
      });
  }
  render() {
    const date_news = Boolean(this.state.selectedNews)
      ? new Date(this.state.selectedNews._source["created"])
      : null;
    const date_article = Boolean(this.state.selectedArticle)
      ? new Date(this.state.selectedArticle._source["created"])
      : null;
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={8}>
                <div className={classes.search}>
                  <ReactiveBase
                    app={getParamConfig("es_index_wills")}
                    url={getParamConfig("es_host")}
                    type="_doc"
                  >
                    <Grid container direction="row" spacing={1}>
                      <Grid item xs={6}>
                        {" "}
                        <div className={classes.result}>
                          <Paper>
                            <ReactiveList
                              react={{
                                and: [
                                  "date_naissance",
                                  "date_deces",
                                  "date_redaction",
                                  "nom_testateur",
                                  "lieu_deces"
                                ]
                              }}
                              dataField=""
                              componentId="searchResult"
                              stream={true}
                              pagination={true}
                              size={10}
                              showResultStats={true}
                              infiniteScroll={false}
                              loader="Recherche en cours ..."
                              renderResultStats={this.renderResultStats}
                              renderItem={function(res) {
                                let will_date = Boolean(
                                  res["will_contents.will_date"]
                                )
                                  ? new Date(res["will_contents.will_date"])
                                  : null;
                                will_date = Boolean(will_date)
                                  ? will_date.toLocaleDateString()
                                  : null;
                                let title_testator = (
                                  <p>
                                    Testament de{" "}
                                    {" " + res["testator.forename"]}{" "}
                                    <span
                                      style={{ fontVariantCaps: "small-caps" }}
                                    >
                                      {res["testator.surname"]}
                                    </span>
                                    <span>
                                      {" "}
                                      {Boolean(will_date)
                                        ? " rédigé le " + will_date
                                        : ""}{" "}
                                    </span>
                                  </p>
                                );
                                return (
                                  <Styled key={res["_id"]}>
                                    {({ classes }) => (
                                      <div>
                                        <ListItem
                                          alignItems="flex-start"
                                          component="div"
                                        >
                                          <ListItemText
                                            primary={
                                              <Tooltip title={title_testator}>
                                                <Link
                                                  href={
                                                    getParamConfig("web_url") +
                                                    "/testament/" +
                                                    res["_id"]
                                                  }
                                                  aria-label="More"
                                                  className={classNames(
                                                    classes.typoName,
                                                    classes.typography
                                                  )}
                                                >
                                                  {res["testator.forename"] +
                                                    " "}
                                                  <span
                                                    className={classNames(
                                                      classes.typoName,
                                                      classes.typography,
                                                      classes.typoSurname
                                                    )}
                                                  >
                                                    {res["testator.surname"]}
                                                  </span>
                                                </Link>
                                              </Tooltip>
                                            }
                                          />
                                        </ListItem>
                                        <Divider variant="inset" />
                                      </div>
                                    )}
                                  </Styled>
                                );
                              }}
                            />
                          </Paper>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div>
                          <Paper className={classes.menuFilter}>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              spacing={2}
                            >
                              <Grid item>
                                <Typography> Rechercher :</Typography>
                              </Grid>
                              <Grid item container direction="row" spacing={1}>
                                <Grid item xs={10}>
                                  <SingleDropdownList
                                    className="datasearch"
                                    react={{
                                      and: [
                                        "date_redaction",
                                        "date_naissance",
                                        "lieu_deces"
                                      ]
                                    }}
                                    componentId="nom_testateur"
                                    dataField="testator.name.keyword"
                                    value={this.state.testator_name}
                                    size={1000}
                                    sortBy="asc"
                                    showCount={false}
                                    autosuggest={true}
                                    placeholder="Nom du testateur"
                                    URLParams={true}
                                    loader="En chargement ..."
                                    showSearch={true}
                                    searchPlaceholder="Taper le nom ici"
                                    innerClass={{
                                      list: "list"
                                    }}
                                    onChange={this.handleNameChange}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    id="testator_name"
                                    value="testator_name"
                                    onClick={this.handleClear("testator_name")}
                                    title="Supprimer le filtre"
                                  >
                                    <ClearIcon style={{ color: "red" }} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              <Grid
                                item
                                container
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Grid item xs={10}>
                                  <SingleDropdownList
                                    className="datasearch"
                                    react={{
                                      and: [
                                        "date_naissance",
                                        "date_deces",
                                        "date_redaction",
                                        "nom_testateur"
                                      ]
                                    }}
                                    componentId="lieu_deces"
                                    dataField="will_contents.death_place_norm.keyword"
                                    value={this.state.place}
                                    size={1000}
                                    sortBy="asc"
                                    showCount={false}
                                    autosuggest={true}
                                    placeholder="Lieu de décès"
                                    URLParams={true}
                                    loader="En chargement ..."
                                    showSearch={true}
                                    searchPlaceholder="Taper le cote ici"
                                    innerClass={{
                                      list: "list"
                                    }}
                                    onChange={this.handlePlaceChange}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    id="place"
                                    value="place"
                                    onClick={this.handleClear("place")}
                                    title="Supprimer le filtre"
                                  >
                                    <ClearIcon style={{ color: "red" }} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <DateFilter />
                              </Grid>
                              <Grid item>
                                <Link
                                  href={
                                    getParamConfig("web_url") + "/recherche"
                                  }
                                  className={classes.bt_plus}
                                >
                                  {" "}
                                  Plus de critères
                                </Link>
                              </Grid>
                            </Grid>
                          </Paper>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container direction="row">
                      <Grid item xs={6}>
                        <ReactiveComponent
                          componentId="mapSearch"
                          react={{
                            and: [
                              "date_naissance",
                              "date_redaction",
                              "date_deces",
                              "lieu_deces",
                              "nom_testateur"
                            ]
                          }}
                          defaultQuery={() => ({
                            _source: [
                              "will_contents.birth_place",
                              "testator.forename",
                              "testator.surname",
                              "testator.ref",
                              "will_contents.death_place",
                              "will_contents.death_date",
                              "will_contents.birth_date",
                              "will_contents.birth_place_norm",
                              "will_contents.death_place_norm",
                              "will_contents.birth_place_ref",
                              "will_contents.death_place_ref"
                            ],
                            size: 1000,
                            query: {
                              match_all: {}
                            }
                          })}
                          render={({ data }) => {
                            let birth_data = {};
                            let death_data = {};

                            data.forEach(item => {
                              if (
                                Boolean(item["will_contents.birth_place_ref"])
                              ) {
                                if (
                                  Boolean(
                                    birth_data[
                                      item["will_contents.birth_place_ref"]
                                    ]
                                  )
                                ) {
                                  birth_data[
                                    item["will_contents.birth_place_ref"]
                                  ].push(item);
                                } else {
                                  birth_data[
                                    item["will_contents.birth_place_ref"]
                                  ] = [];
                                  birth_data[
                                    item["will_contents.birth_place_ref"]
                                  ].push(item);
                                }
                              }
                              if (
                                Boolean(item["will_contents.death_place_ref"])
                              ) {
                                if (
                                  Boolean(
                                    death_data[
                                      item["will_contents.death_place_ref"]
                                    ]
                                  )
                                ) {
                                  death_data[
                                    item["will_contents.death_place_ref"]
                                  ].push(item);
                                } else {
                                  death_data[
                                    item["will_contents.death_place_ref"]
                                  ] = [];
                                  death_data[
                                    item["will_contents.death_place_ref"]
                                  ].push(item);
                                }
                              }
                            });

                            return (
                              <GeoMap
                                birth_data={birth_data}
                                death_data={death_data}
                              />
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <div id="chart" className={classes.chart}></div>
                      </Grid>
                    </Grid>
                  </ReactiveBase>
                </div>
              </Grid>
              <Grid item xs={4}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    {Boolean(this.state.selectedArticle) ? (
                      <Paper className={classes.item}>
                        <Typography className={classes.title}>
                          {" "}
                          {this.state.selectedArticle._source["title"]}{" "}
                        </Typography>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              this.state.selectedArticle._source["summary"] !==
                              ""
                                ? this.state.selectedArticle._source["summary"]
                                : this.state.selectedArticle._source["detail"]
                          }}
                        ></div>
                        <Paper className={classes.foot}>
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              {this.state.selectedArticle._source["author"]}
                            </Grid>
                            <Grid item>
                              {"Mise à jour le "}
                              {date_article.toLocaleDateString()}
                              {" à "}
                              {date_article.toLocaleTimeString()}
                            </Grid>
                            <Grid item>
                              <IconButton
                                aria-label="More"
                                onClick={this.handleMoreArticleClick}
                              >
                                <MoreIcon className={classes.icon} />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Paper>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item>
                    {Boolean(this.state.selectedNews) ? (
                      <Paper className={classes.item}>
                        <Typography className={classes.title}>
                          {" "}
                          {this.state.selectedNews._source["title"]}{" "}
                        </Typography>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              this.state.selectedNews._source["summary"] !== ""
                                ? this.state.selectedNews._source["summary"]
                                : this.state.selectedNews._source["detail"]
                          }}
                        ></div>
                        <Paper className={classes.foot}>
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              {this.state.selectedNews._source["author"]}
                            </Grid>
                            <Grid item>
                              {"Mise à jour le "}
                              {date_news.toLocaleDateString()}
                              {" à "}
                              {date_news.toLocaleTimeString()}
                            </Grid>
                            <Grid item>
                              <IconButton
                                aria-label="More"
                                onClick={this.handleMoreNewClick}
                              >
                                <MoreIcon className={classes.icon} />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Paper>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item>
                    <div className={classes.images}>
                      <GridList>
                        <GridListTile
                          key="Subheader"
                          cols={2}
                          style={{ height: "auto" }}
                        >
                          <ListSubheader component="div">Images</ListSubheader>
                        </GridListTile>
                        {this.state.images.map(tile => (
                          <GridListTile key={tile._id}>
                            <a
                              href={
                                getParamConfig("web_url") +
                                "/testament/" +
                                tile._id
                              }
                            >
                              <img
                                src={
                                  tile._source["will_pages"][0]["picture_url"] +
                                  "/full/full/0/default.jpg"
                                }
                                alt={
                                  tile._source["will_pages"][0]["picture_url"]
                                }
                                className={classes.image}
                              />
                            </a>
                          </GridListTile>
                        ))}
                      </GridList>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
      </Styled>
    );
  }
}

export default Home;
