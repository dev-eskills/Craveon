const express = require("express");
const adminProtect = require("../middleware/adminProtect");
const {
  toggleRider,
  getRiders,
} = require("../controllers/adminRider.controller");

const router = express.Router();

router.get("/all", getRiders);
router.post("/toggle", toggleRider);

module.exports = router;
