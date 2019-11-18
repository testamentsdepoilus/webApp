const express = require("express");
const router = express.Router();
const cors = require("cors");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://127.0.0.1:9200" }); //http://patrimeph.ensea.fr/es700
const es_index = "tdp_cms";

router.use(cors());
process.env.SECRET_KEY = "secret";

/* POST publish  */
router.post("/publish", function(req, res, next) {
  const today = new Date();
  const data = {
    user_id: req.body.user_id,
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    detail: req.body.detail,
    type: req.body.type,
    created: today
  };

  client.index(
    {
      index: es_index,
      body: data
    },
    (err, result) => {
      if (err) {
        res.send({
          status: 400,
          err: "ES Connexion au serveur a échoué !"
        });
      } else {
        res.send({
          status: 200,
          mess: "Votre article a été publié !"
        });
      }
    }
  );
});

/* POST delete  */
router.post("/removePost", function(req, res, next) {
  const data = {
    ids: req.body.ids
  };

  let isFailed = false;
  data.ids.forEach(id => {
    client.delete(
      {
        index: es_index,
        id: id
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
      err: "ES Connexion au serveur a échoué !"
    });
  } else {
    res.send({
      status: 200,
      mess: "Vos éléments ont été supprimé !"
    });
  }
});

/* POST update  */
router.post("/updatePost", function(req, res, next) {
  const today = new Date();
  const id = req.body.id;
  const data = {
    user_id: req.body.user_id,
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    detail: req.body.detail,
    type: req.body.type,
    created: today
  };

  let isFailed = false;
  client.update({
    index: es_index,
    id: id,
    body: {
      doc: data
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
      mess: "Votre post a été mise à jour !"
    });
  }
});

module.exports = router;
