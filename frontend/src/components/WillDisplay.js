import React, { Component } from "react";
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
  IconButton
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
    fontSize: 20
  },

  typography: {
    fontFamily: [
      "Carta Nova Text Regular",
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
    ].join(","),
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
  }
}));

export function createPageMenu(pages, idx, handleClick) {
  let menu = [];
  for (let i = 0; i < pages.length; i++) {
    menu.push(
      <Styled key={i}>
        {({ classes }) => (
          <Link
            id={i}
            value={i}
            component="button"
            color="inherit"
            href="#"
            onClick={handleClick}
            className={
              parseInt(idx) === i
                ? classNames(classes.typography, classes.selectedLink)
                : classNames(classes.linkPage, classes.typography)
            }
          >
            {pages[i]["page_type"].type} {pages[i]["page_type"].id}
          </Link>
        )}
      </Styled>
    );
  }
  return (
    <Breadcrumbs
      style={{ marginTop: 20, marginBottom: 20 }}
      aria-label="Breadcrumb"
    >
      {" "}
      {menu}{" "}
    </Breadcrumbs>
  );
}

export function createPage(page, type) {
  let output = (
    <Styled>
      {({ classes }) => (
        <div>
          <Typography className={classes.title}>{type}</Typography>
          <Paper className={classes.paper}>
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: page[type]
                }}
              />
            }
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
    } else {
      this.setState({
        open: true
      });
    }
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
                    onClick={this.handleExportClick}
                    aria-label="Export"
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid key={2} item>
                  <Paper>
                    <Grid
                      container
                      justify="flex-start"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <img
                          src={
                            getParamConfig("web_host") +
                            "/images/default-testator.png"
                          }
                          alt="testator_icon"
                        />
                      </Grid>
                      <Grid
                        item
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                      >
                        <Typography variant="h5">
                          {this.props.data["will_identifier.name"]}
                        </Typography>
                        <Typography variant="h5">
                          Mort pour la france le ...
                        </Typography>
                        <Typography variant="h5">
                          Testament rédigé le ...
                        </Typography>
                        <Typography variant="h5">
                          Cote aux{" "}
                          {this.props.data["will_identifier.institution"]}{" "}
                          {this.props.data["will_identifier.cote"]}
                        </Typography>
                        <Typography variant="h5">
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
                    </Grid>
                  </Paper>
                </Grid>
                <Grid key={0} item>
                  {createPageMenu(
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
                        this.props.data["will_pages"][cur_idx],
                        "transcription"
                      )}
                    </Grid>
                    <Grid key={12} item sm={4}>
                      {createPage(
                        this.props.data["will_pages"][cur_idx],
                        "edition"
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
