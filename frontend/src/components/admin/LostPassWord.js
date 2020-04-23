import React, { Component } from "react";

import { TextField, Button, Grid, Breadcrumbs, Link } from "@material-ui/core";
import { getParamConfig } from "../../utils/functions";
import { resetPassWord } from "../../utils/functions";

class LostPassWord extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      mailError: false,
      error: "",
      confirmed: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      mailError: false,
    });
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.state.email) {
      const user = {
        email: this.state.email,
      };
      resetPassWord(user).then((res) => {
        if (res.status === 200) {
          this.setState({
            confirmed: true,
          });
        } else {
          const err = res.error ? res.error : "Connexion au serveur a échoué !";
          this.setState({
            error: err,
          });
        }
      });
    } else if (!this.state.email) {
      this.setState({
        error: "Saisissez l'adresse e-mail !",
        mailError: true,
        passError: false,
      });
    }
  }
  render() {
    return (
      <div className="lostPassWord">
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

          <div>Mot de passe oublié</div>
        </Breadcrumbs>

        {this.state.confirmed ? (
          <div className="section_confirmation bg-white paddingContainer">
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
          <div className="bg-white paddingContainer">
            <div className="section_contenu">
              <h1 className="heading">
                <i className="fas fa-unlock-alt"></i> Mot de passe oublié
              </h1>
              <p>Saisissez l'adresse mail associée à votre compte.</p>
              <p>
                Nous allons envoyer à cette adresse un lien vous permettant de
                réinitialiser facilement votre mot de passe.
              </p>
            </div>
            <div className="section_form">
              {this.state.error !== "" ? (
                <p className="text-error">Erreur : {this.state.error}</p>
              ) : (
                ""
              )}
              <form className="form" noValidate onSubmit={this.onSubmit}>
                <Grid container direction="column" spacing={1}>
                  <Grid>
                    <TextField
                      id="email"
                      variant="outlined"
                      className="input w-100"
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
          </div>
        )}
      </div>
    );
  }
}

export default LostPassWord;
