const progressService =
    require("../services/progressService");


// =====================================================
// GET LESSON PROGRESS
// =====================================================

const getLessonProgress = async (
    req,
    res
) => {

    try {

        // -----------------------------------------
        // Chỉ student
        // -----------------------------------------

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể xem tiến độ"
            });
        }


        const progress =
            await progressService
                .getLessonProgress(
                    req.user.id,
                    req.params.lessonId
                );


        return res.json({

            success: true,

            data: progress

        });

    } catch (error) {

        console.error(
            "GET LESSON PROGRESS ERROR:",
            error
        );

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// UPDATE LESSON PROGRESS
// =====================================================

const updateLessonProgress = async (
    req,
    res
) => {

    try {

        // -----------------------------------------
        // Chỉ student
        // -----------------------------------------

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể cập nhật tiến độ"
            });
        }


        const {
            watched_seconds,
            is_completed
        } = req.body;


        const progress =
            await progressService
                .updateLessonProgress({

                    studentId:
                        req.user.id,

                    lessonId:
                        req.params.lessonId,

                    watchedSeconds:
                        watched_seconds,

                    isCompleted:
                        is_completed

                });


        return res.json({

            success: true,

            message:
                "Cập nhật tiến độ thành công",

            data: progress

        });

    } catch (error) {

        console.error(
            "UPDATE LESSON PROGRESS ERROR:",
            error
        );

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// GET COURSE PROGRESS
// =====================================================

const getCourseProgress = async (
    req,
    res
) => {

    try {

        // -----------------------------------------
        // Chỉ student
        // -----------------------------------------

        if (req.user.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Chỉ học viên mới có thể xem tiến độ"
            });
        }


        const result =
            await progressService
                .getCourseProgress({

                    studentId:
                        req.user.id,

                    courseId:
                        req.params.courseId

                });


        return res.json({

            success: true,

            data: result

        });

    } catch (error) {

        console.error(
            "GET COURSE PROGRESS ERROR:",
            error
        );

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    getLessonProgress,

    updateLessonProgress,

    getCourseProgress

};