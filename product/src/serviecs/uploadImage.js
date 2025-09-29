const Imagekit = require("imagekit");
const  {v4:uuid} = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = ({file}) => {
    // console.log(file.file)
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file, // the file buffer
            fileName: uuid(), // the file name
            folder: "/products" // optional folder path
        }, (error, result) => {
            if (error) {
                console.log('the upload iamgekit error',error)
                return reject(error);
            }

                console.log('the upload iamgekit',result)
            resolve(result);
        });
    });
};

module.exports = uploadImage;