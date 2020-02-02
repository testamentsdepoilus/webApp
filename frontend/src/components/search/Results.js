import React from "react";
import {
  ReactiveList,
  SelectedFilters,
  ReactiveComponent
} from "@appbaseio/reactivesearch";

import {
  Fab,
  Grid,
  Tooltip,
  IconButton,
  Popper,
  CircularProgress,
  TextField,
  Container,
  Button,
  Snackbar,
  SnackbarContent
} from "@material-ui/core";
import {
  createStyled,
  getTotalHits,
  getParamConfig,
  updateMyListWills,
  getUserToken
} from "../../utils/functions";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import CompareIcon from "@material-ui/icons/CompareOutlined";
import classNames from "classnames";
import GeoMap from "./GeoMap_bis";
import ResultWills from "./ResultWills";
import TextSearch from "./TextSearch";
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";

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
  },
  info: {
    backgroundColor: "#1976d2"
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center",
    fontSize: 16
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
      anchorEl: null,
      totalHits: null,
      anchorElSearch: null,
      label: "",
      openAlert: false,
      message: ""
    };
    this.userToken = getUserToken();
    this.topFunction = this.topFunction.bind(this);
    this.handleHelpOpen = this.handleHelpOpen.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.handleSearchOpen = this.handleSearchOpen.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
    this.renderResultStats = this.renderResultStats.bind(this);
    this.handleSearchSave = this.handleSearchSave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  topFunction = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  handleHelpOpen(event) {
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
      anchorElSearch: null
    });
  }

  handleHelpClose(event) {
    this.setState({
      anchorEl: null
    });
  }

  handleSearchOpen(event) {
    this.setState({
      anchorElSearch: this.state.anchorElSearch ? null : event.currentTarget,
      anchorEl: null
    });
  }

  handleSearchClose(event) {
    this.setState({
      anchorElSearch: null,
      openAlert: false
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

  renderResultStats(stats) {
    if (Boolean(this.state.totalHits)) {
      return `${stats.numberOfResults} testaments sur ${this.state.totalHits} correspondent à votre recherche`;
    } else {
      return ` ${stats.numberOfResults} testaments correspondent à votre recherche`;
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSearchSave(e) {
    const myBackups_ = JSON.parse(localStorage.myBackups);
    let mySearches_ = Boolean(myBackups_.mySearches)
      ? myBackups_.mySearches
      : [];

    const idx = mySearches_.findIndex(item => {
      const label = item["label"];
      const url = item["url"];
      return label === this.state.label || url === document.location.href;
    });
    let label_ = this.state.label;
    if (
      this.state.label.length === 0 &&
      document.location.href.split("?").length === 2
    ) {
      const date = new Date();
      label_ = document.location.href.split("?")[1] + date;
    }
    console.log("label_ :", label_);

    if (idx === -1 && label_.length > 0) {
      mySearches_.push({
        label: label_,
        url: document.location.href
      });
      myBackups_["mySearches"] = mySearches_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_
      };
      updateMyListWills(newItem).then(res => {
        if (res.status === 200) {
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
          this.setState({
            anchorElSearch: null,
            label: "",
            openAlert: true,
            message: "Votre recherche a bien été enregistrée !"
          });
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          console.log("err :", err);
          this.setState({
            openAlert: true,
            message: "Votre recherche n'a pas été enregistrée !"
          });
        }
      });
    } else if (idx > -1) {
      console.log("find :", mySearches_[idx]);
      this.setState({
        anchorElSearch: null,
        label: "",
        openAlert: true,
        message:
          "Votre recherche est déjà enregistrée sous le label " +
          mySearches_[idx].label +
          " !"
      });
    }
  }

  componentDidMount() {
    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills")
    )
      .then(res => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;

        this.setState({
          totalHits: total
        });
      })
      .catch(e => {
        console.error("error :", e);
      });
  }

  // Render
  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "transitions-popper" : undefined;
    const open_search = Boolean(this.state.anchorElSearch);
    const id_search = open_search ? "transitions-popper" : undefined;
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
                  <Tooltip title="Aide à la recherche" interactive>
                    <IconButton
                      aria-describedby={id}
                      onClick={this.handleHelpOpen}
                      style={{ cursor: "help" }}
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
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
                  {Boolean(this.userToken) ? (
                    <Tooltip
                      title="Sauvegarder ma recherche"
                      interactive
                      arrow={true}
                    >
                      <IconButton
                        aria-describedby="save"
                        onClick={this.handleSearchOpen}
                        style={{ cursor: "hand" }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Connectez-vous pour sauvegarder votre recherche !"
                      arrow={true}
                    >
                      <span>
                        <IconButton aria-describedby="save" disabled>
                          <SaveIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                  <Styled>
                    {({ classes }) => (
                      <Popper
                        id={id_search}
                        open={open_search}
                        anchorEl={this.state.anchorElSearch}
                        placement="bottom-end"
                      >
                        <Container className={classes.popper}>
                          <p className={classes.popperTitle}>
                            Sauvegarder votre recherche :
                          </p>
                          <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item>
                              <TextField
                                id="input_search"
                                variant="outlined"
                                required
                                label="Label"
                                name="label"
                                onChange={this.onChange}
                                value={this.state.label}
                              />
                            </Grid>
                            <Grid item>
                              <Button
                                id="btSave"
                                variant="contained"
                                color="primary"
                                onClick={this.handleSearchSave}
                              >
                                Sauvegarder
                              </Button>
                            </Grid>
                          </Grid>
                        </Container>
                      </Popper>
                    )}
                  </Styled>
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
                      "unite"
                    ]
                  }}
                  dataField=""
                  componentId="searchResult"
                  stream={false}
                  pagination={false}
                  size={15}
                  showResultStats={true}
                  infiniteScroll={true}
                  loader={<CircularProgress />}
                  renderResultStats={this.renderResultStats}
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
                      "unite"
                    ]
                  }}
                  dataField={this.state.curField}
                  sortBy={this.state.curOrder}
                  componentId="searchResult"
                  stream={false}
                  pagination={false}
                  size={15}
                  showResultStats={true}
                  infiniteScroll={true}
                  loader={<CircularProgress />}
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
                  render={({ loading, error, data }) => {
                    if (data.length > 0) {
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
                        <GeoMap
                          birth_data={birth_data}
                          death_data={death_data}
                        />
                      );
                    } else {
                      return null;
                    }
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
            <div>
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
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                key="topCenter"
                open={this.state.openAlert}
                onClose={this.handleSearchClose}
                autoHideDuration={5000}
                ContentProps={{
                  "aria-describedby": "message-id"
                }}
              >
                <SnackbarContent
                  className={classes.info}
                  aria-describedby="client-snackbar"
                  message={
                    <span id="client-snackbar" className={classes.message}>
                      <InfoIcon
                        className={classNames(
                          classes.icon,
                          classes.iconVariant
                        )}
                      />
                      {this.state.message}
                    </span>
                  }
                  action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={this.handleSearchClose}
                    >
                      <CloseIcon className={classes.icon} />
                    </IconButton>
                  ]}
                />
              </Snackbar>
            </div>
          )}
        </Styled>
      </div>
    );
  }
}

export default Results;
