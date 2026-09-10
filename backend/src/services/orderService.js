const {
    Order,
    OrderItem,
    Course,
    Enrollment
} = require("../models");

const paymentService =
    require("./paymentService");


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async ({
    userId,
    courseIds,
    paymentMethod
}) => {

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một khóa học");
    }

    // Chỉ lấy khóa học đã published
    const courses = await Course.findAll({
        where: {
            id: courseIds,
            status: "published"
        }
    });

    if (courses.length !== courseIds.length) {
        throw new Error(
            "Một hoặc nhiều khóa học không tồn tại hoặc chưa được mở bán"
        );
    }

    // Kiểm tra học viên đã đăng ký khóa nào chưa
    const existingEnrollments = await Enrollment.findAll({
        where: {
            student_id: userId,
            course_id: courseIds,
            status: "active"
        }
    });

    if (existingEnrollments.length > 0) {

        const enrolledCourseIds =
            existingEnrollments.map(item => item.course_id);

        throw new Error(
            `Bạn đã đăng ký khóa học: ${enrolledCourseIds.join(", ")}`
        );
    }

    // Tính tổng tiền
    const totalAmount = courses.reduce(
        (total, course) =>
            total + Number(course.price || 0),
        0
    );

    // Tạo Order
    const order = await Order.create({
        user_id: userId,
        total_amount: totalAmount,
        payment_method: paymentMethod || "cash",
        payment_status: "pending",
        order_status: "pending"
    });

    // Tạo Order Items
    for (const course of courses) {

        await OrderItem.create({
            order_id: order.id,
            course_id: course.id,
            price: course.price,
            quantity: 1
        });

    }

    return getOrderById(order.id, userId);
};


// =====================================================
// GET ORDER BY ID
// =====================================================

const getOrderById = async (orderId, userId) => {

    const order = await Order.findOne({
        where: {
            id: orderId,
            user_id: userId
        },

        include: [
            {
                model: OrderItem,
                as: "items",

                include: [
                    {
                        model: Course,
                        as: "course"
                    }
                ]
            }
        ]
    });

    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    return order;
};


// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (userId) => {

    return await Order.findAll({

        where: {
            user_id: userId
        },

        include: [
            {
                model: OrderItem,
                as: "items",

                include: [
                    {
                        model: Course,
                        as: "course"
                    }
                ]
            }
        ],

        order: [
            ["id", "DESC"]
        ]
    });
};


// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (orderId, userId) => {

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
            "Không thể hủy đơn hàng đã thanh toán"
        );
    }

    if (order.order_status === "cancelled") {
        throw new Error(
            "Đơn hàng đã được hủy"
        );
    }

    await order.update({
        payment_status: "cancelled",
        order_status: "cancelled"
    });

    return order;
};


// =====================================================
// FAKE PAYMENT
// Dùng để test trước khi tích hợp MoMo/VNPay
// =====================================================

const fakePayment = async (orderId, userId) => {

    const result =
        await paymentService.processPaymentSuccess({
            orderId,
            userId,
            transactionCode: `FAKE_${Date.now()}`
        });

    return getOrderById(
        orderId,
        userId
    );
};


module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    cancelOrder,
    fakePayment
};