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
  Typography
} from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownIcon from "@material-ui/icons/TrendingDownOutlined";
import "../styles/Wills.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig, createStyled } from "../utils/functions";
import classNames from "classnames";

const { ResultListWrapper } = ReactiveList;

const Styled = createStyled(theme => ({
  explorMenu: {
    marginTop: theme.spacing(2)
  },
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
  }
}));

export function ExplorMenu() {
  const [selectedId, setSelectId] = React.useState("wills");

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
            to="/wills"
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
            to="/testators"
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
        </Breadcrumbs>
      )}
    </Styled>
  );
}

function createPageMenu(will_id, pages, idx, handleClick) {
  let menu = [];
  let listMenu = { page: "Page", envelope: "Enveloppe", codicil: "Codicille" };
  for (let i = 0; i < pages.length; i++) {
    menu.push(
      <Styled>
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
            {listMenu[pages[i]["page_type"].type]} {pages[i]["page_type"].id}
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

class Wills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "",
      order: "",
      value: 3
    };
    this.handleChange = this.handleChange.bind(this);
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

  render() {
    return (
      <ReactiveBase
        app={getParamConfig("es_index_wills")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <ExplorMenu />
        <div className="wills_menu">
          <Paper elevation={0}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="Breadcrumb"
            >
              <Link
                id="search"
                key={0}
                color="inherit"
                component={RouterLink}
                to="/search"
              >
                {" "}
                Recherche{" "}
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

        <div>
          <ReactiveList
            dataField={this.state.field}
            componentId="will"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={10}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={function(stats) {
              return `${stats.numberOfResults} testaments trouvés.`;
            }}
            URLParams={true}
          >
            {({ data, error, loading }) => (
              <ResultListWrapper>
                {data.map((item, j) => {
                  return (
                    <div className="root" key={j}>
                      <Paper>
                        <WillDisplay
                          id={item["_id"]}
                          data={item}
                          createPageMenu={createPageMenu}
                        />
                      </Paper>
                    </div>
                  );
                })}
              </ResultListWrapper>
            )}
          </ReactiveList>
        </div>
      </ReactiveBase>
    );
  }
}

export default Wills;
