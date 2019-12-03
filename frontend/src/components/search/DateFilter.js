import React from "react";
import { DateRange } from "@appbaseio/reactivesearch";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const DateFilter = () => (
  <ExpansionPanel>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="date"
    >
      {" "}
      <Typography>Filtrer par date</Typography>
    </ExpansionPanelSummary>

    <ExpansionPanelDetails>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <DateRange
            componentId="will_date"
            dataField="will_contents.will_date"
            title="Date de rédaction"
            placeholder={{
              start: "Début ",
              end: "Fin"
            }}
            queryFormat="date"
            URLParams
            initialMonth={new Date("1914-07-01")}
          />
        </Grid>
        <Grid item>
          <DateRange
            componentId="death_date"
            dataField="will_contents.death_date"
            title="Date de décès"
            placeholder={{
              start: "Début ",
              end: "Fin"
            }}
            queryFormat="date"
            URLParams
            initialMonth={new Date("1914-07-01")}
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default DateFilter;
