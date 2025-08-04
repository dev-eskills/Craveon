const Restaurant = require("../models/Restaurants");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const mongoose = require("mongoose");
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

exports.createRestaurant = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      password,
      number,
      description = "",
      address,
      contactInfo = {},
      cuisine = [],
      priceRange = "$$",
      foodType = "Both",
      businessHours = [],
      deliverySettings = {},
      pickupSettings = {},
      paymentOptions = {},
      images = {},
      tags = [],
      taxInfo = {},
      bankDetails = {},
      supportedLanguages = ["English"],
      commissionRate,
      packagingCharge,
    } = req.body;

    // Comprehensive validation
    const validationErrors = [];
    if (!name) validationErrors.push("Restaurant name is required");
    if (!email) validationErrors.push("Email is required");
    if (!password) validationErrors.push("Password is required");
    if (!number) validationErrors.push("Contact number is required");

    // Address validation
    const requiredAddressFields = ["street", "city", "state", "zipCode"];
    requiredAddressFields.forEach((field) => {
      if (!address?.[field]) {
        validationErrors.push(`Address ${field} is required`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validationErrors,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { number }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or phone number already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (restaurant owner)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      number,
      role: "restaurant",
    });

    // Create restaurant data
    const restaurantData = {
      name,
      owner: newUser._id,
      description,
      address: {
        ...address,
        country: address.country || "India",
        coordinates: address.coordinates || { lat: null, lng: null },
      },
      location: {
        type: req.body.location?.type || "Point",
        coordinates: req.body.location?.coordinates || [0, 0],
        displayName: req.body.location?.displayName || "",
      },
      contactInfo: {
        phones: contactInfo.phones || [],
        email: contactInfo.email || email,
        website: contactInfo.website || "",
      },
      cuisine,
      priceRange,
      foodType,
      businessHours: businessHours.map((hour) => ({
        ...hour,
        displayFormat: hour.displayFormat || `${hour.open} - ${hour.close}`,
      })),
      deliverySettings: {
        isDeliveryAvailable: true,
        deliveryRadius: 5,
        minimumOrderAmount: 0,
        deliveryFee: 0,
        ...deliverySettings,
      },
      pickupSettings: {
        isPickupAvailable: true,
        ...pickupSettings,
      },
      paymentOptions: {
        acceptsCash: true,
        acceptsOnlinePayment: true,
        acceptsWalletPayment: false,
        ...paymentOptions,
      },
      images: {
        logo: images.logo || "",
        cover: images.cover || "",
        gallery: images.gallery || [],
      },
      tags,
      taxInfo,
      bankDetails,
      supportedLanguages,
      // Default additional fields
      ratings: { average: 0, count: 0 },
      featured: false,
      isActive: true,
      isVerified: false,
      commissionRate,
      packagingCharge: packagingCharge || 0,
      isOrderingEnabled: true,
    };

    // Create new restaurant
    const newRestaurant = new Restaurant(restaurantData);

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser._id);

    // Save user and restaurant with transaction
    await newUser.save({ session });
    await newRestaurant.save({ session });

    // Update user with refresh token
    newUser.refreshToken = refreshToken;
    await newUser.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Set refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with success
    res.status(201).json({
      message: "Restaurant registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        number: newUser.number,
        role: newUser.role,
      },
      restaurant: {
        id: newRestaurant._id,
        name: newRestaurant.name,
        address: newRestaurant.fullAddress,
      },
      accessToken,
    });
  } catch (error) {
    // Rollback transaction if error occurs
    await session.abortTransaction();
    session.endSession();

    console.error("Create restaurant error:", error);

    // Handle specific error types
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate entry",
        details: error.keyValue,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get All Restaurants with Filtering, Sorting and Pagination
exports.getAllRestaurants = asyncHandler(async (req, res) => {
  try {
    ///--------------------------------
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      city,
      cuisine,
      priceRange,
      isActive,
      featured,
      search,
      minRating,
      latitude,
      longitude,
      mxRadius,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "desc" ? -1 : 1;

    const filters = [];

    if (city) filters.push({ "address.city": city });

    if (cuisine) {
      filters.push({
        cuisine: { $in: Array.isArray(cuisine) ? cuisine : [cuisine] },
      });
    }

    if (priceRange) filters.push({ priceRange });

    if (req.query.hasOwnProperty("isActive")) {
      filters.push({ isActive: isActive === "true" });
    }

    if (featured !== undefined) {
      filters.push({ featured: featured === "true" });
    }

    if (minRating) {
      filters.push({ "ratings.average": { $gte: parseFloat(minRating) } });
    }

    if (search) {
      filters.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
          { "address.street": { $regex: search, $options: "i" } },
        ],
      });
    }

    // Base pipeline (geoNear must be first if present)
    const pipeline = [];

    if (latitude && longitude) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(mxRadius || 5000),
        },
      });
    }

    if (filters.length > 0) {
      pipeline.push({ $match: { $and: filters } });
    }

    // $facet for pagination + total count
    pipeline.push({
      $facet: {
        data: [
          { $sort: { [sort]: sortOrder } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              name: 1,
              address: 1,
              images: 1,
              description: 1,
              foodType: 1,
              isActive: 1,
              businessHours: 1,
              owner: 1,
              distance: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    // Run query
    const result = await Restaurant.aggregate(pipeline);

    const restaurants = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    ///--------------------------------
    const now = new Date();
    const currentDay = now.getDay();

    // Add isOpen field
    const parseTimeToMinutes = (timeStr) => {
      // Handles both "06:00", "6:00", "18:00", "6:00 PM", "06:00 AM", etc.
      if (!timeStr) return 0;
      let [time, modifier] = timeStr.split(' ');
      if (!modifier) modifier = '';
      let [hours, minutes] = time.split(':').map(Number);

      // If modifier exists, handle AM/PM
      if (modifier.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
      return hours * 60 + (minutes || 0);
    };


    const formattedRestaurants = restaurants.map((restaurant) => {
      const todayHours = restaurant.businessHours.find(
        (hour) => hour.day === currentDay
      );

      let isOpen = false;

      if (todayHours && !todayHours.isClosed) {
        const nowTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

        const openTime = parseTimeToMinutes(todayHours.open);
        const closeTime = parseTimeToMinutes(todayHours.close);

        // Handle overnight hours (e.g., open: 22:00, close: 06:00)
        if (closeTime > openTime) {
          isOpen = nowTime >= openTime && nowTime < closeTime;
        } else if (closeTime < openTime) {
          // Overnight: open at night, close in the morning
          isOpen = nowTime >= openTime || nowTime < closeTime;
        } else {
          // openTime === closeTime means closed all day
          isOpen = false;
        }
      }

      return {
        ...restaurant,
        isOpen,
        businessHours: todayHours,
      };
    });

    //const total = await Restaurant.countDocuments();

    res.status(200).json({
      restaurants: formattedRestaurants,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all restaurants error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

exports.updateRestaurant = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update the restaurant with all provided fields from req.body
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: req.body }, // Update only provided fields
      { new: true, runValidators: true } // Return updated document & apply validation
    );

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Get a Single Restaurant by ID
exports.getRestaurantById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    const restaurant = await Restaurant.findOne({ owner: id }).populate(
      "owner",
      "name email number"
    );
    if (!restaurant) {
      const restaurant = await Restaurant.findById(id).populate(
        "owner",
        "name email number"
      );
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(200).json(restaurant);
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Updated Function for Image Upload

// Configure multer for memory storage (we'll upload to Cloudinary from memory)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Initialize upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload middleware configuration for restaurant images
exports.uploadRestaurantImages = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "cover", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);

// Helper function to handle file upload to Cloudinary
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    // Create a readable stream from buffer
    const stream = require("stream");
    const readStream = new stream.PassThrough();
    readStream.end(file.buffer);

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `restaurants/${folder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    readStream.pipe(uploadStream);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// Helper to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = parts
    .slice(parts.indexOf("restaurants"))
    .join("/")
    .split(".")[0];
  return publicId;
};

// Update restaurant images controller
exports.updateRestaurantImages = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.id; // Fix variable name typo
    const restaurant = await Restaurant.findOne({ owner: ownerId }); // Use findOne()
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if files exist
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "No images uploaded. Please upload at least one image.",
      });
    }

    // Prepare update data
    const updateData = {};

    // Handle logo update
    if (req.files.logo) {
      // Delete old logo if exists
      if (restaurant?.images?.logo) {
        const publicId = getPublicIdFromUrl(restaurant.images.logo);
        await deleteFromCloudinary(publicId);
      }
      // Upload new logo
      const uploadResult = await uploadToCloudinary(req.files.logo[0], "logos");
      updateData["images.logo"] = uploadResult.secure_url;
    }

    // Handle cover update
    if (req.files.cover) {
      // Delete old cover if exists
      if (restaurant.images.cover) {
        const publicId = getPublicIdFromUrl(restaurant.images.cover);
        await deleteFromCloudinary(publicId);
      }
      // Upload new cover
      const uploadResult = await uploadToCloudinary(
        req.files.cover[0],
        "covers"
      );
      updateData["images.cover"] = uploadResult.secure_url;
    }

    // Handle gallery updates
    if (req.files.gallery && req.files.gallery.length > 0) {
      // Delete old gallery images if they exist
      if (restaurant.images.gallery && restaurant.images.gallery.length > 0) {
        for (const galleryUrl of restaurant.images.gallery) {
          const publicId = getPublicIdFromUrl(galleryUrl);
          await deleteFromCloudinary(publicId);
        }
      }

      // Upload new gallery images
      const galleryPromises = req.files.gallery.map((file) =>
        uploadToCloudinary(file, "gallery")
      );

      const galleryResults = await Promise.all(galleryPromises);
      updateData["images.gallery"] = galleryResults.map(
        (result) => result.secure_url
      );
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid image data provided" });
    }

    // Update the restaurant with new images
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurant._id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Restaurant images updated successfully",
      data: {
        images: updatedRestaurant?.images,
      },
    });
  } catch (error) {
    console.error("Update images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant images",
      error: error.message,
    });
  }
});

// Delete a Restaurant (Admins only)
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid restaurant ID format");
  }

  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  // Ensure only admins can delete restaurants
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized: Only admins can delete restaurants");
  }

  await restaurant.deleteOne();
  res.status(200).json({ message: "Restaurant deleted successfully" });
});

// Toggle Restaurant Active Status
exports.toggleActiveStatus = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Ensure the user updating is the owner of the restaurant or an admin
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this restaurant" });
    }

    // Toggle the isActive status
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    res.status(200).json({
      message: `Restaurant ${restaurant.isActive ? "activated" : "deactivated"
        } successfully`,
      isActive: restaurant.isActive,
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Update Restaurant Images

exports.updateImages = asyncHandler(async (req, res) => {
  try {
    const { logo, cover, gallery } = req.body;
    const restaurantId = req.params.id;
    console.log(req.body, "body");
    console.log(restaurantId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Ensure the user updating is the owner of the restaurant or an admin
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this restaurant" });
    }

    // Upload images to Cloudinary
    const updateData = {};

    if (logo) {
      const uploadedLogo = await cloudinary.uploader.upload(logo, {
        folder: "restaurants/logos",
      });
      updateData["images.logo"] = uploadedLogo.secure_url;
    }

    if (cover) {
      const uploadedCover = await cloudinary.uploader.upload(cover, {
        folder: "restaurants/covers",
      });
      updateData["images.cover"] = uploadedCover.secure_url;
    }

    if (gallery && Array.isArray(gallery)) {
      const uploadedGallery = await Promise.all(
        gallery.map(async (image) => {
          const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "restaurants/gallery",
          });
          return uploadedImage.secure_url;
        })
      );
      updateData["images.gallery"] = uploadedGallery;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No image data provided" });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Restaurant images updated successfully",
      images: updatedRestaurant.images,
    });
  } catch (error) {
    console.error("Update images error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Restaurants by City
exports.getRestaurantsByCity = asyncHandler(async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    const restaurants = await Restaurant.find({
      "address.city": { $regex: city, $options: "i" },
      isActive: true,
    });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get by city error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Featured Restaurants
exports.getFeaturedRestaurants = asyncHandler(async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const restaurants = await Restaurant.find({
      featured: true,
      isActive: true,
    })
      .sort({ "ratings.average": -1 })
      .limit(parseInt(limit));
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get featured restaurants error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Restaurant Business Hours
exports.getBusinessHours = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.id; // Fix variable name typo
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      businessHours: restaurant.businessHours,
      isCurrentlyOpen: restaurant.isOpen(),
    });
  } catch (error) {
    console.error("Get business hours error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Update Restaurant Business Hours
exports.updateBusinessHours = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { businessHours } = req.body;

    // Validate business hours format
    if (!Array.isArray(businessHours) || businessHours.length === 0) {
      return res.status(400).json({ message: "Invalid business hours format" });
    }

    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!restaurant.location?.type || restaurant.location.type !== "Point") {
      restaurant.location = {
        ...restaurant.location,
        type: "Point",
      };
    }

    // Ensure the user updating is the owner of the restaurant or an admin
    // if (restaurant.owner.toString() !== req.params.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "Unauthorized to update this restaurant" });
    // }

    // Update business hours
    restaurant.businessHours = businessHours;
    await restaurant.save();

    res.status(200).json({
      message: "Business hours updated successfully",
      businessHours: restaurant.businessHours,
    });
  } catch (error) {
    console.error("Update business hours error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
