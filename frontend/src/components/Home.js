import React, { Component } from "react";
import {
  ReactiveList,
  ReactiveBase,
  ReactiveComponent,
  SingleDropdownList,
  MultiList,
} from "@appbaseio/reactivesearch";
import {
  getTotalHits,
  getParamConfig,
  getHitsFromQuery,
} from "../utils/functions";
import GeoMap from "./search/GeoMap_bis";

import {
  ListItem,
  ListItemText,
  Tooltip,
  Link,
  Grid,
  Box,
  Paper,
  Button,
} from "@material-ui/core";
import DateFilter from "./search/DateFilter";
import ApexDonutChartWrapper from "../utils/ApexDonutChartWrapper";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chart_data: [],
      testator_name: "",
      place: "",
      selectedNews: null,
      selectedArticle: null,
      images: [],
    };
    this.chart = null;
    this.renderResultStats = this.renderResultStats.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleMoreNewClick = this.handleMoreNewClick.bind(this);
    this.handleMoreArticleClick = this.handleMoreArticleClick.bind(this);
    this.customQuery = this.customQuery.bind(this);
  }

  renderResultStats(stats) {
    const total = this.state.chart_data.filter(
      (item) => Object.keys(item)[0] === "testaments"
    );

    if (Boolean(total[0]["testaments"])) {
      return (
        <div className="countResults">
          {stats.numberOfResults} testaments sur {total[0]["testaments"]}{" "}
          correspondent à votre recherche
        </div>
      );
    } else {
      return ` ${stats.numberOfResults} testaments correspondent à votre recherche`;
    }
  }
  handleClear(value) {
    return function (event) {
      this.setState({
        [value]: "",
      });
    }.bind(this);
  }

  handleNameChange(value) {
    this.setState({
      testator_name:
        value === "" ? value : value.split("+")[1] + " " + value.split("+")[0],
    });
  }

  customQuery = function (value, props) {
    if (Boolean(value)) {
      return {
        query: {
          match: {
            "testator.name": {
              query: value,
              operator: "and",
            },
          },
        },
      };
    }
  };

  handlePlaceChange(value) {
    this.setState({
      place: value,
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
      .then((res) => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ testaments: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data,
          });
        }
      })
      .catch((e) => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators")
    )
      .then((res) => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ testateurs: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data,
          });
        }
      })
      .catch((e) => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_places")
    )
      .then((res) => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ lieux: total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data,
          });
        }
      })
      .catch((e) => {
        console.error("error :", e);
      });

    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_units")
    )
      .then((res) => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;
        this.state.chart_data.push({ "unités militaires": total });
        if (this.state.chart_data.length === 4) {
          this.setState({
            chart_data: this.state.chart_data,
          });
        }
      })
      .catch((e) => {
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
                  type: 2,
                },
              },
              {
                term: {
                  selected: true,
                },
              },
            ],
          },
        },
      })
    )
      .then((data) => {
        this.setState({
          selectedNews: data[0],
        });
      })
      .catch((error) => {
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
                  type: 1,
                },
              },
              {
                term: {
                  selected: true,
                },
              },
            ],
          },
        },
      })
    )
      .then((data) => {
        this.setState({
          selectedArticle: data[0],
        });
      })
      .catch((error) => {
        console.log("error :", error);
      });

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        size: 4,
        from: Math.floor(Math.random() * Math.floor(100)),
        _source: [
          "will_pages.picture_url",
          "will_identifier.cote",
          "testator.name",
        ],
        query: { match_all: {} },
      })
    )
      .then((data) => {
        this.setState({
          images: data,
        });
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }
  render() {
    return (
      <div className="home">
        <ReactiveBase
          app={getParamConfig("es_index_wills")}
          url={getParamConfig("es_host")}
          type="_doc"
        >
          <Grid container direction="row" spacing={5}>
            <Grid item xs={12} lg={4} className="rech_actu_viz">
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={4} lg={12} id="etat_recherche">
                  {Boolean(this.state.selectedArticle) ? (
                    <Paper className="card">
                      <h2 className="card-title">
                        <i className="fas fa-bullhorn"></i> État de la recherche
                      </h2>
                      <h3> {this.state.selectedArticle._source["title"]} </h3>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{
                          __html:
                            this.state.selectedArticle._source["summary"] !== ""
                              ? this.state.selectedArticle._source["summary"]
                              : this.state.selectedArticle._source["detail"],
                        }}
                      ></div>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          className="button outlined secondary-light"
                          aria-label="Lire la suite"
                          onClick={this.handleMoreArticleClick}
                        >
                          Lire la suite
                        </Button>
                      </Box>
                    </Paper>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} md={4} lg={12} id="actualites">
                  {Boolean(this.state.selectedNews) ? (
                    <Paper className="card">
                      <h2 className="card-title">
                        <i className="far fa-newspaper"></i> Actualités
                      </h2>
                      <h3> {this.state.selectedNews._source["title"]} </h3>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{
                          __html:
                            this.state.selectedNews._source["summary"] !== ""
                              ? this.state.selectedNews._source["summary"]
                              : this.state.selectedNews._source["detail"],
                        }}
                      ></div>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          className="button outlined secondary-light"
                          aria-label="Lire la suite"
                          onClick={this.handleMoreNewClick}
                        >
                          Lire la suite
                        </Button>
                      </Box>
                    </Paper>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} md={4} lg={12} id="visualisation">
                  <Paper className="card">
                    <h2 className="card-title">
                      <i className="far fa-chart-bar"></i> Visualiser les
                      données
                    </h2>

                    <ReactiveComponent
                      componentId="chart"
                      defaultQuery={() => ({
                        ...MultiList.generateQueryOptions({
                          dataField: "will_identifier.institution.keyword",
                          size: 20,
                          sortBy: "asc",
                        }),
                      })}
                      render={({ value, setQuery, aggregations }) => (
                        <ApexDonutChartWrapper
                          selectedValue={value}
                          aggregations={aggregations}
                          setQuery={setQuery}
                          dataField="will_identifier.institution.keyword"
                        />
                      )}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Grid item id="random_wills">
                <Paper className="card">
                  <h2 className="card-title">
                    <i className="fas fa-folder-open"></i> Quelques exemples de
                    testaments
                  </h2>
                  <Grid
                    container
                    direction="row"
                    align="center"
                    spacing={0}
                    className="random_wills"
                  >
                    {this.state.images.map((tile, i) => (
                      <Grid
                        className="card"
                        key={tile._id}
                        item
                        xs={12}
                        sm={6}
                        md={3}
                      >
                        <a
                          href={
                            getParamConfig("web_url") + "/testament/" + tile._id
                          }
                        >
                          <img
                            src={
                              tile._source["will_pages"][0]["picture_url"] +
                              "/full/pct:25/0/default.jpg"
                            }
                            alt={"image " + i}
                          />
                        </a>
                        <div>
                          <a
                            className="testatorName"
                            href={
                              getParamConfig("web_url") +
                              "/testament/" +
                              tile._id
                            }
                          >
                            {tile._source["testator.name"].split("+")[1] + " "}
                            <span className="text-uppercase">
                              {tile._source["testator.name"].split("+")[0]}
                            </span>
                          </a>
                          <div>Cote {tile._source["will_identifier.cote"]}</div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Box className="bg-light-gray" mt={2.5}>
                <Grid container direction="row" spacing={0}>
                  <Grid className="card searchForm" item xs={12} md={6}>
                    <h2 className="card-title">
                      <i className="fas fa-search"></i> Rechercher un testament
                    </h2>

                    <Box mb={0.7} mt={1.5}>
                      <label>Nom du testateur</label>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Box width="100%">
                        <SingleDropdownList
                          className="select"
                          react={{
                            and: [
                              "date_redaction",
                              "date_naissance",
                              "lieu_deces",
                            ],
                          }}
                          componentId="nom_testateur"
                          dataField="testator.name.keyword"
                          value={this.state.testator_name}
                          size={2000}
                          sortBy="asc"
                          showCount={false}
                          autosuggest={true}
                          URLParams={true}
                          loader="Chargement en cours..."
                          showSearch={true}
                          placeholder="Saisissez un nom de testateur"
                          searchPlaceholder="Saisissez un nom de testateur"
                          customQuery={this.customQuery}
                          renderItem={(label, count, isSelected) => (
                            <div>
                              {label.split("+")[1][0].toUpperCase() +
                                label.split("+")[1].slice(1) +
                                " "}
                              <span className="text-uppercase">
                                {label.split("+")[0]}
                              </span>
                            </div>
                          )}
                          innerClass={{
                            list: "list",
                            select:
                              this.state.testator_name === ""
                                ? "select"
                                : "select selected",
                          }}
                          onChange={this.handleNameChange}
                        />
                      </Box>
                      {this.state.testator_name !== "" ? (
                        <Button
                          id="testator_name"
                          value="testator_name"
                          onClick={this.handleClear("testator_name")}
                          title="Supprimer le filtre"
                          className="clear"
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>

                    <Box mb={0.7} mt={3}>
                      <label>Lieu de décès</label>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Box width="100%">
                        <SingleDropdownList
                          className="select"
                          react={{
                            and: [
                              "date_naissance",
                              "date_deces",
                              "date_redaction",
                              "nom_testateur",
                            ],
                          }}
                          componentId="lieu_deces"
                          dataField="will_contents.death_place_norm.keyword"
                          value={this.state.place}
                          size={1000}
                          sortBy="asc"
                          showCount={false}
                          autosuggest={true}
                          placeholder="Saisissez un nom de lieu"
                          URLParams={true}
                          loader="Chargement en cours..."
                          showSearch={true}
                          searchPlaceholder="Saisissez un nom de lieu"
                          innerClass={{
                            list: "list",
                            select:
                              this.state.place === ""
                                ? "select"
                                : "select selected",
                          }}
                          onChange={this.handlePlaceChange}
                        />
                      </Box>
                      {this.state.place !== "" ? (
                        <Button
                          id="place"
                          value="place"
                          onClick={this.handleClear("place")}
                          title="Supprimer le filtre"
                          className="clear"
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>

                    <DateFilter />

                    <Box mt={2} display="flex" justifyContent="center">
                      <Link
                        href={getParamConfig("web_url") + "/recherche"}
                        className="button moreCriteria outlined secondary-light bg-white text-primaryMain"
                      >
                        {" "}
                        <i className="fas fa-plus-circle"></i> Plus de critères
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item className="card searchResults" xs={12} md={6}>
                    {" "}
                    <ReactiveList
                      react={{
                        and: [
                          "date_naissance",
                          "date_deces",
                          "date_redaction",
                          "nom_testateur",
                          "lieu_deces",
                        ],
                      }}
                      dataField=""
                      componentId="searchResult"
                      stream={true}
                      pagination={true}
                      size={10}
                      showResultStats={true}
                      infiniteScroll={false}
                      loader="Recherche en cours..."
                      innerClass={{
                        resultsInfo: "resultsInfo",
                        pagination: "pagination",
                      }}
                      renderResultStats={this.renderResultStats}
                      renderItem={function (res) {
                        let title_testator = (
                          <p>
                            Testament de {" " + res["testator.forename"]}{" "}
                            <span className="text-uppercase">
                              {res["testator.surname"]}
                            </span>
                            <span>
                              {" "}
                              {Boolean(res["will_contents.will_date_text"])
                                ? " rédigé le " +
                                  res["will_contents.will_date_text"]
                                : ""}
                            </span>
                          </p>
                        );
                        return (
                          <ListItem
                            key={res["_id"]}
                            alignItems="flex-start"
                            component="div"
                            className="resultLine"
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
                                  >
                                    {res["testator.forename"] + " "}
                                    <span className="text-uppercase">
                                      {res["testator.surname"]}
                                    </span>
                                  </Link>
                                </Tooltip>
                              }
                            />
                          </ListItem>
                        );
                      }}
                    />
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <ReactiveComponent
                    className="mapSearch"
                    componentId="mapSearch"
                    react={{
                      and: [
                        "date_redaction",
                        "date_deces",
                        "lieu_deces",
                        "nom_testateur",
                      ],
                    }}
                    defaultQuery={() => ({
                      _source: [
                        "testator.forename",
                        "testator.surname",
                        "testator.ref",
                        "will_contents.death_place",
                        "will_contents.death_date",
                        "will_contents.death_place_norm",
                        "will_contents.death_place_ref",
                      ],
                      size: 1000,
                      query: {
                        match_all: {},
                      },
                    })}
                    render={({ data }) => {
                      let birth_data = {};
                      let death_data = {};
                      let testators = data.map((item) => item["testator.ref"]);
                      let data_ = data.filter((item, index) => {
                        return (
                          testators.indexOf(item["testator.ref"]) === index
                        );
                      });

                      data_.forEach((item) => {
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
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ReactiveBase>
      </div>
    );
  }
}

export default Home;
