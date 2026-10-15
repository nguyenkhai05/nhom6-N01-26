import { Row, Col } from 'react-bootstrap';
import CourseCard from './CourseCard';

export default function CourseList({
  courses = [],
  onViewDetail,
  onEnroll,
  enrolledCourseIds = [],
  onAddToCart,
  cartCourseIds = [],
  onStartLearning
}) {
  return (
    <div className="app-container py-4" id="courses">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-mortarboard-fill text-primary me-2"></i>
            Khóa Học Lập Trình Nổi Bật
          </h2>
          <p className="text-secondary small mb-0">
            Giáo trình bài bản, cập nhật công nghệ mới nhất 2026 kèm đồ án thực chiến
          </p>
        </div>
        <div className="mt-2 mt-md-0 text-secondary small">
          Hiển thị <strong>{courses.length}</strong> khóa học
        </div>
      </div>

      <Row className="g-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Col key={course.course_id} xs={12} sm={6} lg={4}>
              <CourseCard
                course={course}
                onViewDetail={onViewDetail}
                onEnroll={onEnroll}
                isEnrolled={enrolledCourseIds.includes(course.course_id)}
                onAddToCart={onAddToCart}
                isInCart={cartCourseIds.includes(course.course_id)}
                onStartLearning={onStartLearning}
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center py-5 bg-white rounded-4 border">
              <i className="bi bi-search text-muted display-4 d-block mb-3"></i>
              <h5>Không tìm thấy khóa học phù hợp</h5>
              <p className="text-secondary small mb-0">
                Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ khóa học.
              </p>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}
