const express = require("express");
const userAuth = require("../middleware/userAuth");
const Ride = require("../model/ride");

const driverRouter = express.Router();

driverRouter.patch("/ride/:id/accept", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    if (loggedUser.role !== "driver") {
      return res.status(403).json({ message: "only driver can accept raid" });
    }
    const id = req.params.id;
    const rideAvailable = await Ride.findById(id);
    if (!rideAvailable) {
      return res.status(404).json({ message: "no ride found" });
    }
    if (rideAvailable.status !== "pending") {
      return res.status(401).json({ message: "cannot accept the ride " });
    }
    rideAvailable.status = "accepted";
    rideAvailable.driverId = loggedUser._id;
    await rideAvailable.save();
    res.status(200).json({ message: "ride accepted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
