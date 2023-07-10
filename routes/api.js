var express = require("express");
var router = express.Router();
var novedadesModel = require("../models/novedadesModel");
var cloudinary = require("cloudinary").v2;

router.get("/novedades", async function (req, res, next) {
  let novedades = await novedadesModel.getNovedades();
  novedades = novedades.map((novedad) => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 900,
        height: 300,
        crop: "fill",
      });
      return {
        ...novedad,
        imagen,
      };
    } else {
      return {
        ...novedad,
        imagen: "",
      };
    }
  });
  res.json(novedades);
});

router.post("/novedades", async function (req, res, next) {
  try {
    // Subir imagen a Cloudinary
    if (req.body.imagen && req.body.imagen.mimetype.startsWith("image/")) {
      const result = await cloudinary.uploader.upload(
        req.body.imagen.tempFilePath,
        {
          width: 900,
          height: 300,
          crop: "fill",
        }
      );
      req.body.img_id = result.public_id; // Guardar el ID de la imagen en Cloudinary en la base de datos
    }

    await novedadesModel.insertNovedades(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
