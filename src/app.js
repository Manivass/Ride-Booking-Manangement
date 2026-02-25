const express = require("express");
const connectionDB = require("./config/database");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const rideRouter = require("./routes/rideRouter");
const driverRouter = require("./routes/driverRouter");
const app = express();
app.use("/", cookieParser());
app.use("/", express.json());
app.use("/", userRouter);
app.use("/", rideRouter);
app.use("/", driverRouter);

connectionDB()
  .then(() => {
    console.log("db successfully connected");
    app.listen(7777, () => {
      console.log("server successfully connected");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
