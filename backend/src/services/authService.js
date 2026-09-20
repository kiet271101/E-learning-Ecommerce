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

const getCurrentUser = async (userId) => {

    const user = await User.findByPk(userId, {
        attributes: [
            "id",
            "name",
            "email",
            "role",
            "avatar",
            "status"
        ]
    });

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    return user;
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (
    userId,
    { name, email }
) => {

    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }


    // --------------------------------------
    // VALIDATE NAME
    // --------------------------------------

    if (!name || !name.trim()) {
        throw new Error("Họ tên không được để trống");
    }


    // --------------------------------------
    // VALIDATE EMAIL
    // --------------------------------------

    if (!email || !email.trim()) {
        throw new Error("Email không được để trống");
    }


    // --------------------------------------
    // CHECK EMAIL FORMAT
    // --------------------------------------

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        throw new Error("Email không hợp lệ");
    }


    // --------------------------------------
    // CHECK EMAIL DUPLICATE
    // --------------------------------------

    const existingUser = await User.findOne({
        where: {
            email: email.trim()
        }
    });

    if (
        existingUser &&
        Number(existingUser.id) !== Number(userId)
    ) {
        throw new Error("Email đã được sử dụng");
    }


    // --------------------------------------
    // UPDATE
    // --------------------------------------

    await user.update({
        name: name.trim(),
        email: email.trim()
    });


    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
    };
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }


    // --------------------------------------
    // VALIDATE
    // --------------------------------------

    if (!currentPassword || !newPassword) {
        throw new Error(
            "Vui lòng nhập đầy đủ mật khẩu"
        );
    }


    if (newPassword.length < 6) {
        throw new Error(
            "Mật khẩu mới phải có ít nhất 6 ký tự"
        );
    }


    // --------------------------------------
    // CHECK CURRENT PASSWORD
    // --------------------------------------

    const isPasswordCorrect =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new Error(
            "Mật khẩu hiện tại không chính xác"
        );
    }


    // --------------------------------------
    // HASH NEW PASSWORD
    // --------------------------------------

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );


    // --------------------------------------
    // UPDATE
    // --------------------------------------

    await user.update({
        password: hashedPassword
    });


    return true;
};


module.exports = {
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword
};