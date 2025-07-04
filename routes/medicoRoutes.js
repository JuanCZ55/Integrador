const express = require("express");
const router = express.Router();

router.get("/inicio", (req, res) => {
  res.render("medico/inicio");
});

module.exports = router;
