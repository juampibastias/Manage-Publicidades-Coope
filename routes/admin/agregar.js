var express = require("express");
var router = express.Router();
var novedadesModel = require("../models/novedadesModel");
var cloudinary = require("cloudinary").v2;

router.post("/agregar", async (req, res, next) => {
  try {
    if (
      req.files &&
      req.files.imagen &&
      req.files.imagen.mimetype.startsWith("image/")
    ) {
      const result = await cloudinary.uploader.upload(
        req.files.imagen.tempFilePath,
        {
          width: 900,
          height: 300,
          crop: "fill",
        }
      );
      req.body.imagen = result.secure_url;

      await novedadesModel.insertNovedades(req.body);
      res.redirect("/admin/novedades");
    } else {
      await novedadesModel.insertNovedades(req.body);
      res.redirect("/admin/novedades");
    }
  } catch (error) {
    console.log(error);
    res.render("admin/agregar", {
      layout: "admin/layout",
      error: true,
      message: "No se cargó la novedad",
    });
  }
});

module.exports = router;
