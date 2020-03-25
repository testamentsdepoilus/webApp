import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import { Grid, Typography, MenuItem, Select } from "@material-ui/core";

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

  customQuery = function(value, props) {
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
            fied_option = {
              "will_pages.transcription_text": { type: "plain" }
            };
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
                  fragment_size: 80
                }
              }
            }
          }
        };
      }
    }
  };
  render() {
    return (
      <div className="textSearch">
        <Grid container justify="center" direction="column" spacing={1}>
          <Grid item>
            <Grid container direction="row" spacing={1}>
              <Grid item>
                <Typography className="typoTitle">
                  Effectuer une recherche dans
                </Typography>
              </Grid>
              <Grid item>
                <Select
                  value={this.state.value}
                  onChange={this.handleChange}
                  className="select"
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
          <Grid item>
            <DataSearch
              className="dataSearch"
              componentId="texte"
              dataField={[this.state.value]}
              queryFormat="or"
              placeholder={"Saisir un mot, une expression …"}
              filterLabel="recherche"
              autosuggest={true}
              showIcon={false}
              customQuery={this.customQuery}
              URLParams={true}
              searchOperators={true}
              innerClass={{
                input: "inputSearch"
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default TextSearch;
