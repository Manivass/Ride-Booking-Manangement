const mongoose = require("mongoose");
const { SALEM_LOCATIONS, STATUS_VALUES } = require("../utils/constant");

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: {
        values: SALEM_LOCATIONS,
        message: `{VALUE} is not valid location`,
      },
    },
    dropLocation: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: {
        values: SALEM_LOCATIONS,
        message: `{VALUE} is not valid location`,
      },
    },
    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: `{VALUE} is not valid status`,
      },
      default: "pending",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

const Ride = new mongoose.model("Ride", rideSchema);

module.exports = Ride;
