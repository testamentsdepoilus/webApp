import React from "react";
import {
  DataSearch,
  SingleList,
  SingleDropdownList
} from "@appbaseio/reactivesearch";
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
      <Grid container direction="column" spacing={1}>
        <Grid item>
          {/*<DataSearch
            className="datasearch"
            componentId="testatorSearch"
            dataField={["testator_name"]}
            queryFormat="and"
            placeholder="Nom de testateur"
            title="Nom du testateur"
            iconPosition="right"
            filterLabel="search"
            autosuggest={true}
            URLParams
          />
          <SingleList
            componentId="testatorSearch"
            dataField="testator_name.keyword"
            sortBy="asc"
            queryFormat="and"
            URLParams
            showSearch={false}
            className="datasearch"
            innerClass={{
              list: "list"
            }}
            filterLabel="search"
          />*/}

          <SingleList
            className="datasearch"
            react={{
              and: ["mainSearch", "cote", "date", "institution", "contributors"]
            }}
            componentId="testatorSearch"
            dataField="testator_name.keyword"
            title="Nom du testateur"
            size={1000}
            sortBy="count"
            showCount={true}
            placeholder="Nom de testateur"
            showFilter={true}
            filterLabel="search"
            URLParams={true}
            loader="Loading ..."
            innerClass={{
              list: "list"
            }}
          />
        </Grid>
        <Grid item>
          {/* <DataSearch
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
         />*/}
          <SingleList
            className="datasearch"
            react={{
              and: [
                "mainSearch",
                "testatorSearch",
                "date",
                "institution",
                "contributors"
              ]
            }}
            componentId="cote"
            dataField="will_identifier.cote.keyword"
            title="Cote du testament"
            size={1000}
            sortBy="count"
            showCount={true}
            placeholder="Cote du testament"
            showFilter={true}
            filterLabel="search"
            URLParams={true}
            iconPosition="right"
            loader="Loading ..."
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
