const express = require("express");

const router = express.Router();
router.get("/inicio", (req, res) => {
  res.render("admin/medico");
});

router.get("/usuarios", (req, res) => {
  res.render("admin/usuarios");
});

module.exports = router;
