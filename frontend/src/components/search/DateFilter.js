import React from "react";
import { DateRange } from "@appbaseio/reactivesearch";
import { Grid, Button, Box, Popper } from "@material-ui/core";
import "moment/locale/fr";
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";
import "react-day-picker/lib/style.css";

class DateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
    this.handleHelpOpen = this.handleHelpOpen.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
  }

  handleHelpClose(event) {
    this.setState({
      anchorEl: null,
    });
  }
  handleHelpOpen(event) {
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
    });
  }

  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "transitions-popper" : undefined;
    return (
      <div className="dateFilter">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          spacing={0}
        >
          <label>Dates</label>
          <Button
            aria-describedby={id}
            onClick={this.handleHelpOpen}
            style={{ cursor: "help" }}
            className="button iconButton"
          >
            <i className="fas fa-question-circle"></i>
          </Button>
          <Popper
            id={id}
            open={open}
            anchorEl={this.state.anchorEl}
            placement="bottom-end"
          >
            <div className="tooltip">
              <Button
                id="closeToolTip"
                onClick={this.handleHelpClose}
                title="Fermer l'aide à la recherche"
                className="button close iconButton"
              >
                <i className="fas fa-times"></i>
              </Button>
              <p>
                Pour rechercher une date exacte, saisissez ou sélectionnez la
                même date dans les champs «&nbsp;date de début&nbsp;» et
                «&nbsp;date de fin&nbsp;».
              </p>
            </div>
          </Popper>
        </Box>

        <Grid container direction="column">
          <Grid item>
            <Box mb={0.7} mt={1}>
              <label className="text-black fontWeightLight">
                Date de naissance
              </label>
            </Box>
            <DateRange
              componentId="date_naissance"
              dataField="will_contents.birth_date_range"
              placeholder={{
                start: "Début: JJ/MM/YYYY ",
                end: "Fin: JJ/MM/YYYY",
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
                  localeUtils: MomentLocaleUtils,
                },
              }}
            />
          </Grid>
          <Grid item>
            <Box mb={0.7} mt={2}>
              <label className="text-black fontWeightLight">
                Date de rédaction
              </label>
            </Box>
            <DateRange
              componentId="date_redaction"
              dataField="will_contents.will_date_range"
              placeholder={{
                start: "Début: JJ/MM/YYYY ",
                end: "Fin: JJ/MM/YYYY",
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
                  localeUtils: MomentLocaleUtils,
                },
              }}
            />
          </Grid>
          <Grid item>
            <Box mb={0.7} mt={2}>
              <label className="text-black fontWeightLight">
                Date de décès
              </label>
            </Box>
            <DateRange
              componentId="date_deces"
              dataField="will_contents.death_date_range"
              placeholder={{
                start: "Début: JJ/MM/YYYY",
                end: "Fin: JJ/MM/YYYY",
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
                  localeUtils: MomentLocaleUtils,
                },
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default DateFilter;
