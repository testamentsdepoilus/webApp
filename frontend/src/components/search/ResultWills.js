import React from "react";
import ReactDOM from "react-dom";
import WillDisplay from "../WillDisplay";
import CloseIcon from "@material-ui/icons/Close";
import {
  ListItemText,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  DialogContent,
  Chip,
  Snackbar,
  SnackbarContent,
  Link,
  Tooltip
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import classNames from "classnames";
import {
  createStyled,
  getParamConfig,
  getUserToken,
  updateMyListWills
} from "../../utils/functions";
import WillCompare from "../WillCompare";
import InfoIcon from "@material-ui/icons/Info";

import ListAddIcon from "@material-ui/icons/PlaylistAddOutlined";
import ListAddCheckIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartOutlined";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartOutlined";

// Style button
const Styled = createStyled(theme => ({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  },
  typoName: {
    fontSize: 20,
    fontStyle: "oblique",
    fontWeight: 600,
    color: "#424242"
  },
  typoText: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 15,
    paddingLeft: 20,
    display: "block"
  },
  margin: {
    margin: theme.spacing(12)
  },

  willTitle: {
    "&:hover": {
      borderColor: "#E0E0E0",
      border: "solid",
      cursor: "pointer"
    }
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  chipRoot: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: theme.spacing(0.5)
  },
  info: {
    backgroundColor: "#1976d2"
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center",
    fontSize: 16
  }
}));

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
      let myWills_ =
        localStorage.myWills.length > 0 ? localStorage.myWills.split(",") : [];
      myWills_.push(id);
      const newItem = {
        email: this.userToken.email,
        myWills: myWills_
      };

      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            message: res.mess,
            myWills: myWills_
          });
          localStorage.setItem("myWills", myWills_);
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";

          this.setState({
            message: err
          });
        }
      });
    }.bind(this);
  }

  handleremoveShoppingWill(id) {
    return function(e) {
      let myWills_ = localStorage.myWills
        .split(",")
        .filter(item => item !== id);
      const newItem = {
        email: this.userToken.email,
        myWills: myWills_
      };
      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          this.setState({
            message: res.mess,
            myWills: myWills_
          });
          localStorage.setItem("myWills", myWills_);
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          this.setState({
            message: err
          });
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

    document
      .getElementById("btCompare")
      .addEventListener("click", this.handleCompareClick, true);
  }

  componentDidMount() {
    if (localStorage.myWills) {
      this.setState({
        myWills:
          localStorage.myWills.length > 0 ? localStorage.myWills.split(",") : []
      });
    }
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
          let div_id_page = (
            <React.Fragment>
              <Link
                id="btMore"
                onClick={this.displayMore(item, hit._source["page_type"])}
                aria-label="More"
                component="button"
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
                  <Styled key={k + 1000}>
                    {({ classes }) => (
                      <Typography
                        component="span"
                        className={classNames(
                          classes.typoText,
                          classes.typography
                        )}
                        dangerouslySetInnerHTML={{
                          __html: page
                        }}
                      />
                    )}
                  </Styled>
                );
              }
            );
          }

          return (
            <React.Fragment key={i * 1000 + 1}>
              {div_id_page}
              {div_text_page}
              {i < hits_size - 1 ? (
                <Divider variant="inset" light={true} />
              ) : null}
            </React.Fragment>
          );
        });
      }

      const isAdded = Boolean(this.userToken)
        ? this.state.myWills.findIndex(el => el === item["_id"])
        : -1;
      return (
        <Styled key={j}>
          {({ classes }) => (
            <React.Fragment>
              <ListItem alignItems="flex-start" component="div">
                <ListItemText
                  primary={
                    <Grid container direction="row" spacing={1}>
                      <Grid item xs={10}>
                        <Link
                          onClick={this.displayMore(item, null)}
                          aria-label="More"
                          className={classNames(
                            classes.typoName,
                            classes.typography
                          )}
                          component="button"
                        >
                          {item["will_identifier.name"].replace(
                            "Testament de",
                            ""
                          )}
                        </Link>
                      </Grid>
                      <Grid item xs={2} value={item["_id"]}>
                        <Grid container direction="row" spacing={1}>
                          <Grid item>
                            <Tooltip
                              title="Ajouter à la comparaison"
                              style={{ cursor: "hand" }}
                              interactive
                            >
                              {Boolean(this.state.styleTitle[item["_id"]]) ? (
                                <ListAddCheckIcon
                                  onClick={this.handleClickWill(item)}
                                  color="action"
                                />
                              ) : (
                                <ListAddIcon
                                  onClick={this.handleClickWill(item)}
                                />
                              )}
                            </Tooltip>
                          </Grid>
                          {Boolean(this.userToken) ? (
                            <Grid item>
                              {isAdded === -1 ? (
                                <Tooltip
                                  title="Ajouter au panier"
                                  placement="bottom"
                                  style={{ cursor: "hand" }}
                                >
                                  <AddShoppingCartIcon
                                    onClick={this.handleAddShoppingWill(
                                      item["_id"]
                                    )}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  title="Supprimer de panier"
                                  placement="bottom"
                                  style={{ cursor: "hand" }}
                                >
                                  <RemoveShoppingCartIcon
                                    color="action"
                                    onClick={this.handleremoveShoppingWill(
                                      item["_id"]
                                    )}
                                  />
                                </Tooltip>
                              )}
                            </Grid>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                  secondary={descriptions}
                />
              </ListItem>
              <Divider variant="inset" light={true} />
            </React.Fragment>
          )}
        </Styled>
      );
    });

    results.push(
      <Dialog
        key={1000}
        fullWidth={true}
        maxWidth="xl"
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <Grid container direction="row" spacing={4}>
          <Grid item xs={10}>
            <DialogTitle id="max-width-dialog-title">{""}</DialogTitle>
          </Grid>
          <Grid item xs={2}>
            <DialogActions>
              <IconButton
                id="btClose"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon
                  fontSize="large"
                  style={{
                    color: "#b71c1c"
                  }}
                />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>

        <DialogContent>
          {this.state.displayType === "More" ? (
            <WillDisplay
              data={this.state.willPage}
              cur_page={this.state.cur_page}
            />
          ) : (
            <WillCompare data={this.state.chipData} />
          )}
        </DialogContent>
      </Dialog>
    );
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
        message={
          <span id="message-id">
            Le nombre maximum de testaments à comparer est atteint.
          </span>
        }
      >
        <Styled>
          {({ classes }) => (
            <SnackbarContent
              className={classes.info}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <InfoIcon
                    className={classNames(classes.icon, classes.iconVariant)}
                  />
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
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]}
            />
          )}
        </Styled>
      </Snackbar>
    );
    return <div className="list-container">{results}</div>;
  }
}
