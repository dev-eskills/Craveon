const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay with your key_id and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a new Razorpay order
 * @param {Object} orderData - Order data
 * @param {string} orderData.orderId - Order ID in your system
 * @param {string} orderData.orderNumber - Order number for reference
 * @param {number} orderData.amount - Amount in smallest currency unit (e.g., paise for INR)
 * @param {string} orderData.currency - Currency code (default: INR)
 * @param {Object} orderData.notes - Additional notes for the order
 * @returns {Promise<Object>} - Razorpay order object
 */
exports.createOrder = async (orderData) => {
  try {
    const {
      orderId,
      orderNumber,
      amount,
      currency = "INR",
      notes = {},
    } = orderData;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency,
      receipt: orderNumber,
      notes: {
        orderId,
        ...notes,
      },
    });

    return razorpayOrder;
  } catch (error) {
    console.error("Razorpay create order error:", error);
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

/**
 * Verifies Razorpay payment signature
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.orderId - Razorpay order ID
 * @param {string} paymentData.paymentId - Razorpay payment ID
 * @param {string} paymentData.signature - Razorpay signature
 * @returns {boolean} - Whether the signature is valid
 */
exports.verifyPaymentSignature = (paymentData) => {
  try {
    const { orderId, paymentId, signature } = paymentData;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    return false;
  }
};

/**
 * Process refund for a payment
 * @param {Object} refundData - Refund data
 * @param {string} refundData.paymentId - Razorpay payment ID
 * @param {number} refundData.amount - Amount to refund
 * @param {boolean} refundData.fullRefund - Whether to refund the full amount
 * @param {string} refundData.speed - Refund speed ('normal' or 'optimum')
 * @param {Object} refundData.notes - Additional notes for the refund
 * @returns {Promise<Object>} - Razorpay refund object
 */
exports.processRefund = async (refundData) => {
  try {
    const {
      paymentId,
      amount,
      fullRefund = false,
      speed = "normal",
      notes = {},
    } = refundData;

    const refundOptions = {
      payment_id: paymentId,
      speed,
      notes,
    };

    // If fullRefund is true, don't specify amount to refund the entire payment
    if (!fullRefund && amount) {
      refundOptions.amount = Math.round(amount * 100); // Convert to smallest currency unit
    }

    const refund = await razorpay.refunds.create(refundOptions);
    return refund;
  } catch (error) {
    console.error("Razorpay refund error:", error);
    throw new Error(`Failed to process refund: ${error.message}`);
  }
};

/**
 * Fetch payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} - Razorpay payment object
 */
exports.getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Razorpay fetch payment error:", error);
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
};

/**
 * Fetch refund details from Razorpay
 * @param {string} refundId - Razorpay refund ID
 * @returns {Promise<Object>} - Razorpay refund object
 */
exports.getRefundDetails = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    console.error("Razorpay fetch refund error:", error);
    throw new Error(`Failed to fetch refund details: ${error.message}`);
  }
};

/**
 * Get Razorpay key ID for client-side integration
 * @returns {string} - Razorpay key ID
 */
exports.getKeyId = () => {
  return process.env.RAZORPAY_KEY_ID;
};
