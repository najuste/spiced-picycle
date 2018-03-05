const express = require("express");
const spicedPg = require("spiced-pg");
const config = require("./config");

var { dbUser, dbPass } = require("./secrets.json");
var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

const app = express();

app.use(express.static("public"));

app.get("/images", function(req, res) {
    db.query(`SELECT*FROM images`).then(results => {
        let images = results.rows;

        images.forEach(function(img) {
            img.image = config.s3Url + img.image;
            return img;
        });
        //res.json(images);
        res.json({ images: images });
    });
});

app.listen(8080, () => console.log("Nieko tokio"));
