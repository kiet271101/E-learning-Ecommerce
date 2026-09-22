import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";
import {
    getMyCoursesController
} from "../../controllers/enrollmentController";

import {
    loadCourseProgressController
} from "../../controllers/learningController";

import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                // ----------------------------------
                // 1. CHECK USER
                // ----------------------------------

                const currentUser =
                    authService.getCurrentUser();

                if (!currentUser) {

                    navigate("/login");

                    return;
                }

                setUser(currentUser);


                // ----------------------------------
                // 2. LOAD MY COURSES
                // ----------------------------------

                const result =
                    await getMyCoursesController();

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Không thể tải khóa học"
                    );
                }


                const enrolledCourses =
                    Array.isArray(result.data)
                        ? result.data
                        : [];


                // ----------------------------------
                // 3. LOAD PROGRESS
                // ----------------------------------

                const coursesWithProgress =
                    await Promise.all(

                        enrolledCourses.map(
                            async (enrollment) => {

                                const course =
                                    enrollment.course;

                                if (!course) {

                                    return {
                                        ...enrollment,
                                        progress: 0,
                                        totalLessons: 0,
                                        completedLessons: 0
                                    };
                                }


                                try {

                                    const progressResult =
                                        await loadCourseProgressController(
                                            course.id
                                        );


                                    if (
                                        progressResult?.success &&
                                        progressResult.data
                                    ) {

                                        return {

                                            ...enrollment,

                                            progress:
                                                Number(
                                                    progressResult
                                                        .data
                                                        .progress
                                                ) || 0,

                                            totalLessons:
                                                Number(
                                                    progressResult
                                                        .data
                                                        .totalLessons
                                                ) || 0,

                                            completedLessons:
                                                Number(
                                                    progressResult
                                                        .data
                                                        .completedLessons
                                                ) || 0
                                        };
                                    }


                                    return {

                                        ...enrollment,
                                        progress: 0,
                                        totalLessons: 0,
                                        completedLessons: 0
                                    };

                                } catch (progressError) {

                                    console.error(
                                        "LOAD COURSE PROGRESS ERROR:",
                                        progressError
                                    );

                                    return {

                                        ...enrollment,
                                        progress: 0,
                                        totalLessons: 0,
                                        completedLessons: 0
                                    };
                                }
                            }
                        )
                    );


                setCourses(coursesWithProgress);

            } catch (error) {

                console.error(
                    "STUDENT DASHBOARD ERROR:",
                    error
                );

                setError(
                    error.message ||
                    "Không thể tải dữ liệu Dashboard"
                );

            } finally {

                setLoading(false);
            }
        };


        loadDashboard();

    }, [navigate]);


    // ==========================================
    // CONTINUE LEARNING
    // ==========================================

    const handleContinueLearning = (courseId) => {

        navigate(`/learning/${courseId}`);

    };


    // ==========================================
    // VIEW COURSE
    // ==========================================

    const handleViewCourse = (courseId) => {

        navigate(`/courses/${courseId}`);

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="student-dashboard-page">

                <div className="student-dashboard-loading">

                    <div className="student-dashboard-spinner"></div>

                    <p>
                        Đang tải Dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="student-dashboard-page">

                <div className="student-dashboard-container">

                    <div className="student-dashboard-error">
                        {error}
                    </div>

                </div>

            </div>
        );
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div className="student-dashboard-page">

            <div className="student-dashboard-container">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="student-dashboard-header">

                    <div>

                        <p className="student-dashboard-eyebrow">
                            Học tập
                        </p>

                        <h1 className="student-dashboard-title">
                            Student Dashboard
                        </h1>

                        <p className="student-dashboard-welcome">
                            Xin chào,{" "}
                            <strong>
                                {user?.name || "Học viên"}
                            </strong>
                        </p>

                    </div>

                </div>


                {/* ==================================
                    STATISTICS
                ================================== */}

                <div className="student-dashboard-statistics">

                    <div className="student-dashboard-stat-card">

                        <div className="student-dashboard-stat-icon">
                            📚
                        </div>

                        <div className="student-dashboard-stat-content">

                            <div className="student-dashboard-stat-number">
                                {courses.length}
                            </div>

                            <div className="student-dashboard-stat-label">
                                Khóa học đã đăng ký
                            </div>

                        </div>

                    </div>


                    <div className="student-dashboard-stat-card">

                        <div className="student-dashboard-stat-icon">
                            🏆
                        </div>

                        <div className="student-dashboard-stat-content">

                            <div className="student-dashboard-stat-number">

                                {
                                    courses.filter(
                                        (item) =>
                                            Number(item.progress) >= 100
                                    ).length
                                }

                            </div>

                            <div className="student-dashboard-stat-label">
                                Khóa học đã hoàn thành
                            </div>

                        </div>

                    </div>


                    <div className="student-dashboard-stat-card">

                        <div className="student-dashboard-stat-icon">
                            📖
                        </div>

                        <div className="student-dashboard-stat-content">

                            <div className="student-dashboard-stat-number">

                                {
                                    courses.filter(
                                        (item) =>
                                            Number(item.progress) > 0 &&
                                            Number(item.progress) < 100
                                    ).length
                                }

                            </div>

                            <div className="student-dashboard-stat-label">
                                Đang học
                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    MY COURSES
                ================================== */}

                <section className="student-dashboard-section">

                    <div className="student-dashboard-section-header">

                        <div>

                            <p className="student-dashboard-section-eyebrow">
                                Learning center
                            </p>

                            <h2 className="student-dashboard-section-title">
                                📚 Khóa học của tôi
                            </h2>

                        </div>

                    </div>


                    {courses.length === 0 ? (

                        <div className="student-dashboard-empty">

                            <div className="student-dashboard-empty-icon">
                                📚
                            </div>

                            <h3>
                                Bạn chưa đăng ký khóa học nào
                            </h3>

                            <p>
                                Hãy khám phá các khóa học
                                và bắt đầu học ngay hôm nay.
                            </p>

                            <button
                                type="button"
                                className="student-dashboard-primary-button student-dashboard-empty-button"
                                onClick={() =>
                                    navigate("/courses")
                                }
                            >
                                Khám phá khóa học
                            </button>

                        </div>

                    ) : (

                        <div className="student-dashboard-course-grid">

                            {courses.map((enrollment) => {

                                const course =
                                    enrollment.course;

                                if (!course) {
                                    return null;
                                }


                                const progress =
                                    Math.min(
                                        Math.max(
                                            Number(
                                                enrollment.progress
                                            ) || 0,
                                            0
                                        ),
                                        100
                                    );


                                const completed =
                                    progress >= 100;


                                return (

                                    <article
                                        key={
                                            enrollment.id ||
                                            course.id
                                        }
                                        className="student-dashboard-course-card"
                                    >

                                        {/* COURSE IMAGE */}

                                        <div className="student-dashboard-thumbnail">

                                            {course.thumbnail ? (

                                                <img
                                                    src={
                                                        course.thumbnail
                                                            ? course.thumbnail.startsWith("http")
                                                                ? course.thumbnail
                                                                : `http://localhost:5000${course.thumbnail}`
                                                            : "/images/course-placeholder.jpg"
                                                    }
                                                    className="student-dashboard-thumbnail-image"
                                                    alt={course.title}
                                                />

                                            ) : (

                                            <div
                                                className="student-dashboard-thumbnail-fallback"
                                            >
                                                📚
                                            </div>

                                            )}

                                        </div>


                                        {/* COURSE CONTENT */}

                                        <div className="student-dashboard-course-content">

                                            <h3 className="student-dashboard-course-title">
                                                {course.title}
                                            </h3>


                                            <p className="student-dashboard-course-status">

                                                {completed
                                                    ? "✅ Đã hoàn thành"
                                                    : progress > 0
                                                        ? "📖 Đang học"
                                                        : "🆕 Chưa bắt đầu"}

                                            </p>


                                            {/* PROGRESS */}

                                            <div className="student-dashboard-progress-header">

                                                <span>
                                                    Tiến độ
                                                </span>

                                                <strong>
                                                    {progress}%
                                                </strong>

                                            </div>


                                            <div className="student-dashboard-progress-background">

                                                <div
                                                    className="student-dashboard-progress-bar"
                                                    style={{
                                                        width:
                                                            `${progress}%`
                                                    }}
                                                />

                                            </div>


                                            <p className="student-dashboard-lesson-info">
                                                {enrollment.completedLessons || 0}
                                                {" / "}
                                                {enrollment.totalLessons || 0}
                                                {" bài học hoàn thành"}
                                            </p>


                                            {/* BUTTONS */}

                                            <div className="student-dashboard-button-group">

                                                <button
                                                    type="button"
                                                    className="student-dashboard-primary-button"
                                                    onClick={() =>
                                                        handleContinueLearning(
                                                            course.id
                                                        )
                                                    }
                                                >
                                                    {completed
                                                        ? "Xem lại khóa học"
                                                        : progress > 0
                                                            ? "Tiếp tục học"
                                                            : "Bắt đầu học"}
                                                </button>


                                                <button
                                                    type="button"
                                                    className="student-dashboard-secondary-button"
                                                    onClick={() =>
                                                        handleViewCourse(
                                                            course.id
                                                        )
                                                    }
                                                >
                                                    Chi tiết
                                                </button>

                                            </div>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
};


export default StudentDashboard;
