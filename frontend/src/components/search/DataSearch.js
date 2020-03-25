import React, { Component } from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
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
  handleClick() {
    this.setState({
      displayMore: !this.state.displayMore
    });
  }

  render() {
    const terms_normalized = {
      employe: "employé",
      garcon: "garçon",
      cafe: "café",
      negociant: "négociant",
      epicier: "épicier",
      commercant: "commerçant",
      nouveautes: "nouveautés",
      departement: "département",
      cremier: "crémier",
      bicetre: "Bicêtre",
      editeurs: "éditeurs",
      societe: "Société",
      generale: "Générale",
      metropolitain: "Métropolitain",
      montbeliard: "Montbéliard",
      doubs: "Doubs",
      "thomson-houston": "Thomson-Houston",
      "d'electricite": "d'électricité",
      hotelier: "hôtelier",
      bangkok: "Bangkok",
      royaume: "Royaume",
      siam: "Siam",
      orfevre: "orfèvre",
      pepinieriste: "pépiniériste",
      prêtre: "prêtre",
      cathedrale: "cathédrale",
      "l'eglise": "l'église",
      proprietaire: "propriétaire",
      representant: "représentant",
      represantant: "représantant",
      facon: "façon",
      ingenieur: "ingénieur"
    };
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
                  searchPlaceholder="Saisir un nom de testateur"
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
                dataField="testator.occupation.no_accent"
                sortBy="asc"
                size={500}
                showCount={true}
                autosuggest={true}
                placeholder="Profession"
                URLParams={true}
                showSearch={true}
                searchPlaceholder="Saisir une profession"
                renderItem={(label, count, isSelected) => {
                  let label_ = "";
                  label.split(" ").forEach(item => {
                    if (item.length === 1) {
                      item = item.replace("a", "à");
                    } else {
                      for (let [key, value] of Object.entries(
                        terms_normalized
                      )) {
                        item = item.replace(key, value);
                      }
                    }

                    label_ += item + " ";
                  });
                  return (
                    <div>
                      {label_}
                      <span
                        style={{
                          marginLeft: 5
                        }}
                      >
                        ({count})
                      </span>
                    </div>
                  );
                }}
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
                searchPlaceholder="Saisir une unité militaire"
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
                showSearch={false}
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
                searchPlaceholder="Saisir une cote"
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
                searchPlaceholder="Saisir une étude notariale"
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
