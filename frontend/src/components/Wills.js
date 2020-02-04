import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import WillDisplay from "./WillDisplay";
import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  getParamConfig,
  createStyled,
  getHitsFromQuery,
  equalsArray
} from "../utils/functions";
import classNames from "classnames";
import InsertLinkIcon from "@material-ui/icons/InsertLinkOutlined";
import Footer from "./Footer";

const Styled = createStyled(theme => ({
  menu: {
    display: "flex"
  },

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
  },
  ul: {
    listStyleType: "none",
    marginTop: theme.spacing(1)
  },
  li: {
    marginTop: theme.spacing(2),
    fontSize: "0.9em"
  },
  li_active: {
    marginTop: theme.spacing(2),
    fontSize: "0.9em",
    color: "#0091EA",
    fontWeight: 600
  },
  typoSurname: {
    fontVariantCaps: "small-caps"
  }
}));

export function ExplorMenu(props) {
  const [selectedId, setSelectId] = React.useState(props.selectedId);

  const handleListItemClick = event => {
    setSelectId(event.target.id);
  };

  return (
    <Styled>
      {({ classes }) => (
        <Breadcrumbs aria-label="Breadcrumb" className={classes.explorMenu}>
          <Link
            id="wills"
            className={
              selectedId === "wills"
                ? classNames(classes.link, classes.activedLink)
                : classes.link
            }
            component={RouterLink}
            to="/testaments"
            onClick={handleListItemClick}
          >
            Les testaments
          </Link>

          <Link
            id="testators"
            className={
              selectedId === "testators"
                ? classNames(classes.link, classes.activedLink)
                : classes.link
            }
            component={RouterLink}
            to="/testateurs"
            onClick={handleListItemClick}
          >
            Les testateurs
          </Link>
          <Link
            id="places"
            className={
              selectedId === "places"
                ? classNames(classes.link, classes.activedLink)
                : classes.link
            }
            component={RouterLink}
            to="/places"
            onClick={handleListItemClick}
          >
            Les lieux
          </Link>
          <Link
            id="units"
            className={
              selectedId === "units"
                ? classNames(classes.link, classes.activedLink)
                : classes.link
            }
            component={RouterLink}
            to="/armees"
            onClick={handleListItemClick}
          >
            Les unités militaires
          </Link>
        </Breadcrumbs>
      )}
    </Styled>
  );
}

function createPageMenu(will_id, pages, idx, handleClick, handeOpenModal) {
  let menu = [];
  let listMenu = { page: "Page", envelope: "Enveloppe", codicil: "Codicille" };
  for (let i = 0; i < pages.length; i++) {
    menu.push(
      <Styled key={i}>
        {({ classes }) => (
          <Grid container direction="row" alignItems="center">
            <Grid>
              <Link
                id={will_id}
                value={i}
                component="button"
                color="inherit"
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
            <Grid>
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

class Wills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "will_contents.will_date",
      order: "asc",
      value: 3,
      curPage: 0,
      cur_list: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRenderStats = this.handleRenderStats.bind(this);
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator.name_norm.keyword",
          order: "desc"
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc"
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "desc"
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "asc"
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "will_identifier.cote.keyword",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "will_contents.will_date",
          order: "asc"
        });
        break;
    }
  }

  handleRenderStats(stats) {
    return `${stats.numberOfResults} testaments trouvés.`;
  }

  handleBackUp(e) {
    document.location.href = document.referrer;
  }

  render() {
    return (
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <div className="wills_menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="home"
                key={0}
                color="inherit"
                component={RouterLink}
                to="/accueil"
              >
                Accueil
              </Link>
              <Typography color="textPrimary">Les testaments</Typography>
            </Breadcrumbs>
          </Paper>
        </div>

        <div className="wills_order">
          Trier par :
          <Select value={this.state.value} onChange={this.handleChange}>
            <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
            <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
            <MenuItem value={3}>
              date de rédaction <TrendingUpIcon />
            </MenuItem>
            <MenuItem value={4}>
              date de rédaction <TrendingDownIcon />
            </MenuItem>
            <MenuItem value={5}>Cote (A-Z)</MenuItem>
            <MenuItem value={6}>Cote (Z-A)</MenuItem>
          </Select>
        </div>

        <div className="wills_result">
          <ReactiveList
            dataField={this.state.field}
            componentId="will"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={5}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={this.handleRenderStats}
            URLParams={false}
            render={function(res) {
              return res.data.map((item, j) => {
                window.history.replaceState(
                  getParamConfig("web_url"),
                  "will",
                  getParamConfig("web_url") + "/testament/" + item["_id"]
                );

                const curPage_ =
                  Math.floor(res.resultStats.currentPage / 5) * 5;
                let sort_ = {};
                sort_[this.state.field] = { order: this.state.order };
                getHitsFromQuery(
                  getParamConfig("es_host") +
                    "/" +
                    getParamConfig("es_index_wills"),
                  JSON.stringify({
                    from: curPage_,
                    size: 5,
                    sort: [sort_]
                  })
                )
                  .then(data => {
                    if (!equalsArray(data, this.state.cur_list)) {
                      this.setState({
                        cur_list: data
                      });
                    }
                  })
                  .catch(error => {
                    console.log("error :", error);
                  });

                return (
                  <div>
                    <Grid container direction="row" spacing={1}>
                      <Grid item xs={2}>
                        <Styled>
                          {({ classes }) => (
                            <ul className={classes.ul}>
                              {this.state.cur_list.map((item, i) =>
                                Boolean(
                                  res.resultStats.currentPage === curPage_ + i
                                ) ? (
                                  <li
                                    key={item["_id"]}
                                    className={classes.li_active}
                                  >
                                    {curPage_ + i + 1}
                                    {". "}
                                    {item._source["testator.forename"] + " "}
                                    <span className={classes.typoSurname}>
                                      {item._source["testator.surname"]}
                                    </span>
                                  </li>
                                ) : (
                                  <li key={item["_id"]} className={classes.li}>
                                    {curPage_ + i + 1}
                                    {". "}
                                    {item._source["testator.forename"] + " "}
                                    <span className={classes.typoSurname}>
                                      {item._source["testator.surname"]}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </Styled>
                      </Grid>
                      <Grid item xs={10}>
                        <WillDisplay
                          id={item["_id"]}
                          data={item}
                          createPageMenu={createPageMenu}
                        />
                      </Grid>
                    </Grid>
                    <Footer />
                  </div>
                );
              });
            }.bind(this)}
          ></ReactiveList>
        </div>
      </ReactiveBase>
    );
  }
}

export default Wills;
