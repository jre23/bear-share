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
                password: user.password,
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
        let review = req.body;
        review["reviewerId"] = req.user.id;

        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) =>{
            // console.log(data);
            let fromName = data[0].dataValues.firstName + " " + data[0].dataValues.lastName;
            console.log(fromName);
            review["fromName"] = fromName;
            console.log(review);
            db.UserReview.create(review)
            .then((data) => {
                res.status(200);
                res.redirect("back");
                // This needs the reviewerId and userReviewedId in the object sent

                // reload that users page with the reviews underneath
                // console.log(data);
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
        });
    });

    //Route to create a new review on a bear listing "/api/postings/comments"
    app.post("/api/postings/comments", (req, res) => {
        // console.log(req.body);
        let comment = req.body;
        comment.commenterId = req.user.id;
        // console.log(comment);
        db.PostingComment.create(comment)
            .then((data) => {
                res.status(200);
                res.redirect("back");
                //make sure to include the userId for who is making the comment and the postingId
                // get those off a "data-posting-id" & "data-user-id" from jQuery client-side???
                // after posting comment is added, reload that posting?
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    });

    /******
        READ (GET)
    ******/
    //Route to get a single user's information "/api/usersInfo/:userId"
    app.get("/api/userInfo/:userId", (req, res) => {
        // console.log(req.user.id);
        // console.log(req.params.userId);
        // console.log(typeof req.user.id);
        // console.log(typeof req.params.userId);
        if (req.user.id == parseInt(req.params.userId, 10)) {
            return res.redirect("/account");
        }
        db.User.findAll({
                where: {
                    id: parseInt(req.params.userId, 10),
                },
                include: [{
                        model: db.Posting,
                    },
                    {
                        model: db.PostingComment,
                    },
                ],
            })
            .then((data) => {
                //console.log(data[0].dataValues);
                //console.log(data[0].dataValues.PostingComments);
                res.render("userInfo", data[0].dataValues);
            })
            .catch(function (err) {
                res.status(404).json(err);
            });
    });

    //Route to get a single user's userId
    app.get("/api/users", (req, res) => {
        res.json(req.user.id);
    });

    // route to get all of user's info for account page used by account.js
    app.get("/api/userInfo", (req, res) => {
        console.log(req.user.id);
        console.log("req user id line api-routes");
        db.User.findAll({
                where: {
                    id: req.user.id,
                },
            })
            .then((data) => {
                console.log(data);
                console.log("test log for userInfo data values");
                console.log(data[0].dataValues.firstName);
                res.json(data);
            })
            .catch(function (err) {
                res.status(404).json(err);
            });
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
    app.get("/api/product/:userId/:productId", (req, res) => {
        console.log("req.params.userId");
        console.log(req.params.userId);
        console.log("req.params.productId");
        console.log(req.params.productId);
        db.User.findAll({
            where: {
                id: req.params.userId
            },
            include: [{
                model: db.Posting,
                where: {
                    id: req.params.productId
                }
            }]
        }).then((data) => {
            console.log("====================data[0]====================");
            console.log(data.dataValues);
            console.log(data[0].dataValues);
            console.log(data[0].dataValues.Postings[0].dataValues);
            // console.log(data[0].dataValues.Posting.dataValues);
            let userProductInfo = {
                userId: data[0].dataValues.id,
                firstName: data[0].dataValues.firstName,
                lastName: data[0].dataValues.lastName,
                productId: data[0].dataValues.Postings[0].dataValues.id,
                productTitle: data[0].dataValues.Postings[0].dataValues.title,
                productCategory: data[0].dataValues.Postings[0].dataValues.category,
                productImgPath: data[0].dataValues.Postings[0].dataValues.image_paths,
                productPrice: data[0].dataValues.Postings[0].dataValues.ask_price
            }

            res.json(userProductInfo);
        });
    });

    // Route for Sending Reply Messages Form with ProductID
    app.get("/api/reply/:toId/:productId/:messageId", (req, res) => {
        console.log("req.params.toId");
        console.log(req.params.toId);
        console.log("req.params.productId");
        console.log(req.params.productId);
        let toId = req.params.userId;
        let productId = req.params.productId;
        let fromId = req.user.id;
        console.log("fromId");
        console.log(fromId);
        db.Message.findAll({
            where: {
                id: req.params.messageId
            },
            include: [{
                    model: db.User
                },
                {
                    model: db.Posting
                }
            ]
        }).then((data) => {
            console.log("====================Server Side toID!!!====================");
            console.log(data[0].dataValues);

            // console.log(data[0].dataValues.Postings[0].dataValues);
            // // console.log(data[0].dataValues.Posting.dataValues);
            let userProductInfo = {
                userId: data[0].dataValues.User.dataValues.id,
                firstName: data[0].dataValues.User.dataValues.firstName,
                lastName: data[0].dataValues.User.dataValues.lastName,
                productId: data[0].dataValues.Posting.dataValues.id,
                productTitle: data[0].dataValues.Posting.dataValues.title,
                productCategory: data[0].dataValues.Posting.dataValues.category,
                productImgPath: data[0].dataValues.Posting.dataValues.image_paths,
                productPrice: data[0].dataValues.Posting.dataValues.ask_price,
                lastContents: data[0].dataValues.contents,
                messageId: data[0].dataValues.id,
                toId: data[0].dataValues.fromId,
                toName: data[0].dataValues.fromName
            }
            console.log("============userProductInfo========");
            console.log(userProductInfo);
            res.json(userProductInfo);
        });
    });

    // Route for Sending Reply Messages Form WITHOUT ProductID
    app.get("/api/reply/:toId/:messageId", (req, res) => {
        console.log("req.params.toId");
        console.log(req.params.toId);
        let toId = req.params.toId;
        let fromId = req.user.id;
        console.log("fromId");
        console.log(fromId);
        db.Message.findAll({
            where: {
                id: req.params.messageId
            },
            include: [{
                    model: db.User
                }
            ]
        }).then((data) => {
            console.log("====================Server Side toID!!!====================");
            console.log(data[0].dataValues);

            // console.log(data[0].dataValues.Postings[0].dataValues);
            // // console.log(data[0].dataValues.Posting.dataValues);
            let userProductInfo = {
                userId: data[0].dataValues.User.dataValues.id,
                firstName: data[0].dataValues.User.dataValues.firstName,
                lastName: data[0].dataValues.User.dataValues.lastName,
                lastContents: data[0].dataValues.contents,
                messageId: data[0].dataValues.id,
                toId: data[0].dataValues.fromId,
                toName: data[0].dataValues.fromName
            }
            console.log("============userProductInfo========");
            console.log(userProductInfo);
            res.json(userProductInfo);
        });
    });

    // Store messages to Message Model
    app.post("/api/message/", function (req, res) {
        // console.log(req.body);
        console.log("req.user.id");
        // console.log(req.user.id); 
        let message = req.body;
        message["fromId"] = req.user.id;
        // console.log(message);
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) =>{
            console.log(data[0].dataValues.firstName);
            message["fromName"] = data[0].dataValues.firstName + " " + data[0].dataValues.lastName 
            console.log("message");
            console.log(message);
            if(req.user.id == req.body.toId){
                res.json(message);
            }
            else{
                db.Message.create(message).then((data) => {
                    res.json(data);
                });
            }
        });

    });

    // Store messages from user info to Message Model 
    app.post("/api/userInfo/message/", function (req, res) {
        console.log(req.body);
        console.log("req.user.id");
        console.log(req.user.id);
        let message = req.body;
        message["fromId"] = req.user.id;
        console.log(message);
        
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) =>{
            console.log(data[0].dataValues.firstName);
            message["fromName"] = data[0].dataValues.firstName + " " + data[0].dataValues.lastName 
            console.log("message");
            console.log(message);
            if(req.user.id == req.body.toId){
                res.json(message);
            }
            else{
                db.Message.create(message).then((data) => {
                    res.json(data);
                });
            }
        });

        // if(req.user.id == req.body.toId){
        //     res.json(message);
        // }
        // else{
        //     db.Message.create(message).then((data) => {
        //         res.json(data);
        //     });
        // }

    });


    //Route to delete a message from database
    app.delete("/api/messages/:messageId", (req, res) => {
        console.log(req.params.messageId);
        db.Message.destroy({
            where: {
                id: req.params.messageId
            },
        }).then((data) => {
            // if data === 0 -> item not found, if data === 1 -> item found and deleted
            console.log(data);
            res.json(data);
        }).catch((e) => {
            console.log(e)
        });
    });




    //This gets by userReviewedId
    app.get("/api/users/reviews/:userId", (req, res) => {
        console.log(req.params.userId);
        db.UserReview.findAll({
            where: {
                userReviewedId: req.params.userId,
            },
            include: {
                model: db.User,
            },
        }).then((data) => {
            console.log(data);
            res.json(data);
        });
    });
    //This gets by reviewerId
    app.get("/api/users/reviewed/:userId", (req, res) => {
        console.log(req.params.userId);
        db.UserReview.findAll({
            where: {
                reviewerId: req.user.id,
            },
            include: {
                model: db.User,
            },
        }).then((data) => {
            console.log(data);
            res.json(data);
        });
    });
    //Route to get all postings with reviews "/api/postings/comments" ???
    app.get("/api/postings/comments/:postingId", (req, res) => {
        db.PostingComment.findAll({
            where: {
                postingId: req.params.postingId,
            },
            include: {
                model: db.User,
                attributes: ["firstName", "lastName"],
            },
        }).then((data) => {
            res.json(data);
        });
    });

    //Route to get a user information by name "/api/users/name/:name"
    //Route to get a bear info by name "/api/postings/name/:name"

    //Route to get a bear info by category "/api/postings/category/:category"

    //UPDATE (PUT)

    //Route to update a user from database "/api/users/:id"
    app.put("/api/users/", (req, res) => {
        console.log("==========api/users req.body==========");
        let userData = req.body.filterUserData;
        console.log(userData)
        db.User.update({
            ...userData,
        }, {
            where: {
                id: req.user.id,
            },
        }).then((data) => {
            res.json(data);
        }).catch((e) => {
            console.log(e);
            res.json(e.errors[0].message);
        });
    });
    //Update route for user comments on postings
    app.post("/api/postings/comments/update/:commentId", (req, res) => {
        console.log(req.body.comment)
        db.PostingComment.update({
            comment: req.body.comment,
        },
        {
            where: {
                id: req.params.commentId
            }
        }).then((data) => {
            res.status(200);
            res.redirect("back");
        }).catch(function (err) {
            res.status(500).json(err);
        });
    })
    //Update route for user reviews about other users
    app.post("/api/user/reviews/update/:commentId", (req, res) => {
        console.log(req.body.comment)
        db.UserReview.update({
            comment: req.body.comment,
        },
        {
            where: {
                id: req.params.commentId
            }
        }).then((data) => {
            res.status(200);
            res.redirect("back");
        }).catch(function (err) {
            res.status(500).json(err);
        });
    })
    

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
            // if data === 0 -> item not found, if data === 1 -> item found and deleted
            console.log(data);
            res.json(data);
        }).catch((e) => {
            console.log(e)
        });
    });
    //Delete route for user reviews about other users
    app.post("/api/user/reviews/delete/:commentId", (req, res) => {
        console.log(req.body.comment)
        db.UserReview.destroy(
        {
            where: {
                id: req.params.commentId
            }
        }).then((data) => {
            res.status(200);
            res.redirect("back");
        }).catch(function (err) {
            res.status(500).json(err);
        });
    })
    //Delete route for user comments on postings
    app.post("/api/postings/comments/delete/:commentId", (req, res) => {
        console.log(req.body.comment)
        db.PostingComment.destroy(
        {
            where: {
                id: req.params.commentId
            }
        }).then((data) => {
            res.status(200);
            res.redirect("back");
        }).catch(function (err) {
            res.status(500).json(err);
        });
    })

    //admin can delete anything?
};