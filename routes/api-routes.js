// Requiring our models and passport as we've configured it
var db = require("../models");

module.exports = function (app, request, cheerio) {

  // app.get("/api/articles/:modifier", function (req, res) {
  //   if (req.params.modifier === "all") {
  //     // Grab every document in the Articles collection
  //     db.Article.find({})
  //       .then(function (dbArticle) {
  //         // If we were able to successfully find Articles, send them back to the client
  //         res.json(dbArticle);
  //       })
  //       .catch(function (err) {
  //         // If an error occurred, send it to the client
  //         res.json(err);
  //       });
  //   } else if (req.params.modifier === "saved") {
  //     // Grab every document in the Articles collection
  //     db.Article.find({
  //         saved: true
  //       })
  //       .then(function (dbArticle) {
  //         // If we were able to successfully find Articles, send them back to the client
  //         res.json(dbArticle);
  //       })
  //       .catch(function (err) {
  //         // If an error occurred, send it to the client
  //         res.json(err);
  //       });
  //   }
  // });

  app.get("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    db.Note.findOne({id:id})
      .then(function (dbNote) {
        // If we were able to successfully find Articles, send them back to the client
        console.log(dbNote);
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.post("/api/notes/", function (req, res) {
    db.Note.deleteOne({id:req.body.id}).then(function (err, delOK) {
      if (delOK) console.log("Collection deleted");
    })
    .catch(function(err){
      console.log("Delete error, " + err);
    })

    var result = {};
    result.title = req.body.title;
    result.body = req.body.body;
    result.id = req.body.id;

    db.Note.create(result)
      .then(function (dbNote) {
        console.log("created, " + dbNote);
        res.send(true);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.send(false);
        return (err);
      });
  });

  app.delete("/api/notes/", function (req, res) {
    db.Note.deleteOne({id:req.body.id}).then(function (err, delOK) {
      if (delOK) console.log("Note deleted");
      res.send("deleted");
    })
    .catch(function(err){
      console.log("Delete error, " + err);
    })
  });

  app.put("/api/articles/:id", function (req, res) {
    // Grab every document in the Articles collection
    //  const one = db.Article.findOne({ _id: req.params.id });

    db.Article.findOne({
        _id: req.params.id
      })
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        console.log(dbArticle);

        if (dbArticle.saved === true) {
          res.send(false);
          return db.Article.findOneAndUpdate({
            _id: req.params.id
          }, {
            saved: false
          });
        } else if (dbArticle.saved === false) {
          res.send(true);
          return db.Article.findOneAndUpdate({
            _id: req.params.id
          }, {
            saved: true
          });
        }
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        console.log(dbArticle)
      });
  });

  app.get("/api/scrapeArticles", function (req, res) {
    db.Article.deleteMany(function (err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
    });
    request("https://jalopnik.com/tag/mazda-miata", function (err, res, body) {
      var $ = cheerio.load(body);
      $("article").each(function (i, element) {
        var result = {};
        // result.title = ($('body').children(".item__content").children("item__text").children(".headline").children("div").text());
        result.title= $(this).find(".item__text").children(".headline").children("a").children("div").text()
        result.link = ($(this).find("h1").children("a").attr("href"));
        result.excerpt = ($(this).find(".item__text").children(".excerpt").children("p").text());
        result.saved = false;

        console.log(result)

        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return (err);
          });
      })

    });
    res.send("Scrape Completed");
  })
};