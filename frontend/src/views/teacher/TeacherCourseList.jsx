import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import {
    loadTeacherCoursesController,
    deleteTeacherCourseController
} from "../../controllers/teacherCourseController";


function TeacherCourseList() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD COURSES
    // ==========================================

    useEffect(() => {
        loadCourses();
    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const result =
                await loadTeacherCoursesController();

            console.log(
                "GET COURSES RESULT:",
                result
            );


            const courseList =
                Array.isArray(result?.data)
                    ? result.data
                    : [];

            console.log(
                "MY COURSES:",
                courseList
            );

            setCourses(courseList);

        } catch (err) {

            console.error(
                "LOAD COURSES ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Không thể tải danh sách khóa học."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (courseId) => {

        const confirmed =
            window.confirm(
                "Bạn có chắc muốn xóa khóa học này?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");
            setLoading(true);

            await deleteTeacherCourseController(
                courseId
            );

            setSuccess(
                "Xóa khóa học thành công!"
            );

            await loadCourses();

        } catch (err) {

            console.error(
                "DELETE COURSE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Không thể xóa khóa học."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div style={styles.page}>

            <div style={styles.container}>

                {/* HEADER */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.title}>
                            Quản lý khóa học
                        </h1>

                        <p style={styles.subtitle}>
                            Danh sách các khóa học của bạn
                        </p>

                    </div>


                    <div style={styles.headerButtons}>

                        <button
                            style={styles.backButton}
                            onClick={() =>
                                navigate("/teacher")
                            }
                        >
                            ← Dashboard
                        </button>


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

                </div>


                {/* MESSAGE */}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}


                {success && (
                    <div style={styles.success}>
                        {success}
                    </div>
                )}


                {/* LOADING */}

                {loading ? (

                    <div style={styles.loading}>
                        Đang tải khóa học...
                    </div>

                ) : (

                    <>

                        {/* COUNT */}

                        <div style={styles.courseCount}>

                            <span>
                                Tổng số khóa học:
                            </span>

                            <strong>
                                {courses.length}
                            </strong>

                        </div>


                        {/* EMPTY */}

                        {courses.length === 0 ? (

                            <div style={styles.empty}>

                                <div style={styles.emptyIcon}>
                                    📚
                                </div>

                                <h2>
                                    Chưa có khóa học
                                </h2>

                                <p>
                                    Bạn chưa tạo khóa học nào.
                                </p>

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

                        ) : (

                            /* COURSE GRID */

                            <div style={styles.grid}>

                                {courses.map((course) => (

                                    <div
                                        key={course.id}
                                        style={styles.courseCard}
                                    >

                                        {/* THUMBNAIL */}

                                        {course.thumbnail ? (

                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                style={styles.thumbnail}
                                            />

                                        ) : (

                                            <div style={styles.noThumbnail}>
                                                📚
                                            </div>

                                        )}


                                        {/* BODY */}

                                        <div style={styles.courseBody}>

                                            <h2 style={styles.courseTitle}>
                                                {course.title}
                                            </h2>


                                            <div style={styles.infoRow}>

                                                <span style={styles.label}>
                                                    ID:
                                                </span>

                                                <span>
                                                    {course.id}
                                                </span>

                                            </div>


                                            <div style={styles.infoRow}>

                                                <span style={styles.label}>
                                                    Danh mục:
                                                </span>

                                                <span>
                                                    {course.category?.name ||
                                                        course.category_id}
                                                </span>

                                            </div>


                                            <div style={styles.infoRow}>

                                                <span style={styles.label}>
                                                    Giá:
                                                </span>

                                                <span style={styles.price}>
                                                    {Number(
                                                        course.price || 0
                                                    ).toLocaleString("vi-VN")}{" "}
                                                    VNĐ
                                                </span>

                                            </div>


                                            <div style={styles.infoRow}>

                                                <span style={styles.label}>
                                                    Trạng thái:
                                                </span>

                                                <span
                                                    style={
                                                        course.status ===
                                                            "published"
                                                            ? styles.published
                                                            : styles.status
                                                    }
                                                >
                                                    {course.status || "N/A"}
                                                </span>

                                            </div>


                                            <p style={styles.description}>
                                                {course.description ||
                                                    "Chưa có mô tả."}
                                            </p>


                                            {/* ACTIONS */}

                                            <div style={styles.actions}>

                                                <button
                                                    style={styles.editButton}
                                                    onClick={() =>
                                                        navigate(
                                                            `/teacher/courses/edit/${course.id}`
                                                        )
                                                    }
                                                >
                                                    ✏️ Sửa
                                                </button>


                                                <button
                                                    style={styles.lessonButton}
                                                    onClick={() =>
                                                        navigate(
                                                            `/teacher/courses/${course.id}/lessons`
                                                        )
                                                    }
                                                >
                                                    📚 Bài học
                                                </button>


                                                <button
                                                    style={styles.deleteButton}
                                                    onClick={() =>
                                                        handleDelete(
                                                            course.id
                                                        )
                                                    }
                                                >
                                                    🗑 Xóa
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>
    );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "30px 0 60px"
    },


    container: {
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto"
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "30px"
    },


    title: {
        margin: 0,
        fontSize: "32px",
        color: "#222"
    },


    subtitle: {
        marginTop: "8px",
        color: "#666"
    },


    headerButtons: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },


    createButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "#333",
        color: "white",
        fontSize: "15px"
    },


    backButton: {
        padding: "11px 18px",
        border: "1px solid #ccc",
        borderRadius: "7px",
        cursor: "pointer",
        background: "white",
        fontSize: "15px"
    },


    courseCount: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "white",
        padding: "15px 20px",
        borderRadius: "8px",
        marginBottom: "25px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        color: "#333"
    },


    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "25px",
        alignItems: "start"
    },


    courseCard: {
        background: "#ffffff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e5e5e5",
        minWidth: 0
    },


    thumbnail: {
        width: "100%",
        height: "180px",
        objectFit: "cover",
        display: "block"
    },


    noThumbnail: {
        width: "100%",
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "55px",
        background: "#eeeeee"
    },


    courseBody: {
        padding: "20px"
    },


    courseTitle: {
        margin: "0 0 18px",
        fontSize: "21px",
        lineHeight: "1.4",
        color: "#222"
    },


    infoRow: {
        display: "flex",
        gap: "8px",
        marginBottom: "10px",
        alignItems: "center",
        color: "#444",
        flexWrap: "wrap"
    },


    label: {
        fontWeight: "bold"
    },


    price: {
        fontWeight: "bold",
        color: "#222"
    },


    status: {
        padding: "4px 8px",
        borderRadius: "5px",
        background: "#eeeeee"
    },


    published: {
        padding: "4px 8px",
        borderRadius: "5px",
        background: "#e8f5e9",
        color: "#2e7d32",
        fontWeight: "bold"
    },


    description: {
        color: "#555",
        lineHeight: "1.6",
        minHeight: "50px",
        marginTop: "15px",
        wordBreak: "break-word"
    },


    actions: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginTop: "20px"
    },


    editButton: {
        padding: "9px 13px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#f39c12",
        color: "white"
    },


    lessonButton: {
        padding: "9px 13px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#1976d2",
        color: "white"
    },


    deleteButton: {
        padding: "9px 13px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#d32f2f",
        color: "white"
    },


    loading: {
        background: "white",
        borderRadius: "10px",
        padding: "60px",
        textAlign: "center",
        color: "#555"
    },


    empty: {
        background: "white",
        padding: "60px 30px",
        textAlign: "center",
        borderRadius: "10px"
    },


    emptyIcon: {
        fontSize: "60px",
        marginBottom: "15px"
    },


    error: {
        padding: "12px 15px",
        marginBottom: "20px",
        borderRadius: "6px",
        background: "#ffebee",
        color: "#c62828"
    },


    success: {
        padding: "12px 15px",
        marginBottom: "20px",
        borderRadius: "6px",
        background: "#e8f5e9",
        color: "#2e7d32"
    }

};


export default TeacherCourseList;