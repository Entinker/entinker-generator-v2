const multer = require('multer')

const extensions = {
    'image/svg+xml': 'svg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: function (req, file, cb) {

        const extension = extensions[file.mimetype]


        const fileName = `${Date.now()}_${Math.round( Math.random()*1000) }.${extension}`
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage
})

function uploadImage(data, model = db, callback) {

    const func = this.uploadImage

    if (callback === undefined) {
        return new Promise(function (resolve, reject) {
            func(data, model = db, function (err, result) {
                err ? reject(err) : resolve(result || null)
            })
        })
    }

    let {
        req,
        res,
        key = 'image' //field name which has image file
    } = data

    let handler = upload.single(key)
    handler(req, res, err => {
        if (err instanceof multer.MulterError) {
            throw new Error(err)
        } else if (!req.file) {
            throw new Error('no image')
        }
        let data = {
            image_name: req.file.filename
        }
        const image_id = model('image').insert(data)
        return callback(null, image_id)
    })
}

module.exports = {
    uploadImage
}