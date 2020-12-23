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
    app.post("/profile-pic", uploadS3.single("file"), function (req, res, next) {
        let image_path = req.file.location;
        db.User.update(
            { profilePic: image_path },
            {
                where: {
                    id: req.user.id,
                },
            }
        ).then((data) => {
            res.redirect("/account");
        });
    });
};