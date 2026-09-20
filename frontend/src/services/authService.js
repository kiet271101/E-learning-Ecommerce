import api from "./api";

const register = async (data) => {

    const response =
        await api.post("/auth/register", data);

    return response.data;
};


const login = async (data) => {

    const response =
        await api.post("/auth/login", data);

    return response.data;
};


const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


const getCurrentUser = () => {

    const user =
        localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch {

        return null;
    }
};


const getToken = () => {

    return localStorage.getItem("token");
};


const isLoggedIn = () => {

    return !!localStorage.getItem("token");
};

// ==========================================
// GET CURRENT USER
// ==========================================

const getProfile = async () => {

    const response =
        await api.get("/auth/me");

    return response.data;
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (data) => {

    const response =
        await api.put(
            "/auth/profile",
            data
        );

    return response.data;
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (data) => {

    const response =
        await api.put(
            "/auth/change-password",
            data
        );

    return response.data;
};


export default {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
    isLoggedIn,
    getProfile,
    updateProfile,
    changePassword
};