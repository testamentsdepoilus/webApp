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
import { getParamConfig } from "../utils/functions";

const { ResultListWrapper } = ReactiveList;

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
          field: "testator_name.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "testator_name.keyword",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "",
          order: ""
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
          </Select>
        </div>

        <div>
          <ReactiveList
            dataField={this.state.field}
            componentId="will_nav"
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
                        <WillDisplay data={item} />
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
