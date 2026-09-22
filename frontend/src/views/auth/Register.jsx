import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    registerController
} from "../../controllers/authController";

import "../../styles/Register.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setLoading(true);

        const result =
            await registerController(form);

        setLoading(false);

        if (!result.success) {

            setMessage(
                result.message ||
                "Đăng ký thất bại."
            );

            return;
        }

        setMessage(
            "Đăng ký thành công! Đang chuyển sang đăng nhập..."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1000);

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="register-page">

            <div className="register-container">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="register-header">

                    <div className="register-logo">
                        E-Learning
                    </div>

                    <h1 className="register-title">
                        Đăng ký
                    </h1>

                    <p className="register-subtitle">
                        Tạo tài khoản để bắt đầu học tập
                    </p>

                </div>


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    {/* HỌ VÀ TÊN */}

                    <div className="register-field">

                        <label
                            htmlFor="name"
                            className="register-label"
                        >
                            Họ và tên
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className="register-input"
                            autoComplete="name"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="register-field">

                        <label
                            htmlFor="email"
                            className="register-label"
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
                            className="register-input"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* MẬT KHẨU */}

                    <div className="register-field">

                        <label
                            htmlFor="password"
                            className="register-label"
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
                            className="register-input"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                message.includes("thành công")
                                    ? "register-message register-message-success"
                                    : "register-message"
                            }
                        >
                            {message}
                        </div>

                    )}


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Đang đăng ký..."
                            : "Đăng ký"}

                    </button>

                </form>


                {/* ==================================
                    LOGIN
                ================================== */}

                <div className="register-login">

                    <span>
                        Đã có tài khoản?
                    </span>

                    <button
                        type="button"
                        className="register-login-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Đăng nhập
                    </button>

                </div>


                {/* ==================================
                    HOME
                ================================== */}

                <button
                    type="button"
                    className="register-home-button"
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

export default Register;