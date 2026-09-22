const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

require("./models");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const materialRoutes = require("./routes/materialRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

// ==========================================
// UPLOADS
// ==========================================

const uploadFolder = path.join(__dirname, "../uploads");
const imageFolder = path.join(uploadFolder, "images");

// Kiểm tra thư mục upload
console.log("==========================================");
console.log("UPLOAD CONFIGURATION");
console.log("==========================================");

console.log("Upload folder:", uploadFolder);
console.log("Upload folder exists:", fs.existsSync(uploadFolder));

console.log("Image folder:", imageFolder);
console.log("Image folder exists:", fs.existsSync(imageFolder));

if (fs.existsSync(imageFolder)) {
    console.log("Images:", fs.readdirSync(imageFolder));
} else {
    console.log("Images: Folder does not exist");
}

// Cho phép truy cập các file trong thư mục uploads
app.use(
    "/uploads",
    express.static(uploadFolder)
);

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/progress", lessonProgressRoutes);

app.use("/api/reviews", reviewRoutes);

// ==========================================
// API TEST
// ==========================================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "E-learning E-commerce API is running!"
    });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("ERROR:", err);

    if (
        err.name === "PayloadTooLargeError" ||
        err.type === "entity.too.large"
    ) {
        return res.status(413).json({
            success: false,
            message: "Request quá lớn."
        });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            success: false,
            message: "File vượt quá dung lượng cho phép."
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

module.exports = app;