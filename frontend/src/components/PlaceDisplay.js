import React, { Component } from "react";

import {
  getParamConfig,
  getHitsFromQuery,
  getUserToken,
  updateMyListWills,
  generatePDF,
  downloadFile,
} from "../utils/functions";
import {
  Box,
  Grid,
  Link,
  Button,
  Tooltip,
  CircularProgress,
  Popper,
} from "@material-ui/core";

import GeoMap from "../utils/GeoMap";

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
      isLoading: false,
      anchorEl: null,
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
      "décembre",
    ];
    this.userToken = getUserToken();
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleAddShoppingWill = this.handleAddShoppingWill.bind(this);
    this.handleremoveShoppingWill = this.handleremoveShoppingWill.bind(this);
    this.handleHelpOpen = this.handleHelpOpen.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
  }

  handleExportClick() {
    let map_div = document.getElementById("map-container");
    map_div.style.display = "none";

    let lieu_div = document.getElementById("lieu_notice").innerHTML;

    this.setState({
      isLoading: true,
    });
    const inputItem = {
      outputHtml: lieu_div,
      filename: "Projet_TdP_lieu_" + this.props.id,
    };

    generatePDF(inputItem)
      .then((res) => {
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
          isLoading: false,
        });
      })
      .catch((e) => {
        map_div.style.display = "block";
        this.setState({
          isLoading: false,
        });
        console.log(e);
      });
  }

  handleAddShoppingWill(id) {
    return function (e) {
      let myPlaces_ = this.state.myPlaces;
      myPlaces_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myPlaces"] = myPlaces_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };

      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myPlaces: myPlaces_,
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function (e) {
      let myPlaces_ = this.state.myPlaces.filter((item) => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myPlaces"] = myPlaces_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };
      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myPlaces: myPlaces_,
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
              "birth.place.ref": this.props.id,
            },
          },
        })
      ).then((hits) => {
        if (hits.length > 0) {
          this.setState({
            birth_hits: hits,
          });
        } else {
          if (this.state.birth_hits.length > 0) {
            this.setState({
              birth_hits: [],
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
              "death.place.ref": this.props.id,
            },
          },
        })
      )
        .then((hits) => {
          if (hits.length > 0) {
            this.setState({
              death_hits: hits,
            });
          } else {
            if (this.state.death_hits.length > 0) {
              this.setState({
                death_hits: [],
              });
            }
          }
        })
        .catch((err) => console.log("erreur :", err));
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "residence.ref": this.props.id,
            },
          },
        })
      )
        .then((hits) => {
          if (hits.length > 0) {
            this.setState({
              residence_hits: hits,
            });
          } else {
            if (this.state.residence_hits.length > 0) {
              this.setState({
                residence_hits: [],
              });
            }
          }
        })
        .catch((err) => console.log("erreur :", err));
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          size: 1000,
          query: {
            term: {
              "will_contents.will_place_ref": this.props.id,
            },
          },
        })
      )
        .then((hits) => {
          if (hits.length > 0) {
            this.setState({
              redaction_hits: hits,
            });
          } else {
            if (this.state.redaction_hits.length > 0) {
              this.setState({
                redaction_hits: [],
              });
            }
          }
        })
        .catch((err) => console.log("erreur :", err));
    }
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "birth.place.ref": this.props.id,
          },
        },
      })
    )
      .then((hits) => {
        if (hits.length > 0) {
          this.setState({
            birth_hits: hits,
          });
        }
      })
      .catch((err) => console.log("erreur :", err));
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "death.place.ref": this.props.id,
          },
        },
      })
    )
      .then((hits) => {
        if (hits.length > 0) {
          this.setState({
            death_hits: hits,
          });
        }
      })
      .catch((err) => console.log("erreur :", err));
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "residence.ref": this.props.id,
          },
        },
      })
    )
      .then((hits) => {
        if (hits.length > 0) {
          this.setState({
            residence_hits: hits,
          });
        }
      })
      .catch((err) => console.log("erreur :", err));

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        size: 1000,
        query: {
          term: {
            "will_contents.will_place_ref": this.props.id,
          },
        },
      })
    )
      .then((hits) => {
        if (hits.length > 0) {
          this.setState({
            redaction_hits: hits,
          });
        }
      })
      .catch((err) => console.log("erreur :", err));

    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myPlaces_ = Boolean(myBackups_["myPlaces"])
        ? myBackups_["myPlaces"]
        : [];
      this.setState({
        myPlaces: myPlaces_,
      });
    }
  }
  handleHelpClose(event) {
    this.setState({
      anchorEl: null,
    });
  }
  handleHelpOpen(event) {
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
    });
  }
  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "transitions-popper" : undefined;
    let output = null;
    if (this.props.data) {
      const place_uri = getParamConfig("web_url") + "/place/" + this.props.id;
      const isAdded = Boolean(this.userToken)
        ? this.state.myPlaces.findIndex((el) => el === this.props.id)
        : -1;
      output = (
        <div className="noticeDisplay">
          <Grid container direction="row">
            <Grid
              item
              xs={this.props.resultList ? 12 : 0}
              sm={this.props.resultList ? 5 : 0}
              md={this.props.resultList ? 4 : 0}
              lg={this.props.resultList ? 3 : 0}
            >
              {this.props.resultList}
            </Grid>

            <Grid
              className="bg-white"
              item
              xs={this.props.resultList ? 12 : 12}
              sm={this.props.resultList ? 7 : 12}
              md={this.props.resultList ? 8 : 12}
              lg={this.props.resultList ? 9 : 12}
            >
              <div className="containerNoticeInfo">
                <Box className="d-flex" justifyContent="flex-end" key={3}>
                  <div className="p-relative">
                    <Button
                      id="btExport"
                      aria-label="Export"
                      className="iconButton"
                      title="Exporter la notice du lieu"
                      onClick={this.handleExportClick}
                    >
                      <i
                        className="fa fa-lg fa-download"
                        aria-hidden="true"
                      ></i>
                    </Button>
                    {Boolean(this.state.isLoading) ? (
                      <CircularProgress className="spinner" color="secondary" />
                    ) : (
                      ""
                    )}
                  </div>

                  {Boolean(this.userToken) ? (
                    isAdded === -1 ? (
                      <Tooltip
                        title="Ajouter aux favoris"
                        placement="bottom"
                        style={{ cursor: "hand" }}
                      >
                        <Button
                          className="iconButton"
                          onClick={this.handleAddShoppingWill(this.props.id)}
                        >
                          <i className="fas fa-lg fa-briefcase"></i>
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="Supprimer du panier"
                        placement="bottom"
                        style={{ cursor: "hand" }}
                      >
                        <Button
                          className="iconButton"
                          onClick={this.handleremoveShoppingWill(this.props.id)}
                        >
                          <i className="fas fa-lg remove fa-briefcase"></i>
                        </Button>
                      </Tooltip>
                    )
                  ) : (
                    <Tooltip title="Connectez-vous pour ajouter ce lieu à vos favoris !">
                      <span>
                        <Button
                          className="iconButton disabled"
                          aria-label="ajouter aux favoris"
                          disabled
                        >
                          <i className="fas fa-lg fa-briefcase"></i>
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                </Box>
                <Box className="d-flex" justifyContent="flex-end" key={3}>
                  <div className="p-relative">
                    <Button
                      aria-describedby={id}
                      onClick={this.handleHelpOpen}
                      style={{ cursor: "help" }}
                      className="button iconButton"
                    >
                      <i className="fas fa-question-circle"></i>
                    </Button>
                    <Popper
                      id={id}
                      open={open}
                      anchorEl={this.state.anchorEl}
                      placement="right-start"
                    >
                      <div className="tooltip">
                        <Button
                          id="closeToolTip"
                          onClick={this.handleHelpClose}
                          title="Fermer l'aide à la recherche"
                          className="button close iconButton"
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                        <ul>
                          <li>
                            [TES] = testateur : informations provenant du corps
                            du testament rédigé par le Poilu ;
                          </li>
                          <li>
                            [NOT] = notaire : informations provenant de la
                            couverture de la minute notariale ou dans le
                            jugement que cette minute contient ;
                          </li>
                          <li>
                            [MDH] = mémoire des hommes : informations provenant
                            de la fiche de la base de données des Morts pour la
                            France de la Première Guerre mondiale ;
                          </li>
                          <li>
                            [EC] = État civil : information provenant de
                            registres ou d’actes d’état civil (conservés le plus
                            souvent aux archives départementales) ;
                          </li>
                          <li>
                            [AS] = autres sources : informations provenant
                            d’autres sources
                          </li>
                        </ul>
                      </div>
                    </Popper>
                  </div>
                </Box>
                <div
                  key={2}
                  ref={this.myRef}
                  id="lieu_notice"
                  className="lieu_notice"
                >
                  <div className="d-flex itemTitle">
                    <i className="fas fa-map-marker-alt"></i>
                    <h1 className="item">{this.props.data["city"]}</h1>
                  </div>

                  <Grid container className="noticeInfo">
                    <Grid item xs={12} lg={7}>
                      <div className="permalien">
                        <i className="fab fa-usb"></i> Permalien dans l'édition
                        numérique :{" "}
                        <Link href={place_uri} target="_blank">
                          {place_uri}
                        </Link>
                      </div>

                      {Boolean(this.props.data["geo_ref"]) ? (
                        <div>
                          Voir ce lieu dans la base GeoNames :{" "}
                          <Link
                            href={this.props.data["geo_ref"]}
                            target="_blank"
                          >
                            {this.props.data["geo_ref"]}
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.birth_hits.length > 0 ? (
                        <div>
                          Lieu de naissance
                          {this.state.birth_hits.length > 1
                            ? " des Poilus suivants :"
                            : " du Poilu suivant :"}{" "}
                          <ul>
                            {this.state.birth_hits.map((hit, i) => {
                              return (
                                <li key={i}>
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
                                    <span className="text-uppercase">
                                      {
                                        hit._source[
                                          "persName.fullIndexEntryForm.surname"
                                        ]
                                      }
                                    </span>

                                    {", " +
                                      hit._source[
                                        "birth.date_text"
                                      ][0].toLowerCase() +
                                      hit._source["birth.date_text"].slice(1)}

                                    {hit._source["birth.place.name"]
                                      ? hit._source["birth.place.name"]
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
                      {this.state.residence_hits.length > 0 ? (
                        <div>
                          Lieu de résidence
                          {this.state.residence_hits.length > 1
                            ? " des Poilus suivants :"
                            : " du Poilu suivant :"}{" "}
                          <ul>
                            {this.state.residence_hits.map((hit, i) => {
                              return (
                                <li key={i}>
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
                                    <span className="text-uppercase">
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
                          Lieu de rédaction
                          {this.state.redaction_hits.length > 1
                            ? " des testaments suivants :"
                            : " du testament suivant :"}{" "}
                          <ul>
                            {this.state.redaction_hits.map((hit, i) => {
                              let will_date = [];
                              if (
                                Boolean(
                                  hit._source["will_contents.will_date_range"]
                                )
                              ) {
                                let date_ = new Date(
                                  hit._source["will_contents.will_date_range"][
                                    "gte"
                                  ]
                                );
                                will_date.push(
                                  date_.toLocaleDateString().split("/")
                                );
                                if (
                                  hit._source["will_contents.will_date_range"][
                                    "gte"
                                  ] !==
                                  hit._source["will_contents.will_date_range"][
                                    "lte"
                                  ]
                                ) {
                                  date_ = new Date(
                                    hit._source[
                                      "will_contents.will_date_range"
                                    ]["lte"]
                                  );
                                  will_date.push(
                                    date_.toLocaleDateString().split("/")
                                  );
                                }
                              }

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
                                        fontVariantCaps: "small-caps",
                                      }}
                                    >
                                      {hit._source["testator.surname"]}
                                    </span>
                                    {will_date.length === 1
                                      ? ", rédigé le " +
                                        will_date[0][0] +
                                        " " +
                                        this.months[will_date[0][1] - 1] +
                                        " " +
                                        will_date[0][2]
                                      : will_date.length === 2
                                      ? ", rédigé le " +
                                        will_date[0][0] +
                                        " " +
                                        this.months[will_date[0][1] - 1] +
                                        " " +
                                        will_date[0][2] +
                                        " et " +
                                        will_date[1][0] +
                                        " " +
                                        this.months[will_date[1][1] - 1] +
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
                          Lieu de décès
                          {this.state.death_hits.length > 1
                            ? " des Poilus suivants :"
                            : " du Poilu suivant :"}{" "}
                          <ul>
                            {this.state.death_hits.map((hit, i) => {
                              let death_date = [];

                              if (Boolean(hit._source["death.date"])) {
                                if (Array.isArray(hit._source["death.date"])) {
                                  death_date = hit._source["death.date"].map(
                                    (item) => {
                                      const date = new Date(item);
                                      return date
                                        .toLocaleDateString()
                                        .split("/");
                                    }
                                  );
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
                                    <span className="text-uppercase">
                                      {
                                        hit._source[
                                          "persName.fullIndexEntryForm.surname"
                                        ]
                                      }
                                    </span>
                                    {", " + hit._source["death.date_text"]}

                                    {hit._source["death.place.name"]
                                      ? hit._source["death.place.name"]
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
                    <Grid item xs={12} lg={5}>
                      <GeoMap data={this.props.data} />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }

    return output;
  }
}
