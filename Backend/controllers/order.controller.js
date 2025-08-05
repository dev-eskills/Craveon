const Order = require("../models/Order");
const User = require("../models/user");
const Cart = require("../models/cart"); // Assuming you have a Cart model
const Restaurant = require("../models/Restaurants"); // Assuming you have a Restaurant model
const razorpayService = require("../services/payment.service");
const mongoose = require("mongoose");
// const { sendOrderNotification } = require("../services/notification.service"); // Assuming you have a notification service
const logger = require("../config/logger");


exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentMode, deliveryAddressId } = req.body;
    const userId = req.user.id;

    // Validate payment mode - only COD or ONLINE allowed
    if (paymentMode !== "COD" && paymentMode !== "ONLINE") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Payment mode must be either COD or ONLINE" });
    }

    // Get active cart for user
    const cart = await Cart.findOne({ user: userId })
      .populate("restaurant")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Something went wrong try refresh" });
    }


    // Get user to access saved addresses
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Find the selected delivery address
    const deliveryAddress = user.addresses.find(
      (addr) => addr._id.toString() === deliveryAddressId
    );
    if (!deliveryAddress) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Delivery address not found" });
    }

    // Make sure each cart item's selectedAttributes has selectedOption as a string before passing to Order model
    const preparedItems = cart.items.map((item) => {
      const itemObj = item.toObject ? item.toObject() : item;

      return {
        ...itemObj,
        selectedAttributes: (itemObj.selectedAttributes || []).map((attr) => ({
          attributeName: attr.attributeName,
          selectedOption: Array.isArray(attr.selectedOption)
            ? JSON.stringify(attr.selectedOption)
            : String(attr.selectedOption || ""),
          additionalPrice: Number(attr.additionalPrice || 0),
        })),
      };
    });

    // Create properly formatted cart object
    const preparedCart = {
      ...cart.toObject(),
      items: preparedItems,
    };

    // Create order from prepared cart
    const order = await Order.createFromCart(
      preparedCart,
      paymentMode,
      paymentMode === "ONLINE" ? "RAZORPAY" : "NONE",
      deliveryAddress
    );
    await order.save({ session });

    // Handle COD payment
    if (paymentMode === "COD") {
      order.status = "PENDING";
      await order.updateStatus(
        "PENDING",
        "Order confirmed for COD payment",
        req.user.id
      );
      await order.save({ session });

      // Mark cart as completed
      cart.items = []; // clear cart after order//
      cart.status = "COMPLETED";
      await cart.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          finalTotal: order.finalTotal,
          status: order.status,
          estimatedDeliveryTime: order.estimatedDeliveryTime,
        },
      });
    }

    // Handle Online payment (Razorpay)
    else {
      const razorpayOrder = await razorpayService.createOrder({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        amount: order.finalTotal,
        notes: {
          userId: userId,
          restaurantId: order.restaurant.toString(),
        },
      });

      order.paymentDetails.orderId = razorpayOrder.id;
      await order.save({ session });

      // Mark cart as completed
      // cart.status = "COMPLETED";
      // cart.items = []; // clear cart after order//
      // cart.status = "COMPLETED";
      // await cart.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          finalTotal: order.finalTotal,
          status: order.status,
        },
        paymentDetails: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount / 100, // Convert from paise to rupees
          currency: razorpayOrder.currency,
          keyId: razorpayService.getKeyId(),
        },
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Order creation error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

/**
 * Verify and update payment status
 */
exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, paymentId, signature, razorpayOrderId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("restaurant");

    // Verify payment signature
    const isValidSignature = razorpayService.verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId,
      signature,
    });

    if (!isValidSignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find order by Razorpay order ID
    const order = await Order.findOne({
      "paymentDetails.orderId": razorpayOrderId,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment details from Razorpay
    const paymentDetails = await razorpayService.getPaymentDetails(paymentId);

    // Update order payment details
    order.paymentDetails.paymentId = paymentId;
    order.paymentDetails.signature = signature;
    order.paymentDetails.paymentDate = new Date();
    order.paymentDetails.paymentMethod = paymentDetails.method || "";
    order.paymentStatus =
      paymentDetails.status === "captured" ? "PAID" : "PENDING";

    await order.save();

    // Send notification to restaurant
    // await sendOrderNotification(order, "restaurant");
    cart.status = "COMPLETED";
    cart.items = []; // clear cart after order//
    cart.status = "COMPLETED";
    await cart.save();

    return res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res
      .status(500)
      .json({ message: "Failed to verify payment", error: error.message });
  }
};

/**
 * Get order by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await Order.findById(orderId)
      .populate("restaurant", "name address location contactInfo")
      .populate("user", "name email number")
      .populate("deliveryPartner", "name number")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check permissions - user can only see their own orders
    // Admin, restaurant owner, or delivery partner can see orders they're involved with
    if (
      userRole === "USER" &&
      order.user._id.toString() !== userId &&
      userRole !== "ADMIN" &&
      userRole === "RESTAURANT" &&
      order.restaurant._id.toString() !== req.user.restaurantId &&
      userRole === "DELIVERY_PARTNER" &&
      (!order.deliveryPartner ||
        order.deliveryPartner._id.toString() !== userId)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return res
      .status(500)
      .json({ message: "Failed to get order", error: error.message });
  }
};

/**
 * Get all orders for current user
 */
// exports.getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

//     const query = { user: userId };
//     if (status) {
//       query.status = status.toUpperCase();
//     }

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort: sort,
//       populate: [
//         { path: "restaurant", select: "name address" },
//         { path: "deliveryPartner", select: "name phone" },
//       ],
//     };

//     const orders = await Order.paginate(query, options);

//     return res.status(200).json(orders);
//   } catch (error) {
//     console.error("Get user orders error:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to get orders", error: error.message });
//   }
// };

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // latest first
      .populate("restaurant", "name address")
      .populate("deliveryPartner", "name phone")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error.message);
    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

/**
 * Get all orders for a restaurant
 */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const { status, sort = "-createdAt" } = req.query;

    // Authorization check
    if (req.user.role === "user") {
      return res
        .status(403)
        .json({ message: "Not authorized to view restaurant orders" });
    }

    // Find restaurant that belongs to the logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found for this user" });
    }

    // Build query object using restaurant._id
    const query = { restaurant: restaurant._id };
    if (status) {
      query.status = status.toUpperCase();
    }

    // Find orders for this restaurant
    const orders = await Order.find(query)
      .populate("user", "name number")
      .populate("restaurant", "name")
      .select("orderNumber user restaurant items finalTotal status createdAt")
      .sort(sort);

    return res.status(200).json({
      success: true,
      restaurant: restaurant.name,
      orders: orders,
    });
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    return res.status(500).json({
      message: "Failed to get restaurant orders",
      error: error.message,
    });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await Order.findById(id)
      .populate("restaurant", "name")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check permissions based on status and user role
    const canUpdateStatus = checkStatusUpdatePermission(
      order,
      status,
      userRole,
      req.user.restaurantId
    );
    if (!canUpdateStatus) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order status" });
    }

    // Handle special cases
    if (status === "CANCELLED") {
      // Additional cancellation logic
      order.cancellationReason =
        req.body.cancellationReason || "No reason provided";
      order.cancellationNotes = req.body.cancellationNotes || "";

      // If payment was already made, initiate refund
      if (order.paymentStatus === "PAID" && order.paymentMode === "ONLINE") {
        try {
          const refundAmount = order.calculateRefundAmount(
            req.body.refundAmount
          );

          if (refundAmount > 0) {
            const refund = await razorpayService.processRefund({
              paymentId: order.paymentDetails.paymentId,
              amount: refundAmount,
              notes: {
                orderNumber: order.orderNumber,
                reason: order.cancellationReason,
              },
            });

            // Update payment details with refund info
            order.paymentDetails.refundId = refund.id;
            order.paymentDetails.refundAmount = refundAmount;
            order.paymentDetails.refundDate = new Date();
            order.paymentDetails.refundStatus = refund.status;
            order.paymentStatus = "REFUNDED";
          }
        } catch (refundError) {
          console.error("Refund processing error:", refundError);
          // Still update the status but note the refund error
          order.adminNotes = `${order.adminNotes || ""
            }\nRefund processing failed: ${refundError.message}`;
        }
      }
    }

    // Update order status
    await order.updateStatus(status, notes, userId);

    // Send notifications based on status update
    await sendOrderNotification(order, "status_update");

    return res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

/**
 * Check if user has permission to update order status
 */
function checkStatusUpdatePermission(
  order,
  newStatus,
  userRole,
  userRestaurantId
) {
  const currentStatus = order.status;

  // Admin can update any status
  if (userRole === "ADMIN") {
    return true;
  }

  // Restaurant can only update their own orders
  if (userRole === "RESTAURANT") {
    if (order.restaurant._id.toString() !== userRestaurantId) {
      return false;
    }

    // Restaurant allowed status updates
    const allowedUpdates = {
      PENDING: ["ACCEPTED", "REJECTED"],
      ACCEPTED: ["PREPARING"],
      PREPARING: ["READY_FOR_PICKUP"],
      READY_FOR_PICKUP: ["OUT_FOR_DELIVERY"],
    };

    return (
      allowedUpdates[currentStatus] &&
      allowedUpdates[currentStatus].includes(newStatus)
    );
  }

  // Delivery partner can update delivery status
  if (userRole === "DELIVERY_PARTNER") {
    const allowedUpdates = {
      READY_FOR_PICKUP: ["OUT_FOR_DELIVERY"],
      OUT_FOR_DELIVERY: ["DELIVERED"],
    };

    return (
      order.deliveryPartner &&
      order.deliveryPartner.toString() === req.user.id &&
      allowedUpdates[currentStatus] &&
      allowedUpdates[currentStatus].includes(newStatus)
    );
  }

  // User can only cancel their own orders
  if (userRole === "USER") {
    if (order.user._id.toString() !== req.user.id) {
      return false;
    }

    // Users can only cancel orders that are not yet being prepared
    return (
      newStatus === "CANCELLED" &&
      ["PENDING", "ACCEPTED"].includes(currentStatus)
    );
  }

  return false;
}

/**
 * Assign delivery partner to order
 */
exports.assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId, riderId: deliveryPartnerId, status } = req.body;

    // Only admin or restaurant can assign delivery partner
    if (req.user.role !== "admin" && req.user.role !== "restaurant") {
      return res
        .status(403)
        .json({ message: "Not authorized to assign delivery partner" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restaurant can only assign for their own orders
    if (
      req.user.role === "restaurant" &&
      order.restaurant.toString() !== req.user.restaurantId
    ) {
      return res.status(403).json({
        message:
          "Can only assign delivery partners to your own restaurant orders",
      });
    }

    // Check if order status is appropriate for delivery assignment
    if (["ACCEPTED", "PREPARING", "READY_FOR_PICKUP"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot assign delivery partner at current order status",
      });
    }

    // Verify delivery partner exists
    const deliveryPartner = await User.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Update order with delivery partner
    order.deliveryPartner = deliveryPartnerId;
    await order.save();

    // Send notification to delivery partner
    // await sendOrderNotification(order, "delivery_partner");

    return res.status(200).json({
      success: true,
      message: "Delivery partner assigned successfully",
      deliveryPartner: {
        _id: deliveryPartner._id,
        name: deliveryPartner.name,
      },
    });
  } catch (error) {
    console.error("Assign delivery partner error:", error);
    return res.status(500).json({
      message: "Failed to assign delivery partner",
      error: error.message,
    });
  }
};

exports.updateOrderTrackStatus = async (req, res) => {
  try {
    const { orderId, status, riderId } = req.body;
    const user = req.user;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allowed status transitions by role
    const validTransitions = {
      admin: ["ASSIGNED"],
      user: ["CANCELLED"],
      restaurant: ["ACCEPTED", "REJECTED", "PREPARING", "READY_FOR_PICKUP"],
      delivery_partner: ["OUT_FOR_DELIVERY", "DELIVERED"],
    };

    // Check if role is allowed to set this status
    const allowed = validTransitions[user.role] || [];
    if (!allowed.includes(status)) {
      return res.status(403).json({
        message: `You are not allowed to set status to ${status}`,
      });
    }

    // Specific logic for ASSIGNING delivery partner (only ADMIN can do it)
    if (status === "ASSIGNED") {
      if (!riderId) {
        return res
          .status(400)
          .json({ message: "riderId is required to assign delivery partner" });
      }

      if (order.status !== "READY_FOR_PICKUP") {
        return res.status(400).json({
          message:
            "Delivery partner can only be assigned when order is READY_FOR_PICKUP",
        });
      }

      const rider = await User.findById(riderId);
      if (!rider) {
        return res.status(404).json({ message: "Delivery partner not found" });
      }

      order.deliveryPartner = riderId;
    }

    if (order.status === "DELIVERED") {
      if (status === "CANCELLED") {
        return res
          .status(402)
          .json({ message: "You are not able to cancel order" });
      }
    }
    // Update the order status
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,

      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        deliveryPartner: order.deliveryPartner,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
};

/**
 * Add customer rating and review
 */
exports.addCustomerRating = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify the order belongs to the user
    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to rate this order" });
    }

    // Check if order is delivered
    if (order.status !== "DELIVERED") {
      return res
        .status(400)
        .json({ message: "Can only rate delivered orders" });
    }

    // Add or update rating
    order.customerRating = {
      rating,
      review: review || "",
      timestamp: new Date(),
    };

    await order.save();

    // Update restaurant rating
    const Restaurant = mongoose.model("Restaurant");
    await Restaurant.updateRating(order.restaurant);

    return res.status(200).json({
      success: true,
      message: "Rating added successfully",
      customerRating: order.customerRating,
    });
  } catch (error) {
    console.error("Add customer rating error:", error);
    return res
      .status(500)
      .json({ message: "Failed to add rating", error: error.message });
  }
};

/**
 * Get all orders (admin only)
 */
exports.getAllOrders = async (req, res) => {
  try {
    // Only admin can access all orders
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to access all orders" });
    }

    const {
      status,
      restaurant,
      user,
      deliveryPartner,
      paymentStatus,
      paymentMode,
      startDate,
      endDate,
      page = 1,
      orderNumber,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status.toUpperCase();
    if (restaurant) query.restaurant = restaurant;
    if (user) query.user = user;
    if (deliveryPartner) query.deliveryPartner = deliveryPartner;
    if (paymentStatus) query.paymentStatus = paymentStatus.toUpperCase();
    if (paymentMode) query.paymentMode = paymentMode.toUpperCase();
    if (orderNumber) {
      query.orderNumber = { $regex: orderNumber, $options: "i" };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        { path: "restaurant", select: "name address" },
        { path: "user", select: "name email phone" },
        { path: "deliveryPartner", select: "name phone" },
      ],
      select: "orderNumber user items finalTotal status createdAt subtotal",
    };

    const orders = await Order.paginate(query, options);
    console.log(orders.docs[0].items, "Orders from get all order");
    orders.docs = orders.docs.map((order) => {
      const itemTotalSum = order.subtotal;
      console.log(itemTotalSum, "restaurant margin");
      return {
        ...order.toObject(), // convert Mongoose document to plain object
        restaurantTotal: itemTotalSum,
      };
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    return res
      .status(500)
      .json({ message: "Failed to get orders", error: error.message });
  }
};

/**
 * Get order dashboard metrics
 */
exports.getOrderMetrics = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;
    const userRole = req.user.role;

    // Build date range query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    // Build restaurant filter
    const restaurantQuery = {};
    if (userRole === "RESTAURANT") {
      restaurantQuery.restaurant = req.user.restaurantId;
    } else if (restaurantId && userRole === "ADMIN") {
      restaurantQuery.restaurant = restaurantId;
    }

    // Create combined query
    const query = { ...dateQuery, ...restaurantQuery };

    // Get order counts by status
    const statusCounts = await Order.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get payment stats
    const paymentStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentMode",
          count: { $sum: 1 },
          total: { $sum: "$finalTotal" },
        },
      },
    ]);

    // Get daily order count for chart
    const dailyOrders = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$finalTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format status counts into object
    const formattedStatusCounts = {};
    statusCounts.forEach((item) => {
      formattedStatusCounts[item._id] = item.count;
    });

    // Calculate total orders and revenue
    const totalOrders = Object.values(formattedStatusCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalRevenue = paymentStats.reduce(
      (sum, item) => sum + item.total,
      0
    );

    return res.status(200).json({
      totalOrders,
      totalRevenue,
      statusCounts: formattedStatusCounts,
      paymentStats,
      dailyOrders,
    });
  } catch (error) {
    console.error("Get order metrics error:", error);
    return res
      .status(500)
      .json({ message: "Failed to get order metrics", error: error.message });
  }
};

/**
 * Update order notes (admin or restaurant)
 */
exports.updateOrderNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurantNotes, adminNotes } = req.body;
    const userRole = req.user.role;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check permission
    if (userRole === "RESTAURANT") {
      if (order.restaurant.toString() !== req.user.restaurantId) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this order" });
      }

      // Restaurant can only update restaurant notes
      if (restaurantNotes !== undefined) {
        order.restaurantNotes = restaurantNotes;
      }
    } else if (userRole === "ADMIN") {
      // Admin can update both notes
      if (restaurantNotes !== undefined) {
        order.restaurantNotes = restaurantNotes;
      }
      if (adminNotes !== undefined) {
        order.adminNotes = adminNotes;
      }
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to update order notes" });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order notes updated successfully",
    });
  } catch (error) {
    console.error("Update order notes error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update order notes", error: error.message });
  }
};

// all the controller for orders placed and related
exports.orderOverview = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let totalOrders = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let acceptedOrders = 0;
    let preparingOrders = 0;
    let readyForPickupOrders = 0;
    let assignedOrders = 0;
    let outForDeliveryOrders = 0;
    let rejectedOrders = 0;

    // Loop to populate counters

    // Loop over result to populate counters
    result.forEach((item) => {
      totalOrders += item.count;

      switch (item._id) {
        case "PENDING":
          pendingOrders += item.count;
          break;
        case "ACCEPTED":
          acceptedOrders += item.count;
          break;
        case "PREPARING":
          preparingOrders += item.count;
          break;
        case "READY_FOR_PICKUP":
          readyForPickupOrders += item.count;
          break;
        case "ASSIGNED":
          assignedOrders += item.count;
          break;
        case "OUT_FOR_DELIVERY":
          outForDeliveryOrders += item.count;
          break;
        case "DELIVERED":
          completedOrders += item.count;
          break;
        case "CANCELLED":
          cancelledOrders += item.count;
          break;
        case "REJECTED":
          rejectedOrders += item.count;
          break;
        default:
        case "REJECTED":
          cancelledOrders += item.count;
          break;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        acceptedOrders,
        preparingOrders,
        readyForPickupOrders,
        assignedOrders,
        outForDeliveryOrders,
        completedOrders,
        cancelledOrders,
        rejectedOrders,
        completedOrders,
        cancelledOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching order overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.revenueOverview = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 5;

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (days - 1));

    const rawData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: "PAID",
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1 (Sun) to 7 (Sat)
        },
      },
      {
        $group: {
          _id: "$date",
          totalIncome: { $sum: "$finalTotal" },
          orderCount: { $sum: 1 },
          dayOfWeek: { $first: "$dayOfWeek" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dayMap = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

    const resultMap = {};
    rawData.forEach((entry) => {
      resultMap[entry._id] = {
        day: dayMap[entry.dayOfWeek - 1],
        totalIncome: entry.totalIncome,
        orderCount: entry.orderCount,
      };
    });

    const fullResult = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = dayMap[d.getDay()];

      fullResult.push({
        _id: dateStr,
        day: dayName,
        totalIncome: resultMap[dateStr]?.totalIncome || 0,
        orderCount: resultMap[dateStr]?.orderCount || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: fullResult,
    });
  } catch (error) {
    console.error("Revenue Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue overview",
      error: error.message,
    });
  }
};
