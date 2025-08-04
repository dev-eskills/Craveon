const Product = require("../models/Products");
const Restaurant = require("../models/Restaurants");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const cloudinaryService = require("../utils/cloudnaryService");
const { TaskRouterGrant } = require("twilio/lib/jwt/AccessToken");

exports.createProduct = async (req, res) => {
  try {
    // ✅ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurantId = req.body.restaurant?.trim();
    // ✅ Check if restaurant exists
    const restaurant = await User.findById(restaurantId);
    const restro = await Restaurant.findOne({ owner: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    // Verify ownership - assuming req.user.id contains the logged-in user's ID
    if (restaurant._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You don't have permission to add products to this restaurant",
      });
    }

    // ✅ Handle Image Upload
    let imageUrl =
      req.body.image ||
      "https://img.freepik.com/premium-psd/hamburger-with-lot-ingredients-it_1092965-1591.jpg?semt=ais_hybrid";

    if (req.file) {
      const imageResult = await cloudinaryService.uploadFile(
        req.file.path,
        "products/images"
      );
      imageUrl = imageResult.secure_url;
    }

    const parseJSONField = (field) => {
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch (error) {
        return []; // Default to an empty array if parsing fails
      }
    };

    // ✅ Prepare Product Data
    const productData = {
      ...req.body, // Spread all incoming body data
      taxRate: restro.commissionRate, // Add commission
      restaurant: new mongoose.Types.ObjectId(restaurant._id),
      image: imageUrl,
      attributes: parseJSONField(req.body.attributes),
      addons: parseJSONField(req.body.addons),
    };

    // ✅ Filter only schema keys to avoid adding unknown fields
    const validKeys = Object.keys(Product.schema.paths);
    const filteredData = Object.keys(productData)
      .filter((key) => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = productData[key];
        return obj;
      }, {});

    // ✅ Create and Save the Product
    const newProduct = new Product(filteredData);
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

exports.getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check if restaurant exists
    const restaurant = await User.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Get products by restaurant ID
    const products = await Product.find({ restaurant: restaurantId }).populate(
      "category",
      "name"
    );
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// exports.getProductsByUserRestaurant = async (req, res) => {
//   try {
//     const { restaurantId } = req.params;
//     const { catId } = req.query;

//     // Check if restaurant exists
//     const restaurant = await Restaurant.findOne({ owner: restaurantId }).select(
//       "address _id name description owner tags ratings"
//     );

//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     // Build the product filter
//     const filter = { restaurant: restaurantId };
//     if (catId) {
//       filter.category = catId;
//     }

//     // Fetch products and populate category
//     const products = await Product.find(filter).populate("category", "name");

//     // Filter out products with null categories
//     const validProducts = products.filter(
//       (product) => product.category !== null
//     );

//     // Extract unique categories that have products
//     const categoriesWithProducts = [
//       ...new Map(
//         validProducts.map((product) => [
//           product.category._id.toString(),
//           product.category,
//         ])
//       ).values(),
//     ];

//     res.status(200).json({
//       success: true,
//       count: validProducts.length,
//       data: {
//         restaurant,
//         products: validProducts,
//         categories: categoriesWithProducts, // Only categories that have products
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch products",
//       error: error.message,
//     });
//   }
// };

exports.getProductsByUserRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { catId } = req.query;

    // Check if restaurant exists
    const restaurant = await Restaurant.findOne({ owner: restaurantId }).select(
      "address _id name description owner tags images"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch all products for the restaurant
    const allProducts = await Product.find({
      restaurant: restaurantId,
      isAvailable: true,
    }).populate("category", "name");

    // Filter out products with null categories
    const validProducts = allProducts.filter(
      (product) => product.category !== null
    );

    // Extract unique categories that have products (always keep all categories)
    const categoriesWithProducts = [
      ...new Map(
        validProducts.map((product) => [
          product.category._id.toString(),
          product.category,
        ])
      ).values(),
    ];

    // Apply filtering based on catId (optional)
    const filteredProducts = catId
      ? validProducts.filter(
        (product) => product.category._id.toString() === catId
      )
      : validProducts;

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: {
        restaurant,
        products: filteredProducts, // Filtered products
        categories: categoriesWithProducts, // Always return all categories
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { price_range } = req.query;

    if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing category ID",
      });
    }

    // Get category details
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Get products by category ID
    const products = await Product.find({
      category: categoryId,
      isAvailable: true,
    });

    // Extract unique restaurant IDs from products
    const ownerIds = products
      .map((product) => product.restaurant?.toString())
      .filter((id) => id); // Remove undefined/null values

    // Fetch corresponding restaurant details
    const restaurants = await User.find(
      { _id: { $in: ownerIds } },
      "_id name addresses" // Only fetch _id and name
    );

    // Convert restaurant array into a lookup object
    const restaurantMap = {};
    restaurants.forEach((restaurant) => {
      restaurantMap[restaurant._id.toString()] = restaurant;
    });

    // Attach restaurant details to each product
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      restaurant: restaurantMap[product.restaurant?.toString()] || null, // Attach restaurant details
    }));

    res.status(200).json({
      success: true,
      data: {
        category,
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Check ownership
    if (product.restaurant.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this product" });
    }

    const parseJSONField = (field) => {
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch (error) {
        return []; // Default to an empty array if parsing fails
      }
    };

    // ✅ Prepare update data
    const updateData = {
      ...req.body,
      attributes: parseJSONField(req.body.attributes),
      addons: parseJSONField(req.body.addons),
      tags: parseJSONField(req.body.tags),
    };

    // ✅ Handle image upload
    if (req.file) {
      // Upload new image to Cloudinary
      const imageResult = await cloudinaryService.uploadFile(
        req.file.path,
        "products/images"
      );

      // Delete the old image if exists
      if (product.image && product.image.includes("cloudinary.com")) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinaryService.deleteFile(`products/images/${publicId}`);
      }

      // Add new image to update data
      updateData.image = imageResult.secure_url;
    }

    // ✅ Filter only valid schema keys
    const validKeys = Object.keys(Product.schema.paths);
    const filteredData = Object.keys(updateData)
      .filter((key) => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    // ✅ Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product and get its associated restaurant
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found for this product" });
    }

    // Check ownership
    if (product.restaurant._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this product" });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "restaurant",
      "name address ratings businessHours isOrderingEnabled"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};



exports.toggleProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product to check ownership
    const product = await Product.findById(id).select("restaurant isAvailable");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.restaurant.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this product" });
    }

    // Toggle availability directly using findByIdAndUpdate (this skips pre-save middleware)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { isAvailable: !product.isAvailable } },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isAvailable ? "enabled" : "disabled"
        } successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error toggling product availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle product availability",
      error: error.message,
    });
  }
};

