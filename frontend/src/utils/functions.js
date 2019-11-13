import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import jwt_decode from "jwt-decode";

// Get user token
export function getUserToken() {
  const token = sessionStorage.usertoken;
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

// Get param config
export function getParamConfig(param) {
  let config = {};
  config["es_host"] = "http://127.0.0.1:9200";
  config["es_index_wills"] = "tdp_wills";
  config["es_index_cms"] = "tdp_cms";
  config["es_index_user"] = "tde_users";
  config["web_url"] = "http://localhost:3000"; //"http://patrimeph.ensea.fr/testaments-de-poilus";
  config["web_host"] = "http://patrimeph.ensea.fr/tdp";
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
  req.send(body);
  if (req.status === 200) {
    return req.responseText;
  } else {
    return null;
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
  const totalHits = JSON.parse(
    getHttpRequest(host + "/_search?filter_path=hits.total")
  ).hits.total;
  return totalHits;
}

// Get total hits from host
export function getHits(host, size = null) {
  const totalHits = size ? size : getTotalHits(host);
  const total = typeof totalHits === "object" ? totalHits.value : totalHits;
  const hits = JSON.parse(getHttpRequest(host + "/_search?size=" + total)).hits;
  return hits.hits;
}

// Get total hits from host
export function getHitsFromQuery(host, query) {
  const hits = JSON.parse(
    getHttpRequest(host + "/_search?pretty", "POST", query)
  ).hits;
  return hits.hits;
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
    const res = await axios.post("http://127.0.0.1:3005/users/register", {
      email: newUser.email,
      user_name: newUser.user_name,
      password: newUser.password
    });
    return res.data;
  } catch (err) {
    console.log("error rester :", err);
    return err;
  }
};

// login post function
export const login = async user => {
  try {
    const res = await axios.post("http://127.0.0.1:3005/users/login", {
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
    const res = await axios.post("http://127.0.0.1:3005/cms/publish", {
      title: item.title,
      summary: item.summary,
      detail: item.detail,
      type: item.type,
      author: item.author
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

// publish post function
export const removePost = async item => {
  try {
    const res = await axios.post("http://127.0.0.1:3005/cms/removePost", {
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
    const res = await axios.post("http://127.0.0.1:3005/cms/updatePost", {
      id: item.id,
      title: item.title,
      summary: item.summary,
      detail: item.detail,
      type: item.type,
      author: item.author
    });
    console.log("res :", res);
    return res.data;
  } catch (err) {
    return err;
  }
};

// update post function
export const updateMyListWills = async item => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:3005/users/updateMyListWills",
      {
        email: item.email,
        myWills: item.myWills
      }
    );
    return res.data;
  } catch (err) {
    console.log("err dans catch :", err);
    return err;
  }
};
