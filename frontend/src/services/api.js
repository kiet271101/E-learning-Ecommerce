import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        // ==========================================
        // FORM DATA
        // ==========================================
        //
        // Nếu request là FormData:
        // - Không ép application/json
        // - Browser/Axios sẽ tự thiết lập
        //   multipart/form-data + boundary
        //

        if (config.data instanceof FormData) {

            delete config.headers["Content-Type"];

        } else {

            // Request JSON thông thường

            config.headers["Content-Type"] =
                "application/json";
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }
);

export default api;