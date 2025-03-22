const express = require("express");
const router = express.Router();
const Likes = require("../models/like");
const Post = require("../models/post"); // Assuming you have a Post model
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware to authenticate user
const { removeLike, performLike } = require("../controllers/likeController.js");

// API to like a post
router.post("/", authMiddleware, performLike);

// API to unlike a post
router.post("/unlike", authMiddleware, removeLike);

module.exports = router;
