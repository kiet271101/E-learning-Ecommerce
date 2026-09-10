const materialService =
    require("../services/materialService");

const fs = require("fs");
const path = require("path");

const getMaterialsByLesson = async (
    req,
    res
) => {

    try {

        const materials =
            await materialService
                .getMaterialsByLesson({

                    lessonId:
                        req.params.lessonId,

                    user:
                        req.user

                });


        return res.status(200).json({

            success: true,

            data: materials

        });

    } catch (error) {

        console.error(
            "GET MATERIALS ERROR:",
            error
        );


        // ----------------------------------
        // Lesson không tồn tại
        // ----------------------------------

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


        // ----------------------------------
        // Chưa Enrollment
        // ----------------------------------

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


        // ----------------------------------
        // Không có quyền
        // ----------------------------------

        if (
            error.message ===
            "Bạn không có quyền xem tài liệu"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    error.message

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Không thể lấy danh sách tài liệu"

        });

    }
};


const getMaterialById = async (req, res) => {

    try {

        const material =
            await materialService.getMaterialById(
                req.params.id
            );

        res.json({
            success: true,
            data: material
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


const uploadMaterial = async (req, res) => {

    try {

        console.log("========== MATERIAL UPLOAD ==========");
        console.log("Lesson ID:", req.params.lessonId);
        console.log("User:", req.user);
        console.log("File:", req.file);
        console.log("=====================================");

        const material =
            await materialService.createMaterial({

                lessonId: req.params.lessonId,

                user: req.user,

                file: req.file

            });

        res.status(201).json({

            success: true,

            message: "Upload tài liệu thành công",

            data: material

        });

    } catch (error) {

        console.error(
            "MATERIAL ERROR:",
            error
        );

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


const deleteMaterial = async (req, res) => {

    try {

        const result =
            await materialService.deleteMaterial(
                req.params.id,
                req.user
            );

        res.json({

            success: true,

            message: result.message

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }
};

const downloadMaterial = async (
    req,
    res
) => {

    try {

        // ----------------------------------
        // 1. Kiểm tra quyền
        // ----------------------------------

        const material =
            await materialService
                .getMaterialDownloadAccess({

                    materialId: req.params.id,

                    user: req.user

                });


        // ----------------------------------
        // 2. Lấy tên file
        // ----------------------------------

        const filename =
            path.basename(
                material.file_url
            );


        // ----------------------------------
        // 3. Đường dẫn file
        // ----------------------------------

        const filePath =
            path.join(
                process.cwd(),
                "uploads",
                "documents",
                filename
            );


        // ----------------------------------
        // 4. Kiểm tra file tồn tại
        // ----------------------------------

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({

                success: false,

                message:
                    "Không tìm thấy file tài liệu"

            });

        }


        // ----------------------------------
        // 5. Download
        // ----------------------------------

        return res.download(
            filePath,
            material.name,
            (error) => {

                if (error) {

                    console.error(
                        "DOWNLOAD MATERIAL ERROR:",
                        error
                    );

                }

            }
        );


    } catch (error) {

        console.error(
            "MATERIAL DOWNLOAD ERROR:",
            error
        );


        // ----------------------------------
        // Chưa Enrollment
        // ----------------------------------

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


        // ----------------------------------
        // Không có quyền
        // ----------------------------------

        if (
            error.message ===
            "Bạn không có quyền tải tài liệu"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    error.message

            });

        }


        // ----------------------------------
        // Không tìm thấy material
        // ----------------------------------

        if (
            error.message ===
            "Không tìm thấy tài liệu"
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
                "Không thể tải tài liệu"

        });

    }
};


module.exports = {
    getMaterialsByLesson,
    getMaterialById,
    uploadMaterial,
    deleteMaterial,
    downloadMaterial
};