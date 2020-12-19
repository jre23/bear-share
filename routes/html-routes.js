const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");
//HTML Routes

module.exports = (app) => {
    // route for landing page "/".
    app.get("/", (req, res) => {
        if (req.user) {
            db.Posting.findAll({}).then((data) => {
                console.log(data);
                res.render("members", {
                    bearsList: data,
                });
            });
        } else {
            db.Posting.findAll({}).then((data) => {
                // console.log(data);
                res.render("index", {
                    bearsList: data,
                });
            });
        }
    });

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

    // route for user's account page. gets all of user's postings to hydrate selling tab
    app.get("/account", (req, res) => {
        if (req.user) {
            db.User.findAll({
                where: {
                    id: req.user.id,
                },
                include: [
                    {
                        model: db.Posting,
                    },
                    {
                        model: db.Message
                    },
                    {
                        model: db.PostingComment
                    },
                    {
                        model: db.UserReview
                    }]
            })
                .then((data) => {
                    //Creating PostingComment Array
                    let postingCommentArr = [];
                    for(let i = 0; i < data[0].dataValues.PostingComments.length; i++){
                        postingCommentArr.push(data[0].dataValues.PostingComments[i].dataValues);
                    }

                    //Creating UserReview Array
                    let userReviewArr = [];
                    for(let i = 0; i < data[0].dataValues.UserReviews.length; i++){
                        userReviewArr.push(data[0].dataValues.UserReviews[i].dataValues);
                    }
                    
                    //Creating Posting Array
                    let postingArr = [];
                    for (let i = 0; i < data[0].dataValues.Postings.length; i++) {
                        postingArr.push(data[0].dataValues.Postings[i].dataValues);
                    }
                   
                    //Creating Message Array
                    let messageArr = [];
                    for (let i = 0; i < data[0].dataValues.Messages.length; i++) {
                        messageArr.push(data[0].dataValues.Messages[i].dataValues);
                    }
                   
                    //this is for editing date for received date for message tab on account page points to messageArr
                    let count = 0;
                    let newMessageArr = [];
                    messageArr.forEach((obj) => {
                        newMessageArr.push(obj);
                        console.log("obj in foreach");
                        for (key in obj) {
                            if (key === "createdAt") {
                                console.log("inside If statement");
                                newMessageArr[count]["createdAt"] = obj.createdAt.toString().substring(0, 10);
                            }
                        }
                        count++;
                    });
                    //initialize the object out of the will be passed to the res.render
                    let renderObj = {};
                    //Add in Profile data to render object
                    renderObj.Profile = data[0].dataValues;
                    
                    //Check if the array is greater than 0 then add to the renderArr to renderObj
                    if (postingArr.length !== 0){
                        renderObj.Postings = postingArr;
                    }

                    if (messageArr.length !== 0){
                        renderObj.Messages = messageArr;
                    }

                    if (postingCommentArr.length !== 0){
                        renderObj.PostingComments = postingCommentArr;
                    }

                    if (userReviewArr.length !== 0){
                        renderObj.UserReviews = userReviewArr;
                    }
                    console.log(renderObj);
                res.render("account",renderObj)})
                .catch(function (err) {
                    res.status(404).json(err);
                });
        } else {
            res.render("login");
        }
    });

    // route for bear list "/search"
    app.get("/search", (req, res) => {
        console.log("test search route");
        console.log("==========search==========");
        let urlSlice = req.url.slice(15);
        let urlArray = urlSlice.toLowerCase().split("+");
        let urlString = urlArray.join(" ");
        let searchInput = urlString.trim().replace(/\s+/g, " ");
        if (searchInput === "") {
            console.log("Search input was empty!");
            res.redirect("/");
        } else {
            db.Posting.findAll({})
                .then((data) => {
                    console.log(data);
                    console.log("test /search route with > 0 postings");
                    console.log(urlSlice);
                    console.log(urlArray);
                    console.log(urlString);
                    let index = -1;
                    let searchArray = [];
                    let searchInputLower = urlString;
                    let eachInputArray = urlArray;
                    console.log("==========eachInputArray==========");
                    console.log(eachInputArray);
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].title.toLowerCase() === searchInputLower) {
                            index = i;
                            console.log("item found!");
                        }
                        if (
                            data[i].title.toLowerCase().includes(searchInputLower) ||
                            data[i].description.toLowerCase().includes(searchInputLower) ||
                            data[i].category.toLowerCase().includes(searchInputLower)
                        ) {
                            searchArray.push(data[i]);
                        }
                        for (let j = 0; j < eachInputArray.length; j++) {
                            if (
                                data[i].title.toLowerCase().toString().includes(eachInputArray[j]) ||
                                data[i].description.toLowerCase().toString().includes(eachInputArray[j]) ||
                                data[i].category.toLowerCase().includes(eachInputArray[j])
                            ) {
                                if (!searchArray.includes(data[i])) {
                                    searchArray.push(data[i]);
                                }
                            }
                        }
                    }
                    let searchEmptyArray = [
                        {
                            title: "Your search came up empty! Try a different search.",
                        },
                    ];
                    if (index < 0 && searchArray.length === 0) {
                        res.render("search", {
                            emptyList: searchEmptyArray,
                        });
                    } else {
                        res.render("search", {
                            bearsList: searchArray,
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });
    // route for showing a product
    app.get("/product/:productID", (req, res) => {
        if (req.user) {
            db.Posting.findOne({
                where: {
                    id: req.params.productID,
                },
                include: [
                    {
                        model: db.User,
                        attributes: ["firstName", "lastName"],
                    },
                ],
            }).then(function (results) {
                let hbsObject = results.dataValues;
                let image_paths = hbsObject.image_paths.trim().split(" ");
                console.log(image_paths);
                hbsObject.image_paths = image_paths;
                console.log(hbsObject);
                res.render("product", hbsObject);
            });
        } else {
            res.render("login");
        }
    });
};
