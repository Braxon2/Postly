const express = require("express");

const {
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/on-post/:id", requireAuth, createComment);
router.delete("/delete/:id", requireAuth, deleteComment);

module.exports = router;
