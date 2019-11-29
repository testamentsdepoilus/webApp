import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { createStyled, createElementFromHTML } from "../utils/functions";
import { Breadcrumbs, Paper, Link, Typography, Grid } from "@material-ui/core";
import NewLine from "@material-ui/icons/SubdirectoryArrowLeftOutlined";
import SpaceLineIcon from "@material-ui/icons/FormatLineSpacingOutlined";
import SpaceBarIcon from "@material-ui/icons/SpaceBarOutlined";
import ImageIIF from "../utils/ImageIIIF";
import { createPage } from "../components/WillDisplay";
import classNames from "classnames";

const Styled = createStyled(theme => ({
  paper: {
    width: 450,
    padding: theme.spacing(2),
    fontFamily: [
      "Fira Sans",
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
    fontSize: 18,
    color: "#212121",
    backgroundColor: "#FAFAFA",
    textAlign: "justify"
  },
  title: {
    fontFamily: [
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
    fontSize: 20,
    fontStyle: "oblique",
    fontWeight: 600,
    textAlign: "center"
  },
  linkPage: {
    paddingLeft: 15,
    color: "#212121",
    fontSize: 18,
    fontWeight: 500
  },
  selectedLink: {
    fontWeight: 600,
    color: "#0091EA"
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
  }
}));

function createPageMenu(pages, idx, handleClick) {
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

class WillCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: [0, 0, 0],
      type: "image"
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handlePageClick(i) {
    return function(event) {
      if (event.target.getAttribute("value") !== this.state.idx) {
        let idx_ = this.state.idx;
        idx_[i] = event.target.getAttribute("value");
        this.setState({
          idx: idx_
        });
      }
    }.bind(this);
  }

  handleMenuClick(event) {
    const types = ["image", "transcription", "edition"];
    this.setState({
      type: types[event.target.getAttribute("value")]
    });
  }

  componentDidMount() {
    /*let cur_idx = this.props.data["will_pages"].findIndex(item =>
      isEqual(item["page_type"], this.props.cur_page)
    );
    if (cur_idx !== -1) {
      this.setState({
        idx: cur_idx
      });
    } else {
      cur_idx = 0;
    }*/

    //document.getElementById(String(cur_idx)).focus();
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
    const totalItem = this.props.data.length;
    let output = (
      <Styled>
        {({ classes }) => (
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={5}
          >
            <Grid item>
              <Breadcrumbs aria-label="Breadcrumb">
                <Link
                  id={0}
                  value={0}
                  component="button"
                  color="inherit"
                  href="#"
                  onClick={this.handleMenuClick}
                  className={
                    this.state.type === "image"
                      ? classNames(classes.linkPage, classes.selectedLink)
                      : classes.linkPage
                  }
                >
                  Image
                </Link>
                <Link
                  id={1}
                  value={1}
                  component="button"
                  color="inherit"
                  href="#"
                  onClick={this.handleMenuClick}
                  className={
                    this.state.type === "transcription"
                      ? classNames(classes.linkPage, classes.selectedLink)
                      : classes.linkPage
                  }
                >
                  Transcription
                </Link>
                <Link
                  id={2}
                  value={2}
                  component="button"
                  color="inherit"
                  href="#"
                  onClick={this.handleMenuClick}
                  className={
                    this.state.type === "edition"
                      ? classNames(classes.linkPage, classes.selectedLink)
                      : classes.linkPage
                  }
                >
                  Edition
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Grid
                container
                alignItems="flex-start"
                justify="center"
                direction="row"
                spacing={2}
              >
                {this.props.data.map((hit, i) => {
                  return (
                    <Grid item key={i * 100} sm={12 / totalItem}>
                      <Grid
                        key={i * 10}
                        container
                        justify="center"
                        alignItems="center"
                        direction="column"
                        spacing={2}
                      >
                        <Grid key={1} item>
                          <Typography className={classes.title}>
                            {hit["name"]}
                          </Typography>
                        </Grid>
                        <Grid key={2} item>
                          {createPageMenu(
                            hit["will"],
                            this.state.idx[i],
                            this.handlePageClick(i)
                          )}
                        </Grid>
                      </Grid>

                      <Grid key={3} item>
                        {this.state.type === "image" ? (
                          <div>
                            <Typography className={classes.title}>
                              Image
                            </Typography>
                            <Paper className={classes.paper}>
                              <ImageIIF
                                url={
                                  hit["will"][this.state.idx[i]]["picture_url"]
                                }
                                id={hit["id"]}
                              />
                            </Paper>
                          </div>
                        ) : (
                          createPage(
                            hit["will"],
                            this.state.idx[i],
                            this.state.type
                          )
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Styled>
    );

    return output;
  }
}

export default WillCompare;
