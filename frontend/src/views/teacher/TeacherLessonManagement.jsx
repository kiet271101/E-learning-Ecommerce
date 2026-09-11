import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import courseService from "../../services/courseService";

import {
    loadTeacherLessonsController,
    createTeacherLessonController,
    updateTeacherLessonController,
    deleteTeacherLessonController,
    uploadTeacherLessonVideoController,
    loadTeacherMaterialsController,
    uploadTeacherMaterialController,
    deleteTeacherMaterialController
} from "../../controllers/teacherLessonController";


function TeacherLessonManagement() {

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [courses, setCourses] = useState([]);

    const [selectedCourseId, setSelectedCourseId] =
        useState("");

    const [lessons, setLessons] = useState([]);

    const [selectedLesson, setSelectedLesson] =
        useState(null);

    const [materials, setMaterials] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LESSON FORM
    // ==========================================

    const [lessonForm, setLessonForm] = useState({

        title: "",

        description: "",

        duration: 0,

        lesson_order: 1,

        is_preview: false

    });


    const [editingLessonId, setEditingLessonId] =
        useState(null);


    // ==========================================
    // FILE UPLOAD
    // ==========================================

    const [videoFile, setVideoFile] =
        useState(null);

    const [materialFile, setMaterialFile] =
        useState(null);


    // ==========================================
    // LOAD TEACHER COURSES
    // ==========================================

    useEffect(() => {

        loadCourses();

    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await courseService.getMyCourses();


            console.log(
                "Teacher courses:",
                data
            );


            const courseList =
                Array.isArray(data)
                    ? data
                    : data?.data || [];


            setCourses(courseList);


        } catch (err) {

            console.error(
                "loadCourses error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể tải danh sách khóa học"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD LESSONS
    // ==========================================

    const loadLessons = async (
        courseId,
        keepSelectedLessonId = null
    ) => {

        if (!courseId) {

            setLessons([]);

            setSelectedLesson(null);

            setMaterials([]);

            return;

        }


        try {

            setLoading(true);

            setError("");


            const data =
                await loadTeacherLessonsController(
                    courseId
                );


            console.log(
                "Lessons:",
                data
            );


            const lessonList =
                Array.isArray(data)
                    ? data
                    : data?.data || [];


            setLessons(lessonList);


            // ==================================
            // GIỮ LẠI LESSON ĐANG CHỌN
            // ==================================

            if (keepSelectedLessonId) {

                const updatedLesson =
                    lessonList.find(
                        lesson =>
                            Number(lesson.id) ===
                            Number(keepSelectedLessonId)
                    );


                if (updatedLesson) {

                    setSelectedLesson(
                        updatedLesson
                    );

                }

            } else {

                setSelectedLesson(null);

                setMaterials([]);

            }


            return lessonList;


        } catch (err) {

            console.error(
                "loadLessons error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể tải danh sách bài học"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // COURSE CHANGE
    // ==========================================

    const handleCourseChange = async (
        event
    ) => {

        const courseId =
            event.target.value;


        setSelectedCourseId(
            courseId
        );


        setEditingLessonId(null);


        setLessonForm({

            title: "",

            description: "",

            duration: 0,

            lesson_order: 1,

            is_preview: false

        });


        setVideoFile(null);

        setMaterialFile(null);

        setSuccess("");

        setError("");


        await loadLessons(courseId);

    };


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleFormChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setLessonForm(prev => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };


    // ==========================================
    // RESET LESSON FORM
    // ==========================================

    const resetLessonForm = () => {

        setEditingLessonId(null);


        setLessonForm({

            title: "",

            description: "",

            duration: 0,

            lesson_order:
                lessons.length + 1,

            is_preview: false

        });


        setVideoFile(null);

        setError("");

    };


    // ==========================================
    // CREATE / UPDATE LESSON
    // ==========================================

    const handleSubmitLesson = async (
        event
    ) => {

        event.preventDefault();


        if (!selectedCourseId) {

            setError(
                "Vui lòng chọn khóa học"
            );

            return;

        }


        if (!lessonForm.title.trim()) {

            setError(
                "Vui lòng nhập tên bài học"
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const lessonData = {

                title:
                    lessonForm.title.trim(),

                description:
                    lessonForm.description,

                duration:
                    Number(
                        lessonForm.duration
                    ) || 0,

                lesson_order:
                    Number(
                        lessonForm.lesson_order
                    ) || 1,

                is_preview:
                    Boolean(
                        lessonForm.is_preview
                    )

            };

            console.log("LESSON DATA SEND:", lessonData);

            // ==================================
            // UPDATE
            // ==================================

            if (editingLessonId) {

                await updateTeacherLessonController(
                    editingLessonId,
                    lessonData
                );


                setSuccess(
                    "Cập nhật bài học thành công!"
                );

            }


            // ==================================
            // CREATE
            // ==================================

            else {

                await createTeacherLessonController(
                    selectedCourseId,
                    lessonData
                );


                setSuccess(
                    "Thêm bài học thành công!"
                );

            }


            await loadLessons(
                selectedCourseId
            );


            resetLessonForm();


        } catch (err) {

            console.error(
                "handleSubmitLesson error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể lưu bài học"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // EDIT LESSON
    // ==========================================

    const handleEditLesson = (
        lesson
    ) => {

        setEditingLessonId(
            lesson.id
        );


        setLessonForm({

            title:
                lesson.title || "",

            description:
                lesson.description || "",

            duration:
                lesson.duration || 0,

            lesson_order:
                lesson.lesson_order || 1,

            is_preview:
                Boolean(
                    lesson.is_preview
                )

        });


        setError("");

        setSuccess("");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // ==========================================
    // DELETE LESSON
    // ==========================================

    const handleDeleteLesson = async (
        lessonId
    ) => {

        const confirmed =
            window.confirm(
                "Bạn có chắc muốn xóa bài học này?"
            );


        if (!confirmed) return;


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            await deleteTeacherLessonController(
                lessonId
            );


            setSuccess(
                "Xóa bài học thành công!"
            );


            await loadLessons(
                selectedCourseId
            );


            resetLessonForm();


        } catch (err) {

            console.error(
                "handleDeleteLesson error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể xóa bài học"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // SELECT LESSON
    // ==========================================

    const handleSelectLesson = async (
        lesson
    ) => {

        setSelectedLesson(
            lesson
        );


        setMaterials([]);

        setVideoFile(null);

        setMaterialFile(null);

        setError("");

        setSuccess("");


        try {

            setLoading(true);


            const data =
                await loadTeacherMaterialsController(
                    lesson.id
                );


            console.log(
                "Materials:",
                data
            );


            const materialList =
                Array.isArray(data)
                    ? data
                    : data?.data || [];


            setMaterials(
                materialList
            );


        } catch (err) {

            console.error(
                "handleSelectLesson error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể tải tài liệu"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UPLOAD VIDEO
    // ==========================================

    const handleUploadVideo = async () => {

        if (!selectedLesson) {
            setError("Vui lòng chọn bài học");
            return;
        }

        if (!videoFile) {
            setError("Vui lòng chọn file video");
            return;
        }

        // ==========================================
        // KIỂM TRA FILE
        // ==========================================

        const allowedTypes = [
            "video/mp4",
            "video/mpeg",
            "video/webm",
            "video/quicktime"
        ];

        if (
            videoFile.type &&
            !allowedTypes.includes(videoFile.type)
        ) {
            setError(
                "File không hợp lệ. Chỉ cho phép MP4, MPEG, WEBM hoặc MOV."
            );
            return;
        }

        // 500 MB
        const maxSize =
            500 * 1024 * 1024;

        if (videoFile.size > maxSize) {
            setError(
                "Video vượt quá dung lượng tối đa 500 MB."
            );
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            console.log(
                "================================="
            );

            console.log(
                "UPLOAD VIDEO"
            );

            console.log({
                lessonId: selectedLesson.id,
                lessonTitle: selectedLesson.title,
                fileName: videoFile.name,
                fileSize: videoFile.size,
                fileSizeMB: (
                    videoFile.size /
                    1024 /
                    1024
                ).toFixed(2),
                fileType: videoFile.type
            });

            console.log(
                "================================="
            );


            // ==========================================
            // UPLOAD
            // ==========================================

            const result =
                await uploadTeacherLessonVideoController(
                    selectedLesson.id,
                    videoFile
                );


            console.log(
                "UPLOAD VIDEO RESULT:",
                result
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                "Upload video thành công!"
            );

            setVideoFile(null);


            // ==========================================
            // RELOAD LESSONS
            // ==========================================

            const lessonList =
                await loadLessons(
                    selectedCourseId,
                    selectedLesson.id
                );


            // ==========================================
            // UPDATE SELECTED LESSON
            // ==========================================

            if (Array.isArray(lessonList)) {

                const updatedLesson =
                    lessonList.find(
                        lesson =>
                            Number(lesson.id) ===
                            Number(selectedLesson.id)
                    );


                if (updatedLesson) {

                    setSelectedLesson(
                        updatedLesson
                    );

                    console.log(
                        "UPDATED SELECTED LESSON:",
                        updatedLesson
                    );

                }

            }

        } catch (err) {

            console.error(
                "================================="
            );

            console.error(
                "UPLOAD VIDEO ERROR"
            );

            console.error(
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                err.response?.data
            );

            console.error(
                "================================="
            );


            // ==========================================
            // LẤY MESSAGE BACKEND
            // ==========================================

            const backendMessage =
                err.response?.data?.message;


            if (backendMessage) {

                setError(
                    `Upload video thất bại: ${backendMessage}`
                );

            } else if (err.response?.status === 413) {

                setError(
                    "Video quá lớn. Vui lòng chọn video nhỏ hơn."
                );

            } else if (err.response?.status === 401) {

                setError(
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "Bạn không có quyền upload video cho bài học này."
                );

            } else if (err.response?.status === 404) {

                setError(
                    "Không tìm thấy bài học."
                );

            } else {

                setError(
                    "Upload video thất bại. Vui lòng kiểm tra Backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // UPLOAD MATERIAL
    // ==========================================

    const handleUploadMaterial = async () => {

        if (!selectedLesson) {

            setError(
                "Vui lòng chọn bài học"
            );

            return;

        }


        if (!materialFile) {

            setError(
                "Vui lòng chọn tài liệu"
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            console.log(
                "================================="
            );

            console.log(
                "UPLOAD MATERIAL"
            );

            console.log({

                lessonId:
                    selectedLesson.id,

                fileName:
                    materialFile.name,

                fileSize:
                    materialFile.size,

                fileSizeMB: (
                    materialFile.size /
                    1024 /
                    1024
                ).toFixed(2),

                fileType:
                    materialFile.type

            });

            console.log(
                "================================="
            );


            // ==========================================
            // UPLOAD
            // ==========================================

            const result =
                await uploadTeacherMaterialController(
                    selectedLesson.id,
                    materialFile
                );


            console.log(
                "UPLOAD MATERIAL RESULT:",
                result
            );


            setSuccess(
                "Upload tài liệu thành công!"
            );


            setMaterialFile(null);


            // ==========================================
            // LOAD MATERIAL LIST
            // ==========================================

            const data =
                await loadTeacherMaterialsController(
                    selectedLesson.id
                );


            const materialList =
                Array.isArray(data)
                    ? data
                    : data?.data || [];


            setMaterials(
                materialList
            );


        } catch (err) {

            console.error(
                "UPLOAD MATERIAL ERROR:",
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                err.response?.data
            );


            setError(
                err.response?.data?.message ||
                "Upload tài liệu thất bại"
            );


        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // DELETE MATERIAL
    // ==========================================

    const handleDeleteMaterial = async (
        materialId
    ) => {

        const confirmed =
            window.confirm(
                "Bạn có chắc muốn xóa tài liệu này?"
            );


        if (!confirmed) return;


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            await deleteTeacherMaterialController(
                materialId
            );


            setSuccess(
                "Xóa tài liệu thành công!"
            );


            const data =
                await loadTeacherMaterialsController(
                    selectedLesson.id
                );


            const materialList =
                Array.isArray(data)
                    ? data
                    : data?.data || [];


            setMaterials(
                materialList
            );


        } catch (err) {

            console.error(
                "handleDeleteMaterial error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Không thể xóa tài liệu"
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

            {/* ==================================
                HEADER
            ================================== */}

            <div style={styles.header}>

                <div>

                    <h1>
                        Quản lý bài học
                    </h1>

                    <p>
                        Quản lý bài học, video và
                        tài liệu của khóa học
                    </p>

                </div>


                <button

                    style={
                        styles.backButton
                    }

                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }

                >
                    ← Quản lý khóa học

                </button>

            </div>


            {/* ==================================
                MESSAGE
            ================================== */}

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


            {/* ==================================
                COURSE SELECT
            ================================== */}

            <div style={styles.card}>

                <h2>
                    1. Chọn khóa học
                </h2>


                <select

                    value={
                        selectedCourseId
                    }

                    onChange={
                        handleCourseChange
                    }

                    style={styles.select}

                >

                    <option value="">

                        -- Chọn khóa học --

                    </option>


                    {courses.map(course => (

                        <option

                            key={course.id}

                            value={course.id}

                        >

                            {course.title}

                            {" "}
                            [{course.status}]

                        </option>

                    ))}

                </select>


                {courses.length === 0 && (

                    <p style={styles.empty}>

                        Bạn chưa có khóa học nào.

                    </p>

                )}

            </div>


            {/* ==================================
                LESSON FORM
            ================================== */}

            {selectedCourseId && (

                <div style={styles.card}>

                    <h2>

                        2.{" "}

                        {editingLessonId
                            ? "Chỉnh sửa bài học"
                            : "Thêm bài học"}

                    </h2>


                    <form
                        onSubmit={
                            handleSubmitLesson
                        }
                    >

                        <label
                            style={styles.label}
                        >
                            Tên bài học
                        </label>


                        <input

                            type="text"

                            name="title"

                            value={
                                lessonForm.title
                            }

                            onChange={
                                handleFormChange
                            }

                            placeholder={
                                "Ví dụ: Giới thiệu ReactJS"
                            }

                            style={styles.input}

                        />


                        <label
                            style={styles.label}
                        >
                            Mô tả
                        </label>


                        <textarea

                            name="description"

                            value={
                                lessonForm.description
                            }

                            onChange={
                                handleFormChange
                            }

                            placeholder={
                                "Mô tả nội dung bài học"
                            }

                            style={
                                styles.textarea
                            }

                        />


                        <div
                            style={styles.row}
                        >

                            <div
                                style={
                                    styles.column
                                }
                            >

                                <label
                                    style={
                                        styles.label
                                    }
                                >
                                    Thời lượng (giây)
                                </label>


                                <input

                                    type="number"

                                    name="duration"

                                    min="0"

                                    value={
                                        lessonForm.duration
                                    }

                                    onChange={
                                        handleFormChange
                                    }

                                    style={
                                        styles.input
                                    }

                                />

                            </div>


                            <div
                                style={
                                    styles.column
                                }
                            >

                                <label
                                    style={
                                        styles.label
                                    }
                                >
                                    Thứ tự
                                </label>


                                <input

                                    type="number"

                                    name="lesson_order"

                                    min="1"

                                    value={
                                        lessonForm.lesson_order
                                    }

                                    onChange={
                                        handleFormChange
                                    }

                                    style={
                                        styles.input
                                    }

                                />

                            </div>

                        </div>


                        <label
                            style={
                                styles.checkbox
                            }
                        >

                            <input

                                type="checkbox"

                                name="is_preview"

                                checked={
                                    lessonForm.is_preview
                                }

                                onChange={
                                    handleFormChange
                                }

                            />

                            Cho phép học viên
                            xem trước

                        </label>


                        <div
                            style={
                                styles.buttonRow
                            }
                        >

                            <button

                                type="submit"

                                disabled={loading}

                                style={
                                    styles.primaryButton
                                }

                            >

                                {editingLessonId
                                    ? "Cập nhật bài học"
                                    : "Thêm bài học"}

                            </button>


                            {editingLessonId && (

                                <button

                                    type="button"

                                    onClick={
                                        resetLessonForm
                                    }

                                    style={
                                        styles.secondaryButton
                                    }

                                >
                                    Hủy
                                </button>

                            )}

                        </div>

                    </form>

                </div>

            )}


            {/* ==================================
                LESSON LIST
            ================================== */}

            {selectedCourseId && (

                <div style={styles.card}>

                    <h2>
                        3. Danh sách bài học
                    </h2>


                    {loading && (

                        <p>
                            Đang xử lý...
                        </p>

                    )}


                    {!loading &&
                        lessons.length === 0 && (

                            <div
                                style={
                                    styles.empty
                                }
                            >

                                Chưa có bài học nào.

                            </div>

                        )}


                    {lessons.map(
                        (lesson, index) => (

                            <div

                                key={lesson.id}

                                style={{

                                    ...styles.lessonCard,

                                    border:
                                        selectedLesson?.id ===
                                            lesson.id

                                            ? "2px solid #333"

                                            : "1px solid #ddd"

                                }}

                            >

                                <div
                                    style={
                                        styles.lessonHeader
                                    }
                                >

                                    <div>

                                        <h3>

                                            Bài{" "}

                                            {lesson.lesson_order ||
                                                index + 1}

                                            {": "}

                                            {lesson.title}

                                        </h3>


                                        <p>

                                            {lesson.description ||
                                                "Không có mô tả"}

                                        </p>


                                        <small>

                                            Thời lượng:{" "}

                                            {lesson.duration ||
                                                0}

                                            {" giây"}

                                            {" | "}

                                            {lesson.is_preview

                                                ? "👁 Có thể xem trước"

                                                : "🔒 Không xem trước"}

                                            {" | "}

                                            {lesson.video_url ? (
                                                <>
                                                    <strong>
                                                        ✅ Đã có video
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        Video đã được upload.
                                                        Upload video mới sẽ thay thế
                                                        video hiện tại.
                                                    </small>
                                                </>
                                            ) : (
                                                <>
                                                    <strong>
                                                        ❌ Chưa có video
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        Bài học chưa có video.
                                                    </small>
                                                </>
                                            )}

                                        </small>

                                    </div>


                                    <div
                                        style={
                                            styles.buttonRow
                                        }
                                    >

                                        <button

                                            onClick={() =>
                                                handleSelectLesson(
                                                    lesson
                                                )
                                            }

                                            style={
                                                styles.infoButton
                                            }

                                        >
                                            Quản lý
                                        </button>


                                        <button

                                            onClick={() =>
                                                handleEditLesson(
                                                    lesson
                                                )
                                            }

                                            style={
                                                styles.warningButton
                                            }

                                        >
                                            Sửa
                                        </button>


                                        <button

                                            onClick={() =>
                                                handleDeleteLesson(
                                                    lesson.id
                                                )
                                            }

                                            style={
                                                styles.dangerButton
                                            }

                                        >
                                            Xóa
                                        </button>

                                    </div>

                                </div>


                                {/* ==========================
                                    MANAGEMENT
                                ========================== */}

                                {selectedLesson?.id ===
                                    lesson.id && (

                                        <div
                                            style={
                                                styles.managementArea
                                            }
                                        >

                                            {/* ==================
                                            VIDEO
                                        ================== */}

                                            <h4>
                                                🎬 Video bài học
                                            </h4>


                                            <p>

                                                {lesson.video_url

                                                    ? "✅ Đã có video"

                                                    : "❌ Chưa có video"}

                                            </p>


                                            <input

                                                type="file"

                                               accept="video/mp4,video/mpeg,video/webm,video/quicktime"

                                                onChange={
                                                    event =>
                                                        setVideoFile(
                                                            event.target.files?.[0] ||
                                                            null
                                                        )
                                                }

                                            />


                                            <br />

                                            <br />


                                            <button

                                                onClick={
                                                    handleUploadVideo
                                                }

                                                disabled={
                                                    loading ||
                                                    !videoFile
                                                }

                                                style={
                                                    styles.primaryButton
                                                }

                                            >
                                                Upload video

                                            </button>


                                            {/* ==================
                                            MATERIAL
                                        ================== */}

                                            <hr />


                                            <h4>
                                                📚 Tài liệu bài học
                                            </h4>


                                            <div
                                                style={
                                                    styles.uploadRow
                                                }
                                            >

                                                <input

                                                    type="file"

                                                    onChange={
                                                        event =>
                                                            setMaterialFile(
                                                                event.target.files?.[0] ||
                                                                null
                                                            )
                                                    }

                                                />


                                                <button

                                                    onClick={
                                                        handleUploadMaterial
                                                    }

                                                    disabled={
                                                        loading ||
                                                        !materialFile
                                                    }

                                                    style={
                                                        styles.primaryButton
                                                    }

                                                >
                                                    Upload tài liệu

                                                </button>

                                            </div>


                                            {/* ==================
                                            MATERIAL LIST
                                        ================== */}

                                            <div
                                                style={
                                                    styles.materialList
                                                }
                                            >

                                                {materials.length === 0 ? (

                                                    <p>
                                                        Chưa có tài liệu.
                                                    </p>

                                                ) : (

                                                    materials.map(
                                                        material => (

                                                            <div

                                                                key={
                                                                    material.id
                                                                }

                                                                style={
                                                                    styles.materialItem
                                                                }

                                                            >

                                                                <div>

                                                                    <strong>

                                                                        📄{" "}

                                                                        {material.name ||
                                                                            material.file_name ||
                                                                            "Tài liệu"}

                                                                    </strong>


                                                                    <br />


                                                                    <small>

                                                                        {material.file_type ||
                                                                            "Không xác định"}

                                                                    </small>

                                                                </div>


                                                                <button

                                                                    onClick={() =>
                                                                        handleDeleteMaterial(
                                                                            material.id
                                                                        )
                                                                    }

                                                                    style={
                                                                        styles.dangerButton
                                                                    }

                                                                >
                                                                    Xóa
                                                                </button>

                                                            </div>

                                                        )
                                                    )

                                                )}

                                            </div>

                                        </div>

                                    )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


// ==========================================
// STYLES
// ==========================================

const styles = {

    container: {
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f5f5f5",
        minHeight: "100vh"
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        gap: "20px"
    },


    card: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "25px",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)"
    },


    select: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
        boxSizing: "border-box"
    },


    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "600"
    },


    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        boxSizing: "border-box"
    },


    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        resize: "vertical",
        boxSizing: "border-box"
    },


    row: {
        display: "flex",
        gap: "20px"
    },


    column: {
        flex: 1
    },


    checkbox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "20px"
    },


    buttonRow: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },


    uploadRow: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flexWrap: "wrap"
    },


    primaryButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#333",
        color: "white"
    },


    secondaryButton: {
        padding: "10px 16px",
        border: "1px solid #aaa",
        borderRadius: "6px",
        cursor: "pointer",
        background: "white"
    },


    infoButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#1976d2",
        color: "white"
    },


    warningButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#f39c12",
        color: "white"
    },


    dangerButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        background: "#d32f2f",
        color: "white"
    },


    backButton: {
        padding: "10px 16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "pointer",
        background: "white"
    },


    error: {
        background: "#ffebee",
        color: "#c62828",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "15px"
    },


    success: {
        background: "#e8f5e9",
        color: "#2e7d32",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "15px"
    },


    empty: {
        padding: "20px",
        textAlign: "center",
        color: "#777"
    },


    lessonCard: {
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "15px"
    },


    lessonHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        alignItems: "flex-start"
    },


    managementArea: {
        marginTop: "20px",
        padding: "20px",
        background: "#f8f8f8",
        borderRadius: "8px"
    },


    materialList: {
        marginTop: "20px"
    },


    materialItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        padding: "12px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        marginBottom: "8px"
    }

};


export default TeacherLessonManagement;