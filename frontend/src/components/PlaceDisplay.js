import React, { Component } from "react";

import {
  getParamConfig,
  getHitsFromQuery,
  getUserToken,
  updateMyListWills,
  generatePDF,
  downloadFile
} from "../utils/functions";
import {
  Paper,
  Typography,
  Grid,
  Link,
  IconButton,
  Tooltip,
  CircularProgress
} from "@material-ui/core";

import GeoMap from "../utils/GeoMap";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartOutlined";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartOutlined";

export default class PlaceDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birth_hits: [],
      death_hits: [],
      residence_hits: [],
      redaction_hits: [],
      place_id: this.props.id,
      myPlaces: [],
      isLoading: false
    };

    this.months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ];
    this.userToken = getUserToken();
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleAddShoppingWill = this.handleAddShoppingWill.bind(this);
    this.handleremoveShoppingWill = this.handleremoveShoppingWill.bind(this);
  }

  handleExportClick() {
    let map_div = document.getElementById("map-container");
    map_div.style.display = "none";

    let lieu_div = document.getElementById("lieu_notice").innerHTML;

    this.setState({
      isLoading: true
    });
    const inputItem = {
      outputHtml: lieu_div,
      filename: "Projet_TdP_lieu_" + this.props.id
    };

    generatePDF(inputItem)
      .then(res => {
        if (res.status === 200) {
          map_div.style.display = "block";
          downloadFile(
            getParamConfig("web_url") +
              "/outputPDF/" +
              inputItem.filename +
              ".pdf",
            inputItem.filename + ".pdf"
          );
        } else {
          console.log(res);
        }
        this.setState({
          isLoading: false
        });
      })
      .catch(e => {
        map_div.style.display = "block";
        this.setState({
          isLoading: false
        });
        console.log(e);
      });
  }

  handleAddShoppingWill(id) {
    return function(e) {
      let myPlaces_ = this.state.myPlaces;
      myPlaces_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myPlaces"] = myPlaces_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };

      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myPlaces: myPlaces_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function(e) {
      let myPlaces_ = this.state.myPlaces.filter(item => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myPlaces"] = myPlaces_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };
      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myPlaces: myPlaces_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  componentDidUpdate() {
    let cur_id =
      this.state.birth_hits.length > 0
        ? this.state.birth_hits[0]._source["birth.place.ref"]
        : null;
    cur_id = Boolean(cur_id)
      ? cur_id
      : this.state.death_hits.length > 0
      ? this.state.death_hits[0]._source["death.place.ref"]
      : null;
    cur_id = Boolean(cur_id)
      ? cur_id
      : this.state.residence_hits.length > 0
      ? this.state.residence_hits[0]._source["residence.ref"]
      : null;
    cur_id = Boolean(cur_id)
      ? cur_id
      : this.state.redaction_hits.length > 0
      ? this.state.redaction_hits[0]._source["will_place_ref"]
      : null;

    if (cur_id !== this.props.id) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "birth.place.ref": this.props.id
            }
          }
        })
      ).then(hits => {
        if (hits.length > 0) {
          this.setState({
            birth_hits: hits
          });
        } else {
          if (this.state.birth_hits.length > 0) {
            this.setState({
              birth_hits: []
            });
          }
        }
      });
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "death.place.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              death_hits: hits
            });
          } else {
            if (this.state.death_hits.length > 0) {
              this.setState({
                death_hits: []
              });
            }
          }
        })
        .catch(err => console.log("erreur :", err));
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "residence.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              residence_hits: hits
            });
          } else {
            if (this.state.residence_hits.length > 0) {
              this.setState({
                residence_hits: []
              });
            }
          }
        })
        .catch(err => console.log("erreur :", err));
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "will_contents.will_place_ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              redaction_hits: hits
            });
          } else {
            if (this.state.redaction_hits.length > 0) {
              this.setState({
                redaction_hits: []
              });
            }
          }
        })
        .catch(err => console.log("erreur :", err));
    }
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "birth.place.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            birth_hits: hits
          });
        }
      })
      .catch(err => console.log("erreur :", err));
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "death.place.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            death_hits: hits
          });
        }
      })
      .catch(err => console.log("erreur :", err));
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "residence.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            residence_hits: hits
          });
        }
      })
      .catch(err => console.log("erreur :", err));

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "will_contents.will_place_ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            redaction_hits: hits
          });
        }
      })
      .catch(err => console.log("erreur :", err));

    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myPlaces_ = Boolean(myBackups_["myPlaces"])
        ? myBackups_["myPlaces"]
        : [];
      this.setState({
        myPlaces: myPlaces_
      });
    }
  }

  render() {
    let output = null;
    if (this.props.data) {
      const place_uri = getParamConfig("web_url") + "/place/" + this.props.id;
      const isAdded = Boolean(this.userToken)
        ? this.state.myPlaces.findIndex(el => el === this.props.id)
        : -1;
      output = (
        <div className="placeDisplay">
          <Grid container direction="row">
            <Grid item xs={this.props.resultList ? 4 : 0}>
              {this.props.resultList}
            </Grid>
            <Grid item xs={this.props.resultList ? 8 : 12}>
              <Grid container direction="column" justify="flex-start">
                <Grid key={3} item>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item>
                      <IconButton
                        id="btExport"
                        aria-label="Export"
                        title="Exporter la notice des lieux"
                        onClick={this.handleExportClick}
                      >
                        <ExportIcon fontSize="large" />
                      </IconButton>
                      {Boolean(this.state.isLoading) ? (
                        <CircularProgress />
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item>
                      {Boolean(this.userToken) ? (
                        isAdded === -1 ? (
                          <Tooltip
                            title="Ajouter aux favoris"
                            placement="bottom"
                            style={{ cursor: "hand" }}
                          >
                            <IconButton
                              onClick={this.handleAddShoppingWill(
                                this.props.id
                              )}
                            >
                              <AddShoppingCartIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Supprimer du panier"
                            placement="bottom"
                            style={{ cursor: "hand" }}
                          >
                            <IconButton
                              onClick={this.handleremoveShoppingWill(
                                this.props.id
                              )}
                            >
                              <RemoveShoppingCartIcon color="action" />
                            </IconButton>
                          </Tooltip>
                        )
                      ) : (
                        <Tooltip
                          title="Connectez-vous pour ajouter ce testament à vos favoris !"
                          arrow={true}
                        >
                          <span>
                            <IconButton aria-label="addShop" disabled>
                              <AddShoppingCartIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid key={2} item>
                  <div className="root_place">
                    <Paper id="lieu_notice" className="lieu_notice">
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <h1 className="item">
                            {this.props.data["city"]}
                            {" ("}
                            {Boolean(this.props.data["region"])
                              ? this.props.data["region"] + " - "
                              : ""}
                            {Boolean(this.props.data["country"])
                              ? this.props.data["country"] + ")"
                              : ""}
                          </h1>
                          <Typography className="text">
                            Permalien dans l'édition numérique :{" "}
                            <Link
                              href={place_uri}
                              target="_blank"
                              className="urlPlace"
                            >
                              {place_uri}
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Grid container direction="row">
                            <Grid item xs={6}>
                              {Boolean(this.props.data["geo_ref"]) ? (
                                <Typography className="text">
                                  Voir ce lieu dans la base GeoNames :{" "}
                                  <Link
                                    href={this.props.data["geo_ref"]}
                                    target="_blank"
                                  >
                                    {this.props.data["geo_ref"]}
                                  </Link>
                                </Typography>
                              ) : (
                                ""
                              )}
                              {this.state.birth_hits.length > 0 ? (
                                <div>
                                  <Typography className="text">
                                    Lieu de naissance
                                    {this.state.birth_hits.length > 1
                                      ? " des Poilus suivants :"
                                      : " du Poilu suivant :"}{" "}
                                  </Typography>
                                  <ul>
                                    {this.state.birth_hits.map((hit, i) => {
                                      let date = Boolean(
                                        hit._source["birth.date"]
                                      )
                                        ? new Date(hit._source["birth.date"])
                                        : null;

                                      date = Boolean(date)
                                        ? date.toLocaleDateString().split("/")
                                        : null;

                                      return (
                                        <li key={i} className="text">
                                          <Link
                                            href={
                                              getParamConfig("web_url") +
                                              "/testateur/" +
                                              hit._id
                                            }
                                            target="_blank"
                                          >
                                            {hit._source[
                                              "persName.fullIndexEntryForm.forename"
                                            ]
                                              .toString()
                                              .replace(/,/g, " ") + " "}
                                            <span
                                              style={{
                                                fontVariantCaps: "small-caps"
                                              }}
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullIndexEntryForm.surname"
                                                ]
                                              }
                                            </span>

                                            {Boolean(date)
                                              ? ", né le " +
                                                date[0] +
                                                " " +
                                                this.months[date[1] - 1] +
                                                " " +
                                                date[2]
                                              : " "}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.residence_hits.length > 0 ? (
                                <div>
                                  <Typography className="text">
                                    Lieu de résidence
                                    {this.state.residence_hits.length > 1
                                      ? " des Poilus suivants :"
                                      : " du Poilu suivant :"}{" "}
                                  </Typography>

                                  <ul>
                                    {this.state.residence_hits.map((hit, i) => {
                                      return (
                                        <li key={i} className="text">
                                          <Link
                                            href={
                                              getParamConfig("web_url") +
                                              "/testateur/" +
                                              hit["_id"]
                                            }
                                            target="_blank"
                                          >
                                            {hit._source[
                                              "persName.fullIndexEntryForm.forename"
                                            ]
                                              .toString()
                                              .replace(/,/g, " ") + " "}
                                            <span
                                              style={{
                                                fontVariantCaps: "small-caps"
                                              }}
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullIndexEntryForm.surname"
                                                ]
                                              }
                                            </span>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.redaction_hits.length > 0 ? (
                                <div>
                                  <Typography className="text">
                                    Lieu de rédaction
                                    {this.state.redaction_hits.length > 1
                                      ? " des testaments suivants :"
                                      : " du testament suivant :"}{" "}
                                  </Typography>

                                  <ul>
                                    {this.state.redaction_hits.map((hit, i) => {
                                      let will_date = [];
                                      if (
                                        Boolean(
                                          hit._source[
                                            "will_contents.will_date_range"
                                          ]
                                        )
                                      ) {
                                        let date_ = new Date(
                                          hit._source[
                                            "will_contents.will_date_range"
                                          ]["gte"]
                                        );
                                        will_date.push(
                                          date_.toLocaleDateString().split("/")
                                        );
                                        if (
                                          hit._source[
                                            "will_contents.will_date_range"
                                          ]["gte"] !==
                                          hit._source[
                                            "will_contents.will_date_range"
                                          ]["lte"]
                                        ) {
                                          date_ = new Date(
                                            hit._source[
                                              "will_contents.will_date_range"
                                            ]["lte"]
                                          );
                                          will_date.push(
                                            date_
                                              .toLocaleDateString()
                                              .split("/")
                                          );
                                        }
                                      }
                                      //console.log(will_date);
                                      return (
                                        <li key={i} className="text">
                                          <Link
                                            href={
                                              getParamConfig("web_url") +
                                              "/testament/" +
                                              hit["_id"]
                                            }
                                            target="_blank"
                                          >
                                            {" "}
                                            Testament de
                                            {" " +
                                              hit._source["testator.forename"]
                                                .toString()
                                                .replace(/,/g, " ") +
                                              " "}
                                            <span
                                              style={{
                                                fontVariantCaps: "small-caps"
                                              }}
                                            >
                                              {hit._source["testator.surname"]}
                                            </span>
                                            {will_date.length === 1
                                              ? ", rédigé le " +
                                                will_date[0][0] +
                                                " " +
                                                this.months[
                                                  will_date[0][1] - 1
                                                ] +
                                                " " +
                                                will_date[0][2]
                                              : will_date.length === 2
                                              ? ", rédigé le " +
                                                will_date[0][0] +
                                                " " +
                                                this.months[
                                                  will_date[0][1] - 1
                                                ] +
                                                " " +
                                                will_date[0][2] +
                                                " et " +
                                                will_date[1][0] +
                                                " " +
                                                this.months[
                                                  will_date[1][1] - 1
                                                ] +
                                                " " +
                                                will_date[1][2]
                                              : ""}{" "}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}

                              {this.state.death_hits.length > 0 ? (
                                <div>
                                  <Typography className="text">
                                    Lieu de décès
                                    {this.state.death_hits.length > 1
                                      ? " des Poilus suivants :"
                                      : " du Poilu suivant :"}{" "}
                                  </Typography>

                                  <ul>
                                    {this.state.death_hits.map((hit, i) => {
                                      let death_date = [];

                                      if (Boolean(hit._source["death.date"])) {
                                        if (
                                          Array.isArray(
                                            hit._source["death.date"]
                                          )
                                        ) {
                                          death_date = hit._source[
                                            "death.date"
                                          ].map(item => {
                                            const date = new Date(item);
                                            return date
                                              .toLocaleDateString()
                                              .split("/");
                                          });
                                        } else {
                                          const date = new Date(
                                            hit._source["death.date"]
                                          );
                                          death_date.push(
                                            date.toLocaleDateString().split("/")
                                          );
                                        }
                                      }

                                      return (
                                        <li key={i} className="text">
                                          <Link
                                            href={
                                              getParamConfig("web_url") +
                                              "/testateur/" +
                                              hit["_id"]
                                            }
                                            target="_blank"
                                          >
                                            {hit._source[
                                              "persName.fullIndexEntryForm.forename"
                                            ]
                                              .toString()
                                              .replace(/,/g, " ") + " "}
                                            <span
                                              style={{
                                                fontVariantCaps: "small-caps"
                                              }}
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullIndexEntryForm.surname"
                                                ]
                                              }
                                            </span>
                                            {death_date.length > 0
                                              ? ", décédé le " +
                                                death_date[0][0] +
                                                " " +
                                                this.months[
                                                  death_date[0][1] - 1
                                                ] +
                                                " " +
                                                death_date[0][2]
                                              : ""}{" "}
                                            {death_date.length === 2
                                              ? " ou le " +
                                                death_date[1][0] +
                                                " " +
                                                this.months[
                                                  death_date[1][1] - 1
                                                ] +
                                                " " +
                                                death_date[1][2]
                                              : ""}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                            </Grid>
                            <Grid item xs={6}>
                              <GeoMap data={this.props.data} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }

    return output;
  }
}
