import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Link, Breadcrumbs } from "@material-ui/core";
import classNames from "classnames";

import {
  createStyled,
  getParamConfig,
  getUserToken
} from "../../utils/functions";

const Styled = createStyled(theme => ({
  menu: {
    display: "flex"
  },

  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "-apple-system",
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
  }
}));

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "profile",
      myData: null
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.tabLinks = ["profile", "panier", "cms"];
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id
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
      <Styled>
        {({ classes }) => (
          <Breadcrumbs aria-label="Breadcrumb">
            <Link
              id="profile"
              className={
                this.state.selectedId === "profile"
                  ? classNames(classes.link, classes.activedLink)
                  : classes.link
              }
              component={RouterLink}
              to="/espace/profile"
              onClick={this.handleListItemClick}
            >
              Mon profile
            </Link>

            <Link
              id="panier"
              className={
                this.state.selectedId === "panier"
                  ? classNames(classes.link, classes.activedLink)
                  : classes.link
              }
              component={RouterLink}
              to="/espace/panier"
              onClick={this.handleListItemClick}
            >
              Mom panier
            </Link>
            {this.state.myData.isRoot ? (
              <Link
                id="cms"
                className={
                  this.state.selectedId === "cms"
                    ? classNames(classes.link, classes.activedLink)
                    : classes.link
                }
                component={RouterLink}
                to="/espace/cms"
                onClick={this.handleListItemClick}
              >
                Gestion de contenu
              </Link>
            ) : null}
          </Breadcrumbs>
        )}
      </Styled>
    ) : null;
  }
}

export default withRouter(Menu);
