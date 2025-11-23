const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  renderPerfil,
  cambiarPassword,
  cambiarUsuario,
} = require("../controllers/perfilController");

router.get("/", requireAuth, renderPerfil);
router.post("/cambiarPassword", requireAuth, cambiarPassword);
router.post("/cambiarUsuario", requireAuth, cambiarUsuario);

module.exports = router;
