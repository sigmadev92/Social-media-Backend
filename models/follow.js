const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who is following
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user being followed
      required: true,
    },
  },
  { timestamps: true }
);

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
