const mongoose = require("mongoose");
const { SALEM_LOCATIONS } = require("../utils/constant");

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    enum: {
      values: SALEM_LOCATIONS,
      message: `{VALUE} is not valid location`,
    },
  },
  dropLocation: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    enum: {
      values: SALEM_LOCATIONS,
      message: `{VALUE} is not valid location`,
    },
  },
  status: {
    type: String,
    enum: {
      values: ["requested", "rejected", "pending"],
      message: `{VALUE} is not valid status`,
    },
  },
});

const Ride = new mongoose.model("Ride", rideSchema);

module.exports = Ride;
