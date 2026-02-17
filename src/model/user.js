const mongoose = require("mongoose");
const { isStrongPassword, isLowercase } = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 4,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 1,
    },
    email: {
      type: String,
      validate: function (value) {
        if (!isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      validate: function (value) {
        if (!isStrongPassword(value)) {
          throw new Error("password is not strong");
        }
      },
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["user", "worker"],
        message: `{VALUE} is not valid role`,
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
