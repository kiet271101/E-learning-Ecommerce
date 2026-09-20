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

import "../../styles/LearningPage.css";

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

            <div className="learning-center">

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

            <div className="learning-center">

                <h2>
                    Không thể tải khóa học
                </h2>

                <p className="learning-error-text">
                    {error}
                </p>

                <button
                    className="learning-back-button"
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

        <div className="learning-page">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <header className="learning-header">

                <div>

                    <h2 className="learning-logo">
                        E-Learning
                    </h2>

                    <p className="learning-subtitle">
                        Khu vực học tập
                    </p>

                </div>


                <button
                    className="learning-back-button"
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

            <div className="learning-progress-box">

                <div className="learning-progress-header">

                    <strong>
                        Tiến độ khóa học
                    </strong>

                    <span className="learning-progress-text">

                        {
                            courseProgress?.percentage
                            ?? 0
                        }%

                    </span>

                </div>


                <div
                    className="learning-progress-background"
                >

                    <div
                        className="learning-progress-bar"
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(
                                    0,
                                    Number(courseProgress?.percentage ?? 0)
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

            <div className="learning-main">

                {/* ================================= */}
                {/* SIDEBAR */}
                {/* ================================= */}

                <aside className="learning-sidebar">

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

                                        className={`learning-lesson-item ${isActive ? "learning-lesson-item-active" : ""
                                            }`}
                                        onClick={() =>
                                            handleSelectLesson(
                                                lesson
                                            )
                                        }
                                    >

                                        <div
                                            className="learning-lesson-info"
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
                                                className=" learning-lesson-title"
                                            >
                                                {
                                                    lesson.title
                                                }
                                            </div>

                                        </div>


                                        <div
                                            className="learning-lesson-icon"
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

                <main className="learning-content">

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
                                    className="learning-description"
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
                                className="learning-video-container"
                            >

                                {videoLoading ? (

                                    <div
                                        className="learning-video-loading"
                                    >

                                        <div
                                            className="learning-spinner"
                                        />

                                        <p>
                                            Đang tải video...
                                        </p>

                                    </div>

                                ) : videoError ? (

                                    <div
                                        className="learning-video-error"
                                    >

                                        <h3>
                                            Không thể tải video
                                        </h3>

                                        <p>
                                            {videoError}
                                        </p>

                                        <button
                                            className="learning-retry-button"
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

                                        className="learning-video"

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
                                        className="learning-video-loading"
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
                                className="learning-lesson-progress"
                            >

                                <div
                                    className="learning-lesson-progress-header"
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
                                        className="learning-saving-text"
                                    >
                                        Đang lưu tiến độ...
                                    </small>

                                )}

                            </div>


                            {/* ================================= */}
                            {/* MATERIALS */}
                            {/* ================================= */}

                            <div
                                className="learning-material-section"
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
                                        className="learning-empty-text"
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

                                                className="learning-material"
                                            >

                                                <div
                                                    className="learning-material-info"
                                                >

                                                    <span
                                                        className="learning-file-icon"
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
                                                                className="learning-file-type"
                                                            >
                                                                {
                                                                    material.file_type
                                                                }
                                                            </small>

                                                        )}

                                                    </div>

                                                </div>


                                                <button
                                                    className="learning-download-button"

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

                        <div className="learning-empty-lesson">

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




export default LearningPage;