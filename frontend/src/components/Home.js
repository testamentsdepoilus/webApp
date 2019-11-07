import React, { Component } from "react";
import { Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

function createStyled(styles, options) {
  function Styled(props) {
    const { children, ...other } = props;
    return children(other);
  }
  Styled.propTypes = {
    children: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };
  return withStyles(styles, options)(Styled);
}

const Styled = createStyled(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#616161"
  },
  text: {
    fontSize: 24,
    color: "#616161"
  }
}));

class Home extends Component {
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Paper>
              <Typography className={classes.text}>Home page ...</Typography>
            </Paper>
          </div>
        )}
      </Styled>
    );
  }
}

export default Home;
