const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true,
  },
  dropLocation: {
    type: String,
    required: true,
    trim: true,
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
