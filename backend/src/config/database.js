const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",

        logging: false,

        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();

        console.log("=================================");
        console.log("MySQL connected successfully!");
        console.log("=================================");

    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = {
    sequelize,
    connectDatabase
};