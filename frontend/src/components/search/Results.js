import React from "react";
import {
  ReactiveList,
  SelectedFilters,
  ReactiveComponent
} from "@appbaseio/reactivesearch";

import { Fab, Grid, Tooltip, IconButton, Popper } from "@material-ui/core";
import { createStyled } from "../../utils/functions";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";
import classNames from "classnames";
import GeoMap from "./GeoMap_bis";
import ResultWills from "./ResultWills";
import TextSearch from "./TextSearch";
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";

// Style button
const Styled = createStyled(theme => ({
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
  popper: {
    border: "1px solid",
    fontSize: "0.9rem",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  },
  popperTitle: {
    fontWeight: 600
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
      curOrder: "asc",
      anchorEl: null
    };
    this.topFunction = this.topFunction.bind(this);
    this.handleHelpOpen = this.handleHelpOpen.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
  }

  topFunction = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

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
    const open = Boolean(this.state.anchorEl);
    const id = open ? "transitions-popper" : undefined;
    return (
      <div key={0}>
        <Grid container alignItems="baseline" justify="center" direction="row">
          <Grid item xs={6}>
            <div className="main-container">
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item xs={8}>
                  <TextSearch />
                </Grid>
                <Grid item xs={2}>
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
                          <p className={classes.popperTitle}>
                            Aide à la recherche :
                          </p>
                          <p>
                            OR, | : opérateur de disjonction par défault (armée
                            guerre)
                          </p>
                          <p>
                            AND, + : opérateur de conjonction (armée + guerre)
                          </p>
                          <p>NOT, - : opérateur d'exclusion (armée -guerre) </p>
                          <p>+ : opérateur d'inclusion (armée +guerre) </p>
                          <p>* : troncature</p>
                          <p>? : substitution</p>
                          <p>
                            " " : recherche exactment une suite de mots (ou
                            phrase)
                          </p>
                          <p>
                            ^ : rendre un terme plus pertinent (armée guerre^2)
                          </p>
                        </div>
                      </Popper>
                    )}
                  </Styled>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    aria-describedby="save"
                    onClick={this.handleSaveSearch}
                    style={{ cursor: "hand" }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Grid>
              </Grid>

              <SelectedFilters clearAllLabel="Effacer les critères de recherche" />
              {this.state.curField === "" && this.state.curOrder === "" ? (
                <ReactiveList
                  react={{
                    and: [
                      "texte",
                      "contributeur",
                      "institution",
                      "collection",
                      "date_naissance",
                      "date_deces",
                      "date_redaction",
                      "cote",
                      "nom_testateur",
                      "lieu",
                      "notoriale",
                      "profession",
                      "unite",
                      "checkBox"
                    ]
                  }}
                  dataField=""
                  componentId="searchResult"
                  stream={true}
                  pagination={false}
                  size={15}
                  showResultStats={true}
                  infiniteScroll={true}
                  loader="Loading Results.."
                  renderResultStats={function(stats) {
                    return ` ${stats.numberOfResults} testaments sur 193 correspondent à votre recherche`;
                  }}
                >
                  {({ data, error, loading }) => <ResultWills data={data} />}
                </ReactiveList>
              ) : (
                <ReactiveList
                  react={{
                    and: [
                      "texte",
                      "contributeur",
                      "institution",
                      "collection",
                      "date_naissance",
                      "date_deces",
                      "date_redaction",
                      "cote",
                      "nom_testateur",
                      "lieu",
                      "notoriale",
                      "profession",
                      "unite",
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
                    return ` ${stats.numberOfResults} testaments sur 193 correspondent à votre recherche`;
                  }}
                >
                  {({ data, error, loading }) => <ResultWills data={data} />}
                </ReactiveList>
              )}
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <div className="rightSidebar">
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
                </div>
              </Grid>
              <Grid item>
                <ReactiveComponent
                  componentId="mapSearch"
                  react={{
                    and: [
                      "texte",
                      "contributeur",
                      "institution",
                      "collection",
                      "date_naissance",
                      "date_redaction",
                      "date_deces",
                      "cote",
                      "lieu",
                      "nom_testateur",
                      "notoriale",
                      "profession",
                      "unite"
                    ]
                  }}
                  defaultQuery={() => ({
                    _source: [
                      "will_contents.birth_place",
                      "testator.forename",
                      "testator.surname",
                      "testator.ref",
                      "will_contents.death_place",
                      "will_contents.death_date",
                      "will_contents.birth_date",
                      "will_contents.birth_place_norm",
                      "will_contents.death_place_norm",
                      "will_contents.birth_place_ref",
                      "will_contents.death_place_ref"
                    ],
                    size: 1000,
                    query: {
                      match_all: {}
                    }
                  })}
                  render={({ data }) => {
                    let birth_data = {};
                    let death_data = {};

                    data.forEach(item => {
                      if (Boolean(item["will_contents.birth_place_ref"])) {
                        if (
                          Boolean(
                            birth_data[item["will_contents.birth_place_ref"]]
                          )
                        ) {
                          birth_data[
                            item["will_contents.birth_place_ref"]
                          ].push(item);
                        } else {
                          birth_data[
                            item["will_contents.birth_place_ref"]
                          ] = [];
                          birth_data[
                            item["will_contents.birth_place_ref"]
                          ].push(item);
                        }
                      }
                      if (Boolean(item["will_contents.death_place_ref"])) {
                        if (
                          Boolean(
                            death_data[item["will_contents.death_place_ref"]]
                          )
                        ) {
                          death_data[
                            item["will_contents.death_place_ref"]
                          ].push(item);
                        } else {
                          death_data[
                            item["will_contents.death_place_ref"]
                          ] = [];
                          death_data[
                            item["will_contents.death_place_ref"]
                          ].push(item);
                        }
                      }
                    });

                    return (
                      <GeoMap birth_data={birth_data} death_data={death_data} />
                    );
                  }}
                />
              </Grid>
              {/* <Grid item>
              <TagCloud
                className="tag-container"
                componentId="ProvenanceTag"
                dataField="will_provenance.keyword"
                title="Provenance"
                size={50}
                showCount={true}
                multiSelect={true}
                queryFormat="or"
                react={{
                  and: [
                    "texte",
                    "contributeur",
                    "institution",
                    "collection",
                    "date",
                    "cote",
                    "lieu_redaction",
                    "lieu_naissance",
                    "nom_testateur",
                    "lieu_deces",
                    "notoriale"
                  ]
                }}
                showFilter={true}
                filterLabel="Provenance"
                URLParams={true}
                loader="Loading ..."
              />
            </Grid>*/}
            </Grid>
          </Grid>
        </Grid>
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
