// Helper function to upload image to Cloudinary
const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (imageString) => {
  try {
    if (!imageString) return null;

    // If the image is already a URL and from Cloudinary, return it as is
    if (imageString.startsWith("https://res.cloudinary.com/")) {
      return imageString;
    }

    // Upload the base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      folder: "categories",
      resource_type: "auto",
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};
