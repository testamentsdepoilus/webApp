import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import ClearIcon from "@material-ui/icons/Clear";
import { Grid, IconButton } from "@material-ui/core";

class ContributorFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contributeur: "",
    };

    this.handleContributeurChange = this.handleContributeurChange.bind(this);
  }

  handleContributeurChange(value) {
    this.setState({
      contributeur: value,
    });
  }

  render() {
    return (
      <Grid container direction="row">
        <Grid item xs={10}>
          <SingleDropdownList
            className="datasearch"
            react={{
              and: [
                "texte",
                "cote",
                "date_redaction",
                "date_deces",
                "nom_testateur",
                "institution",
                "collection",
                "lieu",
                "notoriale",
                "profession",
                "unite",
              ],
            }}
            componentId="contributeur"
            value={this.state.contributeur}
            nestedField="contributions"
            dataField="contributions.persName.keyword"
            size={1000}
            showCount={true}
            autosuggest={true}
            placeholder="Nom du contributeur"
            URLParams={true}
            loader="En chargement ..."
            showSearch={true}
            searchPlaceholder="Saisir un nom de contributeur"
            onChange={this.handleContributeurChange}
            innerClass={{
              list: "list",
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            id="clearContributeur"
            onClick={(event) => this.handleContributeurChange("")}
            title="Supprimer le filtre"
          >
            <ClearIcon style={{ color: "red" }} />
          </IconButton>
        </Grid>
      </Grid>
    );
  }
}

export default ContributorFilters;
