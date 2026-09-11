const {
    Lesson,
    Course,
    Enrollment
} = require("../models");

const path = require("path");
const fs = require("fs");


// ==========================================
// GET LESSONS BY COURSE
// ==========================================

const getLessonsByCourse = async (courseId) => {

    const course =
        await Course.findByPk(courseId);

    if (!course) {
        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


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


    return lessons;
};


// ==========================================
// GET LESSON BY ID
// ==========================================

const getLessonById = async (lessonId) => {

    const lesson =
        await Lesson.findByPk(lessonId);


    if (!lesson) {
        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    return lesson;
};


// ==========================================
// CREATE LESSON
// ==========================================

const createLesson = async ({
    courseId,
    teacherId,
    title,
    description,
    duration,
    lessonOrder,
    isPreview
}) => {

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course =
        await Course.findByPk(courseId);


    if (!course) {
        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    // ==========================================
    // CHECK TEACHER
    // ==========================================

    if (
        Number(course.teacher_id) !==
        Number(teacherId)
    ) {

        throw new Error(
            "Bạn không có quyền thêm bài học vào khóa học này"
        );
    }


    // ==========================================
    // CREATE
    // ==========================================

    const lesson =
        await Lesson.create({

            course_id:
                Number(courseId),

            title:

                title,

            description:

                description || null,

            duration:

                duration !== undefined &&
                duration !== null &&
                duration !== ""
                    ? Number(duration)
                    : 0,

            lesson_order:

                lessonOrder !== undefined &&
                lessonOrder !== null &&
                lessonOrder !== ""
                    ? Number(lessonOrder)
                    : 1,

            is_preview:

                isPreview === true ||
                isPreview === "true" ||
                isPreview === 1 ||
                isPreview === "1"
        });


    return lesson;
};


// ==========================================
// UPDATE LESSON
// ==========================================

const updateLesson = async (
    lessonId,
    teacherId,
    data
) => {

    // ==========================================
    // FIND LESSON
    // ==========================================

    const lesson =
        await Lesson.findByPk(lessonId);


    if (!lesson) {

        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    // ==========================================
    // FIND COURSE
    // ==========================================

    const course =
        await Course.findByPk(
            lesson.course_id
        );


    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    // ==========================================
    // CHECK TEACHER
    // ==========================================

    if (
        Number(course.teacher_id) !==
        Number(teacherId)
    ) {

        throw new Error(
            "Bạn không có quyền sửa bài học này"
        );
    }


    // ==========================================
    // UPDATE DATA
    // ==========================================

    const updateData = {};


    // TITLE

    if (
        data.title !== undefined
    ) {

        updateData.title =
            data.title;
    }


    // DESCRIPTION

    if (
        data.description !== undefined
    ) {

        updateData.description =
            data.description;
    }


    // DURATION

    if (
        data.duration !== undefined
    ) {

        updateData.duration =
            Number(data.duration);
    }


    // LESSON ORDER

    if (
        data.lesson_order !== undefined
    ) {

        updateData.lesson_order =
            Number(data.lesson_order);
    }


    // IS PREVIEW

    if (
        data.is_preview !== undefined
    ) {

        updateData.is_preview =
            data.is_preview === true ||
            data.is_preview === "true" ||
            data.is_preview === 1 ||
            data.is_preview === "1";
    }


    // ==========================================
    // SAVE
    // ==========================================

    await lesson.update(
        updateData
    );


    return lesson;
};


// ==========================================
// DELETE LESSON
// ==========================================

const deleteLesson = async (
    lessonId,
    teacherId
) => {

    const lesson =
        await Lesson.findByPk(lessonId);


    if (!lesson) {

        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    const course =
        await Course.findByPk(
            lesson.course_id
        );


    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    if (
        Number(course.teacher_id) !==
        Number(teacherId)
    ) {

        throw new Error(
            "Bạn không có quyền xóa bài học này"
        );
    }


    await lesson.destroy();


    return true;
};


// ==========================================
// UPLOAD VIDEO
// ==========================================

const uploadLessonVideo = async (
    lessonId,
    teacherId,
    file
) => {

    const lesson =
        await Lesson.findByPk(lessonId);


    if (!lesson) {

        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    const course =
        await Course.findByPk(
            lesson.course_id
        );


    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    if (
        Number(course.teacher_id) !==
        Number(teacherId)
    ) {

        throw new Error(
            "Bạn không có quyền upload video"
        );
    }


    if (!file) {

        throw new Error(
            "Vui lòng chọn file video"
        );
    }


    // ==========================================
    // DELETE OLD VIDEO
    // ==========================================

    if (lesson.video_url) {

        const oldFilename =
            path.basename(
                lesson.video_url
            );


        const oldPath =
            path.join(
                process.cwd(),
                "uploads",
                "videos",
                oldFilename
            );


        if (
            fs.existsSync(oldPath)
        ) {

            fs.unlinkSync(
                oldPath
            );
        }
    }


    // ==========================================
    // SAVE VIDEO URL
    // ==========================================

    const videoUrl =
        `/uploads/videos/${file.filename}`;


    await lesson.update({

        video_url:
            videoUrl
    });


    return lesson;
};


// ==========================================
// VIDEO ACCESS
// ==========================================

const getVideoAccess = async ({
    lessonId,
    user
}) => {

    const lesson =
        await Lesson.findByPk(
            lessonId
        );


    if (!lesson) {

        throw new Error(
            "Không tìm thấy bài học"
        );
    }


    if (!lesson.video_url) {

        throw new Error(
            "Bài học chưa có video"
        );
    }


    // ADMIN

    if (
        user.role === "admin"
    ) {

        return lesson;
    }


    // TEACHER

    if (
        user.role === "teacher"
    ) {

        const course =
            await Course.findByPk(
                lesson.course_id
            );


        if (
            course &&
            Number(course.teacher_id) ===
            Number(user.id)
        ) {

            return lesson;
        }
    }


    // PREVIEW LESSON

    if (
        lesson.is_preview
    ) {

        return lesson;
    }


    // CHECK ENROLLMENT

    const enrollment =
        await Enrollment.findOne({

            where: {

                student_id:
                    user.id,

                course_id:
                    lesson.course_id,

                status:
                    "active"
            }
        });


    if (!enrollment) {

        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );
    }


    return lesson;
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

    getVideoAccess
};