const carModel = require("../models/carModel");

// GET ALL VEHICLES
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await carModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllVehicles };
