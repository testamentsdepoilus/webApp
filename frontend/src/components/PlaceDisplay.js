import React, { Component } from "react";

import {
  createStyled,
  getParamConfig,
  getHitsFromQuery,
  downloadFile
} from "../utils/functions";
import {
  Paper,
  Typography,
  Grid,
  Link,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton
} from "@material-ui/core";

import classNames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GeoMap from "../utils/GeoMap";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";

const Styled = createStyled(theme => ({
  root: {
    maxWidth: "80em",
    margin: "auto"
  },
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    textAlign: "justify"
  },
  panel: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  name: {
    fontFamily: "-apple-system",
    marginTop: theme.spacing(1),
    fontWeight: 600
  },
  text: {
    fontFamily: "-apple-system",
    marginTop: theme.spacing(1)
  },
  title: {
    fontSize: 24,
    fontStyle: "oblique",
    textAlign: "center",
    fontWeight: 600
  },
  linkPage: {
    color: "#212121",
    fontSize: 18,
    fontWeight: 400,
    "&:hover": {
      color: "#0091EA"
    }
  },
  selectedLink: {
    fontWeight: 600,
    color: "#0091EA",
    fontSize: 18
  },
  nextPage: {
    display: "block",
    marginLeft: "90%"
  },
  urlPlace: {
    color: "#0091EA",
    fontSize: 14
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default class PlaceDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birth_hits: {},
      death_hits: {},
      residence_hits: {},
      place_id: this.props.id
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
    this.handleExportClick = this.handleExportClick.bind(this);
  }

  handleExportClick() {
    downloadFile(
      getParamConfig("web_url") +
        "/files/contextualEntity_place_2019-11-06_03-28-52.xml",
      "notice_place.xml"
    );
  }

  componentDidUpdate() {
    let new_birth_hits = {};
    let new_death_hits = {};
    let new_residence_hits = {};
    let cur_id =
      Object.keys(this.state.birth_hits).length > 0 &&
      Boolean(this.state.birth_hits["testators"])
        ? this.state.birth_hits["testators"][0]._source["birth.place.ref"]
        : null;
    cur_id = Boolean(cur_id)
      ? cur_id
      : Object.keys(this.state.death_hits).length > 0 &&
        Boolean(this.state.death_hits["testators"])
      ? this.state.death_hits["testators"][0]._source["death.place.ref"]
      : null;
    cur_id = Boolean(cur_id)
      ? cur_id
      : Object.keys(this.state.residence_hits).length > 0 &&
        Boolean(this.state.residence_hits["testators"])
      ? this.state.residence_hits["testators"][0]._source["residence.ref"]
      : null;

    if (cur_id !== this.props.id) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            term: {
              "birth.place.ref": this.props.id
            }
          }
        })
      ).then(hits => {
        if (hits.length > 0) {
          new_birth_hits["testators"] = hits;
          const ids = hits.map(item => item._id);
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
            JSON.stringify({
              _source: ["_id", "testator.ref"],
              query: {
                terms: {
                  "testator.ref": ids
                }
              }
            })
          )
            .then(wills => {
              if (wills.length > 0) {
                new_birth_hits["wills"] = wills;
                this.setState({
                  birth_hits: new_birth_hits
                });
              } else {
                this.setState({
                  birth_hits: new_birth_hits
                });
              }
            })
            .catch(err => console.log("erreur :", err));
        } else {
          if (Object.keys(this.state.birth_hits).length > 0) {
            this.setState({
              birth_hits: {}
            });
          }
        }
      });
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            term: {
              "death.place.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            new_death_hits["testators"] = hits;
            const ids = hits.map(item => item._id);
            getHitsFromQuery(
              getParamConfig("es_host") +
                "/" +
                getParamConfig("es_index_wills"),
              JSON.stringify({
                _source: ["_id", "testator.ref"],
                query: {
                  terms: {
                    "testator.ref": ids
                  }
                }
              })
            )
              .then(wills => {
                if (wills.length > 0) {
                  new_death_hits["wills"] = wills;
                  this.setState({
                    death_hits: new_death_hits
                  });
                } else {
                  this.setState({
                    death_hits: new_death_hits
                  });
                }
              })
              .catch(err => console.log("erreur :", err));
          } else {
            if (Object.keys(this.state.death_hits).length > 0) {
              this.setState({
                death_hits: {}
              });
            }
          }
        })
        .catch(err => console.log("erreur :", err));
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            term: {
              "residence.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            new_residence_hits["testators"] = hits;
            const ids = hits.map(item => item._id);
            getHitsFromQuery(
              getParamConfig("es_host") +
                "/" +
                getParamConfig("es_index_wills"),
              JSON.stringify({
                _source: ["_id", "testator.ref"],
                query: {
                  terms: {
                    "testator.ref": ids
                  }
                }
              })
            )
              .then(wills => {
                if (wills.length > 0) {
                  new_residence_hits["wills"] = wills;
                  this.setState({
                    residence_hits: new_residence_hits
                  });
                } else {
                  this.setState({
                    residence_hits: new_residence_hits
                  });
                }
              })
              .catch(err => console.log("erreur :", err));
          } else {
            if (Object.keys(this.state.residence_hits).length > 0) {
              this.setState({
                residence_hits: {}
              });
            }
          }
        })
        .catch(err => console.log("erreur :", err));
    }
  }

  componentDidMount() {
    let new_birth_hits = {};
    let new_death_hits = {};
    let new_residence_hits = {};
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            "birth.place.ref": this.props.id
          }
        }
      })
    ).then(hits => {
      if (hits.length > 0) {
        new_birth_hits["testators"] = hits;
        const ids = hits.map(item => item._id);
        getHitsFromQuery(
          getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
          JSON.stringify({
            _source: ["_id", "testator.ref"],
            query: {
              terms: {
                "testator.ref": ids
              }
            }
          })
        )
          .then(wills => {
            if (wills.length > 0) {
              new_birth_hits["wills"] = wills;
              this.setState({
                birth_hits: new_death_hits
              });
            }
          })
          .catch(err => console.log("erreur :", err));
      }
    });
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            "death.place.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          new_death_hits["testators"] = hits;
          const ids = hits.map(item => item._id);
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
            JSON.stringify({
              _source: ["_id", "testator.ref"],
              query: {
                terms: {
                  "testator.ref": ids
                }
              }
            })
          )
            .then(wills => {
              if (wills.length > 0) {
                new_death_hits["wills"] = wills;
                this.setState({
                  death_hits: new_death_hits
                });
              }
            })
            .catch(err => console.log("erreur :", err));
        }
      })
      .catch(err => console.log("erreur :", err));
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            "residence.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          new_residence_hits["testators"] = hits;
          const ids = hits.map(item => item._id);
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
            JSON.stringify({
              _source: ["_id", "testator.ref"],
              query: {
                terms: {
                  "testator.ref": ids
                }
              }
            })
          )
            .then(wills => {
              if (wills.length > 0) {
                new_residence_hits["wills"] = wills;
                this.setState({
                  residence_hits: new_residence_hits
                });
              }
            })
            .catch(err => console.log("erreur :", err));
        }
      })
      .catch(err => console.log("erreur :", err));
  }

  render() {
    let output = null;

    if (this.props.data) {
      const place_uri = getParamConfig("web_url") + "/place/" + this.props.id;
      output = (
        <Styled>
          {({ classes }) => (
            <div>
              <Grid container direction="column" justify="flex-start">
                <Grid key={3} item>
                  <IconButton
                    style={{ marginLeft: "90%" }}
                    id="btExport"
                    aria-label="Export"
                    title="Exporter la notice des lieux en format TEI"
                    onClick={this.handleExportClick}
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid key={2} item>
                  <div className={classes.root}>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      spacing={2}
                    >
                      <Grid item xs={6}>
                        <Paper className={classNames(classes.paper)}>
                          <Typography className={classes.name}>
                            {this.props.data["city"]}
                            {" ("}
                            {Boolean(this.props.data["region"])
                              ? this.props.data["region"] + " - "
                              : ""}
                            {Boolean(this.props.data["country"])
                              ? this.props.data["country"] + ")"
                              : ""}
                          </Typography>
                          {Boolean(this.props.data["geo_ref"]) ? (
                            <Typography className={classes.text}>
                              Dans la base Geonames :{" "}
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
                          <Grid
                            className={classes.text}
                            container
                            direction="row"
                            spacing={1}
                          >
                            <Grid item>
                              <Typography> Lien web du lieu : </Typography>
                            </Grid>
                            <Grid item>
                              <Link
                                href={place_uri}
                                target="_blank"
                                className={classNames(classes.urlPlace)}
                              >
                                {place_uri}
                              </Link>
                            </Grid>
                          </Grid>

                          {Object.keys(this.state.death_hits).length > 0 ? (
                            <ExpansionPanel className={classes.panel}>
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="death_hits"
                              >
                                <Typography className={classes.text}>
                                  Le lieu de décès
                                  {this.state.death_hits["testators"].length > 1
                                    ? " des poilus suivants :"
                                    : " du poilus suivant :"}{" "}
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <ul>
                                  {this.state.death_hits["testators"].map(
                                    (hit, i) => {
                                      let date = Boolean(
                                        hit._source["death.date"]
                                      )
                                        ? new Date(hit._source["death.date"])
                                        : null;

                                      date = Boolean(date)
                                        ? date.toLocaleDateString().split("/")
                                        : null;

                                      const will = Boolean(
                                        this.state.death_hits["wills"]
                                      )
                                        ? this.state.death_hits["wills"].find(
                                            item =>
                                              item._source["testator.ref"] ===
                                              hit._id
                                          )
                                        : null;
                                      return (
                                        <li key={i} className={classes.text}>
                                          {Boolean(will) ? (
                                            <Link
                                              href={
                                                getParamConfig("web_url") +
                                                "/testament/" +
                                                will["_id"]
                                              }
                                              target="_blank"
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                              {Boolean(date[i])
                                                ? ", décédé le " +
                                                  date[0] +
                                                  " " +
                                                  this.months[date[1] - 1] +
                                                  " " +
                                                  date[2]
                                                : " "}
                                            </Link>
                                          ) : (
                                            <Typography>
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                              {Boolean(date[i])
                                                ? ", décédé le " +
                                                  date[0] +
                                                  " " +
                                                  this.months[date[1] - 1] +
                                                  " " +
                                                  date[2]
                                                : " "}
                                            </Typography>
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          ) : (
                            ""
                          )}
                          {Object.keys(this.state.birth_hits).length > 0 ? (
                            <ExpansionPanel className={classes.panel}>
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="death_hits"
                              >
                                <Typography className={classes.text}>
                                  Le lieu de naissance
                                  {this.state.birth_hits["testators"].length > 1
                                    ? " des poilus suivants :"
                                    : " du poilus suivant :"}{" "}
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <ul>
                                  {this.state.birth_hits["testators"].map(
                                    (hit, i) => {
                                      let date = Boolean(
                                        hit._source["birth.date"]
                                      )
                                        ? new Date(hit._source["birth.date"])
                                        : null;

                                      date = Boolean(date)
                                        ? date.toLocaleDateString().split("/")
                                        : null;

                                      const will = Boolean(
                                        this.state.birth_hits["wills"]
                                      )
                                        ? this.state.birth_hits["wills"].find(
                                            item =>
                                              item._source["testator.ref"] ===
                                              hit._id
                                          )
                                        : null;
                                      return (
                                        <li key={i} className={classes.text}>
                                          {Boolean(will) ? (
                                            <Link
                                              href={
                                                getParamConfig("web_url") +
                                                "/testament/" +
                                                will["_id"]
                                              }
                                              target="_blank"
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                              {Boolean(date[i])
                                                ? ", né le " +
                                                  date[0] +
                                                  " " +
                                                  this.months[date[1] - 1] +
                                                  " " +
                                                  date[2]
                                                : " "}
                                            </Link>
                                          ) : (
                                            <Typography>
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                              {Boolean(date[i])
                                                ? ", né le " +
                                                  date[0] +
                                                  " " +
                                                  this.months[date[1] - 1] +
                                                  " " +
                                                  date[2]
                                                : " "}
                                            </Typography>
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          ) : (
                            ""
                          )}
                          {Object.keys(this.state.residence_hits).length > 0 ? (
                            <ExpansionPanel className={classes.panel}>
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="death_hits"
                              >
                                <Typography className={classes.text}>
                                  Le lieu de résidence
                                  {this.state.residence_hits["testators"]
                                    .length > 1
                                    ? " des poilus suivants :"
                                    : " du poilus suivant :"}{" "}
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <ul>
                                  {this.state.residence_hits["testators"].map(
                                    (hit, i) => {
                                      const will = Boolean(
                                        this.state.residence_hits["wills"]
                                      )
                                        ? this.state.residence_hits[
                                            "wills"
                                          ].find(
                                            item =>
                                              item._source["testator.ref"] ===
                                              hit._id
                                          )
                                        : null;
                                      return (
                                        <li key={i} className={classes.text}>
                                          {Boolean(will) ? (
                                            <Link
                                              href={
                                                getParamConfig("web_url") +
                                                "/testament/" +
                                                will["_id"]
                                              }
                                              target="_blank"
                                            >
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                            </Link>
                                          ) : (
                                            <Typography>
                                              {
                                                hit._source[
                                                  "persName.fullProseForm"
                                                ]
                                              }
                                            </Typography>
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          ) : (
                            ""
                          )}
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <GeoMap data={this.props.data} />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}
        </Styled>
      );
    }

    return output;
  }
}
