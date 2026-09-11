import lessonService from "../services/lessonService";
import materialService from "../services/materialService";

// ==========================================
// LESSON
// ==========================================

export const loadTeacherLessonsController = async (courseId) => {

    try {

        return await lessonService.getLessonsByCourse(courseId);

    } catch (error) {

        console.error(
            "loadTeacherLessonsController error:",
            error
        );

        throw error;
    }
};


export const createTeacherLessonController = async (
    courseId,
    lessonData
) => {

    try {

        return await lessonService.createLesson(
            courseId,
            lessonData
        );

    } catch (error) {

        console.error(
            "createTeacherLessonController error:",
            error
        );

        throw error;
    }
};


export const updateTeacherLessonController = async (
    lessonId,
    lessonData
) => {

    try {

        return await lessonService.updateLesson(
            lessonId,
            lessonData
        );

    } catch (error) {

        console.error(
            "updateTeacherLessonController error:",
            error
        );

        throw error;
    }
};


export const deleteTeacherLessonController = async (
    lessonId
) => {

    try {

        return await lessonService.deleteLesson(
            lessonId
        );

    } catch (error) {

        console.error(
            "deleteTeacherLessonController error:",
            error
        );

        throw error;
    }
};


export const uploadTeacherLessonVideoController = async (
    lessonId,
    videoFile
) => {

    try {

        return await lessonService.uploadLessonVideo(
            lessonId,
            videoFile
        );

    } catch (error) {

        console.error(
            "uploadTeacherLessonVideoController error:",
            error
        );

        throw error;
    }
};


// ==========================================
// MATERIAL
// ==========================================

export const loadTeacherMaterialsController = async (
    lessonId
) => {

    try {

        return await materialService.getMaterialsByLesson(
            lessonId
        );

    } catch (error) {

        console.error(
            "loadTeacherMaterialsController error:",
            error
        );

        throw error;
    }
};


export const uploadTeacherMaterialController = async (
    lessonId,
    file
) => {

    try {

        return await materialService.uploadMaterial(
            lessonId,
            file
        );

    } catch (error) {

        console.error(
            "uploadTeacherMaterialController error:",
            error
        );

        throw error;
    }
};


export const deleteTeacherMaterialController = async (
    materialId
) => {

    try {

        return await materialService.deleteMaterial(
            materialId
        );

    } catch (error) {

        console.error(
            "deleteTeacherMaterialController error:",
            error
        );

        throw error;
    }
};