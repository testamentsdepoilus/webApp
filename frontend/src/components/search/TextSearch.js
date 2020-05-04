import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import { MenuItem, Select, Box } from "@material-ui/core";

class TextSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "will_pages.transcription",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  customQuery = function (value, props) {
    if (Boolean(value)) {
      if (value === "") {
        return {
          query: {
            match_all: {},
          },
        };
      } else {
        let field_value = value.replace(" + ", " AND ");
        let field_name = "will_pages.edition";
        let fied_option = { "will_pages.edition": { type: "plain" } };
        if (props && props.dataField) {
          if (props.dataField[0] === "will_pages.transcription") {
            field_name = "will_pages.transcription";
            fied_option = {
              "will_pages.transcription": { type: "plain" },
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
                  analyze_wildcard: true,
                },
              },
              inner_hits: {
                highlight: {
                  order: "score",
                  fields: fied_option,
                  pre_tags: ["<mark>"],
                  post_tags: ["</mark>"],
                  boundary_scanner_locale: "fr-FR",
                  number_of_fragments: 4,
                  fragment_size: 200,
                },
              },
            },
          },
        };
      }
    }
  };
  render() {
    return (
      <Box>
        <Box display="flex" className="containerSelectMode" mb={1}>
          <Box>
            <label className="fontWeightBold">
              Effectuer une recherche dans{" "}
            </label>
          </Box>
          <Box>
            <Select
              value={this.state.value}
              onChange={this.handleChange}
              className="select"
              name="value"
            >
              <MenuItem className="selectMode" value="will_pages.transcription">
                transcription
              </MenuItem>
              <MenuItem className="selectMode" value="will_pages.edition">
                édition
              </MenuItem>
            </Select>
          </Box>
        </Box>

        <Box width="100%">
          <DataSearch
            className="input input_keywords"
            componentId="texte"
            dataField={[this.state.value]}
            queryFormat="or"
            placeholder={"Saisir un mot, une expression…"}
            filterLabel="recherche"
            autosuggest={true}
            showIcon={true}
            customQuery={this.customQuery}
            URLParams={true}
            searchOperators={true}
            innerClass={{
              input: "inputSearch",
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default TextSearch;
