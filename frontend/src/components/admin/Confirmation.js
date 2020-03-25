import React, { Component } from "react";

class Confirmation extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    /* const token = localStorage.usertoken;
    if (token) {
      //const decoded = jwt_decode(token);
      if (token.mess) {
        this.setState({
          mess: decoded.mess
        });
      }
    }*/
  }
  render() {
    return (
      <div>
        <p>
          Un courriel de confirmation vous a été envoyé à{" "}
          <span style={{ fontWeight: 600 }}>{this.props.email}</span>
        </p>
        <p>
          Vous y trouverez un lien cliquable pour activer votre inscription.
        </p>
      </div>
    );
  }
}

export default Confirmation;
