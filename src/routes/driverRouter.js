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


module.exports = driverRouter;
