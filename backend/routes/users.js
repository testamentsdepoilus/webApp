const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const SimpleCrypto = require("simple-crypto-js").default;
require("dotenv").config();

// use bodyParser to parse application/json content-type
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// enhance your app security with Helmet
router.use(helmet());
// enable all CORS requests
router.use(cors());
//log HTTP requests
router.use(morgan("combined"));

var logger = require("../logger").Logger;

router.use(function timeLog(req, res, next) {
  // this is an example of how you would call our new logging system to log an info message
  logger.info("Log USERS");
  next();
});

const simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY);
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: process.env.host_es });
const indexES = process.env.index_users;

let { PythonShell } = require("python-shell");

let options = {
  mode: "text",
  scriptPath: process.env.py_path,
};

let auth = {};
client.search(
  {
    index: indexES,
    body: {
      query: {
        match_all: {},
      },
    },
  },
  (err, result) => {
    if (err) {
      if (err.message.includes("index_not_found_exception")) {
        options["args"] = [
          "--host=" + process.env.host_es,
          "--index=" + process.env.index_users,
          "--file=" + process.env.mapping_path + "tdp_users_mapping.json",
        ];
        PythonShell.run("createMapping.py", options, function (err, results) {
          if (err) {
            logger.error("creation mapping :  => " + err);
          } else {
            // results is an array consisting of messages collected during execution
            results_ = JSON.parse(results);

            if (results_.status === 200) {
              // Add default user admin
              const userData = {
                first_name: "admin",
                last_name: "admin",
                user_name: "admin",
                email: process.env.user_admin,
                password: process.env.pass_admin,
                created: new Date(),
                confirmed: true,
                isAdmin: true,
              };
              bcrypt.hash(userData.password, 10, (err, hash) => {
                userData.password = hash;
                client.index(
                  {
                    index: indexES,
                    body: userData,
                  },
                  (err, result) => {
                    if (err) {
                      logger.error("Erreur indexation :  => " + err);
                    }
                  }
                );
              });
            } else {
              logger.error("Erreur dans le script python => " + results_.err);
            }
          }
        });
      } else {
        console.log(err);
      }

      logger.error("ES connexion au serveur a échoué => " + err);
    } else {
      hits = result.body.hits.hits;
      if (hits.length > 0) {
        const admin = hits.filter((hit) => {
          return (
            hit._source["isAdmin"] === true &&
            Boolean(hit._source["auth_config"])
          );
        });

        if (admin.length > 0) {
          auth = admin[0]._source["auth_config"];
        }
      } else {
        // Add default user admin
        const userData = {
          first_name: "admin",
          last_name: "admin",
          user_name: "admin",
          email: process.env.user_admin,
          password: process.env.pass_admin,
          created: new Date(),
          confirmed: true,
          isAdmin: true,
        };
        bcrypt.hash(userData.password, 10, (err, hash) => {
          userData.password = hash;
          client.index(
            {
              index: indexES,
              body: userData,
            },
            (err, result) => {
              if (err) {
                logger.error("Erreur indexation :  => " + err);
              }
            }
          );
        });
      }
    }
  }
);

/* POST register user listing. */
router.post("/register", function (req, res, next) {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    created: today,
    confirmed: false,
    isAdmin: false,
    myBackups: {
      myWills: [],
      myTestators: [],
      myPlaces: [],
      myUnits: [],
      mySearches: [],
    },
  };
  client.search(
    {
      index: indexES,
      body: {
        query: {
          match: {
            email: {
              query: userData.email,
              operator: "and",
            },
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, err: "ES connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;
        if (hits.length === 0) {
          bcrypt.hash(userData.password, 10, (err, hash) => {
            userData.password = hash;
            try {
              let emailToken = jwt.sign(userData, process.env.SECRET_KEY, {
                expiresIn: "1d",
              });

              if (typeof auth === "object" && Object.keys(auth).length > 0) {
                let transporter = nodemailer.createTransport(
                  smtpTransport({
                    host: "smtp2.ensea.fr", // hostname
                    secureConnection: true, // TLS requires secureConnection to be false
                    port: 465, // port for secure SMTP
                    tls: {
                      rejectUnauthorized: false,
                    },
                    auth: Boolean(auth.email)
                      ? {
                          user: auth.email,
                          pass: simpleCrypto.decrypt(auth.password),
                        }
                      : {},
                  })
                );

                // verify connection configuration
                transporter.verify(function (error, success) {
                  if (error) {
                    res.send({ status: 400, err: error });
                  } else {
                    const link =
                      process.env.host + "/users/confirmation/" + emailToken;
                    const html =
                      "<div>Bonjour " +
                      userData.user_name +
                      " <br/>" +
                      "Merci de valider votre inscription au site d’édition numérique des testaments de Poilus en cliquant ici : <br/> <br/>" +
                      "<a href=" +
                      link +
                      " style=\"text-align: center; font-family: 'Open Sans', 'Arial', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'sans-serif'; color: #fff; background-color: #ee4e8b; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; width: auto; line-height: 1.6; margin: 20px auto; padding: 15px 40px 15px 30px;\" > oui je valide mon inscription </a ></div>";

                    let mailOptions = {
                      from: auth.email,
                      to: userData.email,
                      subject: "Validation d'inscription",
                      html: html,
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                      if (err) {
                        res.send({ status: 400, err: err.message });
                      } else {
                        client.index(
                          {
                            index: indexES,
                            body: userData,
                          },
                          (err, result) => {
                            if (err) {
                              res.send({
                                status: 400,
                                err: "ES Connexion au serveur a échoué !",
                              });
                            } else {
                              res.send({
                                status: 200,
                                res: userData.email + " registered",
                              });
                            }
                          }
                        );
                      }
                    });
                  }
                });

                transporter.close();
              } else {
                res.send({
                  status: 400,
                  err: "Merci de configurer le serveur d'envoie d'e-mail !",
                });
              }
            } catch (e) {
              res.send({
                status: 400,
                err: "catch : " + e,
              });
            }
          });
        } else {
          res.send({
            status: 400,
            err:
              "L'utilisateur avec l'adresse e-mail (" +
              userData.email +
              ") est déjà enregistré !",
          });
        }
      }
    }
  );
});

/* POST login user listing. */
router.post("/login", (req, res) => {
  logger.info("Login function");
  client.search(
    {
      index: indexES,
      body: {
        query: {
          match: {
            email: {
              query: req.body.email,
              operator: "and",
            },
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        res.json({ status: 400, error: "Connexion au serveur a échoué !" });
        logger.error("users.js => " + err);
      } else {
        hits = result.body.hits.hits;

        if (hits.length === 1) {
          if (
            bcrypt.compareSync(req.body.password, hits[0]._source["password"])
          ) {
            if (hits[0]._source["confirmed"]) {
              let token = jwt.sign(hits[0]._source, process.env.SECRET_KEY, {
                expiresIn: 1440,
              });
              res.json({ status: 200, res: token });
            } else {
              res.json({
                status: 400,
                error:
                  "Vérifier votre boîte mail et confirmer votre inscription !",
              });
            }
          } else {
            res.json({ status: 400, error: "Mot de passe incorrect !" });
          }
        } else {
          res.json({ status: 400, error: "Identifiant incorrect !" });
        }
      }
    }
  );
});

// Post confirme user listning
router.get("/confirmation/:token", async (req, res) => {
  try {
    let user = jwt.verify(req.params.token, process.env.SECRET_KEY);
    client.search(
      {
        index: indexES,
        body: {
          query: {
            match: {
              email: {
                query: user.email,
                operator: "and",
              },
            },
          },
        },
      },
      (err, result) => {
        if (err) {
          logger.error("users.js => " + err);
          res.json({ status: 400, error: "Connexion au serveur a échoué !" });
        } else {
          hits = result.body.hits.hits;
          if (hits.length === 1) {
            let isFailed = false;
            client.update({
              index: indexES,
              id: hits[0]._id,
              body: {
                doc: {
                  confirmed: true,
                },
              },
            }),
              (err) => {
                if (err) {
                  isFailed = true;
                }
              };
            if (isFailed) {
              res.send({
                status: 400,
                err: "ES Connexion au serveur a échoué !" + err,
              });
            } else {
              res.redirect("http://patrimeph.ensea.fr/testaments-de-poilus");
            }
          }
        }
      }
    );
  } catch (e) {
    res.send({ status: 400, err: e });
  }
});

/* POST update  */
router.post("/updateMyListWills", function (req, res, next) {
  let data = {};
  switch (Object.keys(req.body)[1]) {
    case "myWills":
      data = { myWills: req.body.myWills };
      break;
    case "myTestators":
      data = { myTestators: req.body.myTestators };
      break;
    case "myPlaces":
      data = { myPlaces: req.body.myPlaces };
      break;
    case "myUnits":
      data = { myUnits: req.body.myUnits };
      break;
    case "mySearches":
      data = { mySearches: req.body.mySearches };
      break;
    case "myBackups":
      data = { myBackups: req.body.myBackups };
      break;
    default:
      break;
  }

  client.search(
    {
      index: indexES,
      body: {
        query: {
          match: {
            email: {
              query: req.body.email,
              operator: "and",
            },
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, error: "Connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;

        if (hits.length > 0) {
          let isFailed = false;
          client.update({
            index: indexES,
            id: hits[0]._id,
            body: {
              doc: data,
            },
          }),
            (err) => {
              if (err) {
                isFailed = true;
              }
            };

          if (isFailed) {
            res.send({
              status: 400,
              err: "Connexion au serveur a échoué !" + err,
            });
          } else {
            res.send({
              status: 200,
              mess: "Ajouter à la liste !",
            });
          }
        }
      }
    }
  );
});

router.post("/updateConfigMail", function (req, res, next) {
  const email_root = req.body.email_root;
  const email = req.body.email;
  const password = req.body.password;
  console.log("config begin ...");
  client.search(
    {
      index: indexES,
      body: {
        query: {
          match_all: {},
        },
      },
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, error: "Connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;
        const idx = hits.findIndex((hit) => {
          return hit._source["email"] === email_root;
        });

        if (idx !== -1) {
          let isFailed = false;
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "smtp.oronge.fr", // hostname
              secureConnection: false, // TLS requires secureConnection to be false
              port: 25, // port for secure SMTP
              tls: {
                rejectUnauthorized: false,
              },
              auth: {
                user: email, // generated ethereal user
                pass: password, // generated ethereal password
              },
            })
          );

          console.log("verify begin ...");
          // verify connection configuration
          transporter.verify(function (error, success) {
            console.log("Verify ...", error);
            if (error) {
              res.send({
                status: 400,
                err: "Erreur avec authentification serveur oronge:" + error,
              });
            } else {
              console.log("update email config ...");
              client.update({
                index: indexES,
                id: hits[idx]._id,
                body: {
                  doc: {
                    auth_config: {
                      email: email,
                      password: simpleCrypto.encrypt(password),
                    },
                  },
                },
              }),
                (err) => {
                  if (err) {
                    isFailed = true;
                  }
                };

              if (isFailed) {
                res.send({
                  status: 400,
                  err: "toto Connexion au serveur a échoué !" + err,
                });
              } else {
                auth = {
                  email: email,
                  password: simpleCrypto.encrypt(password),
                };
                res.send({
                  status: 200,
                  mess: "Votre configuration a été bien mis à jour !",
                });
              }
            }
          });
        }
      }
    }
  );
});

/* reset user password. */
router.post("/resetPassWord", function (req, res, next) {
  client.search(
    {
      index: indexES,
      body: {
        query: {
          match: {
            email: {
              query: req.body.email,
              operator: "and",
            },
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, error: "ES connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;

        if (hits.length === 0) {
          res.send({
            status: 400,
            error: "L'adresse e-mail " + req.body.email + " n'est pas valide !",
          });
        } else {
          try {
            let emailToken = jwt.sign(
              { email: req.body.email },
              process.env.SECRET_KEY,
              {
                expiresIn: "24h",
              }
            );

            if (typeof auth === "object" && Object.keys(auth).length > 0) {
              let transporter = nodemailer.createTransport(
                smtpTransport({
                  host: "smtp2.ensea.fr", // hostname
                  secureConnection: true, // TLS requires secureConnection to be false
                  port: 465, // port for secure SMTP
                  tls: {
                    rejectUnauthorized: false,
                  },
                  auth: Boolean(auth.email)
                    ? {
                        user: auth.email,
                        pass: simpleCrypto.decrypt(auth.password),
                      }
                    : {},
                })
              );
              /*  let transporter = nodemailer.createTransport({
                host: "smtp2.ensea.fr", // hostname
                port: 465, // port for secure SMTP
                secure: true,
                auth: Boolean(auth.email)
                  ? {
                      user: auth.email,
                      pass: simpleCrypto.decrypt(auth.password),
                    }
                  : {},
              });*/

              // verify connection configuration
              transporter.verify(function (error, success) {
                if (error) {
                  res.send({
                    status: 400,
                    error: "Erreur serveur d'envoie de mail !",
                  });
                } else {
                  const link =
                    process.env.host_web + "/reinitialiserMDP/" + emailToken;
                  const html =
                    "<div>Bonjour " +
                    hits[0]._source["user_name"] +
                    " <p>" +
                    "Vous avez demandé la réinitialisation de votre mot de passe d'accès à votre espace personnel du site d’édition numérique des testaments de Poilus.  </p>" +
                    "<p> Si vous n'êtes pas à l'origine de cette demande vous pouvez ignorer ce message. </p>" +
                    "<p> Pour réinitialiser votre mot de passe, cliquez sur le lien suivant et suivez les instructions : </p>" +
                    "<br/> <br/> <a href=" +
                    link +
                    " style=\"text-align: center; font-family: 'Open Sans', 'Arial', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'sans-serif'; color: #fff; background-color: #ee4e8b; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; width: auto; line-height: 1.6; margin: 20px auto; padding: 15px 40px 15px 30px;\" > Réinitialiser mon mot de passe </a ></div>";

                  let mailOptions = {
                    from: auth.email,
                    to: req.body.email,
                    subject:
                      "Votre demande de réinitialisation de mot de passe",
                    html: html,
                  };
                  transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                      res.send({ status: 400, error: err.message });
                    } else {
                      res.send({
                        status: 200,
                        res:
                          "Votre demande de réinitialisation de mot a été envoyé à votre adresse e-mail.",
                      });
                    }
                  });
                }
              });

              transporter.close();
            } else {
              res.send({
                status: 400,
                error: "Merci de configurer le serveur d'envoie d'e-mail !",
              });
            }
          } catch (e) {
            res.send({
              status: 400,
              error: "catch : " + e,
            });
          }
        }
      }
    }
  );
});

// update user password
router.post("/updateMDP", async (req, res) => {
  try {
    const user = jwt.verify(req.body.email, process.env.SECRET_KEY);
    client.search(
      {
        index: indexES,
        body: {
          query: {
            match: {
              email: {
                query: user.email,
                operator: "and",
              },
            },
          },
        },
      },
      (err, result) => {
        if (err) {
          res.json({ status: 400, error: "Connexion au serveur a échoué !" });
        } else {
          hits = result.body.hits.hits;

          if (hits.length === 1) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              const new_password = hash;
              let isFailed = false;
              client.update({
                index: indexES,
                id: hits[0]._id,
                body: {
                  doc: {
                    password: new_password,
                  },
                },
              }),
                (err) => {
                  if (err) {
                    isFailed = true;
                  }
                };
              if (isFailed) {
                res.send({
                  status: 400,
                  err: "ES Connexion au serveur a échoué !" + err,
                });
              } else {
                res.send({
                  status: 200,
                  mess: "Votre mot de passe a été bien mis à jour !",
                });
              }
            });
          }
        }
      }
    );
  } catch (e) {
    res.send({ status: 400, err: e });
  }
});

// update user roles
router.post("/updateRole", async (req, res) => {
  try {
    const email = req.body.email;

    client.search(
      {
        index: indexES,
        body: {
          query: {
            match: {
              email: {
                query: email,
                operator: "and",
              },
            },
          },
        },
      },
      (err, result) => {
        if (err) {
          res.json({ status: 400, error: "Connexion au serveur a échoué !" });
        } else {
          hits = result.body.hits.hits;

          if (hits.length === 1) {
            let isFailed = false;
            client.update({
              index: indexES,
              id: hits[0]._id,
              body: {
                doc: {
                  isAdmin: req.body.role,
                },
              },
            }),
              (err) => {
                if (err) {
                  isFailed = true;
                }
              };
            if (isFailed) {
              res.send({
                status: 400,
                err: "ES Connexion au serveur a échoué !" + err,
              });
            } else {
              res.send({
                status: 200,
                mess: "Votre mot de passe a été bien mis à jour !",
              });
            }
          }
        }
      }
    );
  } catch (e) {
    res.send({ status: 400, err: e });
  }
});

module.exports = router;
