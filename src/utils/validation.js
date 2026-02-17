const validate = require("validator");
const validateAndSanitizeSignUp = (req) => {
  const { firstName, lastName, emailId, password, role } = req;
  if (!firstName || !emailId || !password) {
    throw new Error("pls fill all the credentials");
  }
  if (firstName.length < 4) {
    throw new Error("firstName must greater than 4 characters");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("pls enter valid email ");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error(
      "password must have seven characters, 1 Uppercase , 1 Symbol",
    );
  } else if (!["user", "worker"].includes(role)) {
    throw new Error("invalid role . Please enter the valid role");
  }
};

module.exports = validateAndSanitizeSignUp;
