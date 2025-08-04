const expressAsyncHandler = require("express-async-handler");
const Banner = require("../../models/Admin/BannerModel"); // Fixed import
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (Ensure .env variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Create a new banner
// @route   POST /api/admin/banner
// @access  Private
const createBanner = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
      use_filename: true,
      unique_filename: false,
    });

    // Save Cloudinary URL & public_id in DB
    const banner = new Banner({
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id, // Store Cloudinary image ID
    });
    await banner.save();

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get all banners
// @route   GET /api/admin/banner
// @access  Public
const getAllBanners = expressAsyncHandler(async (req, res) => {
  const banners = await Banner.find({});
  res.status(200).json(banners);
});

// @desc    Get a single banner by ID
// @route   GET /api/admin/banner/:id
// @access  Public
const getBannerById = expressAsyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ error: "Banner not found" });
  }
  res.status(200).json(banner);
});

// @desc    Update a banner
// @route   PUT /api/admin/banner/:id
// @access  Private
const updateBanner = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);

  if (!banner) {
    return res.status(404).json({ error: "Banner not found" });
  }

  let updatedData = {};

  // Handle image update
  if (req.file) {
    // Delete old image from Cloudinary
    if (banner.cloudinaryId) {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
      use_filename: true,
      unique_filename: false,
    });

    updatedData.imageUrl = result.secure_url;
    updatedData.cloudinaryId = result.public_id;
  }

  // Update banner details
  const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  res
    .status(200)
    .json({ message: "Banner updated successfully", updatedBanner });
});

// @desc    Delete a banner
// @route   DELETE /api/admin/banner/:id
// @access  Private
const deleteBanner = expressAsyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ error: "Banner not found" });
  }

  // Delete image from Cloudinary
  if (banner.cloudinaryId) {
    await cloudinary.uploader.destroy(banner.cloudinaryId);
  }

  // Delete banner from DB
  await banner.deleteOne();
  res.status(200).json({ message: "Banner deleted successfully" });
});

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
