import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import {
  Link,
  Breadcrumbs,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Grid,
  Button,
  MenuList,
  MenuItem,
  Menu
} from "@material-ui/core";
import { getParamConfig, getUserToken } from "../utils/functions";
import CloseIcon from "@material-ui/icons/Close";
import LogRegister from "./admin/LogRegister";
import PersonIcon from "@material-ui/icons/Person";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "",
      open: false,
      anchorEl: null,
      anchorElExplor: null,
      open_mySpace: false,
      anchorEl_mySpace: null
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.tabLinks = [
      "search",
      "wills",
      "about",
      "testators",
      "places",
      "news",
      "articles",
      "units",
      "explore",
      "mySpace"
    ];
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleExplorClick = this.handleExplorClick.bind(this);
    this.handleExplorClose = this.handleExplorClose.bind(this);
    this.handleOpenMySpace = this.handleOpenMySpace.bind(this);
    this.usertoken = getUserToken();
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id
    });
  }

  handleLoginClick() {
    //this.props.history.push("/login");
    this.setState({
      open: true
    });
  }

  handleOpenMySpace(event) {
    this.setState({
      open_mySpace: true,
      anchorEl_mySpace: event.currentTarget
    });
  }

  handleLogoutClick() {
    localStorage.clear();
    document.location.reload();
  }

  handleClose() {
    this.setState({
      open: false,
      open_mySpace: false,
      anchorEl_mySpace: null
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
    /* const userLogin = (
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
    );*/

    return (
      <div className="nav_root">
        <Grid container direction="row" spacing={1}>
          <Grid item xs={10}>
            <Link id="home" component={RouterLink} to="/accueil">
              <img
                className="titre_site"
                src={
                  getParamConfig("web_url") +
                  "/images/Entete_titre-site-haut-300dpi.jpg"
                }
                alt="titre_site"
              />
            </Link>
          </Grid>
          <Grid item xs={2}>
            <div className="menu_secondary">
              <MenuList>
                <MenuItem>
                  {" "}
                  <Link
                    id="news"
                    className={
                      this.state.selectedId === "news" ? "activedLink" : "link"
                    }
                    component={RouterLink}
                    to="/news"
                    onClick={this.handleListItemClick}
                  >
                    {" "}
                    Les actualités{" "}
                  </Link>
                </MenuItem>
                <MenuItem>
                  {" "}
                  <Link
                    id="articles"
                    className={
                      this.state.selectedId === "articles"
                        ? "activedLink"
                        : "link"
                    }
                    component={RouterLink}
                    to="/articles"
                    onClick={this.handleListItemClick}
                  >
                    {" "}
                    L'état de la recherche{" "}
                  </Link>
                </MenuItem>
                <MenuItem>
                  {" "}
                  <Link
                    id="about"
                    className={
                      this.state.selectedId === "about" ? "activedLink" : "link"
                    }
                    component={RouterLink}
                    to="/apropos"
                    onClick={this.handleListItemClick}
                  >
                    {" "}
                    À propos{" "}
                  </Link>
                </MenuItem>
              </MenuList>
            </div>
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={1}>
          <Grid item xs={10}>
            <Breadcrumbs
              maxItems={10}
              itemsAfterCollapse={3}
              itemsBeforeCollapse={3}
              aria-label="Breadcrumb"
              className="menu"
            >
              <Link
                id="search"
                className={
                  this.state.selectedId === "search" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/recherche"
                onClick={this.handleListItemClick}
              >
                {" "}
                Recherche{" "}
              </Link>
              <Link
                id="explore"
                className={
                  this.state.selectedId === "explore" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/explore"
                onClick={this.handleListItemClick}
              >
                Explorer
              </Link>
              <Link
                id="wills"
                className={
                  this.state.selectedId === "wills" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/testaments"
                onClick={this.handleListItemClick}
              >
                Les testaments
              </Link>
              <Link
                id="testators"
                className={
                  this.state.selectedId === "testators" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/testateurs"
                onClick={this.handleListItemClick}
              >
                Les testateurs
              </Link>
              <Link
                id="places"
                className={
                  this.state.selectedId === "places" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/places"
                onClick={this.handleListItemClick}
              >
                Les lieux
              </Link>
              <Link
                id="units"
                className={
                  this.state.selectedId === "units" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/armees"
                onClick={this.handleListItemClick}
              >
                Les unités militaires
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={2}>
            <div className="logIn">
              <Button
                variant="contained"
                className={this.usertoken ? "userLogout" : "userLogin"}
                startIcon={<PersonIcon />}
                onClick={
                  this.usertoken
                    ? this.handleOpenMySpace
                    : this.handleLoginClick
                }
              >
                Mon espace
              </Button>

              <Menu
                id="simple-menu-explor"
                anchorEl={this.state.anchorEl_mySpace}
                keepMounted
                open={Boolean(this.state.open_mySpace)}
                onClose={this.handleClose}
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
              >
                <MenuItem onClick={this.handleClose}>
                  <Link
                    id="profile"
                    className={
                      this.state.selectedId === "profile"
                        ? "activedLink"
                        : "link"
                    }
                    component={RouterLink}
                    to="/espace/profile"
                  >
                    Mon profil
                  </Link>
                </MenuItem>
                <MenuItem onClick={this.handleClose}>
                  <Link
                    id="panier"
                    className={
                      this.state.selectedId === "panier"
                        ? "activedLink"
                        : "link"
                    }
                    component={RouterLink}
                    to="/espace/panier"
                  >
                    Mes favoris
                  </Link>
                </MenuItem>
                {this.usertoken && this.usertoken.isAdmin ? (
                  <div>
                    <Button
                      className={
                        this.state.selectedId === "administration"
                          ? "activedLink"
                          : "link"
                      }
                      onClick={this.handleExplorClick}
                    >
                      Administration
                    </Button>
                    <Menu
                      id="simple-menu-explor"
                      anchorEl={this.state.anchorElExplor}
                      keepMounted
                      open={Boolean(this.state.anchorElExplor)}
                      onClose={this.handleExplorClose}
                      elevation={0}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                      }}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: "right"
                      }}
                    >
                      <MenuItem onClick={this.handleExplorClose}>
                        <Link
                          id="cms"
                          className={
                            this.state.selectedId === "cms"
                              ? "activedLink"
                              : "link"
                          }
                          component={RouterLink}
                          to="/espace/cms"
                          onClick={this.handleListItemClick}
                        >
                          Gestion de contenu
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={this.handleExplorClose}>
                        <Link
                          id="config"
                          className={
                            this.state.selectedId === "config"
                              ? "activedLink"
                              : "link"
                          }
                          component={RouterLink}
                          to="/espace/config"
                          onClick={this.handleListItemClick}
                        >
                          Configuration
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                ) : null}
                <MenuItem onClick={this.handleLogoutClick}>
                  DECONNEXION
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>

        <Dialog
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={localStorage.usertoken ? false : this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <IconButton
              aria-label="close"
              className="closeButton"
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
    );
  }
}

export default withRouter(NavBar);
