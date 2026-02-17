const express = require("express");
const connectionDB = require("./config/database");
const userRouter = require("./routes/userRouter");

const app = express();

app.use("/", express.json());
app.use("/", userRouter);

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
