const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = adminProtect;
