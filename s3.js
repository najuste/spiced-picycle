const knox = require("knox");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
    //create client one and reuse it again and again
    key: secrets.awsKey,
    secret: secrets.awsSecret,
    bucket: "bikethelife"
});

function upload(req, res, next) {
    console.log("Inside s3 function upload");
    if (!req.file) {
        res.sendStatus(500); //multerpart didn't work
    }
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype, //Setting header
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read" //Setting a permition on the file
    });
    const readStream = fs.createReadStream(req.file.path); //creating a read stream
    readStream.pipe(s3Request);
    //listen when it's done
    s3Request.on("response", s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        // deleting the file from uploads

        if (wasSuccessful) {
            next(); //that's where DB query comes in
            fs.unlink(req.file.path, () => {});
        } else {
            console.log("Upload did not work", s3Response.statusCode); //403 creds, 404 bucketname
            res.sendStatus(500); //otherwise send error, do not move on with execution
        }
    });
}

exports.upload = upload;
