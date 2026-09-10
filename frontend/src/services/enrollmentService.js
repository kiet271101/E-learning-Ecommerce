import api from "./api";

// ==========================================
// CHECK ENROLLMENT
// ==========================================

const checkEnrollment = async (courseId) => {

    const response = await api.get(
        `/enrollments/course/${courseId}/check`
    );

    return response.data;
};


// ==========================================
// ENROLL FREE COURSE
// ==========================================

const enrollCourse = async (courseId) => {

    const response = await api.post(
        `/enrollments/course/${courseId}`
    );

    return response.data;
};


// ==========================================
// GET MY COURSES
// ==========================================

const getMyCourses = async () => {

    const response =
        await api.get("/enrollments/my-courses");

    return response.data;
};


// ==========================================
// CANCEL ENROLLMENT
// ==========================================

const cancelEnrollment = async (courseId) => {

    const response = await api.delete(
        `/enrollments/course/${courseId}`
    );

    return response.data;
};


export default {
    checkEnrollment,
    enrollCourse,
    getMyCourses,
    cancelEnrollment
};