import React, { Component } from "react";
import {
  TextField,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import { getParamConfig, updateMDP } from "../../utils/functions";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

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
      open: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: ""
    });
  }

  handleClickShowPassword = e => {
    this.setState({
      showPassword: !this.state.showPassword
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
        isError: true
      });
    } else if (this.state.password !== this.state.passConfirme) {
      this.setState({
        error:
          "Les mots de passe saisies ne sont pas identiques, veuillez saisir le même mot de passe.",
        isError: true
      });
    } else {
      const user = {
        email: this.state.email_encode,
        password: this.state.password
      };

      updateMDP(user).then(res => {
        if (res.status === 200) {
          this.setState({
            open: true
          });
        } else {
          const err = res.error ? res.error : "Connexion au serveur a échoué !";
          this.setState({
            error: err
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
          email: email_decode.email
        });
      } catch (e) {
        window.location.replace(getParamConfig("web_url"));
      }
    } else {
      window.location.replace(getParamConfig("web_url"));
    }
  }

  render() {
    return (
      <div className="resetMDP">
        <div className="menu">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="Breadcrumb"
          >
            <Link
              id="home"
              key={0}
              color="inherit"
              href={getParamConfig("web_url") + "/accueil"}
            >
              Accueil
            </Link>

            <Typography color="textPrimary">
              Réinitialisation du mot de passe
            </Typography>
          </Breadcrumbs>
        </div>
        <Grid container direction="row" justify="space-evenly" spacing={2}>
          <Grid item>
            <p>
              Saisissez un nouveau mot de passe pour <b> {this.state.email}</b>
            </p>
            <p>
              Nous allons envoyer à cette adresse un lien vous permettant de
              réinitialiser facilement votre mot de passe.
            </p>
          </Grid>
          <Grid item>
            <form className="form" noValidate onSubmit={this.onSubmit}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
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
                  />
                </Grid>
                <Grid item>
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
                  />
                </Grid>
                <Grid item>
                  <Button
                    id="btValidate"
                    variant="contained"
                    color="primary"
                    className="submit"
                    type="submit"
                  >
                    Valider
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
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
