var pool = require("./bd");
var cloudinary = require("cloudinary").v2;

async function getNovedades() {
  var query = "select * from novedades order by id desc";
  var rows = await pool.query(query);
  return rows;
}

async function insertNovedades(obj) {
  try {
    if (obj.imagen && obj.imagen.mimetype.startsWith("image/")) {
      const result = await cloudinary.uploader.upload(obj.imagen.tempFilePath, {
        width: 900,
        height: 300,
        crop: "fill",
      });
      obj.img_id = result.secure_url;
    }

    var query = "INSERT INTO novedades SET ?";
    var rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log("Error al insertar novedades:", error);
    throw error;
  }
}


async function deleteNovedadesByPublicId(publicId) {
  // Obtener el ID de la imagen a eliminar
  var querySelect = "SELECT img_id FROM novedades WHERE img_id = ?";
  var rowsSelect = await pool.query(querySelect, [publicId]);
  const imgId = rowsSelect[0].img_id;

  // Eliminar la imagen de Cloudinary
  if (imgId) {
    await cloudinary.uploader.destroy(imgId);
  }

  var query = "DELETE FROM novedades WHERE img_id = ?";
  var rows = await pool.query(query, [publicId]);
  return rows;
}

async function getNovedadByPublicId(publicId) {
  var query = "SELECT * FROM novedades WHERE img_id = ?";
  var rows = await pool.query(query, [publicId]);
  return rows[0];
}

module.exports = {
  getNovedades,
  insertNovedades,
  deleteNovedadesByPublicId,
  getNovedadByPublicId,
};
