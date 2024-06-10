const router = require("express").Router();
const { Comment, User, Post } = require("../../models");

const withAuth = require("../../utils/auth");

//getting all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      attributes: ["id", "comment_text", "createdAt"], // only including necessary attributes
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Post,
          attributes: ["id", "title", "content"],
        },
      ],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET comment by ID
router.get("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId, {
      attributes: ["id", "comment_text", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Post,
          attributes: ["id", "title", "content"],
        },
      ],
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (err) {
    console.error("Error fetching comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST create new comment
router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.userId, // Associate the comment with the authenticated user
      post_id: req.body.post_id, // Associate the comment with the specified post
    });

    const createdComment = await Comment.findByPk(newComment.id, {
      attributes: ["id", "comment_text", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Post,
          attributes: ["id", "title", "content"],
        },
      ],
    });

    res.status(201).json(createdComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update comment by ID
router.put("/:id", withAuth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const { comment_text } = req.body;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.comment_text = comment_text;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE comment by ID
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
