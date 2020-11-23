import React, { Component } from "react";
import { Breadcrumbs, Link, Grid } from "@material-ui/core";

import { Link as RouterLink } from "react-router-dom";
import {
  MultiList,
  ReactiveBase,
  ReactiveComponent,
} from "@appbaseio/reactivesearch";
import { getParamConfig } from "../utils/functions";
import ApexBarChartWrapper from "../utils/ApexBarChartWrapper";
import ApexLineChartWrapper from "../utils/ApexLineChartWrapper";

class Explore extends Component {
  render() {
    return (
      <div className="explore">
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
            to="/accueil"
          >
            Accueil
          </Link>
          <div>Explorer</div>
        </Breadcrumbs>

        <h1 className="heading">
          <i className="far fa-eye"></i> Explorer
        </h1>

        <div className="bg-white paddingContainer">
          <ReactiveBase
            app={getParamConfig("es_index_wills")}
            url={getParamConfig("es_host_with_auth")}
            type="_doc"
          >
            <Grid container justify="center" alignItems="center" spacing={2}>
              <Grid item xs={12} sm={6}>
                <ReactiveComponent
                  componentId="bar_provenance"
                  defaultQuery={() => ({
                    ...MultiList.generateQueryOptions({
                      dataField: "will_provenance.keyword",
                      size: 20,
                      sortBy: "count",
                    }),
                  })}
                  render={({ value, setQuery, aggregations }) => (
                    <ApexBarChartWrapper
                      selectedValue={value}
                      aggregations={aggregations}
                      setQuery={setQuery}
                      dataField="will_provenance.keyword"
                      chartOptions={{
                        title: "Nombre de Poilus par étude notariale",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactiveComponent
                  componentId="bar_occupation"
                  defaultQuery={() => ({
                    ...MultiList.generateQueryOptions({
                      dataField: "testator.occupation.keyword",
                      size: 20,
                      sortBy: "count",
                    }),
                  })}
                  render={({ value, setQuery, aggregations }) => (
                    <ApexBarChartWrapper
                      selectedValue={value}
                      aggregations={aggregations}
                      setQuery={setQuery}
                      dataField="testator.occupation.keyword"
                      chartOptions={{
                        title: "Nombre de Poilus par profession",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactiveComponent
                  componentId="line_death"
                  defaultQuery={() => ({
                    ...MultiList.generateQueryOptions({
                      dataField: "will_contents.death_place_norm.keyword",
                      size: 20,
                      sortBy: "count",
                    }),
                  })}
                  render={({ value, setQuery, aggregations }) => (
                    <ApexLineChartWrapper
                      selectedValue={value}
                      aggregations={aggregations}
                      setQuery={setQuery}
                      dataField="will_contents.death_place_norm.keyword"
                      chartOptions={{
                        title: "Nombre de Poilus par lieu décès",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactiveComponent
                  componentId="line_residence"
                  defaultQuery={() => ({
                    ...MultiList.generateQueryOptions({
                      dataField: "will_contents.residence_norm.keyword",
                      size: 20,
                      sortBy: "count",
                    }),
                  })}
                  render={({ value, setQuery, aggregations }) => (
                    <ApexLineChartWrapper
                      selectedValue={value}
                      aggregations={aggregations}
                      setQuery={setQuery}
                      dataField="will_contents.residence_norm.keyword"
                      chartOptions={{
                        title: "Nombre de Poilus par lieu de résidence",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReactiveComponent
                  componentId="line_birth"
                  defaultQuery={() => ({
                    ...MultiList.generateQueryOptions({
                      dataField: "will_contents.birth_place_norm.keyword",
                      size: 20,
                      sortBy: "count",
                    }),
                  })}
                  render={({ value, setQuery, aggregations }) => (
                    <ApexLineChartWrapper
                      selectedValue={value}
                      aggregations={aggregations}
                      setQuery={setQuery}
                      dataField="will_contents.birth_place_norm.keyword"
                      chartOptions={{
                        title: "Nombre de Poilus par lieu de naissance",
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </ReactiveBase>
        </div>
      </div>
    );
  }
}

export default Explore;
