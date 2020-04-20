import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  TextField,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { getParamConfig, updateMDP } from "../../utils/functions";

const jwt = require("jsonwebtoken");

class ResetMDP extends Component {
  constructor() {
    super();
    this.state = {
      email_encode: "",
      email: "",
      password: "",
      passConfirme: "",
      showPassword: false,
      isError: false,
      open: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  }

  handleClickShowPassword = (e) => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  onLogin(e) {
    window.document.location.replace(getParamConfig("web_url") + "/login");
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.state.password) {
      this.setState({
        error: "Saisissez votre mot de passe !",
        isError: true,
      });
    } else if (this.state.password !== this.state.passConfirme) {
      this.setState({
        error:
          "Les mots de passe saisies ne sont pas identiques, veuillez saisir le même mot de passe.",
        isError: true,
      });
    } else {
      const user = {
        email: this.state.email_encode,
        password: this.state.password,
      };

      updateMDP(user).then((res) => {
        if (res.status === 200) {
          this.setState({
            open: true,
          });
        } else {
          const err = res.error ? res.error : "Connexion au serveur a échoué !";
          this.setState({
            error: err,
          });
        }
      });
    }
  }
  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("reinitialiserMDP/");
    if (idx !== -1) {
      try {
        const email_encode = url.substring(idx + 17);
        const email_decode = jwt.verify(
          email_encode,
          process.env.REACT_APP_SECRET_KEY
        );

        this.setState({
          email_encode: email_encode,
          email: email_decode.email,
        });
      } catch (e) {
        console.log("initMDP e :", e);
        // window.location.replace(getParamConfig("web_url"));
      }
    } else {
      console.log("initMDP idx :", idx);
      // window.location.replace(getParamConfig("web_url"));
    }
  }

  render() {
    return (
      <div className="lostPassWord">
        <div className="menu">
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
              href={getParamConfig("web_url") + "/accueil"}
            >
              Accueil
            </Link>

            <typography>Réinitialisation du mot de passe</typography>
          </Breadcrumbs>
        </div>
        <div className="bg-white paddingContainer">
          <h1 className="heading">
            <i class="fas fa-unlock-alt"></i> Réinitialisation du mot de passe
          </h1>

          <p>
            Saisissez un nouveau mot de passe pour <b> {this.state.email}</b>
          </p>
          <p>
            Nous allons envoyer à cette adresse un lien vous permettant de
            réinitialiser facilement votre mot de passe.
          </p>
          <form className="form" noValidate onSubmit={this.onSubmit}>
            <Grid container direction="column" spacing={1}>
              <Grid>
                <TextField
                  id="password"
                  variant="outlined"
                  required
                  fullWidth
                  label="Nouveau mot de passe"
                  type={this.state.showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.password}
                  error={this.state.isError}
                  className="input"
                />
              </Grid>
              <Grid>
                <TextField
                  id="password-confirme"
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirmer le nouveau mot de passe "
                  type={this.state.showPassword ? "text" : "password"}
                  name="passConfirme"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.passConfirme}
                  error={this.state.isError}
                  className="input"
                />
              </Grid>
              <Grid>
                <Button
                  id="btValidate"
                  className="button submit fontWeightMedium plain bg-secondaryLight"
                  type="submit"
                >
                  Valider
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>

        <Dialog
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          className="dialog-resetMDP"
        >
          <DialogTitle className="customized-dialog-title">
            Mise à jour de votre mot de passe
          </DialogTitle>

          <DialogContent>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <p>Votre mot de passe a bien été mise à jour.</p>
              </Grid>
              <Grid item>
                <Button
                  id="btClose"
                  variant="contained"
                  color="primary"
                  onClick={this.onLogin}
                >
                  Fermer
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default ResetMDP;
