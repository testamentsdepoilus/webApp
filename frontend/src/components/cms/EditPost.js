import React, { Component } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
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
  IconButton,
  NativeSelect,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

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
      message: "",
      openAlert: false,
      openDialog: false,
      order: props.data._source["order"],
    };

    this.type_title = ["Article", "Actualité", "A propos"];
  }

  handleOrderChange = (event) => {
    this.setState({
      order: parseInt(event.target.value, 10),
    });
  };

  onEditorStateResumeChange = (editStateSummary) => {
    this.setState({
      editStateSummary: editStateSummary,
    });
  };

  onEditorStateDetailChange = (editStateDetail) => {
    this.setState({
      editStateDetail: editStateDetail,
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

    const detail_raw = this.state.editStateDetail.hasOwnProperty("blocks")
      ? this.state.editStateDetail
      : convertToRaw(this.state.editStateDetail.getCurrentContent());
    const resume_raw = this.state.editStateSummary.hasOwnProperty("blocks")
      ? this.state.editStateSummary
      : convertToRaw(this.state.editStateSummary.getCurrentContent());

    const found_detail = detail_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });

    const found_resume = resume_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });

    const cur_order = parseInt(this.props.data._source["order"], 10);
    const new_order = parseInt(this.state.order, 10);
    if (this.state.title) {
      const today = new Date();

      let ids = [this.props.data["_id"]];
      let doc = [
        {
          title: this.state.title,
          summary: Boolean(found_resume) ? draftToHtml(resume_raw) : "",
          detail: Boolean(found_detail) ? draftToHtml(detail_raw) : "",
          type: parseInt(this.props.data._source["type"], 10),
          author: this.state.author,
          created: today,
          order: new_order,
        },
      ];
      if ([1, 3].includes(parseInt(this.props.data._source["type"], 10))) {
        doc[0]["order"] = new_order;

        if (cur_order > new_order) {
          this.props.favorisList
            .slice(new_order - 1, cur_order - 1)
            .forEach((item) => ids.push(item._id));

          for (let i = 0; i < ids.length - 1; i++) {
            doc.push({ order: new_order + i + 1 });
          }
        } else {
          this.props.favorisList
            .slice(cur_order, new_order)
            .forEach((item) => ids.push(item._id));

          for (let i = 0; i < ids.length - 1; i++) {
            doc.push({
              order: cur_order + i,
            });
          }
        }
      }
      const req = {
        id: ids,
        doc: doc,
      };

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
    }
  };

  handleAlertClose = (event) => {
    this.setState({
      openAlert: false,
      message: "",
    });
    document.location.reload();
  };

  handleDisplay = (event) => {
    this.setState({
      openDialog: true,
    });
  };

  handleClose = (event) => {
    this.setState({
      openDialog: false,
    });
  };

  convertToHtml = (object) => {
    const obj_raw = object.hasOwnProperty("blocks")
      ? object
      : convertToRaw(object.getCurrentContent());

    const found_obj = obj_raw["blocks"].find((item) => {
      return item["text"].trim().length > 0;
    });
    return Boolean(found_obj) ? draftToHtml(obj_raw) : "";
  };

  componentDidMount() {
    this.setState({
      author: this.props.data._source["author"],
      title: this.props.data._source["title"],
    });
  }

  render() {
    let option = [];

    for (let i = 1; i < this.props.favorisList.length + 1; i++) {
      option.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
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
          <Box display="flex" justifyContent="flex-end">
            {this.props.backButton}
          </Box>
          <h1 className="heading">
            <i class="fas fa-file-medical"></i> Modifier un contenu
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
                  {
                    this.type_title[
                      parseInt(this.props.data._source["type"], 10) - 1
                    ]
                  }
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
                  className="input"
                />
              </Grid>
              {[1, 3].includes(
                parseInt(this.props.data._source["type"], 10)
              ) ? (
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
                id="editSummary_id"
                defaultEditorState={this.state.editStateSummary}
                wrapperClassName="demoWrapper"
                editorClassName="demoEditor"
                onChange={this.onEditorStateResumeChange}
                toolbar={{
                  image: {
                    alt: { present: true, mandatory: false },
                  },
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
                    alt: { present: true, mandatory: false },
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
          aria-labelledby="simple-modal-dialog"
          open={this.state.openDialog}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle id="dialog-display-post">
            <IconButton aria-label="close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Grid container direction="column" spacing={2}>
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
                      __html: this.convertToHtml(this.state.editStateSummary),
                    }}
                  ></div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Typography>Détail :</Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.convertToHtml(this.state.editStateDetail),
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
