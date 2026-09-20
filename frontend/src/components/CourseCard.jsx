import { useNavigate } from "react-router-dom";
import "../styles/CourseCard.css";

function CourseCard({ course }) {
    const navigate = useNavigate();

    const handleViewDetail = () => {
        navigate(`/courses/${course.id}`);
    };

    return (
        <div className="course-card">

            {/* THUMBNAIL */}
            <div className="course-card-thumbnail">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="course-card-image"
                    />
                ) : (
                    <div className="course-card-no-image">
                        Không có hình ảnh
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="course-card-content">

                <h3 className="course-card-title">
                    {course.title}
                </h3>

                <p className="course-card-description">
                    {course.description
                        ? course.description.substring(0, 100)
                        : "Chưa có mô tả"}
                    {course.description &&
                        course.description.length > 100 &&
                        "..."}
                </p>

                {/* CATEGORY */}
                {course.category && (
                    <p className="course-card-info">
                        <span className="course-card-label">
                            Danh mục:
                        </span>{" "}
                        {course.category.name}
                    </p>
                )}

                {/* TEACHER */}
                {course.teacher && (
                    <p className="course-card-info">
                        <span className="course-card-label">
                            Giảng viên:
                        </span>{" "}
                        {course.teacher.name}
                    </p>
                )}

                {/* BOTTOM */}
                <div className="course-card-bottom">

                    <strong className="course-card-price">
                        {Number(course.price) === 0
                            ? "Miễn phí"
                            : `${Number(
                                course.price
                            ).toLocaleString("vi-VN")} đ`}
                    </strong>

                    <button
                        type="button"
                        className="course-card-button"
                        onClick={handleViewDetail}
                    >
                        Xem chi tiết
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CourseCard;