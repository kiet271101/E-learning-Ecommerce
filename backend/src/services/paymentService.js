const {
    Order,
    OrderItem,
    Enrollment,
    PaymentTransaction
} = require("../models");


// =====================================================
// XỬ LÝ THANH TOÁN THÀNH CÔNG
// =====================================================

const processPaymentSuccess = async ({
    orderId,
    userId,
    transactionCode = null
}) => {

    const order = await Order.findOne({
        where: {
            id: orderId,
            user_id: userId
        },

        include: [
            {
                model: OrderItem,
                as: "items"
            }
        ]
    });

    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.order_status === "cancelled") {
        throw new Error("Đơn hàng đã bị hủy");
    }

    if (order.payment_status === "paid") {
        throw new Error("Đơn hàng đã được thanh toán");
    }


    // ==========================================
    // CẬP NHẬT ORDER
    // ==========================================

    await order.update({
        payment_status: "paid",
        order_status: "completed"
    });

    await PaymentTransaction.create({
        order_id: order.id,
        transaction_code: transactionCode,
        provider: transactionCode?.startsWith("FAKE_")
            ? "fake"
            : "vnpay",
        amount: order.total_amount,
        status: "success",
        response_code: "00",
        paid_at: new Date()
    });


    // ==========================================
    // TỰ ĐỘNG ENROLLMENT
    // ==========================================

    for (const item of order.items) {

        const existingEnrollment =
            await Enrollment.findOne({
                where: {
                    student_id: userId,
                    course_id: item.course_id
                }
            });


        if (existingEnrollment) {

            await existingEnrollment.update({
                status: "active"
            });

        } else {

            await Enrollment.create({
                student_id: userId,
                course_id: item.course_id,
                status: "active"
            });

        }
    }


    return {
        orderId: order.id,
        paymentStatus: "paid",
        orderStatus: "completed",
        transactionCode
    };
};


// =====================================================
// THANH TOÁN THẤT BẠI
// =====================================================

const processPaymentFailed = async ({
    orderId,
    userId
}) => {

    const order = await Order.findOne({
        where: {
            id: orderId,
            user_id: userId
        }
    });

    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.payment_status === "paid") {
        throw new Error(
            "Đơn hàng đã thanh toán thành công"
        );
    }

    await order.update({
        payment_status: "failed"
    });

    return order;
};


module.exports = {
    processPaymentSuccess,
    processPaymentFailed
};