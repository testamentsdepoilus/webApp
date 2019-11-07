import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { Typography, List, ListItem, Grid } from "@material-ui/core";

import { createStyled } from "../../utils/functions";

const Styled = createStyled(theme => ({
  root: {
    width: "60%",
    margin: "auto"
  }
}));

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: ""
    };
  }

  componentDidMount() {
    const token = sessionStorage.usertoken;
    if (token) {
      const decoded = jwt_decode(token);
      this.setState({
        first_name: decoded.user_name,
        last_name: decoded.last_name,
        email: decoded.email
      });
    }
  }
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Grid container direction="column" justify="center">
              <Grid item>
                <Typography variant="h3"> PROFILE</Typography>
              </Grid>
              <Grid item>
                <List>
                  <ListItem>
                    Nom :{" "}
                    <Typography variant="h5">
                      {this.state.first_name}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    Prénom :
                    <Typography variant="h5">{this.state.last_name}</Typography>
                  </ListItem>
                  <ListItem>
                    Adresse mail :
                    <Typography variant="h5">{this.state.email}</Typography>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </div>
        )}
      </Styled>
    );
  }
}

export default Profile;
