import React, { Component } from "react";
import { createStyled, getParamConfig } from "../utils/functions";
import { Paper, MenuList, MenuItem } from "@material-ui/core";

const Styled = createStyled(theme => ({
  root: {
    margin: theme.spacing(4, 2, 2, 2),
    position: "absolute"
  },
  menu: {
    marginRight: theme.spacing(2)
  },
  link: {
    textDecoration: "none",
    fontSize: "1rem",
    paddingLeft: 15,
    color: "#212121",
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
                  <MenuItem>
                    {" "}
                    <a
                      href={getParamConfig("web_url") + "/contact"}
                      className={classes.link}
                    >
                      Contact
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href={getParamConfig("web_url") + "/apropos"}
                      className={classes.link}
                    >
                      Mentions légales
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href={
                        getParamConfig("web_url") +
                        "/apropos/MbCig24BcBbXesm0SnLM"
                      }
                      className={classes.link}
                    >
                      Crédits
                    </a>
                  </MenuItem>
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
