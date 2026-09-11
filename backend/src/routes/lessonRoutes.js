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
console.log("========== LESSON ROUTES DEBUG ==========");
console.log("getLessonsByCourse:", typeof getLessonsByCourse);
console.log("getLessonById:", typeof getLessonById);
console.log("createLesson:", typeof createLesson);
console.log("updateLesson:", typeof updateLesson);
console.log("deleteLesson:", typeof deleteLesson);
console.log("uploadLessonVideo:", typeof uploadLessonVideo);
console.log("streamVideo:", typeof streamVideo);
console.log("authMiddleware:", typeof authMiddleware);
console.log("roleMiddleware:", typeof roleMiddleware);
console.log("uploadVideo:", typeof uploadVideo);
console.log("==========================================");

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "lessonRoutes is working"
    });
});
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