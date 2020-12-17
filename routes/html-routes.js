const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");
//HTML Routes
module.exports = (app) => {
    // route for login page
    app.get("/login", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("login");
        }
    });

    // route for signup page
    app.get("/signup", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("signup");
        }
    });
    // route for posting an item
    app.get("/post", (req, res) => {
        if (req.user) {
            res.render("post");
        } else {
            res.render("login");
        }
    });

    // route for user's account page
    app.get("/account", (req, res) => {
        if (req.user) {
            db.User.findAll({
                where: {
                    id: req.user.id,
                },
                include: {
                    model: db.Posting,
                },
            }).then((data) => {
                return res.render("account", data[0].dataValues);
            });
        } else {
            res.render("login");
        }
    });

    // route for members page. currently don't have members.handlebars file
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    // app.get("/members", isAuthenticated, (req, res) => {
    //     res.render("members");
    // });

    // route for bear list "/search"
    app.get("/search", (req, res) => {
        res.render("search"); // currently don't have a search.handlebars file
    });

    // route for showing a product
    app.get("/product/:productID", (req, res) => {
        if (req.user) {
            db.Posting.findOne({
                where: {
                    id: req.params.productID,
                },
            }).then(function (results) {
                console.log(results);
                let hbsObject = results.dataValues;
                console.log(hbsObject);
                res.render("product", hbsObject);
            });
        } else {
            res.render("login");
        }
    });
};
