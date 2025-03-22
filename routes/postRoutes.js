const {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
  createPostsInBulk,
} = require("../controllers/postController.js");

const express = require("express");
const Post = require("../models/post.js");
const protect = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Post API!");
  console.log("first route");
});
// 📝 Create a new post
router.post("/create", protect, createPost);

// 📌 Get all posts
router.get("/posts", protect, getAllPosts);

// 🔍 Get a single post by ID
router.get("/:id", getSinglePost);

// ✏️ Update a post
router.put("/:id", protect, updatePost);

// ❌ Delete a post
router.delete("/:id", protect, deletePost);

router.post("/create-posts-in-bulk", protect, createPostsInBulk);

module.exports = router;
