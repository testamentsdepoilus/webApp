import React from "react";
import { ReactiveList, SelectedFilters } from "@appbaseio/reactivesearch";

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
  SnackbarContent,
  Select,
  MenuItem
} from "@material-ui/core";
import {
  getTotalHits,
  getParamConfig,
  updateMyListWills,
  getUserToken
} from "../../utils/functions";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUpOutlined";

import ResultWills from "./ResultWills";
import TextSearch from "./TextSearch";
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";

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
      anchorEl: null,
      totalHits: null,
      anchorElSearch: null,
      label: "",
      openAlert: false,
      message: "",
      field: "",
      order: "",
      value: 0
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
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "desc"
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc"
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "desc"
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "asc"
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "",
          order: ""
        });
        break;
    }
  }
  renderResultStats(stats) {
    if (Boolean(this.state.totalHits)) {
      return (
        <div className="resultStats">
          <div>
            {stats.numberOfResults} testaments sur {this.state.totalHits}{" "}
            correspondent à votre recherche
          </div>
          <div>
            Trier par :{" "}
            <Select value={this.state.value} onChange={this.handleChange}>
              <MenuItem value={0}>pertinence</MenuItem>
              <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
              <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
              <MenuItem value={3}>
                date de rédaction <TrendingUpIcon />
              </MenuItem>
              <MenuItem value={4}>
                date de rédaction <TrendingDownIcon />
              </MenuItem>
              <MenuItem value={5}>Cote (A-Z)</MenuItem>
              <MenuItem value={6}>Cote (Z-A)</MenuItem>
            </Select>
          </div>
        </div>
      );
    } else {
      return (
        <div className="resultStats">
          <div>
            {stats.numberOfResults} testaments correspondent à votre recherche
          </div>
          <div>
            Trier par :{" "}
            <Select value={this.state.value} onChange={this.handleChange}>
              <MenuItem value={0}>pertinence</MenuItem>
              <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
              <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
              <MenuItem value={3}>
                date de rédaction <TrendingUpIcon />
              </MenuItem>
              <MenuItem value={4}>
                date de rédaction <TrendingDownIcon />
              </MenuItem>
              <MenuItem value={5}>Cote (A-Z)</MenuItem>
              <MenuItem value={6}>Cote (Z-A)</MenuItem>
            </Select>
          </div>
        </div>
      );
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
      <div className="results" key={0}>
        <div className="main-container">
          <div className="searchBar">
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

                <Popper
                  id={id}
                  open={open}
                  anchorEl={this.state.anchorEl}
                  placement="bottom-end"
                >
                  <div className="popper">
                    <p className="popperTitle">Aide à la recherche :</p>
                    <p>
                      OR, | : opérateur de disjonction par défault (armée
                      guerre)
                    </p>
                    <p>AND, + : opérateur de conjonction (armée + guerre)</p>
                    <p>NOT, - : opérateur d'exclusion (armée -guerre) </p>
                    <p>+ : opérateur d'inclusion (armée +guerre) </p>
                    <p>* : troncature</p>
                    <p>? : substitution</p>
                    <p>
                      " " : recherche exactment une suite de mots (ou phrase)
                    </p>
                    <p>^ : rendre un terme plus pertinent (armée guerre^2)</p>
                  </div>
                </Popper>
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

                <Popper
                  id={id_search}
                  open={open_search}
                  anchorEl={this.state.anchorElSearch}
                  placement="bottom-end"
                >
                  <Container className="popper">
                    <p className="popperTitle">Sauvegarder votre recherche :</p>
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
              </Grid>
            </Grid>
            <SelectedFilters clearAllLabel="Effacer les critères de recherche" />
          </div>

          {this.state.field === "" && this.state.order === "" ? (
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
              pagination={true}
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
              dataField={this.state.field}
              sortBy={this.state.order}
              componentId="searchResult"
              stream={false}
              pagination={true}
              size={15}
              showResultStats={true}
              infiniteScroll={true}
              loader={<CircularProgress />}
              renderResultStats={this.renderResultStats}
            >
              {({ data, error, loading }) => <ResultWills data={data} />}
            </ReactiveList>
          )}
        </div>

        <div>
          <Tooltip title="Au top" style={{ cursor: "hand" }} interactive>
            <Fab
              id="btTop"
              onClick={this.topFunction}
              aria-label="Top"
              className="topButton"
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
              className="info"
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className="message">
                  <InfoIcon className="icon" />
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
                  <CloseIcon className="icon" />
                </IconButton>
              ]}
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

export default Results;
