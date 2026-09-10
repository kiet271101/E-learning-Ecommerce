const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET REVIEWS
// Public
// ==========================================

router.get(
    "/course/:courseId",
    reviewController.getReviewsByCourse
);

// ==========================================
// CREATE REVIEW
// Student
// ==========================================

router.post(
    "/course/:courseId",
    authMiddleware,
    reviewController.createReview
);

// ==========================================
// UPDATE REVIEW
// Student - own review
// ==========================================

router.put(
    "/:id",
    authMiddleware,
    reviewController.updateReview
);

// ==========================================
// DELETE REVIEW
// Student - own review
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    reviewController.deleteReview
);

module.exports = router;