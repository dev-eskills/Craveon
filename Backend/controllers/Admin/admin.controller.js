const Order = require("../../models/Order");
const Restaurant = require("../../models/Restaurants");
const Product = require("../../models/Products");
// const Rider = require("../../models/Rider")
const Customer = require("../../models/user");

exports.adminDashboard = async (req, res) => {
  try {
    const allOrders = await Order.find();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments({role:"user"});
    const totalRiders = await Customer.countDocuments({ role: "delivery" });
    // const totalRiders = await Rider.countDocuments();
    let totalIncome = 0;
    let pendingIncome = 0;
    let receivedAmount = 0;

    for (let order of allOrders) {
      totalIncome += order.finalTotal;

      if (order.paymentStatus === "PENDING") {
        pendingIncome += order.finalTotal;
      } else if (order.paymentStatus === "PAID") {
        receivedAmount += order.finalTotal;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalOrders: allOrders.length,
        totalIncome,
        pendingIncome,
        receivedAmount,
        totalRestaurants,
        totalProducts,
        totalCustomers,
        totalRiders
      },
    });
  } catch (err) {
    console.error("Admin dashboard error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data.",
    });
  }
};
