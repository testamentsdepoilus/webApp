import React, { Component } from "react";
import { createStyled } from "../utils/functions";
import Footer from "./Footer";

const Styled = createStyled(theme => ({
  root: {
    margin: theme.spacing(4),
    width: "90%",
    textAlign: "center"
  },
  explorer: {}
}));

class Contact extends Component {
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <div id="explorer">Contact ...</div>
            <Footer />
          </div>
        )}
      </Styled>
    );
  }
}

export default Contact;
