const Settings = require("../models/setting");

// Create or update GST setting (Ensures only one document)
exports.createOrUpdateSetting = async (req, res) => {
  const { GST } = req.body;
  if (!GST) {
    return res.status(400).json({ message: "GST is required" });
  }
  try {
    const setting = await Settings.findOneAndUpdate(
      {},
      { GST },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get latest GST setting
exports.getSetting = async (req, res) => {
  try {
    const setting = await Settings.findOne();
    if (!setting) {
      return res.status(404).json({ message: "No GST setting found" });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
