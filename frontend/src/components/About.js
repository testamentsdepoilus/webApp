import React, { Component } from "react";
import { Paper, Breadcrumbs, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { createStyled, getParamConfig } from "../utils/functions";

const Styled = createStyled(theme => ({
  root: {
    justifyContent: "center",
    flexWrap: "wrap",
    margin: theme.spacing(1, 0, 0, 2)
  },
  paper: {}
}));

class About extends Component {
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Paper elevation={0} className={classes.paper}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="Breadcrumb"
              >
                <Link
                  color="inherit"
                  href={getParamConfig("web_url") + "/search"}
                >
                  {" "}
                  Recherche{" "}
                </Link>
                <Typography color="textPrimary">A propos</Typography>
              </Breadcrumbs>
            </Paper>
            <h1>A props</h1>
          </div>
        )}
      </Styled>
    );
  }
}

export default About;
