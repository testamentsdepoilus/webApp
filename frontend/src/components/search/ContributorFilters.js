import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";

import { Button, Box } from "@material-ui/core";

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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Box flexGrow="1" flexShrink="1">
          <SingleDropdownList
            className="select"
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
              select: this.state.contributeur === "" ? "select" : "select selected",
            }}
          />
        </Box>
        {this.state.contributeur !== "" ? (
          <Button
            id="clearContributeur"
            onClick={(event) => this.handleContributeurChange("")}
            title="Supprimer le filtre"
            className="button clear iconButton"
          >
            <i className="fas fa-times"></i>
          </Button>
        ) : (
          ""
        )}
      </Box>
    );
  }
}

export default ContributorFilters;
