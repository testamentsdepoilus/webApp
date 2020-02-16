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
import {
  login,
  getUserToken,
  getHitsFromQuery,
  getParamConfig
} from "../../utils/functions";

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
          console.log("myToken :", myToken.email);
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_user"),
            JSON.stringify({
              query: {
                match: {
                  email: {
                    query: myToken.email,
                    operator: "and"
                  }
                }
              }
            })
          )
            .then(data => {
              localStorage.setItem(
                "myBackups",
                JSON.stringify(data[0]._source["myBackups"])
              );
              document.location.reload(true);
            })
            .catch(error => {
              console.log("error :", error);
            });
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
      <Container maxWidth="xs">
        <div className="login">
          {this.state.error !== "" ? (
            <Typography className="errorText">
              Erreur : {this.state.error}
            </Typography>
          ) : (
            ""
          )}
          <form className="form" noValidate onSubmit={this.onSubmit}>
            <TextField
              id="email"
              variant="outlined"
              className="textField"
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
              className="textField"
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
              className="submit"
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
    );
  }
}

export default Login;
