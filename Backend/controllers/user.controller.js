const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { verifyOtpToken } = require("./otp.controller");
// Function to generate JWT token

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, number, otpToken } = req.body;

  const userExist = await User.findOne({ number });

  if (userExist) {
    res.status(409);
    throw new Error("User already exists With this number");
  }
  // Validate required fields
  if (!name || !email || !password || !number || !otpToken) {
    res.status(400);
    throw new Error("Please Fill All Details!");
  }

  try {
    // Verify OTP
    if (!(await verifyOtpToken(number, otpToken))) {
      res.status(400);
      throw new Error("Invalid OTP Token");
    }

    // Check for existing user
    const userExist = await User.findOne({ number });
    if (userExist) {
      res.status(409);
      throw new Error("User Already Exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with required number field
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      number, // This is now required and must be unique
    });

    if (!user) {
      res.status(500);
      throw new Error("User Not Created");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      accessToken,
    });
  } catch (error) {
    console.log(error , "error from register user")
    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      res.status(409);
      throw new Error(
        duplicateField
          ? `User already exists with this ${duplicateField}`
          : "User already exists"
      );
    }

    throw error;
  }
});

const loginUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const { number, password } = req.body;

    // Check if all fields are provided
    if (!number || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter number and password" });
    }

    // Find user (could be a restaurant owner or normal user)
    const user = await User.findOne({ number });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
      },
      accessToken,
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
});

const logoutUser = expressAsyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken, "token");
    // If no refresh token in cookies, return 204 No Content
    if (!refreshToken) {
      return res.status(204).json({
        success: false,
        message: "No active session found",
      });
    }

    // Find user with the refresh token
    let user;
    try {
      user = await User.findOne({ refreshToken });
    } catch (dbError) {
      console.error("Database error while finding user:", dbError);
      return res.status(500).json({
        success: false,
        message: "Internal server error while accessing database",
      });
    }

    // Clear cookie regardless of user found or not
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("refreshToken", cookieOptions);

    // If no user found with the token, return 204
    if (!user) {
      return res.status(204).json({
        success: false,
        message: "Session already expired or invalid",
      });
    }

    // Update user document by clearing refresh token
    try {
      user.refreshToken = "";
      await user.save();
    } catch (saveError) {
      console.error("Database error while updating user:", saveError);
      return res.status(500).json({
        success: false,
        message: "Internal server error while updating session",
      });
    }

    // Successfully logged out
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Log the unexpected error
    console.error("Unexpected error in logout handler:", error);

    // Clear cookie even in case of error
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during logout",
    });
  }
});

const refreshToken = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.cookies) {
      console.log("No cookies object found in request");
      return res.sendStatus(401);
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("No refresh token found in cookies");
      return res.sendStatus(401);
    }

    // Add debug logging
    console.log("Attempting to verify token");

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Token verification failed:", err.message);
          return res.sendStatus(403);
        }

        const user = await User.findById(decoded.userId);

        // Add debug logging
        console.log("User found:", !!user);
        console.log("Token match:", user?.refreshToken === refreshToken);

        if (!user || user.refreshToken !== refreshToken) {
          console.log("User not found or token mismatch");
          return res.sendStatus(403);
        }

        const newAccessToken = generateAccessToken(user);
        // const newRefreshToken = generateRefreshToken(user._id);

        // user.refreshToken = newRefreshToken;
        // await user.save();

        // res.cookie("refreshToken", newRefreshToken, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production", // Only use secure in production
        //   sameSite: "none",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.sendStatus(500);
  }
});

const privateController = expressAsyncHandler(async (req, res) => {
  res.send("I am Protected Route");
});
const userDetails = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

const editUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    // Find user by ID and update
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // Find user by ID and delete
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressLine1, addressLine2, city, state, zipCode, country, label } =
      req.body;
    if (!addressLine1 || !city || !state || !zipCode || !country) {
      return res
        .status(400)
        .json({ message: "All required address fields must be filled" });
    }

    const newAddress = {
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      label: label || "home",
    };

    // Find the user by ID and add the new address
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      addressId,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      label,
    } = req.body;

    if (!addressId || !addressLine1 || !city || !state || !zipCode) {
      throw new Error("Please fill All details");
    } else {
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(addressId)
      ) {
        return res.status(400).json({ message: "Invalid user or address ID" });
      }

      // Find user and address
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const address = user.addresses.id(addressId);
      if (!address)
        return res.status(404).json({ message: "Address not found" });

      // Update address fields if provided
      Object.assign(address, {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        label,
      });
      console.log(address, "address");
      // Save updated user
      await user.save();

      return res.status(200).json({
        message: "Address updated successfully",
        addresses: user.addresses,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressExists = user.addresses.id(id);
    if (!addressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.pull(id);

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Addresses fetched successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = expressAsyncHandler(async (req, res) => {
  const { phone, otpToken, password } = req.body;
  if (!phone || !otpToken || !password) {
    res.status(400);
    throw new Error("Missing Mandatory Fields");
  }
  const user = await User.findOne({ number: phone });
  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }
  if (await verifyOtpToken(phone, otpToken)) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save();
    res.status(200).json({
      message: "Password Updated Successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid OTP Token");
  }
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search,
    } = req.query;

    const filter = {
      role: { $in: ["user", "delivery"] },
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

    const users = await User.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  privateController,
  editUser,
  deleteUser,
  editAddress,
  deleteAddress,
  addAddress,
  getAllAddresses,
  resetPassword,
  refreshToken,
  userDetails,
};
