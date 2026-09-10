const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const Material = sequelize.define(
    "Material",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        lesson_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        file_url: {
            type: DataTypes.STRING(500),
            allowNull: false
        },

        file_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        file_size: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        tableName: "materials",

        // QUAN TRỌNG
        timestamps: false
    }
);

module.exports = Material;