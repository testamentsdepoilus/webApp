import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getParamConfig, getHitsFromQuery } from "../utils/functions";
import {
  Breadcrumbs,
  Box,
  Link,
  Grid,
  Button,
  MenuList,
  MenuItem
} from "@material-ui/core";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

const { ResultListWrapper } = ReactiveList;

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      lastNews: [],
      selectedId: ""
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    const itemFind = this.state.lastNews.find(function(item) {
      return item["_id"] === event.target.id;
    });

    this.setState({
      selectedId: event.target.id,
      item: itemFind ? itemFind._source : this.state.item
    });
  }

  handleMoreClick(item) {
    return function(e) {
      document.location.href =
        getParamConfig("web_url") + "/news/" + item["_id"];
    };
  }

  defaultQuery() {
    return {
      query: {
        term: {
          type: 2
        }
      }
    };
  }

  componentDidUpdate() {
    const url = document.location.href;
    const idx = url.lastIndexOf("news/");
    if (idx === -1 && Boolean(this.state.item)) {
      this.setState({
        item: null
      });
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("news/");
    if (idx !== -1) {
      getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
        JSON.stringify({
          size: 5,
          query: {
            term: {
              type: 2
            }
          },
          sort: [{ created: { order: "desc" } }]
        })
      )
        .then(data => {
          const id_query = url.substring(idx + 5).split("/");
          getHitsFromQuery(
            getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
            JSON.stringify({
              query: {
                term: {
                  _id: id_query[0]
                }
              }
            })
          )
            .then(hits => {
              this.setState({
                lastNews: data,
                selectedId: hits.length > 0 ? hits[0]["_id"] : data[0]["_id"],
                item: hits.length > 0 ? hits[0]._source : null
              });
            })
            .catch(error => {
              console.log("error :", error);
            });
        })
        .catch(error => {
          console.log("error :", error);
        });
    }
  }

  render() {
    /*const prevLink = document.referrer.includes("recherche?")
      ? "/recherche?" + document.referrer.split("?")[1]
      : "/recherche";*/
    const currLink = !Boolean(this.state.item) ? (
      <div
        id="news"
        key={1}
        color="textPrimary"
        component={RouterLink}
        to="/news"
      >Actualités{" "}
      </div>
    ) : (
      [
        <Link
          id="news"
          key={1}
          color="inherit"
          component={RouterLink}
          to="/news"
        >
          {" "}
          Actualités{" "}
        </Link>,
        <div>
          {this.state.item["title"]}
        </div>
      ]
    );
    const navBar = (


          <Breadcrumbs
                separator={<i className="fas fa-caret-right"></i>}
                aria-label="Breadcrumb"
                className="breadcrumbs"
              >
                <Link
                  id="home"
                  key={0}
                  color="inherit"
                  component={RouterLink}
                   href={getParamConfig("web_url") + "/accueil"}
                >
                  Accueil
                </Link>
                {currLink}
          </Breadcrumbs>
    );

    const menuNews = (
      <div className="leftMenu bg-gray">
        <h2 className="card-title bg-primaryMain text-uppercase"><i className="far fa-newspaper"></i> Actualités</h2>
        <MenuList>
          {this.state.lastNews.map((item, i) => (
            <MenuItem key={i}>
              <Link
                id={item["_id"]}
                className={
                  this.state.selectedId === item["_id"] ? "active" : ""
                }
                component={RouterLink}
                to={"/news/" + item["_id"]}
                onClick={this.handleListItemClick}
              >
                {item._source["title"]}
              </Link>
            </MenuItem>
          ))}
        </MenuList>
      </div>
    );

    const date = Boolean(this.state.item)
      ? new Date(this.state.item["created"])
      : null;

    return [
      Boolean(this.state.item) ? (
        <div className="content item">
          {navBar}
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3}>
              {menuNews}
            </Grid>
            <Grid item xs={9} className="typography">
              <div className="bg-white" key={0}>
                  <h1>{" "}{this.state.item["title"]}{" "}</h1>
                  <Box className="bg-gray" display="flex" justifyContent="space-between">
                    <div className="authors fontWeightMedium text-secondaryMain">{this.state.item["author"]}</div>
                    <div className="date fontWeightMedium">
                        {Boolean(date)
                         ? "Mise à jour le " +
                        date.toLocaleDateString() +
                         " à " +
                          date.toLocaleTimeString()
                        : ""}
                    </div>
                  </Box>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        this.state.item["detail"] !== ""
                          ? this.state.item["detail"]
                          : this.state.item["summary"]
                    }}
                  >
                  </div>
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <ReactiveBase
          app={getParamConfig("es_index_cms")}
          url={getParamConfig("es_host")}
          type="_doc"
        >
          <div className="content blog">
            {navBar}
            <h1 className="heading"><i className="far fa-newspaper"></i> Actualités</h1>
            <div>
              <ReactiveList
                dataField="created"
                componentId="news_id"
                stream={true}
                pagination={false}
                paginationAt="bottom"
                size={5}
                pages={10}
                sortBy="desc"
                className="listContainer"
                showEndPage={false}
                renderResultStats={function(stats) {
                  return <div className="countNews fontWeightMedium">{stats.numberOfResults} actualités</div>;
                }}
                URLParams={false}
                defaultQuery={this.defaultQuery}
              >
                {({ data, error, loading }) => (
                  <div>
                    <ResultListWrapper className="list_news  bg-white">
                      {data.map((item, j) => {
                        const date = new Date(item["created"]);
                        return (
                          <div className="item" key={j}>
                              <Box display="flex" justifyContent="flex-end" className="date bg-gray fontWeightMedium">
                                {Boolean(date)
                                ? "Mise à jour le " +
                                  date.toLocaleDateString() +
                                  " à " +
                                  date.toLocaleTimeString()
                                : ""}
                              </Box>
                              <h2 className="fontWeightRegular">{" "}{item["title"]}{" "}</h2>
                              <div className="authors fontWeightMedium text-secondaryMain">{item["author"]}</div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    item["summary"] !== ""
                                      ? item["summary"]
                                      : item["detail"]
                                }}
                              ></div>
                              <Box display="flex" justifyContent="flex-end">
                                <Button className="button outlined secondary-light" aria-label="Lire la suite" onClick={this.handleMoreClick(item)}> Lire la suite</Button>
                              </Box>
                          </div>
                        );
                      })}
                    </ResultListWrapper>
                  </div>
                )}
              </ReactiveList>
            </div>
          </div>
        </ReactiveBase>
      ),
    ];
  }
}

export default News;
