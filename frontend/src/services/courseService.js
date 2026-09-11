import api from "./api";

// ==========================================
// GET ALL COURSES
// ==========================================

const getCourses = async () => {

    const response =
        await api.get("/courses");

    return response.data;
};

const getMyCourses = async () => {

    const response =
        await api.get("/courses/my-courses");

    return response.data;
};

const getMyCourseById = async (courseId) => {

    const response =
        await api.get(
            `/courses/my-courses/${courseId}`
        );

    return response.data;
};


// ==========================================
// GET COURSE BY ID
// ==========================================

const getCourseById = async (courseId) => {

    const response =
        await api.get(`/courses/${courseId}`);

    return response.data;
};


// ==========================================
// CREATE COURSE
// ==========================================

const createCourse = async (courseData) => {

    const response =
        await api.post(
            "/courses",
            courseData
        );

    return response.data;
};


// ==========================================
// UPDATE COURSE
// ==========================================

const updateCourse = async (
    courseId,
    courseData
) => {

    const response =
        await api.put(
            `/courses/${courseId}`,
            courseData
        );

    return response.data;
};


// ==========================================
// DELETE COURSE
// ==========================================

const deleteCourse = async (courseId) => {

    const response =
        await api.delete(
            `/courses/${courseId}`
        );

    return response.data;
};


export default {

    getCourses,
    getMyCourses,
    getMyCourseById,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse

};