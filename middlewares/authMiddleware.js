const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token
  console.log(new Date().toLocaleString());
  console.log("Arrived on Authentication Route . Token is \n", token);

  if (!token) {
    return res.send({ status: false, message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password"); // Exclude password
    console.log("profile found");
    next();
  } catch (error) {
    console.log("Invalid Token | So going back");
    res.send({ status: false, message: "Invalid token" });
  }
};

module.exports = authenticateToken;
