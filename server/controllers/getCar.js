const carModel = require("../models/carModel");

const getCarById = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCarById };
