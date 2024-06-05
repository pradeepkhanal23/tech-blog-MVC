const { Post } = require("../models");

const postData = require("./postData.json");

const seedPosts = async () => {
  try {
    await Post.bulkCreate(postData);
    console.log("Posts seeded");
  } catch (error) {
    console.error("Failed to seed posts:", error);
  }
};

module.exports = seedPosts;
