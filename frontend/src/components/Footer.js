import React, { Component } from "react";
import { getParamConfig } from "../utils/functions";
import { Grid, Box } from "@material-ui/core";

class Footer extends Component {
  render() {
    return (
      <footer>
        <Grid className="footerContainer" container direction="row">
          <Grid item xs={12} lg={3} className="footer_menu">
            <Box
              display={{ xs: "block", md: "flex" }}
              id="footer_menu"
              alignItems="center"
              justifyContent="center"
              spacing={0}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                ml={2}
                mr={2}
              >
                <address>
                  <a href="mailto:testaments-de-poilus@gmail.com">Contact</a>
                </address>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href={getParamConfig("web_url") + "/mentionslegales"}>
                  Mentions légales
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a
                  href={
                    getParamConfig("web_url") + "/apropos/MbCig24BcBbXesm0SnLM"
                  }
                >
                  Crédits
                </a>
              </Box>
              <Box
                display={{ xs: "flex", md: "none" }}
                mt={1}
                mb={2}
                ml={2}
                mr={2}
                align-items="center"
                justifyContent="center"
              >
                <a href={getParamConfig("web_url") + "/news"}>Les Actualités</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href={getParamConfig("web_url") + "/articles"}>
                  L'État de la recherche
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href={getParamConfig("web_url") + "/apropos"}>À propos</a>
              </Box>
            </Box>
          </Grid>

          <Grid className="footerLogos" item xs={12} lg={9}>
            <Box
              mt={1}
              display={{ xs: "block", sm: "flex" }}
              alignItems="center"
              justifyContent="space-between"
              spacing={0}
              align="center"
            >
              <Box alignItems="center" p={1}>
                <a
                  href="https://www.culture.gouv.fr/"
                  title="Site du Ministère de la Culture"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Logo du Ministère de la culture et de la communication"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/ministere-culture.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="http://www.sciences-patrimoine.org/"
                  title="Site de la Fondation des Sciences du Patrimoine"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Logo de la Fondation des Sciences du patrimoine"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/fondation-sciences-patrimoine.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="https://centenaire.org/fr"
                  title="Site de la Mission du centenaire 14-18"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Logo de la Mission du Centenaire 14-18"
                    src={
                      getParamConfig("web_url") + "/images/logos/centenaire.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="http://www.archives-nationales.culture.gouv.fr/"
                  title="Site des Archives nationales"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Logo des Archives nationales"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/archives-nationales.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="http://archives.valdoise.fr/"
                  title="Site des archives départementales du Val-d'Oise"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="logo du Val-d'Oise le département - Archives nationales"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/val-d-oise-archives-departementales.png"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="https://www.archives.yvelines.fr/"
                  title="Site des archives départementales des Yvelines"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="logo des Archives départementales des Yvelines"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/yvelines-ad.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="https://www.u-cergy.fr/"
                  title="Site del'Université de Cergy-Pontoise"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="logo de l'Université de Cergy-Pontoise"
                    src={
                      getParamConfig("web_url") + "/images/logos/univ-cergy.jpg"
                    }
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="http://www.chartes.psl.eu"
                  title="Site de l'École nationale des chartes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="logo de l'École nationale des chartes"
                    src={getParamConfig("web_url") + "/images/logos/enc.jpg"}
                  />
                </a>
              </Box>

              <Box alignItems="center" p={1}>
                <a
                  href="https://www.univ-paris8.fr/"
                  title="Site de l'université Paris 8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="logo de l'Université Paris 8 | Vincennes - Saint-Denis"
                    src={
                      getParamConfig("web_url") +
                      "/images/logos/univ-paris8.png"
                    }
                  />
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
