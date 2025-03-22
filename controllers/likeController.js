const Likes = require("../models/like.js");
const Post = require("../models/post.js");

const performLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id; // Assuming `authMiddleware` adds `user` to `req`
    console.log("user liking a post :", postId);
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.send({ status: false, message: "Post not found" });
    }

    // Check if the user already liked the post
    const existingLike = await Likes.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.send({ status: false, message: "Post already liked" });
    }

    // Create a new like
    const like = new Likes({ post: postId, user: userId });
    await like.save();

    res.send({ status: true, message: "Post liked successfully", like });
  } catch (error) {
    res.send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const removeLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id; // Assuming `authMiddleware` adds `user` to `req`
    console.log("user unliking a post :", postId);
    // Check if the like exists
    const like = await Likes.findOne({ post: postId, user: userId });
    if (!like) {
      return res.send({ status: false, message: "Like not found" });
    }

    // Remove the like
    await Likes.findByIdAndDelete(like._id);

    res.send({ status: true, message: "Post unliked successfully" });
  } catch (error) {
    res.send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = { performLike, removeLike };
