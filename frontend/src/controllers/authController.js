import authService from "../services/authService";

// ==========================================
// REGISTER
// ==========================================

export const registerController = async (formData) => {

    try {

        const result =
            await authService.register(formData);

        console.log("REGISTER RESPONSE:", result);

        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Đăng ký thất bại"
        };
    }
};


// ==========================================
// LOGIN
// ==========================================

export const loginController = async (formData) => {

    try {

        const result =
            await authService.login(formData);

        console.log("LOGIN RESPONSE:", result);

        // ==========================================
        // TÌM JWT TOKEN
        // ==========================================

        const token =
            result?.token ||
            result?.accessToken ||
            result?.access_token ||
            result?.data?.token ||
            result?.data?.accessToken ||
            result?.data?.access_token;

        // ==========================================
        // KHÔNG CÓ TOKEN
        // ==========================================

        if (!token) {

            console.error(
                "Không tìm thấy JWT trong response:",
                result
            );

            return {
                success: false,
                message:
                    "Backend không trả về JWT token"
            };
        }

        // ==========================================
        // LẤY USER
        // ==========================================

        const user =
            result?.user ||
            result?.data?.user;

        // ==========================================
        // LƯU TOKEN
        // ==========================================

        localStorage.setItem(
            "token",
            token
        );

        // ==========================================
        // LƯU USER
        // ==========================================

        if (user) {

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        }

        console.log(
            "JWT đã lưu thành công"
        );

        console.log(
            "USER:",
            user
        );

        // ==========================================
        // RETURN
        // ==========================================

        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Đăng nhập thất bại"
        };
    }
};


// ==========================================
// LOGOUT
// ==========================================

// ==========================================
// GET PROFILE
// ==========================================

export const getProfileController = async () => {

    try {

        const result =
            await authService.getProfile();

        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "GET PROFILE ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Không thể tải thông tin cá nhân"
        };
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfileController = async (
    data
) => {

    try {

        const result =
            await authService.updateProfile(
                data
            );


        // Cập nhật localStorage
        if (result?.data) {

            localStorage.setItem(
                "user",
                JSON.stringify(result.data)
            );
        }


        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Cập nhật thông tin thất bại"
        };
    }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePasswordController = async (
    data
) => {

    try {

        const result =
            await authService.changePassword(
                data
            );

        return {
            success: true,
            data: result
        };

    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error.response?.data || error
        );

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Đổi mật khẩu thất bại"
        };
    }
};

export const logoutController = () => {

    authService.logout();

    window.location.href = "/login";
};