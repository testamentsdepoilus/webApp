import React, { Component } from "react";
import { Typography, List, ListItem, Grid } from "@material-ui/core";

import {
  createStyled,
  getUserToken,
  getParamConfig
} from "../../utils/functions";
import Menu from "../cms/Menu";

const Styled = createStyled(theme => ({
  root: {
    width: "100%"
  },
  profile: {
    width: "60%",
    margin: "auto",
    marginTop: theme.spacing(2)
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
    const myToken = getUserToken();
    if (myToken) {
      this.setState({
        first_name: myToken.user_name,
        last_name: myToken.last_name,
        email: myToken.email
      });
    } else {
      window.location.replace(getParamConfig("web_url") + "/login");
    }
  }
  render() {
    return (
      <Styled>
        {({ classes }) => (
          <div className={classes.root}>
            <Menu />
            <div className={classes.profile}>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <Typography variant="h4"> Mon profil :</Typography>
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
                      Prénom :{" "}
                      <Typography variant="h5">
                        {this.state.last_name}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      Adresse mail :{" "}
                      <Typography variant="h5">{this.state.email}</Typography>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Styled>
    );
  }
}

export default Profile;
