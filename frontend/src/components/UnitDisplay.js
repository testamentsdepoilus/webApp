import React, { Component } from "react";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";

import {
  createStyled,
  getParamConfig,
  getHitsFromQuery,
  downloadFile
} from "../utils/functions";
import {
  Paper,
  Typography,
  Link,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid
} from "@material-ui/core";

import classNames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Styled = createStyled(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    maxWidth: "55em",
    margin: "auto"
  },
  panel: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  list: {
    fontFamily: "-apple-system",
    fontSize: "1rem"
  },
  item: {
    fontWeight: 600
  },
  urlUnit: {
    color: "#0091EA",
    fontSize: 14
  }
}));

export default class UnitDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testators: []
    };
    this.handleExportClick = this.handleExportClick.bind(this);
  }

  handleExportClick() {
    downloadFile(
      getParamConfig("web_url") +
        "/files/contextualEntity_militaryUnit_2019-11-06_10-29-32.xml",
      "notice_militaryUnit.xml"
    );
  }

  componentDidUpdate() {
    if (
      this.state.testators.length === 0 ||
      (this.state.testators.length > 0 &&
        this.state.testators[0]._source["affiliation.ref"] !== this.props.id)
    ) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
        JSON.stringify({
          query: {
            term: {
              "affiliation.ref": this.props.id
            }
          }
        })
      )
        .then(hits => {
          if (hits.length > 0) {
            this.setState({
              testators: hits
            });
          } else if (this.state.testators.length > 0) {
            this.setState({
              testators: []
            });
          }
        })
        .catch(err => console.log("erreur :", err));
    }
  }

  componentDidMount() {
    getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_testators"),
      JSON.stringify({
        query: {
          term: {
            "affiliation.ref": this.props.id
          }
        }
      })
    )
      .then(hits => {
        if (hits.length > 0) {
          this.setState({
            testators: hits
          });
        } else if (this.state.testators.length > 0) {
          this.setState({
            testators: []
          });
        }
      })
      .catch(err => console.log("erreur :", err));
  }

  render() {
    let output = null;

    if (this.props.data) {
      const unit_uri = getParamConfig("web_url") + "/armee/" + this.props.id;

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
                    title="Exporter la notice des unités militaires en format TEI"
                    onClick={this.handleExportClick}
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid key={2} item>
                  <Paper className={classNames(classes.paper)}>
                    <List className={classes.list}>
                      {Boolean(this.props.data["country"]) ? (
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            className={classes.item}
                            primary={
                              <Typography className={classes.item}>
                                Pays
                              </Typography>
                            }
                          />
                          <ListItemText
                            primary={
                              <Typography>
                                {this.props.data["country"]}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ) : (
                        " "
                      )}
                      {Boolean(this.props.data["corps"]) ? (
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Typography className={classes.item}>
                                Corps d'armée
                              </Typography>
                            }
                          />
                          <ListItemText
                            primary={
                              <Typography>
                                {this.props.data["corps"]}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ) : (
                        " "
                      )}
                      {Boolean(this.props.data["composante"]) ? (
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Typography className={classes.item}>
                                Composante d'armée
                              </Typography>
                            }
                          />
                          <ListItemText
                            primary={
                              <Typography>
                                {this.props.data["composante"]}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ) : (
                        " "
                      )}
                      {Boolean(this.props.data["unit"]) ? (
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            className={classes.item}
                            primary={
                              <Typography className={classes.item}>
                                Unité d'armée
                              </Typography>
                            }
                          />
                          <ListItemText
                            primary={
                              <Typography>{this.props.data["unit"]}</Typography>
                            }
                          />
                        </ListItem>
                      ) : (
                        " "
                      )}
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          className={classes.item}
                          primary={
                            <Typography className={classes.item}>
                              Lien web de cette unité militaire
                            </Typography>
                          }
                        />
                        <ListItemText
                          primary={
                            <Link
                              href={unit_uri}
                              target="_blank"
                              className={classNames(classes.urlUnit)}
                            >
                              {unit_uri}
                            </Link>
                          }
                        />
                      </ListItem>
                    </List>

                    {Object.keys(this.state.testators).length > 0 ? (
                      <ExpansionPanel className={classes.panel}>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="testators"
                        >
                          <Typography className={classes.text}>
                            Poilus membres de cette unité militaire :
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <ul>
                            {this.state.testators.map((hit, i) => {
                              const testator_uri =
                                getParamConfig("web_url") +
                                "/testateur/" +
                                hit["_id"];
                              return (
                                <li key={i} className={classes.text}>
                                  <Link
                                    href={testator_uri}
                                    target="_blank"
                                    className={classNames(classes.urlUnit)}
                                  >
                                    {hit._source["persName.fullProseForm"]}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    ) : (
                      ""
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
