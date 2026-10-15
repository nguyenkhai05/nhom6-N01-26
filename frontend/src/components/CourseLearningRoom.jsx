import { useState } from 'react';
import { Row, Col, Card, Button, Badge, ProgressBar, Tab, Nav, Accordion } from 'react-bootstrap';

export default function CourseLearningRoom({
  course,
  currentUser,
  onBack,
  onNavigate
}) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([0]);
  const [codeEditorValue, setCodeEditorValue] = useState(`// Bài tập thực hành: ${course?.title || 'Khóa học EduViet'}
function solution() {
  console.log("Xin chào! Bắt đầu học và thực hành ngay trên EduViet IDE.");
  return true;
}
solution();`);
  const [terminalOutput, setTerminalOutput] = useState('EduViet Virtual Node.js v20.11 Environment Ready.\nBấm "Chạy Thử Code" để biên dịch kết quả.');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Danh sách bài giảng thực tế theo giáo trình EduViet
  const modules = [
    {
      moduleTitle: 'Chương 1: Tổng Quan & Thiết Lập Môi Trường Dự Án',
      lessons: [
        {
          id: 1,
          title: '01. Giới thiệu tổng quan lộ trình & cài đặt công cụ cần thiết',
          duration: '15:20',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Nắm vững kiến trúc dự án thực tế, cài đặt Node.js LTS, Git và cấu hình Visual Studio Code chuẩn Production.',
          sampleCode: `// Cấu hình môi trường dự án
const appConfig = {
  env: 'development',
  port: 3000,
  dbHost: 'localhost',
  secret: 'EduViet2026Mastery'
};
console.log("Khởi tạo cấu hình:", appConfig);`
        },
        {
          id: 2,
          title: '02. Cấu trúc thư mục chuẩn Clean Architecture & TypeScript',
          duration: '24:10',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Phân tách các tầng Service, Repository, Controller và DTO đảm bảo khả năng mở rộng hàng triệu users.',
          sampleCode: `// Định nghĩa Interface User DTO
interface CreateUserDto {
  fullName: string;
  email: string;
  targetTrack: 'Frontend' | 'Backend' | 'DevOps';
}
const student: CreateUserDto = {
  fullName: "${currentUser?.fullName || 'Học viên'}",
  email: "${currentUser?.email || 'student@eduviet.vn'}",
  targetTrack: 'Frontend'
};
console.log("Học viên khởi tạo:", student);`
        },
      ]
    },
    {
      moduleTitle: 'Chương 2: Kiến Thức Chuyên Sâu & Xử Lý Dữ Liệu Thực Tế',
      lessons: [
        {
          id: 3,
          title: '03. Xử lý bất đồng bộ Async/Await & Tối ưu hiệu năng',
          duration: '32:45',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Thành thạo Promise.allSettled, quản lý luồng dữ liệu, xử lý Exception và Retry Pattern.',
          sampleCode: `async function fetchCourseLessons(courseId) {
  console.log("Đang tải dữ liệu bài học cho khóa #" + courseId);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 200, items: 24, cached: true }), 500);
  });
}
fetchCourseLessons(1).then(console.log);`
        },
        {
          id: 4,
          title: '04. Tích hợp Authentication JWT & Phân quyền RBAC',
          duration: '40:15',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Bảo mật API với Access Token, Refresh Token xoay vòng, Middleware kiểm soát quyền Guest/User/Admin.',
          sampleCode: `function checkPermission(userRole, requiredRole) {
  const roles = ['GUEST', 'USER', 'ADMIN'];
  return roles.indexOf(userRole) >= roles.indexOf(requiredRole);
}
console.log("Quyền truy cập:", checkPermission('${currentUser?.role || 'USER'}', 'USER'));`
        }
      ]
    },
    {
      moduleTitle: 'Chương 3: Đồ Án Cuối Khóa & Cấp Chứng Chỉ Tốt Nghiệp',
      lessons: [
        {
          id: 5,
          title: '05. Triển khai Docker Container & CI/CD GitHub Actions',
          duration: '45:00',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Đóng gói ứng dụng thành Docker Image, cấu hình Nginx Reverse Proxy và triển khai lên Cloud AWS.',
          sampleCode: `// Docker Healthcheck Simulation
const healthCheck = () => {
  return { uptime: process.uptime(), memoryUsage: process.memoryUsage().heapUsed, status: 'HEALTHY' };
};
console.log(healthCheck());`
        },
        {
          id: 6,
          title: '06. Đánh giá Code Review & Xuất Chứng Chỉ Certificate EduViet',
          duration: '28:30',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Nhận feedback trực tiếp từ Senior Mentor và nhận bằng chứng nhận kỹ sư có mã QR truy xuất quốc tế.',
          sampleCode: `console.log("Chúc mừng học viên đã hoàn thành 100% đồ án!");`
        }
      ]
    }
  ];

  // Flatten lessons
  const allLessons = modules.flatMap((m) => m.lessons);
  const currentLesson = allLessons[activeLessonIndex] || allLessons[0];

  const handleSelectLesson = (idx, lesson) => {
    setActiveLessonIndex(idx);
    if (!completedLessons.includes(idx)) {
      setCompletedLessons((prev) => [...prev, idx]);
    }
    if (lesson?.sampleCode) {
      setCodeEditorValue(lesson.sampleCode);
    }
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setTerminalOutput('Đang biên dịch code qua EduViet Sandbox Engine...');
    setTimeout(() => {
      setIsRunningCode(false);
      try {
        // Safe evaluation of console logs
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        
        // Execute sample
        const fn = new Function(codeEditorValue);
        fn();
        console.log = originalLog;

        setTerminalOutput(`[THÀNH CÔNG] - Biên dịch xong trong 0.18s:\n-------------------------------------\n` + (logs.length > 0 ? logs.join('\n') : 'Đoạn mã chạy thành công, không có lỗi runtime.'));
      } catch (err) {
        setTerminalOutput(`[LỖI CÚ PHÁP HOẶC RUNTIME]:\n${err.message}`);
      }
    }, 600);
  };

  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

  return (
    <div className="course-learning-room bg-light min-vh-100 pb-5 page-fade-in">
      {/* Top Navbar Học Tập Chuyên Nghiệp */}
      <div className="bg-dark text-white px-3 py-2 border-bottom border-secondary d-flex flex-wrap justify-content-between align-items-center sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            size="sm"
            className="rounded-pill px-3 fw-bold"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-1"></i> Quay lại
          </Button>
          <div className="vr bg-secondary d-none d-sm-block"></div>
          <div>
            <span className="badge bg-primary text-white me-2">Phòng Học Trực Tuyến</span>
            <strong className="text-white small d-inline-block text-truncate" style={{ maxWidth: 380 }}>
              {course?.title}
            </strong>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mt-2 mt-sm-0">
          <div className="d-none d-md-flex align-items-center gap-2">
            <span className="small text-muted">Tiến độ bài học:</span>
            <div style={{ width: 140 }}>
              <ProgressBar now={progressPercent} variant="success" style={{ height: 8 }} className="rounded-pill" />
            </div>
            <strong className="text-success small font-monospace">{progressPercent}%</strong>
          </div>

          <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-patch-check-fill me-1"></i> Đã Kích Hoạt Trọn Đời
          </Badge>
        </div>
      </div>

      <div className="container-fluid px-lg-4 py-3">
        <Row className="g-3">
          {/* Cột Trái & Giữa: Video Player & Khung Luyện Code Tương Tác */}
          <Col lg={8} xl={8}>
            {/* Khung Chiếu Video Bài Giảng */}
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden mb-3 bg-black">
              <div className="ratio ratio-16x9">
                <div className="d-flex flex-column align-items-center justify-content-center bg-dark text-white p-4">
                  <div
                    className="rounded-circle bg-primary bg-opacity-25 border border-primary p-4 mb-3 d-flex align-items-center justify-content-center text-primary"
                    style={{ width: 88, height: 88, fontSize: '2.5rem' }}
                  >
                    <i className="bi bi-play-circle-fill"></i>
                  </div>
                  <h5 className="fw-bold mb-1 text-center">{currentLesson.title}</h5>
                  <p className="text-secondary small mb-3 text-center" style={{ maxWidth: 520 }}>
                    {currentLesson.description}
                  </p>
                  <div className="d-flex gap-2">
                    <Button variant="primary" className="fw-bold px-4 rounded-pill shadow-sm">
                      <i className="bi bi-play-fill me-1"></i> Phát Video Bài Giảng ({currentLesson.duration})
                    </Button>
                    <Button variant="outline-light" className="rounded-pill px-3">
                      <i className="bi bi-download me-1"></i> Tải Tài Liệu
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Khung Thực Hành Code IDE Tương Tác Trực Tuyến */}
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden bg-white mb-3">
              <Card.Header className="bg-light border-bottom d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-terminal-fill text-primary fs-5"></i>
                  <strong className="text-dark small">EduViet Live Interactive Code Studio</strong>
                  <Badge bg="info-subtle" className="text-info border border-info-subtle small">JavaScript / Node.js 20</Badge>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => setCodeEditorValue(currentLesson.sampleCode || '')}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i> Đặt lại code
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="rounded-pill px-3 fw-bold shadow-sm"
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                  >
                    {isRunningCode ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span> Đang chạy...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-play-fill me-1"></i> Chạy Thử Code
                      </>
                    )}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <textarea
                  className="form-control font-monospace border-0 p-3"
                  style={{
                    backgroundColor: '#1e1e2e',
                    color: '#a6accd',
                    fontSize: '0.9rem',
                    minHeight: '220px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  value={codeEditorValue}
                  onChange={(e) => setCodeEditorValue(e.target.value)}
                />
                {/* Terminal Console Output */}
                <div className="p-3 border-top" style={{ backgroundColor: '#181825', color: '#89dceb', fontSize: '0.82rem', fontFamily: 'monospace', minHeight: 90 }}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1">
                    <i className="bi bi-terminal"></i> Console Output:
                  </div>
                  <pre className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap' }}>
                    {terminalOutput}
                  </pre>
                </div>
              </Card.Body>
            </Card>

            {/* Thông tin Giảng viên & Tài liệu tham khảo */}
            <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 44, height: 44 }}>
                    {course?.instructor?.name ? course.instructor.name.charAt(0) : 'E'}
                  </div>
                  <div>
                    <strong className="text-dark d-block">{course?.instructor?.name || 'Giảng viên Chuyên gia EduViet'}</strong>
                    <span className="text-muted small">Cố vấn giải đáp 1-1 & Hướng dẫn đồ án</span>
                  </div>
                </div>
                <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold" onClick={() => alert('Đã kết nối trợ giảng 1-1 qua Chatbot AI!')}>
                  <i className="bi bi-chat-dots me-1"></i> Đặt câu hỏi cho Mentor
                </Button>
              </div>
            </Card>
          </Col>

          {/* Cột Phải: Danh Sách Giáo Trình & Bài Học (Curriculum Accordion) */}
          <Col lg={4} xl={4}>
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden bg-white sticky-top" style={{ top: '80px' }}>
              <Card.Header className="bg-light border-bottom p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="bi bi-list-check text-primary me-2"></i>
                    Nội Dung Khóa Học
                  </h6>
                  <span className="badge bg-primary rounded-pill small">
                    {completedLessons.length}/{allLessons.length} bài đã học
                  </span>
                </div>
                <div className="small text-muted">
                  Thời lượng: <strong>{course?.duration || '40 giờ'}</strong> • {modules.length} Chương lớn
                </div>
              </Card.Header>

              <Card.Body className="p-0 overflow-auto" style={{ maxHeight: '70vh' }}>
                <Accordion defaultActiveKey="0" flush>
                  {modules.map((mod, modIdx) => (
                    <Accordion.Item eventKey={String(modIdx)} key={modIdx} className="border-bottom">
                      <Accordion.Header>
                        <div className="small fw-bold text-dark">
                          {mod.moduleTitle}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <div className="list-group list-group-flush small">
                          {mod.lessons.map((lesson) => {
                            const globalIndex = allLessons.findIndex((l) => l.id === lesson.id);
                            const isActive = globalIndex === activeLessonIndex;
                            const isDone = completedLessons.includes(globalIndex);

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                className={`list-group-item list-group-item-action text-start p-3 d-flex align-items-center justify-content-between border-0 ${
                                  isActive ? 'bg-primary-subtle text-primary fw-bold' : ''
                                }`}
                                onClick={() => handleSelectLesson(globalIndex, lesson)}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <i
                                    className={`bi ${
                                      isDone
                                        ? 'bi-check-circle-fill text-success fs-5'
                                        : isActive
                                        ? 'bi-play-circle-fill text-primary fs-5'
                                        : 'bi-circle text-muted fs-6'
                                    }`}
                                  ></i>
                                  <div>
                                    <div className="text-dark fw-semibold">{lesson.title}</div>
                                    <span className="text-muted small">
                                      <i className="bi bi-clock me-1"></i> {lesson.duration}
                                    </span>
                                  </div>
                                </div>
                                {isDone && (
                                  <Badge bg="success-subtle" className="text-success border border-success-subtle">
                                    Đã học
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>

              <Card.Footer className="bg-light p-3 border-top text-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100 rounded-pill fw-semibold"
                  onClick={() => onNavigate?.('my-learning')}
                >
                  <i className="bi bi-grid me-1"></i> Về Danh Sách Khóa Học Của Tôi
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
