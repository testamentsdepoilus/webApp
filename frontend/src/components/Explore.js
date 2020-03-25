import React, { Component } from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Footer from "./Footer";
import { Paper, Breadcrumbs, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

class Explore extends Component {
  render() {
    return (
      <div className="explore">
        <div className="menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="home"
                key={0}
                color="inherit"
                component={RouterLink}
                to="/accueil"
              >
                Accueil
              </Link>
              <Typography color="textPrimary">Explore</Typography>
            </Breadcrumbs>
          </Paper>
        </div>
        <div className="data_vis">
          <iframe
            className="data_vis"
            id="data_vis"
            title="visualisation"
            src="http://patrimeph.ensea.fr/kibana7/app/kibana#/dashboard/d29467b0-60c0-11ea-94d4-37b328c5fa4f?embed=true&_g=()"
          ></iframe>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Explore;
