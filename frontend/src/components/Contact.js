import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  getParamConfig
} from "../utils/functions";
import {
  Breadcrumbs,
  Link,
  TextField,
  TextareaAutosize,
  Button
} from "@material-ui/core";

class Contact extends Component {
  render() {
    return (
      <div className="contact">

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
                <div>Contact</div>
          </Breadcrumbs>
          <div className="bg-white paddingContainer">
          <h1 className="heading"><i className="far fa-envelope"></i> Contact</h1>
          <form
            className="form"
            autoComplete="off"
          >
            <TextField
              id="standard-email-input"
              required
              fullWidth
              variant="outlined"
              color="secondary"
              className="input"
              label="Votre email"
              type="email"
              name="email"
              autoComplete="email"
            />
            <label>Votre message</label>
            <TextareaAutosize
              id="message"
              required
              fullWidth
              variant="outlined"
              color="secondary"
              className="input w-100"
              label="Votre message"
              type="TextArea"
              name="message"
              rowsMin="8"
            />
            <Button
              className="submit button plain bg-secondaryLight"
              type="submit"
            >
              Envoyer
            </Button>
          </form>
          </div>
        </div>
    );
  }
}

export default Contact;
