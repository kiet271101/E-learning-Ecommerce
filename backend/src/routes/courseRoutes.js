const express = require("express");

const {

    getCourses,

    getMyCourses,

    getMyCourseById,

    getCourseById,

    createCourse,

    updateCourse,

    publishCourse,

    deleteCourse

} = require("../controllers/courseController");


const authMiddleware =
    require("../middleware/authMiddleware");


const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    uploadImage
} = require("../middleware/uploadMiddleware");

const router =
    express.Router();


// ==========================================
// PUBLIC
// ==========================================

// GET /api/courses
// Chỉ lấy course published

router.get(
    "/",
    getCourses
);


// ==========================================
// TEACHER - MY COURSES
// ==========================================

// GET /api/courses/my-courses
// Teacher xem course của mình
// Bao gồm draft + published

router.get(
    "/my-courses",
    authMiddleware,
    roleMiddleware(
        "teacher"
    ),
    getMyCourses
);


// ==========================================
// TEACHER - MY COURSE DETAIL
// ==========================================

// GET /api/courses/my-courses/:id
// Teacher xem chi tiết course của mình
// Bao gồm draft + published

router.get(
    "/my-courses/:id",
    authMiddleware,
    roleMiddleware(
        "teacher"
    ),
    getMyCourseById
);


// ==========================================
// PUBLIC - COURSE DETAIL
// ==========================================

// GET /api/courses/:id
// Chỉ xem course published

router.get(
    "/:id",
    getCourseById
);


// ==========================================
// TEACHER / ADMIN
// ==========================================

// POST /api/courses

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    uploadImage.single("thumbnail"),
    createCourse
);


// PUT /api/courses/:id

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    uploadImage.single("thumbnail"),
    updateCourse
);

// ==========================================
// PUBLISH COURSE
// ==========================================

// PATCH /api/courses/:id/publish

router.patch(
    "/:id/publish",
    authMiddleware,
    roleMiddleware(
        "teacher",
        "admin"
    ),
    publishCourse
);


// DELETE /api/courses/:id

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