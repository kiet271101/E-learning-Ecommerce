import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {

    const navigate = useNavigate();

    const handleViewDetail = () => {

        navigate(`/courses/${course.id}`);
    };

    return (
        <div style={styles.card}>

            {/* THUMBNAIL */}

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

            {/* CONTENT */}

            <div style={styles.content}>

                <h3 style={styles.title}>
                    {course.title}
                </h3>

                <p style={styles.description}>
                    {course.description
                        ? course.description.substring(
                            0,
                            100
                        )
                        : "Chưa có mô tả"}
                </p>

                {/* CATEGORY */}

                {course.category && (
                    <p>
                        Danh mục:{" "}
                        {course.category.name}
                    </p>
                )}

                {/* TEACHER */}

                {course.teacher && (
                    <p>
                        Giảng viên:{" "}
                        {course.teacher.name}
                    </p>
                )}

                {/* PRICE */}

                <div style={styles.bottom}>

                    <strong style={styles.price}>

                        {Number(course.price) === 0
                            ? "Miễn phí"
                            : `${Number(
                                course.price
                            ).toLocaleString("vi-VN")} đ`
                        }

                    </strong>

                    <button
                        onClick={handleViewDetail}
                    >
                        Xem chi tiết
                    </button>

                </div>

            </div>

        </div>
    );
}

const styles = {

    card: {
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow:
            "0 3px 10px rgba(0,0,0,0.1)",
        transition: "0.2s"
    },

    thumbnail: {
        width: "100%",
        height: "180px",
        background: "#eee"
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },

    noImage: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#777"
    },

    content: {
        padding: "20px"
    },

    title: {
        marginBottom: "10px"
    },

    description: {
        color: "#666",
        lineHeight: "1.5"
    },

    bottom: {
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    price: {
        fontSize: "18px"
    }

};

export default CourseCard;