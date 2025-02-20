const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");

const getAllPostsFromCurrentUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const posts = await UserModel.findOne({ _id: userId }).populate(
      "usersPosts"
    );
    res.status(200).json(posts.usersPosts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllPostsFromFollowings = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await UserModel.findOne({ _id: userId }).populate(
      "followings"
    );
    const followings = user.followings;
    let postsFromFollowings = [];
    for (const following of followings) {
      const followingWithPosts = await UserModel.findOne({
        _id: following._id,
      }).populate("usersPosts");
      postsFromFollowings = postsFromFollowings.concat(
        followingWithPosts.usersPosts
      );
    }
    res.status(200).json(postsFromFollowings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  const postedBy = req.user._id;

  if (!postedBy) {
    return res.status(401).json({ error: "User must be logged in to post" });
  }

  const { title, body } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!body) emptyFields.push("body");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: `All fields must be filled ${emptyFields}` });
  }

  try {
    const currentUser = await UserModel.findOne({ _id: postedBy });

    if (!currentUser) {
      throw Error("User does not exist");
    }

    const post = await PostModel.create({ title, body, postedBy });

    await UserModel.findByIdAndUpdate(
      postedBy,
      { $push: { usersPosts: post._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ message: "Post created successfully", post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  const currentUserId = req.user._id;
  const postId = req.params.id;

  try {
    const postToDelete = await PostModel.findOne({ _id: postId });

    if (!postToDelete) {
      return res.status(404).json({ error: "No such post exists" });
    }

    if (postToDelete.postedBy.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts!" });
    }

    await PostModel.deleteOne({ _id: postId });

    await UserModel.findByIdAndUpdate(
      currentUserId,
      { $pull: { usersPosts: postId } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ message: "Post deleted successfully" });
    await PostModel.deleteOne({ _id: postId._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  const postId = req.params.id;

  const userId = req.user._id;

  try {
    const postToLike = await PostModel.findOne({ _id: postId });

    if (!postToLike) {
      throw Error("This post does not exist");
    }

    if (!postToLike.likes.includes(userId)) {
      await PostModel.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true, useFindAndModify: false }
      );
    } else {
      return res.status(400).json({ message: "You already liked this post" });
    }
    res.status(200).json({ message: "Post successfully liked" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const dislikePost = async (req, res) => {
  const postId = req.params.id;

  const userId = req.user._id;

  try {
    const postToLike = await PostModel.findOne({ _id: postId });

    if (!postToLike) {
      throw Error("This post does not exist");
    }

    if (postToLike.likes.includes(userId)) {
      await PostModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true, useFindAndModify: false }
      );
    } else {
      return res
        .status(400)
        .json({ message: "You already disliked this post" });
    }
    res.status(200).json({ message: "Post successfully disliked" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCommentsFromPost = async (req, res) => {
  try {
    const postId = req.params.post_id;

    const comments = await CommentModel.find({ onPost: postId })
      .populate("commentBy", "name username")
      .sort({ createdAt: -1 });

    if (!comments) {
      return res.status(404).json({ message: "Comments not found" });
    }
    console.log(comments);

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllPostsFromCurrentUser,
  createPost,
  deletePost,
  likePost,
  dislikePost,
  getAllPostsFromFollowings,
  getCommentsFromPost,
  getPost,
};
