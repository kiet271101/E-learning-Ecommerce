const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const Enrollment = sequelize.define(
    "Enrollment",
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

        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        enrolled_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        status: {
            type: DataTypes.ENUM(
                "active",
                "cancelled"
            ),
            defaultValue: "active"
        }
    },
    {
        tableName: "enrollments",

        timestamps: false
    }
);

module.exports = Enrollment;