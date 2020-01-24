import React, { Component } from "react";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";

import {
  createStyled,
  getParamConfig,
  getHitsFromQuery,
  getUserToken,
  updateMyListWills,
  generatePDF
} from "../utils/functions";
import {
  Paper,
  Typography,
  Link,
  IconButton,
  Grid,
  Tooltip,
  CircularProgress
} from "@material-ui/core";

import classNames from "classnames";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartOutlined";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartOutlined";
import Footer from "./Footer";

const Styled = createStyled(theme => ({
  root: {
    display: "flex"
  },
  paper: {
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    maxWidth: "55em",
    margin: "auto"
  },
  typo1: {
    fontFamily: "-apple-system",
    fontSize: "1.2rem",
    marginTop: theme.spacing(1),
    fontWeight: 600
  },
  typo2: {
    fontFamily: "-apple-system",
    fontSize: "1rem",
    marginTop: theme.spacing(1)
  },
  urlUnit: {
    color: "#0091EA",
    fontSize: "1rem"
  }
}));

export default class UnitDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testators: [],
      myUnits: [],
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
    const unit_div = document.getElementById("unit_notice").innerHTML;
    this.setState({
      isLoading: true
    });
    generatePDF(unit_div, "unite_militaire_" + this.props.id)
      .then(res => {
        this.setState({
          isLoading: false
        });
      })
      .catch(e => {
        this.setState({
          isLoading: false
        });
        console.log(e);
      });
  }

  componentDidUpdate() {
    if (
      this.state.testators.length === 0 ||
      (this.state.testators.length > 0 &&
        this.state.testators[0]._source["affiliation.ref"] !== this.props.id)
    ) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          size: 100,
          query: {
            term: {
              "affiliation.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              testators: hits
            });
          } else if (this.state.testators.length > 0) {
            this.setState({
              testators: []
            });
          }
        })
        .catch(err => console.log("erreur :", err));
    }
  }

  handleAddShoppingWill(id) {
    return function(e) {
      let myUnits_ = this.state.myUnits;
      myUnits_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myUnits"] = myUnits_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };

      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myUnits: myUnits_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function(e) {
      let myUnits_ = this.state.myUnits.filter(item => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myUnits"] = myUnits_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };
      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myUnits: myUnits_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        size: 100,
        query: {
          term: {
            "affiliation.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            testators: hits
          });
        } else if (this.state.testators.length > 0) {
          this.setState({
            testators: []
          });
        }
      })
      .catch(err => console.log("erreur :", err));

    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myUnits_ = Boolean(myBackups_["myUnits"])
        ? myBackups_["myUnits"]
        : [];
      this.setState({
        myUnits: myUnits_
      });
    }
  }

  render() {
    let output = null;

    if (this.props.data) {
      const unit_uri = getParamConfig("web_url") + "/armee/" + this.props.id;
      const isAdded = Boolean(this.userToken)
        ? this.state.myUnits.findIndex(el => el === this.props.id)
        : -1;
      output = (
        <Styled>
          {({ classes }) => (
            <div className={classes.root}>
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
                        title="Exporter la notice des unités militaires en format PDF"
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
                            title="Ajouter au panier"
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
                          title="Connectez-vous pour ajouter ce testament au panier"
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
                  <Paper id="unit_notice" className={classNames(classes.paper)}>
                    <Typography className={classes.typo1}>
                      {this.props.data["country"] +
                        ". " +
                        this.props.data["composante"] +
                        ". " +
                        this.props.data["corps"] +
                        " (" +
                        this.props.data["number"] +
                        ")"}
                    </Typography>
                    <Typography className={classes.typo2}>
                      Permalien dans l'édition numérique :{" "}
                      <Link
                        href={unit_uri}
                        target="_blank"
                        className={classNames(classes.urlUnit)}
                      >
                        {unit_uri}
                      </Link>
                    </Typography>
                    <Typography className={classes.typo2}>
                      Autre forme du nom : {this.props.data["unit"]}
                    </Typography>
                    {Object.keys(this.state.testators).length > 0 ? (
                      <span>
                        <Typography className={classes.typo2}>
                          Poilus membres de cette unité militaire :
                        </Typography>

                        <ul className={classes.typo2}>
                          {this.state.testators.map((hit, i) => {
                            let death_date = [];

                            if (Boolean(hit._source["death.date"])) {
                              if (Array.isArray(hit._source["death.date"])) {
                                death_date = hit._source["death.date"].map(
                                  item => {
                                    const date = new Date(item);
                                    return date.toLocaleDateString().split("/");
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

                            const testator_uri =
                              getParamConfig("web_url") +
                              "/testateur/" +
                              hit["_id"];
                            return (
                              <li key={i} className={classes.text}>
                                <Link
                                  href={testator_uri}
                                  target="_blank"
                                  className={classNames(classes.urlUnit)}
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
                                      this.months[death_date[0][1] - 1] +
                                      " " +
                                      death_date[0][2]
                                    : ""}{" "}
                                  {death_date.length === 2
                                    ? " ou le " +
                                      death_date[1][0] +
                                      " " +
                                      this.months[death_date[1][1] - 1] +
                                      " " +
                                      death_date[1][2]
                                    : ""}
                                  {Boolean(hit._source["death.place.name"])
                                    ? " à " + hit._source["death.place.name"]
                                    : ""}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </span>
                    ) : (
                      ""
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </div>
          )}
        </Styled>
      );
    }

    return [output, <Footer />];
  }
}
