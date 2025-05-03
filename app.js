const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const urlencode = express.urlencoded({ extended: true });

const admision = require('./routes/admisionRoutes');

// Configuracion del motor de vistas
app.set('view engine', 'pug');
app.set('views', './view');

// Servir archivos estaticos desde ./style
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json());
app.use(urlencode);

// Ruta raiz
app.get('/', (req, res) => {
  res.render('admision/inicio');
});

// Rutas principales
app.use('/admision', admision);

// 404
app.use((req, res) => {
  res.status(404).render('notfound');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
