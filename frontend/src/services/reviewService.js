import api from "./api";

const getReviewsByCourse = async (courseId) => {

    const response =
        await api.get(`/reviews/course/${courseId}`);

    return response.data;
};

const createReview = async (
    courseId,
    data
) => {

    const response =
        await api.post(
            `/reviews/course/${courseId}`,
            data
        );

    return response.data;
};

const updateReview = async (
    reviewId,
    data
) => {

    const response =
        await api.put(
            `/reviews/${reviewId}`,
            data
        );

    return response.data;
};

const deleteReview = async (reviewId) => {

    const response =
        await api.delete(
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