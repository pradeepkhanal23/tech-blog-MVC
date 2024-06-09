const User = require("../models/User");
const router = require("express").Router();
const capitalize = require("../utils/helpers");
const { Op } = require("sequelize");
const withAuth = require("../utils/auth");

// when the user request for login page, we either show them the login page if the user is not logged in OR we show them the dashboard if the user is logged in

// ----------------------------------------LOGIN----------------------------------------------------------------------------
//GET REQUEST LOGIN
router.get("/login", async (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
  }

  res.render("login");
});

// POST REQUEST LOGIN
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

// ----------------------------------------SIGNUP----------------------------------------------------------------------------
// GET SIGNUP
router.get("/signup", async (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
  }

  res.render("signup");
});

// POST SIGNUP
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;

  if (username && email && password) {
    try {
      email = email.toLowerCase();
      const userCheck = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (userCheck) {
        res.status(400).json({
          message: "user alread exists, please login!",
        });
      } else {
        username = capitalize(username);

        console.log(username, email);
        const newUser = await User.create({
          username,
          email,
          password,
        });

        //using return to explicilty exit and stop other execution
        //considered a better practice
        return res.status(201).json({
          newUser,
          message: "new user created",
        });
      }
    } catch (err) {
      console.log("Error creating new user", err);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(400).json({
      message: "Please enter all the fields with valid inputs",
    });
  }
});

// Logout route
router.get("/logout", withAuth, async (req, res) => {
  try {
    // Destroy the session to log out the user
    req.session.destroy(() => {
      // Redirect the user to the login page after logging out
      res.redirect("/auth/login");
    });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
