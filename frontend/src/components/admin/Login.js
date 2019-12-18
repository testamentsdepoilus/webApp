import React, { Component } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Link,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { createStyled, login, getUserToken } from "../../utils/functions";

const Styled = createStyled(theme => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  textField: {
    margin: theme.spacing(1, 0, 1)
  },
  errorText: {
    color: "#ab003c",
    fontSize: 14,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  }
}));

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      showPassword: false,
      mailError: false,
      passError: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      mailError: false,
      passError: false
    });
  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  onSubmit(e) {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      const user = {
        email: this.state.email,
        password: this.state.password
      };
      login(user).then(res => {
        if (res.status === 200) {
          localStorage.setItem("usertoken", res.res);
          const myToken = getUserToken();
          localStorage.setItem("myWills", myToken.myWills);
          localStorage.setItem("myTestators", myToken.myTestators);
          localStorage.setItem("myPlaces", myToken.myPlaces);
          localStorage.setItem("myUnits", myToken.myUnits);
          document.location.reload(true);
        } else {
          const err = res.error ? res.error : "Connexion au serveur a échoué !";

          this.setState({
            error: err
          });
        }
      });
    } else if (!this.state.email && !this.state.password) {
      this.setState({
        error: "Saisissez l'adresse e-mail et le mot de passe !",
        mailError: true,
        passError: true
      });
    } else if (!this.state.email) {
      this.setState({
        error: "Saisissez l'adresse e-mail !",
        mailError: true,
        passError: false
      });
    } else {
      this.setState({
        error: "Saisissez  le mot de passe !",
        mailError: false,
        passError: true
      });
    }
  }

  render() {
    return (
      <Styled>
        {({ classes }) => (
          <Container maxWidth="xs">
            <div className={classes.paper}>
              {this.state.error !== "" ? (
                <Typography className={classes.errorText}>
                  Erreur : {this.state.error}
                </Typography>
              ) : (
                ""
              )}
              <form
                className={classes.form}
                noValidate
                onSubmit={this.onSubmit}
              >
                <TextField
                  id="email"
                  variant="outlined"
                  className={classes.textField}
                  required
                  fullWidth
                  label="Adresse email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                  onChange={this.onChange}
                  error={this.state.mailError}
                />
                <TextField
                  id="password"
                  variant="outlined"
                  className={classes.textField}
                  required
                  fullWidth
                  label="Mots de passe"
                  type={this.state.showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={this.state.passError}
                  InputProps={{
                    endAdornment: (
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
                    )
                  }}
                />
                <Button
                  id="btLogin"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  type="submit"
                >
                  Se connecter
                </Button>

                <Link href="#" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </form>
            </div>
          </Container>
        )}
      </Styled>
    );
  }
}

export default Login;
