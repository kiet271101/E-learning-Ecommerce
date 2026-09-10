import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    loadLessonsController,
    loadMaterialsController,
    loadLessonProgressController,
    updateProgressController,
    loadCourseProgressController
} from "../../controllers/learningController";


// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL = "http://localhost:5000/api";


// ==========================================
// COMPONENT
// ==========================================

function LearningPage() {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const videoRef = useRef(null);

    // Dùng để nhớ thời điểm cuối cùng đã lưu
    const lastSavedTimeRef = useRef(0);


    // ==========================================
    // STATES
    // ==========================================

    const [lessons, setLessons] = useState([]);

    const [selectedLesson, setSelectedLesson] =
        useState(null);

    const [materials, setMaterials] =
        useState([]);

    const [progress, setProgress] =
        useState(null);

    const [courseProgress, setCourseProgress] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [materialLoading, setMaterialLoading] =
        useState(false);

    const [videoLoading, setVideoLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [videoError, setVideoError] =
        useState("");

    const [savingProgress, setSavingProgress] =
        useState(false);

    const [videoUrl, setVideoUrl] =
        useState("");


    // ==========================================
    // GET TOKEN
    // ==========================================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // ==========================================
    // LOAD LESSONS + COURSE PROGRESS
    // ==========================================

    useEffect(() => {

        let mounted = true;


        const loadData = async () => {

            try {

                setLoading(true);

                setError("");


                // ----------------------------------
                // CHECK LOGIN
                // ----------------------------------

                const token = getToken();

                if (!token) {

                    navigate("/login");

                    return;

                }


                // ----------------------------------
                // LOAD LESSONS
                // ----------------------------------

                const result =
                    await loadLessonsController(courseId);


                if (!result.success) {

                    if (mounted) {

                        setError(
                            result.message ||
                            "Không thể tải danh sách bài học."
                        );

                    }

                    return;

                }


                const lessonList =
                    Array.isArray(result.data)
                        ? result.data
                        : [];


                if (mounted) {

                    setLessons(lessonList);


                    // Chọn bài đầu tiên
                    if (lessonList.length > 0) {

                        setSelectedLesson(
                            lessonList[0]
                        );

                    }

                }


                // ----------------------------------
                // LOAD COURSE PROGRESS
                // ----------------------------------

                const progressResult =
                    await loadCourseProgressController(
                        courseId
                    );


                if (
                    mounted &&
                    progressResult.success
                ) {

                    setCourseProgress(
                        progressResult.data
                    );

                }

            } catch (err) {

                console.error(
                    "LearningPage load error:",
                    err
                );


                if (mounted) {

                    setError(
                        err.message ||
                        "Không thể tải dữ liệu khóa học."
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        };


        loadData();


        return () => {

            mounted = false;

        };

    }, [courseId, navigate]);


    // ==========================================
    // LOAD VIDEO
    // ==========================================

    const loadVideo = async (lessonId) => {

        try {

            setVideoLoading(true);

            setVideoError("");

            setVideoUrl("");


            const token = getToken();


            if (!token) {

                navigate("/login");

                return;

            }


            const response =
                await fetch(
                    `${API_BASE_URL}/lessons/${lessonId}/video`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            // ----------------------------------
            // UNAUTHORIZED
            // ----------------------------------

            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;

            }


            // ----------------------------------
            // FORBIDDEN
            // ----------------------------------

            if (response.status === 403) {

                throw new Error(
                    "Bạn không có quyền xem video bài học này."
                );

            }


            // ----------------------------------
            // OTHER ERROR
            // ----------------------------------

            if (!response.ok) {

                throw new Error(
                    `Không thể tải video. HTTP ${response.status}`
                );

            }


            // ----------------------------------
            // CONVERT TO BLOB
            // ----------------------------------

            const blob =
                await response.blob();


            if (!blob || blob.size === 0) {

                throw new Error(
                    "Video không có dữ liệu."
                );

            }


            // ----------------------------------
            // CREATE LOCAL URL
            // ----------------------------------

            const objectUrl =
                window.URL.createObjectURL(
                    blob
                );


            setVideoUrl(objectUrl);

        } catch (err) {

            console.error(
                "Load video error:",
                err
            );


            setVideoError(
                err.message ||
                "Không thể tải video."
            );

        } finally {

            setVideoLoading(false);

        }

    };


    // ==========================================
    // LOAD SELECTED LESSON DATA
    // ==========================================

    useEffect(() => {

        if (!selectedLesson) {

            return;

        }


        let mounted = true;

        let oldVideoUrl = "";


        const loadLessonData = async () => {

            try {

                setMaterialLoading(true);

                setVideoError("");

                setMaterials([]);

                setProgress(null);

                lastSavedTimeRef.current = 0;


                // ----------------------------------
                // LOAD MATERIALS
                // ----------------------------------

                const materialResult =
                    await loadMaterialsController(
                        selectedLesson.id
                    );


                if (
                    mounted &&
                    materialResult.success
                ) {

                    setMaterials(
                        Array.isArray(
                            materialResult.data
                        )
                            ? materialResult.data
                            : []
                    );

                }


                // ----------------------------------
                // LOAD LESSON PROGRESS
                // ----------------------------------

                const progressResult =
                    await loadLessonProgressController(
                        selectedLesson.id
                    );


                if (
                    mounted &&
                    progressResult.success
                ) {

                    setProgress(
                        progressResult.data
                    );


                    if (
                        progressResult.data &&
                        progressResult.data.watched_seconds
                    ) {

                        lastSavedTimeRef.current =
                            Number(
                                progressResult.data
                                    .watched_seconds
                            ) || 0;

                    }

                }


                // ----------------------------------
                // LOAD VIDEO
                // ----------------------------------

                if (mounted) {

                    await loadVideo(
                        selectedLesson.id
                    );

                }

            } catch (err) {

                console.error(
                    "Load lesson data error:",
                    err
                );


                if (mounted) {

                    setVideoError(
                        err.message ||
                        "Không thể tải bài học."
                    );

                }

            } finally {

                if (mounted) {

                    setMaterialLoading(false);

                }

            }

        };


        // Save current URL before loading
        oldVideoUrl = videoUrl;


        loadLessonData();


        return () => {

            mounted = false;


            // ----------------------------------
            // RELEASE BLOB URL
            // ----------------------------------

            if (oldVideoUrl) {

                window.URL.revokeObjectURL(
                    oldVideoUrl
                );

            }

        };

    }, [selectedLesson?.id]);


    // ==========================================
    // CLEAN VIDEO URL WHEN COMPONENT UNMOUNTS
    // ==========================================

    useEffect(() => {

        return () => {

            if (videoUrl) {

                window.URL.revokeObjectURL(
                    videoUrl
                );

            }

        };

    }, [videoUrl]);


    // ==========================================
    // SET VIDEO POSITION
    // ==========================================

    const handleVideoLoadedMetadata = () => {

        if (
            !videoRef.current ||
            !progress
        ) {

            return;

        }


        const watchedSeconds =
            Number(
                progress.watched_seconds
            ) || 0;


        const duration =
            Number(
                videoRef.current.duration
            ) || 0;


        // Chỉ seek nếu thời gian đã xem hợp lệ
        if (
            watchedSeconds > 0 &&
            duration > 0 &&
            watchedSeconds < duration - 2
        ) {

            videoRef.current.currentTime =
                watchedSeconds;

        }

    };


    // ==========================================
    // SELECT LESSON
    // ==========================================

    const handleSelectLesson = (lesson) => {

        if (
            selectedLesson?.id === lesson.id
        ) {

            return;

        }


        // Giải phóng video hiện tại
        if (videoUrl) {

            window.URL.revokeObjectURL(
                videoUrl
            );

        }


        setVideoUrl("");

        setMaterials([]);

        setProgress(null);

        setVideoError("");

        setSelectedLesson(lesson);

    };


    // ==========================================
    // SAVE VIDEO PROGRESS
    // ==========================================

    const saveProgress = async (
        watchedSeconds,
        isCompleted = false
    ) => {

        if (!selectedLesson) {

            return;

        }


        if (
            !isCompleted &&
            watchedSeconds <= 0
        ) {

            return;

        }


        // Không lưu lại thời gian nhỏ hơn
        // thời gian đã lưu
        if (
            !isCompleted &&
            watchedSeconds <=
            lastSavedTimeRef.current
        ) {

            return;

        }


        try {

            setSavingProgress(true);


            const result =
                await updateProgressController(
                    selectedLesson.id,
                    watchedSeconds,
                    isCompleted
                );


            if (result.success) {

                setProgress(
                    result.data
                );


                lastSavedTimeRef.current =
                    watchedSeconds;

            }

        } catch (err) {

            console.error(
                "Save progress error:",
                err
            );

        } finally {

            setSavingProgress(false);

        }

    };


    // ==========================================
    // VIDEO TIME UPDATE
    // ==========================================

    const handleTimeUpdate = async () => {

        if (
            !videoRef.current ||
            !selectedLesson ||
            savingProgress
        ) {

            return;

        }


        const currentTime =
            Math.floor(
                videoRef.current.currentTime
            );


        // Không gọi API liên tục
        // Chỉ lưu mỗi 10 giây
        if (
            currentTime <= 0 ||
            currentTime % 10 !== 0
        ) {

            return;

        }


        // Nếu đã lưu mốc này rồi thì bỏ qua
        if (
            currentTime <=
            lastSavedTimeRef.current
        ) {

            return;

        }


        await saveProgress(
            currentTime,
            false
        );

    };


    // ==========================================
    // VIDEO ENDED
    // ==========================================

    const handleVideoEnded = async () => {

        if (!selectedLesson) {

            return;

        }


        const duration =
            videoRef.current
                ? Math.floor(
                    videoRef.current.duration
                )
                : 0;


        const result =
            await updateProgressController(
                selectedLesson.id,
                duration,
                true
            );


        if (result.success) {

            setProgress(
                result.data
            );


            lastSavedTimeRef.current =
                duration;


            // ----------------------------------
            // RELOAD COURSE PROGRESS
            // ----------------------------------

            const courseResult =
                await loadCourseProgressController(
                    courseId
                );


            if (
                courseResult.success
            ) {

                setCourseProgress(
                    courseResult.data
                );

            }

        }

    };


    // ==========================================
    // DOWNLOAD MATERIAL
    // ==========================================

    const handleDownload = async (
        material
    ) => {

        try {

            const token =
                getToken();


            if (!token) {

                navigate("/login");

                return;

            }


            const response =
                await fetch(
                    `${API_BASE_URL}/materials/${material.id}/download`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;

            }


            if (response.status === 403) {

                throw new Error(
                    "Bạn không có quyền tải tài liệu này."
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Không thể tải tài liệu."
                );

            }


            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                material.name ||
                "document";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );

        } catch (err) {

            console.error(
                "Download material error:",
                err
            );


            alert(
                err.message ||
                "Không thể tải tài liệu."
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div style={styles.center}>

                <h2>
                    Đang tải khóa học...
                </h2>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div style={styles.center}>

                <h2>
                    Không thể tải khóa học
                </h2>

                <p style={styles.errorText}>
                    {error}
                </p>

                <button
                    style={styles.backButton}
                    onClick={() =>
                        navigate("/my-courses")
                    }
                >
                    ← Quay lại khóa học
                </button>

            </div>

        );

    }


    // ==========================================
    // VIEW
    // ==========================================

    return (

        <div style={styles.page}>

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <header style={styles.header}>

                <div>

                    <h2 style={styles.logo}>
                        E-Learning
                    </h2>

                    <p style={styles.subtitle}>
                        Khu vực học tập
                    </p>

                </div>


                <button
                    style={styles.backButton}
                    onClick={() =>
                        navigate(
                            `/courses/${courseId}`
                        )
                    }
                >
                    ← Chi tiết khóa học
                </button>

            </header>


            {/* ================================= */}
            {/* COURSE PROGRESS */}
            {/* ================================= */}

            <div style={styles.progressBox}>

                <div style={styles.progressHeader}>

                    <strong>
                        Tiến độ khóa học
                    </strong>

                    <span style={styles.progressText}>

                        {
                            courseProgress?.percentage
                            ?? 0
                        }%

                    </span>

                </div>


                <div
                    style={
                        styles.progressBackground
                    }
                >

                    <div
                        style={{
                            ...styles.progressBar,

                            width:
                                `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(
                                            courseProgress?.percentage
                                            ?? 0
                                        )
                                    )
                                )}%`
                        }}
                    />

                </div>


                <small>

                    {
                        courseProgress?.completedLessons
                        ?? 0
                    }

                    {" / "}

                    {
                        courseProgress?.totalLessons
                        ?? lessons.length
                    }

                    {" bài học hoàn thành"}

                </small>

            </div>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <div style={styles.main}>

                {/* ================================= */}
                {/* SIDEBAR */}
                {/* ================================= */}

                <aside style={styles.sidebar}>

                    <h3>
                        Nội dung khóa học
                    </h3>


                    {lessons.length === 0 ? (

                        <p>
                            Khóa học chưa có bài học.
                        </p>

                    ) : (

                        lessons.map(
                            (lesson, index) => {

                                const isActive =
                                    selectedLesson?.id ===
                                    lesson.id;


                                return (

                                    <button
                                        key={lesson.id}

                                        style={{
                                            ...styles.lessonItem,

                                            ...(isActive
                                                ? styles.activeLesson
                                                : {})
                                        }}

                                        onClick={() =>
                                            handleSelectLesson(
                                                lesson
                                            )
                                        }
                                    >

                                        <div
                                            style={
                                                styles.lessonInfo
                                            }
                                        >

                                            <strong>
                                                Bài{" "}
                                                {
                                                    lesson.lesson_order
                                                    ||
                                                    index + 1
                                                }
                                            </strong>

                                            <div
                                                style={
                                                    styles.lessonTitle
                                                }
                                            >
                                                {
                                                    lesson.title
                                                }
                                            </div>

                                        </div>


                                        <div
                                            style={
                                                styles.lessonIcon
                                            }
                                        >

                                            {lesson.is_preview
                                                ? "👁"
                                                : ""}

                                        </div>

                                    </button>

                                );

                            }
                        )

                    )}

                </aside>


                {/* ================================= */}
                {/* CONTENT */}
                {/* ================================= */}

                <main style={styles.content}>

                    {selectedLesson ? (

                        <>

                            {/* -------------------------------- */}
                            {/* LESSON TITLE */}
                            {/* -------------------------------- */}

                            <h1>
                                {selectedLesson.title}
                            </h1>


                            {selectedLesson.description && (

                                <p
                                    style={
                                        styles.description
                                    }
                                >
                                    {
                                        selectedLesson.description
                                    }
                                </p>

                            )}


                            {/* ================================= */}
                            {/* VIDEO */}
                            {/* ================================= */}

                            <div
                                style={
                                    styles.videoContainer
                                }
                            >

                                {videoLoading ? (

                                    <div
                                        style={
                                            styles.videoLoading
                                        }
                                    >

                                        <div
                                            style={
                                                styles.spinner
                                            }
                                        />

                                        <p>
                                            Đang tải video...
                                        </p>

                                    </div>

                                ) : videoError ? (

                                    <div
                                        style={
                                            styles.videoError
                                        }
                                    >

                                        <h3>
                                            Không thể tải video
                                        </h3>

                                        <p>
                                            {videoError}
                                        </p>

                                        <button
                                            style={
                                                styles.retryButton
                                            }
                                            onClick={() =>
                                                loadVideo(
                                                    selectedLesson.id
                                                )
                                            }
                                        >
                                            Thử lại
                                        </button>

                                    </div>

                                ) : videoUrl ? (

                                    <video
                                        ref={videoRef}

                                        controls

                                        preload="metadata"

                                        style={
                                            styles.video
                                        }

                                        src={videoUrl}

                                        onLoadedMetadata={
                                            handleVideoLoadedMetadata
                                        }

                                        onTimeUpdate={
                                            handleTimeUpdate
                                        }

                                        onEnded={
                                            handleVideoEnded
                                        }
                                    >

                                        Trình duyệt không hỗ trợ
                                        video.

                                    </video>

                                ) : (

                                    <div
                                        style={
                                            styles.videoLoading
                                        }
                                    >

                                        <p>
                                            Video chưa sẵn sàng.
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* ================================= */}
                            {/* LESSON PROGRESS */}
                            {/* ================================= */}

                            <div
                                style={
                                    styles.lessonProgress
                                }
                            >

                                <div
                                    style={
                                        styles.lessonProgressHeader
                                    }
                                >

                                    <strong>
                                        Tiến độ bài học:
                                    </strong>

                                    {" "}

                                    {
                                        progress?.is_completed
                                            ? "✅ Đã hoàn thành"
                                            : "⏳ Chưa hoàn thành"
                                    }

                                </div>


                                <small>

                                    Đã xem:{" "}

                                    {
                                        progress?.watched_seconds
                                        ?? 0
                                    }

                                    {" giây"}

                                </small>


                                {savingProgress && (

                                    <small
                                        style={
                                            styles.savingText
                                        }
                                    >
                                        Đang lưu tiến độ...
                                    </small>

                                )}

                            </div>


                            {/* ================================= */}
                            {/* MATERIALS */}
                            {/* ================================= */}

                            <div
                                style={
                                    styles.materialSection
                                }
                            >

                                <h2>
                                    📚 Tài liệu bài học
                                </h2>


                                {materialLoading ? (

                                    <p>
                                        Đang tải tài liệu...
                                    </p>

                                ) : materials.length === 0 ? (

                                    <p
                                        style={
                                            styles.emptyText
                                        }
                                    >
                                        Bài học chưa có tài liệu.
                                    </p>

                                ) : (

                                    materials.map(
                                        (material) => (

                                            <div
                                                key={
                                                    material.id
                                                }

                                                style={
                                                    styles.material
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.materialInfo
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.fileIcon
                                                        }
                                                    >
                                                        📄
                                                    </span>


                                                    <div>

                                                        <strong>
                                                            {
                                                                material.name
                                                            }
                                                        </strong>


                                                        {material.file_type && (

                                                            <small
                                                                style={
                                                                    styles.fileType
                                                                }
                                                            >
                                                                {
                                                                    material.file_type
                                                                }
                                                            </small>

                                                        )}

                                                    </div>

                                                </div>


                                                <button
                                                    style={
                                                        styles.downloadButton
                                                    }

                                                    onClick={() =>
                                                        handleDownload(
                                                            material
                                                        )
                                                    }
                                                >
                                                    Tải xuống
                                                </button>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </>

                    ) : (

                        <div style={styles.emptyLesson}>

                            <h2>
                                Chưa có bài học
                            </h2>

                            <p>
                                Vui lòng chọn một bài học.
                            </p>

                        </div>

                    )}

                </main>

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
        background: "#f5f5f5"
    },


    // ----------------------------------------
    // HEADER
    // ----------------------------------------

    header: {
        background: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ddd"
    },


    logo: {
        margin: 0
    },


    subtitle: {
        margin: "5px 0 0",
        color: "#666"
    },


    backButton: {
        padding: "10px 16px",
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#fff"
    },


    // ----------------------------------------
    // COURSE PROGRESS
    // ----------------------------------------

    progressBox: {
        background: "#fff",
        padding: "20px 40px",
        borderBottom: "1px solid #ddd"
    },


    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },


    progressText: {
        fontWeight: "bold"
    },


    progressBackground: {
        height: "10px",
        background: "#ddd",
        borderRadius: "10px",
        margin: "10px 0",
        overflow: "hidden"
    },


    progressBar: {
        height: "100%",
        background: "#333",
        borderRadius: "10px",
        transition: "width 0.3s ease"
    },


    // ----------------------------------------
    // MAIN
    // ----------------------------------------

    main: {
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        minHeight: "calc(100vh - 200px)"
    },


    // ----------------------------------------
    // SIDEBAR
    // ----------------------------------------

    sidebar: {
        background: "#fff",
        borderRight: "1px solid #ddd",
        padding: "20px",
        overflowY: "auto"
    },


    lessonItem: {
        width: "100%",
        padding: "15px",
        marginBottom: "8px",
        textAlign: "left",
        border: "1px solid #ddd",
        borderRadius: "6px",
        background: "#fff",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },


    activeLesson: {
        border: "2px solid #333",
        background: "#fafafa"
    },


    lessonInfo: {
        flex: 1
    },


    lessonTitle: {
        marginTop: "5px",
        lineHeight: "1.4"
    },


    lessonIcon: {
        marginLeft: "10px"
    },


    // ----------------------------------------
    // CONTENT
    // ----------------------------------------

    content: {
        padding: "35px",
        maxWidth: "1000px",
        width: "100%",
        boxSizing: "border-box"
    },


    description: {
        color: "#666",
        lineHeight: "1.6"
    },


    // ----------------------------------------
    // VIDEO
    // ----------------------------------------

    videoContainer: {
        background: "#000",
        width: "100%",
        marginTop: "25px",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    video: {
        width: "100%",
        maxHeight: "600px",
        display: "block"
    },


    videoLoading: {
        minHeight: "300px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
    },


    videoError: {
        minHeight: "300px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: "30px",
        boxSizing: "border-box",
        textAlign: "center"
    },


    spinner: {
        width: "35px",
        height: "35px",
        border: "4px solid #ddd",
        borderTop: "4px solid #333",
        borderRadius: "50%"
    },


    retryButton: {
        marginTop: "10px",
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },


    // ----------------------------------------
    // LESSON PROGRESS
    // ----------------------------------------

    lessonProgress: {
        background: "#fff",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "8px"
    },


    lessonProgressHeader: {
        marginBottom: "8px"
    },


    savingText: {
        display: "block",
        marginTop: "8px",
        color: "#666"
    },


    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------

    materialSection: {
        background: "#fff",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "8px"
    },


    material: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 0",
        borderBottom: "1px solid #eee",
        gap: "15px"
    },


    materialInfo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0
    },


    fileIcon: {
        fontSize: "24px"
    },


    fileType: {
        display: "block",
        marginTop: "4px",
        color: "#777"
    },


    downloadButton: {
        padding: "9px 15px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#fff",
        cursor: "pointer",
        whiteSpace: "nowrap"
    },


    // ----------------------------------------
    // EMPTY
    // ----------------------------------------

    emptyText: {
        color: "#777"
    },


    emptyLesson: {
        background: "#fff",
        padding: "40px",
        borderRadius: "8px",
        textAlign: "center"
    },


    // ----------------------------------------
    // ERROR
    // ----------------------------------------

    errorText: {
        color: "#c00",
        marginBottom: "20px"
    },


    // ----------------------------------------
    // CENTER
    // ----------------------------------------

    center: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box"
    }

};


export default LearningPage;