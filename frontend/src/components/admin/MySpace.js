import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { getParamConfig } from "../../utils/functions";
import Manage from "../cms/Manage";
import Profile from "./Profile";
import { Paper, MenuList, MenuItem } from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import classNames from "classnames";

const Styled = createStyled(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2)
  },
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

class MySpace extends Component {
  constructor() {
    super();
    this.state = {
      myData: null,
      selectedId: "profile",
      choice: 0
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    this.setState({
      selectedId: event.target.id,
      choice: parseInt(event.target.value, 10)
    });
  }

  componentDidMount() {
    const token = sessionStorage.usertoken;
    if (token) {
      const decoded = jwt_decode(token);
      this.setState({
        myData: decoded
      });
    } else {
      window.location.replace(getParamConfig("web_url") + "/login");
    }
  }
  render() {
    switch (this.state.choice) {
      case 0:
        this.curView = <Profile />;
        break;
      case 1:
        this.curView = null;
        break;
      case 2:
        this.curView = <Manage />;
        break;
      default:
        this.curView = <Profile />;
        break;
    }

    const view = (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Paper className={classes.menu}>
              <MenuList>
                <MenuItem
                  id="profile"
                  className={
                    this.state.selectedId === "profile"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  value={0}
                  onClick={this.handleListItemClick}
                >
                  Mon profile
                </MenuItem>
                <MenuItem
                  id="panier"
                  className={
                    this.state.selectedId === "panier"
                      ? classNames(classes.link, classes.activedLink)
                      : classes.link
                  }
                  value={1}
                  onClick={this.handleListItemClick}
                >
                  Mom panier
                </MenuItem>
                {this.state.myData.isRoot ? (
                  <MenuItem
                    id="cms"
                    className={
                      this.state.selectedId === "cms"
                        ? classNames(classes.link, classes.activedLink)
                        : classes.link
                    }
                    value={2}
                    onClick={this.handleListItemClick}
                  >
                    Gestion de contenu
                  </MenuItem>
                ) : null}
              </MenuList>
            </Paper>
            <Paper className={classes.view}>{this.curView}</Paper>
          </div>
        )}
      </Styled>
    );

    return this.state.myData ? view : null;
  }
}

export default MySpace;
