const enrollmentService =
    require("../services/enrollmentService");


// ==========================================
// ENROLL COURSE
// ==========================================

const enrollCourse = async (
    req,
    res
) => {

    try {

        // authMiddleware đã giải mã JWT
        const studentId = req.user.id;

        const courseId =
            req.params.courseId;


        // Chỉ student
        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể đăng ký khóa học"

            });

        }


        const enrollment =
            await enrollmentService.enrollCourse({

                studentId,

                courseId

            });


        return res.status(201).json({

            success: true,

            message:
                "Đăng ký khóa học thành công",

            data: enrollment

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ==========================================
// GET MY COURSES
// ==========================================

const getMyCourses = async (
    req,
    res
) => {

    try {

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có danh sách khóa học"

            });

        }


        const enrollments =
            await enrollmentService.getMyCourses(
                req.user.id
            );


        return res.json({

            success: true,

            data: enrollments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ==========================================
// CHECK ENROLLMENT
// ==========================================

const checkEnrollment = async (
    req,
    res
) => {

    try {

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể kiểm tra đăng ký"

            });

        }


        const isEnrolled =
            await enrollmentService.checkEnrollment({

                studentId: req.user.id,

                courseId: req.params.courseId

            });


        return res.json({

            success: true,

            enrolled: isEnrolled

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ==========================================
// CANCEL ENROLLMENT
// ==========================================

const cancelEnrollment = async (
    req,
    res
) => {

    try {

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể hủy đăng ký"

            });

        }


        await enrollmentService.cancelEnrollment({

            studentId: req.user.id,

            courseId: req.params.courseId

        });


        return res.json({

            success: true,

            message:
                "Hủy đăng ký khóa học thành công"

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


module.exports = {
    enrollCourse,
    getMyCourses,
    checkEnrollment,
    cancelEnrollment
};