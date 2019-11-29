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

import EditIcon from "@material-ui/icons/Edit";

import {
  createStyled,
  getHits,
  getParamConfig,
  removePost
} from "../../utils/functions";
import {
  NativeSelect,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
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
  { id: "title", numeric: false, disablePadding: false, label: "Titre" },
  {
    id: "author",
    numeric: false,
    disablePadding: false,
    label: "Auteur"
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
  const { numSelected, selectComponent, addButton, deleteButton } = props;

  return (
    <Styled1>
      {({ classes }) => (
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0
          })}
        >
          {numSelected === 0 ? addButton : null}
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
              Gestion de contenu
            </Typography>
          )}

          {numSelected > 0 ? deleteButton : selectComponent}
        </Toolbar>
      )}
    </Styled1>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectComponent: PropTypes.element.isRequired,
  addButton: PropTypes.element.isRequired,
  deleteButton: PropTypes.element.isRequired
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

export default class Manage extends Component {
  constructor(props) {
    super();
    this.state = {
      order: "asc",
      orderBy: "title",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      data: [],
      selectData: [],
      type: 1,
      choice: 2,
      open: false,
      openAlert: false,
      mess: "",
      editData: null
    };
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
      const newSelecteds = this.state.selectData.map(n => n["_id"]);
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

  handleTypeChange = event => {
    const newSelectData = this.state.data.filter(
      item =>
        parseInt(item._source["type"], 10) === parseInt(event.target.value, 10)
    );

    this.setState({
      type: event.target.value,
      selectData: newSelectData
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

  handleRemovePost = event => {
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
    removePost(this.state.selected).then(res => {
      if (res.status === 200) {
        this.setState({
          open: false,
          openAlert: true,
          mess: res.mess
        });
      } else {
        this.setState({
          open: false,
          openAlert: true,
          mess: res.err
        });
      }
    });
  };

  handleAlertClose = event => {
    document.location.reload();
  };

  handleUpdatePost = data => {
    return function(e) {
      this.setState({
        choice: 1,
        editData: data
      });
    }.bind(this);
  };

  componentDidMount() {
    getHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    ).then(data => {
      const newSelectData = data.filter(
        item => item._source["type"] === this.state.type
      );
      this.setState({
        data: data,
        selectData: newSelectData
      });
    });
  }
  render() {
    const isSelected = name => this.state.selected.indexOf(name) !== -1;
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        this.state.selectData.length - this.state.page * this.state.rowsPerPage
      );
    const selectComponent = (
      <Styled2>
        {({ classes }) => (
          <NativeSelect
            id="type"
            className={classes.typeSelect}
            variant="outlined"
            value={this.state.type}
            name="type"
            onChange={this.handleTypeChange}
          >
            <option value={1}>Article</option>
            <option value={2}>Actualité</option>
            <option value={3}>A propos</option>
          </NativeSelect>
        )}
      </Styled2>
    );
    const addButton = (
      <Styled2>
        {({ classes }) => (
          <Tooltip title="Ajouter un nouveau post">
            <IconButton onClick={this.handleAddNewPost} aria-label="add">
              <PostAddIcon className={classes.addBt} />
            </IconButton>
          </Tooltip>
        )}
      </Styled2>
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

    const deleteButton = (
      <Tooltip title="Suppression de contenu">
        <IconButton onClick={this.handleRemovePost} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );

    const defaultView = (
      <Styled2>
        {({ classes }) => (
          <div className={classes.root}>
            <Menu />
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={this.state.selected.length}
                selectComponent={selectComponent}
                addButton={addButton}
                deleteButton={deleteButton}
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
                    rowCount={this.state.selectData.length}
                  />
                  <TableBody>
                    {stableSort(
                      this.state.selectData,
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
                              {row._source["title"]}
                            </TableCell>
                            <TableCell align="left">
                              {row._source["author"]}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Mise à jour du contenu">
                                <IconButton
                                  onClick={this.handleUpdatePost(row)}
                                  aria-label="update"
                                >
                                  <EditIcon />
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
                count={this.state.selectData.length}
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
