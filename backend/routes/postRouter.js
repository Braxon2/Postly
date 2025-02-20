const express = require("express");

const {
  getAllPostsFromCurrentUser,
  createPost,
  deletePost,
  likePost,
  dislikePost,
  getAllPostsFromFollowings,
  getPost,
  getCommentsFromPost,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/followings", getAllPostsFromFollowings);
router.get("/:id", getPost);
router.get("/:post_id/comments", getCommentsFromPost);
router.get("/", getAllPostsFromCurrentUser);
router.post("/create", createPost);
router.delete("/:id", deletePost);
router.post("/like/:id", likePost);
router.post("/dislike/:id", dislikePost);

module.exports = router;
