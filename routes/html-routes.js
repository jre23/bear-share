//HTML Routes
module.exports = (app) => {

    //Route for landing page "/"
    app.get("/", (req, res) => {
        res.render("index");
    });


    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.get("/signup", (req, res) => {
        res.render("signup");
    });

    //Route for bear list "/search"
    //Route for user home page "/:user_name"

}