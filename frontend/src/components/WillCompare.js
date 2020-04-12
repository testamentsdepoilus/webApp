import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { createElementFromHTML } from "../utils/functions";
import { Breadcrumbs, Paper, Link, Typography, Grid } from "@material-ui/core";
import NewLine from "@material-ui/icons/SubdirectoryArrowLeftOutlined";
import SpaceLineIcon from "@material-ui/icons/FormatLineSpacingOutlined";
import SpaceBarIcon from "@material-ui/icons/SpaceBarOutlined";
import ImageIIF from "../utils/ImageIIIF";

import Footer from "./Footer";

function createPageMenu(pages, idx, handleClick) {
  let menu = [];
  for (let i = 0; i < pages.length; i++) {
    menu.push(
      <Link
        id={i}
        value={i}
        key={i}
        component="button"
        color="inherit"
        onClick={handleClick}
        className={parseInt(idx, 10) === i ? "selectedLink" : "linkPage"}
      >
        {pages[i]["page_type"].type} {pages[i]["page_type"].id}
      </Link>
    );
  }

  return (
    <Breadcrumbs
      style={{ marginTop: 20, marginBottom: 20 }}
      aria-label="Breadcrumb"
    >
      {menu}
    </Breadcrumbs>
  );
}

function createPage(page, idx, type, nextPage) {
  let output = (
    <div>
      <Paper className={type}>
        {
          <div
            dangerouslySetInnerHTML={{
              __html: page[idx][type],
            }}
          />
        }
        {idx < page.length - 1 ? nextPage : null}
      </Paper>
    </div>
  );

  return output;
}

class WillCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: [0, 0, 0],
      type: "image",
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handlePageClick(i) {
    return function (event) {
      if (event.target.getAttribute("value") !== this.state.idx) {
        let idx_ = this.state.idx;
        idx_[i] = event.target.getAttribute("value");
        this.setState({
          idx: idx_,
        });
      }
    }.bind(this);
  }

  handleMenuClick(event) {
    const types = ["image", "transcription", "edition"];
    this.setState({
      type: types[event.target.getAttribute("value")],
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
      let i = 0;
      for (let item of lbCollection) {
        item.before(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <NewLine
                key={i++}
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
      let i = 0;
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceLineIcon
                key={15 * i++}
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
      let i = 0;
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceBarIcon
                key={100 * i++}
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
      <div className="willCompare">
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
                  this.state.type === "image" ? "selectedLink" : "linkPage"
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
                    ? "selectedLink"
                    : "linkPage"
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
                  this.state.type === "edition" ? "selectedLink" : "linkPage"
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
                      container
                      justify="center"
                      alignItems="center"
                      direction="column"
                      spacing={2}
                    >
                      <Grid item>
                        <Typography className="title">
                          {hit["forename"] + " "}
                          <span className="typoSurname">{hit["surname"]}</span>
                        </Typography>
                      </Grid>
                      <Grid item>
                        {createPageMenu(
                          hit["will"],
                          this.state.idx[i],
                          this.handlePageClick(i)
                        )}
                      </Grid>
                    </Grid>

                    <Grid item>
                      {this.state.type === "image" ? (
                        <div className="image">
                          <Paper>
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
      </div>
    );

    return (
      <div>
        {output}
        <Footer />
      </div>
    );
  }
}

export default WillCompare;
