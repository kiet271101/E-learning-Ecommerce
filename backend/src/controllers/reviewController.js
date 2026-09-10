const reviewService = require("../services/reviewService");

// ==========================================
// CREATE
// ==========================================

const createReview = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Chỉ học viên mới được đánh giá khóa học"
            });
        }

        const review = await reviewService.createReview({
            studentId: req.user.id,
            courseId: req.params.courseId,
            rating: req.body.rating,
            comment: req.body.comment
        });

        res.status(201).json({
            message: "Đánh giá khóa học thành công",
            review
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};

// ==========================================
// GET BY COURSE
// ==========================================

const getReviewsByCourse = async (req, res) => {
    try {

        const result =
            await reviewService.getReviewsByCourse(
                req.params.courseId
            );

        res.status(200).json(result);

    } catch (error) {

        res.status(404).json({
            message: error.message
        });
    }
};

// ==========================================
// UPDATE
// ==========================================

const updateReview = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Chỉ học viên mới được sửa đánh giá"
            });
        }

        const review =
            await reviewService.updateReview({
                reviewId: req.params.id,
                studentId: req.user.id,
                rating: req.body.rating,
                comment: req.body.comment
            });

        res.status(200).json({
            message: "Cập nhật đánh giá thành công",
            review
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};

// ==========================================
// DELETE
// ==========================================

const deleteReview = async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Chỉ học viên mới được xóa đánh giá"
            });
        }

        const result =
            await reviewService.deleteReview({
                reviewId: req.params.id,
                studentId: req.user.id
            });

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createReview,
    getReviewsByCourse,
    updateReview,
    deleteReview
};