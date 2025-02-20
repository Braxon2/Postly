const express = require("express");

const {
  getFollowers,
  signup,
  login,
  followUser,
  unfollowUser,
  getUser,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/:username", requireAuth, getUser);
router.post("/follow/:username", requireAuth, followUser);
router.post("/unfollow/:username", requireAuth, unfollowUser);
router.get("/followers", requireAuth, getFollowers);

module.exports = router;
