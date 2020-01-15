import React, { Component } from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import "../../styles/leftBar.css";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import PlaceFilter from "./PlaceFilter";

export default class CustumerDataSearch extends Component {
  constructor() {
    super();
    this.state = {
      displayMore: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    this.setState({
      displayMore: !this.state.displayMore
    });
  }

  render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={this.handleClick}
        >
          <Grid container direction="column" spacing={2}>
            <Grid
              onClick={event => event.stopPropagation()}
              onFocus={event => event.stopPropagation()}
              container
              direction="column"
              spacing={2}
            >
              <Grid item>
                <SingleDropdownList
                  className="datasearch"
                  react={{
                    and: [
                      "texte",
                      "cote",
                      "date_redaction",
                      "date_naissance",
                      "date_deces",
                      "institution",
                      "contributeur",
                      "collection",
                      "lieu",
                      "notoriale",
                      "profession",
                      "unite"
                    ]
                  }}
                  componentId="nom_testateur"
                  dataField="testator.name.keyword"
                  size={1000}
                  sortBy="asc"
                  showCount={true}
                  autosuggest={true}
                  placeholder="Nom du testateur"
                  URLParams={true}
                  showSearch={true}
                  searchPlaceholder="Taper le nom ici"
                  innerClass={{
                    list: "list"
                  }}
                />
              </Grid>

              <Grid item>
                <PlaceFilter />
              </Grid>
            </Grid>

            {!Boolean(this.state.displayMore) ? (
              <Grid item title="Plus de critères">
                <AddCircleOutlineIcon />
              </Grid>
            ) : (
              <Grid item title="Moins de critères">
                <RemoveCircleOutlineIcon title="Moins de critères" />
              </Grid>
            )}
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container justify="center" direction="column" spacing={1}>
            <Grid item>
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
                    "lieu",
                    "notoriale",
                    "unite",
                    "cote"
                  ]
                }}
                componentId="profession"
                dataField="testator.occupation.keyword"
                size={1000}
                sortBy="asc"
                showCount={true}
                autosuggest={true}
                placeholder="Profession"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Taper la profession ici"
                innerClass={{
                  list: "list"
                }}
              />
            </Grid>
            <Grid item>
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
                    "lieu",
                    "notoriale",
                    "profession",
                    "cote"
                  ]
                }}
                componentId="unite"
                dataField="testator.affiliation.keyword"
                size={1000}
                sortBy="count"
                showCount={true}
                autosuggest={true}
                placeholder="Unité militaire"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Taper l'unité ici"
                innerClass={{
                  list: "list"
                }}
              />
            </Grid>
            <Grid item>
              <SingleDropdownList
                className="datasearch"
                react={{
                  and: [
                    "texte",
                    "cote",
                    "nom_testateur",
                    "date_redaction",
                    "date_naissance",
                    "date_deces",
                    "contributeur",
                    "collection",
                    "lieu",
                    "notoriale",
                    "profession",
                    "unite"
                  ]
                }}
                componentId="institution"
                dataField="will_identifier.institution.keyword"
                size={1000}
                sortBy="count"
                showCount={true}
                autosuggest={true}
                placeholder="Institution de conservation"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Taper l'institution ici"
              />
            </Grid>
            <Grid item>
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
                    "lieu",
                    "notoriale",
                    "profession",
                    "unite"
                  ]
                }}
                componentId="cote"
                dataField="will_identifier.cote.keyword"
                size={1000}
                sortBy="asc"
                showCount={false}
                autosuggest={true}
                placeholder="Cote du testament"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Taper le cote ici"
                innerClass={{
                  list: "list"
                }}
              />
            </Grid>

            <Grid item>
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
                    "lieu",
                    "profession",
                    "unite",
                    "cote"
                  ]
                }}
                componentId="notoriale"
                dataField="will_provenance.keyword"
                size={1000}
                sortBy="count"
                showCount={true}
                autosuggest={true}
                placeholder="Étude notariale"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Taper ici"
                innerClass={{
                  list: "list"
                }}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
