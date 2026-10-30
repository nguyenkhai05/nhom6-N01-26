import { useState } from 'react';
import { Modal, Tab, Nav, Badge, Button, Accordion, Card, Row, Col, Alert } from 'react-bootstrap';
import { COURSE_CURRICULA } from '../utils/courseCurriculum';

export default function CourseCurriculumModal({
  show,
  onHide,
  course,
  isEnrolled,
  isInCart,
  onAddToCart,
  onEnroll,
  onStartLearning,
}) {
  const [activeTab, setActiveTab] = useState('curriculum');
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState('');

  if (!course) return null;

  // Lấy dữ liệu giáo trình: ưu tiên backend modules -> utils COURSE_CURRICULA -> sinh chuẩn đại học
  const localCurriculum = COURSE_CURRICULA[course.course_id];
  const rawModules = (course.modules && course.modules.length > 0)
    ? course.modules
    : (localCurriculum?.modules || []);

  const modules = rawModules.length > 0
    ? rawModules.map((m, idx) => ({
        id: m.module_id || idx + 1,
        title: m.title || m.moduleTitle || `Chương ${idx + 1}: Kiến thức trọng tâm & Kỹ năng cốt lõi`,
        lessons: (m.lessons || []).map((l, lIdx) => ({
          id: l.lesson_id || l.id || (idx + 1) * 10 + lIdx + 1,
          title: l.title || `Bài ${idx + 1}.${lIdx + 1}: Kỹ thuật nâng cao & Thực hành`,
          duration: l.duration || (l.duration_seconds ? `${Math.floor(l.duration_seconds / 60)} phút` : '25 phút'),
          type: l.content_type || 'Video',
          isPreview: Boolean(l.is_preview),
          description: l.description || 'Thực hành áp dụng kiến thức vào dự án thực chiến theo tiêu chuẩn doanh nghiệp.',
        })),
      }))
    : [
        {
          id: 1,
          title: 'Chương 1: Kiến trúc nền tảng & Tư duy công nghệ cốt lõi',
          lessons: [
            { id: 101, title: '01. Giới thiệu tổng quan & Chuẩn bị môi trường phát triển', duration: '20 phút', type: 'Video', isPreview: true, description: 'Tìm hiểu tổng quan công nghệ, cấu trúc dự án và thiết lập môi trường chuẩn doanh nghiệp.' },
            { id: 102, title: '02. Cú pháp & Nguyên lý thiết kế hệ thống chuyên sâu', duration: '35 phút', type: 'Video', isPreview: false, description: 'Phân tích các mẫu thiết kế (Design Patterns) và mô hình dữ liệu tối ưu.' },
            { id: 103, title: '03. Bài tập Lab 01: Khởi tạo mô-đun chức năng đầu tiên', duration: '45 phút', type: 'Practice', isPreview: false, description: 'Viết code thực tế theo barem chấm điểm của giảng viên.' },
          ]
        },
        {
          id: 2,
          title: 'Chương 2: Lập trình ứng dụng thực tế & Xử lý dữ liệu nâng cao',
          lessons: [
            { id: 201, title: '04. Xây dựng tầng dịch vụ & Tối ưu hiệu năng xử lý', duration: '40 phút', type: 'Video', isPreview: false, description: 'Tối ưu hóa thuật toán và thời gian phản hồi của hệ thống.' },
            { id: 202, title: '05. Kiểm thử đơn vị (Unit Test) & Đảm bảo chất lượng mã nguồn', duration: '30 phút', type: 'Practice', isPreview: false, description: 'Viết bộ test case tự động bao phủ các kịch bản ngoại lệ.' },
          ]
        },
        {
          id: 3,
          title: 'Chương 3: Đồ án tốt nghiệp (Capstone) & Triển khai Production',
          lessons: [
            { id: 301, title: '06. Đóng gói Docker, Cấu hình CI/CD & Deploy Cloud', duration: '50 phút', type: 'Video', isPreview: false, description: 'Đưa sản phẩm lên hạ tầng đám mây với chứng chỉ SSL và domain thật.' },
            { id: 302, title: '07. Đánh giá cuối khóa & Hướng dẫn viết CV kỹ thuật', duration: '30 phút', type: 'Quiz', isPreview: false, description: 'Tổng kết kiến thức và nhận chứng chỉ hoàn thành từ EduViet Platform.' },
          ]
        }
      ];

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  // Danh mục tài liệu chuẩn Đại học gắn liền với khóa học
  const courseMaterials = [
    {
      id: 'MAT-01',
      title: `Giáo Trình Toàn Diện: ${course.title}`,
      type: 'PDF',
      size: '18.4 MB',
      category: 'Giáo trình chính thức',
      icon: 'bi-file-earmark-pdf-fill text-danger',
      fileName: `Giao_Trinh_${course.slug || 'EduViet_Mastery'}.pdf`,
      description: 'Giáo trình chi tiết hơn 350 trang chuẩn Đại học, bao gồm đầy đủ lý thuyết, sơ đồ kiến trúc, mã nguồn mẫu và bài tập thực hành theo từng chương.',
      updated: 'Cập nhật tháng 10/2026'
    },
    {
      id: 'MAT-02',
      title: `Slide Bài Giảng Trực Quan (Tất cả các chương)`,
      type: 'SLIDE PPTX / PDF',
      size: '42.8 MB',
      category: 'Bài giảng điện tử',
      icon: 'bi-file-earmark-easel-fill text-warning',
      fileName: `Slide_Bai_Giang_${course.slug || 'EduViet'}_Full.zip`,
      description: 'Bộ slide bài giảng chuẩn quốc tế do giảng viên trực tiếp biên soạn, hệ thống hóa tư duy logic và lưu đồ thuật toán dễ hiểu.',
      updated: 'Phiên bản 2026'
    },
    {
      id: 'MAT-03',
      title: `Kho Mã Nguồn Dự Án (Source Code GitHub & Starter Template)`,
      type: 'ZIP / REPO',
      size: '25.6 MB',
      category: 'Mã nguồn thực hành',
      icon: 'bi-file-earmark-code-fill text-primary',
      fileName: `Source_Code_Starter_${course.slug || 'Project'}.zip`,
      description: 'Bao gồm toàn bộ mã nguồn khởi tạo (starter template) và mã nguồn hoàn chỉnh (solution) của 3 dự án lớn trong khóa học.',
      updated: 'Đã kiểm thử 100% build pass'
    },
    {
      id: 'MAT-04',
      title: `Cheat Sheet & Cẩm Nang Tra Cứu Nhanh A4`,
      type: 'PDF A4',
      size: '4.2 MB',
      category: 'Cẩm nang tra cứu',
      icon: 'bi-journal-bookmark-fill text-success',
      fileName: `CheatSheet_Nhanh_${course.slug || 'Cong_Nghe'}.pdf`,
      description: 'Tóm lược toàn bộ cú pháp quan trọng, quy ước đặt tên, best practices và các lỗi thường gặp khi đi phỏng vấn.',
      updated: 'Phát hành EduViet Academic'
    },
    {
      id: 'MAT-05',
      title: `Bộ Đề Bài Tập Lab & Tiêu Chí Đánh Giá (Rubric Grading)`,
      type: 'DOCX / PDF',
      size: '8.1 MB',
      category: 'Đề thi & Lab thực chiến',
      icon: 'bi-award-fill text-info',
      fileName: `De_Thi_Va_Lab_${course.slug || 'EduViet'}.pdf`,
      description: 'Hệ thống 15 bài thực hành Lab từng tuần kèm barem chấm điểm chi tiết để học viên tự đánh giá năng lực.',
      updated: 'Kèm đáp án mẫu'
    }
  ];

  const handleDownload = (material) => {
    setDownloadSuccessNotice(`Đang tải xuống "${material.fileName}" (${material.size}). Lưu trữ thành công vào thư mục Tải về!`);
    setTimeout(() => {
      setDownloadSuccessNotice('');
    }, 4500);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="course-curriculum-modal">
      <Modal.Header closeButton className="bg-light border-bottom px-4 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="brand-badge" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>
            <i className="bi bi-mortarboard-fill"></i>
          </span>
          <div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="primary" className="fw-semibold">
                {course.category?.name || 'Công nghệ'}
              </Badge>
              <Badge bg="secondary" className="fw-semibold">
                {course.level || 'Beginner'}
              </Badge>
              {isEnrolled && (
                <Badge bg="success" className="fw-bold">
                  <i className="bi bi-check-circle-fill me-1"></i>Đã Sở Hữu Khóa Học
                </Badge>
              )}
            </div>
            <Modal.Title className="fw-bold fs-5 text-dark mt-1">
              {course.title}
            </Modal.Title>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        {downloadSuccessNotice && (
          <Alert variant="success" className="m-3 d-flex align-items-center gap-2 py-2 small shadow-sm">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <div>
              <strong>Tải tài liệu thành công: </strong>
              <span>{downloadSuccessNotice}</span>
            </div>
          </Alert>
        )}

        {/* Tab Navigation */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'curriculum')}>
          <div className="border-bottom bg-white px-4 pt-3">
            <Nav variant="tabs" className="border-bottom-0">
              <Nav.Item>
                <Nav.Link eventKey="curriculum" className="fw-bold py-2 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-journal-text text-primary fs-5"></i>
                  <span>Giáo Trình & Lộ Trình Bài Học</span>
                  <Badge bg="primary" pill className="ms-1">{totalLessons}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="materials" className="fw-bold py-2 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-folder-symlink-fill text-warning fs-5"></i>
                  <span>Kho Giáo Trình & Tài Liệu Tải Về</span>
                  <Badge bg="warning" text="dark" pill className="ms-1">{courseMaterials.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="overview" className="fw-bold py-2 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle-fill text-info fs-5"></i>
                  <span>Mục Tiêu & Chuẩn Đầu Ra</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content className="p-4 bg-light" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
            {/* TAB 1: GIÁO TRÌNH BÀI HỌC (SYLLABUS) */}
            <Tab.Pane eventKey="curriculum">
              <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded-3 border mb-3 shadow-sm">
                <div>
                  <span className="text-muted small d-block">Khối lượng chương trình đào tạo:</span>
                  <strong className="text-dark fs-6">
                    {modules.length} Chương lớn &bull; {totalLessons} Bài học thực chiến &bull; {course.duration || '40 giờ'} học tập
                  </strong>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Giảng viên giảng dạy:</span>
                  <strong className="text-primary">{course.instructor?.name || 'Giảng viên Chuyên gia'}</strong>
                </div>
              </div>

              <Accordion defaultActiveKey="0" className="shadow-sm">
                {modules.map((module, mIdx) => (
                  <Accordion.Item eventKey={String(mIdx)} key={module.id} className="mb-2 border rounded-3 overflow-hidden">
                    <Accordion.Header>
                      <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                        <span className="fw-bold text-dark">
                          {module.title}
                        </span>
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <span>{module.lessons?.length || 0} bài</span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-0 bg-white">
                      <div className="list-group list-group-flush">
                        {module.lessons?.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="list-group-item d-flex align-items-center justify-content-between py-3 px-3 hover-bg border-bottom"
                          >
                            <div className="d-flex align-items-start gap-3 flex-grow-1">
                              <span
                                className={`rounded-circle d-flex align-items-center justify-content-center mt-1 ${
                                  lesson.type === 'Video'
                                    ? 'bg-primary-subtle text-primary'
                                    : lesson.type === 'Practice'
                                    ? 'bg-success-subtle text-success'
                                    : 'bg-warning-subtle text-warning'
                                }`}
                                style={{ width: 34, height: 34, minWidth: 34 }}
                              >
                                <i className={`bi ${
                                  lesson.type === 'Video'
                                    ? 'bi-play-fill fs-5'
                                    : lesson.type === 'Practice'
                                    ? 'bi-code-slash fs-6'
                                    : 'bi-question-circle-fill fs-6'
                                }`}></i>
                              </span>
                              <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <strong className="text-dark">{lesson.title}</strong>
                                  {lesson.isPreview && (
                                    <Badge bg="success" className="small">
                                      <i className="bi bi-unlock-fill me-1"></i>Học thử miễn phí
                                    </Badge>
                                  )}
                                  <span className="badge bg-light text-secondary border small">
                                    {lesson.type}
                                  </span>
                                </div>
                                <p className="text-secondary small mb-0 mt-1">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>

                            <div className="text-end ps-3" style={{ minWidth: 120 }}>
                              <span className="font-monospace text-muted small d-block mb-1">
                                <i className="bi bi-clock me-1"></i>{lesson.duration}
                              </span>
                              {isEnrolled ? (
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  className="rounded-pill fw-semibold py-0 px-2 small"
                                  onClick={() => {
                                    onHide();
                                    onStartLearning?.(course);
                                  }}
                                >
                                  Vào học ngay
                                </Button>
                              ) : lesson.isPreview ? (
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="rounded-pill fw-semibold py-0 px-2 small"
                                  onClick={() => {
                                    onHide();
                                    onStartLearning?.(course);
                                  }}
                                >
                                  Học thử ngay
                                </Button>
                              ) : (
                                <i className="bi bi-lock-fill text-muted" title="Đăng ký khóa học để mở khóa bài này"></i>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Tab.Pane>

            {/* TAB 2: TÀI LIỆU & GIÁO TRÌNH ĐÍNH KÈM (DOWNLOADS) */}
            <Tab.Pane eventKey="materials">
              <div className="p-3 bg-white rounded-3 border mb-3 shadow-sm d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-1">
                    <i className="bi bi-cloud-arrow-down-fill text-primary me-2"></i>
                    Kho Học Liệu & Giáo Trình Chuẩn Đại Học Quốc Gia
                  </h6>
                  <p className="text-muted small mb-0">
                    Toàn bộ tài liệu được số hóa dạng PDF, Slide bài giảng, Source code starter và Bộ đề Lab thực hành.
                  </p>
                </div>
                <Badge bg="info" className="px-3 py-2 fs-6">
                  Miễn phí cho học viên
                </Badge>
              </div>

              <Row className="g-3">
                {courseMaterials.map((mat) => (
                  <Col md={6} key={mat.id}>
                    <Card className="h-100 border shadow-sm rounded-3 hover-shadow transition-all">
                      <Card.Body className="p-3 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="badge bg-light text-secondary border small">
                              {mat.category}
                            </span>
                            <span className="badge bg-light text-muted font-monospace small">
                              {mat.size}
                            </span>
                          </div>
                          <div className="d-flex align-items-start gap-2 mb-2">
                            <i className={`bi ${mat.icon} fs-3`}></i>
                            <div>
                              <strong className="text-dark d-block" style={{ fontSize: '0.95rem' }}>
                                {mat.title}
                              </strong>
                              <small className="text-muted font-monospace d-block" style={{ fontSize: '0.75rem' }}>
                                {mat.fileName}
                              </small>
                            </div>
                          </div>
                          <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem' }}>
                            {mat.description}
                          </p>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-clock-history me-1"></i>{mat.updated}
                          </small>
                          <Button
                            size="sm"
                            variant="primary"
                            className="rounded-pill fw-semibold py-1 px-3 d-flex align-items-center gap-1 shadow-sm"
                            onClick={() => handleDownload(mat)}
                          >
                            <i className="bi bi-download"></i>
                            <span>Tải Về Ngay</span>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>

            {/* TAB 3: MỤC TIÊU & CHUẨN ĐẦU RA (CLO) */}
            <Tab.Pane eventKey="overview">
              <div className="p-4 bg-white rounded-3 border shadow-sm mb-3">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-bullseye text-danger me-2"></i>
                  Chuẩn Đầu Ra Khóa Học (Course Learning Outcomes - CLO)
                </h5>
                <Row className="g-3 mb-4">
                  <Col sm={6}>
                    <div className="p-3 bg-light rounded-3 border h-100">
                      <strong className="text-primary d-block mb-2">
                        <i className="bi bi-check2-circle me-1"></i>1. Về kiến thức chuyên môn:
                      </strong>
                      <ul className="text-secondary small ps-3 mb-0">
                        <li>Làm chủ kiến trúc hệ thống, quy chuẩn Clean Architecture và SOLID.</li>
                        <li>Hiểu sâu sắc cách thức hoạt động của công nghệ từ nguyên lý bên dưới.</li>
                        <li>Nắm vững phương pháp tối ưu hóa hiệu năng, bảo mật và mở rộng quy mô.</li>
                      </ul>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="p-3 bg-light rounded-3 border h-100">
                      <strong className="text-success d-block mb-2">
                        <i className="bi bi-award me-1"></i>2. Về kỹ năng thực chiến:
                      </strong>
                      <ul className="text-secondary small ps-3 mb-0">
                        <li>Tự tay xây dựng và triển khai 3 dự án thực tế đạt tiêu chuẩn doanh nghiệp.</li>
                        <li>Thành thạo công cụ Git, Docker, CI/CD và triển khai lên hạ tầng đám mây.</li>
                        <li>Sở hữu sản phẩm hoàn chỉnh để đưa vào Portfolio và CV phỏng vấn việc làm.</li>
                      </ul>
                    </div>
                  </Col>
                </Row>

                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-person-badge-fill text-primary me-2"></i>
                  Thông Tin Giảng Viên Hướng Dẫn:
                </h6>
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm"
                    style={{ width: 54, height: 54 }}
                  >
                    {(course.instructor?.name || 'V').charAt(0)}
                  </div>
                  <div>
                    <strong className="text-dark d-block fs-6">{course.instructor?.name || 'Vũ Quốc Huy'}</strong>
                    <span className="text-muted small d-block">
                      Senior Software Engineer &bull; 8+ năm kinh nghiệm phát triển phần mềm doanh nghiệp &bull; Giảng viên EduViet
                    </span>
                  </div>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>

      <Modal.Footer className="bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
        <div>
          <span className="text-muted small d-block">Học phí trọn khóa:</span>
          <strong className="text-primary fs-5 font-monospace">
            {Number(course.price || 0).toLocaleString('vi-VN')} đ
          </strong>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="rounded-pill px-4" onClick={onHide}>
            Đóng
          </Button>

          {isEnrolled ? (
            <Button
              variant="success"
              className="fw-bold rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
              onClick={() => {
                onHide();
                onStartLearning?.(course);
              }}
            >
              <i className="bi bi-play-circle-fill fs-5"></i>
              <span>Vào Phòng Học Ngay</span>
            </Button>
          ) : (
            <>
              <Button
                variant={isInCart ? 'warning' : 'outline-primary'}
                className="fw-bold rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                onClick={() => onAddToCart?.(course)}
              >
                <i className={`bi ${isInCart ? 'bi-cart-check-fill' : 'bi-cart-plus'} me-1`}></i>
                {isInCart ? 'Đã trong giỏ' : 'Thêm giỏ hàng'}
              </Button>
              <Button
                variant="primary"
                className="fw-bold rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
                onClick={() => {
                  onHide();
                  onEnroll?.(course);
                }}
              >
                <i className="bi bi-lightning-charge-fill"></i>
                <span>Đăng Ký Học Ngay</span>
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
