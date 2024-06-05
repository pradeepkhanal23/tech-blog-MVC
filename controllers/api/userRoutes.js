const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send("Users page");
});

module.exports = router;
