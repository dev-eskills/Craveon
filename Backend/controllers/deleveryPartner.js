const Order = require('../models/Order');
const User = require('../models/user');
const Restaurant = require('../models/Restaurants');
// const { sendNotification } = require("../utils/notificationService");
const { calculateDistance } = require('../utils/locationUtils');
const { default: axios } = require('axios');

// Controller for Delivery Partners to manage order pickups and deliveries
const deliveryPartnerController = {
  // Get available orders for delivery
  getAvailableOrders: async (req, res) => {
    try {
      const { latitude, longitude, maxDistance = 10 } = req.query; // maxDistance in km
      const deliveryPartnerId = req.user._id;

      // Find orders that are ready for pickup and not assigned
      const orders = await Order.find({
        status: { $in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
        deliveryPartner: deliveryPartnerId,
      })
        .populate('restaurant', 'name address location contactInfo')
        .populate('user', 'name email number')
        .populate('items.product')
        .sort({ createdAt: -1 });

      // Filter orders by distance if location provided
      let filteredOrders = orders;
      if (latitude && longitude) {
        filteredOrders = orders.filter((order) => {
          const restaurantLocation = order.restaurant.location;
          if (!restaurantLocation || !restaurantLocation.coordinates) {
            return false;
          }

          const [restLong, restLat] = restaurantLocation.coordinates;
          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            restLat,
            restLong
          );

          return distance <= maxDistance;
        });
      }

      res.status(200).json({
        success: true,
        count: filteredOrders.length,
        data: filteredOrders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching available orders',
        error: error.message,
      });
    }
  },

  // Get delivery partner's assigned orders
  getMyOrders: async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const deliveryPartnerId = req.user._id;

      const query = { deliveryPartner: deliveryPartnerId };
      if (status) {
        query.status = status;
      } else {
        // By default, fetch active orders only
        query.status = {
          $in: ['DELIVERED'],
        };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'name email phone deliveryAddress' },
          { path: 'restaurant', select: 'name address location phone' },
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
        message: 'Error fetching orders',
        error: error.message,
      });
    }
  },

  // Accept an order for delivery
  acceptOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const deliveryPartnerId = req.user._id;

      // Find order that is ready for pickup and not assigned
      const order = await Order.findOne({
        _id: orderId,
        status: 'ASSIGNED',
        deliveryPartner: deliveryPartnerId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or already assigned',
        });
      }

      // Check if delivery partner has any active orders
      const activeOrdersCount = await Order.countDocuments({
        deliveryPartner: deliveryPartnerId,
        status: { $in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
      });

      // Optional: Limit active orders per delivery partner
      // const MAX_ACTIVE_ORDERS = 3; // Can be configured
      // if (activeOrdersCount >= MAX_ACTIVE_ORDERS) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `You already have ${activeOrdersCount} active orders. Please complete them first.`,
      //   });
      // }

      // Assign order to delivery partner
      await order.assignToDeliveryPartner(deliveryPartnerId);
      order.status = 'PICKED_UP';
      await order.save();

      // Fetch restaurant details for the response
      const restaurant = await Restaurant.findById(
        order.restaurant,
        'name address phone location'
      );

      // // Send notification to restaurant
      // await sendNotification({
      //   restaurantId: order.restaurant,
      //   title: "Delivery Partner Assigned",
      //   body: `A delivery partner has been assigned to order #${order.orderNumber}`,
      //   data: {
      //     orderId: order._id.toString(),
      //     deliveryPartnerId: deliveryPartnerId.toString(),
      //   },
      // });

      // // Send notification to customer
      // await sendNotification({
      //   userId: order.user,
      //   title: "Delivery Partner Assigned",
      //   body: `A delivery partner has been assigned to your order #${order.orderNumber}`,
      //   data: { orderId: order._id.toString() },
      // });

      res.status(200).json({
        success: true,
        message: 'Order assigned successfully',
        data: {
          order,
          restaurant,
          pickupOTP: order.pickupOTP, // Share OTP with delivery partner
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error accepting order',
        error: error.message,
      });
    }
  },

  // Verify pickup with OTP (delivery partner side)
  verifyPickup: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { otp } = req.body;
      const deliveryPartnerId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId,
        status: 'ASSIGNED',
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or not in correct status',
        });
      }

      // Verify pickup using the order method
      try {
        await order.verifyPickup(otp, deliveryPartnerId);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // Send notification to customer
      // await sendNotification({
      //   userId: order.user,
      //   title: "Order Picked Up",
      //   body: `Your order #${order.orderNumber} has been picked up by the delivery partner`,
      //   data: { orderId: order._id.toString() },
      // });

      res.status(200).json({
        success: true,
        message: 'Pickup verified successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verifying pickup',
        error: error.message,
      });
    }
  },

  // Mark order as out for delivery
  markOutForDelivery: async (req, res) => {
    try {
      const { orderId } = req.params;
      const deliveryPartnerId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId,
        status: 'PICKED_UP',
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or not in correct status',
        });
      }

      // Mark order as out for delivery
      try {
        await order.markOutForDelivery(deliveryPartnerId);
        order.status = 'OUT_FOR_DELIVERY';
        await order.save();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order marked as out for delivery',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message,
      });
    }
  },

  // Verify delivery with OTP
  verifyDelivery: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { otp } = req.body;
      const deliveryPartnerId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId,
        status: 'OUT_FOR_DELIVERY',
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or not in correct status',
        });
      }

      // Verify delivery using the order method
      try {
        // await order.verifyDelivery(null, deliveryPartnerId);
        order.status = 'DELIVERED';
        await order.save();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // Send notification to customer
      // await sendNotification({
      //   userId: order.user,
      //   title: "Order Delivered",
      //   body: `Your order #${order.orderNumber} has been delivered successfully. Enjoy your meal!`,
      //   data: { orderId: order._id.toString() },
      // });

      // Send notification to restaurant
      // await sendNotification({
      //   restaurantId: order.restaurant,
      //   title: "Order Delivered",
      //   body: `Order #${order.orderNumber} has been delivered successfully`,
      //   data: { orderId: order._id.toString() },
      // });

      res.status(200).json({
        success: true,
        message: 'Delivery completed successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verifying delivery',
        error: error.message,
      });
    }
  },

  // Report an issue with delivery
  reportDeliveryIssue: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { issue, details } = req.body;
      const deliveryPartnerId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Add issue to order notes
      const issueNote = `Delivery Issue: ${issue}\nDetails: ${details}\nReported at: ${new Date().toISOString()}`;

      if (!order.statusHistory) {
        order.statusHistory = [];
      }

      // Add issue to status history for tracking
      order.statusHistory.push({
        status: order.status,
        timestamp: new Date(),
        notes: issueNote,
        updatedBy: deliveryPartnerId,
      });

      await order.save();

      // Notify admin about the issue
      // const adminUsers = await User.find({ role: "admin" });
      // for (const admin of adminUsers) {
      //   await sendNotification({
      //     userId: admin._id,
      //     title: "Delivery Issue Reported",
      //     body: `Issue reported for order #${order.orderNumber}: ${issue}`,
      //     data: {
      //       orderId: order._id.toString(),
      //       issueType: issue,
      //     },
      //   });
      // }

      res.status(200).json({
        success: true,
        message: 'Delivery issue reported successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reporting issue',
        error: error.message,
      });
    }
  },

  // Update location during delivery
  updateLocation: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { latitude, longitude } = req.body;
      const deliveryPartnerId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId,
        status: { $in: ['PICKED_UP', 'OUT_FOR_DELIVERY'] },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or not in active delivery',
        });
      }

      // Update delivery partner's location in the database
      // This can be stored in a separate collection for real-time tracking
      await User.findByIdAndUpdate(deliveryPartnerId, {
        'location.coordinates': [parseFloat(longitude), parseFloat(latitude)],
        'location.updatedAt': new Date(),
      });

      // Optionally notify customer about location update
      // You might want to implement a throttle mechanism to avoid too many notifications

      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating location',
        error: error.message,
      });
    }
  },
};

module.exports = deliveryPartnerController;
