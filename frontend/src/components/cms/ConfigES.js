import React, { Component } from "react";

import {
  getUserToken,
  updateConfigMail,
  getParamConfig,
} from "../../utils/functions";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Link as RouterLink } from "react-router-dom";
import {MenuList, Grid} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

class ConfigES extends Component {
  constructor() {
    super();
    this.state = {

    };

  }



  render() {

    return (
      <div className="configMail ES">
        <Grid container direction="row" justify="center" spacing={0}>
          <Grid item xs={12} md={2}>
            <MenuList>
              <MenuItem>Créer</MenuItem>
              <MenuItem>Ajouter ou modifier</MenuItem>
              <MenuItem>Supprimer</MenuItem>
            </MenuList>
          </Grid>
          <Grid className="bg-white" item xs={12} md={10}>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ConfigES;
