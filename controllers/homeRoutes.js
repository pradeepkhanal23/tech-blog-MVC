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
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login Route

// when the user request for login page, we either show them the login page if the user is not logged in OR we show them the dashboard if the user is logged in
router.get("/login", async (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
  }

  res.render("login");
});

router.post("/login", async (req, res) => {
  //we try to extract the user information from the database
  try {
    const userInfo = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if there user info is not found, we send an error message
    if (!userInfo) {
      res.status(400).json({
        message: "Incorrect Email or Password, please try again!",
      });
      return;
    }

    //if the record is found, we now try to validate the password using custom method that we created in the User Model called "checkPassword", which runs the bcrypt.compareSync in the background
    //because userInfo is the instance of User model, it can use and call the check password method
    const validPass = userInfo.checkPassword(req.body.password);

    if (!validPass) {
      res.status(400).json({
        message: "Incorrect Email or Password, please try again!",
      });
      return;
    }

    //if both email and password is valid, we save the session with user_id and logged_in data to keep track of the user
    req.session.save(() => {
      req.session.user_id = userInfo.id;
      req.session.logged_in = true;

      res.status(200).json({ message: "Successful log in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
