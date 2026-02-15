const userModel = require("../models/userModel");

const getSavedCars = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("savedCars")
      .lean();
    const savedCars = user?.savedCars?.filter(Boolean) || [];
    res.json(savedCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const savedCar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedCars.includes(carId)) {
      user.savedCars.push(carId);
      await user.save();
    }

    res.json({ message: "Car saved successfully", savedCars: user.savedCars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSavedCar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedCars = user.savedCars.filter(
      (id) => id.toString() !== carId
    );
    await user.save();

    res.json({ message: "Car removed from saved", savedCars: user.savedCars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSavedCars, savedCar, removeSavedCar };
