const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        slug: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },

        thumbnail: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "draft",
                "pending",
                "published",
                "rejected"
            ),
            allowNull: false,
            defaultValue: "draft"
        }
    },
    {
        tableName: "courses"
    }
);

module.exports = Course;