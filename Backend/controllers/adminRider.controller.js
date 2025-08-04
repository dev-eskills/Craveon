// controllers/userController.js

const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");

// Toggle a user's role to "delivery" or back to "user"
const toggleRider = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "delivery") {
      user.role = "user";
    } else {
      user.role = "delivery";
    }

    await user.save();

    return res.status(200).json({
      message: `User role changed to ${user.role}`,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getRiders = expressAsyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search,
    } = req.query;

    const filter = {
      role: { $in: ["delivery"] },
    };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortConfig = {};
    sortConfig[sort] = order === "desc" ? -1 : 1;

    const riders = await User.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      riders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all riders error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = {
  toggleRider,
  getRiders,
};
