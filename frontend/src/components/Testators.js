import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

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
import "../styles/Testator.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig, createStyled } from "../utils/functions";
import TestatorDisplay from "./TestatorDisplay";
import { ExplorMenu } from "./Wills";

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

class Testators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "persName.norm.keyword",
      order: "asc",
      value: 1
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "persName.norm.keyword",
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
        app={getParamConfig("es_index_testators")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <ExplorMenu selectedId="testators" />
        <div className="testator_menu">
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
                to="/recherche"
              >
                {" "}
                Recherche{" "}
              </Link>
              <Typography color="textPrimary">Les testateurs</Typography>
            </Breadcrumbs>
          </Paper>
        </div>
        <div className="wills_order">
          Trier par :
          <Select value={this.state.value} onChange={this.handleChange}>
            <MenuItem value={1}>nom de famille (A-Z)</MenuItem>
            <MenuItem value={2}>nom de famille (Z-A)</MenuItem>
            <MenuItem value={3}>
              date de naissance <TrendingUpIcon />
            </MenuItem>
            <MenuItem value={4}>
              date de naissance <TrendingDownIcon />
            </MenuItem>
          </Select>
        </div>

        <div>
          <ReactiveList
            dataField={this.state.field}
            componentId="testator"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={10}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={function(stats) {
              return `${stats.numberOfResults} testateurs trouvés.`;
            }}
            URLParams={false}
          >
            {({ data, error, loading }) => (
              <ResultListWrapper>
                {data.map((item, j) => {
                  window.history.pushState(
                    "testator",
                    "title",
                    "/testateur/" + item["_id"]
                  );
                  return (
                    <div className="root" key={j}>
                      <Paper>
                        <TestatorDisplay id={item["_id"]} data={item} />
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

export default Testators;
