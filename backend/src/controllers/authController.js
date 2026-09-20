const authService = require("../services/authService");


const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const user = await authService.register({
            name,
            email,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            message:
                "Đăng ký tài khoản thành công",

            data: user
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập email và password"
            });
        }

        const result =
            await authService.login({
                email,
                password
            });

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",

            data: result
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// GET CURRENT USER
// ==========================================

const getCurrentUser = async (req, res) => {

    try {

        const user =
            await authService.getCurrentUser(
                req.user.id
            );

        return res.status(200).json({

            success: true,

            data: user

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            email
        } = req.body;


        const user =
            await authService.updateProfile(
                req.user.id,
                {
                    name,
                    email
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "Cập nhật thông tin thành công",

            data: user

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        await authService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        );


        return res.status(200).json({

            success: true,

            message:
                "Đổi mật khẩu thành công"

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword
};