import api from "./api";


// ==========================================
// GET LESSON PROGRESS
// ==========================================

const getLessonProgress = async (lessonId) => {

    const response =
        await api.get(
            `/progress/lesson/${lessonId}`
        );

    return response.data;
};


// ==========================================
// UPDATE LESSON PROGRESS
// ==========================================

const updateLessonProgress = async (
    lessonId,
    data
) => {

    const response =
        await api.put(
            `/progress/lesson/${lessonId}`,
            data
        );

    return response.data;
};


// ==========================================
// GET COURSE PROGRESS
// ==========================================

const getCourseProgress = async (courseId) => {

    const response =
        await api.get(
            `/progress/course/${courseId}`
        );

    return response.data;
};


export default {
    getLessonProgress,
    updateLessonProgress,
    getCourseProgress
};