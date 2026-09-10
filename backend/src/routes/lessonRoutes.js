const express = require("express");

const {
    getLessonsByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    uploadLessonVideo,
    streamVideo
} = require("../controllers/lessonController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    uploadVideo
} = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

// GET lessons của course

router.get(
    "/course/:courseId",
    getLessonsByCourse
);


// GET lesson

router.get(
    "/:id",
    getLessonById
);


// ==========================================
// TEACHER
// ==========================================

// CREATE lesson

router.post(
    "/course/:courseId",

    authMiddleware,

    roleMiddleware(
        "teacher",
        "admin"
    ),

    createLesson
);


// UPDATE lesson

router.put(
    "/:id",

    authMiddleware,

    roleMiddleware(
        "teacher",
        "admin"
    ),

    updateLesson
);


// DELETE lesson

router.delete(
    "/:id",

    authMiddleware,

    roleMiddleware(
        "teacher",
        "admin"
    ),

    deleteLesson
);


// ==========================================
// UPLOAD VIDEO
// ==========================================

router.post(
    "/:id/video",

    authMiddleware,

    roleMiddleware(
        "teacher",
        "admin"
    ),

    uploadVideo.single("video"),

    uploadLessonVideo
);

router.get(
    "/:id/video",
    authMiddleware,
    streamVideo
);

module.exports = router;