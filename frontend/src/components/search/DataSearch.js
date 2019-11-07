import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import "../../styles/leftBar.css";
import TextSearch from "./TextSearch";
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
      <Grid container justify="center" direction="column" spacing={1}>
        <Grid item>
          <TextSearch />
        </Grid>
        <Grid item>
          <DataSearch
            className="datasearch"
            componentId="testatorSearch"
            dataField={["testator_name"]}
            queryFormat="and"
            placeholder="Nom"
            title="Nom du testateur"
            iconPosition="right"
            filterLabel="search"
            autosuggest={true}
            URLParams
          />
        </Grid>
        <Grid item>
          <DataSearch
            className="datasearch"
            componentId="cote"
            dataField={["will_identifier.cote"]}
            queryFormat="and"
            placeholder="Cote"
            title="Cote du testament"
            iconPosition="right"
            filterLabel="search"
            autosuggest={false}
            URLParams
          />
        </Grid>
      </Grid>
    </ExpansionPanelSummary>

    <ExpansionPanelDetails>
      <Grid container justify="center" direction="column" spacing={1}>
        <Grid item>
          <DataSearch
            className="datasearch"
            componentId="deathPlace"
            dataField={["death_place"]}
            queryFormat="and"
            placeholder="Lieu"
            title="Lieu de décès"
            iconPosition="left"
            filterLabel="search"
            autosuggest={true}
            URLParams
          />
        </Grid>
        <Grid item>
          <DataSearch
            className="datasearch"
            componentId="willPlace"
            dataField={["will_place"]}
            queryFormat="and"
            placeholder="Commune"
            title="Commune d'origine"
            iconPosition="left"
            filterLabel="search"
            autosuggest={false}
            URLParams
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default CustumerDataSearch;
