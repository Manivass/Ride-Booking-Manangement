const express = require("express");
const userAuth = require("../middleware/userAuth");
const { SALEM_LOCATIONS } = require("../utils/constant");
const Ride = require("../model/ride");
const rideRouter = express.Router();

rideRouter.post("/ride/request", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const isRequestAvailable = await Ride.findOne({
      userId: loggedUser._id,
      status: "pending",
    });

    if (isRequestAvailable) {
      return res.status(209).send("exist raid is requested");
    }

    let { pickupLocation, dropLocation } = req.body;

    if (!pickupLocation) {
      return res.status(400).json({ message: "Enter the pick up location" });
    }

    if (!dropLocation) {
      return res.status(400).json({ message: "Enter the drop location" });
    }

    pickupLocation = pickupLocation.toLowerCase();

    dropLocation = dropLocation.toLowerCase();

    if (!SALEM_LOCATIONS.includes(pickupLocation)) {
      return res
        .status(400)
        .json({ message: "pickupLocation location is not found" });
    }

    if (!SALEM_LOCATIONS.includes(dropLocation)) {
      return res
        .status(400)
        .json({ message: "drop location location is not found" });
    }

    if (pickupLocation === dropLocation) {
      return res.status(400).json({
        message: "pick up location and drop location must be different",
      });
    }

    const newRide = new Ride({
      userId: loggedUser._id,
      pickupLocation,
      dropLocation,
    });
    await newRide.save();
    res.status(201).json({ message: "your ride is in pending" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

rideRouter.get("/ride/mytrips", userAuth, async (req, res) => {
  try {
    const loggeduser = req.user;
    const rides = await Ride.find({
      userId: loggeduser._id,
      status: { $in: ["accepted", "rejected", "pending"] },
    }).sort({ createdAt: -1 });
    if (rides.length === 0) {
      return res.status(200).json({ message: "no rides found" });
    }
    res.status(200).json({ data: rides });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

rideRouter.patch("/ride/:id/cancel", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const id = req.params.id;
    const isIdAvailable = await Ride.findOne({
      _id: id,
      status: "pending",
    });
    if (!isIdAvailable) {
      return res.status(404).json({ message: "not found" });
    }
    if (loggedUser._id.toString() !== isIdAvailable.userId.toString()) {
      return res.status(403).json({ message: "this is not your ride" });
    }
    isIdAvailable.status = "cancelled";
    await isIdAvailable.save();
    res.status(201).json({ message: "cancelled successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = rideRouter;
