const express = require("express");
const router = express.Router();
const {
  renderPerfil,
  cambiarPassword,
  cambiarUsuario,
} = require("../controllers/perfilController");

router.get("/", renderPerfil);
router.post("/cambiarPassword", cambiarPassword);
router.post("/cambiarUsuario", cambiarUsuario);

module.exports = router;
