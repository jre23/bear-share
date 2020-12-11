module.exports = (app) => {
    app.get("/api/bears", function(req, res) {
        res.end();
      });
}