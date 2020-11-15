//REQUIREMENTS
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
//STORAGE CONFIG
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'CampReview',
    allowedFormat: ["jpeg", "png", "jpg"]
    }
});
//EXPORTS
module.exports = {
    cloudinary,
    storage
}