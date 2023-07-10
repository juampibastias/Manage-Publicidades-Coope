var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();
var session = require("express-session");
var fileUpload = require("express-fileupload");
var cors = require("cors");

var app = express();

const passport = require("passport");
require("./passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "juan1234",
    resave: false,
    saveUninitialized: true,
  })
);

// Coloca passport.initialize() y passport.session() antes de las rutas
app.use(passport.initialize());
app.use(passport.session());

secured = async (req, res, next) => {
  try {
    console.log(req.session.nombre);
    if (req.session.nombre) {
      next();
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.log(error);
  }
};

var loginRouter = require("./routes/admin/login");
var novedadesRouter = require("./routes/admin/novedades");
var principalRouter = require("./routes/admin/principal");
var apiRouter = require("./routes/api");

app.use("/admin/login", loginRouter);
app.use("/admin/novedades", secured, novedadesRouter);
app.use("/admin/principal", secured, principalRouter);
app.use("/api", cors(), apiRouter);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/admin/principal",
    failureRedirect: "/admin/login", // O cualquier otra ruta de fallo que desees
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
