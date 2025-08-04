const express = require("express");
const router = express.Router();
const {
  getSetting,
  createOrUpdateSetting,
} = require("../controllers/settings.controller");

// /api/settings

router.get("/", getSetting);
router.post("/", createOrUpdateSetting);

module.exports = router;
