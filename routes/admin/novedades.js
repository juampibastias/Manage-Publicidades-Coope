const express = require("express");
const router = express.Router();
const novedadesModel = require("../../models/novedadesModel");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get("/", async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();

  novedades = novedades.map((novedad) => {
    if (novedad.img_id) {
      const imagen = cloudinary.image(novedad.img_id, {
        width: 100,
        height: 100,
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

  res.render("admin/novedades", {
    layout: "admin/layout",
    usuario: req.session.nombre,
    novedades,
  });
});

router.get("/agregar", (req, res, next) => {
  res.render("admin/agregar", {
    layout: "admin/layout",
  });
});

router.post("/agregar", async (req, res, next) => {
  try {
    var img_id = "";
    if (req.files && Object.keys(req.files).length > 0) {
      const imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    await novedadesModel.insertNovedades({ img_id }); // Guardar el public_id en la base de datos

    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.render("admin/agregar", {
      layout: "admin/layout",
      error: true,
      message: "No se cargó la novedad",
    });
  }
});

router.get("/eliminar/:id", async (req, res, next) => {
  try {
    var public_id = req.params.id;
    let novedad = await novedadesModel.getNovedadByPublicId(public_id);
    if (novedad && novedad.img_id) {
      await destroy(novedad.img_id);
    }
    await novedadesModel.deleteNovedadesByPublicId(public_id);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/novedades");
  }
});

module.exports = router;
