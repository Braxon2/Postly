const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    postedBy: { type: ObjectId, ref: "User", required: true },
    likes: [{ type: ObjectId, ref: "User" }],
    commentsOnPost: [{ type: ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
