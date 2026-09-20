import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const isLoggedIn = authService.isLoggedIn();

    const handleLogout = () => {
        authService.logout();

        navigate("/login");
    };

    const handleProfile = () => {
        navigate("/student/profile");
    };

    return (
        <nav className="navbar">

            {/* LOGO */}
            <div className="navbar-logo-wrapper">
                <Link
                    to="/"
                    className="navbar-logo"
                >
                    E-Learning
                </Link>
            </div>

            {/* MENU */}
            <div className="navbar-links">

                <Link
                    to="/"
                    className="navbar-link"
                >
                    Trang chủ
                </Link>

                <Link
                    to="/courses"
                    className="navbar-link"
                >
                    Khóa học
                </Link>

                {/* CHƯA ĐĂNG NHẬP */}
                {!isLoggedIn && (
                    <>
                        <Link
                            to="/login"
                            className="navbar-link"
                        >
                            Đăng nhập
                        </Link>

                        <Link
                            to="/register"
                            className="navbar-register-button"
                        >
                            Đăng ký
                        </Link>
                    </>
                )}

                {/* ĐÃ ĐĂNG NHẬP */}
                {isLoggedIn && (
                    <>

                        {/* STUDENT */}
                        {user?.role === "student" && (
                            <>
                                <Link
                                    to="/student"
                                    className="navbar-link"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/my-courses"
                                    className="navbar-link"
                                >
                                    Khóa học của tôi
                                </Link>
                            </>
                        )}

                        {/* TEACHER */}
                        {user?.role === "teacher" && (
                            <Link
                                to="/teacher"
                                className="navbar-link"
                            >
                                Giáo viên
                            </Link>
                        )}

                        {/* ADMIN */}
                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="navbar-link"
                            >
                                Quản trị
                            </Link>
                        )}

                        {/* USER AREA */}
                        <div className="navbar-user">

                            <span className="navbar-greeting">
                                Xin chào,{" "}
                                <strong>
                                    {user?.name}
                                </strong>
                            </span>

                            {/* PROFILE */}
                            <button
                                type="button"
                                className="navbar-profile-button"
                                onClick={handleProfile}
                            >
                                👤 Hồ sơ
                            </button>

                            {/* LOGOUT */}
                            <button
                                type="button"
                                className="navbar-logout-button"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>

                        </div>

                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;