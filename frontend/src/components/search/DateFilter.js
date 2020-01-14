import React from "react";
import { DateRange } from "@appbaseio/reactivesearch";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid,
  IconButton,
  Popper
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "moment/locale/fr";
import MomentLocaleUtils, {
  formatDate,
  parseDate
} from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined";
import { createStyled } from "../../utils/functions";

// Style
const Styled = createStyled(theme => ({
  popper: {
    border: "1px solid",
    fontSize: "0.9rem",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    maxWidth: "15em"
  }
}));

class DateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.handleHelpOpen = this.handleHelpOpen.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
  }

  handleHelpOpen(event) {
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget
    });
  }

  handleHelpClose(event) {
    this.setState({
      anchorEl: null
    });
  }
  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "transitions-popper" : undefined;
    return (
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="date"
        >
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <Typography>Dates</Typography>
            </Grid>
            <Grid
              item
              xs={4}
              onClick={event => event.stopPropagation()}
              onFocus={event => event.stopPropagation()}
            >
              <IconButton
                aria-describedby={id}
                onClick={this.handleHelpOpen}
                style={{ cursor: "help" }}
              >
                <HelpIcon />
              </IconButton>
              <Styled>
                {({ classes }) => (
                  <Popper
                    id={id}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    placement="bottom-end"
                  >
                    <div className={classes.popper}>
                      <p>
                        Pour rechercher sur une date exacte, il faut saisir ou
                        sélectionner deux fois la même date dans les champs date
                        de début et date de fin
                      </p>
                    </div>
                  </Popper>
                )}
              </Styled>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <DateRange
                componentId="date_naissance"
                dataField="will_contents.birth_date"
                title="Date de naissance"
                placeholder={{
                  start: "Début: JJ/MM/YYYY ",
                  end: "Fin: JJ/MM/YYYY"
                }}
                queryFormat="date"
                URLParams
                numberOfMonths={1}
                autoFocusEnd={false}
                showClear={true}
                dayPickerInputProps={{
                  formatDate: formatDate,
                  format: "DD/MM/YYYY",
                  parseDate: parseDate,
                  dayPickerProps: {
                    month: new Date("1859-12-01"),
                    locale: "fr",
                    localeUtils: MomentLocaleUtils
                  }
                }}
              />
            </Grid>
            <Grid item>
              <DateRange
                componentId="date_redaction"
                dataField="will_contents.will_date_range"
                title="Date de rédaction"
                placeholder={{
                  start: "Début: JJ/MM/YYYY ",
                  end: "Fin: JJ/MM/YYYY"
                }}
                queryFormat="date"
                URLParams
                numberOfMonths={1}
                autoFocusEnd={false}
                showClear={true}
                dayPickerInputProps={{
                  formatDate: formatDate,
                  format: "DD/MM/YYYY",
                  parseDate: parseDate,
                  dayPickerProps: {
                    month: new Date("1914-07-01"),
                    locale: "fr",
                    localeUtils: MomentLocaleUtils
                  }
                }}
              />
            </Grid>
            <Grid item>
              <DateRange
                componentId="date_deces"
                dataField="will_contents.death_date"
                title="Date de décès"
                placeholder={{
                  start: "Début: JJ/MM/YYYY",
                  end: "Fin: JJ/MM/YYYY"
                }}
                queryFormat="date"
                URLParams
                numberOfMonths={1}
                autoFocusEnd={false}
                showClear={true}
                dayPickerInputProps={{
                  formatDate: formatDate,
                  format: "DD/MM/YYYY",
                  parseDate: parseDate,
                  dayPickerProps: {
                    month: new Date("1914-07-01"),
                    locale: "fr",
                    localeUtils: MomentLocaleUtils
                  }
                }}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default DateFilter;
