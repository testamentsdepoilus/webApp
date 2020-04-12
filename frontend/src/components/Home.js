import React, { Component } from "react";
import {
  ReactiveList,
  ReactiveBase,
  ReactiveComponent,
  SingleDropdownList
} from "@appbaseio/reactivesearch";
import {
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
  GridList
} from "@material-ui/core";
import DateFilter from "./search/DateFilter";
import MoreIcon from "@material-ui/icons/More";

import Footer from "./Footer";

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
        <div className="statsResults">
          {stats.numberOfResults} testaments sur {total[0]["testaments"]}{" "}
          correspondent à votre recherche
        </div>
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
      <div className="home">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                {Boolean(this.state.selectedArticle) ? (
                  <Paper className="item">
                    <h2 className="card_title">État de la recherche</h2>
                    <Typography className="title">
                      {" "}
                      {this.state.selectedArticle._source["title"]}{" "}
                    </Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          this.state.selectedArticle._source["summary"] !== ""
                            ? this.state.selectedArticle._source["summary"]
                            : this.state.selectedArticle._source["detail"]
                      }}
                    ></div>
                    <Paper className="foot">
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
                            <MoreIcon className="icon" />
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
                  <Paper className="item">
                    <h2 className="card_title">Actualités</h2>
                    <Typography className="title">
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
                    <Paper className="foot">
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
                            <MoreIcon className="icon" />
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
                <h2 className="card_title">Visualiser les données</h2>

                <iframe
                  className="chart"
                  id="chart"
                  title="visualisation"
                  src="http://patrimeph.ensea.fr/kibana7/app/kibana#/visualize/edit/ff5975f0-6530-11ea-8a32-c183c080aac8?embed=true&_g=()"
                ></iframe>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid item>
              <div className="images">
                <h2 className="card_title">Testaments à la une</h2>
                <GridList cols={4}>
                  {this.state.images.map(tile => (
                    <GridListTile key={tile._id}>
                      <a
                        href={
                          getParamConfig("web_url") + "/testament/" + tile._id
                        }
                      >
                        <img
                          src={
                            tile._source["will_pages"][0]["picture_url"] +
                            "/full/full/0/default.jpg"
                          }
                          alt={tile._source["will_pages"][0]["picture_url"]}
                          className="image"
                        />
                      </a>
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            </Grid>
            <div className="search">
              <ReactiveBase
                app={getParamConfig("es_index_wills")}
                url={getParamConfig("es_host")}
                type="_doc"
              >
                <Grid container direction="row" spacing={1}>
                  <Grid item xs={6}>
                    <div>
                      <Paper className="menuFilter">
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item>
                            <h2 className="card_title">
                              Rechercher un testament
                            </h2>
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
                                searchPlaceholder="Saisir un nom de testateur"
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
                                searchPlaceholder="Saisir un nom de lieu"
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
                              href={getParamConfig("web_url") + "/recherche"}
                              className="bt_plus"
                            >
                              {" "}
                              Plus de critères
                            </Link>
                          </Grid>
                        </Grid>
                      </Paper>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    {" "}
                    <div className="result">
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
                          className="home"
                          dataField=""
                          componentId="searchResult"
                          stream={true}
                          pagination={true}
                          size={10}
                          showResultStats={true}
                          infiniteScroll={false}
                          loader="Recherche en cours ..."
                          innerClass={{
                            resultsInfo: "resultsInfo",
                            pagination: "pagination"
                          }}
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
                                Testament de {" " + res["testator.forename"]}{" "}
                                <span style={{ fontVariantCaps: "small-caps" }}>
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
                              <div className="typography" key={res["_id"]}>
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
                                          className="typoName"
                                        >
                                          {res["testator.forename"] + " "}
                                          <span className="typoSurname">
                                            {res["testator.surname"]}
                                          </span>
                                        </Link>
                                      </Tooltip>
                                    }
                                  />
                                </ListItem>
                                <Divider variant="inset" />
                              </div>
                            );
                          }}
                        />
                      </Paper>
                    </div>
                  </Grid>
                </Grid>
                <Grid item>
                  <ReactiveComponent
                    className="mapSearch"
                    componentId="mapSearch"
                    react={{
                      and: [
                        "date_redaction",
                        "date_deces",
                        "lieu_deces",
                        "nom_testateur"
                      ]
                    }}
                    defaultQuery={() => ({
                      _source: [
                        "testator.forename",
                        "testator.surname",
                        "testator.ref",
                        "will_contents.death_place",
                        "will_contents.death_date",
                        "will_contents.death_place_norm",
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
                      let testators = data.map(item => item["testator.ref"]);
                      let data_ = data.filter((item, index) => {
                        return (
                          testators.indexOf(item["testator.ref"]) === index
                        );
                      });

                      data_.forEach(item => {
                        if (Boolean(item["will_contents.death_place_ref"])) {
                          if (
                            Boolean(
                              death_data[item["will_contents.death_place_ref"]]
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
                          page="home"
                        />
                      );
                    }}
                  />
                </Grid>
              </ReactiveBase>
            </div>
          </Grid>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default Home;
