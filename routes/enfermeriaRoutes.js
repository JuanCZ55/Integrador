const express = require("express");
const router = express.Router();

// Ruta base de ejemplo para enfermería
router.get("/inicio", (req, res) => {
  res.render("enfermeria/inicio");
});

module.exports = router;
