const express = require("express");
const path = require("path");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");
const session = require("express-session");

//initializinf the main app with express server
const app = express();
//setting up the  port number
const PORT = process.env.PORT || 3001;

// creating a class named SequelizeStore that can be used to store session data in a Sequelize database instead of the default in-memory storage.
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//creating the handle bar instance
const hbs = exphbs.create({
  //registering partials in our hbs instance
  partialsDir: path.join(__dirname, "views/partials"),
});

//creating our custom session object with few properties based on our requirements
const sess = {
  // A secret string used to sign the session ID cookie, ensuring the session is tamper-proof.
  secret: "Super secret secret",

  // Configures the session cookie's properties.
  cookie: {
    maxAge: 30 * 60 * 1000, //Sets the maximum age (in milliseconds) for the session cookie (30 minutes here).
  },
  //When false, it prevents the session from being saved back to the store if it hasn't been modified during the request.
  resave: false,
  // Set to true to store the session in the database even if it's empty when created.
  saveUninitialized: true,

  // An instance of SequelizeStore is created, specifying the Sequelize database connection (db: sequelize) for session data storage.
  store: new SequelizeStore({
    // Passes your Sequelize instance to the SequelizeStore to connect to the database.
    db: sequelize,
  }),
};

//passing our custom sess obj to the middleware
// one very imp thing, we are passing the custom sess object because we want our session to store in a sequelize database inside of express's default in-memory, which is erased when the server is restarted. This is not idle for our scenario
// we want to keep track of the session and other valueable informations to support few other functionalities within our app such as, login, logout and many more
app.use(session(sess));

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
