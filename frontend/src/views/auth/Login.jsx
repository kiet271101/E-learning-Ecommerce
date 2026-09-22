import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    loginController
} from "../../controllers/authController";

import "../../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================================
    // CHANGE
    // ==========================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // ==========================================
    // LOGIN
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setLoading(true);

        const result =
            await loginController(form);

        setLoading(false);

        if (!result.success) {

            setMessage(
                result.message ||
                "Đăng nhập thất bại."
            );

            return;
        }

        navigate("/courses");

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="login-page">

            <div className="login-container">

                {/* ==================================
                    LOGIN HEADER
                ================================== */}

                <div className="login-header">

                    <div className="login-logo">
                        E-Learning
                    </div>

                    <h1 className="login-title">
                        Đăng nhập
                    </h1>

                    <p className="login-subtitle">
                        Đăng nhập để tiếp tục học tập
                    </p>

                </div>


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="login-field">

                        <label
                            htmlFor="email"
                            className="login-label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            className="login-input"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="login-field">

                        <label
                            htmlFor="password"
                            className="login-label"
                        >
                            Mật khẩu
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className="login-input"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* ERROR */}

                    {message && (

                        <div className="login-message">

                            {message}

                        </div>

                    )}


                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"}

                    </button>

                </form>


                {/* ==================================
                    REGISTER
                ================================== */}

                <div className="login-register">

                    <span>
                        Chưa có tài khoản?
                    </span>

                    <button
                        type="button"
                        className="login-register-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Đăng ký
                    </button>

                </div>


                {/* ==================================
                    BACK TO HOME
                ================================== */}

                <button
                    type="button"
                    className="login-home-button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ← Quay lại trang chủ
                </button>

            </div>

        </div>

    );
}

export default Login;