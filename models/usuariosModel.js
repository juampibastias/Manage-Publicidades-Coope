var pool = require("./bd");
var md5 = require("md5");

async function getUserByUsernameAndPassword(nombre, contraseña) {
  try {
    var query =
      "SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ? LIMIT 1";
    var rows = await pool.query(query, [nombre, md5(contraseña)]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function getUserByGoogleId(googleId) {
  try {
    var query = "SELECT * FROM usuarios WHERE googleId = ? LIMIT 1";
    var [user] = await pool.query(query, [googleId]);
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function createUser(user) {
  try {
    var query = "INSERT INTO usuarios SET ?";
    await pool.query(query, user);
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(id) {
  try {
    var query = "SELECT * FROM usuarios WHERE id = ? LIMIT 1";
    var rows = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUserByUsernameAndPassword,
  getUserByGoogleId,
  createUser,
  getUserById,
};
