var AWS = require("aws-sdk");
var express = require("express");
var multer = require("multer");
var multerS3 = require("multer-s3");
const db = require("../models");

var app = express();

var s3 = new AWS.S3({
    accessKeyId: "AKIA4XUDOL34WVD7NMNJ",
    secretAccessKey: "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",
});

var uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "bear-share",
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
        };
        db.Posting.create(newPosting).then((data) => {
            res.redirect("/");
        });
    });
};
