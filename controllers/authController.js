const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../middlewares/mailer.js");
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    console.log("here");
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.send({ status: false, message: "User already exists!" });
    // Hash password before saving
    console.log("THank god email was not before saved");
    const salt = await bcrypt.genSalt(10); // Generate salt
    console.log("I guess here is the error");
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password

    // Create new user (but set verified as false)
    const newUser = new User({
      email,
      password: hashedPassword,
      EmailEerified: false,
    });
    await newUser.save();
    console.log("new user created with hashed password");
    // Generate email verification token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return res.send({
      status: true,
      message: "Signup successful! Please check your email for verification.",
    });
  } catch (error) {
    console.log("Internal server error", error);
    return res.send({ status: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  console.log("Arrived HERE - Login controller");
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ status: false, message: "Invalid email or password" });
    }
    console.log("Email ID matched successfully");
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ status: false, message: "Invalid email or password" });
    }
    console.log("Password matched successfully");
    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.send({ status: true, token: token, userData: user });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: "Internal Server error" });
  }
};
const verifyUser = async (req, res) => {
  console.log("Arrived at USER VERIFICATION");
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.send({ status: false, message: "Invalid token" });

    user.EmailVerified = true;
    await user.save();
    return res.send({
      status: true,
    });
  } catch (error) {
    console.log("Failed user verification");
    return res.send({
      status: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { signup, login, verifyUser };
