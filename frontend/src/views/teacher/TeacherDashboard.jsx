import {
    useNavigate
} from "react-router-dom";

import authService
    from "../../services/authService";


function TeacherDashboard() {

    const navigate =
        useNavigate();

    const user =
        authService.getCurrentUser();


    return (

        <div style={styles.container}>

            <div style={styles.header}>

                <div>

                    <h1>
                        Teacher Dashboard
                    </h1>

                    <p>
                        Xin chào, {user?.name}
                    </p>

                </div>


                <button
                    style={styles.createButton}
                    onClick={() =>
                        navigate(
                            "/teacher/courses/create"
                        )
                    }
                >
                    + Tạo khóa học
                </button>

            </div>


            {/* ================================= */}
            {/* STATISTICS */}
            {/* ================================= */}

            <div style={styles.stats}>

                <div style={styles.statCard}>

                    <h3>
                        📚
                    </h3>

                    <h2>
                        Khóa học
                    </h2>

                    <p>
                        Quản lý các khóa học của bạn
                    </p>

                </div>


                <div style={styles.statCard}>

                    <h3>
                        🎓
                    </h3>

                    <h2>
                        Học viên
                    </h2>

                    <p>
                        Theo dõi học viên đăng ký
                    </p>

                </div>


                <div style={styles.statCard}>

                    <h3>
                        📊
                    </h3>

                    <h2>
                        Thống kê
                    </h2>

                    <p>
                        Theo dõi hoạt động khóa học
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* MANAGEMENT */}
            {/* ================================= */}

            <div style={styles.management}>

                <h2>
                    Quản lý giảng dạy
                </h2>


                <div style={styles.actions}>

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            navigate(
                                "/teacher/courses"
                            )
                        }
                    >
                        📚
                        <br />

                        Quản lý khóa học
                    </button>


                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            navigate(
                                "/teacher/courses/create"
                            )
                        }
                    >
                        ➕
                        <br />

                        Tạo khóa học
                    </button>

                </div>

            </div>


            {/* ================================= */}
            {/* USER INFO */}
            {/* ================================= */}

            <div style={styles.userCard}>

                <h3>
                    Thông tin giảng viên
                </h3>

                <p>
                    <strong>
                        Họ tên:
                    </strong>

                    {" "}

                    {user?.name}

                </p>


                <p>
                    <strong>
                        Email:
                    </strong>

                    {" "}

                    {user?.email}

                </p>


                <p>
                    <strong>
                        Vai trò:
                    </strong>

                    {" "}

                    {user?.role}

                </p>

            </div>

        </div>

    );

}


const styles = {

    container: {
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto"
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px"
    },


    createButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
    },


    stats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
    },


    statCard: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)"
    },


    management: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)",
        marginBottom: "30px"
    },


    actions: {
        display: "flex",
        gap: "20px",
        marginTop: "20px"
    },


    actionButton: {
        minWidth: "180px",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff",
        cursor: "pointer",
        fontSize: "16px",
        lineHeight: "1.8"
    },


    userCard: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)"
    }

};


export default TeacherDashboard;