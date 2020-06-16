const express = require("express");
const router = express.Router();
const cors = require("cors");
const pdf = require("html-pdf");
const resolve = require("path").resolve;

router.use(cors());

function footerPDF() {
  const date = new Date();
  const footer =
    "Export réalisé depuis " +
    process.env.host +
    ", le " +
    date.toLocaleDateString("en-GB");
  return footer;
}

router.post("/generateWillPDF", async (req, res, next) => {
  try {
    const data = req.body["data"];
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
      "décembre",
    ];
    const listMenu = {
      page: "Page",
      envelope: "Enveloppe",
      codicil: "Codicille",
    };

    let outputHtml =
      '<html> <head> <title>Testaments De Poilus</title> <meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      "<style> #root { margin: 1em; font-family: -apple-system; font-size: 0.8rem;} .before { page-break-before: always; } .after" +
      "{ page-break-after: always; } .avoid { page-break-inside: avoid; } #name {font-size: 1.1rem; font-weight: 600; " +
      "color: #024975ad;} #name span {text-transform: uppercase; font-size: 80%;}  a {text-decoration: none;}</style></head>" +
      '<body> <div id="root"><img src="file://' +
      resolve("client/build/images/Entete_Bande-logo-bas-150dpi.jpg") +
      '" alt="Xcel-RCM" style="display: none"/> <img src="file://' +
      resolve("client/build/images/Entete_titre-site-haut-150dpi.jpg") +
      '" alt="Xcel-RCM" style="display: none" />';

    // Create div infos testateur
    const will_uri = process.env.host_web + "/testament/" + data["will_id"];
    outputHtml +=
      '<div id="testator-info"> <p style="font-size: 1.1rem; font-weight: 600; color: #024975ad;"> Testament de ' +
      data["testator.forename"] +
      '<span style="text-transform: uppercase; font-size: 80%;"> ' +
      data["testator.surname"] +
      "</span></p>";
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
      ? death_date.toLocaleDateString().split("-")
      : null;

    outputHtml += "<p> Mort pour la France ";
    outputHtml += Boolean(death_date)
      ? " le " +
        death_date[2] +
        " " +
        months[parseInt(death_date[1], 10) - 1] +
        " " +
        death_date[0]
      : "";
    outputHtml += Boolean(data["will_contents.death_place_norm"]) ? " à " : "";
    outputHtml += Boolean(data["will_contents.death_place_ref"])
      ? '<a href="' +
        "web_url" +
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
      will_date.push(date_.toLocaleDateString().split("-"));
      if (
        data["will_contents.will_date_range"]["gte"] !==
        data["will_contents.will_date_range"]["lte"]
      ) {
        date_ = new Date(data["will_contents.will_date_range"]["lte"]);
        will_date.push(date_.toLocaleDateString().split("-"));
      }
    }

    if (
      will_date.length > 0 ||
      Boolean(data["will_contents.will_place_norm"])
    ) {
      if (will_date.length === 1) {
        outputHtml +=
          "<p> Testament rédigé le " +
          will_date[0][2] +
          " " +
          months[parseInt(will_date[0][1], 10) - 1] +
          " " +
          will_date[0][0];
      } else if (will_date.length === 2) {
        outputHtml +=
          "<p> Date de rédaction : " +
          will_date[0][2] +
          " " +
          months[parseInt(will_date[0][1], 10) - 1] +
          " " +
          will_date[0][0] +
          " et " +
          will_date[1][2] +
          " " +
          months[parseInt(will_date[1][1], 10) - 1] +
          " " +
          will_date[1][0];
      }
      if (Boolean(data["will_contents.will_place_norm"])) {
        outputHtml += " à ";
        if (Boolean(data["will_contents.will_place_ref"])) {
          outputHtml +=
            '<a href="' +
            process.env.host_web +
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
    outputHtml += "<p> Nombre de pages : " + data["will_pages"].length + "</p>";

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

    let outputImage = '<div id="image" class="before"> <h4>Image :</h4>';
    let outputTranscription =
      '<div id="transcription" > <h4>Transcription :</h4>';
    let outputEdition = '<div id="edition" class="before"> <h4>Edition :</h4>';

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
      outputImage += title;
      outputImage +=
        '<img src="' +
        page["picture_url"] +
        "/full/full/0/default.jpg" +
        '" style="width: 90%; height: 150%"></img></div>';

      outputTranscription += title;
      outputTranscription += page["transcription"];
      outputEdition += title;
      outputEdition += page["edition"];
    });
    outputHtml += outputImage;
    outputTranscription += "</div>";
    outputHtml += outputTranscription;
    outputEdition += "</div>";
    outputHtml += outputEdition;
    // Add testator information
    outputHtml +=
      '<div id="will" class="before">' + req.body["testator_data"] + "</div>";
    outputHtml += "</div></body></html>";

    /*fs.writeFile("/tmp/" + data["will_id"] + ".html", outputHtml, function(
      err
    ) {
      if (err) {
        console.log("Error: ", err);
        res.send({
          status: 400,
          err: "Error: " + err
        });
      }
      console.log("The file was saved!");
      res.send({
        status: 200,
        err: "The file was saved!"
      });
    });*/

    const options = {
      format: "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
      orientation: "portrait", // portrait or landscaperesolve

      border: "0",
      paginationOffset: 1, // Override the initial pagination number
      header: {
        height: "24mm",
        contents:
          '<img src="file://' +
          resolve("client/build/images/Entete_titre-site-haut-150dpi.jpg") +
          '" alt="Xcel-RCM" width="100%" height="40" />',
      },
      footer: {
        height: "28mm",
        contents: {
          default:
            '<div style="font-size: 0.7rem"><hr><div style="position: absolute; right: 5px;"><span style="color: #444;">{{page}}' +
            "</span>/<span>{{pages}}</span></div><span>" +
            footerPDF() +
            '</span><img src="file://' +
            resolve("client/build/images/Entete_Bande-logo-bas-150dpi.jpg") +
            '" alt="Xcel-RCM" width="100%" height="40" /></div>',
        },
      },
    };
    pdf
      .create(outputHtml, options)
      .toFile(
        "client/build/outputPDF/Projet_TdP_testament_" +
          data["will_id"] +
          ".pdf",
        function (err, result) {
          if (err) {
            res.send({
              status: 400,
              err: "Error: " + e,
            });
            return console.log(err);
          }
          res.send({
            status: 200,
            res: result,
          });
        }
      );
    /* const opt = {
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
    };*/
  } catch (e) {
    console.log("Error catch:", e);
    res.send({
      status: 400,
      err: "Error: " + e,
    });
  }
});

router.post("/generatePDF", async (req, res, next) => {
  try {
    let footer_html = footerPDF();
    let outputHtml =
      '<html lang="fr" xml:lang="fr" xmlns="http://www.w3.org/1999/xhtml"> <head> <title>Testaments De Poilus</title>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<script src="https://kit.fontawesome.com/57c7a6238a.js" crossorigin="anonymous"></script>' +
      " <style>" +
      "      body {" +
      "        font-family: 'Fira Sans', sans-serif;" +
      "        font-size: 1rem;" +
      "      }" +
      "      .d-flex {" +
      "        display: flex;" +
      "      }" +
      "      i {" +
      "        padding-right: 10px;" +
      "        font-size: 1.4em;" +
      "      }" +
      "      .noticeInfo div {" +
      "        margin-bottom: 4px;" +
      "      }" +
      "      h1.item {" +
      "        color: black;" +
      "        font-size: 1.3rem;" +
      "        line-height: 1.8rem;" +
      "        font-weight: 600;" +
      "        margin-top: 0px;" +
      "      }" +
      "      .noticeInfo .permalien {" +
      "        margin-bottom: 20px;" +
      "      }" +
      "      .smallcaps {" +
      "        font-variant: small-caps;" +
      "      }" +
      "      .noticeInfo a {" +
      "        color: #1F8299;" +
      "      }" +
      "      .MuiLink-underlineHover {" +
      "        text-decoration: none;" +
      "      }" +
      "      .noticeInfo h2 {" +
      "        font-size: 1.13rem;" +
      "        margin-top: 30px;" +
      "        margin-bottom: 5px;" +
      "      }" +
      "</style>" +
      '</head> <body><div id="root"><img src="file://' +
      resolve("client/build/images/Entete_Bande-logo-bas-150dpi.jpg") +
      '" alt="Xcel-RCM" height="40" style="display: none"/> <img src="file://' +
      resolve("client/build/images/Entete_titre-site-haut-150dpi.jpg") +
      '" alt="Xcel-RCM" height="30" style="display: none" />';
    outputHtml += req.body["outputHtml"] + "</div></body></html>";
    const options = {
      format: "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
      orientation: "portrait", // portrait or landscape

      border: "0",
      paginationOffset: 1, // Override the initial pagination number
      header: {
        height: "24mm",
        contents:
          '<img src="file://' +
          resolve("client/build/images/Entete_titre-site-haut-150dpi.jpg") +
          '" alt="Xcel-RCM" width="100%" height="40" />',
      },
      footer: {
        height: "28mm",
        contents: {
          default:
            '<div style="font-size: 0.7rem"><hr><div style="position: absolute; right: 0px;"><span style="color: #444;">{{page}}' +
            "</span>/<span>{{pages}}</span></div><span>" +
            footer_html +
            '</span><img src="file://' +
            resolve("client/build/images/Entete_Bande-logo-bas-150dpi.jpg") +
            '" alt="Xcel-RCM" width="100%" height="40" /></div>', // fallback value
        },
      },
    };

    pdf
      .create(outputHtml, options)
      .toFile(
        "client/build/outputPDF/" + req.body["filename"] + ".pdf",
        function (err, result) {
          if (err) {
            res.send({
              status: 400,
              err: "Error: " + e,
            });
            return console.log(err);
          }
          res.send({
            status: 200,
            res: result,
          });
        }
      );
  } catch (e) {
    console.log("Error catch:", e);
    res.send({
      status: 400,
      err: "Error: " + e,
    });
  }
});

module.exports = router;
