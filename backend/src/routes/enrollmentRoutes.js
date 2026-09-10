const express = require("express");

const router = express.Router();

const enrollmentController =
    require("../controllers/enrollmentController");

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// ĐĂNG KÝ KHÓA HỌC
// ==========================================

router.post(
    "/course/:courseId",
    authMiddleware,
    enrollmentController.enrollCourse
);


// ==========================================
// KHÓA HỌC CỦA TÔI
// ==========================================

router.get(
    "/my-courses",
    authMiddleware,
    enrollmentController.getMyCourses
);


// ==========================================
// KIỂM TRA ĐÃ ĐĂNG KÝ
// ==========================================

router.get(
    "/course/:courseId/check",
    authMiddleware,
    enrollmentController.checkEnrollment
);


// ==========================================
// HỦY ĐĂNG KÝ
// ==========================================

router.delete(
    "/course/:courseId",
    authMiddleware,
    enrollmentController.cancelEnrollment
);


module.exports = router;