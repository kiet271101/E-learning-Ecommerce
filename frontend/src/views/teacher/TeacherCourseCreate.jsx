import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createTeacherCourseController
} from "../../controllers/teacherCourseController";

import "../../styles/TeacherCourseCreate.css";


function TeacherCourseCreate() {

    const navigate = useNavigate();


    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({

        title: "",

        description: "",

        price: "",

        category_id: "",

        thumbnail: null

    });


    // ==========================================
    // IMAGE PREVIEW
    // ==========================================

    const [previewUrl, setPreviewUrl] =
        useState("");


    // ==========================================
    // STATE
    // ==========================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // ==========================================
    // HANDLE IMAGE
    // ==========================================

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        // --------------------------------------
        // CHECK FILE TYPE
        // --------------------------------------

        const allowedTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setError(
                "Ảnh chỉ được phép là JPG, JPEG, PNG hoặc WEBP."
            );

            event.target.value = "";

            return;

        }


        // --------------------------------------
        // CHECK FILE SIZE
        // --------------------------------------

        const maxSize =
            5 *
            1024 *
            1024;


        if (
            file.size >
            maxSize
        ) {

            setError(
                "Ảnh khóa học không được vượt quá 5MB."
            );

            event.target.value = "";

            return;

        }


        setError("");


        // --------------------------------------
        // SAVE FILE
        // --------------------------------------

        setForm(prev => ({

            ...prev,

            thumbnail: file

        }));


        // --------------------------------------
        // PREVIEW
        // --------------------------------------

        const url =
            URL.createObjectURL(
                file
            );


        setPreviewUrl(url);

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // --------------------------------------
        // VALIDATE TITLE
        // --------------------------------------

        if (
            !form.title.trim()
        ) {

            setError(
                "Vui lòng nhập tên khóa học."
            );

            return;

        }


        // --------------------------------------
        // VALIDATE DESCRIPTION
        // --------------------------------------

        if (
            !form.description.trim()
        ) {

            setError(
                "Vui lòng nhập mô tả khóa học."
            );

            return;

        }


        // --------------------------------------
        // VALIDATE PRICE
        // --------------------------------------

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {

            setError(
                "Giá khóa học không hợp lệ."
            );

            return;

        }


        // --------------------------------------
        // VALIDATE CATEGORY
        // --------------------------------------

        if (
            !form.category_id
        ) {

            setError(
                "Vui lòng nhập Category ID."
            );

            return;

        }


        // --------------------------------------
        // VALIDATE IMAGE
        // --------------------------------------

        if (!form.thumbnail) {

            setError(
                "Vui lòng chọn ảnh khóa học."
            );

            return;

        }


        // --------------------------------------
        // CREATE
        // --------------------------------------

        try {

            setLoading(true);


            const formData =
                new FormData();


            formData.append(
                "title",
                form.title.trim()
            );


            formData.append(
                "description",
                form.description.trim()
            );


            formData.append(
                "price",
                Number(form.price)
            );


            formData.append(
                "category_id",
                Number(form.category_id)
            );


            formData.append(
                "thumbnail",
                form.thumbnail
            );


            console.log(
                "Creating course with image:",
                form.thumbnail.name
            );


            const result =
                await createTeacherCourseController(
                    formData
                );


            console.log(
                "Create course result:",
                result
            );


            if (
                !result ||
                result.success === false
            ) {

                setError(
                    result?.message ||
                    "Không thể tạo khóa học."
                );

                return;

            }


            setSuccess(
                "Tạo khóa học thành công!"
            );


            setTimeout(() => {

                navigate(
                    "/teacher/courses"
                );

            }, 800);


        } catch (err) {

            console.error(
                "CREATE COURSE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
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

        <div className="teacher-course-create-page">

            <div className="teacher-course-create-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="teacher-course-create-header">

                    <div>

                        <p className="teacher-course-create-eyebrow">
                            Teacher
                        </p>

                        <h1>
                            Tạo khóa học
                        </h1>

                        <p>
                            Tạo khóa học mới cho học viên
                        </p>

                    </div>


                    <button
                        type="button"
                        className="teacher-course-create-back-button"
                        onClick={() =>
                            navigate(
                                "/teacher/courses"
                            )
                        }
                    >
                        ← Quay lại
                    </button>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="teacher-course-create-message teacher-course-create-message-error">

                        {error}

                    </div>

                )}


                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (

                    <div className="teacher-course-create-message teacher-course-create-message-success">

                        {success}

                    </div>

                )}


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    className="teacher-course-create-form"
                    onSubmit={handleSubmit}
                >


                    {/* TITLE */}

                    <div className="teacher-course-create-field">

                        <label>
                            Tên khóa học
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Nhập tên khóa học"
                            className="teacher-course-create-input"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="teacher-course-create-field">

                        <label>
                            Mô tả
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả khóa học"
                            rows="6"
                            className="teacher-course-create-textarea"
                        />

                    </div>


                    {/* PRICE */}

                    <div className="teacher-course-create-field">

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
                            className="teacher-course-create-input"
                        />

                        <small>
                            Nhập 0 nếu khóa học miễn phí.
                        </small>

                    </div>


                    {/* CATEGORY */}

                    <div className="teacher-course-create-field">

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
                            className="teacher-course-create-input"
                        />

                    </div>


                    {/* ==================================
                        THUMBNAIL
                    ================================== */}

                    <div className="teacher-course-create-field">

                        <label>
                            Ảnh khóa học
                        </label>


                        <div className="teacher-course-create-image-box">

                            {previewUrl ? (

                                <img
                                    src={previewUrl}
                                    alt="Preview khóa học"
                                    className="teacher-course-create-preview"
                                />

                            ) : (

                                <div className="teacher-course-create-image-placeholder">

                                    <span className="teacher-course-create-image-icon">
                                        🖼️
                                    </span>

                                    <strong>
                                        Chưa chọn ảnh
                                    </strong>

                                    <small>
                                        JPG, PNG, WEBP · tối đa 5MB
                                    </small>

                                </div>

                            )}

                        </div>


                        <label
                            htmlFor="course-thumbnail"
                            className="teacher-course-create-image-button"
                        >
                            📷 Chọn ảnh khóa học
                        </label>


                        <input
                            id="course-thumbnail"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="teacher-course-create-file-input"
                        />


                        {form.thumbnail && (

                            <p className="teacher-course-create-file-name">

                                Đã chọn:{" "}

                                <strong>
                                    {form.thumbnail.name}
                                </strong>

                            </p>

                        )}

                    </div>


                    {/* ==================================
                        SUBMIT
                    ================================== */}

                    <div className="teacher-course-create-actions">

                        <button
                            type="button"
                            className="teacher-course-create-cancel-button"
                            onClick={() =>
                                navigate(
                                    "/teacher/courses"
                                )
                            }
                            disabled={loading}
                        >
                            Hủy
                        </button>


                        <button
                            type="submit"
                            className="teacher-course-create-submit-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Đang tạo khóa học..."
                                : "Tạo khóa học"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default TeacherCourseCreate;