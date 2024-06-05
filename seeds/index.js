const sequelize = require("../config/connection");
const seedUsers = require("./seedUsers");
const seedPosts = require("./seedPosts");
const seedComments = require("./seedComments");

const seedAll = async () => {
  try {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedPosts();
    await seedComments();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    process.exit(0);
  }
};

seedAll();
