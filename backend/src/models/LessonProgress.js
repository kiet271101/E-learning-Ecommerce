const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LessonProgress = sequelize.define(
    "LessonProgress",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        lesson_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        is_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        watched_seconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        completed_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "lesson_progress",
        timestamps: false
    }
);

module.exports = LessonProgress;