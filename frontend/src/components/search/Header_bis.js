import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import "../styles/Header.css";

let customQuery = function(value, props) {
  if (value == "") {
    return {
      query: {
        has_child: {
          type: "page",
          query: {
            match_all: {}
          }
        }
      }
    };
  } else {
    return {
      query: {
        has_child: {
          type: "page",
          query: {
            match: {
              text: value
            }
          },
          inner_hits: {
            highlight: {
              fields: {
                text: {}
              }
            }
          }
        }
      }
    };
  }
  /*
        return {
            "query": {
                "query_string": {
                    "default_field": "text",
                    "query": value
                }
            }
        }*/
  /*if (value !== undefined) {
        return {
            "query": {
                "has_child": {
                    "type": "page",
                    "query": {
                        "query_string": {
                            "default_field": "text",
                            "query": value
                        }
                    }
                }
            }
        }
    } else {
        return null
    }*/
};

let defaultQuery = function(props) {
  return {
    query: {
      has_child: {
        type: "page",
        query: {
          match_all: {}
        }
      }
    }
  };
};

const Header = () => (
  <div className="navbar">
    <div className="logo">Testaments Poilus</div>
    <DataSearch
      className="datasearch"
      componentId="mainSearch"
      dataField={["pages.text"]}
      queryFormat="or"
      placeholder="Recherche"
      innerClass={{
        input: "searchbox",
        list: "suggestionlist"
      }}
      highlight={true}
      iconPosition="left"
      filterLabel="search"
      autosuggest={false}
      URLParams
      onValueChange={function(value) {}}
      onValueSelected={function(value, cause, source) {}}
      onQueryChange={function(prevQuery, nextQuery) {}}
    />
  </div>
);

export default Header;
