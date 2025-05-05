const express = require('express');
const app = express();
const path = require('path');
//routes
const admision = require('./routes/admisionRoutes');
const enfer = require('./routes/enfermeriaRoutes');
const medico = require('./routes/medicoRoutes');
const admin = require('./routes/administradorRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './view'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//rutas para los 4 roles
app.use('/admision', admision);
app.use('/enfermeria', enfer);
app.use('/medico', medico);
app.use('/administrador', admin);
//ruta para 404
app.use((req, res, next) => {
  res.status(404).render('notfound');
});
//Inicio del servidor
app.listen(3000, () => {
  console.log('Server corre en el puerto 3000');
});