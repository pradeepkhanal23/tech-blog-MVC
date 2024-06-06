const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send("Posts page");
});

module.exports = router;
