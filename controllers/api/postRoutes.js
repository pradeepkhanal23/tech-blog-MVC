const router = require("express").Router();
const { Comment, User, Post } = require("../../models");

const withAuth = require("../../utils/auth");

//GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title", "content", "createdAt"], // only including necessary attributes
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET post by ID
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", withAuth, async (req, res) => {
  try {
    // Create a new post and associate it with the authenticated user
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.userId, // Associate the post with the authenticated user
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update post by ID
router.put("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.title = title;
    post.content = content;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE post by ID
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
