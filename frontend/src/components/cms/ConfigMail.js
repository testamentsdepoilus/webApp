import React, { Component } from "react";
import {
  TextField,
  Typography,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import { getUserToken, updateConfigMail } from "../../utils/functions";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import Menu from "./Menu";

class ConfigMail extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      passConfirme: "",
      showPassword: false,
      error: "",
      isError: [false, false, false],
      open: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleClose() {
    this.setState({
      open: false
    });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.email) {
      if (!this.state.password) {
        this.setState({
          error: "Saisissez votre mot de passe !",
          isError: [false, true, true]
        });
      } else if (this.state.password !== this.state.passConfirme) {
        this.setState({
          error: "Les mots de passe saisies ne sont pas identiques",
          isError: [false, true, true]
        });
      } else {
        const myToken = getUserToken();
        const auth = {
          email_root: myToken.email,
          email: this.state.email,
          password: this.state.password
        };
        updateConfigMail(auth).then(res => {
          if (res.status === 200) {
            this.setState({
              open: true
            });
          } else {
            const err = res.err ? res.err : "Connexion au serveur a échoué !";
            this.setState({
              error: err
            });
          }
        });
      }
    } else if (!this.state.email) {
      this.setState({
        error: "Saisissez votre adresse e-mail !",
        isError: [true, false, false]
      });
    }
  }

  render() {
    return (
      <div className="configMail">
        <Menu />
        <div className="paper">
          <Typography className="header" id="postTitle">
            Configurer le serveur d'envoie du mail aux utilisateurs
          </Typography>
          <form
            className="form"
            noValidate
            onSubmit={this.onSubmit}
            autoComplete="off"
          >
            <TextField
              id="standard-email-input"
              variant="outlined"
              required
              fullWidth
              className="textField"
              label="Adresse email"
              type="email"
              name="email"
              autoComplete="email"
              onChange={this.onChange}
              value={this.state.email}
              error={this.state.isError[1]}
            />

            <Grid
              container
              alignItems="center"
              justify="space-evenly"
              spacing={1}
            >
              <Grid item xs>
                <TextField
                  id="password"
                  variant="outlined"
                  required
                  fullWidth
                  label="Mot de passe"
                  type={this.state.showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.password}
                  error={this.state.isError[2]}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  id="password-confirme"
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirmation"
                  type={this.state.showPassword ? "text" : "password"}
                  name="passConfirme"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.passConfirme}
                  error={this.state.isError[3]}
                />{" "}
              </Grid>
              <Grid item xs={1}>
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              className="submit"
              type="submit"
            >
              Mettre à jour
            </Button>
          </form>
          {this.state.error ? (
            <Typography className="errorText">{this.state.error}</Typography>
          ) : (
            ""
          )}
          <Dialog
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
          >
            <DialogTitle id="customized-dialog-title">
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <h5> Votre configuration a été bien mis à jour !</h5>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default ConfigMail;
