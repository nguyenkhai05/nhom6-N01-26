import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { getMyCourses, getMySupportRequests } from '../services/hubApi';

export default function MyLearningDashboard({
  currentUser,
  courses = [],
  onNavigate,
  onStartLearning,
  onOpenDeposit,
}) {
  const [enrolledCoursesList, setEnrolledCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportTickets, setSupportTickets] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchLearningData() {
      setLoading(true);
      try {
        // 1. Thử gọi API lấy danh sách khóa học thực tế của người dùng từ máy chủ
        let serverCourses = [];
        try {
          const res = await getMyCourses();
          if (Array.isArray(res) && res.length > 0) {
            serverCourses = res.map((item) => ({
              ...(item.course || {}),
              course_id: item.course_id || item.course?.course_id,
              progress_percent: item.progress_percent ?? 0,
              enrolled_at: item.enrolled_at,
            }));
          }
        } catch {
          // Bỏ qua lỗi API nếu người dùng chưa đăng nhập hoặc mạng offline
        }

        // 2. Kết hợp với enrolledCourses trong currentUser nếu có
        if (serverCourses.length === 0 && currentUser?.enrolledCourses?.length > 0) {
          serverCourses = courses.filter((c) => currentUser.enrolledCourses.includes(c.course_id));
        }

        if (isMounted) {
          setEnrolledCoursesList(serverCourses);
        }

        // 3. Lấy danh sách ticket hỗ trợ của người dùng
        try {
          const tickets = await getMySupportRequests();
          if (isMounted && Array.isArray(tickets)) {
            setSupportTickets(tickets);
          }
        } catch {
          // Bỏ qua lỗi ticket
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu góc học tập:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLearningData();

    return () => {
      isMounted = false;
    };
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
                className="rounded-pill px-3 fw-bold"
                onClick={() => onNavigate('practice')}
              >
                <i className="bi bi-code-slash me-1"></i> Trung tâm luyện tập
              </Button>
              <Button
                variant="warning"
                size="sm"
                className="rounded-pill px-3 fw-bold text-dark"
                onClick={() => onNavigate('courses')}
              >
                <i className="bi bi-plus-circle me-1"></i> Khám phá khóa học
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="app-container">
        {loading ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted small mt-2 mb-0">Đang đồng bộ lộ trình học tập của bạn...</p>
          </div>
        ) : enrolledCoursesList.length === 0 ? (
          /* TRẠNG THÁI RỖNG (EMPTY STATE CHUẨN MỰC, KHÔNG GÁN KHÓA GIẢ MẠO) */
          <Card className="border-0 shadow-sm rounded-4 text-center p-5 mb-4 bg-white">
            <div className="mb-3">
              <span className="badge bg-primary-subtle text-primary p-3 rounded-circle fs-2">
                <i className="bi bi-mortarboard"></i>
              </span>
            </div>
            <h4 className="fw-bold text-dark mb-2">Bạn chưa đăng ký khóa học nào</h4>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '540px' }}>
              Hãy bắt đầu hành trình lập trình của bạn với các lộ trình chuyên sâu chuẩn doanh nghiệp từ EduViet, hoặc trải nghiệm viết code trực tiếp trên hệ thống Sandbox hoàn toàn miễn phí!
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                variant="primary"
                className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                onClick={() => onNavigate('courses')}
              >
                <i className="bi bi-compass me-1"></i> Khám phá danh mục khóa học
              </Button>
              <Button
                variant="outline-success"
                className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                onClick={() => onNavigate('try')}
              >
                <i className="bi bi-laptop me-1"></i> Học thử tương tác miễn phí
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* 2. KHỐI "HỌC TIẾP" NỔI BẬT DỰA TRÊN TIẾN ĐỘ THẬT */}
            {primaryCourse && (
              <Card
                className="border-0 shadow rounded-4 p-4 mb-4"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
                  borderLeft: '6px solid #0d6efd',
                }}
              >
                <Row className="align-items-center g-3">
                  <Col md={8}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Badge bg={primaryCourse.progress_percent > 0 ? 'success' : 'secondary'} className="rounded-pill px-3 py-1 fw-bold">
                        <i className={`bi ${primaryCourse.progress_percent > 0 ? 'bi-play-circle-fill' : 'bi-bookmark-check'} me-1`}></i>
                        {primaryCourse.progress_percent > 0 ? 'ĐANG TIẾP TỤC HỌC' : 'SẴN SÀNG BẮT ĐẦU'}
                      </Badge>
                      <span className="text-muted small">
                        {primaryCourse.category?.category_name || 'Khóa học chính khóa'}
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark mb-1">{primaryCourse.title}</h4>
                    <p className="text-muted small mb-3">
                      {primaryCourse.progress_percent > 0
                        ? `Tiến độ học tập hiện tại: ${primaryCourse.progress_percent}% hoàn thành.`
                        : 'Bạn chưa hoàn thành bài học nào trong khóa này. Hãy bắt đầu bài học đầu tiên!'}
                    </p>

                    <div className="d-flex align-items-center gap-3" style={{ maxWidth: '480px' }}>
                      <ProgressBar
                        now={primaryCourse.progress_percent || 0}
                        variant="primary"
                        className="flex-grow-1 rounded-pill"
                        style={{ height: '8px' }}
                      />
                      <span className="small fw-bold text-primary">
                        {primaryCourse.progress_percent || 0}% hoàn thành
                      </span>
                    </div>
                  </Col>

                  <Col md={4} className="text-md-end">
                    <Button
                      variant="primary"
                      size="lg"
                      className="fw-bold px-4 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                      onClick={() => (onStartLearning ? onStartLearning(primaryCourse) : onNavigate('courses'))}
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
                          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80'}
                          alt={course.title}
                          className="rounded-3"
                          style={{ width: '110px', height: '80px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <strong className="d-block text-dark small mb-1">{course.title}</strong>
                          <span className="text-muted x-small d-block mb-2">
                            Tiến độ: {course.progress_percent || 0}% | {course.level || 'Mọi trình độ'}
                          </span>

                          <div className="d-flex justify-content-between align-items-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="py-1 px-3 rounded-pill fw-bold"
                              onClick={() => (onStartLearning ? onStartLearning(course) : onNavigate('courses'))}
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
          </>
        )}

        {/* 4. LUYỆN TẬP VÀ TRỢ GIÚP HỌC VIÊN */}
        <Row className="g-3">
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge text-warning"></i>
                Trung Tâm Luyện Tập Kỹ Năng
              </h6>
              <p className="text-muted small mb-3">
                Rèn luyện khả năng sửa lỗi, giải bài tập thuật toán và đánh giá trình độ năng lực lập trình định kỳ:
              </p>
              <ul className="list-unstyled mb-3 small d-flex flex-column gap-2">
                <li className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span>Thử thách Code tuần: Tối ưu thuật toán mảng</span>
                  <Badge bg="success">Đang mở</Badge>
                </li>
                <li className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span>Đánh giá năng lực: Frontend React & ES6+</span>
                  <Badge bg="primary">Trắc nghiệm & Code</Badge>
                </li>
              </ul>
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100 fw-bold rounded-pill"
                onClick={() => onNavigate('practice')}
              >
                Vào Luyện Tập Ngay
              </Button>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-headset text-info"></i>
                Hỗ Trợ & Yêu Cầu Gần Đây
              </h6>
              {supportTickets.length > 0 ? (
                <div className="d-flex flex-column gap-2 mb-3">
                  {supportTickets.slice(0, 2).map((t, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 small border">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>{t.ticket_id}: {t.topic}</strong>
                        <Badge bg={t.status === 'RESOLVED' ? 'success' : 'warning'} text={t.status === 'RESOLVED' ? 'white' : 'dark'}>
                          {t.status === 'RESOLVED' ? 'Đã giải đáp' : 'Đang xử lý'}
                        </Badge>
                      </div>
                      <p className="text-muted mb-0 x-small text-truncate">
                        {t.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small mb-3">
                  Bạn chưa có yêu cầu hỗ trợ nào đang xử lý. Khi bạn gửi câu hỏi kỹ thuật hoặc thắc mắc học phí, tiến trình xử lý sẽ được cập nhật trực tiếp tại đây.
                </p>
              )}
              <Button
                variant="outline-info"
                size="sm"
                className="w-100 fw-bold rounded-pill text-dark"
                onClick={() => onNavigate('help')}
              >
                Gửi Yêu Cầu Hỗ Trợ
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
