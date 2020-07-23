const express = require("express");
const router = express.Router();
const cors = require("cors");
const fs = require("fs");
const resolve = require("path").resolve;
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: process.env.host_es });
const es_index = process.env.index_cms;

var logger = require("../logger").Logger;

router.use(function timeLog(req, res, next) {
  // this is an example of how you would call our new logging system to log an info message
  logger.info("Log CMS");
  next();
});

let { PythonShell } = require("python-shell");

let options = {
  mode: "text",
  scriptPath: process.env.py_path,
};

router.use(cors());
//("/home/adoula/myProjects/testaments_de_poilus/dev/webApp/backend/app.js");

const formData = require("express-form-data");
router.use(formData.parse());

/* POST publish  */
router.post("/publish", function (req, res, next) {
  client.index(
    {
      index: es_index,
      body: req.body,
    },
    (err, result) => {
      if (err) {
        res.send({
          status: 400,
          err: "ES Connexion au serveur a échoué !" + err,
        });
      } else {
        res.send({
          status: 200,
          mess: "Votre article a été publié !",
        });
      }
    }
  );
});

/* POST delete  */
router.post("/removePost", function (req, res, next) {
  const data = {
    ids: req.body.ids,
  };

  let isFailed = false;
  data.ids.forEach((id) => {
    client.delete(
      {
        index: es_index,
        id: id,
      },
      (err, result) => {
        if (err) {
          isFailed = true;
        }
      }
    );
  });

  if (isFailed) {
    res.send({
      status: 400,
      err: "ES Connexion au serveur a échoué !",
    });
  } else {
    res.send({
      status: 200,
      mess: "Vos éléments ont été supprimé !",
    });
  }
});

/* POST update  */
router.post("/updatePost", function (req, res, next) {
  const ids = req.body.id;
  const doc = req.body.doc;

  let isFailed = false;
  let i = 0;
  for (let id of ids) {
    client.update({
      index: es_index,
      id: id,
      body: {
        doc: doc[i],
      },
    }),
      (err) => {
        if (err) {
          isFailed = true;
        }
      };
    i++;
  }
  if (isFailed) {
    res.send({
      status: 400,
      err: "Connexion au serveur a échoué !" + err,
    });
  } else {
    res.send({
      status: 200,
      mess: "Votre post a été mise à jour !",
    });
  }
});

/* POST update index ES*/
router.post("/updateES", function (req, res, next) {
  switch (req.body.action) {
    case "add":
      let pyScript = "indexTei.py";
      options["args"] = [
        "--host=" + req.body.host,
        "--index=" + req.body.index,
      ];
      let file_path = process.env.notices_path;

      switch (req.body.index) {
        case "tdp_testators":
          pyScript = "indexTestator.py";
          break;
        case "tdp_places":
          pyScript = "indexPlaces.py";
          break;
        case "tdp_military_unit":
          pyScript = "indexMilitary.py";
          break;
        case "tdp_wills":
          pyScript = "indexTei.py";
          file_path = process.env.wills_path;
          options["args"].push(
            "--placeFile=" +
              resolve(
                process.env.notices_path +
                  "contextualEntity_place_2019-11-06_03-28-52.xml"
              )
          );
          options["args"].push(
            "--persFile=" +
              resolve(
                process.env.notices_path +
                  "contextualEntity_person_2019-11-06_04-04-43.xml"
              )
          );

          options["args"].push("--file=" + resolve("pyScripts/config.json"));
          break;
      }

      if (req.files.myFiles !== undefined) {
        let will_files = "--data=";
        if (Array.isArray(req.files.myFiles)) {
          req.files.myFiles.forEach((file) => {
            fs.copyFileSync(file.path, resolve(file_path + file.name));

            will_files += resolve(file_path + file.name) + " ";
          });
          options["args"].push(will_files);

          PythonShell.run(pyScript, options, function (err, results) {
            if (err) {
              res.send({
                status: 400,
                err: "Connexion au serveur a échoué !" + err,
              });
            } else {
              // results is an array consisting of messages collected during execution
              results_ = JSON.parse(results);
              if (results_.status === 200) {
                res.send({
                  status: 200,
                  mess: "Success !",
                });
              } else {
                res.send({
                  status: 400,
                  err:
                    "Le processus du fichier TEI <" +
                    results_.res +
                    "> a échoué",
                });
              }
            }
          });
        } else {
          fs.copyFileSync(
            req.files.myFiles.path,
            file_path + req.files.myFiles.name
          );
          console.log(req.files.myFiles.name + " was copied !");
          will_files += resolve(file_path + req.files.myFiles.name);
          options["args"].push(will_files);

          PythonShell.run(pyScript, options, function (err, results) {
            if (err) {
              res.send({
                status: 400,
                err: "Connexion au serveur a échoué !" + err,
              });
            } else {
              // results is an array consisting of messages collected during execution
              results_ = JSON.parse(results);
              if (results_.status === 200) {
                res.send({
                  status: 200,
                  mess: "Success !",
                });
              } else {
                res.send({
                  status: 400,
                  err:
                    "Le processus du fichier TEI <" +
                    results_.res +
                    "> a échoué",
                });
              }
            }
          });
        }
      }
      break;
    case "create":
      options["args"] = [
        "--host=" + req.body.host,
        "--index=" + req.body.index,
      ];
      let mapping_file = "--file=";
      switch (req.body.index) {
        case "tdp_wills":
          mapping_file += process.env.mapping_path + "/tdp_wills_mapping.json";
          break;
        case "tdp_testators":
          mapping_file +=
            process.env.mapping_path + "tdp_testators_mapping.json";
          break;
        case "tdp_places":
          mapping_file += process.env.mapping_path + "tdp_places_mapping.json";
          break;
        case "tdp_military_unit":
          mapping_file +=
            process.env.mapping_path + "tdp_militaryUnits_mapping.json";
          break;
        case "tdp_cms":
          mapping_file += process.env.mapping_path + "tdp_cms_mapping.json";
          break;
        case "tdp_users":
          mapping_file += process.env.mapping_path + "tdp_users_mapping.json";
          break;
      }
      options["args"].push(mapping_file);

      PythonShell.run("createMapping.py", options, function (err, results) {
        if (err) {
          res.send({
            status: 400,
            err: err,
          });
        } else {
          // results is an array consisting of messages collected during execution
          results_ = JSON.parse(results);
          if (results_.status === 200) {
            res.send({
              status: 200,
              mess: "Success !",
            });
          } else {
            res.send({
              status: 400,
              err: results_.err,
            });
          }
        }
      });
      break;
    case "remove":
      const es_client = new Client({ node: req.body.host });
      es_client.indices.delete(
        {
          index: req.body.index,
        },
        (err, result) => {
          if (err) {
            res.send({
              status: 400,
              err: "Erreur: " + err,
            });
          } else {
            res.send({
              status: 200,
              mess: "l'index <" + req.body.index + "> a été supprimé",
            });
          }
        }
      );
      break;
  }
});

router.get("/getESHost", function (req, res, next) {
  res.send(process.env.host_es);
});

module.exports = router;
