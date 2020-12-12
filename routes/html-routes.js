//HTML Routes
module.exports = (app) => {

    //Route for landing page "/"
    app.get("/", (req, res) => {
        //Dummy Data
        bearsList = [
            {
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
            }
        ];
        res.render("index", {bearsList : bearsList});
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