const jwt = require("jsonwebtoken");
const User = require("../model/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).send({ message: "please login!!" });
    }
    const decoded = jwt.verify(token, "RIDEBOOKING@123");
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = userAuth;
