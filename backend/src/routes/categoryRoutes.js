const express = require("express");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const router = express.Router();


// Public

router.get(
    "/",
    getAllCategories
);

router.get(
    "/:id",
    getCategoryById
);


// Admin only

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCategory
);


module.exports = router;