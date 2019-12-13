import React from "react";
import { DataSearch, SingleDropdownList } from "@appbaseio/reactivesearch";
import "../../styles/leftBar.css";
import {
  Grid,
  Typography,
  MenuItem,
  Select,
  List,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItem,
  Snackbar
} from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import classNames from "classnames";
import { func } from "prop-types";
// Style button
const Styled = createStyled(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(2, 1, 4, 1)
  },
  inputSearch: {
    borderRadius: "22px",
    border: "1px solid red"
  },
  typography: {
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
  },
  typoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#424242"
  },
  select: {
    height: 20
  }
}));

class PlaceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birth_place: true,
      will_place: true,
      death_place: true,
      residence_place: true,
      openAlert: false
    };
    this.handChange = this.handChange.bind(this);
    this.customQuery = this.customQuery.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handChange(name) {
    let selectedItem = [
      this.state.birth_place,
      this.state.death_place,
      this.state.residence_place,
      this.state.will_place
    ].filter(item => item);

    return function(event) {
      if (selectedItem.length === 1 && !event.target.checked) {
        this.setState({
          openAlert: true
        });
      } else {
        this.setState({
          [name]: event.target.checked
        });
      }
    }.bind(this);
  }

  handleClose() {
    this.setState({
      openAlert: false
    });
  }

  customQuery = function(value, props) {
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
            operator: "and"
          }
        }
      };
    }
  };

  render() {
    return (
      <Styled>
        {({ classes }) => (
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
                          "aria-label": "primary checkbox"
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
                          "aria-label": "primary checkbox"
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
                          "aria-label": "primary checkbox"
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
                          "aria-label": "primary checkbox"
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText secondary="Lieu de décès" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <SingleDropdownList
                  className="datasearch"
                  react={{
                    and: [
                      "texte",
                      "date_redaction",
                      "institution",
                      "contributeur",
                      "nom_testateur",
                      "collection",
                      "notoriale",
                      "profession",
                      "unite",
                      "cote"
                    ]
                  }}
                  componentId="lieu"
                  dataField="will_contents.place.keyword"
                  size={2000}
                  sortBy="asc"
                  showCount={false}
                  autosuggest={true}
                  placeholder="Lieu"
                  URLParams={true}
                  loader="En chargement ..."
                  showSearch={true}
                  searchPlaceholder="Taper le lieu ici"
                  innerClass={{
                    list: "list"
                  }}
                  customQuery={this.customQuery}
                />
              </Grid>
            </Grid>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={this.state.openAlert}
              onClose={this.handleClose}
              autoHideDuration={3000}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={
                <span id="message-id">
                  Au moins une case doit être cocher !
                </span>
              }
            />
          </div>
        )}
      </Styled>
    );
  }
}

export default PlaceFilter;
