import React, { Component } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getParamConfig, updatePost } from "../../utils/functions";
import { Link as RouterLink } from "react-router-dom";

import {
  TextField,
  Breadcrumbs,
  Box,
  Link,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  NativeSelect,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve(response);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

export default class EditPost extends Component {
  constructor(props) {
    super();
    let content_detail = ContentState.createFromBlockArray(
      convertFromHTML(props.data._source["detail"])
    );
    let content_summary = ContentState.createFromBlockArray(
      convertFromHTML(props.data._source["summary"])
    );
    this.state = {
      editStateDetail:
        props.data._source["detail"].length > 0
          ? EditorState.createWithContent(content_detail)
          : EditorState.createEmpty(),
      editStateSummary:
        props.data._source["summary"].length > 0
          ? EditorState.createWithContent(content_summary)
          : EditorState.createEmpty(),
      author: props.data._source["author"],
      title: props.data._source["title"],
      fileInput: null,
      label: null,
      in_image: null,
      url_image: "",
      type: props.data._source["type"],
      message: "",
      openAlert: false,
      openDialog: false
    };
  }

  handleTypeChange = event => {
    this.setState({
      type: event.target.value
    });
  };
  onEditorStateResumeChange = editStateSummary => {
    this.setState({
      editStateSummary: editStateSummary
    });
  };

  onEditorStateDetailChange = editStateDetail => {
    this.setState({
      editStateDetail: editStateDetail
    });
  };

  handleFileChange = event => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const in_file = event.target.files[0];
      const image_name = event.target.files[0]["name"];
      reader.onloadend = function(e) {
        this.setState({
          in_image: e.target.result,
          url_image: image_name,
          out_image: "",
          fileInput: in_file,
          label: ""
        });
      }.bind(this);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleChangeText = e => {
    this.setState({
      url_image: e.target.value,
      in_image: null
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const detail_raw = this.state.editStateDetail.hasOwnProperty("blocks")
      ? this.state.editStateDetail
      : convertToRaw(this.state.editStateDetail.getCurrentContent());
    const resume_raw = this.state.editStateSummary.hasOwnProperty("blocks")
      ? this.state.editStateSummary
      : convertToRaw(this.state.editStateSummary.getCurrentContent());

    const found_detail = detail_raw["blocks"].find(item => {
      return item["text"].trim().length > 0;
    });

    const found_resume = resume_raw["blocks"].find(item => {
      return item["text"].trim().length > 0;
    });

    if (this.state.title) {
      const today = new Date();
      const item = {
        id: this.props.data["_id"],
        title: this.state.title,
        summary: Boolean(found_resume) ? draftToHtml(resume_raw) : "",
        detail: Boolean(found_detail) ? draftToHtml(detail_raw) : "",
        type: parseInt(this.state.type, 10),
        author: this.state.author,
        created: today
      };

      updatePost(item).then(res => {
        if (res.status === 200) {
          this.setState({
            openAlert: true,
            message: res.mess
          });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        } else {
          this.setState({
            openAlert: true,
            message: res.err
          });
        }
      });
    }
  };

  handleAlertClose = event => {
    this.setState({
      openAlert: false,
      message: ""
    });
  };

  handleDisplay = event => {
    this.setState({
      openDialog: true
    });
  };

  handleClose = event => {
    this.setState({
      openDialog: false
    });
  };

  convertToHtml = object => {
    const obj_raw = object.hasOwnProperty("blocks")
      ? object
      : convertToRaw(object.getCurrentContent());

    const found_obj = obj_raw["blocks"].find(item => {
      return item["text"].trim().length > 0;
    });
    return Boolean(found_obj) ? draftToHtml(obj_raw) : "";
  };

  componentDidMount() {
    this.setState({
      author: this.props.data._source["author"],
      title: this.props.data._source["title"]
    });
  }

  render() {
    let src_img = null;
    if (this.state.in_image) {
      src_img = this.state.in_image;
    } else if (this.state.url_image) {
      src_img = this.state.url_image;
    }

    return (
      <div className="editPost cms">
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
          <Box display="flex" justifyContent="flex-end">{this.props.backButton}</Box>
          <h1 className="heading"><i class="fas fa-file-medical"></i> Modifier un contenu</h1>
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
                <NativeSelect
                  id="type"
                  className="select"
                  variant="outlined"
                  value={this.state.type}
                  name="type"
                  onChange={this.handleTypeChange}
                >
                  <option value={1}>Article</option>
                  <option value={2}>Actualité</option>
                  <option value={3}>A propos</option>
                </NativeSelect>
              </Grid>
            </Grid>

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
              className="input"
            />

            <input
              accept="image/*"
              className="input"
              id="contained-button-file"
              type="file"
              onChange={this.handleFileChange}
            />
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <TextField
                  id="outlined-full-width"
                  label="Image"
                  placeholder="Copie url image ici"
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleChangeText}
                  name="file"
                  value={this.state.url_image}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <label htmlFor="contained-button-file">
                          <Button component="span" className="button">
                            <CloudUploadIcon className="rightIcon" />
                          </Button>
                        </label>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item>
                {src_img ? (
                  <img src={src_img} id="img" alt="toto" className="img" />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <div>
              <h2>Résumé</h2>
              <Editor
                id="editSummary_id"
                defaultEditorState={this.state.editStateSummary}
                wrapperClassName="demoWrapper"
                editorClassName="demoEditor"
                onChange={this.onEditorStateResumeChange}
                toolbar={{
                  image: {
                    uploadCallback: uploadImageCallBack,
                    alt: { present: true, mandatory: true }
                  }
                }}
              />
            </div>
            <div>
              <h2>Contenu</h2>
              <Editor
                id="editDetail_id"
                defaultEditorState={this.state.editStateDetail}
                wrapperClassName="demoWrapper"
                editorClassName="demoEditor"
                onChange={this.onEditorStateDetailChange}
                toolbar={{
                  image: {
                    uploadCallback: uploadImageCallBack,
                    alt: { present: true, mandatory: true }
                  }
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
                  className="submit button fontWeightMedium plain bg-secondaryMain"
                  type="submit"
                >
                  Enregistrer
                </Button>
              </Grid>
              <Grid item>
                <Button
                  id="btDisplay"
                  variant="contained"
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
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.openDialog}
          onClose={this.handleClose}
        >
          <DialogTitle id="dialog-display-post">
            <IconButton aria-label="close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Grid container direction="column" alignItems="center" spacing={3}>
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
                      __html: this.convertToHtml(this.state.editStateSummary)
                    }}
                  ></div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Typography>Détail :</Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.convertToHtml(this.state.editStateDetail)
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
