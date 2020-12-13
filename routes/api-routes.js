//API Routes & passport routes

// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");


module.exports = (app) => {
    //Passport routes

        //Route for logging in a user "/api/login"
        // Using the passport.authenticate middleware with our local strategy.
        // If the user has valid login credentials, send them to the members page.
        // Otherwise the user will be sent an error
        app.post("/api/login", passport.authenticate("local"), function(req, res) {
            res.json(req.user);
        });



        //Route for logging user out "/logout"
        
        //Route to sign up a new user at "/api/signup"
        app.post("/api/signup", function(req, res) {
            console.log(req);
            db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password
            })
              .then(function() {
                res.redirect(307, "/api/login");
              })
              .catch(function(err) {
                res.status(401).json(err);
              });
        });
        
    //CREATE (POST)

        //Route to create a new review on a user "/api/users/review"

        //Route to create a new bear listing "/api/bears"
        //Route to create a new review on a bear listing "/api/bears/review"


    //READ (GET)

        //Route to get all users information "/api/users"


    //Route to get all bears information "/api/bears"
    app.get("/api/bears", function(req, res) {
        res.end();
      });
    //Route to get all users with bear listings "/api/users/lists"
    //Route to get all bear with user listings "/api/bears/lists"

    //Route to get all users with reviews "/api/users/reviews"
    //Route to get all bears with reviews "/api/bears/reviews"

    //Route to get a user information by name "/api/users/name/:name"
    //Route to get a bear info by name "/api/bears/name/:name"

    //Route to get a bear info by category "/api/bears/category/:category"


//UPDATE (PUT)

    //Route to update a user from database "/api/users/id/:id"
        //update username, password, listings, and reviews
    //Route to update a bear from database "/api/bears/id/:id"
        //update name, value, picture, url, category
        
    //admin can update anything?

//DELETE (DELETE) 

    //Route to delete a user from database "/api/users/id/:id"
        //user can delete their own review and listing
    //Route to delete a bear from database "/api/bears/id/:id"
        //users can delete their own bears they added to the database?
        
    //admin can delete anything?
}
