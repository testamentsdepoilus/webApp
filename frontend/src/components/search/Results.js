import React from "react";
import {
  ReactiveList,
  SelectedFilters,
  ReactiveComponent
} from "@appbaseio/reactivesearch";

import { Fab, Grid, Tooltip } from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";
import classNames from "classnames";
import GeoMap from "./GeoMap_bis";

import ResultWills from "./ResultWills";

// Style button
const Styled = createStyled(theme => ({
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
  typoName: {
    fontSize: 20,
    fontStyle: "oblique",
    fontWeight: 600
  },
  typoText: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 15,
    paddingLeft: 20,
    display: "block"
  },
  margin: {
    margin: theme.spacing(12)
  },
  bootstrapRoot: {
    display: "none",
    position: "fixed",
    bottom: 10,
    right: 10,
    boxShadow: "none",
    fontSize: 16,
    border: "1px solid",

    "&:hover": {
      backgroundColor: "#bcaaa4",
      borderColor: "#bcaaa4"
    }
  },
  divider: {
    color: "#212121"
  }
}));

// Up to top page click

window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (Boolean(document.getElementById("btTop"))) {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById("btTop").style.display = "block";
    } else {
      document.getElementById("btTop").style.display = "none";
    }
  }
}

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curField: "",
      curOrder: ""
    };
    this.topFunction = this.topFunction.bind(this);
  }

  topFunction = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.field !== prevState.curField ||
      nextProps.order !== prevState.curOrder
    ) {
      return {
        curField: nextProps.field,
        curOrder: nextProps.order
      };
    }
    return null;
  }

  // Render
  render() {
    return (
      <div key={0}>
        <div className="main-container">
          <SelectedFilters clearAllLabel="Supprimer mes critères" />

          <ReactiveList
            react={{
              and: [
                "mainSearch",
                "contributors",
                "institution",
                "date",
                "cote",
                "testatorSearch",
                "ProvenanceTag",
                "checkBox"
              ]
            }}
            dataField={this.state.curField}
            sortBy={this.state.curOrder}
            componentId="searchResult"
            stream={true}
            pagination={false}
            size={15}
            showResultStats={true}
            infiniteScroll={true}
            loader="Loading Results.."
            renderResultStats={function(stats) {
              return `Affichage ${stats.displayedResults} / ${stats.numberOfResults} dans ${stats.time} ms`;
            }}
          >
            {({ data, error, loading }) => <ResultWills data={data} />}
          </ReactiveList>
        </div>
        <div className="rightSidebar">
          <Grid container direction="row" spacing={1}>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <div id="chipRoot">
                    <div id="chipWill"></div>
                  </div>
                </Grid>
                <Grid item>
                  <Tooltip
                    title="Comparer les testaments"
                    style={{ cursor: "hand" }}
                    interactive
                  >
                    <Fab id="btCompare" aria-label="Compare" size="small">
                      <CompareIcon />
                    </Fab>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ReactiveComponent
                componentId="mapSearch"
                react={{
                  and: [
                    "mainSearch",
                    "contributors",
                    "institution",
                    "date",
                    "cote",
                    "testatorSearch",
                    "ProvenanceTag"
                  ]
                }}
                defaultQuery={() => ({
                  _source: ["will_contents.will_place", "will_identifier.name"],
                  size: 100,
                  query: {
                    match_all: {}
                  }
                })}
                render={({ data }) => <GeoMap data={data} />}
              />
            </Grid>
            <Grid item>
              {/*<TagCloud
                className="tag-container"
                componentId="ProvenanceTag"
                dataField="will_identifier.institution.keyword"
                title="Provenance"
                size={50}
                showCount={true}
                multiSelect={true}
                queryFormat="or"
                react={{
                  and: [
                    "mainSearch",
                    "contributors",
                    "institution",
                    "date",
                    "cote",
                    "testatorSearch"
                  ]
                }}
                showFilter={true}
                filterLabel="Provenance"
                URLParams={true}
                loader="Loading ..."
              />*/}
            </Grid>
          </Grid>
        </div>
        <Styled>
          {({ classes }) => (
            <Tooltip title="Au top" style={{ cursor: "hand" }} interactive>
              <Fab
                id="btTop"
                onClick={this.topFunction}
                aria-label="Top"
                className={classNames(classes.margin, classes.bootstrapRoot)}
                size="medium"
              >
                <ArrowUpIcon />
              </Fab>
            </Tooltip>
          )}
        </Styled>
      </div>
    );
  }
}

export default Results;
