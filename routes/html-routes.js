const db = require("../models");

//Dummy Data
const bearsList = [{
        id: 1,
        title: "Bear A",
        Price: "$$",
    },
    {
        id: 2,
        title: "Bear B",
        Price: "$$",
    },
    {
        id: 3,
        title: "Bear C",
        Price: "$$",
    },
    {
        id: 4,
        title: "Bear D",
        Price: "$$",
    },
    {
        id: 5,
        title: "Bear E",
        Price: "$$",
    },
    {
        id: 6,
        title: "Bear F",
        Price: "$$",
    }
];

//HTML Routes
module.exports = app => {
    //Route for landing page "/"
    app.get("/", (req, res) => {
        db.Posting.findAll({}).then(results => {
            res.render("index", {
                bearsList: results
            });
        }).catch(e => {
            console.log(e);
        });
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.get("/signup", (req, res) => {
        res.render("signup");
    });

    app.get("/post", (req, res) => {
        res.render("post");
    });
    //Route for bear list "/search"
    //Route for user home page "/:user_name"

}