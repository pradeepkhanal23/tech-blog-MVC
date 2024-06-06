const { Post, User } = require("../models");
const router = require("express").Router();

//Homepage route
router.get("/", async (req, res) => {
  // when the user comes to the homepage, we show them all the blog posts by getting all the data fom the database
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

    // we call the get() method to serialize or make the objects plain in order to pass it as an computable object to the handlerbars within the render method
    const posts = postData.map((project) => project.get({ plain: true }));

    // homepage handlerbar will be rendered  along with all the posts data that we have in the database
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
