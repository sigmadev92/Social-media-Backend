const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the post
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Reference to another comment (if it's a reply)
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who commented
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the comment
      },
    ],
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
