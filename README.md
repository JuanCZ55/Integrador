# Integrador

## Descripción

Sistema de admision e internacion hospitalaria para pacientes, admisiones, camas y turnos. Desarrollado en Node.js con Express, Sequelize y Pug como motor de vistas.
Se utilizo https://www.drawdb.app/ para crear la base de datos y luego con el sql se uso sequelize-auto para crear de forma parcial los modelos.

## Requisitos previos

- Node.js (v14 o superior recomendado)
- npm (Node Package Manager)
- Base de datos compatible con Sequelize con MYSQL

## Instalación

1. Clona el repositorio o descarga el código fuente.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Ejecuta:
   ```sh
   npm install
   ```
   Esto instalará todas las dependencias necesarias.

## Variables de entorno

- Se uso clever cloud para la base de datos
  -DB_NAME=bxf0y0oea6xiq3ee8gtg
  -DB_USER=uumu6waelomvw1rp
  -DB_PASSWORD=mixrLYxhXcJdF5hs3QdU
  -DB_HOST=bxf0y0oea6xiq3ee8gtg-mysql.services.clever-cloud.com
  -DB_PORT=3306
  -DB_DIALECT=mysql

## Comandos principales

- **Iniciar el servidor en modo producción:**
  ```sh
  npm start
  ```
- **Iniciar el servidor en modo desarrollo (con recarga automática):**
  ```sh
  npm run dev
  ```
- **Creara las tablas y cargara con datos de los seeders**
  ```sh
  npm run build
  ```

## Estructura principal del proyecto

- `app.js`: Archivo principal de la aplicación Express.
- `routes/`: Rutas de la aplicación admisión(admision(personas,infraestructura)).
- `controllers/`: Lógica de negocio y controladores de cada módulo.
- `models/`: Modelos de datos con Sequelize.
- `views/`: Vistas Pug para renderizado del frontend.
- `public/`: Archivos estáticos (CSS, JS, imágenes).
- `seeders/`: Scripts para poblar la base de datos con datos iniciales.

## Uso

1. Configura la conexión a la base de datos en `models/db.js` según tu entorno.
2. `npm run build` Ejecuta la creacion de las tablas con los seeders para poblar datos iniciales:
   ```sh
   node seeders/seedInfra.js
   node seeders/seedMotivos.js
   node seeders/seedOS.js
   node seeders/seedPP.js
   node seeders/seedTurnos.js
   ```
3. Inicia el servidor con `npm start` o `npm run dev`.
4. Accede a la aplicación en tu navegador en `http://localhost:3000` .

## Funcionalidades principales

- Gestión de pacientes (creacion, modificación, listado)
- Admisión de pacientes (Turno,Emergencia y Derivado) aignacion de camas
- Listado y gestión de admisiones
- Listado de camas por habitaciones y sector
- Gestion y lista de turnos

## Notas

- El sistema utiliza rutas agrupadas bajo `/admision`.
- La pagina de inicial (/admision/) indica brevemente que hacer cada navbar existente

---

Desarrollado por Juan Cruz Zegarra
