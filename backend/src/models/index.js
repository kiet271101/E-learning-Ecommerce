const User = require("./User");
const Category = require("./Category");
const Course = require("./Course");
const Lesson = require("./Lesson");
const Material = require("./Material");
const Enrollment = require("./Enrollment");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const LessonProgress = require("./LessonProgress");
const PaymentTransaction = require("./PaymentTransaction");



// ==========================================
// USER - COURSE
// Teacher tạo nhiều Course
// ==========================================

User.hasMany(Course, {
    foreignKey: "teacher_id",
    as: "courses"
});

Course.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher"
});


// ==========================================
// CATEGORY - COURSE
// Category có nhiều Course
// ==========================================

Category.hasMany(Course, {
    foreignKey: "category_id",
    as: "courses"
});

Course.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category"
});


// ==========================================
// COURSE - LESSON
// ==========================================

Course.hasMany(Lesson, {
    foreignKey: "course_id",
    as: "lessons"
});

Lesson.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course"
});


// ==========================================
// LESSON - MATERIAL
// ==========================================

Lesson.hasMany(Material, {
    foreignKey: "lesson_id",
    as: "materials"
});

Material.belongsTo(Lesson, {
    foreignKey: "lesson_id",
    as: "lesson"
});


// ==========================================
// STUDENT - ENROLLMENT
// ==========================================

User.hasMany(Enrollment, {
    foreignKey: "student_id",
    as: "enrollments"
});

Enrollment.belongsTo(User, {
    foreignKey: "student_id",
    as: "student"
});


// ==========================================
// COURSE - ENROLLMENT
// ==========================================

Course.hasMany(Enrollment, {
    foreignKey: "course_id",
    as: "enrollments"
});

Enrollment.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course"
});


// ==========================================
// USER - ORDER
// ==========================================

User.hasMany(Order, {
    foreignKey: "user_id",
    as: "orders"
});

Order.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


// ==========================================
// ORDER - ORDER ITEM
// ==========================================

Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    as: "items"
});

OrderItem.belongsTo(Order, {
    foreignKey: "order_id",
    as: "order"
});


// ==========================================
// COURSE - ORDER ITEM
// ==========================================

Course.hasMany(OrderItem, {
    foreignKey: "course_id",
    as: "orderItems"
});

OrderItem.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course"
});


// ==========================================
// STUDENT - REVIEW
// ==========================================

User.hasMany(Review, {
    foreignKey: "student_id",
    as: "reviews"
});

Review.belongsTo(User, {
    foreignKey: "student_id",
    as: "student"
});


// ==========================================
// COURSE - REVIEW
// ==========================================

Course.hasMany(Review, {
    foreignKey: "course_id",
    as: "reviews"
});

Review.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course"
});


// ==========================================
// STUDENT - LESSON PROGRESS
// ==========================================

User.hasMany(LessonProgress, {
    foreignKey: "student_id",
    as: "progress"
});

LessonProgress.belongsTo(User, {
    foreignKey: "student_id",
    as: "student"
});


// ==========================================
// LESSON - LESSON PROGRESS
// ==========================================

Lesson.hasMany(LessonProgress, {
    foreignKey: "lesson_id",
    as: "progress"
});

LessonProgress.belongsTo(Lesson, {
    foreignKey: "lesson_id",
    as: "lesson"
});


Order.hasMany(PaymentTransaction, {
    foreignKey: "order_id",
    as: "transactions"
});

PaymentTransaction.belongsTo(Order, {
    foreignKey: "order_id",
    as: "order"
});


module.exports = {
    User,
    Category,
    Course,
    Lesson,
    Material,
    Enrollment,
    Order,
    OrderItem,
    Review,
    LessonProgress,
    PaymentTransaction
};