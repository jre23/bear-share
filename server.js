// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(
    session({
        secret: "top secret", // I put dummy value - Jehyun
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Set Handlebars.
const exphbs = require("express-handlebars");
// joel - i was getting a handlebars access has been denied error and found this solution (added runtimeOptions). reference: http://www.prowebguru.com/2020/08/nodejs-express-handlebars-access-denied-resolve-property-solution/#.X9bVvNhKiUl
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
);
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/posting-upload.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
