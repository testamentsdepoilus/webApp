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

          <h1 className="heading"><i className="far fa-eye"></i> Explorer</h1>

          <div className="bg-white paddingContainer">
            <iframe
              id="data_vis"
              title="visualisation"
              src="http://patrimeph.ensea.fr/kibana7/app/kibana#/dashboard/d29467b0-60c0-11ea-94d4-37b328c5fa4f?embed=true&_g=()"
            ></iframe>
          </div>
      </div>
    );
  }
}

export default Explore;
