# Integrador

## Descripción

Sistema de gestión hospitalaria para la administración de pacientes, admisiones, camas, habitaciones y turnos. Desarrollado en Node.js con Express, Sequelize y Pug como motor de vistas.

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

## Comandos principales

- **Iniciar el servidor en modo producción:**
  ```sh
  npm start
  ```
- **Iniciar el servidor en modo desarrollo (con recarga automática):**
  ```sh
  npm run dev
  ```
- **Compilar recursos o tareas de build:**
  ```sh
  npm run build
  ```

## Estructura principal del proyecto

- `app.js`: Archivo principal de la aplicación Express.
- `routes/`: Rutas de la aplicación (ej: admisión, pacientes, infraestructura).
- `controllers/`: Lógica de negocio y controladores de cada módulo.
- `models/`: Modelos de datos Sequelize.
- `views/`: Vistas Pug para renderizado del frontend.
- `public/`: Archivos estáticos (CSS, JS, imágenes).
- `seeders/`: Scripts para poblar la base de datos con datos iniciales.

## Uso

1. Configura la conexión a la base de datos en `models/db.js` según tu entorno.
2. (Opcional) Ejecuta los seeders para poblar datos iniciales:
   ```sh
   node seeders/seedInfra.js
   node seeders/seedMotivos.js
   node seeders/seedOS.js
   node seeders/seedPP.js
   node seeders/seedTurnos.js
   ```
3. Inicia el servidor con `npm start` o `npm run dev`.
4. Accede a la aplicación en tu navegador en `http://localhost:3000` (o el puerto configurado).

## Funcionalidades principales

- Gestión de pacientes (alta, modificación, listado, búsqueda)
- Admisión de pacientes (normal y emergencia)
- Gestión de camas, habitaciones y sectores
- Listado y gestión de admisiones
- Motor de vistas con Pug

## Notas

- El sistema utiliza rutas agrupadas bajo `/admision` para la mayoría de las funcionalidades.
- Personaliza los archivos de configuración y seeders según tus necesidades.

---

Desarrollado por el equipo IntegradorX.
