const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send("Comments page");
});

module.exports = router;
