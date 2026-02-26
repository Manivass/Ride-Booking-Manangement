const express = require("express");
const userAuth = require("../middleware/userAuth");
const Ride = require("../model/ride");

const driverRouter = express.Router();

driverRouter.patch("/ride/:id/accept", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    if (loggedUser.role !== "driver") {
      return res.status(403).json({ message: "only driver can accept ride" });
    }
    const id = req.params.id;
    const rideAvailable = await Ride.findOneAndUpdate(
      {
        _id: id,
        status: "pending",
      },
      {
        status: "accepted",
        driverId: loggedUser._id,
      },
      {
        new: true,
      },
    );
    if (!rideAvailable) {
      return res
        .status(404)
        .json({ message: "ride not available or already accepted" });
    }
    res
      .status(200)
      .json({ message: "ride accepted successfully", data: rideAvailable });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

driverRouter.patch("/ride/:id/start", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const id = req.params.id;
    const isRideAvailable = await Ride.findById(id);
    if (loggedUser.role !== "driver") {
      return res
        .status(409)
        .json({ message: "only driver can start the ride" });
    }
    if (!isRideAvailable) {
      return res.status(404).json({ message: "ride not found" });
    }
    if (!isRideAvailable.driverId.equals(loggedUser._id)) {
      return res
        .status(409)
        .json({ message: "only accepted driver can start the ride" });
    }
    if (isRideAvailable.status !== "accepted") {
      return res.status(403).json({ message: "ride is not accepted" });
    }
    isRideAvailable.status = "started";
    await isRideAvailable.save();
    res.status(200).json({ message: "ride started successfully" });
  } catch (err) {
    res.status(400).json({ messsage: err.message });
  }
});

driverRouter.patch("/ride/:id/complete", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const id = req.params.id;
    const isRideAvailable = await Ride.findById(id);
    if (!isRideAvailable) {
      return res.status(404).json({ message: "ride not found" });
    }
    if (!loggedUser._id.equals(isRideAvailable.driverId)) {
      return res
        .status(409)
        .json({ message: "only accepted driver can complete the ride" });
    }

    if (isRideAvailable.status != "started") {
      return res
        .status(409)
        .json({ message: "Ride must be accepted before completed" });
    }

    isRideAvailable.status = "completed";
    await isRideAvailable.save();
    res.status(200).json({ message: "ride completed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = driverRouter;
