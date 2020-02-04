import React, { Component } from "react";
import { createStyled, getParamConfig } from "../utils/functions";
import { Grid } from "@material-ui/core";

const Styled = createStyled(theme => ({
  root: {
    position: "absolute",
    textAlign: "center",
    display: "inline-block",
    verticalAlign: "top",
    width: "90%",
    marginTop: theme.spacing(2)
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
            <div id="menu" className={classes.menu}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <a
                    href={getParamConfig("web_url") + "/contact"}
                    className={classes.link}
                  >
                    Contact
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href={getParamConfig("web_url") + "/apropos"}
                    className={classes.link}
                  >
                    Mentions légales
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href={
                      getParamConfig("web_url") +
                      "/apropos/MbCig24BcBbXesm0SnLM"
                    }
                    className={classes.link}
                  >
                    Crédits
                  </a>
                </Grid>
              </Grid>
            </div>
            <div id="logo">
              <img
                src={
                  getParamConfig("web_url") +
                  "/images/Entete_Bande-logo-bas-150dpi.jpg"
                }
                alt="logo"
              />
            </div>
          </footer>
        )}
      </Styled>
    );
  }
}

export default Footer;
