var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")
var cheerio = require("cheerio");
var request = require("request");

var PORT = process.env.PORT || 3020;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app, request, cheerio);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});