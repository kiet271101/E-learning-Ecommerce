const lessonService =
    require("../services/lessonService");

const fs = require("fs");
const path = require("path");

// ==========================================
// GET LESSONS
// ==========================================

const getLessonsByCourse = async (
    req,
    res
) => {

    try {

        const lessons =
            await lessonService
                .getLessonsByCourse(
                    req.params.courseId
                );

        res.status(200).json({

            success: true,

            data: lessons
        });

    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// GET LESSON
// ==========================================

const getLessonById = async (
    req,
    res
) => {

    try {

        const lesson =
            await lessonService
                .getLessonById(
                    req.params.id
                );

        res.status(200).json({

            success: true,

            data: lesson
        });

    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// CREATE
// ==========================================

const createLesson = async (
    req,
    res
) => {

    try {

        const {
            title,
            description,
            lessonOrder,
            isPreview
        } = req.body;


        if (!title) {

            return res.status(400).json({

                success: false,

                message:
                    "Tên bài học là bắt buộc"
            });
        }


        const lesson =
            await lessonService
                .createLesson({

                    courseId:
                        req.params.courseId,

                    teacherId:
                        req.user.id,

                    title,

                    description,

                    lessonOrder,

                    isPreview
                });


        res.status(201).json({

            success: true,

            message:
                "Tạo bài học thành công",

            data: lesson
        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// UPDATE
// ==========================================

const updateLesson = async (
    req,
    res
) => {

    try {

        const lesson =
            await lessonService
                .updateLesson(

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

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// DELETE
// ==========================================

const deleteLesson = async (
    req,
    res
) => {

    try {

        await lessonService
            .deleteLesson(

                req.params.id,

                req.user.id
            );


        res.status(200).json({

            success: true,

            message:
                "Xóa bài học thành công"
        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


// ==========================================
// UPLOAD VIDEO
// ==========================================

const uploadLessonVideo = async (
    req,
    res
) => {

    try {

        const lesson =
            await lessonService
                .uploadLessonVideo(

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

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

const streamVideo = async (
    req,
    res
) => {

    try {

        // ----------------------------------
        // 1. Kiểm tra quyền truy cập
        // ----------------------------------

        const lesson =
            await lessonService.getVideoAccess({

                lessonId: req.params.id,

                user: req.user

            });


        // ----------------------------------
        // 2. Lấy tên file
        // ----------------------------------

        const filename =
            path.basename(
                lesson.video_url
            );


        // ----------------------------------
        // 3. Đường dẫn video
        // ----------------------------------

        const videoPath =
            path.join(
                process.cwd(),
                "uploads",
                "videos",
                filename
            );


        // ----------------------------------
        // 4. Kiểm tra file
        // ----------------------------------

        if (!fs.existsSync(videoPath)) {

            return res.status(404).json({

                success: false,

                message:
                    "Không tìm thấy file video"

            });

        }


        // ----------------------------------
        // 5. Lấy thông tin file
        // ----------------------------------

        const stat =
            fs.statSync(videoPath);

        const fileSize =
            stat.size;


        // ----------------------------------
        // 6. Xác định MIME
        // ----------------------------------

        const ext =
            path.extname(
                videoPath
            ).toLowerCase();


        const mimeTypes = {

            ".mp4": "video/mp4",

            ".webm": "video/webm",

            ".mov": "video/quicktime",

            ".avi": "video/x-msvideo",

            ".mkv": "video/x-matroska",

            ".mpeg": "video/mpeg",

            ".mpg": "video/mpeg"

        };


        const contentType =
            mimeTypes[ext] ||
            "application/octet-stream";


        // ----------------------------------
        // 7. Kiểm tra Range
        // ----------------------------------

        const range =
            req.headers.range;


        // ==================================
        // KHÔNG CÓ RANGE
        // ==================================

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


        // ==================================
        // CÓ RANGE
        // ==================================

        const parts =
            range.replace(
                /bytes=/,
                ""
            ).split("-");


        let start =
            parseInt(
                parts[0],
                10
            );


        let end =
            parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;


        // ----------------------------------
        // Range không hợp lệ
        // ----------------------------------

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


        // ----------------------------------
        // Giới hạn end
        // ----------------------------------

        if (
            isNaN(end) ||
            end >= fileSize
        ) {

            end =
                fileSize - 1;

        }


        // ----------------------------------
        // Đảm bảo start <= end
        // ----------------------------------

        if (start > end) {

            res.status(416);

            res.set(
                "Content-Range",
                `bytes */${fileSize}`
            );

            return res.end();
        }


        const chunkSize =
            end - start + 1;


        // ----------------------------------
        // Response 206
        // ----------------------------------

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


        // ----------------------------------
        // Stream
        // ----------------------------------

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

module.exports = {

    getLessonsByCourse,

    getLessonById,

    createLesson,

    updateLesson,

    deleteLesson,

    uploadLessonVideo,

    streamVideo
};