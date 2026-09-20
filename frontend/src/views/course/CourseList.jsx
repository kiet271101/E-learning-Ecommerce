import { useEffect, useState } from "react";

import CourseCard from "../../components/CourseCard";

import {
    getCoursesController
} from "../../controllers/courseController";

import "../../styles/CourseList.css";


function CourseList() {

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD COURSES
    // ==========================================

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const result =
                    await getCoursesController();


                if (!result.success) {

                    setError(
                        result.message
                    );

                    setLoading(false);

                    return;
                }


                setCourses(
                    result.data
                );

            } catch (error) {

                console.error(
                    "LOAD COURSES ERROR:",
                    error
                );

                setError(
                    "Không thể tải khóa học"
                );

            } finally {

                setLoading(false);

            }

        };


        loadCourses();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="course-list-loading">

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

            <div className="course-list-error">

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

        <main className="course-list-page">

            <div className="course-list-container">

                {/* ==================================
                    PAGE HEADER
                ================================== */}

                <h1 className="course-list-heading">
                    Khóa học
                </h1>

                <p className="course-list-subtitle">
                    Khám phá các khóa học trực tuyến
                </p>


                {/* ==================================
                    COURSES
                ================================== */}

                {courses.length === 0 ? (

                    <div className="course-list-empty">

                        <p>
                            Chưa có khóa học nào.
                        </p>

                    </div>

                ) : (

                    <div className="course-list-grid">

                        {courses.map((course) => (

                            <CourseCard
                                key={course.id}
                                course={course}
                            />

                        ))}

                    </div>

                )}

            </div>

        </main>

    );
}


export default CourseList;