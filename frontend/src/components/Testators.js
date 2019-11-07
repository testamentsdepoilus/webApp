import React, { Component } from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { createStyled, getParamConfig } from "../utils/functions";
import { Breadcrumbs, Paper, Link, Typography } from "@material-ui/core";

const Styled = createStyled(theme => ({
  root: {
    justifyContent: "center",
    flexWrap: "wrap",
    margin: theme.spacing(1, 0, 0, 2)
  },
  paper: {
    padding: theme.spacing(1, 2)
  }
}));

class Testators extends Component {
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
                <Typography color="textPrimary">Les testateurs</Typography>
              </Breadcrumbs>
            </Paper>
            <h1>En cours ...</h1>
          </div>
        )}
      </Styled>
    );
  }
}

export default Testators;
