const carModel = require("../models/carModel");

// CREATE NEW VEHICLE
const createCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      category,
      fuelType,
      transmission,
      engine,
      mileage,
      seatingCapacity,
      colorOptions,
      images,
      description,
      features,
    } = req.body;

    if (
      !name ||
      !brand ||
      price === undefined ||
      !category ||
      !fuelType ||
      !transmission ||
      seatingCapacity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing." });
    }

    const car = await carModel.create({
      name,
      brand,
      price,
      category,
      fuelType,
      transmission,
      engine,
      mileage,
      seatingCapacity,
      colorOptions,
      images,
      description,
      features,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      car,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createCar };

