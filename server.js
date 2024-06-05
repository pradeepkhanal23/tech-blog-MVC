const express = require("express");
const path = require("path");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");

//initializinf the main app with express server
const app = express();
//setting up the  port number
const PORT = process.env.PORT || 3001;

//creating the handle bar instance
const hbs = exphbs.create();

// setting up the rendering and viewing engine as handlerbars templeting engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// making sure our server is capable of rexognizing the json files as well as url encoded data
//also serving all the static assets via public folder using express.static() method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
