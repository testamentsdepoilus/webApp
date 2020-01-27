import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import jwt_decode from "jwt-decode";
import JSZipUtils from "jszip-utils";
import JSZip from "jszip";
import FileSaver from "file-saver";
import html2canvas from "html2canvas";
import isEqual from "lodash/isEqual";
import React from "react";
import TestatorDisplay from "../components/TestatorDisplay";
import ReactDOM from "react-dom";

// Global declaration for jsPDF (needed before call html())
window.html2canvas = html2canvas;

// Get user token
export function getUserToken() {
  const token = localStorage.usertoken;
  if (token) {
    const decoded = jwt_decode(token);
    return decoded;
  } else {
    return null;
  }
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Upload image file
export function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve(response);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

export function readXmlFile(file) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);

    xhr.addEventListener("load", () => {
      resolve(xhr.responseXML);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseXML);
      reject(error);
    });
  });
}

// Get param config
export function getParamConfig(param) {
  let config = {};
  config["es_host"] = process.env.REACT_APP_ES_HOST;
  config["es_index_wills"] = process.env.REACT_APP_ES_INDEX_WILLS;
  config["es_index_cms"] = process.env.REACT_APP_ES_INDEX_CMS;
  config["es_index_user"] = process.env.REACT_APP_ES_INDEX_USERS;
  config["es_index_testators"] = process.env.REACT_APP_ES_INDEX_TESTATORS;
  config["es_index_places"] = process.env.REACT_APP_ES_INDEX_PLACES;
  config["es_index_units"] = process.env.REACT_APP_ES_INDEX_MILITARY_UNIT;
  config["web_url"] = process.env.REACT_APP_WEB_URL;
  config["web_host"] = process.env.REACT_APP_WEB_HOST;
  return config[param];
}
// Simple query search to send to elasticsearch
export function queryBuilderFunc(queryString) {
  let terms = queryString.split("/");

  if (terms.length > 1) {
    queryString = terms[0] + "+(" + terms[1] + ")|" + terms[0];
  }
  return {
    simple_query_string: {
      query: queryString,
      default_operator: "or"
    }
  };
}

// Get response from url
export function getHttpRequest(url, type = "POST", body = "", async = false) {
  let req = new XMLHttpRequest();
  req.open(type, url, async);
  req.setRequestHeader("Content-type", "application/json");
  req.setRequestHeader("Access-Control-Allow-Headers", "*");
  req.send(body);
  if (req.readyState === XMLHttpRequest.DONE) {
    if (req.status === 200) {
      return req.responseText;
    } else {
      return null;
    }
  }
}

function removeDups(names) {
  let unique = {};
  names.forEach(function(i) {
    if (!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

// Get total hits from host
export function getTotalHits(host) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", host + "/_search?filter_path=hits.total");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve(response.hits.total);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

// Get total hits from host
export function getHits(host, size = null) {
  return new Promise((resolve, reject) => {
    getTotalHits(host).then(res => {
      const totalHits = size ? size : res;
      const total = typeof totalHits === "object" ? totalHits.value : totalHits;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", host + "/_search?size=" + total);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send();
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response.hits.hits);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  });
}

// Get total hits from host
export function getHitsFromQuery(host, query) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", host + "/_search?pretty");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(query);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      const output = response.hits ? response.hits.hits : [];
      resolve(output);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

// Get child from parent ES
export function getChilds(host, id) {
  var query = {
    query: {
      bool: {
        must: [
          {
            has_parent: {
              parent_type: "question",
              query: {
                term: {
                  _id: id
                }
              }
            }
          },
          { term: { texta: "answer" } }
        ]
      }
    }
  };
  var url = host + "/_search";
  //var query = host+"/_search?pretty ";

  const hits = JSON.parse(getHttpRequest(url, JSON.stringify(query))).hits;
  return hits;
}
// Get suggestions
export function getSuggestions(host, field) {
  // Get total hits from host
  const totalHits = getTotalHits(host);
  // Get hashtags from ES
  const hashtags = JSON.parse(
    getHttpRequest(
      host + "/_search?filter_path=" + field + "&size=" + totalHits
    )
  ).hits.hits.map(item => item._source.entities_hashtags_text);
  let array = [];
  hashtags.forEach(function(i) {
    if (i.length > 0) {
      i.forEach(function(j) {
        array.push(j);
      });
    }
  });
  return removeDups(array);
}

// Get suggestions
export function getHitByID(host, id) {
  // Get hashtags from ES
  const results = JSON.parse(getHttpRequest(host + "/_search?q=", "GET"));
  return results;
}

export function addItem(id, removeClick, src, label, childItemsList) {
  var childImgValue = document.createElement("div");
  childImgValue.className = "sk-filter-group-items__value";
  childImgValue.setAttribute("data-key", id);
  var value = document.createElement("img");
  value.setAttribute("src", src);
  let style = "max-width: 45px; max-height: 45px; ";
  if (label === 1) {
    style += "border: 1px solid #C6FF00;";
  } else {
    style += "border: 1px solid #FF3D00;";
  }
  value.setAttribute("style", style);
  value.setAttribute("data-key", id);
  value.addEventListener("click", removeClick, false);
  childImgValue.appendChild(value);
  childItemsList.appendChild(childImgValue);
}

export function removeItem(id, childItemsList) {
  var children = childItemsList.childNodes;
  for (var i = 0; i < children.length; i++) {
    if (children[i].getAttribute("data-key") === id) {
      childItemsList.removeChild(children[i]);
      break;
    }
  }
}

// Create style function for material-ui
export function createStyled(styles, options) {
  function Styled(props) {
    const { children, ...other } = props;
    return children(other);
  }
  Styled.propTypes = {
    children: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };
  return withStyles(styles, options)(Styled);
}
// Create element from html
export function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

// filter key obj
export function filterObj(obj, key) {
  var result = {};
  for (let k in obj) {
    if (k !== key) {
      result[k] = obj[k];
    }
  }
  return result;
}

export function htmlSubstring(s, n) {
  var m,
    r = /<([^>\s]*)[^>]*>/g,
    stack = [],
    lasti = 0,
    result = "";

  //for each tag, while we don't have enough characters
  while ((m = r.exec(s)) && n) {
    //get the text substring between the last tag and this one
    var temp = s.substring(lasti, m.index).substr(0, n);
    //append to the result and count the number of characters added
    result += temp;
    n -= temp.length;
    lasti = r.lastIndex;

    if (n) {
      result += m[0];
      if (m[1].indexOf("/") === 0) {
        //if this is a closing tag, than pop the stack (does not account for bad html)
        stack.pop();
      } else if (m[1].lastIndexOf("/") !== m[1].length - 1) {
        //if this is not a self closing tag than push it in the stack
        stack.push(m[1]);
      }
    }
  }

  //add the remainder of the string, if needed (there are no more tags in here)
  result += s.substr(lasti, n);

  //fix the unclosed tags
  while (stack.length) {
    result += "</" + stack.pop() + ">";
  }

  return result;
}

// Register post function
export const register = async newUser => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/users/register", {
      email: newUser.email,
      user_name: newUser.user_name,
      password: newUser.password
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

// login post function
export const login = async user => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/users/login", {
      email: user.email,
      password: user.password
    });

    return res.data;
  } catch (err) {
    return err;
  }
};

// publish post function
export const publish = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/cms/publish", item);
    return res.data;
  } catch (err) {
    return err;
  }
};

// remove post function
export const removePost = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/cms/removePost", {
      ids: item
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

// update post function
export const updatePost = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/cms/updatePost", item);
    return res.data;
  } catch (err) {
    return err;
  }
};

// update post function
export const updateMyListWills = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/users/updateMyListWills", item);
    return res.data;
  } catch (err) {
    return err;
  }
};

export const updateConfigMail = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/users/updateConfigMail", {
      email_root: item.email_root,
      email: item.email,
      password: item.password
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const generateWillPDF = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/utils/generateWillPDF", item);
    return res.data;
  } catch (err) {
    return err;
  }
};

export const generatePDF = async item => {
  try {
    const host = getParamConfig("web_host");
    const res = await axios.post(host + "/utils/generatePDF", item);
    return res.data;
  } catch (err) {
    return err;
  }
};

export const downloadFile = (url, fileName) => {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = url;

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  a.setAttribute("target", "_blank");
  // Trigger the download by simulating click
  a.dispatchEvent(new MouseEvent("click"));

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
};

export const downloadZip = (content, fileName) => {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = URL.createObjectURL(content);

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
};

export const equalsArray = (array1, array2) => {
  if (!array2) return false;

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) return false;

  for (var i = 0, l = array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].equals(array2[i])) return false;
    } else if (array1[i] instanceof Object && array2[i] instanceof Object) {
      if (!isEqual(array1[i], array2[i])) return false;
    } else if (array1[i] !== array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export function selectText(node) {
  node = document.getElementById(node);

  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}

// convert content of url to data for JSZip
function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
}

// Create & download zip
export function downloadZipFiles(urls, fileName) {
  let zip = new JSZip();
  urls.forEach(url => {
    const file_name = url.slice(url.lastIndexOf("/") + 1);
    zip.file(file_name, urlToPromise(url));
  });

  zip.generateAsync({ type: "blob" }).then(function(content) {
    FileSaver.saveAs(content, fileName);
  });
}

// footer function pdf
/*
function footerPDF() {
  const date = new Date();

  const footer =
    "Export réalisé depuis " +
    getParamConfig("web_url") +
    ", le " +
    date.toLocaleDateString("fr-FR");

  return footer;
}*/

export function generateTestatorHTML(ids) {
  return new Promise(async (resolve, reject) => {
    try {
      let output_html = ids.map(id => "");
      await asyncForEach(ids, async (id, i) => {
        await getHitsFromQuery(
          getParamConfig("es_host") +
            "/" +
            getParamConfig("es_index_testators"),
          JSON.stringify({
            query: {
              term: {
                _id: id
              }
            }
          })
        )
          .then(async data => {
            await getHitsFromQuery(
              getParamConfig("es_host") +
                "/" +
                getParamConfig("es_index_wills"),
              JSON.stringify({
                _source: [
                  "_id",
                  "will_contents.will_date_range",
                  "testator.ref"
                ],
                query: {
                  term: {
                    "testator.ref": data[0]._id
                  }
                }
              })
            )
              .then(hits => {
                ReactDOM.render(
                  <TestatorDisplay
                    id={data[0]["_id"]}
                    data={data[0]._source}
                  />,
                  document.getElementById("testator_none")
                );

                output_html[i] = document.getElementById(
                  "testator_notice"
                ).innerHTML;
              })
              .catch(err => {
                console.log("Erreur :", err);
              });
          })
          .catch(error => {
            console.log("error :", error);
          });
      });

      resolve(output_html);
    } catch (e) {
      reject("error :" + e);
    }
  });
}

export function generateZipPDF(outputsHtml, pdfFilesname) {
  return new Promise(async (resolve, reject) => {
    try {
      let urls = [];
      await asyncForEach(outputsHtml, async (outputHtml, i) => {
        const inputItem = {
          outputHtml: outputHtml,
          filename: pdfFilesname[i]
        };
        await generatePDF(inputItem).then(res => {
          if (res.status === 200) {
            urls.push("http://127.0.0.1/outputPDF/" + pdfFilesname[i] + ".pdf");
            console.log("dans Promise :", urls);
          } else {
            reject(res);
          }
        });

        /*const opt = {
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          margin: 1,
          filename: pdfFilesname[i] + ".pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };
        const output_pdf = html2pdf()
          .set(opt)
          .from(outputHtml)
          .toPdf()
          .get("pdf")
          .then(function(pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            const footer_ = footerPDF();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              pdf.text(footer_, 0.5, pdf.internal.pageSize.getHeight() - 0.6);
              pdf.text(
                String(i) + "/" + String(totalPages),
                pdf.internal.pageSize.getWidth() - 1,
                pdf.internal.pageSize.getHeight() - 0.6
              );
            }
          })
          .output();

        zip.file(pdfFilesname[i] + ".pdf", output_pdf);*/
      });
      /* zip.generateAsync({ type: "blob" }).then(function(content) {
        FileSaver.saveAs(content, filename);
      });*/

      resolve(urls);
    } catch (e) {
      reject(e);
    }
  });
}
/*
 async function generatePDF2(outputHtml, filename) {
  return new Promise((resolve, reject) => {
    try {
      let outputHtml_ =
        '<html lang="fr" xml:lang="fr" xmlns="http://www.w3.org/1999/xhtml"> <head> <title>Testaments De Poilus</title> <meta name="viewport" content="width=device-width, initial-scale=1.0" /></head> <body>';
      outputHtml_ += outputHtml + "</body></html>";
      console.log("generate pdf ...");
      console.log(outputHtml_);
      const opt = {
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        margin: 1,
        filename: filename + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };
      html2pdf()
        .set(opt)
        .from(outputHtml_)
        .toPdf()
        .get("pdf")
        .then(function(pdf) {
          const totalPages = pdf.internal.getNumberOfPages();
          const footer_ = footerPDF();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(footer_, 0.5, pdf.internal.pageSize.getHeight() - 0.6);
            pdf.text(
              String(i) + "/" + String(totalPages),
              pdf.internal.pageSize.getWidth() - 1,
              pdf.internal.pageSize.getHeight() - 0.6
            );
          }
        })
        .save();
      resolve("succes");
    } catch (e) {
      reject("error :" + e);
    }
  });
}*/
/*
async function generateWillPDF2(data, testator_data) {
  return new Promise((resolve, reject) => {
    try {
      const months = [
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
      const listMenu = {
        page: "Page",
        envelope: "Enveloppe",
        codicil: "Codicille"
      };

      let outputHtml =
        '<!DOCTYPE html><html lang="fr" xml:lang="fr" xmlns="http://www.w3.org/1999/xhtml"> <head> <title>Testaments De Poilus</title> <meta name="viewport" content="width=device-width, initial-scale=1.0" /><style> .before { page-break-before: always;} .after { page-break-after: always; } .avoid { page-break-inside: avoid;} </style></head> <body> <div id="root">';

      // Create div infos testateur
      const will_uri =
        getParamConfig("web_url") + "/testament/" + data["will_id"];
      outputHtml +=
        '<div id="will"> <h3> Testament de ' +
        data["testator.forename"] +
        "<span> " +
        data["testator.surname"] +
        "</span></h3>";
      outputHtml +=
        '<p>Permalien dans l’édition numérique : <a  href="' +
        will_uri +
        '" target = "_blank">' +
        will_uri +
        " </a></p>";
      let death_date = Boolean(data["will_contents.death_date"])
        ? new Date(data["will_contents.death_date"])
        : null;

      death_date = Boolean(death_date)
        ? death_date.toLocaleDateString().split("/")
        : null;

      outputHtml += "<p> Mort pour la France ";
      outputHtml += +Boolean(death_date)
        ? " le " +
          death_date[0] +
          " " +
          months[death_date[1] - 1] +
          " " +
          death_date[2]
        : "";
      outputHtml += Boolean(data["will_contents.death_place_norm"])
        ? " à "
        : "";
      outputHtml += Boolean(data["will_contents.death_place_ref"])
        ? '<a href="' +
          getParamConfig("web_url") +
          "/place/" +
          data["will_contents.death_place_ref"] +
          '" target="_blank">' +
          data["will_contents.death_place_norm"] +
          "</a>"
        : data["will_contents.death_place_norm"];
      outputHtml += "</p>";
      let will_date = [];
      if (Boolean(data["will_contents.will_date_range"])) {
        let date_ = new Date(data["will_contents.will_date_range"]["gte"]);
        will_date.push(date_.toLocaleDateString().split("/"));
        if (
          data["will_contents.will_date_range"]["gte"] !==
          data["will_contents.will_date_range"]["lte"]
        ) {
          date_ = new Date(data["will_contents.will_date_range"]["lte"]);
          will_date.push(date_.toLocaleDateString().split("/"));
        }
      }

      if (
        will_date.length > 0 ||
        Boolean(data["will_contents.will_place_norm"])
      ) {
        if (will_date.length === 1) {
          outputHtml +=
            "<p> Testament rédigé le " +
            will_date[0][0] +
            " " +
            months[will_date[0][1] - 1] +
            " " +
            will_date[0][2];
        } else if (will_date.length === 2) {
          outputHtml +=
            "<p> Date de rédaction : " +
            will_date[0][0] +
            " " +
            months[will_date[0][1] - 1] +
            " " +
            will_date[0][2] +
            " et " +
            will_date[1][0] +
            " " +
            months[will_date[1][1] - 1] +
            " " +
            will_date[1][2];
        }
        if (Boolean(data["will_contents.will_place_norm"])) {
          outputHtml += " à ";
          if (Boolean(data["will_contents.will_place_ref"])) {
            outputHtml +=
              '<a href="' +
              getParamConfig("web_url") +
              "/place/" +
              data["will_contents.will_place_ref"] +
              '" target="_blank">' +
              data["will_contents.will_place_norm"] +
              "</a>";
          } else {
            outputHtml += data["will_contents.will_place_norm"];
          }
        }
        outputHtml += "</p>";
      }

      outputHtml +=
        "<p>Cote aux " +
        data["will_identifier.institution"] +
        " : " +
        data["will_identifier.cote"] +
        "</p>";

      outputHtml +=
        "<p>" +
        data["will_physDesc.support"][0].toUpperCase() +
        data["will_physDesc.support"].slice(1) +
        "." +
        data["will_physDesc.handDesc"] +
        ", " +
        data["will_physDesc.dim"]["width"] +
        data["will_physDesc.dim"]["unit"] +
        " x " +
        data["will_physDesc.dim"]["height"] +
        data["will_physDesc.dim"]["unit"] +
        "</p>";
      outputHtml +=
        "<p> Nombre de pages : " + data["will_pages"].length + "</p>";

      outputHtml += "<h4> Les contributeurs :</h4>";
      data["contributions"].forEach((contributor, i) => {
        outputHtml +=
          "<p>" +
          contributor["resp"][0].toUpperCase() +
          contributor["resp"].substring(1) +
          " : " +
          contributor["persName"].join(", ") +
          "</p>";
      });

      outputHtml += "</div>";

      let outputImage = '<div id="image" class="before"> <h4>Image :</h4>';
      let outputTranscription =
        '<div id="transcription"> <h4>Transcription :</h4>';
      let outputEdition =
        '<div id="edition" class="before"> <h4>Edition :</h4>';

      data["will_pages"].forEach((page, i) => {
        outputImage +=
          '<div id="image_' +
          listMenu[page["page_type"].type] +
          page["page_type"].id +
          '" class="after">';
        const title =
          "<h5>" +
          listMenu[page["page_type"].type] +
          " " +
          page["page_type"].id +
          "</h5>";
        outputImage += title + "</div>";
        outputTranscription += title + page["transcription"];
        outputEdition += title + page["edition"];
      });
      outputImage += "</div>";
      outputHtml += outputImage;
      outputTranscription += "</div>";
      outputHtml += outputTranscription;
      outputEdition += "</div>";
      outputHtml += outputEdition;

      // Add testator information
      outputHtml += '<div id="will" class="before">' + testator_data + "</div>";

      outputHtml += "</div></body></html>";
      console.log(outputHtml);
      const opt = {
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".before",
          after: ".after",
          avoid: ".avoid"
        },
        margin: 1,
        filename: data["will_id"] + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf()
        .set(opt)
        .from(outputHtml)
        .toPdf()
        .get("pdf")
        .then(async function(pdf) {
          await asyncForEach(data["will_pages"], async (page, i) => {
            await image2base64(page["picture_url"] + "/full/full/0/default.jpg") // you can also to use url
              .then(response => {
                pdf.setPage(i + 2);
                pdf.addImage(
                  "data:image/jpg;base64," + response,
                  "JPEG",
                  1,
                  2,
                  5.5,
                  6.5
                );
              })
              .catch(error => {
                console.log(error); //Exepection error....
              });
          });
          const totalPages = pdf.internal.getNumberOfPages();
          const footer_ = footerPDF();

          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(footer_, 0.5, pdf.internal.pageSize.getHeight() - 0.6);
            pdf.text(
              String(i) + "/" + String(totalPages),
              pdf.internal.pageSize.getWidth() - 1,
              pdf.internal.pageSize.getHeight() - 0.6
            );
          }

          resolve("succes");
        })
        .save();
    } catch (e) {
      reject("error :" + e);
    }
  });
}*/

export function toDataUrl(src, callback = null, outputFormat = "image/jpg") {
  return new Promise((resolve, reject) => {
    // Create an Image object
    var img = new Image();
    // Add CORS approval to prevent a tainted canvas
    //img.crossOrigin = "Anonymous";
    img.setAttribute("crossOrigin", "anonymous");
    img.setAttribute("Access-Control-Allow-Origin", "*");

    img.onload = function() {
      // Create an html canvas element
      var canvas = document.createElement("canvas");
      // Create a 2d context
      var ctx = canvas.getContext("2d");
      var dataURL;
      // Resize the canavas to the image dimensions
      console.log(" this.width :", this.width);
      console.log(" this.height :", this.height);
      canvas.height = this.height;
      canvas.width = this.width;
      // Draw the image to a canvas
      ctx.drawImage(this, 0, 0);
      // Convert the canvas to a data url
      dataURL = canvas.toDataURL(outputFormat);
      // Return the data url via callback
      //callback(dataURL);
      // Mark the canvas to be ready for garbage
      // collection
      canvas = null;
      resolve(dataURL);
    };
    // Load the image
    img.src = src;
    // make sure the load event fires for cached images too
    if (img.complete || img.complete === undefined) {
      // Flush cache
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      // Try again
      img.src = src;
    }
  });
}
/*
function getHTML(url) {
  return new Promise((resolve, reject) => {
    // Feature detection
    if (!window.XMLHttpRequest) return;

    // Create new request
    var xhr = new XMLHttpRequest();
    // Get the HTML
    xhr.open("GET", url);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
    xhr.responseType = "document";
    xhr.send();

    xhr.addEventListener("load", () => {
      resolve(xhr.response);
    });
    xhr.addEventListener("error", () => {
      reject(xhr);
    });
  });
}*/

export function imageLoader(url) {
  return new Promise((resolve, reject) => {
    let blob = null;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
    xhr.addEventListener("load", () => {
      blob = xhr.response;
      let file = new File([blob], this.state.url_image);
      resolve(file);
    });
    xhr.addEventListener("error", () => {
      reject(xhr);
    });
  });
}
