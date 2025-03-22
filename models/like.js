const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the liked post
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who liked the post
      required: true,
    },
  },
  { timestamps: true }
);

const Likes = mongoose.model("Like", likeSchema);
module.exports = Likes;
