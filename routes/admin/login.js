var express = require("express");
var router = express.Router();
var usuariosModel = require("./../../models/usuariosModel");

const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/admin/login",
  }),
  (req, res) => {
    res.redirect("/admin/principal");
  }
);

router.get("/", function (req, res, next) {
  res.render("admin/login", {
    layout: "admin/layout",
  });
});

router.post("/", async (req, res, next) => {
  try {
    var nombre = req.body.nombre;
    var contrasena = req.body.contrasena;

    //console.log(usuario, password)

    var data = await usuariosModel.getUserByUsernameAndPassword(
      nombre,
      contrasena
    );

    if (data != undefined) {
      req.session.id_nombre = data.id;
      req.session.nombre = data.nombre;
      res.redirect("/admin/principal");
    } else {
      res.render("admin/login", {
        layout: "admin/layout",
        error: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.render("admin/login", {
    laout: "admin/layout",
  });
});

module.exports = router;
