# PIC'ycle board

An image board for sharing cycling experiences! A single page application to view and upload photos.

## Technology

Built with `Vue.js` for the front and `Node.js` Express.js at the back end.
Pictures are uploaded using `multer` package at the middleware and stored at the cloud with `AWS` `S3` service.

For navigation between images and for specific view sharing purposes, a unique path is created for each image with adding a hash and an image id to the host page.

Picture board size is is limited and therefore auto-scroll is implemented to load more images if available.

## To run

*(should have node installed)*
To install dependencies: `npm install`. To run page on localhost:8080 launch server from command line with `node index.js`.
