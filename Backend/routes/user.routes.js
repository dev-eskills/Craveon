const express = require("express");
const protect = require("../middleware/auth");
const {
  deleteUser,
  editUser,
  userDetails,
} = require("../controllers/user.controller");
const { getAllBanners } = require("../controllers/Admin/banner.controller");

const router = express.Router();

router.use("/Address", require("./address.route"));
router.use("/category", require("./categoryRoutes"));
router.use("/restaurant", require("./Admin/restaurant.route"));
router.get("/banner", getAllBanners);
router.delete("/:id", protect, deleteUser);
router.put("/:id", protect, editUser);
router.get("/:id", protect, userDetails);
module.exports = router;
