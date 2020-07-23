import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

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
  generatePlaceHTML,
  generateUnitHTML,
  generateWillHTML,
  generateWillPDF,
  generateWillZipPDF,
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
  CircularProgress,
  FormControlLabel,
  Breadcrumbs,
  Link,
  Box,
  SvgIcon,
  Menu,
} from "@material-ui/core";

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
            <div>{title_[title]}</div>
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
    <Box
      className="toolBar"
      id={title}
      display={{ xs: "block", sm: "flex" }}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <div class="d-flex">
        <h2
          className="card-title bg-dark-gray text-white fontWeightMedium"
          id="tableTitle"
        >
          {title_[title]}
        </h2>
      </div>

      {numSelected > 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          <div className="fontWeightRegular">
            {numSelected === 1
              ? numSelected + " sélectionné"
              : numSelected + " sélectionnés"}
          </div>
          {actionButton}
        </Box>
      ) : (
        actionButton
      )}
    </Box>
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

export default class MyFavoritesCart extends Component {
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
      anchorElMenu: null,
    };
    this.curDate = new Date();
    this.curDate = this.curDate.toLocaleDateString("en-GB").replace(/\/+/g, "");
    this.userToken = getUserToken();
    this.handleExportWill = this.handleExportWill.bind(this);
    this.handleExportWillClose = this.handleExportWillClose.bind(this);
    this.handleExportWillTEI = this.handleExportWillTEI.bind(this);
    this.handleExportWillPDF = this.handleExportWillPDF.bind(this);
    this.handleExportTestator = this.handleExportTestator.bind(this);
    this.handleExportPlace = this.handleExportPlace.bind(this);
    this.handleExportUnit = this.handleExportUnit.bind(this);
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
            "_self"
          );
          break;
        case "myPlaces":
          uri_component = "place";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_self"
          );
          break;
        case "myUnits":
          uri_component = "armee";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_self"
          );
          break;
        case "myTestators":
          uri_component = "testateur";
          window.open(
            getParamConfig("web_url") + "/" + uri_component + "/" + row["_id"],
            "_self"
          );
          break;
        case "mySearches":
          window.open(row.url, "_self");
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

  handleExportWill(event) {
    this.setState({
      anchorElMenu: event.currentTarget,
    });
  }

  handleExportWillClose() {
    this.setState({
      anchorElMenu: null,
    });
  }

  handleExportWillTEI() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myWills_ = myBackups_.myWills.filter((item) =>
      this.state.selected["myWills"].includes(item)
    );

    if (myWills_.length === 1) {
      downloadFile(
        getParamConfig("web_url") + "/files/wills/will_" + myWills_[0] + ".xml",
        "will_" + myWills_[0] + ".xml"
      );
      this.setState({
        isLoading: false,
      });
    } else if (myWills_.length > 1) {
      let urls = myWills_.map((item) => {
        const url =
          getParamConfig("web_url") + "/files/wills/will_" + item + ".xml";
        return url;
      });
      downloadZipFiles(urls, "Projet_TdP_testaments_" + this.curDate + ".zip");
      this.setState({
        isLoading: false,
      });
    }
  }

  handleExportWillPDF() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myWills_ = myBackups_.myWills.filter((item) =>
      this.state.selected["myWills"].includes(item)
    );
    let output_filename = myWills_.map((id) => "Projet_TdP_testament_" + id);
    generateWillHTML(myWills_)
      .then((output) => {
        if (output.length === 1) {
          generateWillPDF(output[0]).then((res) => {
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
        } else if (output.length > 1) {
          generateWillZipPDF(output, output_filename)
            .then((res) => {
              downloadZipFiles(
                res,
                "Projet_TdP_testaments_" + this.curDate + ".zip"
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
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
        console.log("error :" + e);
      });
  }

  handleExportTestator() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myTestators_ = myBackups_.myTestators.filter((item) =>
      this.state.selected["myTestators"].includes(item)
    );
    let output_filename = myTestators_.map(
      (id) => "Projet_TdP_testateur_" + id
    );
    generateTestatorHTML(myTestators_)
      .then((outputHTML) => {
        if (outputHTML.length === 1) {
          const inputItem = {
            outputHtml: outputHTML[0],
            filename: output_filename[0],
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
              downloadZipFiles(
                res,
                "Projet_TdP_testateurs_" + this.curDate + ".zip"
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
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
        console.log("error :" + e);
      });
  }

  handleExportPlace() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);
    const myPlaces_ = myBackups_.myPlaces.filter((item) =>
      this.state.selected["myPlaces"].includes(item)
    );
    let output_filename = myPlaces_.map((id) => "Projet_TdP_lieu_" + id);
    generatePlaceHTML(myPlaces_)
      .then((outputHTML) => {
        if (outputHTML.length === 1) {
          const inputItem = {
            outputHtml: outputHTML[0],
            filename: output_filename[0],
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
              downloadZipFiles(
                res,
                "Projet_TdP_lieux_" + this.curDate + ".zip"
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
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
        console.log("error :" + e);
      });
  }

  handleExportUnit() {
    this.setState({
      isLoading: true,
    });
    const myBackups_ = JSON.parse(localStorage.myBackups);

    const myUnits_ = myBackups_.myUnits.filter((item) =>
      this.state.selected["myUnits"].includes(item)
    );
    let output_filename = myUnits_.map(
      (id) => "Projet_TdP_unite_militaire_" + id
    );
    generateUnitHTML(myUnits_)
      .then((outputHTML) => {
        console.log(outputHTML);
        if (outputHTML.length === 1) {
          const inputItem = {
            outputHtml: outputHTML[0],
            filename: output_filename[0],
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
              downloadZipFiles(
                res,
                "Projet_TdP_unites_militaires_" + this.curDate + ".zip"
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
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
        });
        console.log("error :" + e);
      });
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

    return (
      <TableContainer className="tableContainer">
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
            {data.map((row, index) => {
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
                  <TableCell align="right">
                    <Tooltip title={"Consulter " + title_norm[title]}>
                      <Button
                        className="button iconButton"
                        onClick={this.handleDisplayWill(row, title)}
                        aria-label="display"
                      >
                        <i className="far fa-eye"></i>
                      </Button>
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

          localStorage.setItem(
            "willsIds",
            JSON.stringify(data_["myWills"].map((item) => item._id))
          );
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
            <Tooltip
              placement="top"
              title="Exporter les testaments sélectionnés"
            >
              <span>
                <Button
                  className="button iconButton plain primaryMain"
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportWill}
                  aria-label="export"
                >
                  <i className="fas fa-sm fa-download"></i>
                </Button>
                <Menu
                  className="exportBtn"
                  anchorEl={this.state.anchorElMenu}
                  keepMounted
                  open={Boolean(this.state.anchorElMenu)}
                  onClose={this.handleExportWillClose}
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
                    <Button id="bt-tei" onClick={this.handleExportWillTEI}>
                      <i className="fas fa-code"></i> TEI
                    </Button>
                  </MenuItem>
                  <MenuItem className="d-block">
                    <Button id="bt-pdf" onClick={this.handleExportWillPDF}>
                      <i className="far fa-file-pdf"></i> PDF
                    </Button>
                  </MenuItem>
                </Menu>
              </span>
            </Tooltip>
            <Dialog
              id="dialog_download"
              aria-labelledby="simple-dialog-title"
              open={this.state.isLoading}
              maxWidth="md"
            >
              <CircularProgress />
            </Dialog>
          </Grid>
        );
        break;
      case "myPlaces":
        output = (
          <Grid item>
            <Tooltip title="Exporter les notices sélectionnées">
              <span>
                <Button
                  className="button iconButton plain primaryMain"
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportPlace}
                  aria-label="export"
                >
                  <i className="fas fa-sm fa-download"></i>
                </Button>
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
                <Button
                  className="button iconButton plain primaryMain"
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportUnit}
                  aria-label="export"
                >
                  <i className="fas fa-sm fa-download"></i>
                </Button>
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
                <Button
                  className="button iconButton plain primaryMain"
                  disabled={
                    Boolean(this.state.selected[title]) &&
                    this.state.selected[title].length > 0
                      ? false
                      : true
                  }
                  onClick={this.handleExportTestator}
                  aria-label="export"
                >
                  <i className="fas fa-sm fa-download"></i>
                </Button>
              </span>
            </Tooltip>
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
      <Box id={"actionBt_" + title} alignItems="center" display="flex">
        <Box>
          <Tooltip title="Suppression des éléments sélectionnés">
            <span>
              <Button
                className="button iconButton plain primaryMain"
                disabled={
                  Boolean(this.state.selected[title]) &&
                  this.state.selected[title].length > 0
                    ? false
                    : true
                }
                onClick={(event) => this.handleRemoveWill(title)}
                aria-label="delete"
              >
                <i className="fas fa-sm fa-trash-alt"></i>
              </Button>
            </span>
          </Tooltip>
        </Box>
        {this.exportRender(title)}
        {title === "myWills" ? (
          Boolean(this.state.selected[title]) &&
          this.state.selected[title].length < 4 &&
          this.state.selected[title].length > 1 ? (
            <Box>
              <Tooltip title="Comparer les testaments sélectionnés">
                <span>
                  <Button
                    className="button iconButton plain primaryMain"
                    disabled={
                      Boolean(this.state.selected[title]) &&
                      this.state.selected[title].length > 0
                        ? false
                        : true
                    }
                    onClick={(event) => this.handleCompareWill("myWills")}
                    aria-label="compare"
                  >
                    <i className="fas fa-sm fa-random"></i>
                  </Button>
                </span>
              </Tooltip>
            </Box>
          ) : (
            <Box>
              <Tooltip title="On peut comparer seulement 2 ou 3 testaments à la fois">
                <span>
                  <Button
                    className="button iconButton plain primaryMain"
                    aria-label="compare"
                    disabled
                  >
                    <i className="fas fa-sm fa-random"></i>
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )
        ) : null}
      </Box>
    );
  };

  render() {
    const menu = (
      <div className="leftMenu bg-gray">
        <MenuList>
          <MenuItem className="bg-dark-gray" key={1}>
            <a className="text-white" href="#wills_div">
              <i className="fa-sm fab fa-stack-overflow"></i>Les testaments
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray" key={2}>
            {" "}
            <a className="text-white" href="#testators_div">
              <i className="fa-sm far fa-address-book"></i> Les testateurs
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray" key={3}>
            <a className="text-white" href="#places_div">
              <i className="fa-sm fas fa-map-marker-alt"></i> Les lieux
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray units_div" key={4}>
            <a className="text-white" href="#units_div">
              <SvgIcon>
                <path
                  className="st0"
                  d="M18.4,18.8H6.6c-0.8,0-1.5-0.7-1.5-1.5c0-0.8,0.7-1.5,1.5-1.5h11.8c0.8,0,1.5,0.7,1.5,1.5
                  C19.9,18.1,19.2,18.8,18.4,18.8 M18.4,14.5H6.6c-1.5,0-2.8,1.2-2.8,2.8S5,20,6.6,20h11.8c1.5,0,2.8-1.2,2.8-2.8
                  S19.9,14.5,18.4,14.5"
                />
                <path
                  className="st0"
                  d="M7.1,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7C6.4,16.8,6.7,16.5,7.1,16.5"
                />
                <path
                  className="st0"
                  d="M9.3,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7s-0.7-0.3-0.7-0.7C8.5,16.8,8.8,16.5,9.3,16.5"
                />
                <path
                  className="st0"
                  d="M11.4,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7C10.6,16.8,11,16.5,11.4,16.5"
                />
                <path
                  className="st0"
                  d="M13.5,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7
                  C12.8,16.8,13.1,16.5,13.5,16.5"
                />
                <path
                  className="st0"
                  d="M15.6,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7
                  C14.9,16.8,15.2,16.5,15.6,16.5"
                />
                <path
                  className="st0"
                  d="M17.8,16.5c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7C17,16.8,17.4,16.5,17.8,16.5"
                />
                <path
                  className="st0"
                  d="M18.8,12.5h-11l0.7-0.8H11h7.7V12.5z M12.3,9.9c0-0.7,0.6-1.3,1.3-1.3h2.8c0.7,0,1.3,0.6,1.3,1.3v0.5h-5.3V9.9
                  z M20.1,12.5H20v-2.1h-1.2V9.9c0-1.4-1.1-2.5-2.5-2.5h-0.8V6.3h-1.2v1.1h-0.8c-0.6,0-1.2,0.2-1.6,0.6L4.1,4.4L3.6,5.5L11.2,9
                  C11.1,9.3,11,9.6,11,9.9v0.5H7.8l-1.7,2.1H4.8c-1.5,0-2.8,1.2-2.8,2.8h1.2c0-0.8,0.7-1.5,1.5-1.5h15.4c0.8,0,1.5,0.7,1.5,1.5h1.2
                  C22.9,13.7,21.7,12.5,20.1,12.5"
                />
              </SvgIcon>
              Les unités militaires
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray" key={5}>
            <a className="text-white" href="#searches_div">
              <i className="fa-sm far fa-save"></i> Mes recherches
            </a>
          </MenuItem>
        </MenuList>
      </div>
    );

    const defaultView = (
      <div className="favoris cms">
        <Breadcrumbs
          separator={<i className="fas fa-caret-right"></i>}
          aria-label="Breadcrumb"
          className="breadcrumbs"
        >
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>

          <div>Mon espace</div>
          <div>Mes favoris</div>
        </Breadcrumbs>

        <div id="notice_none" style={{ display: "none" }}></div>

        <h1 className="heading">
          <i className="fas fa-briefcase"></i> Mes favoris
        </h1>

        <Grid container direction="row" justify="center" spacing={0}>
          <Grid item xs={12} md={2}>
            {menu}
          </Grid>
          <Grid className="bg-white" item xs={12} md={10}>
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
            <Button
              onClick={this.handleDialogClose}
              className="button fontWeightMedium plain bg-secondaryMain"
            >
              Annuler
            </Button>
            <Button
              onClick={this.handleDialogConfirm}
              className="button fontWeightMedium plain bg-danger"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        <AlertMessage
          message={this.state.mess}
          openAlert={this.state.openAlert}
          handleClose={this.handleAlertClose}
        />

        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Haut de page" style={{ cursor: "hand" }} interactive>
            <Button
              id="btTop"
              onClick={this.topFunction}
              aria-label="Remonter en haut de la page"
              className="iconButton"
            >
              <i className="fas fa-level-up-alt"></i>
            </Button>
          </Tooltip>
        </Box>
      </div>
    );

    return defaultView;
  }
}
