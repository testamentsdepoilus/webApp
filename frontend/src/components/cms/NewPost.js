import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { publish, updatePost, getParamConfig } from "../../utils/functions";
import { Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Breadcrumbs,
  Link,
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  NativeSelect,
  Paper,
  DialogTitle,
  DialogContent,
  Dialog,
  InputLabel,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default class NewPost extends Component {
  constructor(props) {
    super();
    this.state = {
      editorStateDetail: EditorState.createEmpty(),
      editorStateResume: EditorState.createEmpty(),
      title: "",
      fileInput: null,
      label: null,
      in_image: null,
      url_image: "",

      author: "",
      message: "",
      openAlert: false,
      openDialog: false,
      order: props.favorisList.length + 1,
    };
    this.handleDisplay = this.handleDisplay.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.type_title = ["Article", "Actualité", "A propos"];
  }

  handleOrderChange = (event) => {
    this.setState({
      order: parseInt(event.target.value, 10),
    });
  };

  handleTypeChange = (event) => {
    this.setState({
      type: parseInt(event.target.value, 10),
    });
  };

  onEditorStateResumeChange = (editorState) => {
    this.setState({
      editorStateResume: editorState,
    });
  };

  onEditorStateDetailChange = (editorState) => {
    this.setState({
      editorStateDetail: editorState,
    });
  };

  handleFileChange = (event) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const in_file = event.target.files[0];
      const image_name = event.target.files[0]["name"];
      reader.onloadend = function (e) {
        this.setState({
          in_image: e.target.result,
          url_image: image_name,
          out_image: "",
          fileInput: in_file,
          label: "",
        });
      }.bind(this);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleChangeText = (e) => {
    this.setState({
      url_image: e.target.value,
      in_image: null,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const detail_raw = convertToRaw(
      this.state.editorStateDetail.getCurrentContent()
    );
    const resume_raw = convertToRaw(
      this.state.editorStateResume.getCurrentContent()
    );
    const found_detail = detail_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });

    const found_resume = resume_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });
    const type = parseInt(this.props.type, 10);
    if (this.state.title) {
      const item = {
        title: this.state.title,
        summary: Boolean(found_resume) ? draftToHtml(resume_raw) : "",
        detail: Boolean(found_detail) ? draftToHtml(detail_raw) : "",
        type: type,
        author: this.state.author,
        selected: false,
        created: new Date(),
      };
      if ([1, 3].includes(type)) {
        item["order"] = parseInt(this.state.order, 10);
      }

      publish(item).then((res) => {
        if (res.status === 200) {
          if ([1, 3].includes(type)) {
            const ids = this.props.favorisList
              .slice(this.state.order - 1)
              .map((item) => item._id);
            let doc = [];
            for (let i = 0; i < ids.length; i++) {
              doc.push({ order: this.state.order + i + 1 });
            }
            const req = {
              id: ids,
              doc: doc,
            };
            if (ids.length > 0) {
              updatePost(req).then((res) => {
                if (res.status === 200) {
                  this.setState({
                    openAlert: true,
                    message: res.mess,
                  });
                } else {
                  this.setState({
                    openAlert: true,
                    message: res.err,
                  });
                }
              });
            } else {
              this.setState({
                openAlert: true,
                message: res.mess,
              });
            }
          } else {
            this.setState({
              openAlert: true,
              message: res.mess,
            });
          }
        } else {
          this.setState({
            openAlert: true,
            message: res.err,
          });
        }
      });
    }
  };

  handleAlertClose() {
    this.setState({
      openAlert: false,
      message: "",
    });
    document.location.reload();
  }

  handleDisplay() {
    this.setState({
      openDialog: true,
    });
  }

  handleClose() {
    this.setState({
      openDialog: false,
    });
  }

  convertToHtml = (object) => {
    const obj_raw = convertToRaw(object.getCurrentContent());

    const found_obj = obj_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });
    return Boolean(found_obj) ? draftToHtml(obj_raw) : "";
  };

  render() {
    let option = [];
    for (let i = 1; i < this.props.favorisList.length + 2; i++) {
      option.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    return (
      <div className="newPost cms">
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
          <div>Gestion de contenus</div>
        </Breadcrumbs>

        <div className="bg-white paddingContainer">
          <Box display="flex" justifyContent="flex-end">
            {this.props.backButton}
          </Box>
          <h1 className="heading">
            <i class="fas fa-file-medical"></i> Ajouter un nouveau post
          </h1>

          <form className="form" noValidate onSubmit={this.onSubmit}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  id="author"
                  variant="outlined"
                  fullWidth
                  label="Auteur"
                  type="author"
                  name="author"
                  autoFocus
                  value={this.state.author}
                  onChange={this.onChange}
                  className="input"
                />
              </Grid>
              <Grid item>
                <Typography>
                  {this.type_title[parseInt(this.props.type, 10) - 1]}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  id="title"
                  variant="outlined"
                  fullWidth
                  label="Titre"
                  type="title"
                  name="title"
                  autoFocus
                  value={this.state.title}
                  onChange={this.onChange}
                  className="textField"
                />
              </Grid>
              {[1, 3].includes(parseInt(this.props.type, 10)) ? (
                <Grid item>
                  <InputLabel id="order-select-label">
                    Ordre d'affichage
                  </InputLabel>
                  <NativeSelect
                    id="order"
                    className="order"
                    variant="outlined"
                    value={this.state.order}
                    name="order"
                    onChange={this.handleOrderChange}
                  >
                    {option}
                  </NativeSelect>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <div>
              <h2>Résumé</h2>
              <Editor
                id="editorStateResume"
                editorStateResume={this.state.editorStateResume}
                wrapperClassName="demoWrapper"
                editorClassName="demoEditor"
                onEditorStateChange={this.onEditorStateResumeChange}
                toolbar={{
                  image: {
                    alt: { present: true, mandatory: true },
                  },
                }}
              />
            </div>
            <div>
              <h2>Contenu</h2>
              <Editor
                id="editorStateDetail"
                editorStateDetail={this.state.editorStateDetail}
                wrapperClassName="demoWrapper"
                editorClassName="demoEditor"
                onEditorStateChange={this.onEditorStateDetailChange}
                toolbar={{
                  image: {
                    alt: { present: true, mandatory: true },
                  },
                }}
              />
            </div>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              className="submitButtons"
            >
              <Grid item>
                <Button
                  id="btPublication"
                  variant="contained"
                  color="primary"
                  className="submit button fontWeightMedium plain bg-secondaryMain"
                  type="submit"
                >
                  Publier
                </Button>
              </Grid>
              <Grid item>
                <Button
                  id="btDisplay"
                  variant="contained"
                  color="primary"
                  className="submit button fontWeightMedium plain bg-secondaryLight"
                  onClick={this.handleDisplay}
                >
                  Visualiser
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>

        <this.props.alertMessage
          message={this.state.message}
          openAlert={this.state.openAlert}
          handleClose={this.handleAlertClose}
        />
        <Dialog
          aria-labelledby="simple-modal-dialog"
          fullWidth={true}
          maxWidth="md"
          open={this.state.openDialog}
          onClose={this.handleClose}
        >
          <DialogTitle id="dialog-display-post">
            <IconButton aria-label="close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Paper>
                  <Typography>Titre : {this.state.title}</Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Typography>Résumé :</Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.convertToHtml(this.state.editorStateResume),
                    }}
                  ></div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Typography>Détail :</Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.convertToHtml(this.state.editorStateDetail),
                    }}
                  ></div>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
