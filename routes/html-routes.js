module.exports = (app) => {
    app.get("/", (req, res) => {
        console.log(req);
        res.render("index"); 
    });

    app.get("/signup", (req, res) => {
        res.render("signup"); 
    });
}