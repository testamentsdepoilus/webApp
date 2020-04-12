import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import VisibilityIcon from "@material-ui/icons/VisibilityOutlined";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";
import {
  getParamConfig,
  updateMyListWills,
  getHitsFromQuery,
  getUserToken,
  downloadFile,
  downloadZipFiles,
  generatePDF,
  generateZipPDF,
  generateTestatorHTML,
} from "../../utils/functions";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Grid,
  MenuList,
  MenuItem,
  TableContainer,
  Fab,
  CircularProgress,
  FormControlLabel,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import Footer from "../Footer";

// Up to top page click
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (Boolean(document.getElementById("btTop"))) {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById("btTop").style.display = "block";
    } else {
      document.getElementById("btTop").style.display = "none";
    }
  }
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: "title", numeric: false, disablePadding: false, label: "Titre" },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    title,
  } = props;

  const title_ = {
    myWills: "Testament",
    myTestators: "Testateur",
    myPlaces: "Lieu",
    myUnits: "Unité militaire",
    mySearches: "Recherche",
  };
  return (
    <TableHead>
      <TableRow className="head">
        <Tooltip title="Sélectionner tous les éléments">
          <TableCell padding="checkbox">
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all elements" }}
                />
              }
              label={
                numSelected === rowCount ? (
                  <Typography className="labelCheckBox">
                    Désélectionner tout
                  </Typography>
                ) : (
                  <Typography className="labelCheckBox">
                    Sélectionner tout
                  </Typography>
                )
              }
            />
          </TableCell>
        </Tooltip>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <Typography className="labelTitle">{title_[title]}</Typography>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, actionButton, title } = props;
  const title_ = {
    myWills: "Les testaments",
    myTestators: "Les testateurs",
    myPlaces: "Les lieux",
    myUnits: "Les unités militaires",
    mySearches: "Mes recherches",
  };
  return (
    <Toolbar className="toolBar" id={title}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <h6 className="title" id="tableTitle">
            {title_[title]}
          </h6>
        </Grid>
        <Grid item>
          {numSelected > 0 ? (
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography
                  className="highlight"
                  color="inherit"
                  variant="subtitle1"
                >
                  {numSelected === 1
                    ? numSelected + " sélectionné"
                    : numSelected + " sélectionnés"}
                </Typography>
              </Grid>
              <Grid item>{actionButton}</Grid>
            </Grid>
          ) : (
            actionButton
          )}
        </Grid>
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  actionButton: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};
const AlertMessage = (props) => {
  const { openAlert, handleClose, message } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      key="topCenter"
      open={openAlert}
      onClose={handleClose}
      autoHideDuration={3000}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={<span id="message-id">{message}</span>}
    ></Snackbar>
  );
};

AlertMessage.propTypes = {
  openAlert: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default class MyShoppingCart extends Component {
  constructor() {
    super();
    this.state = {
      order: {
        myWills: "asc",
        myTestators: "asc",
        myPlaces: "asc",
        myUnits: "asc",
        mySearches: "asc",
      },
      orderBy: "title",
      selected: {
        myWills: [],
        myTestators: [],
        myPlaces: [],
        myUnits: [],
        mySearches: [],
      },
      data: {
        myWills: [],
        myTestators: [],
        myPlaces: [],
        myUnits: [],
        mySearches: [],
      },
      open: false,
      openAlert: false,
      mess: "",
      type: null,
      isLoading: false,
    };
    this.userToken = getUserToken();
    this.handleExportTestator = this.handleExportTestator.bind(this);
    this.handleExportPlace = this.handleExportPlace.bind(this);
    this.handleRemoveWill = this.handleRemoveWill.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleRequestSort = (title) => {
    return function (property) {
      const isDesc =
        this.state.orderBy === property && this.state.order[title] === "desc";
      let order_ = this.state.order;
      order_[title] = isDesc ? "asc" : "desc";
      this.setState({
        order: order_,
        orderBy: property,
      });
    }.bind(this);
  };

  handleSelectAllClick = (data, title) => {
    return function (event) {
      let selected_ = this.state.selected;
      if (event.target.checked) {
        selected_[title] =
          title === "mySearches"
            ? data.map((n) => n["label"])
            : data.map((n) => n["_id"]);

        //localStorage.setItem("favorisItems", selected_);
        this.setState({
          selected: selected_,
          type: title,
        });

        return;
      } else {
        selected_[title] = [];
        //localStorage.setItem("favorisItems", selected_);
        this.setState({
          selected: selected_,
        });
      }
    }.bind(this);
  };

  handleClick = (name, title) => {
    const selectedIndex = this.state.selected[title].indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected[title], name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected[title].slice(1));
    } else if (selectedIndex === this.state.selected[title].length - 1) {
      newSelected = newSelected.concat(this.state.selected[title].slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected[title].slice(0, selectedIndex),
        this.state.selected[title].slice(selectedIndex + 1)
      );
    }
    let selected_ = this.state.selected;
    selected_[title] = newSelected;
    localStorage.setItem("favorisItems", JSON.stringify(selected_));
    this.setState({
      selected: selected_,
      type: title,
    });
  };

  handleRemoveWill(title) {
    this.setState({
      open: true,
      type: title,
    });
  }

  handleDialogClose() {
    this.setState({
      open: false,
    });
  }

  handleDialogConfirm() {
    let myBackups_ = JSON.parse(localStorage.myBackups);
    myBackups_[this.state.type] =
      this.state.type === "mySearches"
        ? myBackups_[this.state.type].filter(
            (item) => !this.state.selected[this.state.type].includes(item.label)
          )
        : myBackups_[this.state.type].filter(
            (item) => !this.state.selected[this.state.type].includes(item)
          );

    let newItem = {
      email: this.userToken.email,
      myBackups: myBackups_,
    };

    updateMyListWills(newItem).then((res) => {
      if (res.status === 200) {
        this.setState({
          open: false,
        });
        localStorage.setItem("myBackups", JSON.stringify(myBackups_));
        document.location.reload();
      } else {
        const err = res.err ? res.err : "Connexion au serveur a échoué !";
        this.setState({
          open: false,
          openAlert: true,
          mess: err,
        });
      }
    });
  }

  handleAlertClose() {
    document.location.reload();
  }

  handleDisplayWill = (row, title) => {
    return function (e) {
      let uri_component = "testament";
      switch (title) {
        case "myWills":
          uri_component = "testament";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_blank"
          );
          break;
        case "myPlaces":
          uri_component = "place";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_blank"
          );
          break;
        case "myUnits":
          uri_component = "armee";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_blank"
          );
          break;
        case "myTestators":
          uri_component = "testateur";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_blank"
          );
          break;
        case "mySearches":
          window.open(row.url, "_blank");
          break;
        default:
          break;
      }
    };
  };

  handleCompareWill = (title) => {
    window.location.href =
      getParamConfig("web_url") +
      "/compare/" +
      this.state.selected[title].join("+");
  };

  handleExportWill() {
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myWills_ = myBackups_.myWills.filter((item) =>
      this.state.selected[this.state.type].includes(item)
    );

    if (myWills_.length === 1) {
      downloadFile(
        getParamConfig("web_url") + "/files/will_" + myWills_[0] + ".xml",
        "will_" + myWills_[0] + ".xml"
      );
    } else if (myWills_.length > 1) {
      let urls = myWills_.map((item) => {
        const url = getParamConfig("web_url") + "/files/will_" + item + ".xml";
        return url;
      });
      downloadZipFiles(urls, "testaments.zip");
    }
  }

  handleExportTestator() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myTestators_ = myBackups_.myTestators.filter((item) =>
      this.state.selected[this.state.type].includes(item)
    );
    let output_filename = myTestators_.map((id) => "testateur_" + id);
    generateTestatorHTML(myTestators_)
      .then((outputHTML) => {
        if (outputHTML.length === 1) {
          const inputItem = {
            outputHtml: outputHTML[0],
            filename: "Projet_TdP_" + output_filename[0],
          };
          generatePDF(inputItem).then((res) => {
            if (res.status === 200) {
              downloadFile(
                getParamConfig("web_url") +
                  "/outputPDF/" +
                  output_filename[0] +
                  ".pdf",
                output_filename[0] + ".pdf"
              );
              this.setState({
                isLoading: false,
              });
            } else {
              const err = res.err ? res.err : "Connexion au serveur a échoué !";
              console.log(err);
              this.setState({
                isLoading: false,
              });
            }
          });
        } else if (outputHTML.length > 1) {
          generateZipPDF(outputHTML, output_filename)
            .then((res) => {
              downloadZipFiles(res, "Projet_TdP_testateurs.zip");
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
      })
      .catch((e) => console.log("error :" + e));
  }

  handleExportPlace() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myPlaces_ = myBackups_.myPlaces.filter((item) =>
      this.state.selected[this.state.type].includes(item)
    );
    let output_filename = myPlaces_.map((id) => "lieu_" + id);
    generateTestatorHTML(myPlaces_)
      .then((outputHTML) => {
        if (outputHTML.length === 1) {
          const inputItem = {
            outputHtml: outputHTML[0],
            filename: "Projet_TdP_" + output_filename[0],
          };
          generatePDF(inputItem).then((res) => {
            if (res.status === 200) {
              downloadFile(
                getParamConfig("web_url") +
                  "/outputPDF/" +
                  output_filename[0] +
                  ".pdf",
                output_filename[0] + ".pdf"
              );
              this.setState({
                isLoading: false,
              });
            } else {
              const err = res.err ? res.err : "Connexion au serveur a échoué !";
              console.log(err);
              this.setState({
                isLoading: false,
              });
            }
          });
        } else if (outputHTML.length > 1) {
          generateZipPDF(outputHTML, output_filename)
            .then((res) => {
              downloadZipFiles(res, "Projet_TdP_lieux.zip");
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
      })
      .catch((e) => console.log("error :" + e));
  }

  setDefaultView(data, title, actionButton) {
    const isSelected = (name) =>
      this.state.selected[title].indexOf(name) !== -1;
    const title_norm = {
      myWills: "l'édition du testament",
      myTestators: "la notice du testateur",
      myPlaces: "la notice du lieu",
      myUnits: "la notice de l'unité militaire",
      mySearches: "la recherche",
    };
    console.log("this.state.selected :", this.state.selected);
    return (
      <TableContainer component={Paper} className="paper">
        <EnhancedTableToolbar
          numSelected={this.state.selected[title].length}
          actionButton={actionButton}
          title={title}
        />

        <Table
          className="table"
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            numSelected={this.state.selected[title].length}
            order={this.state.order[title]}
            orderBy={this.state.orderBy}
            onSelectAllClick={this.handleSelectAllClick(data, title)}
            onRequestSort={this.handleRequestSort(title)}
            rowCount={data.length}
            title={title}
          />
          <TableBody>
            {stableSort(
              data,
              getSorting(this.state.order[title], this.state.orderBy)
            ).map((row, index) => {
              const isItemSelected =
                title === "mySearches"
                  ? isSelected(row.label)
                  : isSelected(row["_id"]);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                >
                  {title === "mySearches" ? (
                    <TableCell
                      onClick={(envent) => this.handleClick(row.label, title)}
                      role="checkbox"
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                  ) : (
                    <TableCell
                      onClick={(event) => this.handleClick(row["_id"], title)}
                      role="checkbox"
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                  )}
                  {title === "mySearches" ? (
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.label}
                    </TableCell>
                  ) : (
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.title.replace("Testament de", "")}
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Tooltip title={"Consulter " + title_norm[title]}>
                      <IconButton
                        onClick={this.handleDisplayWill(row, title)}
                        aria-label="display"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  componentDidMount() {
    let data_ = this.state.data;
    const favorisItems_ = Boolean(localStorage.favorisItems)
      ? JSON.parse(localStorage.favorisItems)
      : null;
    const myBackups_ = Boolean(localStorage.myBackups)
      ? JSON.parse(localStorage.myBackups)
      : {};
    if (Boolean(myBackups_.myWills)) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          query: {
            ids: {
              values: myBackups_.myWills,
            },
          },
        })
      )
        .then((data) => {
          data_["myWills"] = data.map((item) => {
            const output = {
              _id: item["_id"],
              title: item._source["will_identifier.name"],
            };
            return output;
          });
          this.setState({
            data: data_,
          });
        })
        .catch((error) => {
          console.log("error :", error);
        });
    }
    if (Boolean(myBackups_.myTestators)) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            ids: {
              values: myBackups_.myTestators,
            },
          },
        })
      )
        .then((data) => {
          data_["myTestators"] = data.map((item) => {
            const output = {
              _id: item["_id"],
              title: item._source["persName.fullProseForm"],
            };
            return output;
          });

          this.setState({
            data: data_,
          });
        })
        .catch((error) => {
          console.log("error :", error);
        });
    }
    if (Boolean(myBackups_.myPlaces)) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_places"),
        JSON.stringify({
          query: {
            ids: {
              values: myBackups_.myPlaces,
            },
          },
        })
      )
        .then((data) => {
          data_["myPlaces"] = data.map((item) => {
            const output = {
              _id: item["_id"],
              title: item._source["city"],
            };
            return output;
          });

          this.setState({
            data: data_,
          });
        })
        .catch((error) => {
          console.log("error :", error);
        });
    }
    if (Boolean(myBackups_.myUnits)) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_units"),
        JSON.stringify({
          query: {
            ids: {
              values: myBackups_.myUnits,
            },
          },
        })
      )
        .then((data) => {
          data_["myUnits"] = data.map((item) => {
            const output = {
              _id: item["_id"],
              title: item._source["unit"],
            };
            return output;
          });

          this.setState({
            data: data_,
          });
        })
        .catch((error) => {
          console.log("error :", error);
        });
    }
    if (Boolean(myBackups_.mySearches)) {
      data_["mySearches"] = Boolean(myBackups_.mySearches)
        ? myBackups_.mySearches
        : [];
      this.setState({
        data: data_,
      });
    }
    if (Boolean(favorisItems_)) {
      this.setState({
        selected: favorisItems_,
      });
    }
  }

  topFunction = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  exportRender = function (title) {
    let output = null;
    switch (title) {
      case "myWills":
        output = (
          <Grid item>
            <Tooltip title="Exporter les testaments sélectionnés">
              <span>
                <IconButton
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportWill}
                  aria-label="export"
                >
                  <ExportIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        );
        break;
      case "myPlaces":
        output = (
          <Grid item>
            <Tooltip title="Exporter les notices sélectionnées">
              <span>
                <IconButton
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportPlace}
                  aria-label="export"
                >
                  <ExportIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        );
        break;
      case "myUnits":
        output = (
          <Grid item>
            <Tooltip title="Exporter les notices sélectionnées">
              <span>
                <IconButton
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportUnit}
                  aria-label="export"
                >
                  <ExportIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        );
        break;
      case "myTestators":
        output = (
          <Grid item>
            <Tooltip title="Exporter les notices sélectionnées">
              <span>
                <IconButton
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportTestator}
                  aria-label="export"
                >
                  <ExportIcon />
                </IconButton>
              </span>
            </Tooltip>
            {Boolean(this.state.isLoading) ? <CircularProgress /> : ""}
          </Grid>
        );
        break;
      case "mySearches":
        output = null;
        break;
      default:
        break;
    }
    return output;
  };

  actionButton = function (title) {
    return (
      <Grid
        id={"actionBt_" + title}
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Grid item>
          <Tooltip title="Suppression des éléments sélectionnés">
            <span>
              <IconButton
                disabled={
                  Boolean(this.state.selected[title]) &&
                  this.state.selected[title].length > 0
                    ? false
                    : true
                }
                onClick={(event) => this.handleRemoveWill(title)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
        {this.exportRender(title)}
        {title === "myWills" ? (
          Boolean(this.state.selected[title]) &&
          this.state.selected[title].length < 4 ? (
            <Grid item>
              <Tooltip title="Comparer les testaments sélectionnés">
                <span>
                  <IconButton
                    disabled={
                      Boolean(this.state.selected[title]) &&
                      this.state.selected[title].length > 0
                        ? false
                        : true
                    }
                    onClick={(event) => this.handleCompareWill("myWills")}
                    aria-label="compare"
                  >
                    <CompareIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          ) : (
            <Grid item>
              <Tooltip title="On peut comparer au maximum 3 testaments à la fois">
                <span>
                  <IconButton aria-label="compare" disabled>
                    <CompareIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          )
        ) : null}
      </Grid>
    );
  };

  render() {
    const menu = (
      <Paper className="menu">
        <MenuList>
          <MenuItem key={1}>
            <a href="#wills_div" className="link">
              Testaments
            </a>
          </MenuItem>
          <MenuItem key={2}>
            {" "}
            <a href="#testators_div" className="link">
              Testateurs
            </a>
          </MenuItem>
          <MenuItem key={3}>
            <a href="#places_div" className="link">
              Lieux
            </a>
          </MenuItem>
          <MenuItem key={4}>
            <a href="#units_div" className="link">
              Unités militaires
            </a>
          </MenuItem>
          <MenuItem key={5}>
            <a href="#searches_div" className="link">
              Mes recherches
            </a>
          </MenuItem>
        </MenuList>
      </Paper>
    );

    const defaultView = (
      <div className="favoris">
        <Breadcrumbs className="menuCMS" aria-label="Breadcrumb">
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>

          <Link
            id="espace"
            key={1}
            color="inherit"
            component={RouterLink}
            to="/espace"
          >
            Mon espace
          </Link>
          <Link
            id="favoris"
            key={1}
            color="inherit"
            component={RouterLink}
            to="/espace/panier"
          >
            Mes favoris
          </Link>
        </Breadcrumbs>
        <div id="testator_none" style={{ display: "none" }}></div>
        <h1 className="heading">MES FAVORIS</h1>
        <Grid container direction="row" justify="center" spacing={2}>
          <Grid item xs={4}>
            {menu}
          </Grid>
          <Grid item xs={8}>
            <section id="wills_div">
              {this.setDefaultView(
                this.state.data["myWills"],
                "myWills",
                this.actionButton("myWills")
              )}
            </section>
            <section id="testators_div">
              {this.setDefaultView(
                this.state.data["myTestators"],
                "myTestators",
                this.actionButton("myTestators")
              )}
            </section>
            <section id="places_div">
              {this.setDefaultView(
                this.state.data["myPlaces"],
                "myPlaces",
                this.actionButton("myPlaces")
              )}
            </section>
            <section id="units_div">
              {this.setDefaultView(
                this.state.data["myUnits"],
                "myUnits",
                this.actionButton("myUnits")
              )}
            </section>
            <section id="searches_div">
              {this.setDefaultView(
                this.state.data["mySearches"],
                "mySearches",
                this.actionButton("mySearches")
              )}
            </section>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          aria-labelledby={"draggable-dialog-title"}
        >
          <DialogTitle style={{ cursor: "move" }} id={"draggable-dialog-title"}>
            Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Souhaitez-vous vraiment supprimer les éléments sélectionnés ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleDialogClose} color="primary">
              Annuler
            </Button>
            <Button onClick={this.handleDialogConfirm} color="primary">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        <AlertMessage
          message={this.state.mess}
          openAlert={this.state.openAlert}
          handleClose={this.handleAlertClose}
        />

        <Tooltip title="Haut de page" style={{ cursor: "hand" }} interactive>
          <Fab
            id="btTop"
            onClick={this.topFunction}
            aria-label="Top"
            className="bootstrapRoot"
            size="medium"
          >
            <ArrowUpIcon />
          </Fab>
        </Tooltip>
        <Footer />
      </div>
    );

    return defaultView;
  }
}
