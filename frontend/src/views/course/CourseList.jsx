import { useEffect, useState } from "react";

import CourseCard from "../../components/CourseCard";

import {
    getCoursesController
} from "../../controllers/courseController";

function CourseList() {

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ==========================================
    // LOAD COURSES
    // ==========================================

    useEffect(() => {

        const loadCourses = async () => {

            const result =
                await getCoursesController();

            if (!result.success) {

                setError(result.message);

                setLoading(false);

                return;
            }

            setCourses(result.data);

            setLoading(false);
        };

        loadCourses();

    }, []);

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

    if (error) {

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

            <h1 style={styles.heading}>
                Khóa học
            </h1>

            <p style={styles.subtitle}>
                Khám phá các khóa học trực tuyến
            </p>

            {courses.length === 0 ? (

                <div>
                    Chưa có khóa học nào.
                </div>

            ) : (

                <div style={styles.grid}>

                    {courses.map((course) => (

                        <CourseCard
                            key={course.id}
                            course={course}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

const styles = {

    container: {
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto"
    },

    heading: {
        fontSize: "32px",
        marginBottom: "10px"
    },

    subtitle: {
        color: "#666",
        marginBottom: "30px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "25px"
    }

};

export default CourseList;