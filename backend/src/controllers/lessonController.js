const lessonService = require("../services/lessonService");
const fs = require("fs");
const path = require("path");

// ==========================================
// GET LESSONS BY COURSE
// ==========================================

const getLessonsByCourse = async (req, res) => {
    try {
        const lessons =
            await lessonService.getLessonsByCourse(
                req.params.courseId
            );

        res.status(200).json({
            success: true,
            data: lessons
        });

    } catch (error) {

        console.error(
            "GET LESSONS BY COURSE ERROR:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET LESSON BY ID
// ==========================================

const getLessonById = async (req, res) => {
    try {

        const lesson =
            await lessonService.getLessonById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: lesson
        });

    } catch (error) {

        console.error(
            "GET LESSON BY ID ERROR:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// CREATE LESSON
// ==========================================

const createLesson = async (req, res) => {

    try {

        const {
            title,
            description,
            duration,
            lesson_order,
            is_preview
        } = req.body;


        // ==========================================
        // VALIDATE TITLE
        // ==========================================

        if (!title) {

            return res.status(400).json({
                success: false,
                message: "Tên bài học là bắt buộc"
            });
        }


        // ==========================================
        // CREATE LESSON
        // ==========================================

        const lesson =
            await lessonService.createLesson({

                courseId:
                    req.params.courseId,

                teacherId:
                    req.user.id,

                title,

                description,

                duration,

                lessonOrder:
                    lesson_order,

                isPreview:
                    is_preview
            });


        res.status(201).json({

            success: true,

            message:
                "Tạo bài học thành công",

            data: lesson
        });

    } catch (error) {

        console.error(
            "CREATE LESSON ERROR:",
            error
        );

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// UPDATE LESSON
// ==========================================

const updateLesson = async (req, res) => {

    try {

        const lesson =
            await lessonService.updateLesson(

                req.params.id,

                req.user.id,

                req.body
            );


        res.status(200).json({

            success: true,

            message:
                "Cập nhật bài học thành công",

            data: lesson
        });

    } catch (error) {

        console.error(
            "UPDATE LESSON ERROR:",
            error
        );

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// DELETE LESSON
// ==========================================

const deleteLesson = async (req, res) => {

    try {

        await lessonService.deleteLesson(

            req.params.id,

            req.user.id
        );


        res.status(200).json({

            success: true,

            message:
                "Xóa bài học thành công"
        });

    } catch (error) {

        console.error(
            "DELETE LESSON ERROR:",
            error
        );

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// UPLOAD LESSON VIDEO
// ==========================================

const uploadLessonVideo = async (req, res) => {

    try {

        const lesson =
            await lessonService.uploadLessonVideo(

                req.params.id,

                req.user.id,

                req.file
            );


        res.status(200).json({

            success: true,

            message:
                "Upload video thành công",

            data: {

                lesson_id:
                    lesson.id,

                video_url:
                    lesson.video_url
            }
        });

    } catch (error) {

        console.error(
            "UPLOAD LESSON VIDEO ERROR:",
            error
        );

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// STREAM VIDEO
// ==========================================

const streamVideo = async (req, res) => {

    try {

        const lesson =
            await lessonService.getVideoAccess({

                lessonId:
                    req.params.id,

                user:
                    req.user
            });


        // ==========================================
        // VIDEO FILE
        // ==========================================

        const filename =
            path.basename(
                lesson.video_url
            );


        const videoPath =
            path.join(
                process.cwd(),
                "uploads",
                "videos",
                filename
            );


        // ==========================================
        // CHECK FILE
        // ==========================================

        if (!fs.existsSync(videoPath)) {

            return res.status(404).json({

                success: false,

                message:
                    "Không tìm thấy file video"
            });
        }


        // ==========================================
        // FILE INFORMATION
        // ==========================================

        const stat =
            fs.statSync(videoPath);

        const fileSize =
            stat.size;


        // ==========================================
        // MIME TYPE
        // ==========================================

        const ext =
            path.extname(
                videoPath
            ).toLowerCase();


        const mimeTypes = {

            ".mp4":
                "video/mp4",

            ".webm":
                "video/webm",

            ".mov":
                "video/quicktime",

            ".avi":
                "video/x-msvideo",

            ".mkv":
                "video/x-matroska",

            ".mpeg":
                "video/mpeg",

            ".mpg":
                "video/mpeg"
        };


        const contentType =
            mimeTypes[ext] ||
            "application/octet-stream";


        // ==========================================
        // RANGE REQUEST
        // ==========================================

        const range =
            req.headers.range;


        // ==========================================
        // NO RANGE
        // ==========================================

        if (!range) {

            res.writeHead(
                200,
                {
                    "Content-Length":
                        fileSize,

                    "Content-Type":
                        contentType,

                    "Accept-Ranges":
                        "bytes"
                }
            );


            const stream =
                fs.createReadStream(
                    videoPath
                );


            stream.pipe(res);

            return;
        }


        // ==========================================
        // PARSE RANGE
        // ==========================================

        const parts =
            range
                .replace(/bytes=/, "")
                .split("-");


        let start =
            parseInt(
                parts[0],
                10
            );


        let end =
            parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;


        // ==========================================
        // INVALID RANGE
        // ==========================================

        if (
            isNaN(start) ||
            start < 0 ||
            start >= fileSize
        ) {

            res.status(416);

            res.set(
                "Content-Range",
                `bytes */${fileSize}`
            );

            return res.end();
        }


        if (
            isNaN(end) ||
            end >= fileSize
        ) {

            end =
                fileSize - 1;
        }


        if (start > end) {

            res.status(416);

            res.set(
                "Content-Range",
                `bytes */${fileSize}`
            );

            return res.end();
        }


        // ==========================================
        // STREAM RANGE
        // ==========================================

        const chunkSize =
            end - start + 1;


        res.writeHead(
            206,
            {

                "Content-Range":
                    `bytes ${start}-${end}/${fileSize}`,

                "Accept-Ranges":
                    "bytes",

                "Content-Length":
                    chunkSize,

                "Content-Type":
                    contentType
            }
        );


        const videoStream =
            fs.createReadStream(
                videoPath,
                {
                    start,
                    end
                }
            );


        videoStream.pipe(res);

    } catch (error) {

        console.error(
            "STREAM VIDEO ERROR:",
            error
        );


        if (
            error.message ===
                "Bạn chưa đăng ký khóa học này"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    error.message
            });
        }


        if (
            error.message ===
                "Bạn không có quyền xem video"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    error.message
            });
        }


        if (
            error.message ===
                "Không tìm thấy bài học"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    error.message
            });
        }


        if (
            error.message ===
                "Bài học chưa có video"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    error.message
            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Không thể phát video"
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getLessonsByCourse,

    getLessonById,

    createLesson,

    updateLesson,

    deleteLesson,

    uploadLessonVideo,

    streamVideo
};