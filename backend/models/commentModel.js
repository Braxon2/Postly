const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    onPost: { type: ObjectId, ref: "Post", required: true },
    commentBy: { type: ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
