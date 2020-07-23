import React, { Component } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@material-ui/core";
import { register, getParamConfig } from "../../utils/functions";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import Confirmation from "./Confirmation";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      user_name: "",
      email: "",
      password: "",
      passConfirme: "",
      showPassword: false,
      error: "",
      isError: [false, false, false, false],
      open: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleClose() {
    window.location.replace(getParamConfig("web_url") + "/login");
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.user_name && this.state.email) {
      if (!this.state.password) {
        this.setState({
          error: "Saisissez votre mot de passe !",
          isError: [false, false, true, true],
        });
      } else if (this.state.password !== this.state.passConfirme) {
        this.setState({
          error:
            "Les mots de passe saisis ne sont pas identiques, veuillez saisir le même mot de passe.",
          isError: [false, false, true, true],
        });
      } else {
        const user = {
          user_name: this.state.user_name,
          email: this.state.email,
          password: this.state.password,
        };
        register(user).then((res) => {
          if (res.status === 200) {
            this.setState({
              open: true,
            });
          } else {
            const err = res.err ? res.err : "Connexion au serveur a échoué !";
            this.setState({
              error: err,
            });
          }
        });
      }
    } else if (!this.state.user_name && !this.state.email) {
      this.setState({
        error: "Saisissez votre pseudo et votre adresse e-mail !",
        isError: [true, true, false, false],
      });
    } else if (!this.state.user_name) {
      this.setState({
        error: "Saisissez votre pseudo !",
        isError: [true, false, false, false],
      });
    } else {
      this.setState({
        error: "Saisissez votre adresse e-mail !",
        isError: [false, true, false, false],
      });
    }
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <div className="register cms">
          <form
            className="form"
            noValidate
            onSubmit={this.onSubmit}
            autoComplete="off"
          >
            <TextField
              id="standard-userName-input"
              variant="outlined"
              className="input"
              required
              fullWidth
              autoFocus
              label="Mon pseudo"
              name="user_name"
              onChange={this.onChange}
              value={this.state.user_name}
              error={this.state.isError[0]}
            />

            <TextField
              id="standard-email-input"
              variant="outlined"
              required
              fullWidth
              className="input"
              label="Adresse email"
              type="email"
              name="email"
              autoComplete="email"
              onChange={this.onChange}
              value={this.state.email}
              error={this.state.isError[1]}
            />

            <Box
              container
              alignItems="center"
              justify="space-evenly"
              spacing={1}
              display={{xs:"block", md: "inline-block"}}
            >
              <Grid item xs>
                <TextField
                  id="password"
                  variant="outlined"
                  className="input"
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
                  className="input"
                  required
                  fullWidth
                  label="Confirmation"
                  type={this.state.showPassword ? "text" : "password"}
                  name="passConfirme"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.passConfirme}
                  error={this.state.isError[3]}
                />
              </Grid>
              <Grid item xs={1}>
                <InputAdornment position="end">
                  <IconButton
                    className="togglePassword"
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
            </Box>

            <Box pt={1} display="flex" justifyContent="flex-end">
              <Button
                className="submit button fontWeightMedium plain bg-secondaryLight"
                type="submit"
              >
                S'inscrire
              </Button>
            </Box>
          </form>
          {this.state.error ? (
            <div className="text-error">{this.state.error}</div>
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
              <Confirmation email={this.state.email} />
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    );
  }
}

export default Register;
