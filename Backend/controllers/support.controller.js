const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const Dispute = require("../models/Dispute");
const Order = require("../models/Order");

// User operations

// Create general feedback
exports.createFeedback = async (req, res) => {
  try {
    const { rating, experience, comment } = req.body;
    const userId = req.user.id;

    if (!rating || !experience || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      user: userId,
      rating,
      experience,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit feedback", error: error.message });
  }
};

// Create formal complaint
exports.createComplaint = async (req, res) => {
  try {
    const { order, category, subject, description } = req.body;
    const userId = req.user.id;

    if (!category || !subject || !description) {
      return res.status(400).json({ message: "Category, subject, and description are required" });
    }

    const complaint = await Complaint.create({
      user: userId,
      order: order || undefined,
      category,
      subject,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to lodge complaint", error: error.message });
  }
};

// Create order dispute
exports.createDispute = async (req, res) => {
  try {
    const { orderId, disputeReason, disputeItems, description } = req.body;
    const userId = req.user.id;

    if (!orderId || !disputeReason || !description) {
      return res.status(400).json({ message: "OrderId, reason, and description are required" });
    }

    // Find and validate the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to dispute this order" });
    }

    // Verify status is DELIVERED
    if (order.status !== "DELIVERED") {
      return res.status(400).json({ message: "Disputes can only be raised for completed (delivered) orders" });
    }

    // Check if a dispute already exists for this order
    const existingDispute = await Dispute.findOne({ order: orderId });
    if (existingDispute) {
      return res.status(400).json({ message: "A dispute has already been raised for this order" });
    }

    // Create the dispute
    const dispute = await Dispute.create({
      order: orderId,
      user: userId,
      disputeReason,
      disputeItems: disputeItems || [],
      description,
    });

    res.status(201).json({
      success: true,
      message: "Dispute raised successfully",
      dispute,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to raise dispute", error: error.message });
  }
};

// Get authenticated user's support history (Feedback, Complaints, disputes)
exports.getUserSupportHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
    const complaints = await Complaint.find({ user: userId })
      .populate("order", "orderNumber status finalTotal")
      .sort({ createdAt: -1 });
    const disputes = await Dispute.find({ user: userId })
      .populate({
        path: "order",
        select: "orderNumber status finalTotal items",
        populate: { path: "items.product" }
      })
      .populate("disputeItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
      complaints,
      disputes,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch support history", error: error.message });
  }
};


// Admin operations

// Get all feedbacks
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email number")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks", error: error.message });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email number")
      .populate("order", "orderNumber status finalTotal")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

// Get all disputes
exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate("user", "name email number")
      .populate({
        path: "order",
        select: "orderNumber status finalTotal items restaurant",
        populate: [
          { path: "restaurant", select: "name" },
          { path: "items.product" }
        ]
      })
      .populate("disputeItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      disputes,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch disputes", error: error.message });
  }
};

// Update complaint status or adminNotes
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint", error: error.message });
  }
};

// Update dispute status or resolutionDetails
exports.updateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails } = req.body;

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return res.status(404).json({ message: "Dispute not found" });
    }

    if (status) {
      dispute.status = status;
      // If status starts with RESOLVED or is REJECTED, mark resolvedAt
      if (status.startsWith("RESOLVED") || status === "REJECTED") {
        dispute.resolvedAt = new Date();
      }
    }
    if (resolutionDetails !== undefined) dispute.resolutionDetails = resolutionDetails;

    await dispute.save();

    res.status(200).json({
      success: true,
      message: "Dispute updated successfully",
      dispute,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update dispute", error: error.message });
  }
};
