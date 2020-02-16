import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import {
  Link,
  Breadcrumbs,
  Button,
  Menu as MenuUi,
  MenuItem
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getParamConfig, getUserToken } from "../../utils/functions";

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "profile",
      myData: null,
      anchorElExplor: null
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.handleExplorClick = this.handleExplorClick.bind(this);
    this.handleExplorClose = this.handleExplorClose.bind(this);
    this.tabLinks = ["profile", "panier", "cms"];
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id
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
    const myToken = getUserToken();
    if (myToken) {
      this.setState({
        myData: myToken,
        selectedId: findLink
      });
    } else {
      window.location.replace(getParamConfig("web_url") + "/login");
    }
  }

  render() {
    return this.state.myData ? (
      <Breadcrumbs className="menuCMS" aria-label="Breadcrumb">
        <Link
          id="profile"
          className={
            this.state.selectedId === "profile" ? "activedLink" : "link"
          }
          component={RouterLink}
          to="/espace/profile"
          onClick={this.handleListItemClick}
        >
          Mon profil
        </Link>

        <Link
          id="panier"
          className={
            this.state.selectedId === "panier" ? "activedLink" : "link"
          }
          component={RouterLink}
          to="/espace/panier"
          onClick={this.handleListItemClick}
        >
          Mes favoris
        </Link>
        {this.state.myData.isAdmin ? (
          <div>
            <Button className="link" onClick={this.handleExplorClick}>
              Administration
              <ExpandMoreIcon className="icon" />
            </Button>
            <MenuUi
              id="simple-menu-explor"
              anchorEl={this.state.anchorElExplor}
              keepMounted
              open={Boolean(this.state.anchorElExplor)}
              onClose={this.handleExplorClose}
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
              <MenuItem onClick={this.handleExplorClose}>
                <Link
                  id="cms"
                  className={
                    this.state.selectedId === "cms" ? "activedLink" : "link"
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
                    this.state.selectedId === "config" ? "activedLink" : "link"
                  }
                  component={RouterLink}
                  to="/espace/config"
                  onClick={this.handleListItemClick}
                >
                  Configuration
                </Link>
              </MenuItem>
            </MenuUi>
          </div>
        ) : null}
      </Breadcrumbs>
    ) : null;
  }
}

export default withRouter(Menu);
