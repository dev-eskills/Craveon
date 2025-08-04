// const User = require("../models/User");
// const Restaurant = require("../models/Restaurants");
// const DeliveryPartner = require("../models/DeliveryPartner");
// const firebase = require("../config/firebase"); // Firebase setup for FCM
// const { sendEmail } = require("./emailService"); // Email service

// /**
//  * Send push notification using Firebase Cloud Messaging
//  * @param {Array} tokens - FCM tokens of the recipient
//  * @param {String} title - Notification title
//  * @param {String} body - Notification body
//  * @param {Object} data - Additional data to send
//  */
// const sendPushNotification = async (tokens, title, body, data) => {
//   if (!tokens || tokens.length === 0) return;

//   try {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       data,
//       tokens, // Multiple tokens can be targeted
//     };

//     const response = await firebase.messaging().sendMulticast(message);
//     console.log(
//       `Successfully sent message: ${response.successCount} successful, ${response.failureCount} failed`
//     );

//     // Handle failed tokens if needed
//     if (response.failureCount > 0) {
//       const failedTokens = [];
//       response.responses.forEach((resp, idx) => {
//         if (!resp.success) {
//           failedTokens.push(tokens[idx]);
//         }
//       });
//       console.log("List of tokens that caused failures: ", failedTokens);
//       // You might want to remove these invalid tokens from your database
//     }
//   } catch (error) {
//     console.error("Error sending push notification:", error);
//   }
// };

// /**
//  * Send email notification
//  * @param {String} email - Recipient email
//  * @param {String} subject - Email subject
//  * @param {String} template - Email template to use
//  * @param {Object} data - Data to populate in the template
//  */
// const sendEmailNotification = async (email, subject, template, data) => {
//   if (!email) return;

//   try {
//     await sendEmail(email, subject, template, data);
//     console.log(`Email sent to ${email} using template ${template}`);
//   } catch (error) {
//     console.error("Error sending email notification:", error);
//   }
// };

// /**
//  * Format time for display in notifications
//  * @param {Date} time - Time to format
//  * @returns {String} Formatted time string
//  */
// const formatTime = (time) => {
//   if (!time) return "soon";

//   const date = new Date(time);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// /**
//  * Send notification about an order
//  * @param {Object} order - Order object
//  * @param {String} notificationType - Type of notification (restaurant, user, delivery_partner, status_update)
//  */
// exports.sendOrderNotification = async (order, notificationType) => {
//   try {
//     let recipient, title, body, data, emailTemplate;

//     switch (notificationType) {
//       case "restaurant":
//         // Notify restaurant about new order
//         recipient = await Restaurant.findById(order.restaurant);
//         if (!recipient) return;

//         title = `New Order: #${order.orderNumber}`;
//         body = `You have received a new order for ${order.totalQuantity} items. Total: ${order.finalTotal}`;
//         data = {
//           orderId: order._id.toString(),
//           orderNumber: order.orderNumber,
//           notificationType: "NEW_ORDER",
//         };
//         emailTemplate = "new-restaurant-order";

//         // Send notifications
//         await sendPushNotification(recipient.fcmTokens, title, body, data);
//         await sendEmailNotification(
//           recipient.email,
//           `New Order #${order.orderNumber}`,
//           emailTemplate,
//           { order }
//         );
//         break;

//       case "user":
//         // Notify user about order status
//         recipient = await User.findById(order.user);
//         if (!recipient) return;

//         title = `Order #${order.orderNumber} Update`;
//         body = `Your order status is now: ${order.status}`;
//         if (order.status === "ACCEPTED") {
//           body = `Great news! Your order has been accepted and is being processed.`;
//         } else if (order.status === "OUT_FOR_DELIVERY") {
//           body = `Your food is on the way! Expected delivery by ${formatTime(
//             order.estimatedDeliveryTime
//           )}`;
//         } else if (order.status === "DELIVERED") {
//           body = `Your order has been delivered. Enjoy your meal!`;
//         } else if (
//           order.status === "CANCELLED" ||
//           order.status === "REJECTED"
//         ) {
//           body = `We're sorry, your order has been ${order.status.toLowerCase()}. ${
//             order.cancellationReason || ""
//           }`;
//         }

//         data = {
//           orderId: order._id.toString(),
//           orderNumber: order.orderNumber,
//           notificationType: "ORDER_STATUS_UPDATE",
//           status: order.status,
//         };
//         emailTemplate = "order-status-update";

//         // Send notifications
//         await sendPushNotification(recipient.fcmTokens, title, body, data);
//         await sendEmailNotification(recipient.email, title, emailTemplate, {
//           order,
//         });
//         break;

//       case "delivery_partner":
//         // Notify delivery partner about assigned order
//         if (!order.deliveryPartner) return;

//         recipient = await DeliveryPartner.findById(order.deliveryPartner);
//         if (!recipient) return;

//         title = "New Delivery Assignment";
//         body = `You have been assigned to deliver order #${order.orderNumber}`;
//         data = {
//           orderId: order._id.toString(),
//           orderNumber: order.orderNumber,
//           notificationType: "DELIVERY_ASSIGNMENT",
//           restaurantName: order.restaurantName,
//           restaurantAddress: order.restaurantAddress,
//           customerAddress: order.deliveryAddress,
//           customerPhone: order.phone,
//         };

//         // Send push notification
//         await sendPushNotification(recipient.fcmTokens, title, body, data);
//         break;

//       case "status_update":
//         // Handle status updates - sending to both user and restaurant
//         // User notification
//         await exports.sendOrderNotification(order, "user");

//         // Restaurant notification (for certain status changes)
//         if (["CANCELLED", "DELIVERED"].includes(order.status)) {
//           const restaurant = await Restaurant.findById(order.restaurant);
//           if (restaurant) {
//             title = `Order #${order.orderNumber} ${order.status.toLowerCase()}`;
//             body =
//               order.status === "CANCELLED"
//                 ? `Order #${order.orderNumber} has been cancelled. Reason: ${
//                     order.cancellationReason || "Not provided"
//                   }`
//                 : `Order #${order.orderNumber} has been successfully delivered.`;

//             data = {
//               orderId: order._id.toString(),
//               orderNumber: order.orderNumber,
//               notificationType: "ORDER_STATUS_UPDATE",
//               status: order.status,
//             };

//             await sendPushNotification(restaurant.fcmTokens, title, body, data);
//           }
//         }
//         break;

//       case "payment_confirmation":
//         // Notify user about successful payment
//         recipient = await User.findById(order.user);
//         if (!recipient) return;

//         title = `Payment Confirmed: Order #${order.orderNumber}`;
//         body = `Your payment of ${order.finalTotal} for order #${order.orderNumber} has been confirmed.`;
//         data = {
//           orderId: order._id.toString(),
//           orderNumber: order.orderNumber,
//           notificationType: "PAYMENT_CONFIRMATION",
//         };
//         emailTemplate = "payment-confirmation";

//         // Send notifications
//         await sendPushNotification(recipient.fcmTokens, title, body, data);
//         await sendEmailNotification(recipient.email, title, emailTemplate, {
//           order,
//         });
//         break;

//       default:
//         console.log(`Unknown notification type: ${notificationType}`);
//     }
//   } catch (error) {
//     console.error(`Error sending ${notificationType} notification:`, error);
//   }
// };

// /**
//  * Send batch notifications to multiple users
//  * @param {Array} userIds - Array of user IDs to notify
//  * @param {String} title - Notification title
//  * @param {String} body - Notification body
//  * @param {Object} data - Additional data
//  */
// exports.sendBatchNotifications = async (userIds, title, body, data) => {
//   try {
//     // Fetch all users with their FCM tokens
//     const users = await User.find({ _id: { $in: userIds } });

//     // Collect all FCM tokens
//     const allTokens = users.reduce((tokens, user) => {
//       if (user.fcmTokens && user.fcmTokens.length > 0) {
//         tokens.push(...user.fcmTokens);
//       }
//       return tokens;
//     }, []);

//     // Send push notification to all tokens at once
//     if (allTokens.length > 0) {
//       await sendPushNotification(allTokens, title, body, data);
//     }

//     // Send individual emails
//     for (const user of users) {
//       if (user.email) {
//         await sendEmailNotification(user.email, title, "general-notification", {
//           title,
//           body,
//           ...data,
//         });
//       }
//     }

//     console.log(`Batch notification sent to ${users.length} users`);
//   } catch (error) {
//     console.error("Error sending batch notifications:", error);
//   }
// };

// // Export internal functions for testing
// exports._internal = {
//   sendPushNotification,
//   sendEmailNotification,
//   formatTime,
// };
