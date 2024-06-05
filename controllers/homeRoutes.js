const { Post, User } = require("../models");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const posts = postData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  res.render("login");
});

module.exports = router;
