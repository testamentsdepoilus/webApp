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
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <a
                href="https://www.culture.gouv.fr"
                target="_blank"
                title="Site du Ministère de la Culture"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    getParamConfig("web_url") +
                    "/images/ministreCulture_logo.jpg"
                  }
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <a
                href="http://www.sciences-patrimoine.org/"
                target="_blank"
                title="Site de la Fondation des Sciences du Patrimoine"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/FDP_logo.png"}
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <img
                src={getParamConfig("web_url") + "/images/centenaire_logo.jpg"}
                alt="logo"
              />
            </Grid>
            <Grid item>
              <a
                href="http://www.archives-nationales.culture.gouv.fr"
                target="_blank"
                title="Site des archives nationales"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    getParamConfig("web_url") +
                    "/images/archives-nationales_logo.png"
                  }
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <a
                href="http://archives.valdoise.fr"
                target="_blank"
                title="Site des archives départementales du Val-d'Oise"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/valdoise_logo.png"}
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <a
                href="https://archives.yvelines.fr"
                target="_blank"
                title="Site des archives départementales des Yvelines"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/ad78_logo.jpg"}
                  alt="logo"
                />
              </a>
            </Grid>

            <Grid item>
              <a
                href="https://www.u-cergy.fr"
                target="_blank"
                title="Site de l'université de Cergy-Pontoise"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/cergy_logo.png"}
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <a
                href="http://www.chartes.psl.eu"
                target="_blank"
                title="Site de l'École nationale des chartes"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/enc_logo.png"}
                  alt="logo"
                />
              </a>
            </Grid>
            <Grid item>
              <a
                href="https://www.univ-paris8.fr"
                target="_blank"
                title="Site de l'université Paris 8"
                rel="noopener noreferrer"
              >
                <img
                  src={getParamConfig("web_url") + "/images/paris-8_logo.jpg"}
                  alt="logo"
                />
              </a>
            </Grid>
          </Grid>
        </div>
      </footer>
    );
  }
}

export default Footer;
