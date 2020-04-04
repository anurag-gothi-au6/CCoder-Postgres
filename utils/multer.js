const multer = require('multer');


let multerConfig = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: function (req, file, cb) {
        console.log(file)
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            var newError = new Error("File type is incorrect");
            newError.name = "MulterError";
            cb(newError, false);
        }
    }
});

let upload = multer(multerConfig);

module.exports = upload;