import React, { Component } from "react";
import {
  TextField,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Typography
} from "@material-ui/core";
import { getParamConfig } from "../../utils/functions";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { resetPassWord } from "../../utils/functions";

class LostPassWord extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      mailError: false,
      error: "",
      confirmed: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      mailError: false
    });
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.state.email) {
      const user = {
        email: this.state.email
      };
      resetPassWord(user).then(res => {
        if (res.status === 200) {
          this.setState({
            confirmed: true
          });
        } else {
          const err = res.error ? res.error : "Connexion au serveur a échoué !";
          this.setState({
            error: err
          });
        }
      });
    } else if (!this.state.email) {
      this.setState({
        error: "Saisissez l'adresse e-mail !",
        mailError: true,
        passError: false
      });
    }
  }
  render() {
    return (
      <div className="lostPassWord">
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

            <Typography color="textPrimary">Mot de passe oublié</Typography>
          </Breadcrumbs>
        </div>
        {this.state.confirmed ? (
          <div className="section_confirmation">
            <p>
              Un courriel de confirmation vous a été envoyé à{" "}
              <span style={{ fontWeight: 600 }}>{this.state.email}</span>
            </p>
            <p>
              Vous y trouverez un lien cliquable pour réinitialiser votre mot de
              passe.
            </p>
          </div>
        ) : (
          <div>
            <div className="section_contenu">
              <p>Saisissez l'adresse mail associée à votre compte.</p>
              <p>
                Nous allons envoyer à cette adresse un lien vous permettant de
                réinitialiser facilement votre mot de passe.
              </p>
            </div>
            <div className="section_form">
              {this.state.error !== "" ? (
                <p className="errorText">Erreur : {this.state.error}</p>
              ) : (
                ""
              )}
              <form className="form" noValidate onSubmit={this.onSubmit}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <TextField
                      id="email"
                      variant="outlined"
                      className="textField"
                      required
                      label="Adresse email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={this.state.email}
                      onChange={this.onChange}
                      error={this.state.mailError}
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
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LostPassWord;
