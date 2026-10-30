import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Spinner, Alert } from 'react-bootstrap';

export default function MyLearningDashboard({
  currentUser,
  courses = [],
  onNavigate,
  onStartLearning,
  onOpenDeposit,
}) {
  const [enrolledCoursesList, setEnrolledCoursesList] = useState([]);

  useEffect(() => {
    const enrolledIds = currentUser?.enrolledCourses || [1]; // Demo default has course 1
    const list = courses.filter((c) => enrolledIds.includes(c.course_id));
    setEnrolledCoursesList(list.length > 0 ? list : courses.slice(0, 1));
  }, [currentUser, courses]);

  const primaryCourse = enrolledCoursesList[0];

  return (
    <div className="my-learning-dashboard pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-4 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <Badge bg="warning" text="dark" className="px-3 py-1 fw-bold rounded-pill mb-2">
                <i className="bi bi-mortarboard-fill me-1"></i> GÓC HỌC TẬP CỦA TÔI
              </Badge>
              <h2 className="fw-bold mb-1">
                Chào mừng trở lại, {currentUser?.fullName || 'Học viên'}!
              </h2>
              <p className="text-light small mb-0 opacity-85">
                Tiếp tục hành trình chinh phục kiến thức lập trình thực chiến hôm nay.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-light"
                size="sm"
                className="rounded-pill px-3"
                onClick={() => onNavigate('practice')}
              >
                <i className="bi bi-code-slash me-1"></i> Trung tâm luyện tập
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="app-container">
        {/* 2. KHỐI "HỌC TIẾP" NỔI BẬT NHẤT */}
        {primaryCourse && (
          <Card className="border-0 shadow rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)', borderLeft: '6px solid #0d6efd' }}>
            <Row className="align-items-center g-3">
              <Col md={8}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="success" className="rounded-pill px-3 py-1 fw-bold">
                    <i className="bi bi-play-circle-fill me-1"></i> ĐANG HỌC DỞ DANG
                  </Badge>
                  <span className="text-muted small">Mốc xem gần nhất: 14:20</span>
                </div>

                <h4 className="fw-bold text-dark mb-1">{primaryCourse.title}</h4>
                <p className="text-muted small mb-3">
                  Bài học tiếp theo: <strong>Bài 3: Cấu trúc Component & Xử lý sự kiện với React Hooks</strong>
                </p>

                <div className="d-flex align-items-center gap-3" style={{ maxWidth: '480px' }}>
                  <ProgressBar now={42} variant="primary" className="flex-grow-1 rounded-pill" style={{ height: '8px' }} />
                  <span className="small fw-bold text-primary">42% hoàn thành</span>
                </div>
              </Col>

              <Col md={4} className="text-md-end">
                <Button
                  variant="primary"
                  size="lg"
                  className="fw-bold px-4 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                  onClick={() => onStartLearning ? onStartLearning(primaryCourse) : onNavigate('courses')}
                >
                  <i className="bi bi-play-fill fs-4"></i>
                  Vào Học Tiếp Ngay
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        {/* 3. DANH SÁCH KHÓA HỌC ĐÃ MUA */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-collection-play text-primary"></i>
            Khóa Học Bạn Đang Sở Hữu ({enrolledCoursesList.length})
          </h5>

          <Row className="g-3">
            {enrolledCoursesList.map((course) => (
              <Col key={course.course_id} md={6}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 p-3 bg-white hover-shadow transition">
                  <div className="d-flex gap-3">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="rounded-3"
                      style={{ width: '110px', height: '80px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <strong className="d-block text-dark small mb-1">{course.title}</strong>
                      <span className="text-muted x-small d-block mb-2">Giảng viên: {course.instructor?.name || 'EduViet Specialist'}</span>

                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="py-1 px-3 rounded-pill fw-bold"
                          onClick={() => onStartLearning ? onStartLearning(course) : onNavigate('courses')}
                        >
                          <i className="bi bi-play-circle me-1"></i> Vào học
                        </Button>
                        <span className="badge bg-light text-secondary border small">Đang kích hoạt</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 4. ÔN TẬP ĐIỂM YẾU & PHẢN HỒI */}
        <Row className="g-3">
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle text-warning"></i>
                Chủ Đề Cần Ôn Tập Lại (Weak Areas)
              </h6>
              <p className="text-muted small mb-3">
                Dựa trên các câu hỏi bạn từng trả lời sai trong bài luyện tập:
              </p>
              <ul className="list-unstyled mb-3 small d-flex flex-column gap-2">
                <li className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span>State immutability trong React Hooks</span>
                  <Badge bg="warning" text="dark">1 bài sai</Badge>
                </li>
                <li className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span>Asynchronous Event Loop trong JavaScript</span>
                  <Badge bg="warning" text="dark">1 bài sai</Badge>
                </li>
              </ul>
              <Button
                variant="outline-warning"
                size="sm"
                className="w-100 fw-bold rounded-pill text-dark"
                onClick={() => onNavigate('practice')}
              >
                Ôn Lại Các Chủ Đề Này Ngay
              </Button>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-headset text-info"></i>
                Hỗ Trợ & Phản Hồi Từ Giảng Viên
              </h6>
              <p className="text-muted small mb-3">
                Các câu hỏi kỹ thuật hoặc thắc mắc giáo trình gần đây:
              </p>
              <div className="p-3 bg-light rounded-3 small mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <strong>TCK-89214: Hỏi về useActionState</strong>
                  <Badge bg="success">Đã giải đáp</Badge>
                </div>
                <p className="text-muted mb-0 x-small">
                  Giảng viên đã phản hồi chi tiết cách áp dụng kèm code mẫu trong phòng học.
                </p>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100 fw-bold rounded-pill"
                onClick={() => onNavigate('help')}
              >
                Gửi Thêm Câu Hỏi Mới
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
