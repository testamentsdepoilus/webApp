import React, { Component } from "react";
import {
  createStyled,
  getParamConfig,
  getHitsFromQuery,
  downloadFile
} from "../utils/functions";
import { Paper, Typography, Grid, Link, IconButton } from "@material-ui/core";

import "../styles/WillDisplay.css";
import classNames from "classnames";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";

const Styled = createStyled(theme => ({
  paper: {
    marginTop: theme.spacing(3),
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
  urlTestator: {
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

    this.handleExportClick = this.handleExportClick.bind(this);
  }

  handleExportClick() {
    downloadFile(
      getParamConfig("web_url") +
        "/files/contextualEntity_person_2019-11-06_04-04-43.xml",
      "notice_person.xml"
    );
  }

  componentDidUpdate() {
    if (
      this.state.wills.length === 0 ||
      (this.state.wills.length > 0 &&
        this.state.wills[0]._source["testator.ref"] !== this.props.id)
    ) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
        JSON.stringify({
          _source: ["_id", "will_contents.will_date", "testator.ref"],
          query: {
            term: {
              "testator.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              wills: hits
            });
          } else if (this.state.wills.length > 0) {
            this.setState({
              wills: []
            });
          }
        })
        .catch(err => {
          console.log("Erreur :", err);
        });
    }
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_wills"),
      JSON.stringify({
        _source: ["_id", "will_contents.will_date", "testator.ref"],
        query: {
          term: {
            "testator.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            wills: hits
          });
        }
      })
      .catch(err => console.log("Erreur :", err));
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
                    title="Exporter la notice des testateurs en format TEI"
                    onClick={this.handleExportClick}
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid key={2} item>
                  <Paper className={classNames(classes.paper)}>
                    <Typography className={classes.name}>
                      {this.props.data["persName.fullProseForm"]}
                      {" ("} {Boolean(birth_date) ? birth_date[2] : ""}
                      {"-"}
                      {Boolean(death_date) ? death_date[2] : ""} {")"}
                    </Typography>
                    <Typography className={classes.text}>
                      {Boolean(this.props.data["residence.ref"]) ? (
                        <Link
                          href={
                            getParamConfig("web_url") +
                            "/place/" +
                            this.props.data["residence.ref"]
                          }
                          target="_blank"
                        >
                          {this.props.data["residence.name"]}
                        </Link>
                      ) : (
                        this.props.data["residence.name"]
                      )}
                    </Typography>
                    {Boolean(birth_date) ||
                    Boolean(this.props.data["birth.place.name"]) ? (
                      <Typography className={classes.text}>
                        Né
                        {Boolean(birth_date)
                          ? " le " +
                            birth_date[0] +
                            " " +
                            this.months[birth_date[1] - 1] +
                            " " +
                            birth_date[2]
                          : ""}{" "}
                        à{" "}
                        {Boolean(this.props.data["birth.place.name"]) ? (
                          <Link
                            href={
                              getParamConfig("web_url") +
                              "/place/" +
                              this.props.data["birth.place.ref"]
                            }
                            target="_blank"
                          >
                            {this.props.data["birth.place.name"]}
                          </Link>
                        ) : (
                          ""
                        )}
                      </Typography>
                    ) : (
                      ""
                    )}
                    {Boolean(this.props.data["affiliation.orgName"]) ? (
                      <Typography className={classes.text}>
                        {this.props.data["affiliation.name"][0].toUpperCase() +
                          this.props.data["affiliation.name"].slice(1)}
                        {Boolean(this.props.data["affiliation.ref"]) ? (
                          <Link
                            href={
                              getParamConfig("web_url") +
                              "/armee/" +
                              this.props.data["affiliation.ref"]
                            }
                            target="_blank"
                          >
                            {this.props.data["affiliation.orgName"]}
                          </Link>
                        ) : (
                          this.props.data["affiliation.orgName"]
                        )}
                      </Typography>
                    ) : (
                      ""
                    )}
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
                        <Link
                          href={
                            Boolean(this.props.data["death.place.ref"])
                              ? getParamConfig("web_url") +
                                "/place/" +
                                this.props.data["death.place.ref"]
                              : ""
                          }
                          target="_blank"
                        >
                          à {this.props.data["death.place.name"]}
                        </Link>
                      ) : (
                        ""
                      )}
                    </Typography>
                    {Boolean(this.props.data["occupation"]) ? (
                      <Typography className={classes.text}>
                        Profession : {this.props.data["occupation"]}
                      </Typography>
                    ) : (
                      ""
                    )}

                    {Boolean(this.props.data["note_history"]) ? (
                      <Typography className={classes.text}>
                        Biographie : {this.props.data["note_history"]}
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
                          <Link
                            href={this.props.data["bibl.uri"]}
                            target="_blank"
                          >
                            {this.props.data["bibl.author"]}{" "}
                          </Link>
                        </Typography>
                      </div>
                    ) : (
                      ""
                    )}
                    <Grid
                      className={classes.text}
                      container
                      direction="row"
                      spacing={1}
                    >
                      <Grid item>
                        <Typography> Lien web du poilus : </Typography>
                      </Grid>
                      <Grid item>
                        <Link
                          href={testator_uri}
                          target="_blank"
                          className={classNames(classes.urlTestator)}
                        >
                          {" "}
                          {testator_uri}{" "}
                        </Link>
                      </Grid>
                    </Grid>
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
                            const will_uri =
                              getParamConfig("web_url") +
                              "/testament/" +
                              will["_id"];
                            return (
                              <li key={i}>
                                <Link href={will_uri} target="_blank">
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
