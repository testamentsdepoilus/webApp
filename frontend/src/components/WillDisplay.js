import React, { Component } from "react";

import {
  getParamConfig,
  downloadFile,
  generateWillPDF,
  getUserToken,
  updateMyListWills,
  getHitsFromQuery,
} from "../utils/functions";
import {
  Paper,
  Box,
  Grid,
  Button,
  TextField,
  Link,
  Dialog,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";

import ImageIIF from "../utils/ImageIIIF";
import isEqual from "lodash/isEqual";
import TestatorDisplay from "./TestatorDisplay";
import ReactDOM from "react-dom";

export function createPage(page, idx, type, nextPage) {
  let output = (
    <div>
      {
        <div
          dangerouslySetInnerHTML={{
            __html: page[idx][type],
          }}
        />
      }
      {idx < page.length - 1 ? nextPage : null}
    </div>
  );

  return output;
}

export default class WillDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      will_id: 0,
      idx: 0,
      cur_page: null,
      copyLink: null,
      openModal: false,
      anchorEl: null,
      anchorElMenu: null,
      myWills: [],
      testator_notice: null,
      will_notice: null,
      isLoading: false,
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
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleExportTEIClick = this.handleExportTEIClick.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleExportClose = this.handleExportClose.bind(this);
    this.handleExportPDFClick = this.handleExportPDFClick.bind(this);
    this.handleAddShoppingWill = this.handleAddShoppingWill.bind(this);
    this.handleremoveShoppingWill = this.handleremoveShoppingWill.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.will_id) {
      return {
        will_id: nextProps.id,
        idx: 0,
      };
    }
    return null;
  }

  handleAlertClose = (event) => {
    this.setState({
      open: false,
    });
  };

  handlePageClick(event) {
    window.history.replaceState(
      getParamConfig("web_url"),
      "will",
      getParamConfig("web_url") +
        "/testament/" +
        this.props.id +
        "/" +
        this.props.data["will_pages"][event.target.getAttribute("value")][
          "page_type"
        ].type +
        "_" +
        this.props.data["will_pages"][event.target.getAttribute("value")][
          "page_type"
        ].id
    );

    if (event.target.getAttribute("value") !== this.state.idx) {
      this.setState({
        idx: event.target.getAttribute("value"),
      });
    }
  }

  handleOpenModal(event) {
    const curLink = event.target.getAttribute("id")
      ? getParamConfig("web_url") +
        "/testament/" +
        this.props.id +
        "/" +
        this.props.data["will_pages"][event.target.getAttribute("id")][
          "page_type"
        ].type +
        "_" +
        this.props.data["will_pages"][event.target.getAttribute("id")][
          "page_type"
        ].id
      : null;
    if (curLink) {
      this.setState({
        copyLink: curLink,
        openModal: true,
        anchorEl: Boolean(this.state.anchorEl) ? null : event.currentTarget,
      });
    }
  }

  handleCloseModal() {
    this.setState({
      openModal: false,
    });
  }

  handleExportTEIClick() {
    downloadFile(
      getParamConfig("web_url") + "/files/wills/will_" + this.props.id + ".xml",
      "will_" + this.props.id + ".xml"
    );
  }

  handleExportPDFClick() {
    this.setState({
      isLoading: true,
    });

    const input_item = {
      data: this.props.data,
      testator_data: this.state.testator_notice,
      notice_info: document.getElementById("noticeTitleInfo").innerHTML,
      contributeur: document.getElementById("contributeursWill").innerHTML,
    };

    generateWillPDF(input_item)
      .then((res) => {
        if (res.status === 200) {
          downloadFile(
            getParamConfig("web_url") +
              "/outputPDF/Projet_TdP_testament_" +
              this.props.id +
              ".pdf",
            "Projet_TdP_testament_" + this.props.id + ".pdf"
          );
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          console.log("error :", err);
        }
        this.setState({
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
      });
    /*generateWillPDF(this.props.data, this.state.testator_notice)
      .then(res => {
        this.setState({
          isLoading: false
        });
      })
      .catch(e => {
        console.log(e);
      });*/
  }

  handleNextPage(event) {
    document.documentElement.scrollTop = 0;
    this.setState({
      idx: parseInt(this.state.idx, 10) + 1,
    });
  }

  handleExportClick(event) {
    this.setState({
      anchorElMenu: event.currentTarget,
    });
  }

  handleExportClose() {
    this.setState({
      anchorElMenu: null,
    });
  }

  handleAddShoppingWill(id) {
    return function (e) {
      let myWills_ = this.state.myWills;
      myWills_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myWills"] = myWills_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };

      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myWills: myWills_,
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function (e) {
      let myWills_ = this.state.myWills.filter((item) => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myWills"] = myWills_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };
      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          this.setState({
            myWills: myWills_,
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  createPageMenu(will_id, pages, idx, handleClick, handeOpenModal) {
    let menu = [];
    let listMenu = {
      page: "Page",
      envelope: "Enveloppe",
      codicil: "Codicille",
    };
    for (let i = 0; i < pages.length; i++) {
      menu.push(
        <div className="d-inline-block tab">
          <Link
            id={will_id}
            value={i}
            component="button"
            color="inherit"
            onClick={handleClick}
            className={
              parseInt(idx, 10) === i
                ? "page_title active button"
                : "page_title button"
            }
          >
            {listMenu[pages[i]["page_type"].type]} {pages[i]["page_type"].id}
          </Link>

          <Button
            id={i}
            className={
              parseInt(idx, 10) === i
                ? "iconButton permalink active"
                : "iconButton permalink"
            }
            onClick={handeOpenModal}
            title={
              listMenu[pages[i]["page_type"].type] +
              " " +
              pages[i]["page_type"].id +
              " : " +
              getParamConfig("web_url") +
              "/testament/" +
              will_id +
              "/" +
              listMenu[pages[i]["page_type"].type] +
              "_" +
              pages[i]["page_type"].id
            }
          >
            <i id={i} className="fab fa-usb"></i>
          </Button>
        </div>
      );
    }
    return (
      <Box display="flex" alignItems="center">
        <div className="bg-light-gray tabs">{menu}</div>
      </Box>
    );
  }

  componentDidUpdate() {
    /*if (document.getElementById("newLine_lb") === null) {
      let lbCollection = document.getElementsByClassName("lb");
      for (let item of lbCollection) {
        item.before(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <NewLine
                titleAccess="changement de ligne"
                color="primary"
                style={{ cursor: "help" }}
                id="newLine_lb"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_vertical") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_vertical"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceLineIcon
                titleAccess="Marque un espace vertical"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_vertical"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_horizontal") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_horizental"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceBarIcon
                titleAccess="Marque un espace horizontal"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_horizontal"
              />
            )
          )
        );
      }
    }*/
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            _id: this.props.data["testator.ref"],
          },
        },
      })
    )
      .then((data) => {
        ReactDOM.render(
          <TestatorDisplay id={data[0]["_id"]} data={data[0]._source} />,
          document.getElementById("testator_none_" + this.props.number)
        );
        if (
          this.state.testator_notice !==
          document.getElementById("testator_notice").innerHTML
        ) {
          this.setState({
            testator_notice: document.getElementById("testator_notice")
              .innerHTML,
          });
        }
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }

  componentDidMount() {
    const cur_idx = this.props.data["will_pages"].findIndex((item) => {
      return isEqual(item["page_type"], this.props.cur_page);
    });

    if (cur_idx !== -1) {
      this.setState({
        idx: cur_idx,
      });
    }
    /*let lbCollection = document.getElementsByClassName("lb");
    for (let item of lbCollection) {
      item.before(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <NewLine
              titleAccess="changement de ligne"
              color="primary"
              style={{ cursor: "help" }}
              id="newLine_lb"
            />
          )
        )
      );
    }
    let spaceVerCollection = document.getElementsByClassName("space_vertical");
    for (let item of spaceVerCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceLineIcon
              titleAccess="Marque un espace vertical"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_vertical"
            />
          )
        )
      );
    }
    let spaceHorCollection = document.getElementsByClassName(
      "space_horizontal"
    );
    for (let item of spaceHorCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceBarIcon
              titleAccess="Marque un espace horizontal"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_horizontal"
            />
          )
        )
      );
    }*/
    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myWills_ = Boolean(myBackups_["myWills"])
        ? myBackups_["myWills"]
        : [];
      this.setState({
        myWills: myWills_,
      });
    }

    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            _id: this.props.data["testator.ref"],
          },
        },
      })
    )
      .then((data) => {
        ReactDOM.render(
          <TestatorDisplay id={data[0]["_id"]} data={data[0]._source} />,
          document.getElementById("testator_none_" + this.props.number)
        );
        if (
          this.state.testator_notice !==
          document.getElementById("testator_notice").innerHTML
        ) {
          this.setState({
            testator_notice: document.getElementById("testator_notice")
              .innerHTML,
          });
        }
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }

  render() {
    const nextPage = (
      <Button
        className="iconButton nextPage"
        title="Page suivante"
        onClick={this.handleNextPage}
      >
        <i class="fas fa-arrow-circle-right"></i>
      </Button>
    );
    let output = null;
    if (this.props.data) {
      const will_uri =
        getParamConfig("web_url") + "/testament/" + this.props.id;
      const cur_idx =
        this.props.data["will_pages"].length <= this.state.idx
          ? 0
          : this.state.idx;
      let death_date = Boolean(this.props.data["will_contents.death_date"])
        ? new Date(this.props.data["will_contents.death_date"])
        : null;

      death_date = Boolean(death_date)
        ? death_date.toLocaleDateString().split("/")
        : null;

      let will_date = [];
      if (Boolean(this.props.data["will_contents.will_date_range"])) {
        let date_ = new Date(
          this.props.data["will_contents.will_date_range"]["gte"]
        );
        will_date.push(date_.toLocaleDateString().split("/"));
        if (
          this.props.data["will_contents.will_date_range"]["gte"] !==
          this.props.data["will_contents.will_date_range"]["lte"]
        ) {
          date_ = new Date(
            this.props.data["will_contents.will_date_range"]["lte"]
          );
          will_date.push(date_.toLocaleDateString().split("/"));
        }
      }

      const isAdded = Boolean(this.userToken)
        ? this.state.myWills.findIndex((el) => el === this.props.id)
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
                  <Button
                    id="btExport"
                    aria-label="Export"
                    className="iconButton"
                    title="Exporter le testament"
                    onClick={this.handleExportClick}
                  >
                    <i className="fa fa-lg fa-download" aria-hidden="true"></i>
                  </Button>
                  <Menu
                    className="exportBtn"
                    anchorEl={this.state.anchorElMenu}
                    keepMounted
                    open={Boolean(this.state.anchorElMenu)}
                    onClose={this.handleExportClose}
                    elevation={0}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <MenuItem className="d-block">
                      <Button id="bt-tei" onClick={this.handleExportTEIClick}>
                        <i className="fas fa-code"></i> TEI
                      </Button>
                    </MenuItem>
                    <MenuItem className="d-block">
                      <Button id="bt-pdf" onClick={this.handleExportPDFClick}>
                        <i className="far fa-file-pdf"></i> PDF
                      </Button>
                      {Boolean(this.state.isLoading) ? (
                        <CircularProgress />
                      ) : (
                        ""
                      )}
                    </MenuItem>
                  </Menu>

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
                    <Tooltip title="Connectez-vous pour ajouter ce testament à vos favoris !">
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
                <div id="noticeTitleInfo" className="noticeTitleInfo" key={2}>
                  <div className="d-flex itemTitle">
                    <i className="fab fa-2x fa-stack-overflow"></i>
                    <h1 className="item">
                      Testament de{" "}
                      <Link
                        href={
                          getParamConfig("web_url") +
                          "/testateur/" +
                          this.props.data["testator.ref"]
                        }
                      >
                        {this.props.data["testator.forename"] + " "}
                        <span className="text-uppercase">
                          {this.props.data["testator.surname"]}
                        </span>
                      </Link>
                    </h1>
                  </div>

                  <div className="noticeInfo">
                    <div>
                      Mort pour la France
                      {Boolean(death_date)
                        ? " le " +
                          death_date[0] +
                          " " +
                          this.months[death_date[1] - 1] +
                          " " +
                          death_date[2]
                        : ""}
                      {Boolean(
                        this.props.data["will_contents.death_place_norm"]
                      ) ? (
                        <div className="d-inline-block">
                          {" "}
                          <span className="text-error">&nbsp;|</span>{" "}
                          {Boolean(
                            this.props.data["will_contents.death_place_ref"]
                          ) ? (
                            <Link
                              href={
                                getParamConfig("web_url") +
                                "/place/" +
                                this.props.data["will_contents.death_place_ref"]
                              }
                              target="_blank"
                            >
                              {
                                this.props.data[
                                  "will_contents.death_place_norm"
                                ]
                              }
                            </Link>
                          ) : (
                            this.props.data["will_contents.death_place_norm"]
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {will_date.length > 0 ||
                    Boolean(
                      this.props.data["will_contents.will_place_norm"]
                    ) ? (
                      <div>
                        {will_date.length === 1
                          ? " Testament rédigé le " +
                            will_date[0][0] +
                            " " +
                            this.months[will_date[0][1] - 1] +
                            " " +
                            will_date[0][2]
                          : will_date.length === 2
                          ? "Date de rédaction : " +
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
                        {Boolean(
                          this.props.data["will_contents.will_place_norm"]
                        ) ? (
                          <span>
                            {" "}
                            à{" "}
                            {Boolean(
                              this.props.data["will_contents.will_place_ref"]
                            ) ? (
                              <Link
                                href={
                                  getParamConfig("web_url") +
                                  "/place/" +
                                  this.props.data[
                                    "will_contents.will_place_ref"
                                  ]
                                }
                                target="_blank"
                              >
                                {
                                  this.props.data[
                                    "will_contents.will_place_norm"
                                  ]
                                }
                              </Link>
                            ) : (
                              this.props.data["will_contents.will_place_norm"]
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      Cote aux {this.props.data["will_identifier.institution"]}
                      {" : "}
                      <span className="fontWeightBold">
                        {this.props.data["will_identifier.cote"]}
                      </span>
                    </div>
                    <div>
                      {"Support : " + this.props.data["will_physDesc.support"]}
                    </div>
                    <div>
                      {"Importance matérielle et dimensions : " +
                        this.props.data["will_physDesc.supportDesc"]}
                      {this.props.data["will_physDesc.dim"]["width"] + " "}
                      {this.props.data["will_physDesc.dim"]["unit"]} x{" "}
                      {this.props.data["will_physDesc.dim"]["height"] + " "}
                      {this.props.data["will_physDesc.dim"]["unit"]}
                    </div>
                    <div>
                      {"Type d'écriture : " +
                        this.props.data["will_physDesc.handDesc"]}
                    </div>
                    <div className="permalien">
                      {" "}
                      <i className="fab fa-usb"></i> Permalien dans l’édition
                      numérique :{" "}
                      <Link href={will_uri} target="_blank">
                        {" "}
                        {will_uri}{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>

          <div key={0}>
            {this.createPageMenu(
              this.props.id,
              this.props.data["will_pages"],
              cur_idx,
              this.handlePageClick,
              this.handleOpenModal
            )}
          </div>

          <Grid
            key={1}
            container
            alignItems="flex-start"
            justify="center"
            direction="row"
            spacing={0}
            className="bg-light-gray containerColumns"
          >
            <Grid className="d-flex" key={10} item sm={4}>
              <div className="bg-white columnContent">
                <div className="columnTitle">
                  <i className="far fa-object-group"></i> Image
                </div>

                <div className="image">
                  <Paper elevation={0}>
                    <ImageIIF
                      url={
                        this.props.data["will_pages"][cur_idx]["picture_url"]
                      }
                      id="willImage"
                    />
                  </Paper>
                </div>
              </div>
            </Grid>
            <Grid className="d-flex" key={11} item sm={4}>
              <div className="bg-white columnContent">
                <div className="columnTitle">
                  <i className="far fa-file-code"></i> Transcription
                </div>

                {createPage(
                  this.props.data["will_pages"],
                  cur_idx,
                  "transcription",
                  nextPage
                )}
              </div>
            </Grid>
            <Grid className="d-flex" key={12} item sm={4}>
              <div className="bg-white columnContent">
                <div className="columnTitle">
                  <i className="far fa-file-alt"></i> Édition
                </div>

                {createPage(
                  this.props.data["will_pages"],
                  cur_idx,
                  "edition",
                  nextPage
                )}
              </div>
            </Grid>
          </Grid>

          <div
            id="contributeursWill"
            className="contributeursWill card bg-white"
          >
            <h2 className="card-title bg-primaryLight">
              <i className="fas fa-child"></i> Les contributeurs
            </h2>
            {this.props.data["contributions"].map((contributor, i) => {
              return (
                <div key={i}>
                  {" "}
                  <span className="fontWeightMedium">
                    {contributor["resp"][0].toUpperCase() +
                      contributor["resp"].substring(1)}{" "}
                    :
                  </span>{" "}
                  {contributor["persName"].join(", ")}
                </div>
              );
            })}
          </div>

          <Dialog
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModal}
            onClose={this.handleCloseModal}
            className="permalienDialog"
          >
            <div>
              <Grid
                container
                alignItems="center"
                justify="flex-start"
                direction="row"
                spacing={1}
              >
                <Grid item>
                  <div className="label">
                    {" "}
                    <i className="fab fa-usb"></i> Permalien :{" "}
                  </div>
                </Grid>
                <Grid item xs>
                  <TextField
                    id="uriSelect"
                    defaultValue={this.state.copyLink}
                    fullWidth={true}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Dialog>
          <div
            id={"testator_none_" + this.props.number}
            style={{ display: "none" }}
          ></div>
        </div>
      );
    }

    return output;
  }
}
