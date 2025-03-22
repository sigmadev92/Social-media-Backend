const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/user.js");
const Post = require("../models/post.js");
const Like = require("../models/like.js");
const Comment = require("../models/user.js");

dotenv.config(); // Load environment variables

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Sample Users
const users = [
  {
    email: "john@example.com",
    password: "hashedpassword123",
    EmailVerified: true,
  },
  {
    email: "jane@example.com",
    password: "hashedpassword456",
    EmailVerified: false,
  },
  {
    email: "alice@example.com",
    password: "hashedpassword789",
    EmailVerified: true,
  },
];

// Sample Posts
const posts = [
  {
    user: null,
    content: "Hello world! My first post.",
    image: "",
    linkURL: "",
    likes: [],
    comments: [],
  },
  {
    user: null,
    content: "Enjoying this new platform!",
    image: "https://example.com/image.jpg",
    linkURL: "https://example.com",
    likes: [],
    comments: [],
  },
];

// Sample Comments
const comments = [
  { post: null, user: null, text: "Nice post!" },
  { post: null, user: null, text: "I totally agree!" },
];

// Sample Likes
const likes = [
  { post: null, user: null },
  { post: null, user: null },
];

const seedDB = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Like.deleteMany();
    await Comment.deleteMany();

    const createdUsers = await User.insertMany(users);
    console.log("Users created!");
    // Assign users to posts
    posts[0].user = createdUsers[0]._id;
    posts[1].user = createdUsers[1]._id;
    const createdPosts = await Post.insertMany(posts);
    console.log("Posts created!");
    // Assign posts and users to comments
    comments[0].post = createdPosts[0]._id;
    comments[0].user = createdUsers[1]._id;
    comments[1].post = createdPosts[1]._id;
    comments[1].user = createdUsers[2]._id;
    console.log("Comments created 123!");
    console.log(comments);
    const createdComments = await Comment.insertMany(comments);
    console.log("Comments created!");

    // Embed comments in posts
    await Post.findByIdAndUpdate(createdPosts[0]._id, {
      $push: { comments: createdComments[0] },
    });
    await Post.findByIdAndUpdate(createdPosts[1]._id, {
      $push: { comments: createdComments[1] },
    });

    // Assign posts and users to likes
    likes[0].post = createdPosts[0]._id;
    likes[0].user = createdUsers[2]._id;
    likes[1].post = createdPosts[1]._id;
    likes[1].user = createdUsers[0]._id;
    await Like.insertMany(likes);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDB();
