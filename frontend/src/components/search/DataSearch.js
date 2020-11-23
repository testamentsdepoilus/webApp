import React, { Component } from "react";
import { SingleDropdownList } from "@appbaseio/reactivesearch";
import { Button, Box } from "@material-ui/core";
import PlaceFilter from "./PlaceFilter";

export default class CustumerDataSearch extends Component {
  constructor() {
    super();
    this.state = {
      displayMore: false,
      testator: "",
      unit: "",
      occupation: "",
      institution: "",
      notoriale: "",
      cote: "",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleTestatorChange = this.handleTestatorChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleOccupationChange = this.handleOccupationChange.bind(this);
    this.handleNotorialeChange = this.handleNotorialeChange.bind(this);
    this.handleCoteChange = this.handleCoteChange.bind(this);
    this.handleInstitutionChange = this.handleInstitutionChange.bind(this);
    this.customQuery = this.customQuery.bind(this);
  }
  handleClick() {
    this.setState({
      displayMore: !this.state.displayMore,
    });
  }

  handleClear(value) {
    return function (event) {
      this.setState({
        testator: value,
      });
    }.bind(this);
  }

  handleTestatorChange(value) {
    this.setState({
      testator:
        value === "" ? value : value.split("+")[1] + " " + value.split("+")[0],
    });
  }

  customQuery = function (value, props) {
    if (Boolean(value)) {
      return {
        query: {
          match: {
            "testator.name": {
              query: value,
              operator: "and",
            },
          },
        },
      };
    }
  };

  handleUnitChange(value) {
    this.setState({
      unit: value,
    });
  }

  handleCoteChange(value) {
    this.setState({
      cote: value,
    });
  }

  handleInstitutionChange(value) {
    this.setState({
      institution: value,
    });
  }

  handleNotorialeChange(value) {
    this.setState({
      notoriale: value,
    });
  }

  handleOccupationChange(value) {
    this.setState({
      occupation: value,
    });
  }

  customQuery = function (value, props) {
    if (Boolean(value)) {
      return {
        query: {
          match: {
            "testator.name": {
              query: value,
              operator: "and",
            },
          },
        },
      };
    }
  };

  render() {
    return (
      <div>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
          mb={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "cote",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "institution",
                  "contributeur",
                  "collection",
                  "lieu",
                  "notoriale",
                  "profession",
                  "unite",
                ],
              }}
              componentId="nom_testateur"
              dataField="testator.name.keyword"
              value={this.state.testator}
              size={2000}
              sortBy="asc"
              showCount={false}
              autosuggest={true}
              placeholder="Nom du testateur"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir un nom de testateur"
              onChange={this.handleTestatorChange}
              customQuery={this.customQuery}
              renderItem={(label, count, isSelected) => (
                <div>
                  {label.split("+")[1] + " "}
                  <span className="text-uppercase">{label.split("+")[0]}</span>
                </div>
              )}
              innerClass={{
                list: "list",
                select:
                  this.state.testator === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.testator !== "" ? (
            <Button
              id="clearTestator"
              onClick={(event) => this.handleTestatorChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <PlaceFilter />

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={3}
          mb={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "institution",
                  "contributeur",
                  "nom_testateur",
                  "collection",
                  "lieu",
                  "notoriale",
                  "unite",
                  "cote",
                ],
              }}
              componentId="profession"
              dataField="testator.occupation.keyword"
              value={this.state.occupation}
              sortBy="asc"
              size={2000}
              showCount={true}
              autosuggest={true}
              placeholder="Profession"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une profession"
              onChange={this.handleOccupationChange}
              renderItem={(label, count, isSelected) => {
                return <div>{label + " (" + count + ")"}</div>;
              }}
              transformData={(data) => {
                data.sort(function (a, b) {
                  return a["key"].localeCompare(b["key"]);
                });
                return data;
              }}
              innerClass={{
                list: "list",
                select:
                  this.state.occupation === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.occupation !== "" ? (
            <Button
              id="clearOccupation"
              onClick={(event) => this.handleOccupationChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "institution",
                  "contributeur",
                  "nom_testateur",
                  "collection",
                  "lieu",
                  "notoriale",
                  "profession",
                  "cote",
                ],
              }}
              componentId="unite"
              dataField="testator.affiliation.keyword"
              value={this.state.unit}
              size={2000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Unité militaire"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une unité militaire"
              onChange={this.handleUnitChange}
              innerClass={{
                list: "list",
                select: this.state.unit === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.unit !== "" ? (
            <Button
              id="clearUnit"
              onClick={(event) => this.handleUnitChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "cote",
                  "nom_testateur",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "contributeur",
                  "collection",
                  "lieu",
                  "notoriale",
                  "profession",
                  "unite",
                ],
              }}
              componentId="institution"
              dataField="will_identifier.institution.keyword"
              value={this.state.institution}
              size={2000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Institution de conservation"
              onChange={this.handleInstitutionChange}
              URLParams={true}
              showSearch={false}
              innerClass={{
                list: "list",
                select:
                  this.state.institution === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.institution !== "" ? (
            <Button
              id="clearInstitution"
              onClick={(event) => this.handleInstitutionChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "institution",
                  "contributeur",
                  "nom_testateur",
                  "collection",
                  "lieu",
                  "notoriale",
                  "profession",
                  "unite",
                ],
              }}
              componentId="cote"
              dataField="will_identifier.cote.keyword"
              value={this.state.cote}
              size={2000}
              sortBy="asc"
              showCount={false}
              autosuggest={true}
              placeholder="Cote du testament"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une cote"
              onChange={this.handleCoteChange}
              innerClass={{
                list: "list",
                select: this.state.cote === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.cote !== "" ? (
            <Button
              id="clearCote"
              onClick={(event) => this.handleCoteChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Box flexGrow="1" flexShrink="1">
            <SingleDropdownList
              className="select"
              react={{
                and: [
                  "texte",
                  "date_redaction",
                  "date_naissance",
                  "date_deces",
                  "institution",
                  "contributeur",
                  "nom_testateur",
                  "collection",
                  "lieu",
                  "profession",
                  "unite",
                  "cote",
                ],
              }}
              componentId="notoriale"
              dataField="will_provenance.keyword"
              value={this.state.notoriale}
              size={2000}
              sortBy="count"
              showCount={true}
              autosuggest={true}
              placeholder="Étude notariale"
              URLParams={true}
              showSearch={true}
              searchPlaceholder="Saisir une étude notariale"
              onChange={this.handleNotorialeChange}
              innerClass={{
                list: "list",
                select:
                  this.state.notoriale === "" ? "select" : "select selected",
              }}
            />
          </Box>
          {this.state.notoriale !== "" ? (
            <Button
              id="clearNotoriale"
              onClick={(event) => this.handleNotorialeChange("")}
              title="Supprimer le filtre"
              className="button clear iconButton"
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            ""
          )}
        </Box>
      </div>
    );
  }
}
