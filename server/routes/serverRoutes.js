const express = require("express");
const router = express.Router();

const { getAllVehicles } = require("../controllers/allVehicles");
const { getCarById } = require("../controllers/getCar");
const { getSavedCars, savedCar, removeSavedCar } = require("../controllers/savedCars");
const { login, signup, protect } = require("../middlewares/authMiddelware");

router.post("/login", login);
router.post("/signup", signup);

router.get("/cars", getAllVehicles);
router.get("/car/:id", getCarById);

router.get("/saved_car", protect, getSavedCars);
router.post("/saved_car", protect, savedCar);
router.delete("/saved_car", protect, removeSavedCar);

module.exports = router;
