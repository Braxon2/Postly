const express = require("express");

const {
  getAllPostsFromCurrentUser,
  createPost,
  deletePost,
  likePost,
  dislikePost,
  getAllPostsFromFollowings,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllPostsFromCurrentUser);
router.get("/followings", getAllPostsFromFollowings);
router.post("/create", createPost);
router.delete("/:id", deletePost);
router.post("/like/:id", likePost);
router.post("/dislike/:id", dislikePost);

module.exports = router;
