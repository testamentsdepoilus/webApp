import React from "react";
import { ReactiveList, SelectedFilters } from "@appbaseio/reactivesearch";

import {
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
  MenuItem,
  Box,
} from "@material-ui/core";
import {
  getTotalHits,
  getParamConfig,
  updateMyListWills,
  getUserToken,
} from "../../utils/functions";

import ResultWills from "./ResultWills";
import TextSearch from "./TextSearch";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";

// Up to top page click

window.onscroll = function () {
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
      value: 0,
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

  topFunction = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  handleHelpOpen(event) {
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
      anchorElSearch: null,
    });
  }

  handleHelpClose(event) {
    this.setState({
      anchorEl: null,
    });
  }

  handleSearchOpen(event) {
    this.setState({
      anchorElSearch: this.state.anchorElSearch ? null : event.currentTarget,
      anchorEl: null,
    });
  }

  handleSearchClose(event) {
    this.setState({
      anchorElSearch: null,
      openAlert: false,
    });
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "asc",
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "desc",
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc",
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "desc",
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "asc",
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "desc",
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "",
          order: "",
        });
        break;
    }
  }
  renderResultStats(stats) {
    if (Boolean(this.state.totalHits)) {
      return (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box className="countResults">
            {stats.numberOfResults} testaments sur {this.state.totalHits}{" "}
            correspondent à votre recherche
          </Box>
          <Box display="flex" className="sort_results">
            <Box>
              <label className="fontWeightBold">Trier par </label>
            </Box>
            <Select
              className="select"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem className="sortBy" value={0}>
                pertinence
              </MenuItem>
              <MenuItem className="sortBy" value={1}>
                nom de famille (A-Z)
              </MenuItem>
              <MenuItem className="sortBy" value={2}>
                nom de famille (Z-A)
              </MenuItem>
              <MenuItem className="sortBy" value={3}>
                date de rédaction <i className="fas fa-long-arrow-alt-up"></i>
              </MenuItem>
              <MenuItem className="sortBy" value={4}>
                date de rédaction <i className="fas fa-long-arrow-alt-down"></i>
              </MenuItem>
              <MenuItem className="sortBy" value={5}>
                Cote (A-Z)
              </MenuItem>
              <MenuItem className="sortBy" value={6}>
                Cote (Z-A)
              </MenuItem>
            </Select>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box className="countResults">
            {stats.numberOfResults} testaments correspondent à votre recherche
          </Box>
          <Box display="flex" className="sort_results">
            <Box>
              <label className="fontWeightBold">Trier par </label>
            </Box>
            <Select
              className="select"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem className="sortBy" value={0}>
                pertinence
              </MenuItem>
              <MenuItem className="sortBy" value={1}>
                nom de famille (A-Z)
              </MenuItem>
              <MenuItem className="sortBy" value={2}>
                nom de famille (Z-A)
              </MenuItem>
              <MenuItem className="sortBy" value={3}>
                date de rédaction <i className="fas fa-long-arrow-alt-up"></i>
              </MenuItem>
              <MenuItem className="sortBy" value={4}>
                date de rédaction <i className="fas fa-long-arrow-alt-down"></i>
              </MenuItem>
              <MenuItem className="sortBy" value={5}>
                Cote (A-Z)
              </MenuItem>
              <MenuItem className="sortBy" value={6}>
                Cote (Z-A)
              </MenuItem>
            </Select>
          </Box>
        </Box>
      );
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSearchSave(e) {
    const myBackups_ = JSON.parse(localStorage.myBackups);
    let mySearches_ = Boolean(myBackups_.mySearches)
      ? myBackups_.mySearches
      : [];

    const idx = mySearches_.findIndex((item) => {
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

    if (idx === -1 && label_.length > 0) {
      mySearches_.push({
        label: label_,
        url: document.location.href,
      });
      myBackups_["mySearches"] = mySearches_;
      const newItem = {
        email: this.userToken.email,
        myBackups: myBackups_,
      };
      updateMyListWills(newItem).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("myBackups", JSON.stringify(myBackups_));
          this.setState({
            anchorElSearch: null,
            label: "",
            openAlert: true,
            message: "Votre recherche a bien été enregistrée !",
          });
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          console.log("err :", err);
          this.setState({
            openAlert: true,
            message: "Votre recherche n'a pas été enregistrée !",
          });
        }
      });
    } else if (idx > -1) {
      this.setState({
        anchorElSearch: null,
        label: "",
        openAlert: true,
        message:
          "Votre recherche est déjà enregistrée sous le label " +
          mySearches_[idx].label +
          " !",
      });
    }
  }

  componentDidMount() {
    getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills")
    )
      .then((res) => {
        const totalHits = res;
        const total =
          typeof totalHits === "object" ? totalHits.value : totalHits;

        this.setState({
          totalHits: total,
        });
      })
      .catch((e) => {
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
        <div className="main-container">
          <div className="searchBar">
            <Grid container direction="row" spacing={1}>
              <Grid className="searchByKwd" item xs={11} md={10}>
                <TextSearch />
              </Grid>
              <Grid item xs={1} md={2} className="d-flex align-items-end">
                <Box display="flex" mb={1}>
                  <Button
                    className="iconButton"
                    aria-describedby={id}
                    onClick={this.handleHelpOpen}
                    style={{ cursor: "help" }}
                  >
                    <i className="fas fa-question-circle"></i>
                  </Button>

                  <Popper
                    elevation={0}
                    id={id}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    placement="bottom-end"
                  >
                    <div className="tooltip">
                      <p className="popperTitle">Aide à la recherche :</p>
                      <p>
                        Vous pouvez saisir un mot ou plusieurs mots séparés par
                        des espaces. Dans ce cas, la recherche va retourner tous
                        les testaments contenant l’un ou l’autre de ces mots
                        (équivalent de l’opérateur OR ou du caractère |). La
                        recherche est insensible à la casse.
                      </p>
                      <p>
                        Le caractère ^ permet de donner plus de poids dans la
                        recherche au mot qui le précède (exemple : armée
                        guerre^2)
                      </p>
                      <p>
                        L’opérateur AND ou + peut être utilisé. Dans ce cas, la
                        recherche va retourner tous les testaments contenant
                        tous les mots saisis (armée + guerre).{" "}
                      </p>
                      <p>
                        Si vous cherchez une expression précise, les caractères
                        " " permettent de rechercher exactement une suite de
                        mots (exemple "au poste de commandement").
                      </p>
                      <p>
                        Le caractère * (troncature) peut être utilisé pour
                        masquer un nombre de caractères allant de 0 à n dans un
                        mot.
                      </p>
                      <p>Le caractère ? (masque) masque un seul caractère.</p>
                      <p>
                        L’opérateur NOT (ou le caractère -), permet d'exclure le
                        mot qui le suit (armée NOT guerre ; armée -guerre).
                      </p>
                    </div>
                  </Popper>

                  {Boolean(this.userToken) ? (
                    <Tooltip
                      title="Sauvegarder la recherche dans mes favoris"
                      interactive
                      arrow={true}
                    >
                      <Button
                        className="iconButton"
                        aria-describedby="save"
                        onClick={this.handleSearchOpen}
                        style={{ cursor: "hand" }}
                      >
                        <i className="far fa-save"></i>
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Connectez-vous pour sauvegarder votre recherche !"
                      arrow={true}
                    >
                      <Button
                        className="disabled iconButton"
                        aria-describedby="save"
                      >
                        <i className="far fa-save"></i>
                      </Button>
                    </Tooltip>
                  )}

                  <Popper
                    id={id_search}
                    open={open_search}
                    anchorEl={this.state.anchorElSearch}
                    placement="bottom-end"
                  >
                    <Container className="saveSearchForm bg-mid-gray">
                      <div className="fontWeightRegular label">
                        Sauvegarder votre recherche
                      </div>
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
                            className="input"
                            name="label"
                            placeholder="Donner un nom à votre recherche"
                            onChange={this.onChange}
                            value={this.state.label}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            id="btSave"
                            color="secondary"
                            className="submit button fontWeightMedium plain bg-secondaryLight"
                            onClick={this.handleSearchSave}
                          >
                            Sauvegarder
                          </Button>
                        </Grid>
                      </Grid>
                    </Container>
                  </Popper>
                </Box>
              </Grid>
            </Grid>

            <SelectedFilters
              className="criteres_selected"
              clearAllLabel="Effacer les critères de recherche"
            />
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
                  "unite",
                ],
              }}
              className="searchResults"
              dataField=""
              componentId="searchResult"
              stream={false}
              pagination={true}
              innerClass={{
                pagination: "pagination",
              }}
              size={15}
              showResultStats={true}
              infiniteScroll={true}
              URLParams
              loader={<CircularProgress />}
              renderResultStats={this.renderResultStats}
              renderNoResults={function () {
                return (
                  <p className="text-error paddingContainer">
                    Aucun résultat ne correspond à cette recherche.
                  </p>
                );
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
                ],
              }}
              className="searchResults"
              dataField={this.state.field}
              sortBy={this.state.order}
              componentId="searchResult"
              stream={false}
              pagination={true}
              size={15}
              innerClass={{
                pagination: "pagination",
              }}
              showResultStats={true}
              infiniteScroll={true}
              URLParams
              loader={<CircularProgress />}
              renderResultStats={this.renderResultStats}
              renderNoResults={function () {
                return <p>Aucun résultat ne correspond à cette recherche.</p>;
              }}
            >
              {({ data, error, loading }) => <ResultWills data={data} />}
            </ReactiveList>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Tooltip
              title="Haut de page"
              style={{ cursor: "hand" }}
              interactive
            >
              <Button
                className="mr-2"
                id="btTop"
                onClick={this.topFunction}
                aria-label="Remonter en haut de la page"
              >
                <i className="fas fa-level-up-alt"></i>
              </Button>
            </Tooltip>
          </Box>
        </div>

        <div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            key="topCenter"
            open={this.state.openAlert}
            onClose={this.handleSearchClose}
            autoHideDuration={500000}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
          >
            <SnackbarContent
              aria-describedby="client-snackbar"
              message={
                <Box display="flex" alignItems="center" id="client-snackbar">
                  <InfoIcon className="icon" />
                  <div>{this.state.message}</div>
                </Box>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleSearchClose}
                >
                  <CloseIcon className="icon" />
                </IconButton>,
              ]}
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

export default Results;
