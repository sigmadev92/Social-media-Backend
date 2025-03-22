const express = require("express");
const {
  signup,
  login,
  verifyUser,
} = require("../controllers/authController.js");
const authenticateToken = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Signup Route
router.get("/", async (req, res) => {
  res.send("<p>This is the index route for ./api/auth</p>");
});
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticateToken, (req, res) => {
  res.send({ status: true, user: req.user });
});
router.get("/verify/:token", verifyUser);

module.exports = router;
