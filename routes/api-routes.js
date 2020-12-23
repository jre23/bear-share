//API Routes & passport routes
// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const {
    Op,
    json
} = require("sequelize");
// Using the server intance (app) we run different RESTful HTTP Methods.
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
    /******
        Create (POST)
    ******/
    // Route to create a new review on a user "/api/users/review"
    app.post("/api/users/review", (req, res) => {
        let review = req.body;
        review["reviewerId"] = req.user.id;
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) => {
            let fromName = data[0].dataValues.firstName + " " + data[0].dataValues.lastName;
            review["fromName"] = fromName;
            db.UserReview.create(review)
                .then((data) => {
                    res.status(200);
                    res.redirect("back");
                })
                .catch(function (err) {
                    res.status(500).json(err);
                });
        });
    });
    // Route to create a new review on a bear listing "/api/postings/comments"
    app.post("/api/postings/comments", (req, res) => {
        let comment = req.body;
        comment.commenterId = req.user.id;
        db.PostingComment.create(comment)
            .then((data) => {
                res.status(200);
                res.redirect("back");
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    });
    // Store messages to Message Model.
    app.post("/api/message/", function (req, res) {
        let message = req.body;
        message["fromId"] = req.user.id;
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) => {
            message["fromName"] = data[0].dataValues.firstName + " " + data[0].dataValues.lastName
            if (req.user.id == req.body.toId) {
                res.json(message);
            } else {
                db.Message.create(message).then((data) => {
                    res.json(data);
                });
            }
        });
    });
    // Store messages from user info to Message Model. 
    app.post("/api/userInfo/message/", function (req, res) {
        let message = req.body;
        message["fromId"] = req.user.id;
        db.User.findAll({
            where: {
                id: req.user.id
            }
        }).then((data) => {
            message["fromName"] = data[0].dataValues.firstName + " " + data[0].dataValues.lastName
            if (req.user.id == req.body.toId) {
                res.json(message);
            } else {
                db.Message.create(message).then((data) => {
                    res.json(data);
                });
            }
        });
    });
    /******
        READ (GET)
    ******/
    // Route to get a single user's information "/api/usersInfo/:userId"
    app.get("/api/userInfo/:userId", (req, res) => {
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
                res.render("userInfo", data[0].dataValues);
            })
            .catch(function (err) {
                res.status(404).json(err);
            });
    });
    // Route to get a single user's userId
    app.get("/api/users", (req, res) => {
        if (req.user) {
            res.json(req.user.id);
        } else {
            res.json(res);
        }
    });
    // Route to get all of user's info for account page used by account.js
    app.get("/api/userInfo", (req, res) => {
        db.User.findAll({
                where: {
                    id: req.user.id,
                },
            })
            .then((data) => {
                res.json(data);
            })
            .catch(function (err) {
                res.status(404).json(err);
            });
    });
    // Route to get all postings information "/api/postings".
    app.get("/api/postings", (req, res) => {
        db.Posting.findAll({}).then((data) => {
            res.json(data);
        });
    });
    // Route for Sending Messages Form.
    app.get("/api/product/:userId/:productId", (req, res) => {
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
    // Route for Sending Reply Messages Form with ProductID.
    app.get("/api/reply/:toId/:productId/:messageId", (req, res) => {
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
            res.json(userProductInfo);
        });
    });
    // Route for Sending Reply Messages Form WITHOUT ProductID.
    app.get("/api/reply/:toId/:messageId", (req, res) => {
        db.Message.findAll({
            where: {
                id: req.params.messageId
            },
            include: [{
                model: db.User
            }]
        }).then((data) => {
            let userProductInfo = {
                userId: data[0].dataValues.User.dataValues.id,
                firstName: data[0].dataValues.User.dataValues.firstName,
                lastName: data[0].dataValues.User.dataValues.lastName,
                lastContents: data[0].dataValues.contents,
                messageId: data[0].dataValues.id,
                toId: data[0].dataValues.fromId,
                toName: data[0].dataValues.fromName
            }
            res.json(userProductInfo);
        });
    });
    // This gets by userReviewedId.
    app.get("/api/users/reviews/:userId", (req, res) => {
        db.UserReview.findAll({
            where: {
                userReviewedId: req.params.userId,
            },
            include: {
                model: db.User,
            },
        }).then((data) => {
            res.json(data);
        });
    });
    // This gets by reviewerId.
    app.get("/api/users/reviewed/:userId", (req, res) => {
        db.UserReview.findAll({
            where: {
                reviewerId: req.user.id,
            },
            include: {
                model: db.User,
            },
        }).then((data) => {
            res.json(data);
        });
    });
    // Route to get all postings with reviews "/api/postings/comments".
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
    /******
        Update (PUT)
    ******/
    // Route to update a user from database "/api/users/:id".
    app.put("/api/users/", (req, res) => {
        let userData = req.body.filterUserData;
        db.User.update({
            ...userData,
        }, {
            where: {
                id: req.user.id,
            },
        }).then((data) => {
            res.json(data);
        }).catch((e) => {
            res.json(e.errors[0].message);
        });
    });
    // Update route for user comments on postings.
    app.post("/api/postings/comments/update/:commentId", (req, res) => {
        db.PostingComment.update({
            comment: req.body.comment,
        }, {
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
    // Update route for user reviews about other users.
    app.post("/api/user/reviews/update/:commentId", (req, res) => {
        db.UserReview.update({
            comment: req.body.comment,
        }, {
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
    /******
        Delete (DELETE)
    ******/
    //Route to delete a users listing from database
    app.delete("/api/postings/:postingId", (req, res) => {
        db.Posting.destroy({
            where: {
                id: req.params.postingId,
                userId: req.user.id,
            },
        }).then((data) => {
            res.json(data);
        }).catch((e) => {
            console.log(e)
        });
    });
    //Delete route for user reviews about other users
    app.post("/api/user/reviews/delete/:commentId", (req, res) => {
        db.UserReview.destroy({
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
        db.PostingComment.destroy({
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
    // Route to delete a message from database.
    app.delete("/api/messages/:messageId", (req, res) => {
        db.Message.destroy({
            where: {
                id: req.params.messageId
            },
        }).then((data) => {
            res.json(data);
        }).catch((e) => {
            console.log(e)
        });
    });
};