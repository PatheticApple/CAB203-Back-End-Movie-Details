const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();


const options = require("./knexfile.js");
const knex = require("knex")(options);
const cors = require("cors");

var movieRouter = require("./routes/movies");
var usersRouter = require("./routes/user");
var peopleRouter = require("./routes/people");
var docsRouter = require("./routes/docs");


var app = express();



app.use((req, res, next) => {
  req.db = knex;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/people", peopleRouter);
app.use("/movies", movieRouter);
//app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/user", usersRouter);

app.use('/', docsRouter);


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({error: true, message: "Page not found"})
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
  return JSON.stringify(headers)
}) 



module.exports = app;
