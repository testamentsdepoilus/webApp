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
  Grid,
  Link,
  Button,
  Box,
  Tooltip,
  Avatar,
  CircularProgress,
} from "@material-ui/core";

export function ListWills(props) {
  const will_dates = props.data.map((item) => {
    let will_date = [];
    if (Boolean(item._source["will_contents.will_date_range"])) {
      let date_ = new Date(
        item._source["will_contents.will_date_range"]["gte"]
      );
      will_date.push(date_.toLocaleDateString().split("/"));
      if (
        item._source["will_contents.will_date_range"]["gte"] !==
        item._source["will_contents.will_date_range"]["lte"]
      ) {
        date_ = new Date(item._source["will_contents.will_date_range"]["lte"]);
        will_date.push(date_.toLocaleDateString().split("/"));
      }
    }
    return will_date;
  });

  if (props.data.length > 0) {
    return (
      <div id="listWills">
        <h2 className="fontWeightRegular">
          <i className="fab fa-stack-overflow"></i> Ce Poilu est l'auteur{" "}
          {props.data.length > 1
            ? " des testaments suivants :"
            : " du testament suivant :"}{" "}
        </h2>
        <div>
          <ul>
            {props.data.map((will, i) => {
              const will_uri =
                getParamConfig("web_url") + "/testament/" + will["_id"];
              return (
                <li key={i}>
                  <Link href={will_uri} target="_blank">
                    Testament
                    {will_dates[i].length > 0
                      ? " rédigé le " +
                        will_dates[i][0][0] +
                        " " +
                        props.months[will_dates[i][0][1] - 1] +
                        " " +
                        will_dates[i][0][2]
                      : ""}
                    {will_dates[i].length === 2
                      ? " et le " +
                        will_dates[i][1][0] +
                        " " +
                        props.months[will_dates[i][1][1] - 1] +
                        " " +
                        will_dates[i][1][2]
                      : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div id="listWills">
        <h2 className="fontWeightRegular">
          <i className="fab fa-stack-overflow"></i> Le testament de ce Poilu
          sera accessible prochainement.
        </h2>
      </div>
    );
  }
}
export default class TestatorDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wills: [],
      myTestators: [],
      isLoading: false,
    };
    this.myRef = React.createRef();
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
  }

  handleExportClick() {
    const testator_div = document.getElementById("testator_notice").innerHTML;
    this.setState({
      isLoading: true,
    });
    const inputItem = {
      outputHtml: testator_div,
      filename: "Projet_TdP_testateur_" + this.props.id,
    };

    generatePDF(inputItem)
      .then((res) => {
        downloadFile(
          getParamConfig("web_url") +
            "/outputPDF/" +
            inputItem.filename +
            ".pdf",
          inputItem.filename + ".pdf"
        );
        this.setState({
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
        console.log(e);
      });

  }

  handleAddShoppingWill(id) {
    return function (e) {
      let myTestators_ = this.state.myTestators;
      myTestators_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myTestators"] = myTestators_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };

      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myTestators: myTestators_,
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function (e) {
      let myTestators_ = this.state.myTestators.filter((item) => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myTestators"] = myTestators_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };
      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myTestators: myTestators_,
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  componentDidUpdate() {
    if (
      this.state.wills.length === 0 ||
      (this.state.wills.length > 0 &&
        this.state.wills[0]._source["testator.ref"] !== this.props.id)
    ) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          _source: ["_id", "will_contents.will_date_range", "testator.ref"],
          query: {
            term: {
              "testator.ref": this.props.id,
            },
          },
        })
      )
        .then((hits) => {
          if (hits.length > 0) {
            this.setState({
              wills: hits,
            });
          } else if (this.state.wills.length > 0) {
            this.setState({
              wills: [],
            });
          }
        })
        .catch((err) => {
          console.log("Erreur :", err);
        });
    }
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        _source: ["_id", "will_contents.will_date_range", "testator.ref"],
        query: {
          term: {
            "testator.ref": this.props.id,
          },
        },
      })
    )
      .then((hits) => {
        if (hits.length > 0) {
          this.setState({
            wills: hits,
          });
        }
      })
      .catch((err) => console.log("Erreur :", err));

    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myTestators_ = Boolean(myBackups_["myTestators"])
        ? myBackups_["myTestators"]
        : [];
      this.setState({
        myTestators: myTestators_,
      });
    }
  }

  render() {
    let output = null;
    if (this.props.data) {
      const testator_uri =
        getParamConfig("web_url") + "/testateur/" + this.props.id;

      let death_date = [];

      if (Boolean(this.props.data["death.date"])) {
        if (Array.isArray(this.props.data["death.date"])) {
          death_date = this.props.data["death.date"].map((item) => {
            const date = new Date(item);
            return date.toLocaleDateString().split("/");
          });
        } else {
          const date = new Date(this.props.data["death.date"]);
          death_date.push(date.toLocaleDateString().split("/"));
        }
      }

      let birth_date = Boolean(this.props.data["birth.date"])
        ? new Date(this.props.data["birth.date"])
        : null;

      birth_date = Boolean(birth_date)
        ? birth_date.toLocaleDateString().split("/")
        : null;

      const isAdded = Boolean(this.userToken)
        ? this.state.myTestators.findIndex((el) => el === this.props.id)
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
                      title="Exporter la notice du testateur"
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
                    <Tooltip title="Connectez-vous pour ajouter ce testateur à vos favoris !">
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

                <div
                  key={2}
                  ref={this.myRef}
                  id="testator_notice"
                  className="testator_notice"
                >
                  <div className="d-flex itemTitle">
                    <i className="far fa-2x fa-address-book"></i>
                    <h1 className="item">
                      {this.props.data["persName.fullIndexEntryForm.forename"]
                        .toString()
                        .replace(/,/g, " ") + " "}
                      <span className="text-uppercase">
                        {this.props.data["persName.fullIndexEntryForm.surname"]}
                      </span>{" "}
                      {Boolean(birth_date) ? "(" + birth_date[2] : "("}
                      {"-"}
                      {death_date.length > 0
                        ? death_date[0][2].trim() + ")"
                        : ")"}
                    </h1>
                  </div>

                  <div className="noticeInfo">
                    {Boolean(this.props.data["figure"]) ? (
                      <Avatar
                        alt="testator"
                        src={this.props.data["figure"]}
                        style={{
                          width: "5em",
                          height: "5em",
                        }}
                      />
                    ) : null}
                    <Box className="mainInfo">
                      <div>
                        <div className="permalien">
                          {" "}
                          <i className="fab fa-usb"></i> Permalien dans
                          l'édition numérique :{" "}
                          <Link
                            href={testator_uri}
                            target="_blank"
                            className="urlTestator"
                          >
                            {" "}
                            {testator_uri}{" "}
                          </Link>
                        </div>
                        <div>
                          {Boolean(this.props.data["residence.ref"]) ? (
                            <Link
                              href={
                                getParamConfig("web_url") +
                                "/place/" +
                                this.props.data["residence.ref"]
                              }
                              target="_blank"
                            >
                              {this.props.data["residence.name"]}
                            </Link>
                          ) : (
                            this.props.data["residence.name"]
                          )}
                        </div>
                        {Boolean(birth_date) ||
                        Boolean(this.props.data["birth.place.name"]) ? (
                          <div>
                            Né
                            {Boolean(birth_date)
                              ? " le " +
                                birth_date[0] +
                                " " +
                                this.months[birth_date[1] - 1] +
                                " " +
                                birth_date[2]
                              : ""}{" "}
                            {Boolean(this.props.data["birth.place.name"]) ? (
                              <Link
                                href={
                                  getParamConfig("web_url") +
                                  "/place/" +
                                  this.props.data["birth.place.ref"]
                                }
                                target="_blank"
                              >
                                à {this.props.data["birth.place.name"]}
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                        {Boolean(this.props.data["affiliation.orgName"]) ? (
                          <div>
                            {this.props.data[
                              "affiliation.name"
                            ][0].toUpperCase() +
                              this.props.data["affiliation.name"].slice(1)}
                            {Boolean(this.props.data["affiliation.ref"]) ? (
                              <Link
                                href={
                                  getParamConfig("web_url") +
                                  "/armee/" +
                                  this.props.data["affiliation.ref"]
                                }
                                target="_blank"
                              >
                                {this.props.data["affiliation.orgName"]}
                              </Link>
                            ) : (
                              this.props.data["affiliation.orgName"]
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          Mort pour la France le{" "}
                          {death_date.length > 0
                            ? death_date[0][0] +
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
                            : ""}{" "}
                          {Boolean(this.props.data["death.place.name"]) ? (
                            <Link
                              href={
                                Boolean(this.props.data["death.place.ref"])
                                  ? getParamConfig("web_url") +
                                    "/place/" +
                                    this.props.data["death.place.ref"]
                                  : ""
                              }
                              target="_blank"
                            >
                              à {this.props.data["death.place.name"]}
                            </Link>
                          ) : (
                            ""
                          )}
                        </div>
                        {Boolean(this.props.data["occupation"]) ? (
                          <div>
                            Profession : {this.props.data["occupation"]}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </Box>

                    {Boolean(this.props.data["note_history"]) ? (
                      <div className="biographie">
                        <h2 className="fontWeightRegular">
                          <i className="fas fa-street-view"></i> Biographie
                        </h2>
                        <ul className="text">
                          {this.props.data["note_history"]
                            .split("*")
                            .map((item, i) => {
                              item = item.trim();
                              if (item.length > 1) {
                                return (
                                  <li key={i}>
                                    {item[0].toUpperCase() + item.slice(1)}
                                  </li>
                                );
                              } else {
                                return null;
                              }
                            })}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}

                    {Boolean(this.props.data["bibl.author"]) ? (
                      <div className="biblio">
                        <h2 className="fontWeightRegular">
                          <i className="fas fa-book"></i> Références
                          bibliographiques{" "}
                        </h2>
                        <div>
                          {"-"} {this.props.data["bibl.author"]}.{" "}
                          <Link
                            href={this.props.data["bibl.uri"]}
                            target="_blank"
                          >
                            {this.props.data["bibl.title"]}{" "}
                          </Link>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <ListWills data={this.state.wills} months={this.months} />
                  </div>
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
