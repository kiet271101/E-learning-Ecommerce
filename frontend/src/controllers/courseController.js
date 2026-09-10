import courseService from "../services/courseService";

import Course from "../models/Course";

// ==========================================
// GET COURSES
// ==========================================

export const getCoursesController = async () => {

    try {

        const result =
            await courseService.getCourses();

        /*
         * Backend có thể trả:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * hoặc:
         *
         * {
         *   courses: [...]
         * }
         */

        const courseList =
            Array.isArray(result)
                ? result
                : result.courses || result.data || [];

        const courses =
            courseList.map(
                (course) => new Course(course)
            );

        return {
            success: true,
            data: courses
        };

    } catch (error) {

        console.error(
            "GET COURSES ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Không thể tải danh sách khóa học"
        };
    }
};


// ==========================================
// GET COURSE DETAIL
// ==========================================

export const getCourseByIdController =
    async (courseId) => {

        try {

            const result =
                await courseService.getCourseById(
                    courseId
                );

            const courseData =
                result.course ||
                result.data ||
                result;

            return {
                success: true,
                data: new Course(courseData)
            };

        } catch (error) {

            console.error(
                "GET COURSE ERROR:",
                error.response?.data || error
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Không thể tải khóa học"
            };
        }
    };