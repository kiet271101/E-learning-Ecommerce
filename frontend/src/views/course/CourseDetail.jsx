import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    loadCourseDetail,
    loadCourseLessons,
    loadCourseReviews
} from "../../controllers/courseDetailController";

import authService
    from "../../services/authService";

import {
    checkEnrollmentController,
    enrollCourseController
} from "../../controllers/enrollmentController";


function CourseDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] =
        useState(null);

    const [lessons, setLessons] =
        useState([]);

    const [reviews, setReviews] =
        useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [isEnrolled, setIsEnrolled] =
        useState(false);

    const [enrollmentLoading, setEnrollmentLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            const courseResult =
                await loadCourseDetail(id);

            if (!courseResult.success) {

                setError(
                    courseResult.message
                );

                setLoading(false);

                return;
            }

            setCourse(courseResult.data);


            // ==========================================
            // CHECK ENROLLMENT
            // ==========================================

            if (authService.isLoggedIn()) {

                const enrollmentResult =
                    await checkEnrollmentController(id);

                if (enrollmentResult.success) {

                    const enrollmentData =
                        enrollmentResult.data;

                    setIsEnrolled(
                        enrollmentData.enrolled === true ||
                        enrollmentData.isEnrolled === true
                    );
                }
            }


            // ==========================================
            // LOAD LESSONS
            // ==========================================

            const lessonResult =
                await loadCourseLessons(id);

            if (lessonResult.success) {

                setLessons(
                    lessonResult.data
                );
            }


            // ==========================================
            // LOAD REVIEWS
            // ==========================================

            const reviewResult =
                await loadCourseReviews(id);

            if (reviewResult.success) {

                const reviewData =
                    reviewResult.data;

                setReviews(
                    reviewData.reviews || []
                );

                setAverageRating(
                    reviewData.averageRating || 0
                );

                setTotalReviews(
                    reviewData.totalReviews || 0
                );
            }

            setLoading(false);
        };


        loadData();

    }, [id]);


    // ==========================================
    // HANDLE ENROLL
    // ==========================================

    const handleEnroll = async () => {

        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!authService.isLoggedIn()) {

            navigate("/login");

            return;
        }


        // ==========================================
        // PREVENT DOUBLE CLICK
        // ==========================================

        if (enrollmentLoading) {

            return;
        }


        setEnrollmentLoading(true);


        // ==========================================
        // CALL API
        // ==========================================

        const result =
            await enrollCourseController(id);


        if (!result.success) {

            alert(result.message);

            setEnrollmentLoading(false);

            return;
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Đăng ký khóa học thành công!"
        );

        setIsEnrolled(true);

        setEnrollmentLoading(false);
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div style={styles.container}>

                <h2>
                    Đang tải khóa học...
                </h2>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !course) {

        return (
            <div style={styles.container}>

                <h2>
                    Không thể tải khóa học
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    // ==========================================
    // VIEW
    // ==========================================

    return (
        <div style={styles.container}>

            {/* ================================= */}
            {/* COURSE HEADER */}
            {/* ================================= */}

            <div style={styles.header}>

                <div style={styles.thumbnail}>

                    {course.thumbnail ? (

                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            style={styles.image}
                        />

                    ) : (

                        <div style={styles.noImage}>
                            Không có hình ảnh
                        </div>

                    )}

                </div>


                <div style={styles.info}>

                    <h1>
                        {course.title}
                    </h1>

                    <p>
                        {course.description}
                    </p>


                    {course.category && (
                        <p>
                            <strong>
                                Danh mục:
                            </strong>{" "}
                            {course.category.name}
                        </p>
                    )}


                    {course.teacher && (
                        <p>
                            <strong>
                                Giảng viên:
                            </strong>{" "}
                            {course.teacher.name}
                        </p>
                    )}


                    <div style={styles.rating}>

                        ⭐{" "}
                        {averageRating}

                        {" "}

                        ({totalReviews} đánh giá)

                    </div>


                    <div style={styles.price}>

                        {Number(course.price) === 0
                            ? "Miễn phí"
                            : `${Number(
                                course.price
                            ).toLocaleString(
                                "vi-VN"
                            )} đ`
                        }

                    </div>


                    {isEnrolled ? (

                        <button
                            style={styles.primaryButton}
                            onClick={() => {

                                navigate(
                                    `/learning/${course.id}`
                                );

                            }}
                        >
                            Học ngay
                        </button>

                    ) : Number(course.price) === 0 ? (

                        <button
                            style={styles.primaryButton}
                            onClick={handleEnroll}
                            disabled={enrollmentLoading}
                        >

                            {enrollmentLoading
                                ? "Đang đăng ký..."
                                : "Đăng ký học"
                            }

                        </button>

                    ) : (

                        <button
                            style={styles.primaryButton}
                            onClick={() => {

                                if (!authService.isLoggedIn()) {

                                    navigate("/login");

                                    return;
                                }

                                alert(
                                    "Chức năng mua khóa học sẽ thực hiện ở bước thanh toán."
                                );

                            }}
                        >
                            Mua khóa học
                        </button>

                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* LESSONS */}
            {/* ================================= */}

            <div style={styles.section}>

                <h2>
                    Nội dung khóa học
                </h2>

                <p>
                    {lessons.length} bài học
                </p>


                <div>

                    {lessons.length === 0 ? (

                        <p>
                            Chưa có bài học.
                        </p>

                    ) : (

                        lessons.map(
                            (lesson, index) => (

                                <div
                                    key={lesson.id}
                                    style={styles.lesson}
                                >

                                    <div>

                                        <strong>
                                            Bài{" "}
                                            {lesson.lesson_order ||
                                                index + 1}
                                            :
                                        </strong>{" "}

                                        {lesson.title}

                                    </div>


                                    <div>

                                        {lesson.is_preview ? (
                                            <span>
                                                👁 Xem trước
                                            </span>
                                        ) : (
                                            <span>
                                                🔒 Nội dung học viên
                                            </span>
                                        )}

                                    </div>

                                </div>
                            )
                        )

                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* REVIEWS */}
            {/* ================================= */}

            <div style={styles.section}>

                <h2>
                    Đánh giá khóa học
                </h2>

                <div style={styles.summary}>

                    <strong>
                        ⭐ {averageRating}
                    </strong>

                    <span>
                        {totalReviews} đánh giá
                    </span>

                </div>


                {reviews.length === 0 ? (

                    <p>
                        Chưa có đánh giá nào.
                    </p>

                ) : (

                    reviews.map((review) => (

                        <div
                            key={review.id}
                            style={styles.review}
                        >

                            <strong>
                                {review.student?.name ||
                                    "Học viên"}
                            </strong>

                            <div>
                                {"⭐".repeat(
                                    Number(
                                        review.rating
                                    )
                                )}
                            </div>

                            <p>
                                {review.comment}
                            </p>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px"
    },

    header: {
        display: "grid",
        gridTemplateColumns:
            "minmax(300px, 1fr) 2fr",
        gap: "40px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)"
    },

    thumbnail: {
        width: "100%",
        height: "300px",
        background: "#eee",
        borderRadius: "10px",
        overflow: "hidden"
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },

    noImage: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777"
    },

    info: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    rating: {
        fontSize: "18px"
    },

    price: {
        fontSize: "28px",
        fontWeight: "bold"
    },

    primaryButton: {
        width: "200px",
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px"
    },

    section: {
        marginTop: "30px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px"
    },

    lesson: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px",
        borderBottom:
            "1px solid #eee"
    },

    summary: {
        display: "flex",
        gap: "20px",
        margin: "20px 0"
    },

    review: {
        padding: "20px 0",
        borderBottom:
            "1px solid #eee"
    }

};

export default CourseDetail;