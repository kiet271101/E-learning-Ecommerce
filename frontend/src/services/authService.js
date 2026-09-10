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


export default {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
    isLoggedIn
};