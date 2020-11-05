import React, { Component } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";

import { Link as RouterLink } from "react-router-dom";

class Explore extends Component {
  render() {
    return (
      <div className="explore">
        <Breadcrumbs
          separator={<i className="fas fa-caret-right"></i>}
          aria-label="Breadcrumb"
          className="breadcrumbs"
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
          <div>Explorer</div>
        </Breadcrumbs>

        <h1 className="heading">
          <i className="far fa-eye"></i> Explorer
        </h1>

        <div className="bg-white paddingContainer">
          <iframe
            src="https://edition-testaments-de-poilus.huma-num.fr/kibana7/app/kibana#/dashboard/a899a790-1d30-11eb-9438-2500570ff9d9?embed=true&_g=()"
            id="data_vis"
            title="visualisation"
          ></iframe>
        </div>
      </div>
    );
  }
}

export default Explore;
