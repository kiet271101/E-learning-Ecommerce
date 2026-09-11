import api from "./api";

// ==========================================
// GET LESSONS OF COURSE
// ==========================================

const getLessonsByCourse = async (courseId) => {

    const response =
        await api.get(`/lessons/course/${courseId}`);

    return response.data;
};


// ==========================================
// GET LESSON BY ID
// ==========================================

const getLessonById = async (lessonId) => {

    const response =
        await api.get(`/lessons/${lessonId}`);

    return response.data;
};


// ==========================================
// CREATE LESSON
// ==========================================

const createLesson = async (courseId, lessonData) => {

    const response =
        await api.post(
            `/lessons/course/${courseId}`,
            lessonData
        );

    return response.data;
};


// ==========================================
// UPDATE LESSON
// ==========================================

const updateLesson = async (lessonId, lessonData) => {

    const response =
        await api.put(
            `/lessons/${lessonId}`,
            lessonData
        );

    return response.data;
};


// ==========================================
// DELETE LESSON
// ==========================================

const deleteLesson = async (lessonId) => {

    const response =
        await api.delete(
            `/lessons/${lessonId}`
        );

    return response.data;
};


// ==========================================
// UPLOAD VIDEO
// ==========================================

const uploadLessonVideo = async (
    lessonId,
    videoFile
) => {

    const formData = new FormData();

    formData.append(
        "video",
        videoFile
    );

    const response =
        await api.post(
            `/lessons/${lessonId}/video`,
            formData
        );

    return response.data;
};


export default {

    getLessonsByCourse,
    getLessonById,

    createLesson,
    updateLesson,
    deleteLesson,

    uploadLessonVideo

};