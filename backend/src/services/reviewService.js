const { Review, Course, Enrollment, User } = require("../models");

// ==========================================
// VALIDATE RATING
// ==========================================

const validateRating = (rating) => {
    const value = Number(rating);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error("Rating phải là số nguyên từ 1 đến 5");
    }

    return value;
};

// ==========================================
// CREATE REVIEW
// ==========================================

const createReview = async ({
    studentId,
    courseId,
    rating,
    comment
}) => {

    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new Error("Không tìm thấy khóa học");
    }

    // Kiểm tra học viên đã đăng ký khóa học
    const enrollment = await Enrollment.findOne({
        where: {
            student_id: studentId,
            course_id: courseId,
            status: "active"
        }
    });

    if (!enrollment) {
        throw new Error(
            "Bạn chưa đăng ký khóa học này nên không thể đánh giá"
        );
    }

    // Kiểm tra đã review chưa
    const existingReview = await Review.findOne({
        where: {
            student_id: studentId,
            course_id: courseId
        }
    });

    if (existingReview) {
        throw new Error(
            "Bạn đã đánh giá khóa học này rồi"
        );
    }

    const validRating = validateRating(rating);

    const review = await Review.create({
        student_id: studentId,
        course_id: courseId,
        rating: validRating,
        comment: comment ? comment.trim() : null
    });

    return review;
};

// ==========================================
// GET REVIEWS BY COURSE
// ==========================================

const getReviewsByCourse = async (courseId) => {

    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new Error("Không tìm thấy khóa học");
    }

    const reviews = await Review.findAll({
        where: {
            course_id: courseId
        },

        include: [
            {
                model: User,
                as: "student",
                attributes: [
                    "id",
                    "name",
                    "avatar"
                ]
            }
        ],

        order: [
            ["created_at", "DESC"]
        ]
    });

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews > 0
            ? reviews.reduce(
                (sum, review) =>
                    sum + Number(review.rating),
                0
            ) / totalReviews
            : 0;

    return {
        courseId: Number(courseId),
        totalReviews,
        averageRating: Number(averageRating.toFixed(2)),
        reviews
    };
};

// ==========================================
// UPDATE REVIEW
// ==========================================

const updateReview = async ({
    reviewId,
    studentId,
    rating,
    comment
}) => {

    const review = await Review.findOne({
        where: {
            id: reviewId,
            student_id: studentId
        }
    });

    if (!review) {
        throw new Error(
            "Không tìm thấy đánh giá hoặc bạn không có quyền sửa"
        );
    }

    const validRating = validateRating(rating);

    await review.update({
        rating: validRating,
        comment: comment ? comment.trim() : null
    });

    return review;
};

// ==========================================
// DELETE REVIEW
// ==========================================

const deleteReview = async ({
    reviewId,
    studentId
}) => {

    const review = await Review.findOne({
        where: {
            id: reviewId,
            student_id: studentId
        }
    });

    if (!review) {
        throw new Error(
            "Không tìm thấy đánh giá hoặc bạn không có quyền xóa"
        );
    }

    await review.destroy();

    return {
        message: "Xóa đánh giá thành công"
    };
};

module.exports = {
    createReview,
    getReviewsByCourse,
    updateReview,
    deleteReview
};