import React from "react";
import ReactDOM from "react-dom";
import CloseIcon from "@material-ui/icons/Close";
import {
  ListItemText,
  Typography,
  Grid,
  IconButton,
  Chip,
  Snackbar,
  SnackbarContent,
  Link,
  Tooltip,
  Button
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

import {
  getParamConfig,
  getUserToken,
  updateMyListWills
} from "../../utils/functions";
import InfoIcon from "@material-ui/icons/Info";

import ListAddIcon from "@material-ui/icons/PlaylistAddOutlined";
import ListAddCheckIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartOutlined";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";

const listMenu = { page: "Page", envelope: "Enveloppe", codicil: "Codicille" };

export default class ResultWills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curData: [],
      openDialog: false,
      openAlert: false,
      willPage: null,
      cur_page: 0,
      styleTitle: {},
      count: 0,
      chipData: [],
      displayType: null,
      anchorEl: null,
      message: "",
      myWills: []
    };
    this.userToken = getUserToken();
    this.displayMore = this.displayMore.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickWill = this.handleClickWill.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCompareClick = this.handleCompareClick.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleAddShoppingWill = this.handleAddShoppingWill.bind(this);
    this.handleremoveShoppingWill = this.handleremoveShoppingWill.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.curData && nextProps.data !== undefined) {
      return {
        curData: nextProps.data,
        anchorEl: null
      };
    }
    return null;
  }

  handleOpenMenu(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  displayMore(item, page) {
    return function(e) {
      let url_param = item["_id"];

      url_param += page ? "/" + page["type"] + "_" + page["id"] : "";

      window.location.href =
        getParamConfig("web_url") + "/testament/" + url_param;
    };
  }

  handleAddShoppingWill(id) {
    return function(e) {
      let myWills_ = this.state.myWills;
      myWills_.push(id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myWills"] = myWills_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };

      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myWills: myWills_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function(e) {
      let myWills_ = this.state.myWills.filter(item => item !== id);
      let myBackups_ = JSON.parse(localStorage.myBackups);
      myBackups_["myWills"] = myWills_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };
      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            myWills: myWills_
          });
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        }
      });
    }.bind(this);
  }

  handleClose = function() {
    this.setState({
      openDialog: false,
      openAlert: false,
      willPage: null,
      cur_page: 0,
      anchorEl: null
    });
  };

  handleClickWill(will) {
    return function(e) {
      let styleTitle_ = this.state.styleTitle;
      let count_ = this.state.count;
      let chipData_ = this.state.chipData;
      if (Boolean(styleTitle_[will["_id"]])) {
        styleTitle_[will["_id"]] = false;
        count_ -= 1;
        chipData_ = chipData_.filter(item => item["id"] !== will["_id"]);
      } else {
        if (count_ < 3) {
          styleTitle_[will["_id"]] = true;
          count_ += 1;
          chipData_.push({
            will: will["will_pages"],
            id: will["_id"],
            name: will["testator.name"]
          });
        } else {
          this.setState({
            openAlert: true
          });
        }
      }

      this.setState({
        styleTitle: styleTitle_,
        count: count_,
        chipData: chipData_
      });
    }.bind(this);
  }

  handleDelete(chipToDelete) {
    let styleTitle_ = this.state.styleTitle;
    styleTitle_[chipToDelete["id"]] = false;

    this.setState({
      chipData: this.state.chipData.filter(
        chip => chip["id"] !== chipToDelete["id"]
      ),
      count: this.state.count - 1,
      styleTitle: styleTitle_
    });
  }

  handleCompareClick() {
    const url_ids = this.state.chipData.map(item => item["id"]);
    localStorage.setItem("willCompare", JSON.stringify(this.state.styleTitle));
    localStorage.setItem("chipData", JSON.stringify(this.state.chipData));
    window.location.href =
      getParamConfig("web_url") + "/compare/" + url_ids.join("+");
  }

  componentDidUpdate() {
    if (localStorage.uriSearch !== document.location.href) {
      if (document.location.href.split("?")[1]) {
        localStorage.setItem("uriSearch", document.location.href);
      } else {
        localStorage.removeItem("uriSearch");
      }
    }

    if (this.state.chipData !== undefined) {
      let chip = (
        <div id="chipWill">
          {this.state.chipData.map(data => {
            const name = data["name"].split(" ");
            const username =
              name[0].length > 2 ? name[0] : name[0] + " " + name[1];
            const forename = name[name.length - 1];
            return (
              <Chip
                key={data["id"]}
                label={forename[0] + ". " + username}
                onDelete={e => this.handleDelete(data)}
              />
            );
          })}
        </div>
      );
      if (this.state.count > 0) {
        ReactDOM.render(chip, document.getElementById("chipRoot"));
      } else {
        ReactDOM.render(
          <div id="chipWill"></div>,
          document.getElementById("chipRoot")
        );
      }
    }
  }

  componentDidMount() {
    if (localStorage.myBackups) {
      const myBackups_ = JSON.parse(localStorage.myBackups);
      let myWills_ = Boolean(myBackups_["myWills"])
        ? myBackups_["myWills"]
        : [];
      this.setState({
        myWills: myWills_
      });
    }

    if (localStorage.willCompare && localStorage.chipData) {
      const willCompare_ = JSON.parse(localStorage.willCompare);
      const chipData_ = JSON.parse(localStorage.chipData);
      localStorage.removeItem("willCompare");
      localStorage.removeItem("chipData");
      this.setState({
        styleTitle: willCompare_,
        count: chipData_.length,
        chipData: chipData_
      });
    }

    document
      .getElementById("btCompare")
      .addEventListener("click", this.handleCompareClick, true);
  }

  render() {
    const results = this.state.curData.map((item, j) => {
      let descriptions = [];
      if (item.inner_hits) {
        const hits_size = item.inner_hits.will_pages.hits.hits.length;

        item.inner_hits.will_pages.hits.hits.sort(function(a, b) {
          return b._source["page_type"]["type"].localeCompare(
            a._source["page_type"]["type"]
          );
        });
        item.inner_hits.will_pages.hits.hits.sort(function(a, b) {
          return a._source["page_type"]["id"] - b._source["page_type"]["id"];
        });
        descriptions = item.inner_hits.will_pages.hits.hits.map((hit, i) => {
          let url_param = item["_id"];
          url_param += hit._source["page_type"]
            ? "/" +
              hit._source["page_type"]["type"] +
              "_" +
              hit._source["page_type"]["id"]
            : "";
          let div_id_page = (
            <React.Fragment>
              <Link
                href={getParamConfig("web_url") + "/testament/" + url_param}
                aria-label="More"
                style={{ color: "#424242", fontSize: 16 }}
              >
                {listMenu[hit._source["page_type"]["type"]]}{" "}
                {hit._source["page_type"]["id"]}
              </Link>
            </React.Fragment>
          );

          let div_text_page = [];
          if (hit.highlight) {
            div_text_page = hit.highlight[Object.keys(hit.highlight)[0]].map(
              (page, k) => {
                return (
                  <Typography
                    key={k + 1000}
                    component="span"
                    className="typoText"
                    dangerouslySetInnerHTML={{
                      __html: page
                    }}
                  />
                );
              }
            );
          }

          return (
            <span key={i * 1000 + 1}>
              {div_id_page}
              {div_text_page}
              {i < hits_size - 1 ? <Divider variant="inset" /> : null}
            </span>
          );
        });
      }

      const isAdded = Boolean(this.userToken)
        ? this.state.myWills.findIndex(el => el === item["_id"])
        : -1;

      let will_date = Boolean(item["will_contents.will_date"])
        ? new Date(item["will_contents.will_date"])
        : null;
      will_date = Boolean(will_date) ? will_date.toLocaleDateString() : null;
      let title_testator = (
        <p>
          Testament de {" " + item["testator.forename"]}{" "}
          <span style={{ fontVariantCaps: "small-caps" }}>
            {item["testator.surname"]}
          </span>
          <span> {Boolean(will_date) ? " rédigé le " + will_date : ""} </span>
        </p>
      );

      /* title_testator += (
        <span> Boolean(will_date) ? " rédigé le " + will_date : ""; </span>
      );*/
      return (
        <div className="resultWills" key={j}>
          <ListItem alignItems="flex-start" component="div">
            <ListItemText
              primary={
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs="auto">
                    <Tooltip title={title_testator} arrow={true}>
                      <Link
                        href={
                          getParamConfig("web_url") +
                          "/testament/" +
                          item["_id"]
                        }
                        aria-label="More"
                        className="typoName"
                      >
                        {item["testator.forename"] + " "}
                        <span className="typoSurname">
                          {item["testator.surname"]}
                        </span>
                      </Link>
                    </Tooltip>
                    {Boolean(will_date) ? (
                      <Typography className="typoSubTitle">
                        Testament rédigé le {will_date}
                      </Typography>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs="auto" value={item["_id"]}>
                    <Grid container direction="row" spacing={1}>
                      <Grid item onClick={this.handleClickWill(item)}>
                        {Boolean(this.state.styleTitle[item["_id"]]) ? (
                          <Tooltip
                            title="Supprimer de la liste de comparaison"
                            style={{ cursor: "hand" }}
                            interactive
                            arrow={true}
                          >
                            <IconButton>
                              <ListAddCheckIcon color="action" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Ajouter à la comparaison"
                            style={{ cursor: "hand" }}
                            interactive
                            arrow={true}
                          >
                            <IconButton>
                              <ListAddIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>
                      <Grid item>
                        {Boolean(this.userToken) ? (
                          isAdded === -1 ? (
                            <Tooltip
                              title="Ajouter au panier"
                              placement="bottom"
                              style={{ cursor: "hand" }}
                              arrow={true}
                            >
                              <IconButton
                                onClick={this.handleAddShoppingWill(
                                  item["_id"]
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
                              arrow={true}
                            >
                              <IconButton
                                onClick={this.handleremoveShoppingWill(
                                  item["_id"]
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
                </Grid>
              }
              secondary={descriptions}
            />
          </ListItem>
          <Divider variant="inset" />
        </div>
      );
    });

    results.push(
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key="topCenter"
        open={this.state.openAlert}
        onClose={this.handleClose}
        autoHideDuration={5000}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <SnackbarContent
          className="info"
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className="message">
              <InfoIcon className="iconVariant" />
              Le nombre maximum de testaments à comparer est atteint.
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon className="icon" />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
    return (
      <div className="list-container">
        <div className="menuComparaison">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Tooltip
                title="Comparer les testaments"
                style={{ cursor: "hand" }}
                interactive
              >
                <Button id="btCompare" aria-label="Compare" size="small">
                  <CompareIcon />
                  Comparer les testaments
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <div id="chipRoot">
                <div id="chipWill"></div>
              </div>
            </Grid>
          </Grid>
        </div>
        {results}
      </div>
    );
  }
}
