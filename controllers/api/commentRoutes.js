const router = require("express").Router();
const Comment = require("../../models/Comment");

//getting all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new comment
// router.post("/:postId", withAuth, async (req, res) => {
//   try {
//     const { comment_text } = req.body;
//     const postId = req.params.postId;

//     // Create a new comment associated with the authenticated user and the specified post
//     const newComment = await Comment.create({
//       comment_text: comment_text,
//       user_id: req.session.userId, // Associate the comment with the authenticated user
//       post_id: postId, // Associate the comment with the specified post
//     });

//     res.status(201).json(newComment);
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

module.exports = router;
