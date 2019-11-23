import React, { Component } from "react";

import ReactDOMServer from "react-dom/server";
import {
  createStyled,
  createElementFromHTML,
  getParamConfig,
  downloadFile,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";
import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Button,
  Snackbar,
  TextField,
  Link,
  Modal,
  Dialog
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
import { typography } from "@material-ui/system";

const Styled = createStyled(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    textAlign: "justify",
    fontSize: 18,
    margin: "auto"
  },
  name: {
    fontFamily: "-apple-system",
    marginTop: theme.spacing(1),
    fontWeight: 600
  },
  text: {
    fontFamily: "-apple-system",
    marginTop: theme.spacing(1)
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
  },
  urlWill: {
    color: "#0091EA",
    fontSize: 14
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default class TestatorDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wills: []
    };

    this.months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ];
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        _source: ["_id", "will_contents.will_date"],
        query: {
          term: {
            "testator.ref": this.props.id.split("-")[1]
          }
        }
      })
    ).then(hits => {
      this.setState({
        wills: hits
      });
    });
  }

  componentDidUpdate() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        _source: ["_id", "will_contents.will_date"],
        query: {
          term: {
            "testator.ref": this.props.id
          }
        }
      })
    ).then(hits => {
      if (!equalsArray(this.state.wills, hits)) {
        this.setState({
          wills: hits
        });
      }
    });
  }

  render() {
    let output = null;
    if (this.props.data) {
      const testator_uri =
        getParamConfig("web_url") + "/testateur/" + this.props.id;

      let death_date = Boolean(this.props.data["death.date"])
        ? new Date(this.props.data["death.date"])
        : null;

      death_date = Boolean(death_date)
        ? death_date.toLocaleDateString().split("/")
        : null;

      let birth_date = Boolean(this.props.data["birth.date"])
        ? new Date(this.props.data["birth.date"])
        : null;

      birth_date = Boolean(birth_date)
        ? birth_date.toLocaleDateString().split("/")
        : null;

      const will_dates = this.state.wills.map(item => {
        let will_date = Boolean(item._source["will_contents.will_date"])
          ? new Date(item._source["will_contents.will_date"])
          : null;
        will_date = Boolean(will_date)
          ? will_date.toLocaleDateString().split("/")
          : null;
        return will_date;
      });
      console.log("will_dates :", will_dates);
      output = (
        <Styled>
          {({ classes }) => (
            <div>
              <Paper className={classNames(classes.paper)}>
                <Typography className={classes.name}>
                  {this.props.data["persName.fullProseForm"]}
                  {" ("} {Boolean(birth_date) ? birth_date[2] : ""}
                  {"-"}
                  {Boolean(death_date) ? death_date[2] : ""} {")"}
                </Typography>
                <Typography className={classes.text}>
                  {this.props.data["residence.name"]}
                </Typography>
                <Typography className={classes.text}>
                  Né le{" "}
                  {Boolean(birth_date)
                    ? birth_date[0] +
                      " " +
                      this.months[birth_date[1] - 1] +
                      " " +
                      birth_date[2]
                    : ""}{" "}
                  à{" "}
                  {Boolean(this.props.data["birth.place.name"]) ? (
                    <Link target="_blank">
                      {this.props.data["birth.place.name"]}
                    </Link>
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography className={classes.text}>
                  {this.props.data["affiliation.name"][0].toUpperCase() +
                    this.props.data["affiliation.name"].slice(1)}{" "}
                  {Boolean(this.props.data["affiliation.orgName"]) ? (
                    <Link target="_blank">
                      {this.props.data["affiliation.orgName"]}
                    </Link>
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography className={classes.text}>
                  Mort pour la France le{" "}
                  {Boolean(death_date)
                    ? death_date[0] +
                      " " +
                      this.months[death_date[1] - 1] +
                      " " +
                      death_date[2]
                    : ""}{" "}
                  {Boolean(this.props.data["death.place.name"]) ? (
                    <Link target="_blank">
                      à {this.props.data["death.place.name"]}
                    </Link>
                  ) : (
                    ""
                  )}
                </Typography>
                {Boolean(this.props.data["note_history"]) ? (
                  <Typography className={classes.text}>
                    Note : {this.props.data["note_history"]}
                  </Typography>
                ) : (
                  ""
                )}

                {Boolean(this.props.data["bibl.author"]) ? (
                  <div>
                    <Typography className={classes.text}>
                      {" "}
                      Références bibliographiques:{" "}
                    </Typography>
                    <Typography className={classes.text}>
                      {"-"} {this.props.data["bibl.author"]}.{" "}
                      <Link href={this.props.data["bibl.uri"]} target="_blank">
                        {this.props.data["bibl.author"]}{" "}
                      </Link>
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
                {this.state.wills.length > 0 ? (
                  <div>
                    <Typography className={classes.text}>
                      Ce poilus est l'auteur{" "}
                      {this.state.wills.length > 1
                        ? " des testaments suivants :"
                        : " du testament suivant :"}{" "}
                    </Typography>
                    <ul>
                      {this.state.wills.map((will, i) => {
                        return (
                          <li key={i}>
                            <Link
                              href={
                                getParamConfig("web_url") +
                                "/testament/" +
                                will["_id"]
                              }
                              target="_blank"
                            >
                              Testament
                              {Boolean(will_dates[i])
                                ? " du " +
                                  will_dates[i][0] +
                                  " " +
                                  this.months[will_dates[i][1] - 1] +
                                  " " +
                                  will_dates[i][2]
                                : " " + parseInt(i + 1, 10)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <Typography className={classes.text}>
                    {" "}
                    Le testament de ce poilu sera accessible prochainement.
                  </Typography>
                )}
              </Paper>
            </div>
          )}
        </Styled>
      );
    }

    return output;
  }
}
