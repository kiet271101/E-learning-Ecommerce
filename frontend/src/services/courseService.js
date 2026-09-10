import api from "./api";

const getCourses = async () => {

    const response = await api.get("/courses");

    return response.data;
};

const getCourseById = async (courseId) => {

    const response =
        await api.get(`/courses/${courseId}`);

    return response.data;
};

export default {
    getCourses,
    getCourseById
};