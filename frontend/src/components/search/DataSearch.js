import React, { Component } from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import { Grid, Button } from "@material-ui/core";
import PlaceFilter from "./PlaceFilter";

export default class CustumerDataSearch extends Component {
  constructor() {
    super();
    this.state = {
      displayMore: false,
      testator: "",
      unit: "",
      occupation: "",
      institution: "",
      notoriale: "",
      cote: "",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleTestatorChange = this.handleTestatorChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleOccupationChange = this.handleOccupationChange.bind(this);
    this.handleNotorialeChange = this.handleNotorialeChange.bind(this);
    this.handleCoteChange = this.handleCoteChange.bind(this);
    this.handleInstitutionChange = this.handleInstitutionChange.bind(this);
  }
  handleClick() {
    this.setState({
      displayMore: !this.state.displayMore,
    });
  }

  handleClear(value) {
    return function (event) {
      this.setState({
        testator: value,
      });
    }.bind(this);
  }

  handleTestatorChange(value) {
    console.log("value :", value);
    this.setState({
      testator: value,
    });
  }

  handleUnitChange(value) {
    this.setState({
      unit: value,
    });
  }

  handleCoteChange(value) {
    this.setState({
      cote: value,
    });
  }

  handleInstitutionChange(value) {
    this.setState({
      institution: value,
    });
  }

  handleNotorialeChange(value) {
    this.setState({
      notoriale: value,
    });
  }

  handleOccupationChange(value) {
    this.setState({
      occupation: value,
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
      ingenieur: "ingénieur",
    };
    return (
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "unite",
                ],
              }}
              componentId="nom_testateur"
              dataField="testator.name.keyword"
              value={this.state.testator}
              size={1000}
              sortBy="asc"
              showCount={true}
              autosuggest={true}
              placeholder="Nom du testateur"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir un nom de testateur"
              onChange={this.handleTestatorChange}
              innerClass={{
                list: "list",
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearTestator"
              onClick={(event) => this.handleTestatorChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <PlaceFilter />
        </Grid>

        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "cote",
                ],
              }}
              componentId="profession"
              dataField="testator.occupation.no_accent"
              value={this.state.occupation}
              sortBy="asc"
              size={500}
              showCount={true}
              autosuggest={true}
              placeholder="Profession"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une profession"
              onChange={this.handleOccupationChange}
              renderItem={(label, count, isSelected) => {
                let label_ = "";
                label.split(" ").forEach((item) => {
                  if (item.length === 1) {
                    item = item.replace("a", "à");
                  } else {
                    for (let [key, value] of Object.entries(terms_normalized)) {
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
                        marginLeft: 5,
                      }}
                    >
                      ({count})
                    </span>
                  </div>
                );
              }}
              innerClass={{
                list: "list",
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearOccupation"
              onClick={(event) => this.handleOccupationChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "cote",
                ],
              }}
              componentId="unite"
              dataField="testator.affiliation.keyword"
              value={this.state.unit}
              size={1000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Unité militaire"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une unité militaire"
              onChange={this.handleUnitChange}
              innerClass={{
                list: "list",
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearUnit"
              onClick={(event) => this.handleUnitChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "unite",
                ],
              }}
              componentId="institution"
              dataField="will_identifier.institution.keyword"
              value={this.state.institution}
              size={1000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Institution de conservation"
              onChange={this.handleInstitutionChange}
              URLParams={true}
              showSearch={false}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearInstitution"
              onClick={(event) => this.handleInstitutionChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "unite",
                ],
              }}
              componentId="cote"
              dataField="will_identifier.cote.keyword"
              value={this.state.cote}
              size={1000}
              sortBy="asc"
              showCount={false}
              autosuggest={true}
              placeholder="Cote du testament"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une cote"
              onChange={this.handleCoteChange}
              innerClass={{
                list: "list",
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearCote"
              onClick={(event) => this.handleCoteChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>

        <Grid item container direction="row">
          <Grid item xs={10}>
            <SingleDropdownList
              className="select"
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
                  "cote",
                ],
              }}
              componentId="notoriale"
              dataField="will_provenance.keyword"
              value={this.state.notoriale}
              size={1000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Étude notariale"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une étude notariale"
              onChange={this.handleNotorialeChange}
              innerClass={{
                list: "list",
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              id="clearNotoriale"
              onClick={(event) => this.handleNotorialeChange("")}
              title="Supprimer le filtre"
              className="button iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
