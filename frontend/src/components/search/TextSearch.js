import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import "../../styles/leftBar.css";
import { Grid, Typography, MenuItem, Select } from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import classNames from "classnames";
// Style button
const Styled = createStyled(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(2, 1, 4, 1)
  },
  inputSearch: {
    borderRadius: "22px",
    border: "1px solid red"
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  },
  typoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#424242"
  },
  select: {
    height: 20
  }
}));

let customQuery = function(value, props) {
  if (Boolean(value)) {
    if (value === "") {
      return {
        query: {
          match_all: {}
        }
      };
    } else {
      let field_value = value.replace(" + ", " AND ");
      let field_name = "will_pages.edition_text";
      let fied_option = { "will_pages.edition_text": { type: "plain" } };
      if (props && props.dataField) {
        if (props.dataField[0] === "will_pages.transcription_text") {
          field_name = "will_pages.transcription_text";
          fied_option = { "will_pages.transcription_text": { type: "plain" } };
        }
      }
      return {
        query: {
          nested: {
            path: "will_pages",
            query: {
              query_string: {
                default_field: field_name,
                query: field_value,
                analyze_wildcard: true
              }
            },
            inner_hits: {
              highlight: {
                order: "score",
                fields: fied_option,
                pre_tags: ["<mark>"],
                post_tags: ["</mark>"],
                boundary_scanner_locale: "fr-FR",
                number_of_fragments: 10,
                fragment_size: 50
              }
            }
          }
        }
      };
    }
  }
};

class TextSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "will_pages.transcription_text"
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    const page_name =
      this.state.value === "will_pages.edition_text"
        ? "édition"
        : "transcription";
    return (
      <Styled>
        {({ classes }) => (
          <Grid
            className={classes.root}
            container
            justify="center"
            direction="column"
            spacing={1}
          >
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <Typography
                    className={classNames(
                      classes.typography,
                      classes.typoTitle
                    )}
                  >
                    Effectuer votre recherche dans
                  </Typography>
                </Grid>
                <Grid item>
                  <Select
                    value={this.state.value}
                    onChange={this.handleChange}
                    className={classes.select}
                    name="value"
                  >
                    <MenuItem value="will_pages.transcription_text">
                      transcription
                    </MenuItem>
                    <MenuItem value="will_pages.edition_text">édition</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.dataSearch}>
              <DataSearch
                componentId="mainSearch"
                dataField={[this.state.value]}
                queryFormat="or"
                placeholder={"Que recherchez-vous dans " + page_name + " ?"}
                iconPosition="right"
                filterLabel="search"
                autosuggest={false}
                customQuery={customQuery}
                URLParams
                onValueChange={function(value) {}}
                onValueSelected={function(value, cause, source) {}}
                onQueryChange={function(prevQuery, nextQuery) {}}
                searchOperators={true}
                fuzziness={"AUTO"}
                innerClass={{
                  input: classes.inputSearch
                }}
              />
            </Grid>
          </Grid>
        )}
      </Styled>
    );
  }
}

export default TextSearch;
