import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import jwt_decode from "jwt-decode";
import JSZipUtils from "jszip-utils";
import JSZip from "jszip";
import FileSaver from "file-saver";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import isEqual from "lodash/isEqual";

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

export const downloadFile = (url, fileName) => {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = url;

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

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
        resolve(data);
      }
    });
  });
}

// Create & download zip
export function downloadZipFiles(urls, fileName) {
  var zip = new JSZip();
  urls.forEach(url => {
    const file_name = url.slice(url.lastIndexOf("/") + 1);
    zip.file(file_name, urlToPromise(url));
  });

  zip.generateAsync({ type: "blob" }).then(function(content) {
    FileSaver.saveAs(content, fileName);
  });
}

export function generatePDF(data) {
  let doc = new jsPDF("p", "pt", "letter");

  const listMenu = {
    page: "Page",
    envelope: "Enveloppe",
    codicil: "Codicille"
  };
  let outputHtml =
    '<div style="position: absolute; width: 35em; padding: 20px"> <h4 style=" text-align: center; margin-bottom: 10px; font-weight: bold;"> ' +
    data["will_identifier.name"] +
    "</h4>";

  /*let outputIdentity =
    '<div id="identity" style="margin-top: 5%; margin-left: 5%; width: 70%;">';
  outputIdentity +=
    "<p>Testament de " +
    "<a href={" +
    getParamConfig("web_url") +
    "/testateur/" +
    data["testator.ref"] +
    '} target="_blank">' +
    data["testator.name"] +
    "</a></p>";
  outputIdentity += '<p>Mort pour la france';
  */
  let outputImage =
    '<div id="image" style="margin-top: 5%; margin-left: 5%; width: 70%;"> <h4>Image :</h4>';
  let outputTranscription =
    '<div id="transcription" style="margin-top: 5%; margin-left: 5%; width: 70%; font-size: 12px;"> <h4>Transcription :</h4>';
  let outputEdition =
    '<div id="edition" style="margin-top: 5%; margin-left: 5%; width: 70%; font-size: 12px;";> <h4>Edition :</h4>';
  data["will_pages"].forEach(page => {
    const title =
      "<h5>[" +
      listMenu[page["page_type"].type] +
      " " +
      page["page_type"].id +
      "]</h5>";
    outputImage += title;
    outputImage +=
      '<img src="' +
      page["picture_url"] +
      "/full/full/0/default.jpg" +
      '" style="display: block;  margin-left: auto; margin-right: auto; width: 50%; height: 25%"></img>';
    outputTranscription += title;
    outputTranscription += page["transcription"];
    outputEdition += title;
    outputEdition += page["edition"];
  });
  outputImage += '</div> <hr width="80%">';
  outputHtml += outputImage;
  outputTranscription += '</div> <hr width="80%">';
  outputHtml += outputTranscription;
  outputEdition += "</div>";
  outputHtml += outputEdition;
  outputHtml += "</div>";

  //let frag = document.createRange().createContextualFragment(outputHtml);

  /*const fs = require("fs");
  const conversion = require("phantom-html-to-pdf");
  conversion({ html: outputHtml }, function(err, pdf) {
    const output = fs.createWriteStream(data["will_id"] + ".pdf");
    pdf.stream.pip(output);
  });*/

  doc.html(outputHtml, {
    callback: function(doc) {
      doc.save(data["will_id"] + ".pdf");
    }
  });
}

export function toDataUrl(src, callback, outputFormat) {
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
    canvas.height = this.height;
    canvas.width = this.width;
    // Draw the image to a canvas
    ctx.drawImage(this, 0, 0);
    // Convert the canvas to a data url
    dataURL = canvas.toDataURL(outputFormat);
    // Return the data url via callback
    callback(dataURL);
    // Mark the canvas to be ready for garbage
    // collection
    canvas = null;
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
}

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
