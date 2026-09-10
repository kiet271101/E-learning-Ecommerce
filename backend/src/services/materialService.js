const {
    Material,
    Lesson,
    Course
} = require("../models");

const {
    checkEnrollment
} = require("./enrollmentService");


// ==========================================
// GET MATERIALS BY LESSON
// ==========================================

const getMaterialsByLesson = async ({
    lessonId,
    user
}) => {

    // --------------------------------------
    // 1. Tìm Lesson + Course
    // --------------------------------------

    const lesson = await Lesson.findByPk(
        lessonId,
        {
            include: [
                {
                    model: Course,
                    as: "course"
                }
            ]
        }
    );


    // --------------------------------------
    // 2. Không tìm thấy Lesson
    // --------------------------------------

    if (!lesson) {

        throw new Error(
            "Không tìm thấy bài học"
        );

    }


    // --------------------------------------
    // 3. Admin được phép xem
    // --------------------------------------

    if (user.role === "admin") {

        return await Material.findAll({

            where: {
                lesson_id: lessonId
            },

            order: [
                ["id", "ASC"]
            ]

        });

    }


    // --------------------------------------
    // 4. Teacher sở hữu Course
    // --------------------------------------

    if (
        user.role === "teacher" &&
        lesson.course.teacher_id === user.id
    ) {

        return await Material.findAll({

            where: {
                lesson_id: lessonId
            },

            order: [
                ["id", "ASC"]
            ]

        });

    }


    // --------------------------------------
    // 5. Student phải Enrollment
    // --------------------------------------

    if (user.role !== "student") {

        throw new Error(
            "Bạn không có quyền xem tài liệu"
        );

    }


    const enrolled =
        await checkEnrollment({

            studentId: user.id,

            courseId: lesson.course_id

        });


    // --------------------------------------
    // 6. Chưa đăng ký
    // --------------------------------------

    if (!enrolled) {

        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );

    }


    // --------------------------------------
    // 7. Đã đăng ký
    // --------------------------------------

    return await Material.findAll({

        where: {
            lesson_id: lessonId
        },

        order: [
            ["id", "ASC"]
        ]

    });
};

// ==========================================
// GET MATERIAL BY ID
// ==========================================

const getMaterialById = async (materialId) => {

    const material =
        await Material.findByPk(
            materialId,
            {
                include: [
                    {
                        model: Lesson,
                        as: "lesson",
                        include: [
                            {
                                model: Course,
                                as: "course"
                            }
                        ]
                    }
                ]
            }
        );

    if (!material) {
        throw new Error(
            "Không tìm thấy tài liệu"
        );
    }

    return material;
};


// ==========================================
// CREATE MATERIAL
// ==========================================

const createMaterial = async ({
    lessonId,
    user,
    file
}) => {

    if (!file) {
        throw new Error(
            "Vui lòng chọn file tài liệu"
        );
    }

    const lesson =
        await Lesson.findByPk(lessonId, {
            include: [
                {
                    model: Course,
                    as: "course"
                }
            ]
        });

    if (!lesson) {
        throw new Error(
            "Không tìm thấy bài học"
        );
    }

    const course = lesson.course;

    // Admin được upload tất cả
    // Teacher chỉ được upload khóa học của mình

    if (
        user.role !== "admin" &&
        course.teacher_id !== user.id
    ) {

        throw new Error(
            "Bạn không có quyền upload tài liệu cho bài học này"
        );

    }

    const material =
        await Material.create({

            lesson_id: lessonId,

            name: file.originalname,

            file_url:
                `/uploads/documents/${file.filename}`,

            file_type: file.mimetype,

            file_size: file.size

        });

    return material;
};


// ==========================================
// DELETE MATERIAL
// ==========================================

const deleteMaterial = async (
    materialId,
    user
) => {

    const material =
        await Material.findByPk(
            materialId,
            {
                include: [
                    {
                        model: Lesson,
                        as: "lesson",
                        include: [
                            {
                                model: Course,
                                as: "course"
                            }
                        ]
                    }
                ]
            }
        );

    if (!material) {
        throw new Error(
            "Không tìm thấy tài liệu"
        );
    }

    const course =
        material.lesson.course;

    if (
        user.role !== "admin" &&
        course.teacher_id !== user.id
    ) {

        throw new Error(
            "Bạn không có quyền xóa tài liệu này"
        );

    }

    await material.destroy();

    return {
        message: "Xóa tài liệu thành công"
    };
};

const getMaterialDownloadAccess = async ({
    materialId,
    user
}) => {

    // --------------------------------------
    // 1. Tìm Material
    // --------------------------------------

    const material =
        await Material.findByPk(
            materialId,
            {
                include: [
                    {
                        model: Lesson,
                        as: "lesson",
                        include: [
                            {
                                model: Course,
                                as: "course"
                            }
                        ]
                    }
                ]
            }
        );


    // --------------------------------------
    // 2. Không tìm thấy
    // --------------------------------------

    if (!material) {

        throw new Error(
            "Không tìm thấy tài liệu"
        );

    }


    // --------------------------------------
    // 3. Admin được phép download
    // --------------------------------------

    if (user.role === "admin") {

        return material;

    }


    // --------------------------------------
    // 4. Teacher sở hữu Course được phép
    // --------------------------------------

    if (
        user.role === "teacher" &&
        material.lesson.course.teacher_id === user.id
    ) {

        return material;

    }


    // --------------------------------------
    // 5. Chỉ Student mới tiếp tục
    // --------------------------------------

    if (user.role !== "student") {

        throw new Error(
            "Bạn không có quyền tải tài liệu"
        );

    }


    // --------------------------------------
    // 6. Kiểm tra Enrollment
    // --------------------------------------

    const enrolled =
        await checkEnrollment({

            studentId: user.id,

            courseId:
                material.lesson.course_id

        });


    if (!enrolled) {

        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );

    }


    // --------------------------------------
    // 7. Cho phép download
    // --------------------------------------

    return material;
};


module.exports = {
    getMaterialsByLesson,
    getMaterialById,
    createMaterial,
    deleteMaterial,
    getMaterialDownloadAccess
};