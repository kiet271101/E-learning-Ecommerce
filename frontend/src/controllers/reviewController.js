import reviewService from "../services/reviewService";

// ==========================================
// LOAD REVIEWS
// ==========================================

export const loadReviewsController = async (courseId) => {
    try {
        const result = await reviewService.getReviewsByCourse(courseId);

        return result;
    } catch (error) {
        console.error(
            "loadReviewsController error:",
            error
        );

        throw error;
    }
};

// ==========================================
// CREATE REVIEW
// ==========================================

export const createReviewController = async (
    courseId,
    reviewData
) => {
    try {
        const result = await reviewService.createReview(
            courseId,
            reviewData
        );

        return result;
    } catch (error) {
        console.error(
            "createReviewController error:",
            error
        );

        throw error;
    }
};

// ==========================================
// UPDATE REVIEW
// ==========================================

export const updateReviewController = async (
    reviewId,
    reviewData
) => {
    try {
        const result = await reviewService.updateReview(
            reviewId,
            reviewData
        );

        return result;
    } catch (error) {
        console.error(
            "updateReviewController error:",
            error
        );

        throw error;
    }
};

// ==========================================
// DELETE REVIEW
// ==========================================

export const deleteReviewController = async (
    reviewId
) => {
    try {
        const result = await reviewService.deleteReview(
            reviewId
        );

        return result;
    } catch (error) {
        console.error(
            "deleteReviewController error:",
            error
        );

        throw error;
    }
};