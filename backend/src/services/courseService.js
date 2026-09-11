const {
    Course,
    User,
    Category,
    Lesson
} = require("../models");


// ==========================================
// GET COURSES
// Search + Filter + Pagination + Sort
// ==========================================

const getCourses = async ({
    page = 1,
    limit = 10,
    search,
    category_id,
    min_price,
    max_price,
    sort = "newest"
}) => {

    const { Op } = require("sequelize");

    const where = {
        status: "published"
    };


    // ==============================
    // SEARCH
    // ==============================

    if (search) {

        where.title = {
            [Op.like]: `%${search}%`
        };
    }


    // ==============================
    // CATEGORY
    // ==============================

    if (category_id) {

        where.category_id =
            Number(category_id);
    }


    // ==============================
    // PRICE
    // ==============================

    if (
        min_price !== undefined ||
        max_price !== undefined
    ) {

        where.price = {};

        if (min_price !== undefined) {

            where.price[Op.gte] =
                Number(min_price);
        }

        if (max_price !== undefined) {

            where.price[Op.lte] =
                Number(max_price);
        }
    }


    // ==============================
    // SORT
    // ==============================

    let order = [
        ["created_at", "DESC"]
    ];

    if (sort === "price_asc") {

        order = [
            ["price", "ASC"]
        ];
    }

    if (sort === "price_desc") {

        order = [
            ["price", "DESC"]
        ];
    }

    if (sort === "oldest") {

        order = [
            ["created_at", "ASC"]
        ];
    }


    // ==============================
    // PAGINATION
    // ==============================

    const pageNumber =
        Math.max(Number(page), 1);

    const pageLimit =
        Math.min(
            Math.max(Number(limit), 1),
            100
        );

    const offset =
        (pageNumber - 1) * pageLimit;


    // ==============================
    // QUERY
    // ==============================

    const result =
        await Course.findAndCountAll({

            where,

            include: [

                {
                    model: User,
                    as: "teacher",

                    attributes: [
                        "id",
                        "name",
                        "avatar"
                    ]
                },

                {
                    model: Category,
                    as: "category",

                    attributes: [
                        "id",
                        "name"
                    ]
                }
            ],

            order,

            limit: pageLimit,

            offset,

            distinct: true
        });


    return {
        courses: result.rows,

        pagination: {
            page: pageNumber,

            limit: pageLimit,

            total: result.count,

            totalPages:
                Math.ceil(
                    result.count /
                    pageLimit
                )
        }
    };
};


// ==========================================
// GET COURSE BY ID
// ==========================================

const getCourseById = async (id) => {

    const course =
        await Course.findOne({

            where: {
                id,
                status: "published"
            },

            include: [

                {
                    model: User,
                    as: "teacher",

                    attributes: [
                        "id",
                        "name",
                        "avatar"
                    ]
                },

                {
                    model: Category,
                    as: "category"
                },

                {
                    model: Lesson,
                    as: "lessons",

                    attributes: [
                        "id",
                        "title",
                        "description",
                        "duration",
                        "lesson_order",
                        "is_preview"
                    ],

                    order: [
                        ["lesson_order", "ASC"]
                    ]
                }
            ]
        });


    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }

    return course;
};


// ==========================================
// CREATE COURSE
// ==========================================

const createCourse = async ({
    teacher_id,
    category_id,
    title,
    slug,
    description,
    price,
    thumbnail
}) => {

    const category =
        await Category.findByPk(
            category_id
        );

    if (!category) {

        throw new Error(
            "Danh mục không tồn tại"
        );
    }


    return await Course.create({

        teacher_id,

        category_id,

        title,

        slug,

        description,

        price: price || 0,

        thumbnail,

        status: "draft"
    });
};


// ==========================================
// UPDATE COURSE
// ==========================================

const updateCourse = async (
    id,
    data,
    user
) => {

    const course =
        await Course.findByPk(id);

    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    // Teacher chỉ sửa khóa học của mình

    if (
        user.role === "teacher" &&
        course.teacher_id !== user.id
    ) {

        throw new Error(
            "Bạn không có quyền sửa khóa học này"
        );
    }


    const {
        category_id,
        title,
        slug,
        description,
        price,
        thumbnail
    } = data;


    if (category_id) {

        const category =
            await Category.findByPk(
                category_id
            );

        if (!category) {

            throw new Error(
                "Danh mục không tồn tại"
            );
        }
    }


    await course.update({

        category_id:
            category_id ??
            course.category_id,

        title:
            title ??
            course.title,

        slug:
            slug ??
            course.slug,

        description:
            description ??
            course.description,

        price:
            price ??
            course.price,

        thumbnail:
            thumbnail ??
            course.thumbnail
    });


    return course;
};


// ==========================================
// DELETE COURSE
// ==========================================

const deleteCourse = async (
    id,
    user
) => {

    const course =
        await Course.findByPk(id);

    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học"
        );
    }


    if (
        user.role === "teacher" &&
        course.teacher_id !== user.id
    ) {

        throw new Error(
            "Bạn không có quyền xóa khóa học này"
        );
    }


    await course.destroy();

    return true;
};

const getMyCourses = async ({
    teacher_id,
    page = 1,
    limit = 10,
    search,
    category_id,
    min_price,
    max_price,
    sort = "newest"
}) => {

    const { Op } = require("sequelize");

    const where = {
        teacher_id: Number(teacher_id)
    };


    // ==============================
    // SEARCH
    // ==============================

    if (search) {

        where.title = {
            [Op.like]: `%${search}%`
        };
    }


    // ==============================
    // CATEGORY
    // ==============================

    if (category_id) {

        where.category_id =
            Number(category_id);
    }


    // ==============================
    // PRICE
    // ==============================

    if (
        min_price !== undefined ||
        max_price !== undefined
    ) {

        where.price = {};

        if (min_price !== undefined) {

            where.price[Op.gte] =
                Number(min_price);
        }

        if (max_price !== undefined) {

            where.price[Op.lte] =
                Number(max_price);
        }
    }


    // ==============================
    // SORT
    // ==============================

    let order = [
        ["created_at", "DESC"]
    ];

    if (sort === "oldest") {

        order = [
            ["created_at", "ASC"]
        ];
    }

    if (sort === "price_asc") {

        order = [
            ["price", "ASC"]
        ];
    }

    if (sort === "price_desc") {

        order = [
            ["price", "DESC"]
        ];
    }


    // ==============================
    // PAGINATION
    // ==============================

    const pageNumber =
        Math.max(Number(page), 1);

    const pageLimit =
        Math.min(
            Math.max(Number(limit), 1),
            100
        );

    const offset =
        (pageNumber - 1) * pageLimit;


    // ==============================
    // QUERY
    // ==============================

    const result =
        await Course.findAndCountAll({

            where,

            include: [

                {
                    model: User,
                    as: "teacher",

                    attributes: [
                        "id",
                        "name",
                        "avatar"
                    ]
                },

                {
                    model: Category,
                    as: "category",

                    attributes: [
                        "id",
                        "name"
                    ]
                }
            ],

            order,

            limit: pageLimit,

            offset,

            distinct: true
        });


    return {

        courses: result.rows,

        pagination: {

            page: pageNumber,

            limit: pageLimit,

            total: result.count,

            totalPages:
                Math.ceil(
                    result.count /
                    pageLimit
                )
        }
    };
};

// ==========================================
// GET MY COURSE BY ID - TEACHER
// Teacher được xem course của chính mình
// Bao gồm draft + published
// ==========================================

const getMyCourseById = async (
    id,
    teacherId
) => {

    const course =
        await Course.findOne({

            where: {
                id: Number(id),
                teacher_id: Number(teacherId)
            },

            include: [

                {
                    model: User,
                    as: "teacher",

                    attributes: [
                        "id",
                        "name",
                        "avatar"
                    ]
                },

                {
                    model: Category,
                    as: "category"
                },

                {
                    model: Lesson,
                    as: "lessons",

                    attributes: [
                        "id",
                        "title",
                        "description",
                        "duration",
                        "lesson_order",
                        "is_preview"
                    ]
                }

            ],

            order: [
                [
                    { model: Lesson, as: "lessons" },
                    "lesson_order",
                    "ASC"
                ]
            ]

        });


    if (!course) {

        throw new Error(
            "Không tìm thấy khóa học hoặc bạn không có quyền truy cập"
        );
    }


    return course;
};


module.exports = {
    getCourses,
    getMyCourses,
    getMyCourseById,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};