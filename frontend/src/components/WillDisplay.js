import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
  createStyled,
  createElementFromHTML,
  getParamConfig
} from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  IconButton,
  Button
} from "@material-ui/core";
import NewLine from "@material-ui/icons/SubdirectoryArrowLeftOutlined";
import SpaceLineIcon from "@material-ui/icons/FormatLineSpacingOutlined";
import SpaceBarIcon from "@material-ui/icons/SpaceBarOutlined";
import ImageIIF from "../utils/ImageIIIF";
import "../styles/WillDisplay.css";
import classNames from "classnames";
import isEqual from "lodash/isEqual";
import ListAddIcon from "@material-ui/icons/PlaylistAddOutlined";
import ListAddCheckIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";
import Login from "./admin/Login";

const Styled = createStyled(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    textAlign: "justify",
    fontSize: 18
  },

  typography: {
    fontFamily: "-apple-system",

    fontWeight: 600
  },
  title: {
    fontSize: 24,
    fontStyle: "oblique",
    textAlign: "center",
    fontWeight: 600
  },
  linkPage: {
    color: "#212121",
    fontSize: 18,
    fontWeight: 400,
    "&:hover": {
      color: "#0091EA"
    }
  },
  selectedLink: {
    fontWeight: 600,
    color: "#0091EA",
    fontSize: 18
  },
  nextPage: {
    display: "block",
    marginLeft: "90%"
  }
}));

export function createPage(page, idx, type, nextPage) {
  let listTypes = { transcription: "Transcription", edition: "Édition" };
  let output = (
    <Styled>
      {({ classes }) => (
        <div>
          <Typography className={classes.title}>{listTypes[type]}</Typography>
          <Paper className={classes.paper}>
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: page[idx][type]
                }}
              />
            }
            {idx < page.length - 1 ? nextPage : null}
          </Paper>
        </div>
      )}
    </Styled>
  );

  return output;
}
export default class WillDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      cur_page: null
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  handlePageClick(event) {
    if (event.target.getAttribute("value") !== this.state.idx) {
      this.setState({
        idx: event.target.getAttribute("value")
      });
    }
  }

  handleExportClick() {
    const token = sessionStorage.usertoken;
    if (token) {
      // Create an invisible A element
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);

      // Set the HREF to a Blob representation of the data to be downloaded
      a.href = getParamConfig("web_url") + "/files/" + this.props.id + ".xml";

      // Use download attribute to set set desired file name
      a.setAttribute("download", this.props.id + ".xml");

      // Trigger the download by simulating click
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } else {
      alert("il faut se connecter");
      this.setState({
        open: true
      });
    }
  }

  handleNextPage(event) {
    this.setState({
      idx: parseInt(this.state.idx, 10) + 1
    });
  }
  componentDidMount() {
    const cur_idx = this.props.data["will_pages"].findIndex(item => {
      return isEqual(item["page_type"], this.props.cur_page);
    });

    if (cur_idx !== -1) {
      this.setState({
        idx: cur_idx
      });
    }
    let lbCollection = document.getElementsByClassName("lb");
    for (let item of lbCollection) {
      item.before(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <NewLine
              titleAccess="changement de ligne"
              color="primary"
              style={{ cursor: "help" }}
              id="newLine_lb"
            />
          )
        )
      );
    }
    let spaceVerCollection = document.getElementsByClassName("space_vertical");
    for (let item of spaceVerCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceLineIcon
              titleAccess="Marque un espace vertical"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_vertical"
            />
          )
        )
      );
    }
    let spaceHorCollection = document.getElementsByClassName(
      "space_horizontal"
    );
    for (let item of spaceHorCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceBarIcon
              titleAccess="Marque un espace horizontal"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_horizontal"
            />
          )
        )
      );
    }
  }

  componentDidUpdate() {
    const idx = document.location.href.lastIndexOf("&page_type");
    if (idx !== -1) {
      const cur_idx = this.props.data["will_pages"].findIndex(item => {
        return isEqual(item["page_type"], this.props.cur_page);
      });

      if (cur_idx !== -1 && cur_idx !== this.state.idx) {
        window.history.replaceState(
          {},
          document.title,
          document.location.href.substring(0, idx)
        );
        this.setState({
          idx: cur_idx
        });
      }
    }

    if (document.getElementById("newLine_lb") === null) {
      let lbCollection = document.getElementsByClassName("lb");
      for (let item of lbCollection) {
        item.before(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <NewLine
                titleAccess="changement de ligne"
                color="primary"
                style={{ cursor: "help" }}
                id="newLine_lb"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_vertical") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_vertical"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceLineIcon
                titleAccess="Marque un espace vertical"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_vertical"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_horizontal") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_horizental"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceBarIcon
                titleAccess="Marque un espace horizontal"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_horizontal"
              />
            )
          )
        );
      }
    }
  }

  render() {
    const nextPage = (
      <Styled>
        {({ classes }) => (
          <Button
            color="primary"
            title="Page suivante"
            onClick={this.handleNextPage}
            className={classes.nextPage}
          >
            [...]
          </Button>
        )}
      </Styled>
    );
    let output = null;
    if (this.props.data) {
      const cur_idx =
        this.props.data["will_pages"].length <= this.state.idx
          ? 0
          : this.state.idx;

      output = (
        <Styled>
          {({ classes }) => (
            <div>
              <Grid container direction="column" justify="flex-start">
                <Grid key={3} item>
                  <IconButton
                    style={{ marginLeft: "90%" }}
                    id="btExport"
                    aria-label="Export"
                    title="Exporter le testament en format TEI"
                    onClick={this.handleExportClick}
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid key={2} item>
                  <Paper>
                    <Grid container justify="flex-start" alignItems="center">
                      <Grid
                        item
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                        xs={6}
                      >
                        <Typography>
                          {this.props.data["will_identifier.name"]}
                        </Typography>
                        <Typography>Mort pour la france le ...</Typography>
                        <Typography>Testament rédigé le ...</Typography>
                        <Typography>
                          Cote aux{" "}
                          {this.props.data["will_identifier.institution"]}{" "}
                          {this.props.data["will_identifier.cote"]}
                        </Typography>
                        <Typography>
                          {this.props.data[
                            "will_physDesc.support"
                          ][0].toUpperCase() +
                            this.props.data["will_physDesc.support"].slice(1)}
                          , {this.props.data["will_physDesc.handDesc"]},{" "}
                          {this.props.data["will_physDesc.dim"]["width"]}
                          {this.props.data["will_physDesc.dim"]["unit"]} x{" "}
                          {this.props.data["will_physDesc.dim"]["height"]}
                          {this.props.data["will_physDesc.dim"]["unit"]}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                        xs={6}
                      >
                        <Typography variant="h6">
                          Les contributeurs :
                        </Typography>
                        {this.props.data["contributions"].map(
                          (contributor, i) => {
                            return (
                              <Typography key={i}>
                                {" "}
                                {contributor["resp"][0].toUpperCase() +
                                  contributor["resp"].substring(1)}{" "}
                                : {contributor["persName"].join(", ")}
                              </Typography>
                            );
                          }
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid key={0} item>
                  {this.props.createPageMenu(
                    this.props.id,
                    this.props.data["will_pages"],
                    cur_idx,
                    this.handlePageClick
                  )}
                </Grid>
                <Grid key={1} item>
                  <Grid
                    container
                    justify="center"
                    alignItems="flex-start"
                    direction="row"
                    spacing={2}
                  >
                    <Grid key={10} item sm={4}>
                      <Typography className={classes.title}>Image</Typography>
                      <Paper className={classes.paper}>
                        <ImageIIF
                          url={
                            this.props.data["will_pages"][cur_idx][
                              "picture_url"
                            ]
                          }
                          id="willImage"
                        />
                      </Paper>
                    </Grid>
                    <Grid key={11} item sm={4}>
                      {createPage(
                        this.props.data["will_pages"],
                        cur_idx,
                        "transcription",
                        nextPage
                      )}
                    </Grid>
                    <Grid key={12} item sm={4}>
                      {createPage(
                        this.props.data["will_pages"],
                        cur_idx,
                        "edition",
                        nextPage
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
        </Styled>
      );
    }

    return output;
  }
}
