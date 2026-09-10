const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async ({
    name,
    email,
    password,
    role
}) => {

    const existingUser = await User.findOne({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new Error("Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "student"
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};


const login = async ({
    email,
    password
}) => {

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Email hoặc password không chính xác");
    }

    if (user.status === "blocked") {
        throw new Error("Tài khoản đã bị khóa");
    }

    const isPasswordCorrect =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new Error(
            "Email hoặc password không chính xác"
        );
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "7d"
        }
    );

    return {
        token,

        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


module.exports = {
    register,
    login
};