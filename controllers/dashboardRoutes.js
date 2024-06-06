const { User, Post } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  // we try to redirect to the dashboard page based on the logged_in property
  //if we dont have any user logged in , we redirect to the login page for the user to login
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }

  try {
    const userPost = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: {
            exclude: ["user_id"],
          },
        },
      ],
    });

    if (!userPost) {
      res.status(404).json({
        message: "User not found",
      });

      return; //exit after sending the response
    }

    //getting plain javascript object from the extrated result
    const userPostObj = userPost.get({ plain: true });

    res.render("dashboard", {
      userPostObj,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
