const Post = require("../models/post.js");
const Likes = require("../models/like.js");
const createPost = async (req, res) => {
  console.log("user creating a post");
  try {
    const { content, image } = req.body;
    const post = new Post({ user: req.user.id, content, image });

    await post.save();
    //now we have to add some more details to our newly added post.
    await Post.populate(post, { path: "user", select: "email" });
    res.send({
      status: true,
      newPost: post,
    });
  } catch (error) {
    console.log("ERROR IN Create POST route", error);
    res.send({ status: false, message: "Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    //for every corrsponding posts, we need to populate the like details.
    const postWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Likes.countDocuments({
          post: post._id,
        });
        const currentUserLiked = await Likes.exists({
          post: post._id,
          user: req.user.id,
        });
        return { ...post._doc, likesCount, currentUserLiked };
      })
    );
    res
      .status(200)
      .json({
        postWithLikes,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the logged-in user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the logged-in user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Bulk insert posts
const createPostsInBulk = async (req, res) => {
  try {
    const posts = req.body; // Expecting an array of posts
    console.log(posts[0]);
    const updatedPosts = posts.map((post) => {
      return { ...post, user: req.user.id };
    });
    console.log(updatedPosts[0]);
    if (!Array.isArray(posts) || posts.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input. Expected an array of posts." });
    }

    const newPosts = await Post.insertMany(updatedPosts);
    res
      .status(201)
      .json({ message: "Posts added successfully", data: newPosts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding posts", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  createPostsInBulk,
};
