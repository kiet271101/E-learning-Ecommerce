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

import {
    createReviewController,
    updateReviewController,
    deleteReviewController
} from "../../controllers/reviewController";


function CourseDetail() {

    const { id } = useParams();

    const navigate = useNavigate();


    // ==========================================
    // COURSE
    // ==========================================

    const [course, setCourse] =
        useState(null);

    const [lessons, setLessons] =
        useState([]);


    // ==========================================
    // REVIEWS
    // ==========================================

    const [reviews, setReviews] =
        useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [enrollmentLoading, setEnrollmentLoading] =
        useState(false);


    // ==========================================
    // ENROLLMENT
    // ==========================================

    const [isEnrolled, setIsEnrolled] =
        useState(false);


    // ==========================================
    // ERROR
    // ==========================================

    const [error, setError] =
        useState("");


    // ==========================================
    // REVIEW FORM
    // ==========================================

    const [reviewRating, setReviewRating] =
        useState(5);

    const [reviewComment, setReviewComment] =
        useState("");

    const [reviewLoading, setReviewLoading] =
        useState(false);

    const [reviewError, setReviewError] =
        useState("");

    const [reviewSuccess, setReviewSuccess] =
        useState("");


    // ==========================================
    // EDIT REVIEW
    // ==========================================

    const [editingReviewId, setEditingReviewId] =
        useState(null);


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");


                // ==========================================
                // COURSE
                // ==========================================

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

                    try {

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

                    } catch (enrollmentError) {

                        console.error(
                            "Check enrollment error:",
                            enrollmentError
                        );

                    }

                }


                // ==========================================
                // LESSONS
                // ==========================================

                const lessonResult =
                    await loadCourseLessons(id);


                if (lessonResult.success) {

                    setLessons(
                        lessonResult.data
                    );
                }


                // ==========================================
                // REVIEWS
                // ==========================================

                await loadReviews();

            } catch (error) {

                console.error(
                    "CourseDetail load error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể tải dữ liệu khóa học"
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [id]);


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    const loadReviews = async () => {

        try {

            const reviewResult =
                await loadCourseReviews(id);


            if (!reviewResult.success) {
                return;
            }


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

        } catch (error) {

            console.error(
                "Load reviews error:",
                error
            );

        }

    };


    // ==========================================
    // HANDLE ENROLL
    // ==========================================

    const handleEnroll = async () => {

        if (!authService.isLoggedIn()) {

            navigate("/login");

            return;
        }


        if (enrollmentLoading) {
            return;
        }


        setEnrollmentLoading(true);


        try {

            const result =
                await enrollCourseController(id);


            if (!result.success) {

                alert(result.message);

                return;
            }


            alert(
                "Đăng ký khóa học thành công!"
            );


            setIsEnrolled(true);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.message ||
                "Đăng ký khóa học thất bại"
            );

        } finally {

            setEnrollmentLoading(false);

        }

    };


    // ==========================================
    // CHECK LOGIN FOR REVIEW
    // ==========================================

    const handleReviewLogin = () => {

        if (!authService.isLoggedIn()) {

            navigate("/login");

            return false;
        }

        return true;
    };


    // ==========================================
    // CREATE REVIEW
    // ==========================================

    const handleCreateReview = async (event) => {

        event.preventDefault();


        if (!handleReviewLogin()) {
            return;
        }


        if (!isEnrolled) {

            setReviewError(
                "Bạn cần đăng ký khóa học trước khi đánh giá."
            );

            return;
        }


        setReviewLoading(true);
        setReviewError("");
        setReviewSuccess("");


        try {

            const result =
                await createReviewController(
                    id,
                    {
                        rating: reviewRating,
                        comment: reviewComment
                    }
                );


            setReviewSuccess(
                result.message ||
                "Đánh giá khóa học thành công!"
            );


            setReviewRating(5);
            setReviewComment("");


            await loadReviews();

        } catch (error) {

            console.error(
                "Create review error:",
                error
            );


            setReviewError(
                error.response?.data?.message ||
                error.message ||
                "Không thể tạo đánh giá"
            );

        } finally {

            setReviewLoading(false);

        }

    };


    // ==========================================
    // START EDIT REVIEW
    // ==========================================

    const handleStartEdit = (review) => {

        setEditingReviewId(review.id);

        setReviewRating(
            Number(review.rating)
        );

        setReviewComment(
            review.comment || ""
        );

        setReviewError("");
        setReviewSuccess("");


        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });

    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancelEdit = () => {

        setEditingReviewId(null);

        setReviewRating(5);

        setReviewComment("");

        setReviewError("");
        setReviewSuccess("");

    };


    // ==========================================
    // UPDATE REVIEW
    // ==========================================

    const handleUpdateReview = async (event) => {

        event.preventDefault();


        if (!handleReviewLogin()) {
            return;
        }


        setReviewLoading(true);
        setReviewError("");
        setReviewSuccess("");


        try {

            const result =
                await updateReviewController(
                    editingReviewId,
                    {
                        rating: reviewRating,
                        comment: reviewComment
                    }
                );


            setReviewSuccess(
                result.message ||
                "Cập nhật đánh giá thành công!"
            );


            setEditingReviewId(null);

            setReviewRating(5);

            setReviewComment("");


            await loadReviews();

        } catch (error) {

            console.error(
                "Update review error:",
                error
            );


            setReviewError(
                error.response?.data?.message ||
                error.message ||
                "Không thể cập nhật đánh giá"
            );

        } finally {

            setReviewLoading(false);

        }

    };


    // ==========================================
    // DELETE REVIEW
    // ==========================================

    const handleDeleteReview = async (reviewId) => {

        if (!handleReviewLogin()) {
            return;
        }


        const confirmed =
            window.confirm(
                "Bạn có chắc muốn xóa đánh giá này?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const result =
                await deleteReviewController(
                    reviewId
                );


            setReviewSuccess(
                result.message ||
                "Xóa đánh giá thành công!"
            );


            await loadReviews();

        } catch (error) {

            console.error(
                "Delete review error:",
                error
            );


            setReviewError(
                error.response?.data?.message ||
                error.message ||
                "Không thể xóa đánh giá"
            );

        }

    };


    // ==========================================
    // GET CURRENT USER
    // ==========================================

    const getCurrentUser = () => {

        try {

            if (!authService.isLoggedIn()) {
                return null;
            }


            if (
                typeof authService.getCurrentUser ===
                "function"
            ) {

                return authService.getCurrentUser();

            }


            if (
                typeof authService.getUser ===
                "function"
            ) {

                return authService.getUser();

            }


            return null;

        } catch (error) {

            console.error(
                "Get current user error:",
                error
            );

            return null;

        }

    };


    const currentUser =
        getCurrentUser();


    // ==========================================
    // CHECK OWN REVIEW
    // ==========================================

    const isOwnReview = (review) => {

        if (!currentUser) {
            return false;
        }


        return (
            Number(review.student_id) ===
            Number(currentUser.id)
        );

    };


    // ==========================================
    // RENDER STARS
    // ==========================================

    const renderStars = (rating) => {

        const value =
            Number(rating) || 0;


        return (
            <span>
                {"⭐".repeat(value)}
                {"☆".repeat(5 - value)}
            </span>
        );

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


                {/* ================================= */}
                {/* REVIEW SUMMARY */}
                {/* ================================= */}

                <div style={styles.summary}>

                    <div>

                        <strong
                            style={styles.averageRating}
                        >

                            ⭐ {averageRating}

                        </strong>

                    </div>


                    <div>

                        <span>
                            {totalReviews} đánh giá
                        </span>

                    </div>

                </div>


                {/* ================================= */}
                {/* MESSAGE */}
                {/* ================================= */}

                {reviewSuccess && (

                    <div style={styles.successMessage}>

                        {reviewSuccess}

                    </div>

                )}


                {reviewError && (

                    <div style={styles.errorMessage}>

                        {reviewError}

                    </div>

                )}


                {/* ================================= */}
                {/* REVIEW LIST */}
                {/* ================================= */}

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

                            <div style={styles.reviewHeader}>

                                <div>

                                    <strong>
                                        {review.student?.name ||
                                            "Học viên"}
                                    </strong>


                                    <div
                                        style={
                                            styles.reviewStars
                                        }
                                    >

                                        {renderStars(
                                            review.rating
                                        )}

                                    </div>

                                </div>


                                {/* ================================= */}
                                {/* OWN REVIEW ACTIONS */}
                                {/* ================================= */}

                                {isOwnReview(review) && (

                                    <div>

                                        <button
                                            style={
                                                styles.editButton
                                            }
                                            onClick={() =>
                                                handleStartEdit(
                                                    review
                                                )
                                            }
                                        >

                                            Sửa

                                        </button>


                                        <button
                                            style={
                                                styles.deleteButton
                                            }
                                            onClick={() =>
                                                handleDeleteReview(
                                                    review.id
                                                )
                                            }
                                        >

                                            Xóa

                                        </button>

                                    </div>

                                )}

                            </div>


                            {review.comment && (

                                <p>
                                    {review.comment}
                                </p>

                            )}

                        </div>

                    ))

                )}


                {/* ================================= */}
                {/* REVIEW FORM */}
                {/* ================================= */}

                {isEnrolled && (

                    <div style={styles.reviewForm}>

                        <h3>

                            {editingReviewId
                                ? "Chỉnh sửa đánh giá"
                                : "Đánh giá khóa học"
                            }

                        </h3>


                        <form
                            onSubmit={
                                editingReviewId
                                    ? handleUpdateReview
                                    : handleCreateReview
                            }
                        >


                            {/* RATING */}

                            <div style={styles.formGroup}>

                                <label>
                                    Số sao
                                </label>


                                <div
                                    style={
                                        styles.starSelector
                                    }
                                >

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <button
                                                key={star}
                                                type="button"
                                                style={{
                                                    ...styles.starButton,
                                                    opacity:
                                                        star <=
                                                        reviewRating
                                                            ? 1
                                                            : 0.35
                                                }}
                                                onClick={() =>
                                                    setReviewRating(
                                                        star
                                                    )
                                                }
                                            >

                                                ⭐

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* COMMENT */}

                            <div style={styles.formGroup}>

                                <label>
                                    Nhận xét
                                </label>


                                <textarea
                                    value={
                                        reviewComment
                                    }
                                    onChange={(event) =>
                                        setReviewComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nhập nhận xét của bạn..."
                                    rows={5}
                                    style={
                                        styles.textarea
                                    }
                                />

                            </div>


                            {/* BUTTONS */}

                            <div>

                                <button
                                    type="submit"
                                    style={
                                        styles.primaryButton
                                    }
                                    disabled={
                                        reviewLoading
                                    }
                                >

                                    {reviewLoading

                                        ? "Đang xử lý..."

                                        : editingReviewId
                                            ? "Cập nhật đánh giá"
                                            : "Gửi đánh giá"

                                    }

                                </button>


                                {editingReviewId && (

                                    <button
                                        type="button"
                                        style={
                                            styles.cancelButton
                                        }
                                        onClick={
                                            handleCancelEdit
                                        }
                                    >

                                        Hủy

                                    </button>

                                )}

                            </div>

                        </form>

                    </div>

                )}


                {/* ================================= */}
                {/* NOT ENROLLED */}
                {/* ================================= */}

                {!isEnrolled &&
                    reviews.length > 0 && (

                        <p style={styles.note}>

                            💡 Bạn cần đăng ký khóa học
                            để có thể đánh giá.

                        </p>

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
        fontSize: "16px",
        marginRight: "10px"
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
        alignItems: "center",
        gap: "30px",
        margin: "20px 0"
    },


    averageRating: {
        fontSize: "24px"
    },


    review: {
        padding: "20px 0",
        borderBottom:
            "1px solid #eee"
    },


    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },


    reviewStars: {
        marginTop: "5px"
    },


    reviewForm: {
        marginTop: "30px",
        padding: "25px",
        background: "#f8f8f8",
        borderRadius: "10px"
    },


    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px"
    },


    starSelector: {
        display: "flex",
        gap: "5px"
    },


    starButton: {
        border: "none",
        background: "transparent",
        fontSize: "28px",
        cursor: "pointer",
        padding: "2px"
    },


    textarea: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        resize: "vertical",
        fontSize: "15px",
        boxSizing: "border-box"
    },


    editButton: {
        border: "none",
        background: "#eee",
        padding: "7px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "5px"
    },


    deleteButton: {
        border: "none",
        background: "#eee",
        padding: "7px 12px",
        borderRadius: "5px",
        cursor: "pointer"
    },


    cancelButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },


    successMessage: {
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "6px",
        background: "#e8f5e9",
        color: "#2e7d32"
    },


    errorMessage: {
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "6px",
        background: "#ffebee",
        color: "#c62828"
    },


    note: {
        marginTop: "20px",
        color: "#666"
    }

};


export default CourseDetail;