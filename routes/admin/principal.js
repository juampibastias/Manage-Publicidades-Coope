var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  res.render('admin/principal', {
  layout: 'admin/layout',
  usuario: req.session.nombre
  });
});

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    // El usuario ha iniciado sesión con éxito
    // Puedes acceder a la información del usuario a través de `req.user`
    res.render('admin/principal', {
      layout: 'admin/layout',
    });
  } else {
    // El usuario no ha iniciado sesión, redirige a la página de inicio de sesión
    res.redirect('/admin/login');
  }
});


module.exports = router;