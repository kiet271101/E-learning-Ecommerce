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
// GET MATERIAL BY ID
// ==========================================

const getMaterialById = async (materialId) => {

    const response =
        await api.get(
            `/materials/${materialId}`
        );

    return response.data;
};


// ==========================================
// UPLOAD MATERIAL
// ==========================================

const uploadMaterial = async (lessonId, file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response =
        await api.post(
            `/materials/lesson/${lessonId}`,
            formData
        );

    return response.data;
};


// ==========================================
// DELETE MATERIAL
// ==========================================

const deleteMaterial = async (materialId) => {

    const response =
        await api.delete(
            `/materials/${materialId}`
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
    getMaterialById,

    uploadMaterial,
    deleteMaterial,

    downloadMaterial

};