import courseService
    from "../services/courseService";

import lessonService
    from "../services/lessonService";

import reviewService
    from "../services/reviewService";

// ==========================================
// COURSE
// ==========================================

export const loadCourseDetail = async (courseId) => {

    try {

        const result =
            await courseService.getCourseById(
                courseId
            );

        const course =
            result.course ||
            result.data ||
            result;

        return {
            success: true,
            data: course
        };

    } catch (error) {

        console.error(
            "COURSE DETAIL ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Không thể tải thông tin khóa học"
        };
    }
};


// ==========================================
// LESSONS
// ==========================================

export const loadCourseLessons = async (
    courseId
) => {

    try {

        const result =
            await lessonService.getLessonsByCourse(
                courseId
            );

        const lessons =
            Array.isArray(result)
                ? result
                : result.lessons ||
                  result.data ||
                  [];

        return {
            success: true,
            data: lessons
        };

    } catch (error) {

        console.error(
            "LESSONS ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Không thể tải danh sách bài học"
        };
    }
};


// ==========================================
// REVIEWS
// ==========================================

export const loadCourseReviews = async (
    courseId
) => {

    try {

        const result =
            await reviewService.getReviewsByCourse(
                courseId
            );

        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "REVIEWS ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Không thể tải đánh giá"
        };
    }
};