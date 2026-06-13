const express = require("express");
const router = express.Router();
const supportController = require("../controllers/support.controller");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Customer support routes
router.post("/feedback", authenticate, supportController.createFeedback);
router.post("/complaint", authenticate, supportController.createComplaint);
router.post("/dispute", authenticate, supportController.createDispute);
router.get("/my-history", authenticate, supportController.getUserSupportHistory);

// Administrative support routes
router.get("/feedback", authenticate, authorize("admin"), supportController.getAllFeedback);
router.get("/complaints", authenticate, authorize("admin"), supportController.getAllComplaints);
router.get("/disputes", authenticate, authorize("admin"), supportController.getAllDisputes);
router.patch("/complaints/:id", authenticate, authorize("admin"), supportController.updateComplaint);
router.patch("/disputes/:id", authenticate, authorize("admin"), supportController.updateDispute);

module.exports = router;
