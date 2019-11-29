import React from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import "../../styles/leftBar.css";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const CustumerDataSearch = () => (
  <ExpansionPanel>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Grid
        onClick={event => event.stopPropagation()}
        onFocus={event => event.stopPropagation()}
        container
        direction="column"
        spacing={1}
      >
        <Grid item>
          <SingleDropdownList
            className="datasearch"
            react={{
              and: [
                "mainSearch",
                "cote",
                "date",
                "institution",
                "contributors",
                "collection",
                "will_place",
                "birth_place",
                "death_place",
                "provenance",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="testatorSearch"
            dataField="testator.name.keyword"
            size={1000}
            sortBy="asc"
            showCount={true}
            autosuggest={true}
            placeholder="Nom du testateur"
            URLParams={true}
            loader="En chargement ..."
            showSearch={true}
            searchPlaceholder="Taper le nom ici"
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "birth_place",
                "death_place",
                "provenance",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="cote"
            dataField="will_identifier.cote.keyword"
            size={1000}
            sortBy="asc"
            showCount={true}
            autosuggest={true}
            placeholder="Cote du testament"
            URLParams={true}
            loader="En chargement ..."
            showSearch={true}
            searchPlaceholder="Taper le cote ici"
            innerClass={{
              list: "list"
            }}
          />
        </Grid>
      </Grid>
    </ExpansionPanelSummary>

    <ExpansionPanelDetails>
      <Grid container justify="center" direction="column" spacing={1}>
        <Grid item>
          <SingleDropdownList
            className="datasearch"
            react={{
              and: [
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "birth_place",
                "death_place",
                "provenance",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="will_place"
            dataField="will_contents.will_place_norm.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Lieu de rédaction"
            URLParams={true}
            loader="En chargement ..."
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "death_place",
                "provenance",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="birth_place"
            dataField="will_contents.birth_place_norm.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Lieu de naissance"
            URLParams={true}
            loader="En chargement ..."
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "birth_date",
                "provenance",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="death_place"
            dataField="will_contents.death_place_norm.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Lieu de décès"
            URLParams={true}
            loader="En chargement ..."
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "birth_place",
                "death_place",
                "occupation",
                "affiliation"
              ]
            }}
            componentId="provenance"
            dataField="will_provenance.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Provenance"
            URLParams={true}
            loader="En chargement ..."
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "birth_place",
                "death_place",
                "provenance",
                "affiliation"
              ]
            }}
            componentId="occupation"
            dataField="testator.occupation.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Profession"
            URLParams={true}
            loader="En chargement ..."
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
                "mainSearch",
                "date",
                "institution",
                "contributors",
                "testatorSearch",
                "collection",
                "will_place",
                "birth_place",
                "death_place",
                "provenance",
                "occupation"
              ]
            }}
            componentId="affiliation"
            dataField="testator.affiliation.keyword"
            size={1000}
            sortBy="count"
            showCount={true}
            autosuggest={true}
            placeholder="Unité militaire"
            URLParams={true}
            loader="En chargement ..."
            showSearch={true}
            searchPlaceholder="Taper le cote ici"
            innerClass={{
              list: "list"
            }}
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default CustumerDataSearch;
