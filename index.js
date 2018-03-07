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

app.use(express.static("public"));

app.use(express.static("uploads/"));

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        console.log("Successfull upload", req.file.filename, req.body);
        db
            .query(
                `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id`,
                [
                    req.file.filename,
                    req.body.username,
                    req.body.title,
                    req.body.description
                ]
            )
            .then(results => {
                console.log(
                    "Check image filename in results:",
                    results.rows[0]
                );
                res.json({
                    id: results.rows[0].id,
                    imageFilename: req.file.filename
                });
            });
    } else {
        console.log("Fail... upload");
        res.json({
            success: false
        });
    }
});

app.get("/images", function(req, res) {
    db.query(`SELECT*FROM images ORDER BY id DESC`).then(results => {
        let images = results.rows;

        images.forEach(function(img) {
            img.image = config.s3Url + img.image;
            return img;
        });
        //res.json(images);
        res.json({ images: images });
    });
});

app.get("/image/:id", function(req, res) {
    db.query(`SELECT * FROM images WHERE id=$1`, [req.params.id]).then(results => {
        if(results.rows.length){
            console.log("Getting a single image", results.rows[0].image);
            let imageSingle= results.rows[0];
            imageSingle.image= config.s3Url + results.rows[0].image;
            res.json({imageSingle});
        }
        else{
            console.log('Some wrong query was done');
            req.sendStatus(500);
        }

    });
});

// app.get("/singleimagecomments", function(req, res) {
//     //how to pass an id here?
//
//     let getcomments = function(id) {
//         return db.query(
//             `SELECT*FROM comments WHERE image_id=($1) ORDER BY created_at DESC`,
//             [id]
//         );
//     };
//     getcomments.then(results => {
//         console.log("Getting comments", results.rows);
//         res.json({ images: results.rows });
//     });
// });

// app.post("/comment", uploader.single("file"), s3.upload, function(req, res) {
//     if (req.body) {
//         console.log("Successfull comment upload", req.body);
//         //how do we get the image_id
//         db
//             .query(
//                 `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3)`,
//                 [req.body.username, req.body.comment, image_id]
//             )
//             .then(results => {
//                 console.log("Uploaded comment results:", results.rows);
//                 res.json({
//                     id: results.rows[0].id,
//                     imageFilename: req.file.filename
//                 });
//             });
//     } else {
//         console.log("Fail... upload comment");
//         res.json({
//             success: false
//         });
//     }
// });

//get route and post route for images
//route get data about images
//route get  data about comments or put those both queries in one route

//so on pop - all data of comments and images
// this view of all data should be a component
// axios.post('/coment', {
//     username: ...
//
// })

app.listen(8080, () => console.log("Nieko tokio"));
