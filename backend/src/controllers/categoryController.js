const categoryService =
    require("../services/categoryService");


// GET /api/categories

const getAllCategories = async (
    req,
    res
) => {

    try {

        const categories =
            await categoryService
                .getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET /api/categories/:id

const getCategoryById = async (
    req,
    res
) => {

    try {

        const category =
            await categoryService
                .getCategoryById(
                    req.params.id
                );

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// POST /api/categories

const createCategory = async (
    req,
    res
) => {

    try {

        const {
            name,
            description
        } = req.body;

        if (!name) {

            return res.status(400).json({
                success: false,
                message:
                    "Tên danh mục không được để trống"
            });
        }

        const category =
            await categoryService
                .createCategory({
                    name,
                    description
                });

        res.status(201).json({
            success: true,
            message:
                "Tạo danh mục thành công",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// PUT /api/categories/:id

const updateCategory = async (
    req,
    res
) => {

    try {

        const category =
            await categoryService
                .updateCategory(
                    req.params.id,
                    req.body
                );

        res.status(200).json({
            success: true,
            message:
                "Cập nhật danh mục thành công",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE /api/categories/:id

const deleteCategory = async (
    req,
    res
) => {

    try {

        await categoryService
            .deleteCategory(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message:
                "Xóa danh mục thành công"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};