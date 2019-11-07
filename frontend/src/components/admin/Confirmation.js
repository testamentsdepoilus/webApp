import React, { Component } from "react";

class Confirmation extends Component {
  constructor() {
    super();
    this.state = {
      mess: "Un mail de confirmation vous a été envoyé !"
    };
  }
  componentDidMount() {
    /* const token = sessionStorage.usertoken;
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
        <h1>Confirmation</h1>
        <h5>{this.state.mess}</h5>
      </div>
    );
  }
}

export default Confirmation;
