const orderService = require("../services/orderService");


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            courseIds,
            paymentMethod
        } = req.body;

        const order =
            await orderService.createOrder({
                userId,
                courseIds,
                paymentMethod
            });

        return res.status(201).json({
            success: true,
            message: "Tạo đơn hàng thành công",
            data: order
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {

    try {

        const orders =
            await orderService.getMyOrders(
                req.user.id
            );

        return res.json({
            success: true,
            data: orders
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET ORDER
// =====================================================

const getOrderById = async (req, res) => {

    try {

        const order =
            await orderService.getOrderById(
                req.params.id,
                req.user.id
            );

        return res.json({
            success: true,
            data: order
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// CANCEL
// =====================================================

const cancelOrder = async (req, res) => {

    try {

        const order =
            await orderService.cancelOrder(
                req.params.id,
                req.user.id
            );

        return res.json({
            success: true,
            message: "Hủy đơn hàng thành công",
            data: order
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// FAKE PAYMENT
// =====================================================

const fakePayment = async (req, res) => {

    try {

        const order =
            await orderService.fakePayment(
                req.params.id,
                req.user.id
            );

        return res.json({
            success: true,
            message:
                "Thanh toán thành công và đã đăng ký khóa học",
            data: order
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    fakePayment
};