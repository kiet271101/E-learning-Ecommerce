const express = require("express");

const router =
    express.Router();


const lessonProgressController =
    require("../controllers/lessonProgressController");


const authMiddleware =
    require("../middleware/authMiddleware");


// =====================================================
// GET LESSON PROGRESS
// =====================================================

router.get(

    "/lesson/:lessonId",

    authMiddleware,

    lessonProgressController
        .getLessonProgress

);


// =====================================================
// UPDATE LESSON PROGRESS
// =====================================================

router.put(

    "/lesson/:lessonId",

    authMiddleware,

    lessonProgressController
        .updateLessonProgress

);


// =====================================================
// GET COURSE PROGRESS
// =====================================================

router.get(

    "/course/:courseId",

    authMiddleware,

    lessonProgressController
        .getCourseProgress

);


module.exports = router;