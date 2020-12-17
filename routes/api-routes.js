//API Routes & passport routes
// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const {
    Op,
    json
} = require("sequelize");

module.exports = (app) => {
    /***************
    Passport Routes for Signup, Login, logout
    ****************/
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        res.json(req.user);
    });

    // Route for logging user out
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function (req, res) {
        let user = req.body;
        db.User.create({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                email: user.email,
                password: user.password
            })
            .then(function () {
                res.redirect(307, "/api/login");
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    //Route to create a new review on a user "/api/users/review"
    app.post("/api/users/review", (req, res) => {
        db.UserReview.create(req.body).then((data) => {
            // This needs the reviewerId and userReviewedId in the object sent

            // reload that users page with the reviews underneath
            console.log(data);
        });
    });

    //Route to create a new bear listing "/api/postings"
    // app.post("/api/postings", (req, res) => {
    //     // console.log(req.body);
    //     let posting = req.body;
    //     console.log(req.user.id);
    //     posting["userId"] = req.user.id;
    //     console.log(posting);
    //     db.Posting.create(posting).then((data) => {
    //         // data returned... use in handlebars to
    //         // redirect user to that individual posting page?
    //         console.log(data);
    //         res.json({
    //             id: data.insertId
    //         })
    //     });
    // });

    //Route to create a new review on a bear listing "/api/postings/comments"
    app.post("/api/postings/comments", (req, res) => {
        console.log(req.body);
        let comment = req.body;
        comment.commenterId = req.user.id;
        console.log(comment);
        db.PostingComment.create(comment).then((data) => {
            res.status(200);
            res.redirect('back');
            //make sure to include the userId for who is making the comment and the postingId
            // get those off a "data-posting-id" & "data-user-id" from jQuery client-side???
            // after posting comment is added, reload that posting?
        }).catch(function (err) {
            res.status(500).json(err);
        });
    });

    /******
        READ (GET)
    ******/
    //Route to get a single user's information "/api/usersInfo/:userId"
    app.get("/api/userInfo/:userId", (req, res) => {
        console.log(req.user.id);
        console.log(req.params.userId);
        console.log(typeof req.user.id);
        console.log(typeof req.params.userId);
        if (req.user.id == parseInt(req.params.userId, 10)) {
            return res.redirect("/account");
        }
        db.User.findAll({
            where: {

                id: parseInt(req.params.userId, 10)
            },
            include: [
                {
                    model: db.Posting,
                },
                {
                    model: db.PostingComment,
                }
            ]
          }).then((data) => {
                //console.log(data[0].dataValues);
                console.log(data[0].dataValues.PostingComments);
                res.render("userInfo", data[0].dataValues);
        }).catch(function (err) {
            res.status(404).json(err);
        });
    });

    // route for user's account page. gets all of user's postings to hydrate selling tab
    app.get("/account", (req, res) => {
        if (req.user) {
            db.Posting.findAll({
                where: {
                    userId: req.user.id
                }
            }).then((data) => {
                console.log(data);
                console.log("test log for account data values");
                if (data.length < 0) {
                    res.render("account");
                } else {
                    res.render("account", {
                        bearsList: data
                    });
                }
            }).catch(function (err) {
                res.status(404).json(err);
            });
        } else {
            res.render("login");
        }
    });

    // route to get all of user's info for account page used by account.js
    app.get("/api/userInfo", (req, res) => {
        console.log(req.user.id);
        console.log("req user id line api-routes");
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) => {
            console.log(data);
            console.log("test log for userInfo data values");
            console.log(data[0].dataValues.firstName);
            res.json(data);
        }).catch(function (err) {
            res.status(404).json(err);
        });
    });

    // route for landing page "/".
    app.get("/", (req, res) => {
        if (req.user) {
            db.Posting.findAll({}).then((data) => {
                console.log(data);
                res.render("members", {
                    bearsList: data
                });
            });
        } else {
            db.Posting.findAll({}).then((data) => {
                // console.log(data);
                res.render("index", {
                    bearsList: data
                });
            });
        }
    });

    //Route to get all postings information "/api/postings"
    app.get("/api/postings", (req, res) => {
        db.Posting.findAll({}).then((data) => {
            // send to handlebars and populate postings as cards
            // include in the html something like "data-posting-id={{id}}" so we can reference that when clicking through to an individual posting????
            console.log(data);
            res.json(data);
        });
    });

    //Route to get a single posting from clicking a single card..
    app.get("/api/postings/:postingId", (req, res) => {
        db.Posting.findOne({
            where: {
                id: req.params.postingId,
            },
        }).then((postingData) => {
            // render a single posting page with postingData
            // will also need comments for the specific posting below....can utilize the req.params.postingId?
            // Should we grab the comments for this single posting as well?
            // and then can render both the posting info and comments all at once????
        });
    });

    // test route to get userId when logged in
    app.get("/api/userId", (req, res) => {
        console.log(req.user.id);
        res.json(req.user.id);
    });

    //Route to find all postings with a title LIKE searched
    app.get("/api/postings", (req, res) => {
        db.Posting.findAll({
            where: {
                title: {
                    [Op.like]: `%${req.params.query}`,
                },
            },
        }).then((data) => {
            // Render all the returned postings as cards on the main page?????
        });
    });

    // Route for Sending Messages Form
    app.get("/api/product/:id", (req, res) => {
        console.log(req.params.id);
        db.Posting.findAll({
            where: {
                id: req.params.id
            },
            include: [db.User]
        }).then((data) => {
            console.log(data[0].dataValues);
            res.json(data[0].dataValues);
        });
    });

    app.get("/api/message", (req, res) =>{
        console.log("req.body");
        console.log(req.body);
        res.end();
    });

    //Route to get all users with bear listings "/api/users/lists"  ???
    //Route to get all bear with user listings "/api/postings/lists" ???

    //Route to get all users with reviews "/api/users/reviews" ???
    //Route to get all postings with reviews "/api/postings/comments" ???
    app.get("/api/postings/comments/:postingId", (req, res) => {
        db.PostingComment.findAll({
            where: {
                PostingId: req.params.postingId,
            },
        }).then((data) => {
            res.json(data);
        });
    });


    //Route to get a user information by name "/api/users/name/:name"
    //Route to get a bear info by name "/api/postings/name/:name"

    //Route to get a bear info by category "/api/postings/category/:category"

    //UPDATE (PUT)

    //Route to update a user from database "/api/users/id/:id"
    app.put("/api/users/:userId", (req, res) => {
        // destructure req.body here???
        db.User.update({
            lastName: "hexsel"
        }, {
            where: {
                id: req.params.userId,
            },
        }).then((data) => {
            // render the users account page again???
        });
    });

    //update username, password, listings, and reviews
    //Route to update a bear from database "/api/postings/id/:id"
    //update name, value, picture, url, category

    //admin can update anything?

    //DELETE (DELETE)

    //Route to delete a user from database "/api/users/id/:id"
    app.delete("/api/users/:userId", (req, res) => {
        db.User.destroy({
            where: {
                id: req.params.userId,
            },
        }).then((data) => {
            // account is deleted...so user should be logged out / unathenticated??
            // return them to homepage???
        });
    });

    //user can delete their own review - Will have to validate that current user id is equal to reviewer_id??
    //user can delete their own listing - Will have to validate that current user id is equal to

    //Route to delete a users listing from database
    app.delete("/api/postings/:postingId", (req, res) => {
        console.log("test delete api route");
        console.log(req.body);
        db.Posting.destroy({
            where: {
                id: req.params.postingId,
                userId: req.user.id,
            },
        }).then((data) => {
            // send data back to account.js and reload the account page
            // if data === 0 -> item not found, if data === 1 -> item found and deleted
            console.log(data);
            res.json(data);
        }).catch((e) => {
            console.log(e)
        })
    });
    //admin can delete anything?
};