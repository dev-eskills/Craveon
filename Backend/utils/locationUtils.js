/**
 * Utility for location-based calculations
 */

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};

// Helper function to convert degrees to radians
const toRad = (value) => {
  return (value * Math.PI) / 180;
};

// Get estimated delivery time based on distance and other factors
const estimateDeliveryTime = (distanceInKm, trafficFactor = 1) => {
  // Average speed in km/h - can be adjusted based on time of day, area, etc.
  const avgSpeed = 15 / trafficFactor;

  // Base preparation time in minutes
  const baseTime = 5;

  // Calculate travel time in minutes
  const travelTime = (distanceInKm / avgSpeed) * 60;

  // Total estimated time in minutes
  const totalTime = Math.ceil(baseTime + travelTime);

  return totalTime;
};

module.exports = {
  calculateDistance,
  estimateDeliveryTime,
};
