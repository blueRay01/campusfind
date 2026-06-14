const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')

cloudinary.config({
    secure: true
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'campusfind',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
})

const upload = multer({ storage })

module.exports = upload