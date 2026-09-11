import api from "./api";

// ==========================================
// GET REVIEWS BY COURSE
// ==========================================

const getReviewsByCourse = async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);

    return response.data;
};

// ==========================================
// CREATE REVIEW
// ==========================================

const createReview = async (courseId, reviewData) => {
    const response = await api.post(
        `/reviews/course/${courseId}`,
        reviewData
    );

    return response.data;
};

// ==========================================
// UPDATE REVIEW
// ==========================================

const updateReview = async (reviewId, reviewData) => {
    const response = await api.put(
        `/reviews/${reviewId}`,
        reviewData
    );

    return response.data;
};

// ==========================================
// DELETE REVIEW
// ==========================================

const deleteReview = async (reviewId) => {
    const response = await api.delete(
        `/reviews/${reviewId}`
    );

    return response.data;
};

export default {
    getReviewsByCourse,
    createReview,
    updateReview,
    deleteReview
};