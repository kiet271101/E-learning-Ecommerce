const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Lesson = sequelize.define(
    "Lesson",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        video_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        duration: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        lesson_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        is_preview: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "lessons"
    }
);

module.exports = Lesson;