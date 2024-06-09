const router = require("express").Router();
const User = require("../../models/User");

const capitalize = require("../../utils/helpers");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      // User already exists, return a nice message
      return res.status(400).json({
        error: "User already exists, cannot create the user again!!",
      });
    }

    const newUser = await User.create({
      name: capitalize(req.body.name),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });
    return res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update user by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await User.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send(); // Not sending any data back, just the status code
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
