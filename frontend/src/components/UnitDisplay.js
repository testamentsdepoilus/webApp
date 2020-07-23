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
  Link,
  Box,
  Button,
  Grid,
  Tooltip,
  CircularProgress,
  SvgIcon
} from "@material-ui/core";


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
    const inputItem = {
      outputHtml: unit_div,
      filename: "Projet_TdP_unite_militaire_" + this.props.id
    };
   generatePDF(inputItem)
      .then(res => {
        if (res.status === 200) {
          downloadFile(
            getParamConfig("web_host") +
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

        <div className="noticeDisplay">
          <Grid container direction="row">

            <Grid item xs={this.props.resultList ? 12 : 0} sm={this.props.resultList ? 5 : 0} md={this.props.resultList ? 4 : 0}  lg={this.props.resultList ? 3 : 0}>
                {this.props.resultList}
            </Grid>

            <Grid className="bg-white" item xs={this.props.resultList ? 12 : 12} sm={this.props.resultList ? 7 : 12} md={this.props.resultList ? 8 : 12} lg={this.props.resultList ? 9 : 12}>
             
              <div className="containerNoticeInfo">
                   <Box className="d-flex" justifyContent="flex-end" key={3} >
                          <div className="p-relative">
                            <Button
                              id="btExport"
                              aria-label="Export"
                              className="iconButton"
                              title="Exporter la notice de l'unité militaire"
                              onClick={this.handleExportClick}
                            >
                              <i className="fa fa-lg fa-download" aria-hidden="true"></i>
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
                                  onClick={this.handleAddShoppingWill(
                                    this.props.id
                                  )}
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
                                  onClick={this.handleremoveShoppingWill(
                                    this.props.id
                                  )}
                                >
                                  <i className="fas fa-lg remove fa-briefcase"></i>
                                </Button>
                              </Tooltip>
                            )
                          ) : (
                            <Tooltip title="Connectez-vous pour ajouter cette unité militaire à vos favoris !">
                             <span>
                                <Button className="iconButton disabled" aria-label="ajouter aux favoris" disabled>
                                  <i className="fas fa-lg fa-briefcase"></i>
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                  </Box>   

                  <div key={2}  
                    ref={this.myRef}
                    id="unit_notice"
                    className="unit_notice">
                    <div className="d-flex itemTitle">
                        <SvgIcon>
                        <path className="st0" d="M21.6,22.3H7.4c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8h14.1c1,0,1.8,0.8,1.8,1.8
                          C23.4,21.5,22.6,22.3,21.6,22.3 M21.6,17.2H7.4c-1.8,0-3.3,1.5-3.3,3.3c0,1.8,1.5,3.3,3.3,3.3h14.1c1.8,0,3.3-1.5,3.3-3.3
                          C24.8,18.6,23.4,17.2,21.6,17.2"/>
                        <path className="st0" d="M8.1,19.6C8.6,19.6,9,20,9,20.4s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S7.6,19.6,8.1,19.6"/>
                        <path className="st0" d="M10.7,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S10.2,19.6,10.7,19.6"/>
                        <path className="st0" d="M13.2,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S12.7,19.6,13.2,19.6"/>
                        <path className="st0" d="M15.8,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S15.3,19.6,15.8,19.6"/>
                        <path className="st0" d="M18.3,19.6c0.5,0,0.9,0.4,0.9,0.9s-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9S17.8,19.6,18.3,19.6"/>
                        <path className="st0" d="M21.6,19.6c0.9,0,1.7,0.7,1.7,1.7s-0.7,1.7-1.7,1.7c-0.9,0-1.7-0.7-1.7-1.7S20.7,19.6,21.6,19.6"/>
                        <path className="st0" d="M22.1,14.7H8.9l0.8-1h3.1h9.2V14.7z M14.3,11.7c0-0.8,0.7-1.5,1.5-1.5h3.3c0.8,0,1.5,0.7,1.5,1.5v0.6h-6.4
                          V11.7z M23.7,14.7h-0.2v-2.5h-1.4v-0.6c0-1.6-1.3-3-3-3h-1V7.4h-1.5v1.3h-0.9c-0.7,0-1.4,0.3-1.9,0.7L4.5,5L3.9,6.4l9.1,4.3
                          c-0.1,0.3-0.2,0.7-0.2,1.1v0.6H9l-2,2.5H5.3C3.5,14.7,2,16.2,2,18h1.5c0-1,0.8-1.8,1.8-1.8h18.4c1,0,1.8,0.8,1.8,1.8H27
                          C27,16.2,25.5,14.7,23.7,14.7"/>
                        </SvgIcon>
                        <h1 className="item">
                          {this.props.data["country"] +
                            ". " +
                            this.props.data["composante"] +
                            ". " +
                            this.props.data["corps"] +
                            " (" +
                            this.props.data["number"] +
                            ")"}
                        </h1>
                    </div>
                    <div className="noticeInfo">
                        <div className="permalien">
                          <i className="fab fa-usb"></i>  Permalien dans l'édition numérique :{" "}
                          <Link href={unit_uri} target="_blank" className="urlUnit">{unit_uri}</Link>
                        </div>

                        <div>Autre forme du nom : {this.props.data["unit"]}</div>
                        {Object.keys(this.state.testators).length > 0 ? (
                          <div>
                            Poilus membres de cette unité militaire :
                            <ul>
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
                                  <li key={i}>
                                    <Link
                                      href={testator_uri}
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
                          </div>
                        ) : (
                          ""
                        )}
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
