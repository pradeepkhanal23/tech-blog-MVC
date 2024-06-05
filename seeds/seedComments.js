const { Comment } = require("../models");

const commentData = require("./commentData.json");

const seedComments = async () => {
  try {
    await Comment.bulkCreate(commentData);
    console.log("Comments seeded");
  } catch (error) {
    console.error("Failed to seed comments:", error);
  }
};

module.exports = seedComments;
