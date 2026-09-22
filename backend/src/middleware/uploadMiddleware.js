const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// CREATE UPLOAD DIRECTORIES
// ==========================================

const videoDir = path.join(
    __dirname,
    "../../uploads/videos"
);

const documentDir = path.join(
    __dirname,
    "../../uploads/documents"
);

const imageDir = path.join(
    __dirname,
    "../../uploads/images"
);


fs.mkdirSync(videoDir, {
    recursive: true
});

fs.mkdirSync(documentDir, {
    recursive: true
});

fs.mkdirSync(imageDir, {
    recursive: true
});


// ==========================================
// VIDEO STORAGE
// ==========================================

const videoStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, videoDir);

    },

    filename: function (req, file, cb) {

        const ext =
            path.extname(
                file.originalname
            ).toLowerCase();

        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            ext;

        cb(null, filename);

    }

});


// ==========================================
// VIDEO FILTER
// ==========================================

const videoFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        "video/mp4",
        "video/mpeg",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska"

    ];


    const allowedExtensions = [

        ".mp4",
        ".mpeg",
        ".mpg",
        ".webm",
        ".mov",
        ".avi",
        ".mkv"

    ];


    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    if (
        allowedMimeTypes.includes(
            file.mimetype
        ) ||
        allowedExtensions.includes(
            extension
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                `File video không hợp lệ: ${file.originalname}`
            )
        );

    }

};


// ==========================================
// DOCUMENT STORAGE
// ==========================================

const documentStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, documentDir);

    },

    filename: function (req, file, cb) {

        const ext =
            path.extname(
                file.originalname
            ).toLowerCase();

        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            ext;

        cb(null, filename);

    }

});


// ==========================================
// DOCUMENT FILTER
// ==========================================

const documentFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        // PDF
        "application/pdf",

        // Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        // PowerPoint
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",

        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        // ZIP
        "application/zip",
        "application/x-zip-compressed",

        // Text
        "text/plain"

    ];


    const allowedExtensions = [

        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".xls",
        ".xlsx",
        ".zip",
        ".txt"

    ];


    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    if (
        allowedMimeTypes.includes(
            file.mimetype
        ) ||
        allowedExtensions.includes(
            extension
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                `File tài liệu không hợp lệ: ${file.originalname}`
            )
        );

    }

};


// ==========================================
// IMAGE STORAGE
// ==========================================

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, imageDir);

    },

    filename: function (req, file, cb) {

        const ext =
            path.extname(
                file.originalname
            ).toLowerCase();

        const filename =
            "course-" +
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            ext;

        cb(null, filename);

    }

});


// ==========================================
// IMAGE FILTER
// ==========================================

const imageFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];


    const allowedExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp"

    ];


    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    if (
        allowedMimeTypes.includes(
            file.mimetype
        ) &&
        allowedExtensions.includes(
            extension
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Ảnh khóa học chỉ chấp nhận JPG, JPEG, PNG hoặc WEBP."
            )
        );

    }

};


// ==========================================
// MULTER VIDEO
// ==========================================

const uploadVideo = multer({

    storage: videoStorage,

    fileFilter: videoFilter,

    limits: {

        fileSize:
            1024 *
            1024 *
            1024

    }

});


// ==========================================
// MULTER DOCUMENT
// ==========================================

const uploadDocument = multer({

    storage: documentStorage,

    fileFilter: documentFilter,

    limits: {

        fileSize:
            100 *
            1024 *
            1024

    }

});


// ==========================================
// MULTER IMAGE
// ==========================================

const uploadImage = multer({

    storage: imageStorage,

    fileFilter: imageFilter,

    limits: {

        // 5 MB
        fileSize:
            5 *
            1024 *
            1024

    }

});


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    uploadVideo,

    uploadDocument,

    uploadImage

};