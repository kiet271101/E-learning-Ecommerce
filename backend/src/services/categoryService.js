const { Category } = require("../models");


// ==========================================
// GET ALL
// ==========================================

const getAllCategories = async () => {

    return await Category.findAll({
        order: [
            ["id", "DESC"]
        ]
    });
};


// ==========================================
// GET BY ID
// ==========================================

const getCategoryById = async (id) => {

    const category = await Category.findByPk(id);

    if (!category) {
        throw new Error("Không tìm thấy danh mục");
    }

    return category;
};


// ==========================================
// CREATE
// ==========================================

const createCategory = async ({
    name,
    description
}) => {

    const existingCategory =
        await Category.findOne({
            where: { name }
        });

    if (existingCategory) {
        throw new Error(
            "Danh mục đã tồn tại"
        );
    }

    return await Category.create({
        name,
        description
    });
};


// ==========================================
// UPDATE
// ==========================================

const updateCategory = async (
    id,
    {
        name,
        description
    }
) => {

    const category =
        await Category.findByPk(id);

    if (!category) {
        throw new Error(
            "Không tìm thấy danh mục"
        );
    }

    if (name) {

        const existingCategory =
            await Category.findOne({
                where: {
                    name
                }
            });

        if (
            existingCategory &&
            existingCategory.id !== Number(id)
        ) {
            throw new Error(
                "Tên danh mục đã tồn tại"
            );
        }
    }

    await category.update({
        name:
            name ?? category.name,

        description:
            description ??
            category.description
    });

    return category;
};


// ==========================================
// DELETE
// ==========================================

const deleteCategory = async (id) => {

    const category =
        await Category.findByPk(id);

    if (!category) {
        throw new Error(
            "Không tìm thấy danh mục"
        );
    }

    await category.destroy();

    return true;
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};