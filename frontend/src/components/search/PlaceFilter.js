import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import {
  List,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItem,
  Snackbar,
  Button,
  Box,
} from "@material-ui/core";
import { getHitsFromQuery, getParamConfig } from "../../utils/functions";

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
      places: {},
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

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_places"),
      JSON.stringify({
        size: 2000,
        _source: ["city"],
        query: {
          match_all: {},
        },
      })
    )
      .then((data) => {
        let output = {};
        data.forEach((item) => {
          const city_norm = item._source["city"]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
          output[city_norm] = item._source["city"];
        });
        this.setState({
          places: output,
        });
      })
      .catch((e) => {});
  }

  render() {
    return (
      <div>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
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
                  "cote",
                ],
              }}
              componentId="lieu"
              dataField="will_contents.place.no_accent"
              value={this.state.place}
              size={2000}
              sortBy="asc"
              showCount={false}
              autosuggest={true}
              placeholder="Lieu"
              URLParams={true}
              loader="En chargement ..."
              showSearch={true}
              searchPlaceholder="Saisir un nom de lieu"
              onChange={this.handlePlaceChange}
              customQuery={this.customQuery}
              renderItem={(label, count, isSelected) => {
                return <div>{this.state.places[label]}</div>;
              }}
              innerClass={{
                list: "list",
                select: this.state.place === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.place !== "" ? (
            <Button
              id="clearPlace"
              onClick={(event) => this.handlePlaceChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <div>
          <List className="places_list">
            <ListItem className="checkbox">
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

            <ListItem className="checkbox">
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

            <ListItem className="checkbox">
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
        </div>
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
