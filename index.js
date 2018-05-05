const express = require("express");
const spicedPg = require("spiced-pg");
const config = require("./config");
const s3 = require("./s3.js");

var bodyParser = require("body-parser");

var { dbUser, dbPass } = require("./secrets.json");
var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(express.static("uploads/"));

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        db
            .query(
                `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
                [
                    req.file.filename,
                    req.body.username,
                    req.body.title,
                    req.body.description
                ]
            )
            .then(results => {
                results = results.rows[0];
                results.image = config.s3Url + results.image;
                res.json({ image: results });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        console.log("Fail... upload");
        res.json({
            success: false
        });
    }
});

var limit = 6;
app.get("/images", function(req, res) {
    getImages(0, limit)
        .then(results => {
            //console.log("Getting images"); // here could be checked if resource is accessable
            res.json({ images: results });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/images/:nextbatch", function(req, res) {
    getImages(req.params.nextbatch, limit)
        .then(results => {
            res.json({ images: results });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/image/:id", function(req, res) {
    db
        .query(`SELECT * FROM images WHERE id=$1`, [req.params.id])
        .then(results => {
            if (results.rows.length) {
                let imageSingle = results.rows[0];
                imageSingle.image = config.s3Url + results.rows[0].image;
                res.json({ imageSingle });
            } else {
                req.sendStatus(500);
            }
        })
        .catch(err => console.log(err));
});

app.get("/comments/:image_id", function(req, res) {
    return db
        .query(
            `SELECT*FROM comments WHERE image_id=($1) ORDER BY created_at DESC`,
            [req.params.image_id]
        )
        .then(results => {
            res.json({ comments: results.rows });
        });
});

app.post("/comments/:image_id", function(req, res) {
    if (req.body) {
        db
            .query(
                `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *`,
                [req.body.username, req.body.comment, req.params.image_id]
            )
            .then(results => {
                res.json({
                    comments: results.rows
                });
            });
    } else {
        console.log("Fail... upload comment");
        res.json({
            success: false
        });
    }
});

function getImages(start, limit) {
    return db
        .query(`SELECT*FROM images ORDER BY id DESC LIMIT $1 OFFSET $2`, [
            limit,
            start
        ])
        .then(results => {
            let images = results.rows;
            images.forEach(function(img) {
                img.image = config.s3Url + img.image;
                return img;
            });
            return images;
        })
        .catch(err => console.log(err));
}

app.listen(8080, () => console.log("Nieko tokio"));
