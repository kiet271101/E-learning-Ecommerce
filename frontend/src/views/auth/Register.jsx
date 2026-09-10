import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    registerController
} from "../../controllers/authController";

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

            setMessage(result.message);

            return;
        }

        setMessage(
            "Đăng ký thành công! Đang chuyển sang đăng nhập..."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <div style={styles.container}>

            <div style={styles.formBox}>

                <h1>Đăng ký</h1>

                <form onSubmit={handleSubmit}>

                    <div style={styles.field}>

                        <label>
                            Họ và tên
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div style={styles.field}>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div style={styles.field}>

                        <label>
                            Mật khẩu
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang đăng ký..."
                            : "Đăng ký"}
                    </button>

                </form>

                {message && (
                    <p style={styles.message}>
                        {message}
                    </p>
                )}

                <p>
                    Đã có tài khoản?{" "}

                    <span
                        style={styles.link}
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Đăng nhập
                    </span>

                </p>

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    formBox: {
        width: "400px",
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
    },

    field: {
        marginBottom: "15px"
    },

    link: {
        cursor: "pointer",
        textDecoration: "underline"
    },

    message: {
        marginTop: "15px"
    }
};

export default Register;