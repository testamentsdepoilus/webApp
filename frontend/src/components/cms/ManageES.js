import React, { Component } from "react";
import {
  Grid,
  Breadcrumbs,
  Link,
  MenuList,
  Container,
  Box,
  Button,
  InputLabel,
  NativeSelect,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { getESHost, getParamConfig, updateESPost } from "../../utils/functions";
import { Link as RouterLink } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";

class ManageES extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: "add",
      title: {
        add: "Ajouter ou mettre à jour des testaments ou des notices",
        create: "Créer un nouveau index à partir d'un fichier mapping",
        remove: "Supprimer les données et l'index",
      },
      bt_title: {
        add: "Ajouter / Mise à jour",
        create: "Créer",
        remove: "Supprimer",
      },
      host: getParamConfig("es_host"),
      refIndex: 1,
      files: null,
      open: false,
      loading: false,
      openAlert: false,
      message: "",
    };
    this.handleSelectItem = this.handleSelectItem.bind(this);
  }

  handleDialogClose = (event) => {
    this.setState({
      open: false,
      openAlert: false,
    });
  };

  handleSelectItem(event) {
    this.setState({
      selectedId: event.target.id,
    });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  updateFileDisplay = (e) => {
    let preview = document.querySelector(".preview");
    let input = document.getElementById("file_uploads");
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    var para = document.createElement("p");

    if (curFiles.length === 0) {
      para.textContent = "Aucun fichier TEI sélectionné";
      preview.appendChild(para);
    } else {
      if (curFiles.length === 1) {
        para.textContent = curFiles[0].name;
      } else {
        para.textContent = curFiles.length + " fichiers sélectionnés";
      }
      preview.appendChild(para);
      this.setState({
        files: curFiles,
      });
    }
  };

  handleIndexChange = (event) => {
    this.setState({
      refIndex: parseInt(event.target.value, 10),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.state.selectedId === "remove") {
      this.setState({
        open: true,
        loading: true,
      });
    } else {
      this.handleUpdatePost();
    }
  };

  handleDialogConfirm = (event) => {
    this.handleUpdatePost();
  };

  handleUpdatePost = () => {
    this.setState({
      open: false,
      loading: true,
    });
    const indexNames = [
      "tdp_wills",
      "tdp_testators",
      "tdp_places",
      "tdp_military_unit",
    ];
    let formData = new FormData();
    let input = document.getElementById("file_uploads");
    if (input !== null) {
      for (const file of input.files) {
        formData.append("myFiles", file);
      }
    }

    formData.append("host", this.state.host);
    formData.append("action", this.state.selectedId);
    formData.append("index", indexNames[this.state.refIndex - 1]);

    /*const req = {
      host: this.state.host,
      action: this.state.selectedId,
      files: formData,
      index: indexNames[this.state.refIndex - 1],
    };*/

    updateESPost(formData).then((res) => {
      if (res.status === 200) {
        this.setState({
          openAlert: true,
          message: res.mess,
          loading: false,
        });
      } else {
        this.setState({
          openAlert: true,
          message: res.err ? res.err : "Erreur: connexion serveur a échoué !",
          loading: false,
        });
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    let input = document.getElementById("file_uploads");
    if (input !== null) {
      input.addEventListener("change", this.updateFileDisplay);
      input.style.opacity = 0;
    }
  }

  componentDidMount() {
    let input = document.getElementById("file_uploads");
    if (input !== null) {
      input.addEventListener("change", this.updateFileDisplay);
      input.style.opacity = 0;
    }

    getESHost().then((res) => {
      if (Boolean(res)) {
        this.setState({
          host: res,
        });
      }
    });
  }

  render() {
    return (
      <div className="configES cms">
        <Breadcrumbs
          separator={<i className="fas fa-caret-right"></i>}
          aria-label="Breadcrumb"
          className="breadcrumbs"
        >
          <Link
            id="home"
            key={0}
            color="inherit"
            href={getParamConfig("web_url") + "/accueil"}
          >
            Accueil
          </Link>
          <Link
            id="espace"
            key={1}
            color="inherit"
            component={RouterLink}
            to="/espace"
          >
            Mon espace
          </Link>
          <div>Administration</div>
          <div>Gestion ES</div>
        </Breadcrumbs>

        <div className="bg-white paddingContainer">
          <h3>Gestion et indexation de données ES (ElasticSearch)</h3>
          <div>
            <Grid container direction="row" justify="center" spacing={0}>
              <Grid item xs={12} md={2}>
                <MenuList id="menuList">
                  <MenuItem id="add" onClick={this.handleSelectItem}>
                    Ajouter ou modifier
                  </MenuItem>
                  <MenuItem
                    id="create"
                    onClick={this.handleSelectItem}
                    className={
                      this.state.selectedId === "create" ? "active" : ""
                    }
                  >
                    Créer
                  </MenuItem>
                  <MenuItem
                    id="remove"
                    onClick={this.handleSelectItem}
                    className={
                      this.state.selectedId === "remove" ? "active" : ""
                    }
                  >
                    Supprimer
                  </MenuItem>
                </MenuList>
              </Grid>

              <Grid item xs={12} md={10}>
                <Container maxWidth="xs">
                  <div>
                    {this.state.title[this.state.selectedId]}
                    <form
                      id="configESForm"
                      noValidate
                      className="form"
                      onSubmit={this.onSubmit}
                    >
                      <div className="select_index">
                        <InputLabel id="order-select-label">
                          Choix d'index
                        </InputLabel>
                        <NativeSelect
                          id="refIndex"
                          className="order"
                          variant="outlined"
                          value={this.state.refIndex}
                          name="order"
                          onChange={this.handleIndexChange}
                        >
                          <option value={1} key={1}>
                            tdp_wills
                          </option>
                          <option value={2} key={2}>
                            tdp_testators
                          </option>
                          <option value={3} key={3}>
                            tdp_places
                          </option>
                          <option value={4} key={4}>
                            tdp_units
                          </option>
                        </NativeSelect>
                      </div>
                      {this.state.selectedId === "add" ? (
                        <div>
                          <p>Sélectionner les fichiers TEI à importer (.xml)</p>
                          <Grid container direction="row" spacing={1}>
                            <Grid item xs={4}>
                              <label htmlFor="file_uploads">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  component="span"
                                  className="bt_upload"
                                >
                                  Chargement
                                </Button>
                              </label>
                              <input
                                type="file"
                                id="file_uploads"
                                name="myFiles"
                                accept=".xml"
                                multiple
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <div className="preview">
                                <p>Aucun fichier sélectionné pour le moment</p>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      ) : (
                        ""
                      )}

                      <Box pt={1} display="flex" justifyContent="flex-end">
                        <Button
                          id={"bt_" + this.state.selectedId}
                          className="submit button fontWeightMedium plain bg-secondaryLight"
                          type="submit"
                        >
                          {this.state.bt_title[this.state.selectedId]}
                        </Button>
                        <div className="progress">
                          <Fade
                            in={this.state.loading}
                            style={{
                              transitionDelay: this.state.loading
                                ? "800ms"
                                : "0ms",
                            }}
                            unmountOnExit
                          >
                            <CircularProgress />
                          </Fade>
                        </div>
                      </Box>
                    </form>
                  </div>
                </Container>
              </Grid>
            </Grid>
          </div>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Souhaitez-vous vraiment supprimer l'index et toutes les données ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleDialogClose}
              className="button plain primaryMain"
            >
              Annuler
            </Button>
            <Button
              onClick={this.handleDialogConfirm}
              className="button plain bg-danger"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          key="topCenter"
          open={this.state.openAlert}
          onClose={this.handleDialogClose}
          autoHideDuration={3000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

export default ManageES;
