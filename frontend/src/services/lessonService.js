import api from "./api";

const getLessonsByCourse = async (courseId) => {

    const response =
        await api.get(`/lessons/course/${courseId}`);

    return response.data;
};

const getLessonById = async (lessonId) => {

    const response =
        await api.get(`/lessons/${lessonId}`);

    return response.data;
};

export default {
    getLessonsByCourse,
    getLessonById
};