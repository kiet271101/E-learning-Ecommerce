const express = require("express");

const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.get(
    "/",
    getCourses
);

router.get(
    "/:id",
    getCourseById
);


// ==========================================
// TEACHER / ADMIN
// ==========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    createCourse
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    updateCourse
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    deleteCourse
);


module.exports = router;