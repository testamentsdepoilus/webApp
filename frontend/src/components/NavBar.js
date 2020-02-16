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
  Button
} from "@material-ui/core";
import { getParamConfig } from "../utils/functions";
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
    localStorage.clear();
    document.location.reload();
  }
  handleClose() {
    this.setState({
      open: false
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
              <Link
                id="articles"
                className={
                  this.state.selectedId === "articles" ? "activedLink" : "link"
                }
                component={RouterLink}
                to="/articles"
                onClick={this.handleListItemClick}
              >
                {" "}
                L'état de la recherche{" "}
              </Link>
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
                A propos{" "}
              </Link>
              {localStorage.usertoken ? (
                <Link
                  id="mySpace"
                  className={
                    this.state.selectedId === "mySpace" ? "activedLink" : "link"
                  }
                  component={RouterLink}
                  to="/espace"
                  onClick={this.handleListItemClick}
                >
                  {" "}
                  Mon espace{" "}
                </Link>
              ) : null}
            </Breadcrumbs>
          </Grid>
          <Grid item xs={2}>
            <div className="logIn">
              <Button
                variant="contained"
                className={localStorage.usertoken ? "userLogout" : "userLogin"}
                startIcon={<PersonIcon />}
                onClick={
                  localStorage.usertoken
                    ? this.handleLogoutClick
                    : this.handleLoginClick
                }
              >
                {localStorage.usertoken ? "Deconnexion" : "Connexion"}
              </Button>
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
