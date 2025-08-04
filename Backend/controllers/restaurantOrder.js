const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { sendNotification } = require("../utils/notificationService");

// Controller for Restaurant to manage orders
const restaurantOrder = {
  // Get all orders for a restaurant
  getAllOrders: async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const restaurantId = req.user.restaurantId; // Assuming middleware sets this

      const query = { restaurant: restaurantId };
      if (status) {
        query.status = status;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { path: "user", select: "name email phone" },
          { path: "deliveryPartner", select: "name email phone" },
        ],
      };

      const orders = await Order.paginate(query, options);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message,
      });
    }
  },

  // Accept an order
  acceptOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { preparationTime } = req.body; // In minutes
      const restaurantId = req.user.restaurantId;

      const order = await Order.findOne({
        _id: orderId,
        restaurant: restaurantId,
        status: "PENDING",
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or cannot be accepted",
        });
      }

      // Calculate estimated preparation time
      const now = new Date();
      const estimatedReadyTime = new Date(
        now.getTime() + preparationTime * 60000
      );

      // Update order status
      await order.updateStatus(
        "ACCEPTED",
        req.user._id,
        `Preparation time: ${preparationTime} minutes`
      );

      // Send notification to customer
      await sendNotification({
        userId: order.user,
        title: "Order Accepted",
        body: `Your order #${order.orderNumber} has been accepted by the restaurant`,
        data: { orderId: order._id.toString() },
      });

      res.status(200).json({
        success: true,
        message: "Order accepted successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error accepting order",
        error: error.message,
      });
    }
  },

  // Mark order as preparing
  markOrderPreparing: async (req, res) => {
    try {
      const { orderId } = req.params;
      const restaurantId = req.user.restaurantId;

      const order = await Order.findOne({
        _id: orderId,
        restaurant: restaurantId,
        status: "ACCEPTED",
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or cannot be updated",
        });
      }

      await order.updateStatus("PREPARING", req.user._id);

      // Send notification to customer
      await sendNotification({
        userId: order.user,
        title: "Order Update",
        body: `Your order #${order.orderNumber} is being prepared`,
        data: { orderId: order._id.toString() },
      });

      res.status(200).json({
        success: true,
        message: "Order status updated to PREPARING",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating order status",
        error: error.message,
      });
    }
  },

  // Mark order as ready for pickup
  markOrderReady: async (req, res) => {
    try {
      const { orderId } = req.params;
      const restaurantId = req.user.restaurantId;

      const order = await Order.findOne({
        _id: orderId,
        restaurant: restaurantId,
        status: "PREPARING",
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or cannot be updated",
        });
      }

      await order.updateStatus("READY_FOR_PICKUP", req.user._id);

      // Send notification to customer
      await sendNotification({
        userId: order.user,
        title: "Order Ready",
        body: `Your order #${order.orderNumber} is ready for pickup by delivery partner`,
        data: { orderId: order._id.toString() },
      });

      // Send notification to admin for delivery partner assignment
      // (if not already assigned)
      if (!order.deliveryPartner) {
        // Find admin users to notify
        const adminUsers = await User.find({ role: "admin" });
        for (const admin of adminUsers) {
          await sendNotification({
            userId: admin._id,
            title: "Delivery Assignment Needed",
            body: `Order #${order.orderNumber} is ready for pickup and needs a delivery partner`,
            data: { orderId: order._id.toString() },
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Order status updated to READY_FOR_PICKUP",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating order status",
        error: error.message,
      });
    }
  },

  // Verify delivery partner during pickup with OTP
  verifyPickupOTP: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { otp } = req.body;
      const restaurantId = req.user.restaurantId;

      const order = await Order.findOne({
        _id: orderId,
        restaurant: restaurantId,
        status: "ASSIGNED", // Order should be assigned to a delivery partner
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or not in correct status",
        });
      }

      // Verify OTP
      if (order.pickupOTP !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      // Mark pickup as verified from restaurant side
      order.pickupVerification = {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user._id,
      };

      // Update status to PICKED_UP
      await order.updateStatus("PICKED_UP", req.user._id);

      // Send notification to customer
      await sendNotification({
        userId: order.user,
        title: "Order Picked Up",
        body: `Your order #${order.orderNumber} has been picked up by delivery partner`,
        data: { orderId: order._id.toString() },
      });

      // Send notification to delivery partner
      await sendNotification({
        userId: order.deliveryPartner,
        title: "Pickup Verified",
        body: `Pickup for order #${order.orderNumber} has been verified`,
        data: { orderId: order._id.toString() },
      });

      res.status(200).json({
        success: true,
        message: "Pickup verified successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error verifying pickup",
        error: error.message,
      });
    }
  },

  // Reject an order
  rejectOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;
      const restaurantId = req.user.restaurantId;

      const order = await Order.findOne({
        _id: orderId,
        restaurant: restaurantId,
        status: "PENDING", // Can only reject pending orders
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or cannot be rejected",
        });
      }

      order.cancellationReason = reason;
      await order.updateStatus("REJECTED", req.user._id, reason);

      // Send notification to customer
      await sendNotification({
        userId: order.user,
        title: "Order Rejected",
        body: `Your order #${order.orderNumber} was rejected by the restaurant. Reason: ${reason}`,
        data: { orderId: order._id.toString() },
      });

      // Process refund if payment was made
      if (order.paymentStatus === "PAID") {
        // Implement refund logic here or delegate to admin
        // For now, just mark payment status as requiring refund
        order.paymentStatus = "REFUNDED";
        await order.save();
      }

      res.status(200).json({
        success: true,
        message: "Order rejected successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error rejecting order",
        error: error.message,
      });
    }
  },
};

module.exports = restaurantOrder;
