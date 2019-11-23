import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import DeleteIcon from "@material-ui/icons/Delete";

import VisibilityIcon from "@material-ui/icons/VisibilityOutlined";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";
import {
  createStyled,
  getParamConfig,
  updateMyListWills,
  getHitsFromQuery,
  getUserToken,
  downloadFile
} from "../../utils/functions";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Grid
} from "@material-ui/core";

import NewPost from "./NewPost";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditPost from "./EditPost";
import Menu from "./Menu";

function desc(a, b, orderBy) {
  if (b._source[orderBy] < a._source[orderBy]) {
    return -1;
  }
  if (b._source[orderBy] > a._source[orderBy]) {
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
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: "will_identifier.name",
    numeric: false,
    disablePadding: false,
    label: "Nom de testateur"
  }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const Styled1 = createStyled(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%",
    color: "#0d47a1",
    fontSize: 24,
    fontWeight: 600,
    fontFamily: "-apple-system",
    margin: theme.spacing(2, 0, 3)
  }
}));

const EnhancedTableToolbar = props => {
  const { numSelected, actionButton } = props;

  return (
    <Styled1>
      {({ classes }) => (
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0
          })}
        >
          {numSelected > 0 ? (
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
            >
              {numSelected} sélectionnés
            </Typography>
          ) : (
            <Typography className={classes.title} variant="h6" id="tableTitle">
              Mes testaments
            </Typography>
          )}

          {numSelected > 0 ? actionButton : null}
        </Toolbar>
      )}
    </Styled1>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  actionButton: PropTypes.element.isRequired
};
const AlertMessage = props => {
  const { openAlert, handleClose, message } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      key="topCenter"
      open={openAlert}
      onClose={handleClose}
      autoHideDuration={3000}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{message}</span>}
    ></Snackbar>
  );
};

AlertMessage.propTypes = {
  openAlert: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

const Styled2 = createStyled(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2)
  },
  paper: {
    width: "60%",
    margin: "auto",
    marginTop: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  backBt: {
    color: "#fff",
    backgroundColor: "#1976d2"
  },
  addBt: {
    color: "#0d47a1",
    fontSize: 35
  },
  typeSelect: {
    display: "flex",
    width: "10em",
    margin: theme.spacing(3, 0, 3)
  }
}));

export default class MyShoppingCart extends Component {
  constructor(props) {
    super();
    this.state = {
      order: "asc",
      orderBy: "title",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      data: [],
      choice: 2,
      open: false,
      openAlert: false,
      mess: "",
      editData: null
    };
    this.userToken = getUserToken();
  }

  handleRequestSort = (event, property) => {
    const isDesc =
      this.state.orderBy === property && this.state.order === "desc";
    this.setState({
      order: isDesc ? "asc" : "desc",
      orderBy: property
    });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = this.state.data.map(n => n["_id"]);
      this.setState({
        selected: newSelecteds
      });

      return;
    }
    this.setState({
      selected: []
    });
  };

  handleClick = (event, name) => {
    const selectedIndex = this.state.selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    } else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected.slice(0, selectedIndex),
        this.state.selected.slice(selectedIndex + 1)
      );
    }

    this.setState({
      selected: newSelected
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  handleAddNewPost = event => {
    this.setState({
      choice: 0
    });
  };

  handleBackToManager = event => {
    document.location.reload();
  };

  handleRemoveWill = event => {
    this.setState({
      open: true
    });
  };

  handleDialogClose = event => {
    this.setState({
      open: false
    });
  };

  handleDialogConfirm = event => {
    event.preventDefault();
    let myWills_ = localStorage.myWills
      .split(",")
      .filter(item => !this.state.selected.includes(item));

    const newItem = {
      email: this.userToken.email,
      myWills: myWills_
    };
    updateMyListWills(newItem).then(res => {
      if (res.status === 200) {
        this.setState({
          open: false,
          openAlert: true,
          mess: "Vos éléments sélectionnés ont été supprimés !"
        });
        localStorage.setItem("myWills", myWills_);
      } else {
        const err = res.err ? res.err : "Connexion au serveur a échoué !";
        this.setState({
          open: false,
          openAlert: true,
          mess: err
        });
      }
    });
  };

  handleAlertClose = event => {
    document.location.reload();
  };

  handleDisplayWill = id => {
    return function(e) {
      window.location.href = getParamConfig("web_url") + "/testament/" + id;
    };
  };

  handleCompareWill = event => {
    window.location.href =
      getParamConfig("web_url") + "/compare/" + this.state.selected.join("+");
  };

  handleExportWill = event => {
    const myWills_ = localStorage.myWills
      .split(",")
      .filter(item => this.state.selected.includes(item));

    myWills_.forEach(item =>
      downloadFile(
        getParamConfig("web_url") + "/files/" + item + ".xml",
        item + ".xml"
      )
    );
  };

  componentDidMount() {
    if (localStorage.myWills.length > 0) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          query: {
            ids: {
              values: localStorage.myWills.split(",")
            }
          }
        })
      )
        .then(data => {
          this.setState({
            data: data
          });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }
  render() {
    const isSelected = name => this.state.selected.indexOf(name) !== -1;
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        this.state.data.length - this.state.page * this.state.rowsPerPage
      );

    const backButton = (
      <Styled2>
        {({ classes }) => (
          <Tooltip title="Retour dans gestion de contenu">
            <Button
              variant="contained"
              onClick={this.handleBackToManager}
              startIcon={<ArrowBackIcon />}
              className={classes.backBt}
            >
              Gestion de contenu
            </Button>
          </Tooltip>
        )}
      </Styled2>
    );

    const actionButton = (
      <Grid container direction="row" justify="flex-end" alignItems="center">
        <Grid item>
          <Tooltip title="Suppression de stestaments">
            <IconButton onClick={this.handleRemoveWill} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Export des testament">
            <IconButton onClick={this.handleExportWill} aria-label="export">
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        {this.state.selected.length < 4 ? (
          <Grid item>
            <Tooltip title="Comparer des testaments">
              <IconButton onClick={this.handleCompareWill} aria-label="compare">
                <CompareIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        ) : null}
      </Grid>
    );

    const defaultView = (
      <Styled2>
        {({ classes }) => (
          <div className={classes.root}>
            <Menu />

            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={this.state.selected.length}
                actionButton={actionButton}
              />
              <div className={classes.tableWrapper}>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={"medium"}
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={this.state.selected.length}
                    order={this.state.order}
                    orderBy={this.state.orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={this.state.data.length}
                  />
                  <TableBody>
                    {stableSort(
                      this.state.data,
                      getSorting(this.state.order, this.state.orderBy)
                    )
                      .slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row["_id"]);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={event =>
                              this.handleClick(event, row["_id"])
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row["_id"]}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row._source["will_identifier.name"].replace(
                                "Testament de",
                                ""
                              )}
                            </TableCell>

                            <TableCell align="center">
                              <Tooltip title="Afficher le testatement">
                                <IconButton
                                  onClick={this.handleDisplayWill(row["_id"])}
                                  aria-label="display"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.data.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page"
                }}
                nextIconButtonProps={{
                  "aria-label": "next page"
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page :"
              />
            </Paper>
            <Dialog
              open={this.state.open}
              onClose={this.handleDialogClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                Confirmation
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Souhaitez-vous vraiment supprimer les{" "}
                  {this.state.selected.length} éléments sélectionnés ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={this.handleDialogClose}
                  color="primary"
                >
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
          </div>
        )}
      </Styled2>
    );

    switch (this.state.choice) {
      case 0:
        this.curView = (
          <NewPost backButton={backButton} alertMessage={AlertMessage} />
        );
        break;
      case 1:
        this.curView = (
          <EditPost
            backButton={backButton}
            alertMessage={AlertMessage}
            data={this.state.editData}
          />
        );
        break;
      case 2:
        this.curView = defaultView;
        break;
      default:
        this.curView = defaultView;
        break;
    }
    return this.curView;
  }
}
