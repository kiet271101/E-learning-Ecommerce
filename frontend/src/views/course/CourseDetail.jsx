import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    loadCourseDetail,
    loadCourseLessons,
    loadCourseReviews
} from "../../controllers/courseDetailController";

import authService from "../../services/authService";

import {
    checkEnrollmentController,
    enrollCourseController
} from "../../controllers/enrollmentController";

import {
    createReviewController,
    updateReviewController,
    deleteReviewController
} from "../../controllers/reviewController";

import "../../styles/CourseDetail.css";


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

    const [reviews, setReviews] =
        useState([]);


    // ==========================================
    // RATING
    // ==========================================

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
    // REVIEW
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

    const [editingReviewId, setEditingReviewId] =
        useState(null);


    // ==========================================
    // LOAD COURSE
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const courseResult =
                    await loadCourseDetail(id);

                if (!courseResult.success) {

                    setError(
                        courseResult.message ||
                        "Không thể tải khóa học"
                    );

                    return;
                }

                setCourse(courseResult.data);


                // ==================================
                // CHECK LOGIN / ENROLLMENT
                // ==================================

                const currentUser =
                    authService.getCurrentUser();

                if (currentUser) {

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


                // ==================================
                // LESSONS
                // ==================================

                const lessonsResult =
                    await loadCourseLessons(id);

                if (lessonsResult.success) {

                    setLessons(
                        lessonsResult.data || []
                    );

                }


                // ==================================
                // REVIEWS
                // ==================================

                const reviewsResult =
                    await loadCourseReviews(id);

                if (reviewsResult.success) {

                    const reviewData =
                        reviewsResult.data;

                    setReviews(
                        reviewData.reviews ||
                        reviewData.data ||
                        []
                    );

                    setAverageRating(
                        Number(
                            reviewData.averageRating ||
                            reviewData.average_rating ||
                            0
                        )
                    );

                    setTotalReviews(
                        Number(
                            reviewData.totalReviews ||
                            reviewData.total_reviews ||
                            (
                                reviewData.reviews ||
                                reviewData.data ||
                                []
                            ).length
                        )
                    );

                }

            } catch (err) {

                console.error(
                    "COURSE DETAIL ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Không thể tải dữ liệu khóa học"
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {
            loadData();
        }

    }, [id]);


    // ==========================================
    // ENROLL
    // ==========================================

    const handleEnroll = async () => {

        const currentUser =
            authService.getCurrentUser();

        if (!currentUser) {

            navigate("/login");

            return;
        }

        try {

            setEnrollmentLoading(true);

            const result =
                await enrollCourseController(id);

            if (!result.success) {

                alert(
                    result.message ||
                    "Đăng ký khóa học thất bại"
                );

                return;
            }

            alert(
                result.message ||
                "Đăng ký khóa học thành công"
            );

            setIsEnrolled(true);

        } catch (err) {

            console.error(
                "ENROLL ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Không thể đăng ký khóa học"
            );

        } finally {

            setEnrollmentLoading(false);

        }

    };


    // ==========================================
    // REVIEW HELPERS
    // ==========================================

    const renderStars = (rating) => {

        return (
            <>
                {[1, 2, 3, 4, 5].map((star) => (

                    <span key={star}>
                        {star <= Number(rating)
                            ? "⭐"
                            : "☆"
                        }
                    </span>

                ))}
            </>
        );

    };


    const handleStartEdit = (review) => {

        setEditingReviewId(review.id);

        setReviewRating(
            Number(review.rating) || 5
        );

        setReviewComment(
            review.comment || ""
        );

        setReviewError("");
        setReviewSuccess("");

    };


    const handleCancelEdit = () => {

        setEditingReviewId(null);

        setReviewRating(5);

        setReviewComment("");

        setReviewError("");
        setReviewSuccess("");

    };


    // ==========================================
    // CREATE / UPDATE REVIEW
    // ==========================================

    const handleSubmitReview = async (event) => {

        event.preventDefault();

        setReviewError("");
        setReviewSuccess("");


        const currentUser =
            authService.getCurrentUser();

        if (!currentUser) {

            navigate("/login");

            return;
        }


        if (!isEnrolled) {

            setReviewError(
                "Bạn cần đăng ký khóa học để có thể đánh giá."
            );

            return;
        }


        if (
            !reviewRating ||
            reviewRating < 1 ||
            reviewRating > 5
        ) {

            setReviewError(
                "Vui lòng chọn số sao từ 1 đến 5."
            );

            return;
        }


        if (!reviewComment.trim()) {

            setReviewError(
                "Vui lòng nhập nội dung đánh giá."
            );

            return;
        }


        try {

            setReviewLoading(true);


            let result;


            if (editingReviewId) {

                result =
                    await updateReviewController(
                        editingReviewId,
                        {
                            rating: reviewRating,
                            comment: reviewComment.trim()
                        }
                    );

            } else {

                result =
                    await createReviewController(
                        id,
                        {
                            rating: reviewRating,
                            comment: reviewComment.trim()
                        }
                    );

            }


            if (!result.success) {

                setReviewError(
                    result.message ||
                    "Không thể lưu đánh giá"
                );

                return;
            }


            setReviewSuccess(
                editingReviewId
                    ? "Cập nhật đánh giá thành công."
                    : "Đánh giá khóa học thành công."
            );


            // ==================================
            // RELOAD REVIEWS
            // ==================================

            const reviewsResult =
                await loadCourseReviews(id);

            if (reviewsResult.success) {

                const reviewData =
                    reviewsResult.data;

                setReviews(
                    reviewData.reviews ||
                    reviewData.data ||
                    []
                );

                setAverageRating(
                    Number(
                        reviewData.averageRating ||
                        reviewData.average_rating ||
                        0
                    )
                );

                setTotalReviews(
                    Number(
                        reviewData.totalReviews ||
                        reviewData.total_reviews ||
                        (
                            reviewData.reviews ||
                            reviewData.data ||
                            []
                        ).length
                    )
                );

            }


            setEditingReviewId(null);

            setReviewRating(5);

            setReviewComment("");

        } catch (err) {

            console.error(
                "REVIEW ERROR:",
                err
            );

            setReviewError(
                err.response?.data?.message ||
                "Không thể lưu đánh giá"
            );

        } finally {

            setReviewLoading(false);

        }

    };


    // ==========================================
    // DELETE REVIEW
    // ==========================================

    const handleDeleteReview = async (reviewId) => {

        const confirmed =
            window.confirm(
                "Bạn có chắc muốn xóa đánh giá này?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setReviewError("");
            setReviewSuccess("");

            const result =
                await deleteReviewController(
                    reviewId
                );

            if (!result.success) {

                setReviewError(
                    result.message ||
                    "Không thể xóa đánh giá"
                );

                return;
            }


            setReviewSuccess(
                "Xóa đánh giá thành công."
            );


            const reviewsResult =
                await loadCourseReviews(id);

            if (reviewsResult.success) {

                const reviewData =
                    reviewsResult.data;

                setReviews(
                    reviewData.reviews ||
                    reviewData.data ||
                    []
                );

                setAverageRating(
                    Number(
                        reviewData.averageRating ||
                        reviewData.average_rating ||
                        0
                    )
                );

                setTotalReviews(
                    Number(
                        reviewData.totalReviews ||
                        reviewData.total_reviews ||
                        (
                            reviewData.reviews ||
                            reviewData.data ||
                            []
                        ).length
                    )
                );

            }

        } catch (err) {

            console.error(
                "DELETE REVIEW ERROR:",
                err
            );

            setReviewError(
                err.response?.data?.message ||
                "Không thể xóa đánh giá"
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="course-detail-loading">

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

            <div className="course-detail-error">

                <h2>
                    Không thể tải khóa học
                </h2>

                <p>
                    {error || "Không tìm thấy khóa học"}
                </p>

            </div>

        );
    }


    // ==========================================
    // VIEW
    // ==========================================

    return (

        <main className="course-detail-page">

            <div className="course-detail-container">

                {/* ==================================
                    COURSE HEADER
                ================================== */}

                <section className="course-detail-header">

                    <div className="course-detail-thumbnail">

                        {course.thumbnail ? (

                            <img
                                src={
                                    course.thumbnail
                                        ? course.thumbnail.startsWith("http")
                                            ? course.thumbnail
                                            : `http://localhost:5000${course.thumbnail}`
                                        : "/images/course-placeholder.jpg"
                                }
                                className="course-detail-image"
                                alt={course.title}
                            />
                                


                        ) : (

                        <div className="course-detail-no-image">
                            Không có hình ảnh
                        </div>

                        )}

                    </div>


                    <div className="course-detail-info">

                        <h1 className="course-detail-title">
                            {course.title}
                        </h1>


                        {course.description && (

                            <p className="course-detail-description">
                                {course.description}
                            </p>

                        )}


                        <p className="course-detail-meta">

                            <strong>
                                Danh mục:
                            </strong>{" "}

                            {course.category?.name ||
                                "Chưa phân loại"}

                        </p>


                        <p className="course-detail-meta">

                            <strong>
                                Giảng viên:
                            </strong>{" "}

                            {course.teacher?.name ||
                                "Chưa cập nhật"}

                        </p>


                        <div className="course-detail-rating">

                            ⭐{" "}

                            {Number(
                                averageRating
                            ).toFixed(1)}

                            {" "}

                            ({totalReviews} đánh giá)

                        </div>


                        <div className="course-detail-price">

                            {Number(course.price) === 0

                                ? "Miễn phí"

                                : `${Number(
                                    course.price
                                ).toLocaleString(
                                    "vi-VN"
                                )} đ`
                            }

                        </div>


                        {/* ==================================
                            ENROLL / LEARNING
                        ================================== */}

                        {isEnrolled ? (

                            <button
                                className="course-detail-primary-button"
                                onClick={() =>
                                    navigate(
                                        `/learning/${course.id}`
                                    )
                                }
                            >
                                Học ngay
                            </button>

                        ) : Number(course.price) === 0 ? (

                            <button
                                className="course-detail-primary-button"
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
                                className="course-detail-primary-button"
                                onClick={() =>
                                    alert(
                                        "Chức năng mua khóa học sẽ được thực hiện ở bước thanh toán."
                                    )
                                }
                            >
                                Mua khóa học
                            </button>

                        )}

                    </div>

                </section>


                {/* ==================================
                    LESSONS
                ================================== */}

                <section className="course-detail-section">

                    <h2 className="course-detail-section-title">
                        Nội dung khóa học
                    </h2>

                    <p className="course-detail-section-subtitle">
                        {lessons.length} bài học
                    </p>


                    {lessons.length === 0 ? (

                        <div className="course-detail-empty">
                            Chưa có bài học nào.
                        </div>

                    ) : (

                        <div className="course-detail-lesson-list">

                            {lessons.map((lesson) => (

                                <div
                                    key={lesson.id}
                                    className="course-detail-lesson"
                                >

                                    <div className="course-detail-lesson-title">

                                        {lesson.lesson_order
                                            ? `${lesson.lesson_order}. `
                                            : ""}

                                        {lesson.title}

                                    </div>


                                    <div className="course-detail-lesson-access">

                                        {lesson.is_preview

                                            ? "👁 Xem trước"

                                            : "🔒 Nội dung học viên"

                                        }

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ==================================
                    REVIEWS
                ================================== */}

                <section className="course-detail-section">

                    <h2 className="course-detail-section-title">
                        Đánh giá khóa học
                    </h2>


                    <div className="course-detail-review-summary">

                        <div className="course-detail-average-rating">

                            ⭐{" "}

                            {Number(
                                averageRating
                            ).toFixed(1)}

                        </div>


                        <div className="course-detail-total-reviews">

                            {totalReviews} đánh giá

                        </div>

                    </div>


                    {reviewSuccess && (

                        <div className="course-detail-success-message">
                            {reviewSuccess}
                        </div>

                    )}


                    {reviewError && (

                        <div className="course-detail-error-message">
                            {reviewError}
                        </div>

                    )}


                    {/* ==================================
                        REVIEW LIST
                    ================================== */}

                    {reviews.length === 0 ? (

                        <div className="course-detail-empty">
                            Chưa có đánh giá nào.
                        </div>

                    ) : (

                        <div>

                            {reviews.map((review) => (

                                <div
                                    key={review.id}
                                    className="course-detail-review"
                                >

                                    <div className="course-detail-review-header">

                                        <div>

                                            <div className="course-detail-review-user">
                                                {review.student?.name ||
                                                    review.user?.name ||
                                                    "Học viên"}
                                            </div>

                                            <div className="course-detail-review-stars">
                                                {renderStars(
                                                    review.rating
                                                )}
                                            </div>

                                        </div>


                                        {(() => {

                                            const currentUser =
                                                authService.getCurrentUser();

                                            const reviewUserId =
                                                review.student_id ||
                                                review.user_id ||
                                                review.student?.id ||
                                                review.user?.id;

                                            if (
                                                currentUser &&
                                                Number(
                                                    currentUser.id
                                                ) === Number(
                                                    reviewUserId
                                                )
                                            ) {

                                                return (

                                                    <div>

                                                        <button
                                                            type="button"
                                                            className="course-detail-edit-button"
                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    review
                                                                )
                                                            }
                                                        >
                                                            Sửa
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="course-detail-delete-button"
                                                            onClick={() =>
                                                                handleDeleteReview(
                                                                    review.id
                                                                )
                                                            }
                                                        >
                                                            Xóa
                                                        </button>

                                                    </div>

                                                );

                                            }

                                            return null;

                                        })()}

                                    </div>


                                    <p className="course-detail-review-comment">
                                        {review.comment}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}


                    {/* ==================================
                        REVIEW FORM
                    ================================== */}

                    {isEnrolled ? (

                        <form
                            className="course-detail-review-form"
                            onSubmit={handleSubmitReview}
                        >

                            <h3 className="course-detail-review-form-title">

                                {editingReviewId
                                    ? "Chỉnh sửa đánh giá"
                                    : "Đánh giá khóa học"
                                }

                            </h3>


                            <div className="course-detail-form-group">

                                <label className="course-detail-form-label">
                                    Số sao
                                </label>


                                <div className="course-detail-star-selector">

                                    {[1, 2, 3, 4, 5].map((star) => (

                                        <button
                                            key={star}
                                            type="button"
                                            className="course-detail-star-button"
                                            style={{
                                                opacity:
                                                    star <= reviewRating
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

                                    ))}

                                </div>

                            </div>


                            <div className="course-detail-form-group">

                                <label className="course-detail-form-label">
                                    Nhận xét
                                </label>


                                <textarea
                                    value={reviewComment}
                                    onChange={(event) =>
                                        setReviewComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nhập nhận xét của bạn..."
                                    rows={5}
                                    className="course-detail-textarea"
                                />

                            </div>


                            <div className="course-detail-review-actions">

                                <button
                                    type="submit"
                                    className="course-detail-primary-button"
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading

                                        ? "Đang lưu..."

                                        : editingReviewId
                                            ? "Cập nhật đánh giá"
                                            : "Gửi đánh giá"

                                    }
                                </button>


                                {editingReviewId && (

                                    <button
                                        type="button"
                                        className="course-detail-cancel-button"
                                        onClick={
                                            handleCancelEdit
                                        }
                                    >
                                        Hủy
                                    </button>

                                )}

                            </div>

                        </form>

                    ) : (

                        <p className="course-detail-note">
                            💡 Bạn cần đăng ký khóa học để có thể đánh giá.
                        </p>

                    )}

                </section>

            </div>

        </main>

    );

}


export default CourseDetail;
