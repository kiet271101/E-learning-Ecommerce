const express = require("express");

const router = express.Router();

const orderController =
    require("../controllers/orderController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Tạo đơn hàng
router.post(
    "/",
    authMiddleware,
    orderController.createOrder
);


// Danh sách đơn hàng của tôi
router.get(
    "/my-orders",
    authMiddleware,
    orderController.getMyOrders
);


// Chi tiết đơn hàng
router.get(
    "/:id",
    authMiddleware,
    orderController.getOrderById
);


// Hủy đơn hàng
router.put(
    "/:id/cancel",
    authMiddleware,
    orderController.cancelOrder
);


// Giả lập thanh toán
router.post(
    "/:id/pay",
    authMiddleware,
    orderController.fakePayment
);


module.exports = router;