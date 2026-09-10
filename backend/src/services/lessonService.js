const {
    LessonProgress,
    Lesson,
    Course,
    Enrollment
} = require("../models");


// =====================================================
// CHECK STUDENT ENROLLMENT
// =====================================================

const checkStudentEnrollment = async (
    studentId,
    courseId
) => {

    const enrollment =
        await Enrollment.findOne({
            where: {
                student_id: studentId,
                course_id: courseId,
                status: "active"
            }
        });

    return !!enrollment;
};


// =====================================================
// GET LESSON PROGRESS
// =====================================================

const getLessonProgress = async (
    studentId,
    lessonId
) => {

    const lesson =
        await Lesson.findByPk(lessonId);

    if (!lesson) {
        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    // -----------------------------------------
    // Kiểm tra học viên đã đăng ký khóa học
    // -----------------------------------------

    const isEnrolled =
        await checkStudentEnrollment(
            studentId,
            lesson.course_id
        );

    if (!isEnrolled) {
        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );
    }


    // -----------------------------------------
    // Tìm progress
    // -----------------------------------------

    let progress =
        await LessonProgress.findOne({
            where: {
                student_id: studentId,
                lesson_id: lessonId
            }
        });


    // -----------------------------------------
    // Nếu chưa có → tạo mới
    // -----------------------------------------

    if (!progress) {

        progress =
            await LessonProgress.create({
                student_id: studentId,
                lesson_id: lessonId,
                watched_seconds: 0,
                is_completed: false
            });
    }


    return progress;
};


// =====================================================
// UPDATE LESSON PROGRESS
// =====================================================

const updateLessonProgress = async ({
    studentId,
    lessonId,
    watchedSeconds,
    isCompleted
}) => {

    const lesson =
        await Lesson.findByPk(lessonId);

    if (!lesson) {
        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    // -----------------------------------------
    // Kiểm tra enrollment
    // -----------------------------------------

    const isEnrolled =
        await checkStudentEnrollment(
            studentId,
            lesson.course_id
        );

    if (!isEnrolled) {
        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );
    }


    // -----------------------------------------
    // Validate watched_seconds
    // -----------------------------------------

    if (
        watchedSeconds !== undefined &&
        (
            !Number.isInteger(
                Number(watchedSeconds)
            ) ||
            Number(watchedSeconds) < 0
        )
    ) {
        throw new Error(
            "watched_seconds không hợp lệ"
        );
    }


    // -----------------------------------------
    // Tìm hoặc tạo progress
    // -----------------------------------------

    let progress =
        await LessonProgress.findOne({
            where: {
                student_id: studentId,
                lesson_id: lessonId
            }
        });


    if (!progress) {

        progress =
            await LessonProgress.create({
                student_id: studentId,
                lesson_id: lessonId,
                watched_seconds:
                    Number(watchedSeconds || 0),
                is_completed:
                    Boolean(isCompleted),
                completed_at:
                    isCompleted
                        ? new Date()
                        : null
            });

    } else {

        const updateData = {};


        if (watchedSeconds !== undefined) {

            updateData.watched_seconds =
                Number(watchedSeconds);
        }


        if (isCompleted !== undefined) {

            updateData.is_completed =
                Boolean(isCompleted);


            if (Boolean(isCompleted)) {

                updateData.completed_at =
                    progress.completed_at ||
                    new Date();

            } else {

                updateData.completed_at =
                    null;
            }
        }


        await progress.update(
            updateData
        );
    }


    return progress;
};


// =====================================================
// GET COURSE PROGRESS
// =====================================================

const getCourseProgress = async ({
    studentId,
    courseId
}) => {

    // -----------------------------------------
    // Kiểm tra course
    // -----------------------------------------

    const course =
        await Course.findByPk(courseId);

    if (!course) {
        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    // -----------------------------------------
    // Kiểm tra enrollment
    // -----------------------------------------

    const isEnrolled =
        await checkStudentEnrollment(
            studentId,
            courseId
        );

    if (!isEnrolled) {
        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );
    }


    // -----------------------------------------
    // Lấy toàn bộ lesson
    // -----------------------------------------

    const lessons =
        await Lesson.findAll({
            where: {
                course_id: courseId
            },

            order: [
                ["lesson_order", "ASC"],
                ["id", "ASC"]
            ]
        });


    // -----------------------------------------
    // Lấy progress
    // -----------------------------------------

    const progressList =
        await LessonProgress.findAll({
            where: {
                student_id: studentId
            },

            include: [
                {
                    model: Lesson,
                    as: "lesson",

                    where: {
                        course_id: courseId
                    }
                }
            ]
        });


    // -----------------------------------------
    // Tính số bài hoàn thành
    // -----------------------------------------

    const totalLessons =
        lessons.length;

    const completedLessons =
        progressList.filter(
            progress =>
                progress.is_completed
        ).length;


    // -----------------------------------------
    // Tính %
    // -----------------------------------------

    const progressPercentage =
        totalLessons === 0
            ? 0
            : Math.round(
                (
                    completedLessons /
                    totalLessons
                ) * 100
            );


    return {

        courseId: courseId,

        totalLessons,

        completedLessons,

        progress: progressPercentage,

        lessons: lessons.map(
            lesson => {

                const progress =
                    progressList.find(
                        item =>
                            item.lesson_id ===
                            lesson.id
                    );


                return {

                    lessonId: lesson.id,

                    title: lesson.title,

                    lessonOrder:
                        lesson.lesson_order,

                    watchedSeconds:
                        progress
                            ? progress.watched_seconds
                            : 0,

                    isCompleted:
                        progress
                            ? progress.is_completed
                            : false,

                    completedAt:
                        progress
                            ? progress.completed_at
                            : null
                };
            }
        )
    };
};


module.exports = {

    getLessonProgress,

    updateLessonProgress,

    getCourseProgress

};