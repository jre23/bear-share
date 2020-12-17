var AWS = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");
const db = require("../models");

AWS.config.region = "us-west-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IdentityPoolId,
});

var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: "bear-share-2" },
});

var uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "bear-share-2",
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});

module.exports = (app) => {
    app.post("/upload-posting", uploadS3.array("files"), function (req, res, next) {
        let { title, category, description, ask_price } = req.body;
        let image_paths = "";

        // Logging out the location of each file. Store this in the database...
        req.files.forEach((file) => {
            console.log(file.location);
            image_paths += file.location + " ";
        });
        image_paths.trim();
        console.log(image_paths);

        let newPosting = {
            title,
            description,
            category,
            image_paths,
            ask_price,
            userId: req.user.id,
        };
        db.Posting.create(newPosting).then((data) => {
            res.redirect("/");
        });
    });
};
