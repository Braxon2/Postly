const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

const getUser = async (req, res) => {
  const usernameFromURL = req.params.username;

  try {
    const user = await UserModel.findOne({ username: usernameFromURL });
    if (!user) {
      return res
        .status(404)
        .json({ error: `There is no user with ${usernameFromURL} username` });
    }

    const { username, name, email, followings, followers, createdAt } = user;
    res
      .status(200)
      .json({ username, name, email, followings, followers, createdAt });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong with the server..." });
  }
};
const getFollowers = async (req, res) => {
  const currentUser = await UserModel.findOne({ _id: req.user._id }).populate(
    "followers"
  );

  res.status(200).json({ followers: currentUser.followers });
};

const followUser = async (req, res) => {
  const currentUserId = req.user._id;
  const userToFollowUsername = req.params.username;

  try {
    const userToFollow = await UserModel.findOne({
      username: userToFollowUsername,
    });

    if (!userToFollow) {
      throw Error("User does not exist");
    }

    if (currentUserId.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const currentUser = await UserModel.findById(currentUserId);
    const isAlreadyFollowing = currentUser.followings.includes(
      userToFollow._id
    );

    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    await UserModel.findByIdAndUpdate(
      currentUserId,
      { $push: { followings: userToFollow._id } },
      { new: true, useFindAndModify: false }
    );

    await UserModel.findOneAndUpdate(
      userToFollow._id,
      { $push: { followers: currentUserId } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const unfollowUser = async (req, res) => {
  const userToUnfollowUsername = req.params.username;

  const currentUserId = req.user._id;

  try {
    const userToUnfollow = await UserModel.findOne({
      username: userToUnfollowUsername,
    });

    if (!userToUnfollow) {
      return res.status(404).json({ error: "This user does not exist" });
    }

    if (currentUserId.toString() === userToUnfollow._id.toString()) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    await UserModel.findOneAndUpdate(
      userToUnfollow._id,
      { $pull: { followers: currentUserId } },
      { new: true, useFindAndModify: false }
    );

    await UserModel.findOneAndUpdate(
      currentUserId,
      { $pull: { followings: userToUnfollow._id } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({ message: "User successfully unfollowed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  const { email, username, name, password } = req.body;

  let emptyFields = [];

  if (!email) emptyFields.push("email");
  if (!username) emptyFields.push("username");
  if (!name) emptyFields.push("name");
  if (!password) emptyFields.push("password");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: `All fields must be filled ${emptyFields}` });
  }
  console.log(email, username, name, password);

  try {
    const user = await UserModel.signup(email, username, name, password);

    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  let emptyFields = [];

  if (!username) emptyFields.push("username");
  if (!password) emptyFields.push("password");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: `All fields must be filled ${emptyFields}` });
  }

  try {
    const user = await UserModel.login(username, password);
    const token = createToken(user._id);
    res.status(200).json({ username, name: user.name, _id: user._id, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getFollowers,
  signup,
  login,
  followUser,
  unfollowUser,
  getUser,
};
