import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import {
  Grid,
  List,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItem,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

class PlaceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birth_place: true,
      will_place: true,
      death_place: true,
      residence_place: true,
      openAlert: false,
      noResults: false,
      place: "",
    };
    this.handChange = this.handChange.bind(this);
    this.customQuery = this.customQuery.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
  }

  handChange(name) {
    let selectedItem = [
      this.state.birth_place,
      this.state.death_place,
      this.state.residence_place,
      this.state.will_place,
    ].filter((item) => item);

    return function (event) {
      if (selectedItem.length === 1 && !event.target.checked) {
        this.setState({
          openAlert: true,
        });
      } else {
        this.setState({
          [name]: event.target.checked,
        });
      }
    }.bind(this);
  }

  handleClose() {
    this.setState({
      openAlert: false,
    });
  }

  handlePlaceChange(value) {
    this.setState({
      place: value,
    });
  }

  customQuery = function (value, props) {
    let fields_ = [];
    if (this.state.birth_place) {
      fields_.push("will_contents.birth_place_norm");
    }
    if (this.state.death_place) {
      fields_.push("will_contents.death_place_norm");
    }
    if (this.state.will_place) {
      fields_.push("will_contents.will_place_norm");
    }
    if (this.state.residence_place) {
      fields_.push("will_contents.residence_norm");
    }
    if (Boolean(value)) {
      return {
        query: {
          multi_match: {
            query: value,
            fields: fields_,
            operator: "and",
          },
        },
      };
    }
  };

  render() {
    return (
      <div>
        <Grid container alignItems="center" direction="row" spacing={1}>
          <Grid item xs={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={this.state.birth_place}
                    onChange={this.handChange("birth_place")}
                    value="birth_place"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </ListItemIcon>
                <ListItemText secondary="Lieu de naissance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={this.state.residence_place}
                    onChange={this.handChange("residence_place")}
                    value="residence_place"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </ListItemIcon>
                <ListItemText secondary="Lieu de résidence" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={this.state.will_place}
                    onChange={this.handChange("will_place")}
                    value="will_place"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </ListItemIcon>
                <ListItemText secondary="Lieu de rédaction" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={this.state.death_place}
                    onChange={this.handChange("death_place")}
                    value="death_place"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </ListItemIcon>
                <ListItemText secondary="Lieu de décès" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} container direction="row">
            <Grid item xs={10}>
              <SingleDropdownList
                className="datasearch"
                react={{
                  and: [
                    "texte",
                    "date_redaction",
                    "date_naissance",
                    "date_deces",
                    "institution",
                    "contributeur",
                    "nom_testateur",
                    "collection",
                    "profession",
                    "notoriale",
                    "unite",
                    "cote",
                  ],
                }}
                componentId="lieu"
                dataField="will_contents.place.keyword"
                value={this.state.place}
                size={2000}
                sortBy="asc"
                showCount={false}
                autosuggest={true}
                placeholder="Lieu"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Saisir un nom de lieu"
                customQuery={this.customQuery}
                onChange={this.handlePlaceChange}
                innerClass={{
                  list: "list",
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                id="clearPlace"
                onClick={(event) => this.handlePlaceChange("")}
                title="Supprimer le filtre"
              >
                <ClearIcon style={{ color: "red" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.openAlert}
          onClose={this.handleClose}
          autoHideDuration={3000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={
            <span id="message-id">Au moins une case doit être cochée !</span>
          }
        />
      </div>
    );
  }
}

export default PlaceFilter;
