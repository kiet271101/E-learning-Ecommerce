import api from "./api";

// ==========================================
// GET MATERIALS OF LESSON
// ==========================================

const getMaterialsByLesson = async (lessonId) => {

    const response =
        await api.get(
            `/materials/lesson/${lessonId}`
        );

    return response.data;
};


// ==========================================
// DOWNLOAD MATERIAL
// ==========================================

const downloadMaterial = async (materialId) => {

    const response =
        await api.get(
            `/materials/${materialId}/download`,
            {
                responseType: "blob"
            }
        );

    return response;
};


export default {
    getMaterialsByLesson,
    downloadMaterial
};