const express = require("express");

const {
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);


// ==========================================
// PROTECTED
// ==========================================

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


module.exports = router;