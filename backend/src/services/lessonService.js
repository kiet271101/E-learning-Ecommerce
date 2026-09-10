const {
    Lesson,
    Course,
    Enrollment
} = require("../models");

const path = require("path");
const fs = require("fs");


// =====================================================
// GET LESSONS BY COURSE
// =====================================================

const getLessonsByCourse = async (courseId) => {

    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new Error("Không tìm thấy khóa học");
    }

    const lessons = await Lesson.findAll({
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


// =====================================================
// GET LESSON BY ID
// =====================================================

const getLessonById = async (lessonId) => {

    const lesson = await Lesson.findByPk(lessonId);

    if (!lesson) {
        throw new Error("Không tìm thấy bài học");
    }

    return lesson;
};


// =====================================================
// CREATE LESSON
// =====================================================

const createLesson = async ({
    courseId,
    teacherId,
    title,
    description,
    lessonOrder,
    isPreview
}) => {

    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new Error("Không tìm thấy khóa học");
    }


    // -----------------------------------------
    // Kiểm tra quyền giáo viên
    // -----------------------------------------

    if (
        course.teacher_id !== teacherId
    ) {
        throw new Error(
            "Bạn không có quyền thêm bài học vào khóa học này"
        );
    }


    const lesson = await Lesson.create({

        course_id: courseId,

        title,

        description:
            description || null,

        lesson_order:
            lessonOrder || 1,

        is_preview:
            Boolean(isPreview)
    });


    return lesson;
};


// =====================================================
// UPDATE LESSON
// =====================================================

const updateLesson = async (
    lessonId,
    teacherId,
    data
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
        course.teacher_id !== teacherId
    ) {
        throw new Error(
            "Bạn không có quyền sửa bài học này"
        );
    }


    const updateData = {};


    if (data.title !== undefined) {
        updateData.title = data.title;
    }


    if (data.description !== undefined) {
        updateData.description =
            data.description;
    }


    if (data.lessonOrder !== undefined) {
        updateData.lesson_order =
            data.lessonOrder;
    }


    if (data.isPreview !== undefined) {
        updateData.is_preview =
            Boolean(data.isPreview);
    }


    await lesson.update(
        updateData
    );


    return lesson;
};


// =====================================================
// DELETE LESSON
// =====================================================

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
        course.teacher_id !== teacherId
    ) {
        throw new Error(
            "Bạn không có quyền xóa bài học này"
        );
    }


    await lesson.destroy();

    return true;
};


// =====================================================
// UPLOAD LESSON VIDEO
// =====================================================

const uploadLessonVideo = async (
    lessonId,
    teacherId,
    file
) => {

    const lesson =
        await Lesson.findByPk(
            lessonId
        );

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
        course.teacher_id !== teacherId
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


    // -----------------------------------------
    // Xóa video cũ nếu có
    // -----------------------------------------

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

        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }


    // -----------------------------------------
    // Lưu đường dẫn video
    // -----------------------------------------

    const videoUrl =
        `/uploads/videos/${file.filename}`;


    await lesson.update({
        video_url: videoUrl
    });


    return lesson;
};


// =====================================================
// CHECK VIDEO ACCESS
// =====================================================

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


    // -----------------------------------------
    // Admin
    // -----------------------------------------

    if (user.role === "admin") {
        return lesson;
    }


    // -----------------------------------------
    // Teacher
    // -----------------------------------------

    if (user.role === "teacher") {

        const course =
            await Course.findByPk(
                lesson.course_id
            );

        if (
            course &&
            course.teacher_id === user.id
        ) {
            return lesson;
        }
    }


    // -----------------------------------------
    // Preview lesson
    // -----------------------------------------

    if (lesson.is_preview) {
        return lesson;
    }


    // -----------------------------------------
    // Student phải đăng ký
    // -----------------------------------------

    const enrollment =
        await Enrollment.findOne({
            where: {
                student_id: user.id,
                course_id: lesson.course_id,
                status: "active"
            }
        });


    if (!enrollment) {
        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );
    }


    return lesson;
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getLessonsByCourse,

    getLessonById,

    createLesson,

    updateLesson,

    deleteLesson,

    uploadLessonVideo,

    getVideoAccess

};