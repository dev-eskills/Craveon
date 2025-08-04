const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../../uploads"); // Adjust path as needed
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
  fileFilter,
});

module.exports = upload;
