const courseService =
    require("../services/courseService");


// ==========================================
// GET /api/courses
// ==========================================

const getCourses = async (
    req,
    res
) => {

    try {

        const result =
            await courseService.getCourses(
                req.query
            );

        res.status(200).json({
            success: true,
            data: result.courses,
            pagination:
                result.pagination
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyCourses = async (
    req,
    res
) => {

    try {

        const result =
            await courseService.getMyCourses({

                ...req.query,

                teacher_id:
                    req.user.id
            });


        res.status(200).json({

            success: true,

            data: result.courses,

            pagination:
                result.pagination
        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};

// ==========================================
// GET /api/courses/my-courses/:id
// TEACHER
// ==========================================

const getMyCourseById = async (
    req,
    res
) => {

    try {

        const course =
            await courseService.getMyCourseById(

                req.params.id,

                req.user.id

            );


        res.status(200).json({

            success: true,

            data: course

        });

    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }
};


// ==========================================
// GET /api/courses/:id
// ==========================================

const getCourseById = async (
    req,
    res
) => {

    try {

        const course =
            await courseService
                .getCourseById(
                    req.params.id
                );

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// POST /api/courses
// ==========================================

const createCourse = async (
    req,
    res
) => {

    try {

        const {
            category_id,
            title,
            slug,
            description,
            price
        } = req.body;


        if (
            !category_id ||
            !title
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "category_id và title là bắt buộc"

            });

        }


        const thumbnail =
            req.file
                ? `/uploads/images/${req.file.filename}`
                : null;


        const course =
            await courseService
                .createCourse({

                    teacher_id:
                        req.user.id,

                    category_id,

                    title,

                    slug,

                    description,

                    price,

                    thumbnail

                });


        res.status(201).json({

            success: true,

            message:
                "Tạo khóa học thành công",

            data: course

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// PUT /api/courses/:id
// ==========================================

const updateCourse = async (
    req,
    res
) => {

    try {

        const data = {
            ...req.body
        };


        if (req.file) {

            data.thumbnail =
                `/uploads/images/${req.file.filename}`;

        }


        const course =
            await courseService
                .updateCourse(
                    req.params.id,
                    data,
                    req.user
                );


        res.status(200).json({

            success: true,

            message:
                "Cập nhật khóa học thành công",

            data: course

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};

// ==========================================
// PATCH /api/courses/:id/publish
// PUBLISH COURSE
// ==========================================

const publishCourse = async (
    req,
    res
) => {

    try {

        const course =
            await courseService.publishCourse(

                req.params.id,

                req.user

            );


        res.status(200).json({

            success: true,

            message:
                "Đăng khóa học thành công",

            data: course

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// DELETE /api/courses/:id
// ==========================================

const deleteCourse = async (
    req,
    res
) => {

    try {

        await courseService
            .deleteCourse(

                req.params.id,

                req.user
            );


        res.status(200).json({

            success: true,

            message:
                "Xóa khóa học thành công"
        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message
        });
    }
};


module.exports = {
    getCourses,
    getMyCourses,
    getMyCourseById,
    getCourseById,
    createCourse,
    updateCourse,
    publishCourse,
    deleteCourse
};