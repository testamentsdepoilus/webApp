import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import WillDisplay from "./WillDisplay";
import {
  Paper,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  IconButton,
  Tooltip
} from "@material-ui/core";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  createStyled,
  getHitsFromQuery
} from "../utils/functions";
import classNames from "classnames";
import InsertLinkIcon from "@material-ui/icons/InsertLinkOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBackOutlined";

const Styled = createStyled(theme => ({
  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "-apple-system",
    "&:hover, &:focus": {
      color: "#0091EA",
      fontWeight: 600,
      backgroundColor: "#eceff1"
    },
    "&:active": {
      color: "#0091EA",
      fontWeight: 600
    }
  },
  activedLink: {
    color: "#0091EA",
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

function createPageMenu(will_id, pages, idx, handleClick, handeOpenModal) {
  let menu = [];
  const listMenu = {
    page: "Page",
    envelope: "Enveloppe",
    codicil: "Codicille"
  };
  for (let i = 0; i < pages.length; i++) {
    menu.push(
      <Styled key={i}>
        {({ classes }) => (
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Link
                id={i}
                value={i}
                color="inherit"
                component={RouterLink}
                to={
                  "/testament/" +
                  will_id +
                  "/" +
                  pages[i]["page_type"].type +
                  "_" +
                  pages[i]["page_type"].id
                }
                onClick={handleClick}
                className={
                  parseInt(idx, 10) === i
                    ? classNames(classes.typography, classes.selectedLink)
                    : classNames(classes.linkPage, classes.typography)
                }
              >
                {listMenu[pages[i]["page_type"].type]}{" "}
                {pages[i]["page_type"].id}
              </Link>
            </Grid>
            <Grid item>
              <IconButton id={i} onClick={handeOpenModal}>
                <InsertLinkIcon id={i} />
              </IconButton>
            </Grid>
          </Grid>
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

class Will extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: {}
    };

    this.renderFunc = this.renderFunc.bind(this);
  }

  renderFunc() {
    if (this.state.data.length > 0) {
      return (
        <div className="root" key={100}>
          <Paper>
            <WillDisplay
              id={this.state.data[0]["_id"]}
              data={this.state.data[0]._source}
              cur_page={this.state.page}
              createPageMenu={createPageMenu}
            />
          </Paper>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Pas de résultat</h3>
        </div>
      );
    }
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("testament/");
    if (idx !== -1) {
      const url_query = url.substring(idx + 10).split("/");
      const query_id = url_query.length > 0 ? url_query[0] : "";
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          query: {
            term: {
              _id: query_id
            }
          }
        })
      )
        .then(data => {
          this.setState({
            data: data,
            page:
              url_query.length > 1
                ? {
                    type: url_query[1].split("_")[0],
                    id: parseInt(url_query[1].split("_")[1], 10)
                  }
                : {}
          });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }

  render() {
    /*const prevLink = localStorage.uriSearch
      ? "/recherche?" + localStorage.uriSearch.split("?")[1]
      : "/recherche";*/

    /*{
      localStorage.uriSearch ? "Modifier ma recherche" : "Recheche";
    }*/

    const will_link =
      this.state.data.length > 0 ? (
        <Typography color="textPrimary" key={2}>
          {this.state.data[0]._source["will_identifier.name"]}
        </Typography>
      ) : null;

    return (
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            {document.referrer.length > 0 &&
            document.referrer !== document.location.href ? (
              <Tooltip title="Revenir en arrière">
                <IconButton onClick={this.handleBackUp} aria-label="back up">
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </Grid>

          <Grid item>
            <div className="wills_menu">
              <Paper elevation={0}>
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="Breadcrumb"
                >
                  <Link
                    id="search"
                    color="inherit"
                    key={0}
                    component={RouterLink}
                    to="/accueil"
                  >
                    Accueil
                  </Link>
                  {will_link}
                </Breadcrumbs>
              </Paper>
            </div>
          </Grid>
        </Grid>

        <div>{this.renderFunc()}</div>
      </div>
    );
  }
}

export default Will;
