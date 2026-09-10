const express = require("express");

const router = express.Router();

const paymentController =
    require("../controllers/paymentController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Thanh toán thành công
router.post(
    "/:orderId/success",
    authMiddleware,
    paymentController.paymentSuccess
);


// Thanh toán thất bại
router.post(
    "/:orderId/failed",
    authMiddleware,
    paymentController.paymentFailed
);


module.exports = router;