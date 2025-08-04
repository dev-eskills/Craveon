const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const cloudinaryService = require("../utils/cloudnaryService");

/**
 * @desc    Create a new category
 * @route   POST /api/admin/category
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        status: "fail",
        message: "name and description fields are required",
      });
    }

    // Check if both logo and cover images are provided
    if (!req.files || !req.files.logo || !req.files.cover) {
      return res.status(400).json({
        status: "fail",
        message: "Both logo and cover images are required",
      });
    }

    // Initialize image data
    let imageData = {
      logo: null,
      cover: null,
    };

    // Upload logo image to Cloudinary
    const logoResult = await cloudinaryService.uploadFile(
      req.files.logo[0].path,
      "categories/logos"
    );

    imageData.logo = logoResult.secure_url;

    // Upload cover image to Cloudinary
    const coverResult = await cloudinaryService.uploadFile(
      req.files.cover[0].path,
      "categories/covers"
    );

    imageData.cover = coverResult.secure_url;

    // Create category with image URLs from Cloudinary
    const newCategory = await Category.create({
      name,
      description,
      image: {
        logo: imageData.logo,
        cover: imageData.cover,
      },
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to create category",
    });
  }
});

/**
 * @desc    Update an existing category
 * @route   PUT /api/admin/category/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updateData = {};

    // Add fields to update data if provided
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Get existing category
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    // Handle image updates
    if (req.files) {
      // Initialize image update object if not already set
      if (!updateData.image) updateData.image = { ...category.image };

      // Update logo if provided
      if (req.files.logo && req.files.logo[0]) {
        const logoResult = await cloudinaryService.uploadFile(
          req.files.logo[0].path,
          "categories/logos"
        );

        updateData.image.logo = logoResult.secure_url;

        // Optionally delete old logo from Cloudinary
        if (category.image && category.image.logo) {
          const publicId = cloudinaryService.getPublicIdFromUrl(
            category.image.logo
          );
          if (publicId) {
            await cloudinaryService.deleteFile(publicId);
          }
        }
      }

      // Update cover if provided
      if (req.files.cover && req.files.cover[0]) {
        const coverResult = await cloudinaryService.uploadFile(
          req.files.cover[0].path,
          "categories/covers"
        );

        updateData.image.cover = coverResult.secure_url;

        // Optionally delete old cover from Cloudinary
        if (category.image && category.image.cover) {
          const publicId = cloudinaryService.getPublicIdFromUrl(
            category.image.cover
          );
          if (publicId) {
            await cloudinaryService.deleteFile(publicId);
          }
        }
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        category: updatedCategory,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to update category",
    });
  }
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/admin/category/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    // Delete images from Cloudinary if they exist
    if (category.image) {
      if (category.image.logo) {
        const logoPublicId = cloudinaryService.getPublicIdFromUrl(
          category.image.logo
        );
        if (logoPublicId) {
          await cloudinaryService.deleteFile(logoPublicId);
        }
      }

      if (category.image.cover) {
        const coverPublicId = cloudinaryService.getPublicIdFromUrl(
          category.image.cover
        );
        if (coverPublicId) {
          await cloudinaryService.deleteFile(coverPublicId);
        }
      }
    }

    // Delete category from database
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to delete category",
    });
  }
});

/**
 * @desc    Get all categories
 * @route   GET /api/admin/category
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to get categories",
    });
  }
});

/**
 * @desc    Get a single category
 * @route   GET /api/admin/category/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to get category",
    });
  }
});

/**
 * @desc    Toggle category active status
 * @route   PATCH /api/admin/category/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleCategoryStatus = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    // Toggle the isActive status
    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Toggle category status error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Failed to toggle category status",
    });
  }
});
