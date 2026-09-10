const paymentService =
    require("../services/paymentService");


// =====================================================
// PAYMENT SUCCESS
// =====================================================

const paymentSuccess = async (req, res) => {

    try {

        const result =
            await paymentService.processPaymentSuccess({
                orderId: req.params.orderId,
                userId: req.user.id,
                transactionCode:
                    req.body.transactionCode || null
            });

        return res.json({
            success: true,
            message: "Thanh toán thành công",
            data: result
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
// PAYMENT FAILED
// =====================================================

const paymentFailed = async (req, res) => {

    try {

        const result =
            await paymentService.processPaymentFailed({
                orderId: req.params.orderId,
                userId: req.user.id
            });

        return res.json({
            success: true,
            message: "Thanh toán thất bại",
            data: result
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
    paymentSuccess,
    paymentFailed
};