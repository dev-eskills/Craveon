const Restaurant = require("../models/Restaurants");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Order = require("../models/Order");
exports.getDashboard = asyncHandler(async (req, res) => {
  //const { restaurantId } = req.params;
  // console.log(req.user.id);

  const userID = req.user.id;
  const restaurantId = await Restaurant.findOne({ owner: userID }).select(
    "_id name"
  );
  // Validate restaurantId
  if (!restaurantId) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  // Validate restaurantId
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid restaurant ID" });
  }

  const dashboardData = await Restaurant.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "restaurant",
        as: "orders",
      },
    },
    {
      $addFields: {
        totalOrders: { $size: "$orders" },
        completedOrders: {
          $size: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: { $eq: ["$$order.status", "COMPLETED"] },
            },
          },
        },
        pendingOrders: {
          $size: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: { $eq: ["$$order.status", "PENDING"] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        totalOrders: 1,
        completedOrders: 1,
        pendingOrders: 1,
      },
    },
  ]);

  if (!dashboardData.length) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found or has no orders",
    });
  }

  res.status(200).json({
    success: true,
    data: dashboardData[0],
  });
});

exports.getRestaurantRevenue = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const restaurantId = await Restaurant.findOne({ owner: userID }).select(
    "_id name"
  );

  // Get the date 7 days ago from today (including today)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days back + today = 7 days

  const revenue = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        paymentStatus: "PAID", // Only include paid orders
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalRevenue: { $sum: "$finalTotal" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date
    },
  ]);

  // Generate result for each of the last 7 days
  const result = [];
  const options = { weekday: "short" };
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); 
    const dateStr = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const dayName = date.toLocaleDateString("en-US", options); // Day of week

    const dayData = revenue.find((r) => r._id === dateStr);

    result.push({
      date: dateStr,
      day: dayName,
      totalRevenue: dayData ? dayData.totalRevenue : 0,
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

exports.restaurantReport = async (req, res) => {
  try {
    const userID = req.user.id;

    const restaurant = await Restaurant.findOne({ owner: userID }).select(
      "_id name"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthStartCopy = new Date(currentMonthStart);

    // ----------------------------
    // Current Month Data
    // ----------------------------
    const currentMonthData = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          paymentStatus: "PAID",
          createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$finalTotal" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // ----------------------------
    // Previous Month Data
    // ----------------------------
    const previousMonthData = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          paymentStatus: "PAID",
          createdAt: { $gte: prevMonthStart, $lt: currentMonthStartCopy },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$finalTotal" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // ----------------------------
    // Total Orders Count
    // ----------------------------
    const totalOrders = await Order.countDocuments({
      restaurant: restaurant._id,
    });

    // ----------------------------
    // Delivered Orders Count
    // ----------------------------
    const deliveredOrders = await Order.countDocuments({
      restaurant: restaurant._id,
      status: "DELIVERED",
    });

    // ----------------------------
    // Cancelled or Rejected Orders
    // ----------------------------
    const cancelledOrders = await Order.countDocuments({
      restaurant: restaurant._id,
      status: { $in: ["CANCELLED", "REJECTED"] },
    });

    // ----------------------------
    // Average Income of Paid Orders
    // ----------------------------
    const avgIncomeResult = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          avgIncome: { $avg: "$finalTotal" },
        },
      },
    ]);

    const averageIncome = avgIncomeResult[0]?.avgIncome || 0;

    // ----------------------------
    // Top 5 Popular Products
    // ----------------------------
    const topProducts = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          paymentStatus: "PAID",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          timesOrdered: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 0,
          productId: "$productInfo._id",
          name: "$productInfo.name",
          timesOrdered: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { timesOrdered: -1 } },
      { $limit: 5 },
    ]);

    // ----------------------------
    // Order Distribution by Status (for Charts)
    // ----------------------------
    const statusDistribution = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$finalTotal" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // ----------------------------
    // Daily Order Trends (Last 30 Days) - Line Chart Data
    // ----------------------------
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrderTrends = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          createdAt: { $gte: thirtyDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
          revenue: { $sum: "$finalTotal" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
          date: {
            $first: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
          },
          statusBreakdown: {
            $push: {
              status: "$_id.status",
              count: "$count",
              revenue: "$revenue",
            },
          },
          totalOrders: { $sum: "$count" },
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    // ----------------------------
    // Weekly Order Status Trends (Last 12 Weeks) - Line Chart Data
    // ----------------------------
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks = 84 days

    const weeklyStatusTrends = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          createdAt: { $gte: twelveWeeksAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
          revenue: { $sum: "$finalTotal" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            week: "$_id.week",
          },
          weekStart: {
            $first: {
              $dateFromParts: {
                isoWeekYear: "$_id.year",
                isoWeek: "$_id.week",
                isoDayOfWeek: 1,
              },
            },
          },
          statusData: {
            $push: {
              status: "$_id.status",
              count: "$count",
              revenue: "$revenue",
            },
          },
          totalOrders: { $sum: "$count" },
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $sort: { weekStart: 1 },
      },
    ]);

    // ----------------------------
    // Format Chart Data for Frontend
    // ----------------------------

    // Pie Chart Data - Status Distribution
    const pieChartData = statusDistribution.map((item) => ({
      status: item._id,
      count: item.count,
      percentage: ((item.count / totalOrders) * 100).toFixed(1),
      revenue: item.totalRevenue,
    }));

    // Line Chart Data - Daily Trends
    const lineChartData = dailyOrderTrends.map((day) => {
      const statusCounts = {};
      const statusRevenue = {};

      // Initialize all possible statuses with 0
      const allStatuses = [
        "PENDING",
        "ACCEPTED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "ASSIGNED",
        "PICKED_UP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "REJECTED",
      ];

      allStatuses.forEach((status) => {
        statusCounts[status] = 0;
        statusRevenue[status] = 0;
      });

      // Fill in actual data
      day.statusBreakdown.forEach((statusItem) => {
        statusCounts[statusItem.status] = statusItem.count;
        statusRevenue[statusItem.status] = statusItem.revenue;
      });

      return {
        date: day.date.toISOString().split("T")[0], // YYYY-MM-DD format
        totalOrders: day.totalOrders,
        totalRevenue: day.totalRevenue,
        ...statusCounts, // Spread individual status counts
        revenue: statusRevenue, // Revenue breakdown by status
      };
    });

    // Line Chart Data - Weekly Trends
    const weeklyLineChartData = weeklyStatusTrends.map((week) => {
      const statusCounts = {};
      const statusRevenue = {};

      // Initialize all possible statuses with 0
      const allStatuses = [
        "PENDING",
        "ACCEPTED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "ASSIGNED",
        "PICKED_UP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "REJECTED",
      ];

      allStatuses.forEach((status) => {
        statusCounts[status] = 0;
        statusRevenue[status] = 0;
      });

      // Fill in actual data
      week.statusData.forEach((statusItem) => {
        statusCounts[statusItem.status] = statusItem.count;
        statusRevenue[statusItem.status] = statusItem.revenue;
      });

      return {
        weekStart: week.weekStart.toISOString().split("T")[0], // YYYY-MM-DD format
        year: week._id.year,
        week: week._id.week,
        totalOrders: week.totalOrders,
        totalRevenue: week.totalRevenue,
        ...statusCounts, // Spread individual status counts
        revenue: statusRevenue, // Revenue breakdown by status
      };
    });

    // ----------------------------
    // Final Response
    // ----------------------------
    res.status(200).json({
      restaurant: restaurant.name,
      restaurantId: restaurant._id,

      currentMonth: {
        month: currentMonthStart.getMonth() + 1,
        year: currentMonthStart.getFullYear(),
        totalIncome: currentMonthData[0]?.totalIncome || 0,
        totalOrders: currentMonthData[0]?.totalOrders || 0,
      },

      previousMonth: {
        month: prevMonthStart.getMonth() + 1,
        year: prevMonthStart.getFullYear(),
        totalIncome: previousMonthData[0]?.totalIncome || 0,
        totalOrders: previousMonthData[0]?.totalOrders || 0,
      },

      stats: {
        totalOrders,
        deliveredOrders,
        cancelledOrders,
        averageIncome: averageIncome.toFixed(2),
      },

      popularItems: topProducts,

      // Chart Data
      charts: {
        // Pie Chart - Order Status Distribution
        statusDistribution: {
          data: pieChartData,
          title: "Order Status Distribution",
          type: "pie",
        },

        // Line Chart - Daily Order Trends (Last 30 Days)
        dailyTrends: {
          data: lineChartData,
          title: "Daily Order Trends (Last 30 Days)",
          type: "line",
          xAxis: "date",
          yAxis: ["totalOrders", "DELIVERED", "CANCELLED", "PENDING"], // Configurable lines
        },

        // Line Chart - Weekly Order Status Trends (Last 12 Weeks)
        weeklyTrends: {
          data: weeklyLineChartData,
          title: "Weekly Order Status Trends (Last 12 Weeks)",
          type: "line",
          xAxis: "weekStart",
          yAxis: ["totalOrders", "DELIVERED", "CANCELLED", "PENDING"], // Configurable lines
        },
      },

      // Raw status breakdown for custom charts
      orderStatusBreakdown: statusDistribution,
    });
  } catch (error) {
    console.error("Error in restaurantReport:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};