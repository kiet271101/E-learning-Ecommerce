import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    loadTeacherCourseController,
    updateTeacherCourseController
} from "../../controllers/teacherCourseController";


function TeacherCourseEdit() {

    const navigate = useNavigate();

    const { courseId } = useParams();


    const [form, setForm] = useState({

        title: "",
        description: "",
        price: "",
        category_id: "",
        slug: "",
        thumbnail: ""

    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOAD COURSE
    // ==========================================

    useEffect(() => {

        loadCourse();

    }, [courseId]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");


            const result =
                await loadTeacherCourseController(
                    courseId
                );


            console.log(
                "GET COURSE DETAIL:",
                result
            );


            const course =
                result?.data;


            if (!course) {

                throw new Error(
                    "Không tìm thấy khóa học"
                );
            }


            setForm({

                title:
                    course.title || "",

                description:
                    course.description || "",

                price:
                    course.price || "",

                category_id:
                    course.category_id || "",

                slug:
                    course.slug || "",

                thumbnail:
                    course.thumbnail || ""

            });


        } catch (err) {

            console.error(
                "LOAD COURSE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Không thể tải khóa học"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");
        setSuccess("");


        if (!form.title.trim()) {

            setError(
                "Tên khóa học không được để trống."
            );

            return;
        }


        if (!form.category_id) {

            setError(
                "Vui lòng chọn danh mục."
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


        try {

            setSaving(true);


            const result =
                await updateTeacherCourseController(

                    courseId,

                    {

                        title:
                            form.title.trim(),

                        description:
                            form.description.trim(),

                        price:
                            Number(form.price),

                        category_id:
                            Number(form.category_id),

                        slug:
                            form.slug.trim(),

                        thumbnail:
                            form.thumbnail.trim()

                    }

                );


            console.log(
                "UPDATE COURSE RESULT:",
                result
            );


            setSuccess(
                "Cập nhật khóa học thành công!"
            );


            setTimeout(() => {

                navigate(
                    "/teacher/courses"
                );

            }, 1000);


        } catch (err) {

            console.error(
                "UPDATE COURSE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể cập nhật khóa học."
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div style={styles.page}>

                <div style={styles.container}>

                    <div style={styles.loading}>

                        Đang tải thông tin
                        khóa học...

                    </div>

                </div>

            </div>
        );
    }


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
                            Sửa khóa học
                        </h1>

                        <p style={styles.subtitle}>
                            Cập nhật thông tin khóa học
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

                        <label style={styles.label}>
                            Tên khóa học *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Nhập tên khóa học"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Mô tả
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={styles.textarea}
                            placeholder="Nhập mô tả khóa học"
                            rows={6}
                        />

                    </div>


                    {/* CATEGORY */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Category ID *
                        </label>

                        <input
                            type="number"
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            style={styles.input}
                            min="1"
                        />

                    </div>


                    {/* PRICE */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Giá khóa học (VNĐ)
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            style={styles.input}
                            min="0"
                        />

                    </div>


                    {/* SLUG */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Slug
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="vi-du-ten-khoa-hoc"
                        />

                    </div>


                    {/* THUMBNAIL */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Thumbnail URL
                        </label>

                        <input
                            type="text"
                            name="thumbnail"
                            value={form.thumbnail}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://..."
                        />

                    </div>


                    {/* BUTTONS */}

                    <div style={styles.actions}>

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
                            style={styles.saveButton}
                            disabled={saving}
                        >

                            {saving
                                ? "Đang lưu..."
                                : "💾 Lưu thay đổi"}

                        </button>

                    </div>

                </form>

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
        maxWidth: "900px",
        margin: "0 auto"
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px"
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


    backButton: {
        padding: "10px 16px",
        border: "1px solid #ccc",
        borderRadius: "7px",
        background: "white",
        cursor: "pointer"
    },


    form: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)"
    },


    field: {
        marginBottom: "20px"
    },


    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#333"
    },


    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },


    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        resize: "vertical",
        fontFamily: "inherit"
    },


    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "30px"
    },


    cancelButton: {
        padding: "11px 20px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "white",
        cursor: "pointer"
    },


    saveButton: {
        padding: "11px 20px",
        border: "none",
        borderRadius: "6px",
        background: "#1976d2",
        color: "white",
        cursor: "pointer",
        fontSize: "15px"
    },


    loading: {
        background: "white",
        padding: "60px",
        borderRadius: "10px",
        textAlign: "center"
    },


    error: {
        background: "#ffebee",
        color: "#c62828",
        padding: "12px 15px",
        borderRadius: "6px",
        marginBottom: "20px"
    },


    success: {
        background: "#e8f5e9",
        color: "#2e7d32",
        padding: "12px 15px",
        borderRadius: "6px",
        marginBottom: "20px"
    }

};


export default TeacherCourseEdit;