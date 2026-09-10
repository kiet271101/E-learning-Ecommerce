import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";

function Navbar() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const isLoggedIn =
        authService.isLoggedIn();

    const handleLogout = () => {

        authService.logout();

        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>

            <div>

                <Link
                    to="/"
                    style={styles.logo}
                >
                    E-Learning
                </Link>

            </div>

            <div style={styles.links}>

                <Link to="/">
                    Trang chủ
                </Link>

                <Link to="/courses">
                    Khóa học
                </Link>

                {!isLoggedIn && (
                    <>
                        <Link to="/login">
                            Đăng nhập
                        </Link>

                        <Link to="/register">
                            Đăng ký
                        </Link>
                    </>
                )}

                {isLoggedIn && (
                    <>

                        {user?.role === "student" && (
                            <>
                                <Link to="/student">
                                    Dashboard
                                </Link>

                                <Link to="/my-courses">
                                    Khóa học của tôi
                                </Link>
                            </>
                        )}

                        {user?.role === "teacher" && (
                            <Link to="/teacher">
                                Giáo viên
                            </Link>
                        )}

                        {user?.role === "admin" && (
                            <Link to="/admin">
                                Quản trị
                            </Link>
                        )}

                        <span>
                            Xin chào, {user?.name}
                        </span>

                        <button
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>

                    </>
                )}

            </div>

        </nav>
    );
}

const styles = {

    navbar: {
        height: "65px",
        padding: "0 30px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },

    logo: {
        fontSize: "22px",
        fontWeight: "bold",
        textDecoration: "none",
        color: "#222"
    },

    links: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    }

};

export default Navbar;