const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PaymentTransaction = sequelize.define(
    "PaymentTransaction",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        transaction_code: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        provider: {
            type: DataTypes.ENUM(
                "fake",
                "vnpay",
                "momo"
            ),
            allowNull: false
        },

        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "success",
                "failed",
                "cancelled"
            ),
            allowNull: false,
            defaultValue: "pending"
        },

        payment_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        response_code: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        paid_at: {
            type: DataTypes.DATE,
            allowNull: true
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "payment_transactions",
        timestamps: false
    }
);

module.exports = PaymentTransaction;