import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { getParamConfig, getUserToken } from "../../utils/functions";
import Manage from "../cms/Manage";
import Profile from "./Profile";
import { Paper, MenuList, MenuItem, Link } from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import classNames from "classnames";
import MyShoppingCart from "../cms/MyShoppingCart";
import { Link as RouterLink } from "react-router-dom";
import Menu from "../cms/Menu";
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
  render() {
    return <Profile />;
  }
}

export default MySpace;
