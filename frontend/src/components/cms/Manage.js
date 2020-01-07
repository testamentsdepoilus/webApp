import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
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
  removePost,
  updatePost
} from "../../utils/functions";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Radio,
  TableContainer,
  MenuList,
  MenuItem,
  Grid,
  Fab
} from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import NewPost from "./NewPost";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditPost from "./EditPost";
import Menu from "./Menu";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import classNames from "classnames";

// Up to top page click
window.onscroll = function() {
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
      <TableRow className={classes.head}>
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
        <TableCell></TableCell>
        <TableCell></TableCell>
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
  },
  addBt: {
    color: "#0d47a1",
    fontSize: 35
  }
}));

const EnhancedTableToolbar = props => {
  const { numSelected, handleAddNewPost, deleteButton, title } = props;

  return (
    <Styled1>
      {({ classes }) => (
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0
          })}
          id={title}
        >
          {numSelected === 0 ? (
            <Tooltip id={title} title="Ajouter un nouveau post">
              <IconButton
                onClick={handleAddNewPost}
                value={title}
                aria-label="add"
              >
                <PostAddIcon className={classes.addBt} />
              </IconButton>
            </Tooltip>
          ) : null}
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
              {title}
            </Typography>
          )}

          {numSelected > 0 ? deleteButton : null}
        </Toolbar>
      )}
    </Styled1>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleAddNewPost: PropTypes.func.isRequired,
  deleteButton: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired
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
    flexWrap: "wrap",
    width: "90%",
    margin: theme.spacing(1, 0, 0, 2)
  },
  menu: {
    marginTop: theme.spacing(4),
    display: "block",
    verticalAlign: "middle"
  },
  link: {
    fontSize: 14,
    textAlign: "justify",
    textDecoration: "none"
  },
  paper: {
    width: "100%",
    height: 450,
    margin: "auto",
    marginTop: theme.spacing(3)
  },
  table: {},
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
  head: {
    backgroundColor: "#e3f2fd"
  },
  backBt: {
    color: "#fff",
    backgroundColor: "#1976d2"
  },
  typeSelect: {
    display: "flex",
    width: "10em",
    margin: theme.spacing(3, 0, 3)
  },
  margin: {
    margin: theme.spacing(12)
  },
  bootstrapRoot: {
    display: "none",
    position: "fixed",
    bottom: 10,
    right: 10,
    boxShadow: "none",
    fontSize: 16,
    border: "1px solid",

    "&:hover": {
      backgroundColor: "#bcaaa4",
      borderColor: "#bcaaa4"
    }
  }
}));

export default class Manage extends Component {
                 constructor(props) {
                   super();
                   this.state = {
                     order: {
                       articles: "asc",
                       news: "asc",
                       about: "asc"
                     },
                     orderBy: "title",
                     selected: { articles: [], news: [], about: [] },
                     choice: 2,
                     open: false,
                     openAlert: false,
                     mess: "",
                     editData: null,
                     selectedItem: { articles: null, news: null, about: null },
                     news: [],
                     articles: [],
                     about: [],
                     type: null
                   };
                 }

                 handleRequestSort = title => {
                   return function(event, property) {
                     const isDesc =
                       this.state.orderBy === property &&
                       this.state.order[title] === "desc";
                     let order_ = this.state.order;
                     order_[title] = isDesc ? "asc" : "desc";
                     this.setState({
                       order: order_,
                       orderBy: property
                     });
                   }.bind(this);
                 };

                 handleSelectAllClick = (data, title) => {
                   return function(event) {
                     let selected_ = this.state.selected;
                     if (event.target.checked) {
                       selected_[title] = data.map(n => n["_id"]);

                       this.setState({
                         selected: selected_
                       });

                       return;
                     } else {
                       selected_[title] = [];

                       this.setState({
                         selected: selected_
                       });
                     }
                   }.bind(this);
                 };

                 handleClick = (event, name, title) => {
                   const selectedIndex = this.state.selected[title].indexOf(
                     name
                   );
                   let newSelected = [];

                   if (selectedIndex === -1) {
                     newSelected = newSelected.concat(
                       this.state.selected[title],
                       name
                     );
                   } else if (selectedIndex === 0) {
                     newSelected = newSelected.concat(
                       this.state.selected[title].slice(1)
                     );
                   } else if (
                     selectedIndex ===
                     this.state.selected[title].length - 1
                   ) {
                     newSelected = newSelected.concat(
                       this.state.selected[title].slice(0, -1)
                     );
                   } else if (selectedIndex > 0) {
                     newSelected = newSelected.concat(
                       this.state.selected[title].slice(0, selectedIndex),
                       this.state.selected[title].slice(selectedIndex + 1)
                     );
                   }
                   let selected_ = this.state.selected;
                   selected_[title] = newSelected;
                   const type_ = { articles: 1, news: 2, about: 3 };
                   this.setState({
                     selected: selected_,
                     type: type_[title]
                   });
                 };

                 handleChangePage = (event, newPage) => {
                   this.setState({
                     page: newPage
                   });
                 };

                 handleAddNewPost = event => {
                   const type_ = { articles: 1, news: 2, about: 3 };
                   this.setState({
                     choice: 0,
                     type: type_[event.currentTarget.value]
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
                   const type_ = ["articles", "news", "about"];
                   removePost(
                     this.state.selected[type_[this.state.type - 1]]
                   ).then(res => {
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

                 handleSelectItem = title => {
                   return function(event) {
                     if (Boolean(this.state.selectedItem[title])) {
                       const item = {
                         id: this.state.selectedItem[title],
                         selected: false
                       };
                       updatePost(item).then(res => {
                         if (res.status === 200) {
                           console.log("Mise à jour avec succees");
                         } else {
                           console.log("Echec ");
                         }
                       });
                     }
                     const item = {
                       id: event.target.value,
                       selected: true
                     };
                     updatePost(item).then(res => {
                       if (res.status === 200) {
                         console.log("Mise à jour avec succees");
                       } else {
                         console.log("Echec ");
                       }
                     });

                     let selectedItem_ = this.state.selectedItem;
                     selectedItem_[title] = event.target.value;
                     this.setState({
                       selectedItem: selectedItem_
                     });
                   }.bind(this);
                 };

                 setDefaultView(data, title, deleteButton) {
                   const isSelected = name =>
                     this.state.selected[title].indexOf(name) !== -1;

                   return (
                     <Styled2>
                       {({ classes }) => (
                         <div>
                           <TableContainer
                             component={Paper}
                             className={classes.paper}
                           >
                             <EnhancedTableToolbar
                               numSelected={this.state.selected[title].length}
                               handleAddNewPost={this.handleAddNewPost}
                               deleteButton={deleteButton}
                               title={title}
                             />

                             <Table
                               className={classes.table}
                               aria-labelledby="tableTitle"
                               size={"medium"}
                               aria-label="enhanced table"
                             >
                               <EnhancedTableHead
                                 classes={classes}
                                 numSelected={this.state.selected[title].length}
                                 order={this.state.order[title]}
                                 orderBy={this.state.orderBy}
                                 onSelectAllClick={this.handleSelectAllClick(
                                   data,
                                   title
                                 )}
                                 onRequestSort={this.handleRequestSort(title)}
                                 rowCount={data.length}
                               />
                               <TableBody>
                                 {stableSort(
                                   data,
                                   getSorting(
                                     this.state.order[title],
                                     this.state.orderBy
                                   )
                                 ).map((row, index) => {
                                   const isItemSelected = isSelected(
                                     row["_id"]
                                   );
                                   const labelId = `enhanced-table-checkbox-${index}`;

                                   return (
                                     <TableRow
                                       hover
                                       aria-checked={isItemSelected}
                                       tabIndex={-1}
                                       key={row["_id"]}
                                       selected={isItemSelected}
                                     >
                                       <TableCell
                                         onClick={event =>
                                           this.handleClick(
                                             event,
                                             row["_id"],
                                             title
                                           )
                                         }
                                         role="checkbox"
                                         padding="checkbox"
                                       >
                                         <Checkbox
                                           checked={isItemSelected}
                                           inputProps={{
                                             "aria-labelledby": labelId
                                           }}
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
                                             onClick={this.handleUpdatePost(
                                               row
                                             )}
                                             aria-label="update"
                                           >
                                             <EditIcon />
                                           </IconButton>
                                         </Tooltip>
                                       </TableCell>
                                       <TableCell align="center">
                                         <Tooltip title="Sélectionner l'élément à ajouter à la page d'accueil">
                                           <Radio
                                             checked={
                                               this.state.selectedItem[
                                                 title
                                               ] === row._id
                                             }
                                             onChange={this.handleSelectItem(
                                               title
                                             )}
                                             value={row._id}
                                           />
                                         </Tooltip>
                                       </TableCell>
                                     </TableRow>
                                   );
                                 })}
                               </TableBody>
                             </Table>
                           </TableContainer>
                         </div>
                       )}
                     </Styled2>
                   );
                 }

                 componentDidMount() {
                   getHits(
                     getParamConfig("es_host") +
                       "/" +
                       getParamConfig("es_index_cms")
                   ).then(data => {
                     data.forEach(item => {
                       switch (parseInt(item._source["type"], 10)) {
                         case 1:
                           this.state.articles.push(item);
                           break;
                         case 2:
                           this.state.news.push(item);
                           break;
                         case 3:
                           this.state.about.push(item);
                           break;
                         default:
                           break;
                       }
                     });
                     let idx = this.state.articles.findIndex(
                       item => item._source["selected"] === true
                     );
                     let selectedItem_ = this.state.selectedItem;
                     if (idx > -1) {
                       selectedItem_["articles"] = this.state.articles[idx]._id;
                     }
                     idx = this.state.news.findIndex(
                       item => item._source["selected"] === true
                     );
                     if (idx > -1) {
                       selectedItem_["news"] = this.state.news[idx]._id;
                     }
                     idx = this.state.about.findIndex(
                       item => item._source["selected"] === true
                     );
                     if (idx > -1) {
                       selectedItem_["about"] = this.state.about[idx]._id;
                     }
                     this.setState({
                       articles: this.state.articles,
                       news: this.state.news,
                       about: this.state.about,
                       selectedItem: selectedItem_
                     });
                   });
                 }

                 topFunction = function() {
                   document.body.scrollTop = 0;
                   document.documentElement.scrollTop = 0;
                 };
                 render() {
                   const type_ = ["articles", "news", "about"];
                   const menu = (
                     <Styled2>
                       {({ classes }) => (
                         <Paper className={classes.menu}>
                           <MenuList>
                             <MenuItem key={1}>
                               <a href="#articles_div" className={classes.link}>
                                 Articles
                               </a>
                             </MenuItem>
                             <MenuItem key={2}>
                               {" "}
                               <a href="#news_div" className={classes.link}>
                                 News
                               </a>
                             </MenuItem>
                             <MenuItem key={3}>
                               <a href="#about_div" className={classes.link}>
                                 A propos
                               </a>
                             </MenuItem>
                           </MenuList>
                         </Paper>
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
                       <IconButton
                         onClick={this.handleRemovePost}
                         aria-label="delete"
                       >
                         <DeleteIcon />
                       </IconButton>
                     </Tooltip>
                   );

                   switch (this.state.choice) {
                     case 0:
                       this.curView = (
                         <NewPost
                           backButton={backButton}
                           type={this.state.type}
                           alertMessage={AlertMessage}
                         />
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
                       this.curView = (
                         <Styled2>
                           {({ classes }) => (
                             <div className={classes.root}>
                               <Menu />
                               <Grid
                                 container
                                 direction="row"
                                 justify="center"
                                 spacing={2}
                               >
                                 <Grid item xs={4}>
                                   {menu}
                                 </Grid>
                                 <Grid item xs={8}>
                                   <section id="articles_div">
                                     {this.setDefaultView(
                                       this.state.articles,
                                       "articles",
                                       deleteButton
                                     )}
                                   </section>
                                   <section id="news_div">
                                     {" "}
                                     {this.setDefaultView(
                                       this.state.news,
                                       "news",
                                       deleteButton
                                     )}
                                   </section>
                                   <section id="about_div">
                                     {" "}
                                     {this.setDefaultView(
                                       this.state.about,
                                       "about",
                                       deleteButton
                                     )}
                                   </section>
                                 </Grid>
                               </Grid>
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
                                     {Boolean(
                                       this.state.selected[
                                         type_[this.state.type - 1]
                                       ]
                                     )
                                       ? this.state.selected[
                                           type_[this.state.type - 1]
                                         ].length
                                       : 0}{" "}
                                     éléments sélectionnés
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
                                   <Button
                                     onClick={this.handleDialogConfirm}
                                     color="primary"
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
                               <Tooltip
                                 title="Au top"
                                 style={{ cursor: "hand" }}
                                 interactive
                               >
                                 <Fab
                                   id="btTop"
                                   onClick={this.topFunction}
                                   aria-label="Top"
                                   className={classNames(
                                     classes.margin,
                                     classes.bootstrapRoot
                                   )}
                                   size="medium"
                                 >
                                   <ArrowUpIcon />
                                 </Fab>
                               </Tooltip>
                             </div>
                           )}
                         </Styled2>
                       );

                       break;
                     default:
                       break;
                   }
                   return this.curView;
                 }
               }
