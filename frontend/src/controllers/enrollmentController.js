import enrollmentService
    from "../services/enrollmentService";


// ==========================================
// CHECK ENROLLMENT
// ==========================================

export const checkEnrollmentController =
    async (courseId) => {

        try {

            const result =
                await enrollmentService.checkEnrollment(
                    courseId
                );

            return {
                success: true,
                data: result
            };

        } catch (error) {

            console.error(
                "CHECK ENROLLMENT ERROR:",
                error.response?.data || error
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Không thể kiểm tra trạng thái đăng ký"
            };
        }
    };


// ==========================================
// ENROLL COURSE
// ==========================================

export const enrollCourseController =
    async (courseId) => {

        try {

            const result =
                await enrollmentService.enrollCourse(
                    courseId
                );

            return {
                success: true,
                data: result
            };

        } catch (error) {

            console.error(
                "ENROLL COURSE ERROR:",
                error.response?.data || error
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Đăng ký khóa học thất bại"
            };
        }
    };


// ==========================================
// MY COURSES
// ==========================================

export const getMyCoursesController =
    async () => {

        try {

            const result =
                await enrollmentService.getMyCourses();

            return {
                success: true,
                data: result
            };

        } catch (error) {

            console.error(
                "MY COURSES ERROR:",
                error.response?.data || error
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Không thể tải khóa học của bạn"
            };
        }
    };