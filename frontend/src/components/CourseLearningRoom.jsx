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
  const [isPlaying, setIsPlaying] = useState(true);
  const [codeEditorValue, setCodeEditorValue] = useState(`// Bài tập thực hành: ${course?.title || 'Khóa học EduViet'}
function solution() {
  console.log("Xin chào! Bắt đầu học và thực hành ngay trên EduViet IDE.");
  return true;
}
solution();`);
  const [terminalOutput, setTerminalOutput] = useState('EduViet Virtual Node.js v20.11 Environment Ready.\nBấm "Chạy Thử Code" để biên dịch kết quả.');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Mapping video YouTube thực tế theo từng môn học
  const getCourseVideoId = (courseId) => {
    switch (courseId) {
      case 1: // React & Next.js
        return 'bMknfKXIFA8';
      case 2: // NestJS & MySQL
        return '1dqp4flwjlk';
      case 3: // MySQL Database
        return 'HXV3zeQKqGY';
      case 4: // Python & AI
        return 'rfscVS0vtbw';
      case 5: // DevOps Docker
        return 'pTXWhryx4e8';
      case 6: // Flutter & Dart
        return 'IgTUncKx66M';
      case 7: // Golang
        return 'un6ZyFkqFKo';
      case 8: // Next.js 15
        return 'Q-cPtlYG1cY';
      default:
        return 'bMknfKXIFA8';
    }
  };

  const defaultVideoId = getCourseVideoId(course?.course_id || 1);

  // Danh sách bài giảng thực tế theo giáo trình EduViet
  const modules = [
    {
      moduleTitle: 'Chương 1: Tổng Quan & Thiết Lập Môi Trường Dự Án',
      lessons: [
        {
          id: 1,
          title: '01. Giới thiệu tổng quan lộ trình & cài đặt công cụ cần thiết',
          duration: '15:20',
          videoId: defaultVideoId,
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
          videoId: defaultVideoId,
          description: 'Phân tách các tầng Service, Repository, Controller và DTO đảm bảo khả năng mở rộng hàng triệu users.',
          sampleCode: `// Định nghĩa Interface User DTO
interface CreateUserDto {
  fullName: string;
  email: string;
  targetTrack: 'Frontend' | 'Backend' | 'DevOps';
}
const student = {
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
          videoId: defaultVideoId,
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
          videoId: defaultVideoId,
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
          videoId: 'pTXWhryx4e8',
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
          videoId: defaultVideoId,
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
    setIsPlaying(true);
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
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        
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
      {/* Top Banner Navigation */}
      <div className="bg-dark text-white py-3 px-lg-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            size="sm"
            className="rounded-pill px-3"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-1"></i> Trở về Khóa học
          </Button>
          <div>
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <span className="text-warning">●</span> {course?.title || 'Phòng Học Trực Tuyến'}
            </h5>
            <span className="text-secondary small">
              Giảng viên: {course?.instructor?.name || 'Mentor EduViet'} | Đang học bài {activeLessonIndex + 1}/{allLessons.length}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-md-block" style={{ width: 180 }}>
            <div className="d-flex justify-content-between small text-secondary mb-1">
              <span>Tiến độ hoàn thành:</span>
              <strong className="text-success">{progressPercent}%</strong>
            </div>
            <ProgressBar now={progressPercent} variant="success" style={{ height: 6 }} className="rounded-pill" />
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
            {/* Khung Chiếu Video YouTube Bài Giảng Trực Tiếp */}
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden mb-3 bg-black">
              <div className="ratio ratio-16x9">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLesson.videoId || defaultVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-100 h-100 border-0"
                  />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center bg-dark text-white p-4">
                    <div
                      className="rounded-circle bg-primary bg-opacity-25 border border-primary p-4 mb-3 d-flex align-items-center justify-content-center text-primary"
                      style={{ width: 88, height: 88, fontSize: '2.5rem', cursor: 'pointer' }}
                      onClick={() => setIsPlaying(true)}
                    >
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <h5 className="fw-bold mb-1 text-center">{currentLesson.title}</h5>
                    <p className="text-secondary small mb-3 text-center" style={{ maxWidth: 520 }}>
                      {currentLesson.description}
                    </p>
                    <Button
                      variant="primary"
                      className="fw-bold px-4 rounded-pill shadow-sm"
                      onClick={() => setIsPlaying(true)}
                    >
                      <i className="bi bi-play-fill me-1"></i> Bật Video Bài Giảng ({currentLesson.duration})
                    </Button>
                  </div>
                )}
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
                    onClick={() => setCodeEditorValue(currentLesson?.sampleCode || '')}
                    title="Đặt lại mã nguồn mẫu"
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i> Khôi phục mẫu
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="fw-bold rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                  >
                    {isRunningCode ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Đang chạy...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-play-circle-fill"></i>
                        <span>Chạy Thử Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                <div className="p-2 bg-dark">
                  <textarea
                    rows={8}
                    value={codeEditorValue}
                    onChange={(e) => setCodeEditorValue(e.target.value)}
                    className="form-control bg-dark text-light border-0 font-monospace p-3"
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      backgroundColor: '#1e1e1e !important',
                      color: '#9cdcfe',
                    }}
                    placeholder="// Nhập code JavaScript hoặc TypeScript tại đây..."
                  />
                </div>

                {/* Khung Console Output */}
                <div className="bg-black text-white p-3 font-monospace border-top" style={{ fontSize: '0.82rem', maxHeight: 180, overflowY: 'auto' }}>
                  <div className="text-secondary border-bottom border-secondary pb-1 mb-2 d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-terminal me-1 text-success"></i> Terminal Output Console</span>
                    <span className="badge bg-secondary">Exit Code 0</span>
                  </div>
                  <pre className="mb-0 text-success-emphasis" style={{ whiteSpace: 'pre-wrap' }}>
                    {terminalOutput}
                  </pre>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột Phải: Danh Sách Giáo Trình & Bài Học */}
          <Col lg={4} xl={4}>
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden bg-white sticky-top" style={{ top: 80 }}>
              <Card.Header className="bg-white border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Nội Dung Khóa Học</h6>
                  <span className="text-secondary small">{allLessons.length} bài giảng • Toàn bộ video HD</span>
                </div>
                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-2 py-1 rounded-pill">
                  {completedLessons.length}/{allLessons.length} bài
                </Badge>
              </Card.Header>

              <Card.Body className="p-0" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <Accordion defaultActiveKey="0" flush>
                  {modules.map((mod, modIdx) => (
                    <Accordion.Item eventKey={String(modIdx)} key={modIdx}>
                      <Accordion.Header>
                        <span className="fw-bold small text-dark">{mod.moduleTitle}</span>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <div className="list-group list-group-flush">
                          {mod.lessons.map((lesson) => {
                            const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
                            const isActive = globalIdx === activeLessonIndex;
                            const isDone = completedLessons.includes(globalIdx);

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => handleSelectLesson(globalIdx, lesson)}
                                className={`list-group-item list-group-item-action border-0 py-3 px-3 d-flex align-items-start gap-2 ${
                                  isActive ? 'bg-primary-subtle border-start border-primary border-4 fw-bold' : ''
                                }`}
                              >
                                <span className="pt-1">
                                  {isDone ? (
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                  ) : (
                                    <i className="bi bi-circle text-secondary fs-5"></i>
                                  )}
                                </span>
                                <div className="flex-grow-1 text-start">
                                  <div className="d-flex justify-content-between align-items-baseline mb-1">
                                    <span className={`small ${isActive ? 'text-primary fw-bold' : 'text-dark'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: '0.75rem' }}>
                                    <span><i className="bi bi-play-circle me-1"></i> Video YouTube</span>
                                    <span>•</span>
                                    <span><i className="bi bi-clock me-1"></i> {lesson.duration}</span>
                                    {isActive && (
                                      <span className="badge bg-primary text-white ms-auto">Đang xem</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
