const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["SUV", "Sedan", "Hatchback", "MUV", "Coupe", "Convertible"],
      required: true,
      index: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      required: true,
      index: true,
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },

    engine: {
      type: String,
    },

    mileage: {
      type: Number,
    },

    seatingCapacity: {
      type: Number,
      required: true,
      index: true,
    },

    colorOptions: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String, // image URLs
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String, // ABS, Airbags, Sunroof, etc.
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("car", carSchema);
