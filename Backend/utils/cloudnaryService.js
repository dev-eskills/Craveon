// utils/cloudinaryService.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the temporary file
 * @param {string} folder - Folder in Cloudinary to store the file
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
exports.uploadFile = async (filePath, folder, options = {}) => {
  try {
    const uploadOptions = {
      folder,
      use_filename: true,
      unique_filename: false,
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Remove temporary file
    await fs.promises.unlink(filePath);

    return result;
  } catch (error) {
    // Clean up the temporary file if it exists
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (unlinkError) {
      console.error("Error removing temp file:", unlinkError);
    }

    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
exports.deleteFile = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null if not a valid Cloudinary URL
 */
exports.getPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    // Extract the public ID from URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) return null;

    // Remove version number and join the remaining parts
    return urlParts
      .slice(uploadIndex + 2)
      .join("/")
      .split(".")[0];
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
