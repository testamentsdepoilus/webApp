import React, { Component } from "react";
import { createStyled } from "../utils/functions";
import { Paper, MenuList, MenuItem } from "@material-ui/core";

const Styled = createStyled(theme => ({
  root: {
    margin: theme.spacing(4, 2, 2, 2),
    position: "absolute"
  },
  menu: {
    marginRight: theme.spacing(2)
  }
}));

class Footer extends Component {
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <footer className={classes.root}>
            <div id="logo"></div>
            <div id="menu" className={classes.menu}>
              <Paper>
                <MenuList>
                  <MenuItem>Contact</MenuItem>
                  <MenuItem>Mentions légales</MenuItem>
                  <MenuItem>Crédits</MenuItem>
                </MenuList>
              </Paper>
            </div>
          </footer>
        )}
      </Styled>
    );
  }
}

export default Footer;
