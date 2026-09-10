import lessonService from "../services/lessonService";
import materialService from "../services/materialService";
import progressService from "../services/progressService";


// ==========================================
// LOAD LESSONS
// ==========================================

export const loadLessonsController = async (courseId) => {

    try {

        const result =
            await lessonService.getLessonsByCourse(
                courseId
            );


        let data = [];


        if (Array.isArray(result)) {

            data = result;

        } else if (
            Array.isArray(result?.lessons)
        ) {

            data = result.lessons;

        } else if (
            Array.isArray(result?.data)
        ) {

            data = result.data;

        }


        return {
            success: true,
            data
        };

    } catch (error) {

        console.error(
            "loadLessonsController error:",
            error
        );


        return {
            success: false,
            data: [],
            message:
                error.response?.data?.message ||
                error.message ||
                "Không thể tải danh sách bài học."
        };

    }

};


// ==========================================
// LOAD MATERIALS
// ==========================================

export const loadMaterialsController = async (
    lessonId
) => {

    try {

        const result =
            await materialService.getMaterialsByLesson(
                lessonId
            );


        let data = [];


        if (Array.isArray(result)) {

            data = result;

        } else if (
            Array.isArray(result?.materials)
        ) {

            data = result.materials;

        } else if (
            Array.isArray(result?.data)
        ) {

            data = result.data;

        }


        return {
            success: true,
            data
        };

    } catch (error) {

        console.error(
            "loadMaterialsController error:",
            error
        );


        return {
            success: false,
            data: [],
            message:
                error.response?.data?.message ||
                error.message ||
                "Không thể tải tài liệu."
        };

    }

};


// ==========================================
// LOAD LESSON PROGRESS
// ==========================================

export const loadLessonProgressController = async (
    lessonId
) => {

    try {

        const result =
            await progressService.getLessonProgress(
                lessonId
            );


        return {
            success: true,
            data:
                result?.data ??
                result
        };

    } catch (error) {

        console.error(
            "loadLessonProgressController error:",
            error
        );


        return {
            success: false,
            data: null,
            message:
                error.response?.data?.message ||
                error.message ||
                "Không thể tải tiến độ bài học."
        };

    }

};


// ==========================================
// UPDATE PROGRESS
// ==========================================

export const updateProgressController = async (
    lessonId,
    watchedSeconds,
    isCompleted
) => {

    try {

        const result =
            await progressService.updateLessonProgress(
                lessonId,
                {
                    watched_seconds:
                        Math.floor(
                            watchedSeconds
                        ),

                    is_completed:
                        Boolean(isCompleted)
                }
            );


        return {
            success: true,
            data:
                result?.data ??
                result
        };

    } catch (error) {

        console.error(
            "updateProgressController error:",
            error
        );


        return {
            success: false,
            data: null,
            message:
                error.response?.data?.message ||
                error.message ||
                "Không thể lưu tiến độ."
        };

    }

};


// ==========================================
// LOAD COURSE PROGRESS
// ==========================================

export const loadCourseProgressController = async (
    courseId
) => {

    try {

        const result =
            await progressService.getCourseProgress(
                courseId
            );


        return {
            success: true,
            data:
                result?.data ??
                result
        };

    } catch (error) {

        console.error(
            "loadCourseProgressController error:",
            error
        );


        return {
            success: false,
            data: null,
            message:
                error.response?.data?.message ||
                error.message ||
                "Không thể tải tiến độ khóa học."
        };

    }

};