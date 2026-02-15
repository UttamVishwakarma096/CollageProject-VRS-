const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  savedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: "car" }],
});

module.exports = mongoose.model("User", userSchema);
