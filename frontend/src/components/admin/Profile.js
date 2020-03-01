import React, { Component } from "react";
import {
  Typography,
  List,
  ListItem,
  Grid,
  Breadcrumbs,
  Link
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { getUserToken, getParamConfig } from "../../utils/functions";
import Footer from "../Footer";

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
        <Breadcrumbs className="menuCMS" aria-label="Breadcrumb">
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>

          <Link
            id="espace"
            key={1}
            color="inherit"
            component={RouterLink}
            to="/espace"
          >
            Mon espace
          </Link>
          <Link
            id="profile"
            key={1}
            color="inherit"
            component={RouterLink}
            to="/espace/profile"
          >
            Mon profil
          </Link>
        </Breadcrumbs>
        <div className="profile">
          <Grid container direction="column" justify="center">
            <Grid item>
              <Typography variant="h4"> Mon profil :</Typography>
            </Grid>
            <Grid item>
              <List>
                <ListItem>
                  Nom :{" "}
                  <Typography variant="h5">{this.state.first_name}</Typography>
                </ListItem>
                <ListItem>
                  Prénom :{" "}
                  <Typography variant="h5">{this.state.last_name}</Typography>
                </ListItem>
                <ListItem>
                  Adresse mail :{" "}
                  <Typography variant="h5">{this.state.email}</Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Profile;
