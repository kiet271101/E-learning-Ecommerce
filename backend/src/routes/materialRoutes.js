const express = require("express");

const router = express.Router();

const materialController = require("../controllers/materialController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadDocument } = require("../middleware/uploadMiddleware");

// ==========================================
// GET MATERIALS BY LESSON
// ==========================================

router.get(
    "/lesson/:lessonId",
    authMiddleware,
    materialController.getMaterialsByLesson
);

// ==========================================
// DOWNLOAD MATERIAL
// ==========================================

router.get(
    "/:id/download",
    authMiddleware,
    materialController.downloadMaterial
);

// ==========================================
// GET MATERIAL BY ID
// ==========================================

router.get(
    "/:id",
    authMiddleware,
    materialController.getMaterialById
);


// ==========================================
// UPLOAD MATERIAL
// ==========================================

router.post(
    "/lesson/:lessonId",
    authMiddleware,
    uploadDocument.single("file"),
    materialController.uploadMaterial
);

// ==========================================
// DELETE MATERIAL
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    materialController.deleteMaterial
);



module.exports = router;