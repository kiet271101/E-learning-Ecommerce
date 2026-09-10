const {
    Enrollment,
    Course
} = require("../models");


// ==========================================
// ENROLL COURSE
// ==========================================

const enrollCourse = async ({
    studentId,
    courseId
}) => {

    // --------------------------------------
    // 1. Kiểm tra khóa học
    // --------------------------------------

    const course =
        await Course.findByPk(courseId);

    if (!course) {
        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    // --------------------------------------
    // 2. Không cho đăng ký khóa học chưa
    //    được publish
    // --------------------------------------

    if (course.status !== "published") {
        throw new Error(
            "Khóa học chưa được mở đăng ký"
        );
    }

    // ==========================================
    // KHÓA HỌC CÓ PHÍ PHẢI THANH TOÁN
    // ==========================================

    if (Number(course.price) > 0) {
        throw new Error(
            "Khóa học có phí. Vui lòng tạo đơn hàng và thanh toán trước."
        );
    }

    // --------------------------------------
    // 3. Kiểm tra đã đăng ký chưa
    // --------------------------------------

    const existingEnrollment =
        await Enrollment.findOne({

            where: {
                student_id: studentId,
                course_id: courseId
            }

        });


    // --------------------------------------
    // 4. Nếu đã active
    // --------------------------------------

    if (
        existingEnrollment &&
        existingEnrollment.status === "active"
    ) {

        throw new Error(
            "Bạn đã đăng ký khóa học này"
        );

    }


    // --------------------------------------
    // 5. Nếu từng cancelled
    //    → kích hoạt lại
    // --------------------------------------

    if (
        existingEnrollment &&
        existingEnrollment.status === "cancelled"
    ) {

        existingEnrollment.status = "active";

        existingEnrollment.enrolled_at =
            new Date();

        await existingEnrollment.save();

        return existingEnrollment;
    }


    // --------------------------------------
    // 6. Tạo Enrollment mới
    // --------------------------------------

    const enrollment =
        await Enrollment.create({

            student_id: studentId,

            course_id: courseId,

            enrolled_at: new Date(),

            status: "active"

        });


    return enrollment;
};


// ==========================================
// GET MY COURSES
// ==========================================

const getMyCourses = async (
    studentId
) => {

    const enrollments =
        await Enrollment.findAll({

            where: {
                student_id: studentId,
                status: "active"
            },

            include: [
                {
                    model: Course,
                    as: "course"
                }
            ],

            order: [
                ["enrolled_at", "DESC"]
            ]

        });


    return enrollments;
};


// ==========================================
// CHECK ENROLLMENT
// ==========================================

const checkEnrollment = async ({
    studentId,
    courseId
}) => {

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


// ==========================================
// CANCEL ENROLLMENT
// ==========================================

const cancelEnrollment = async ({
    studentId,
    courseId
}) => {

    const enrollment =
        await Enrollment.findOne({

            where: {
                student_id: studentId,

                course_id: courseId,

                status: "active"
            }

        });


    if (!enrollment) {

        throw new Error(
            "Bạn chưa đăng ký khóa học này"
        );

    }


    enrollment.status = "cancelled";

    await enrollment.save();


    return enrollment;
};


module.exports = {
    enrollCourse,
    getMyCourses,
    checkEnrollment,
    cancelEnrollment
};