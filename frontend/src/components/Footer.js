import React, { Component } from "react";
import { getParamConfig } from "../utils/functions";
import { Grid } from "@material-ui/core";

class Footer extends Component {
  render() {
    return (
      <footer className="root_footer">
        <div id="menu" className="menu_footer">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <a href={getParamConfig("web_url") + "/contact"} className="link">
                Contact
              </a>
            </Grid>
            <Grid item>
              <a href={getParamConfig("web_url") + "/apropos"} className="link">
                Mentions légales
              </a>
            </Grid>
            <Grid item>
              <a
                href={
                  getParamConfig("web_url") + "/apropos/MbCig24BcBbXesm0SnLM"
                }
                className="link"
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
    );
  }
}

export default Footer;
