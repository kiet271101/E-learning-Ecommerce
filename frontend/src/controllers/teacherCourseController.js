import courseService
    from "../services/courseService";


// ==========================================
// LOAD TEACHER COURSES
// ==========================================

export const loadTeacherCoursesController =
    async () => {

        try {

            return await courseService.getMyCourses();

        } catch (error) {

            console.error(
                "loadTeacherCoursesController error:",
                error
            );

            throw error;
        }
    };


// ==========================================
// GET TEACHER COURSE BY ID
// Bao gồm cả draft + published
// ==========================================

export const loadTeacherCourseController =
    async (courseId) => {

        try {

            return await courseService.getMyCourseById(
                courseId
            );

        } catch (error) {

            console.error(
                "loadTeacherCourseController error:",
                error
            );

            throw error;
        }
    };


// ==========================================
// CREATE COURSE
// ==========================================

export const createTeacherCourseController =
    async (courseData) => {

        try {

            return await courseService.createCourse(
                courseData
            );

        } catch (error) {

            console.error(
                "createTeacherCourseController error:",
                error
            );

            throw error;
        }
    };


// ==========================================
// UPDATE COURSE
// ==========================================

export const updateTeacherCourseController =
    async (
        courseId,
        courseData
    ) => {

        try {

            return await courseService.updateCourse(
                courseId,
                courseData
            );

        } catch (error) {

            console.error(
                "updateTeacherCourseController error:",
                error
            );

            throw error;
        }
    };


// ==========================================
// DELETE COURSE
// ==========================================

export const deleteTeacherCourseController =
    async (courseId) => {

        try {

            return await courseService.deleteCourse(
                courseId
            );

        } catch (error) {

            console.error(
                "deleteTeacherCourseController error:",
                error
            );

            throw error;
        }
    };