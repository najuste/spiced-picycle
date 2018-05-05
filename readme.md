# PIC'ycle board

An image board for sharing cycling experiences! A single page application to view and upload photos.

## Technology

Built with `Vue.js` for the front and `Node.js` Express.js at the back end.

Pictures are uploaded using `multer` package and stored at the `AWS` cloud, `S3` service.

![alt text](https://github.com/najuste/spiced-picycle/blob/master/gifs/picycle_imageUpload.gif "Uploading a new image")

For navigation between images and for specific view sharing purposes, a unique path is created for each image with adding a hash and an image id to the host page.

Also one can leave a comment for a specific image.
![alt text](https://github.com/najuste/spiced-picycle/blob/master/gifs/picycle_comments.gif "Leaving a comment")

Picture board size is is limited and therefore auto-scroll is implemented to load more images if available.
![alt text](https://github.com/najuste/spiced-picycle/blob/master/gifs/picycle_autoscroll.gif "Autoscroll")

## To run

_(should have node installed)_

To install dependencies: `npm install`. To run page on localhost:8080 launch server from command line with `node index.js`.
