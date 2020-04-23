import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";

import {
  Link,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Grid,
  Box,
  MenuList,
  MenuItem,
  Menu,
  Button,
} from "@material-ui/core";

import { getParamConfig, getUserToken } from "../utils/functions";
import LogRegister from "./admin/LogRegister";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "",
      open: false,
      anchorEl: null,
      anchorElExplor: null,
      open_mySpace: false,
      anchorEl_mySpace: null,
      isMainNavVisible: false,
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.tabLinks = [
      "search",
      "wills",
      "apropos",
      "testators",
      "places",
      "news",
      "articles",
      "units",
      "explore",
      "mySpace",
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
      selectedId: event.target.id,
    });
  }

  handleLoginClick() {
    //this.props.history.push("/login");
    this.setState({
      open: true,
    });
  }

  handleOpenMySpace(event) {
    this.setState({
      open_mySpace: true,
      anchorEl_mySpace: event.currentTarget,
    });
  }

  handleLogoutClick() {
    localStorage.clear();
    document.location.href = getParamConfig("web_url");
  }

  handleClose() {
    this.setState({
      open: false,
      open_mySpace: false,
      anchorEl_mySpace: null,
    });
  }

  handleExplorClick(event) {
    this.setState({
      anchorElExplor: event.currentTarget,
    });
  }

  handleExplorClose() {
    this.setState({
      anchorElExplor: null,
    });
  }

  componentDidMount() {
    const findLink = this.tabLinks.find((link) =>
      document.location.href.includes(link)
    );
    this.setState({
      selectedId: findLink,
    });
  }

  toggleMainNav = () => {
    this.setState((prevState) => ({
      isMainNavVisible: !prevState.isMainNavVisible,
    }));
  };

  render() {
    const { isMainNavVisible } = this.state;

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
      <header>
        <Grid className="headerContainer" container direction="row" spacing={0}>
          <Grid
            item
            position="relative"
            className="bg-white"
            component={Box}
            lg={2}
            display={{ xs: "none", lg: "block", xl: "block" }}
          >
            <Link
              id="home"
              display="block"
              component={RouterLink}
              to="/accueil"
            >
              <img
                src={
                  getParamConfig("web_url") +
                  "/images/testaments-poilus-header.jpg"
                }
                alt="Testaments de Poilus, édition numérique"
                width="205"
                height="107"
              />
            </Link>
            <Box
              bgcolor="error.main"
              position="absolute"
              top={0}
              right={8}
              fontWeight="fontWeightMedium"
              pl={0.8}
              pr={0.8}
              pt={0.2}
              pb={0.2}
              id="19141918"
            >
              1914-1918
            </Box>
          </Grid>

          <Grid item component={Box} className="bg-white" p={0} xs={12} lg={10}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Box
                  display={{ xs: "block", md: "flex" }}
                  alignItems="center"
                  pt={0.82}
                >
                  <Box className="site-title" fontWeight="fontWeightBold">
                    <Link id="home" component={RouterLink} to="/accueil">
                      Testaments{" "}
                      <span className="small" fontWeight="fontWeightMedium">
                        de
                      </span>{" "}
                      Poilus
                    </Link>
                  </Box>
                  <Box
                    className="site-subtitle"
                    display={{ xs: "block", sm: "inline-flex" }}
                  >
                    <Link id="home" component={RouterLink} to="/accueil">
                      Édition numérique
                    </Link>
                  </Box>
                </Box>
              </Box>
              <Box display={{ xs: "none", md: "block" }}>
                <div id="menu_secondary">
                  <ul>
                    <li>
                      {" "}
                      <Link
                        id="news"
                        className={
                          this.state.selectedId === "news" ? "active" : ""
                        }
                        href={getParamConfig("web_url") + "/news"}
                        onClick={this.handleListItemClick}
                      >
                        {" "}
                        Les actualités{" "}
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link
                        id="articles"
                        className={
                          this.state.selectedId === "articles" ? "active" : ""
                        }
                        href={getParamConfig("web_url") + "/articles"}
                        onClick={this.handleListItemClick}
                      >
                        {" "}
                        L'état de la recherche{" "}
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link
                        id="about"
                        className={
                          this.state.selectedId === "apropos" ? "active" : ""
                        }
                        href={getParamConfig("web_url") + "/apropos"}
                        onClick={this.handleListItemClick}
                      >
                        {" "}
                        À propos{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </Box>

              <Grid
                item
                className="collapse_mainNav"
                position="relative"
                component={Box}
                xs={2}
                display={{ xs: "block", md: "none" }}
              >
                <IconButton
                  edge="start"
                  onClick={this.toggleMainNav}
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Box>

            <Grid container direction="row" spacing={0}>
              <Grid item xs={12}>
                <MenuList
                  id="main_nav"
                  className={isMainNavVisible ? "" : "d-none"}
                >
                  <MenuItem>
                    <Link
                      component={RouterLink}
                      to="/recherche"
                      onClick={this.handleListItemClick}
                      id="search"
                      className={
                        this.state.selectedId === "search" ? "active" : ""
                      }
                    >
                      {" "}
                      <i className="fas fa-search"></i> Rechercher{" "}
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      id="wills"
                      component={RouterLink}
                      to="/testaments"
                      onClick={this.handleListItemClick}
                      className={
                        this.state.selectedId === "wills" ? "active" : ""
                      }
                    >
                      Les testaments
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      id="testators"
                      component={RouterLink}
                      to="/testateurs"
                      onClick={this.handleListItemClick}
                      className={
                        this.state.selectedId === "testators" ? "active" : ""
                      }
                    >
                      Les testateurs
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      id="places"
                      component={RouterLink}
                      to="/places"
                      onClick={this.handleListItemClick}
                      className={
                        this.state.selectedId === "places" ? "active" : ""
                      }
                    >
                      Les lieux
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      id="units"
                      component={RouterLink}
                      to="/armees"
                      onClick={this.handleListItemClick}
                      className={
                        this.state.selectedId === "units" ? "active" : ""
                      }
                    >
                      Les unités militaires
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      id="explore"
                      component={RouterLink}
                      to="/explore"
                      onClick={this.handleListItemClick}
                      className={
                        this.state.selectedId === "explore" ? "active" : ""
                      }
                    >
                      <i className="far fa-eye"></i> Explorer
                    </Link>
                  </MenuItem>

                  <MenuItem className="monEspace">
                    <Link
                      id="userSpace"
                      className={this.usertoken ? "userLogout" : "userLogin"}
                      onClick={
                        this.usertoken
                          ? this.handleOpenMySpace
                          : this.handleOpenMySpace
                          // : this.handleLoginClick
                      }
                    >
                      <i className="fas fa-sm fa-user"></i> Mon espace
                    </Link>

                    <Menu
                      id="userSpace_submenu"
                      anchorEl={this.state.anchorEl_mySpace}
                      keepMounted
                      open={Boolean(this.state.open_mySpace)}
                      onClose={this.handleClose}
                      elevation={0}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem onClick={this.handleClose}>
                        <Link
                          id="profile"
                          className={
                            this.state.selectedId === "profile" ? "active" : ""
                          }
                          component={RouterLink}
                          to="/espace/profile"
                        >
                          <i className="fas fa-cogs"></i> Mon profil
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={this.handleClose}>
                        <Link
                          id="panier"
                          className={
                            this.state.selectedId === "panier" ? "active" : ""
                          }
                          component={RouterLink}
                          to="/espace/panier"
                        >
                          <i className="fas fa-briefcase"></i> Mes favoris
                        </Link>
                      </MenuItem>
                      
                      {this.usertoken && this.usertoken.isAdmin ? (
                      <MenuItem>
                            <Link
                              className={
                                this.state.selectedId === "administration"
                                  ? "active"
                                  : ""
                              }
                              onClick={this.handleExplorClick}
                            >
                             <i class="far fa-edit"></i> Administration
                            </Link>
                            <Menu
                              id="admin_submenu"
                              anchorEl={this.state.anchorElExplor}
                              keepMounted
                              open={Boolean(this.state.anchorElExplor)}
                              onClose={this.handleExplorClose}
                              elevation={0}
                              getContentAnchorEl={null}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "center",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem onClick={this.handleExplorClose}>
                                <Link
                                  id="cms"
                                  className={
                                    this.state.selectedId === "cms"
                                      ? "active"
                                      : ""
                                  }
                                  component={RouterLink}
                                  to="/espace/cms"
                                  onClick={this.handleListItemClick}
                                >
                                  Gestion de contenus
                                </Link>
                              </MenuItem>
                              <MenuItem onClick={this.handleExplorClose}>
                                <Link
                                  id="config"
                                  className={
                                    this.state.selectedId === "config"
                                      ? "active"
                                      : ""
                                  }
                                  component={RouterLink}
                                  to="/espace/config"
                                  onClick={this.handleListItemClick}
                                >
                                  Configuration
                                </Link>
                              </MenuItem>
                            </Menu>
                      </MenuItem>
                      ) : null}

                      <MenuItem onClick={this.handleLogoutClick}>
                        <span className="logout">
                          <i className="fas fa-sign-out-alt"></i> Déconnexion
                        </span>
                      </MenuItem>
                    </Menu>
                  </MenuItem>
                </MenuList>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Dialog
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={localStorage.usertoken ? false : this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <Button
              aria-label="close"
              className="closeButton"
              onClick={this.handleClose}
            >
              <i className="fas fa-times"></i>
            </Button>
          </DialogTitle>

          <DialogContent>
            <LogRegister />
          </DialogContent>
        </Dialog>
      </header>
    );
  }
}

export default withRouter(NavBar);
