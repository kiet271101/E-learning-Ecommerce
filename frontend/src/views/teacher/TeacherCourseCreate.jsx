import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createTeacherCourseController
} from "../../controllers/teacherCourseController";


function TeacherCourseCreate() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category_id: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const { name, value } =
            event.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // --------------------------------------
        // VALIDATE
        // --------------------------------------

        if (!form.title.trim()) {

            setError(
                "Vui lòng nhập tên khóa học."
            );

            return;
        }


        if (!form.description.trim()) {

            setError(
                "Vui lòng nhập mô tả khóa học."
            );

            return;
        }


        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {

            setError(
                "Giá khóa học không hợp lệ."
            );

            return;
        }


        if (!form.category_id) {

            setError(
                "Vui lòng nhập Category ID."
            );

            return;
        }


        // --------------------------------------
        // CREATE
        // --------------------------------------

        try {

            setLoading(true);

            const courseData = {

                title: form.title.trim(),

                description:
                    form.description.trim(),

                price: Number(form.price),

                category_id:
                    Number(form.category_id)

            };


            console.log(
                "Creating course:",
                courseData
            );


            const result =
                await createTeacherCourseController(
                    courseData
                );


            console.log(
                "Create course result:",
                result
            );


            setSuccess(
                "Tạo khóa học thành công!"
            );


            // Chờ một chút để user thấy thông báo

            setTimeout(() => {

                navigate(
                    "/teacher/courses"
                );

            }, 800);


        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Không thể tạo khóa học."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div style={styles.container}>

            <div style={styles.header}>

                <div>

                    <h1>
                        Tạo khóa học
                    </h1>

                    <p>
                        Tạo khóa học mới cho học viên
                    </p>

                </div>


                <button
                    style={styles.backButton}
                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }
                >
                    ← Quay lại
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div style={styles.error}>
                    {error}
                </div>

            )}


            {/* SUCCESS */}

            {success && (

                <div style={styles.success}>
                    {success}
                </div>

            )}


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                style={styles.form}
            >

                {/* TITLE */}

                <div style={styles.field}>

                    <label>
                        Tên khóa học
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Nhập tên khóa học"
                        style={styles.input}
                    />

                </div>


                {/* DESCRIPTION */}

                <div style={styles.field}>

                    <label>
                        Mô tả
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả khóa học"
                        rows="6"
                        style={styles.textarea}
                    />

                </div>


                {/* PRICE */}

                <div style={styles.field}>

                    <label>
                        Giá khóa học (VNĐ)
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        placeholder="Ví dụ: 500000"
                        style={styles.input}
                    />

                    <small>
                        Nhập 0 nếu khóa học miễn phí.
                    </small>

                </div>


                {/* CATEGORY */}

                <div style={styles.field}>

                    <label>
                        Category ID
                    </label>

                    <input
                        type="number"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        min="1"
                        placeholder="Ví dụ: 1"
                        style={styles.input}
                    />

                    <small>
                        Tạm thời nhập ID danh mục đã có
                        trong database.
                    </small>

                </div>


                {/* BUTTONS */}

                <div style={styles.buttons}>

                    <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() =>
                            navigate(
                                "/teacher/courses"
                            )
                        }
                    >
                        Hủy
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.submitButton}
                    >

                        {loading
                            ? "Đang tạo..."
                            : "Tạo khóa học"}

                    </button>

                </div>

            </form>

        </div>
    );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

    container: {
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f5f5f5"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    form: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "22px"
    },

    input: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },

    textarea: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        resize: "vertical"
    },

    buttons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "30px"
    },

    submitButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        background: "#333",
        color: "white"
    },

    cancelButton: {
        padding: "12px 20px",
        border: "1px solid #ccc",
        borderRadius: "7px",
        cursor: "pointer",
        background: "white"
    },

    backButton: {
        padding: "10px 16px",
        border: "1px solid #ccc",
        borderRadius: "7px",
        cursor: "pointer",
        background: "white"
    },

    error: {
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
        background: "#ffebee",
        color: "#c62828"
    },

    success: {
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
        background: "#e8f5e9",
        color: "#2e7d32"
    }

};


export default TeacherCourseCreate;