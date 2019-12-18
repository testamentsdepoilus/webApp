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
        <h1>L'e-mail de confirmation a été expédié !</h1>
        <p>
          Un mail de confirmation vous a été adressé à{" "}
          <span style={{ fontWeight: 600 }}>{this.props.email}</span>
        </p>
        <p>
          Vous trouverez dans votre boîte mail un lien cliquable pour activer
          votre inscription
        </p>
      </div>
    );
  }
}

export default Confirmation;
