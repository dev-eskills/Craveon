/**
 * Utility for sending notifications to users and restaurants
 */
const admin = require("firebase-admin");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");

// Notification service for sending push notifications
const sendNotification = async ({
  userId,
  restaurantId,
  title,
  body,
  data = {},
}) => {
  try {
    let token;

    // If userId is provided, send notification to user
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.fcmToken) {
        token = user.fcmToken;
      } else {
        return {
          success: false,
          message: "User not found or has no FCM token",
        };
      }
    }

    // If restaurantId is provided, send notification to restaurant owner
    if (restaurantId) {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant && restaurant.fcmToken) {
        token = restaurant.fcmToken;
      } else {
        return {
          success: false,
          message: "Restaurant not found or has no FCM token",
        };
      }
    }

    if (!token) {
      return { success: false, message: "No recipient specified" };
    }

    // Send the notification via Firebase
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    const response = await admin.messaging().send(message);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNotification,
};
