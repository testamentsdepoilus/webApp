import React, { Component } from "react";

import {
  List,
  ListItem,
  Grid,
  Breadcrumbs,
  Link
} from "@material-ui/core";
import { getUserToken, getParamConfig } from "../../utils/functions";

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
      <div>
          <Breadcrumbs
                separator={<i className="fas fa-caret-right"></i>}
                aria-label="Breadcrumb"
                className="breadcrumbs"
              >
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>

          <div>
            Mon espace
          </div>
          <div>Mon profil</div>
        </Breadcrumbs>

        <h1 className="heading"><i className="fas fa-user"></i> Mon profil</h1>

        <div className="profile bg-white paddingContainer">
          <Grid container direction="column" justify="center">
            <Grid item>
              <List>
                <ListItem>
                   <div className="fontWeightMedium">Nom :&nbsp;{" "} </div>
                  <div>{this.state.first_name}</div>
                </ListItem>
                <ListItem>
                  <div className="fontWeightMedium">Prénom :&nbsp;{" "} </div>
                  <div>{this.state.last_name}</div>
                </ListItem>
                <ListItem>
                  <div className="fontWeightMedium">Adresse mail :&nbsp;{" "}</div>
                  <div>{this.state.email}</div>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Profile;
