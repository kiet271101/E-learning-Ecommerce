import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getMyCoursesController
} from "../../controllers/enrollmentController";


function MyCourses() {

    const navigate = useNavigate();

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadCourses = async () => {

            const result =
                await getMyCoursesController();

            if (!result.success) {

                setError(result.message);

                setLoading(false);

                return;
            }


            const data = result.data;

            const courseList =
                Array.isArray(data)
                    ? data
                    : data.courses ||
                      data.data ||
                      [];

            setCourses(courseList);

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


    return (
        <div style={styles.container}>

            <h1>
                Khóa học của tôi
            </h1>

            <p style={styles.subtitle}>
                Các khóa học bạn đã đăng ký
            </p>


            {courses.length === 0 ? (

                <div style={styles.empty}>

                    <h2>
                        Bạn chưa đăng ký khóa học nào
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/courses")
                        }
                    >
                        Khám phá khóa học
                    </button>

                </div>

            ) : (

                <div style={styles.grid}>

                    {courses.map((item) => {

                        /*
                         * Backend có thể trả:
                         *
                         * {
                         *   id,
                         *   course: {...}
                         * }
                         *
                         * hoặc trực tiếp course.
                         */

                        const course =
                            item.course || item;

                        return (
                            <div
                                key={
                                    item.id ||
                                    course.id
                                }
                                style={styles.card}
                            >

                                <div
                                    style={
                                        styles.thumbnail
                                    }
                                >

                                    {course.thumbnail ? (

                                        <img
                                            src={
                                                course.thumbnail
                                            }
                                            alt={
                                                course.title
                                            }
                                            style={
                                                styles.image
                                            }
                                        />

                                    ) : (

                                        <div>
                                            Không có hình ảnh
                                        </div>

                                    )}

                                </div>


                                <div
                                    style={
                                        styles.content
                                    }
                                >

                                    <h3>
                                        {course.title}
                                    </h3>


                                    <p>
                                        {course.description
                                            ? course.description.substring(
                                                0,
                                                120
                                            )
                                            : ""
                                        }
                                    </p>


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/learning/${course.id}`
                                            )
                                        }
                                    >
                                        Học ngay
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}


const styles = {

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px"
    },

    subtitle: {
        color: "#666",
        marginBottom: "30px"
    },

    empty: {
        textAlign: "center",
        padding: "60px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "25px"
    },

    card: {
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.1)"
    },

    thumbnail: {
        height: "180px",
        background: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },

    content: {
        padding: "20px"
    }

};

export default MyCourses;