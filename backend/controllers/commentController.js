const commentModel = require("../models/commentModel");
const CommentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const createComment = async (req, res) => {
  const post_id = req.params.id;
  const { body } = req.body;
  const user_id = req.user._id;

  try {
    if (!body || body.trim() === "") {
      return res.status(400).json({ message: "Comment body cannot be empty" });
    }

    const post = await postModel.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "No such post exist" });
    }

    const user = await userModel.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({ message: "No such user exist" });
    }

    const comment = await commentModel.create({
      body,
      onPost: post_id,
      commentBy: user_id,
    });

    await postModel.findByIdAndUpdate(
      post_id,
      { $push: { commentsOnPost: comment._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ message: "Succesfully commented on post", comment });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const comment_id = req.params.id;
  const user_id = req.user._id;

  try {
    const comment = await CommentModel.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "No such comment exist" });
    }

    const user = await userModel.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({ message: "No such user exist" });
    }

    await CommentModel.findByIdAndDelete(comment_id);

    await postModel.findByIdAndUpdate(
      comment.onPost,
      { $pull: { commentsOnPost: comment._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ message: "Succesfully deleted commented on post" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { createComment, deleteComment };
