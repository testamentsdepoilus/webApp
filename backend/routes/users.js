const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://127.0.0.1:9200" }); //http://patrimeph.ensea.fr/es700
const indexES = "tdp_users";

// use bodyParser to parse application/json content-type
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// enhance your app security with Helmet
router.use(helmet());
// enable all CORS requests
router.use(cors());
//log HTTP requests
router.use(morgan("combined"));

process.env.SECRET_KEY = "secret";

/* POST register user listing. */
router.post("/register", function(req, res, next) {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    created: today,
    confirmed: true,
    isRoot: true,
    myWills: [],
    mySearch: []
  };

  client.search(
    {
      index: indexES,
      body: {
        query: {
          match_all: {}
        }
      }
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, err: "ES connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;
        const idx = hits.findIndex(hit => {
          return hit._source["email"] === userData.email;
        });
        if (idx === -1) {
          bcrypt.hash(userData.password, 10, (err, hash) => {
            userData.password = hash;
            client.index(
              {
                index: indexES,
                body: userData
              },
              (err, result) => {
                if (err) {
                  res.send({
                    status: 400,
                    err: "ES Connexion au serveur a échoué !"
                  });
                } else {
                  try {
                    /* let emailToken = jwt.sign(
                      userData,
                      process.env.SECRET_KEY,
                      {
                        expiresIn: 1440
                      }
                    );
                    

                     let transporter = nodemailer.createTransport({
                      host: "smtp-mail.outlook.com", // hostname
                      secureConnection: false, // TLS requires secureConnection to be false
                      port: 587, // port for secure SMTP
                      tls: {
                        ciphers: "SSLv3"
                      },
                      auth: {
                        user: "tdp_dev@outlook.fr", // generated ethereal user
                        pass: "tdp@2019" // generated ethereal password
                      }
                    });
                    const link =
                      "http://127.0.0.1:3005/users/confirmation/" + emailToken;
                    const html =
                      "<div>Bonjour " +
                      userData.user_name +
                      " <br/>" +
                      "Merci de valider votre inscription en cliquant ici : <br/> <br/>" +
                      "<a href=" +
                      link +
                      " style=\"text-align: center; font-family: 'Open Sans', 'Arial', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'sans-serif'; color: #fff; background-color: #ee4e8b; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; width: auto; line-height: 1.6; margin: 20px auto; padding: 15px 40px 15px 30px;\" > Oui c'est mon e-mail </a ></div>";

                    let mailOptions = {
                      from: "tdp_dev@outlook.fr",
                      to: userData.email,
                      subject: "Validation d'inscription",
                      html: html
                    };

                    transporter.sendMail(mailOptions, function(err, info) {
                      if (err) {
                        res.send({ status: 400, err: err.message });
                      }

                      res.send({
                        status: 200,
                        res: userData.email + " registered"
                      });
                    });
                    transporter.close();*/

                    res.send({
                      status: 200,
                      res: userData.email + " registered"
                    });
                  } catch (e) {
                    res.send({
                      status: 400,
                      err: "catch : " + e
                    });
                  }
                }
              }
            );
          });
        } else {
          res.send({
            status: 400,
            err:
              "L'utilisateur avec l'adresse email (" +
              userData.email +
              ") est déjà enregistré !"
          });
        }
      }
    }
  );
});

/* POST login user listing. */
router.post("/login", (req, res) => {
  client.search(
    {
      index: indexES,
      body: {
        query: {
          match_all: {}
        }
      }
    },
    (err, result) => {
      if (err) {
        res.json({ status: 400, error: "Connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;

        const idx = hits.findIndex(hit => {
          return hit._source["email"] === req.body.email;
        });
        if (idx !== -1) {
          if (
            bcrypt.compareSync(req.body.password, hits[idx]._source["password"])
          ) {
            let token = jwt.sign(hits[idx]._source, process.env.SECRET_KEY, {
              expiresIn: 1440
            });
            res.json({ status: 200, res: token });
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
            match_all: {}
          }
        }
      },
      (err, result) => {
        if (err) {
          res.json({ status: 400, error: "Connexion au serveur a échoué !" });
        } else {
          hits = result.body.hits.hits;
          const idx = hits.findIndex(hit => {
            return hit._source["email"] === user.email;
          });

          if (idx !== -1) {
            client.update({
              index: indexES,
              id: hits[idx]._id,
              body: {
                doc: {
                  confirmed: true
                }
              }
            }),
              (err, result) => {
                if (err) {
                  res.send({
                    status: 400,
                    err: "ES Connexion au serveur a échoué !" + err
                  });
                } else {
                  res.redirect("http://localhost:3000/search");
                }
              };
          }
        }
      }
    );
  } catch (e) {
    res.json({ status: 400, err: e });
  }
});

/* POST update  */
router.post("/updateMyListWills", function(req, res, next) {
  const email = req.body.email;
  const myWills = req.body.myWills;

  client.search(
    {
      index: indexES,
      body: {
        query: {
          match_all: {}
        }
      }
    },
    (err, result) => {
      if (err) {
        res.send({ status: 400, error: "Connexion au serveur a échoué !" });
      } else {
        hits = result.body.hits.hits;
        const idx = hits.findIndex(hit => {
          return hit._source["email"] === email;
        });

        if (idx !== -1) {
          let isFailed = false;
          client.update({
            index: indexES,
            id: hits[idx]._id,
            body: {
              doc: {
                myWills: myWills
              }
            }
          }),
            err => {
              if (err) {
                isFailed = true;
              }
            };

          if (isFailed) {
            res.send({
              status: 400,
              err: "Connexion au serveur a échoué !" + err
            });
          } else {
            res.send({
              status: 200,
              mess: "Ajouter à la liste !"
            });
          }
        }
      }
    }
  );
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
