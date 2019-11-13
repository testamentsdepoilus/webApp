import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import {
  AppBar,
  Link,
  Breadcrumbs,
  Typography,
  Fab,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import { createStyled, getUserToken } from "../utils/functions";
import classNames from "classnames";
import AccountIcon from "@material-ui/icons/AccountCircleOutlined";
import CloseIcon from "@material-ui/icons/Close";
import LogRegister from "./admin/LogRegister";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import jwt_decode from "jwt-decode";

const Styled = createStyled(theme => ({
  nav_root: {
    height: 130,
    marginTop: 10,
    background: "#eceff1",
    color: "white",
    position: "static",
    flexGrow: 1
  },
  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
    fontSize: 18,
    fontWeight: 500,
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
    ].join(","),
    "&:hover, &:focus": {
      color: "#0091EA",
      fontWeight: 600,
      backgroundColor: "#eceff1"
    },
    "&:active": {
      color: "#0091EA",
      fontWeight: 600
    }
  },
  activedLink: {
    color: "#0091EA",
    fontWeight: 600
  },
  menu: {
    paddingLeft: "10%",
    paddingTop: 45
  },
  typography: {
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    fontSize: 28,
    fontWeight: 500,
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
  logIn: {
    margin: theme.spacing(1),
    position: "absolute",
    right: "5%",
    marginTop: 50
  },
  logTitle: {
    color: "#1769aa",
    fontSize: 16,
    fontWeight: 600,
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "search",
      open: false,
      anchorEl: null,
      anchorElExplor: null
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.tabLinks = [
      "search",
      "wills",
      "about",
      "testators",
      "places",
      "news",
      "units"
    ];
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleExplorClick = this.handleExplorClick.bind(this);
    this.handleExplorClose = this.handleExplorClose.bind(this);
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id
    });
  }

  handleLoginClick(event) {
    //this.props.history.push("/login");
    this.setState({
      open: true
    });
  }

  handleLogoutClick(event) {
    sessionStorage.removeItem("usertoken");
    document.location.reload();
  }
  handleClose() {
    this.setState({
      open: false
    });
  }

  handleMenuClick(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleMenuClose() {
    this.setState({
      anchorEl: null
    });
  }

  handleExplorClick(event) {
    this.setState({
      anchorElExplor: event.currentTarget
    });
  }

  handleExplorClose() {
    this.setState({
      anchorElExplor: null
    });
  }

  componentDidMount() {
    const findLink = this.tabLinks.find(link =>
      document.location.href.includes(link)
    );

    this.setState({
      selectedId: findLink
    });
  }

  render() {
    const userLogin = (
      <Styled>
        {({ classes }) => (
          <div>
            <Fab
              id="btLogin"
              color="primary"
              aria-label="Login"
              onClick={this.handleLoginClick}
            >
              <AccountIcon />
            </Fab>
            <Typography className={classes.logTitle}>CONNEXION</Typography>
          </div>
        )}
      </Styled>
    );
    const userLogout = (
      <Styled>
        {({ classes }) => (
          <div>
            <Fab
              id="btLogout"
              color="secondary"
              aria-label="Logout"
              onClick={this.handleLogoutClick}
            >
              <AccountIcon />
            </Fab>
            <Typography className={classes.logTitle}>DECONNEXION</Typography>
          </div>
        )}
      </Styled>
    );

    return (
      <Styled>
        {({ classes }) => (
          <div>
            <AppBar className={classNames(classes.nav_root)}>
              <div className="logo">
                <Typography className={classes.typography}>
                  Testaments de Poilus
                </Typography>
              </div>
              <Breadcrumbs aria-label="Breadcrumb" className={classes.menu}>
                <Link
                  id="search"
                  className={
                    this.state.selectedId === "search"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  component={RouterLink}
                  to="/search"
                >
                  {" "}
                  Recherche{" "}
                </Link>
                <div>
                  <Button
                    className={classNames(classes.link)}
                    onClick={this.handleExplorClick}
                  >
                    Explorer
                    <ExpandMoreIcon className={classNames(classes.icon)} />
                  </Button>
                  <Menu
                    id="simple-menu-explor"
                    anchorEl={this.state.anchorElExplor}
                    keepMounted
                    open={Boolean(this.state.anchorElExplor)}
                    onClose={this.handleExplorClose}
                  >
                    <MenuItem onClick={this.handleExplorClose}>
                      {" "}
                      <Link
                        id="wills"
                        className={
                          this.state.selectedId === "wills"
                            ? classNames(classes.link, classes.activedLink)
                            : classes.link
                        }
                        component={RouterLink}
                        to="/wills"
                        onClick={this.handleListItemClick}
                      >
                        Les testaments
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleExplorClose}>
                      <Link
                        id="testators"
                        className={
                          this.state.selectedId === "testators"
                            ? classNames(classes.link, classes.activedLink)
                            : classes.link
                        }
                        component={RouterLink}
                        to="/testators"
                        onClick={this.handleListItemClick}
                      >
                        Les testateurs
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleExplorClose}>
                      <Link
                        id="places"
                        className={
                          this.state.selectedId === "places"
                            ? classNames(classes.link, classes.activedLink)
                            : classes.link
                        }
                        component={RouterLink}
                        to="/places"
                        onClick={this.handleListItemClick}
                      >
                        Les lieux
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleExplorClose}>
                      <Link
                        id="units"
                        className={
                          this.state.selectedId === "units"
                            ? classNames(classes.link, classes.activedLink)
                            : classes.link
                        }
                        component={RouterLink}
                        to="/units"
                        onClick={this.handleListItemClick}
                      >
                        Les unités militaires
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>

                <Link
                  id="news"
                  className={
                    this.state.selectedId === "news"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  component={RouterLink}
                  to="/news"
                >
                  {" "}
                  Les actualités{" "}
                </Link>
                <Link
                  id="articles"
                  className={
                    this.state.selectedId === "articles"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  component={RouterLink}
                  to="/articles"
                >
                  {" "}
                  L'état de l'art{" "}
                </Link>
                <Link
                  id="about"
                  className={
                    this.state.selectedId === "about"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  component={RouterLink}
                  to="/about"
                >
                  {" "}
                  A propos{" "}
                </Link>
                {sessionStorage.usertoken ? (
                  <Link
                    id="mySpace"
                    className={
                      this.state.selectedId === "mySpace"
                        ? classNames(classes.link, classes.activedLink)
                        : classes.link
                    }
                    component={RouterLink}
                    to="/espace"
                  >
                    {" "}
                    Mon espace{" "}
                  </Link>
                ) : null}
              </Breadcrumbs>
              <div className={classes.logIn}>
                {sessionStorage.usertoken ? userLogout : userLogin}
              </div>
            </AppBar>
            <Dialog
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={sessionStorage.usertoken ? false : this.state.open}
              onClose={this.handleClose}
            >
              <DialogTitle
                id="customized-dialog-title"
                onClose={this.handleClose}
              >
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={this.handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                <LogRegister />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Styled>
    );
  }
}

export default withRouter(NavBar);
