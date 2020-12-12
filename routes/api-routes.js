//API Routes & passport routes
module.exports = (app) => {
    //Passport routes

    //Route for logging in a user "/api/login"
    //Route for logging user out "/logout"
    //Route to sign up a new user at "/api/signup"

    //CREATE (POST)

    //Route to create a new review on a user "/api/users/review"

    //Route to create a new bear listing "/api/bears"
    //Route to create a new review on a bear listing "/api/bears/review"


    //READ (GET)

    //Route to get all users information "/api/users"

    app.get("/api/bears", (req, res) => {
        // Write code here to retrieve all of the bears from the database and res.json them
        // back to the user
        db.Bear.findAll({}).then(results => {
            res.json(results);
        }).catch(e => {
            console.log(e);
        });
    });


    //Route to get all bears information "/api/bears"
    app.get("/api/bears", function (req, res) {
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