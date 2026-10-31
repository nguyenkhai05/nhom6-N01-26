import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { getInstructor, createSupportRequest } from '../services/hubApi';

export default function InstructorDetailPage({
  slug,
  courses = [],
  onNavigate,
  onSelectCourse,
  onBack,
}) {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionContent, setQuestionContent] = useState('');
  const [questionCourseId, setQuestionCourseId] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      getInstructor(slug)
        .then((data) => {
          if (isMounted) {
            setInstructor(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const instructorCourses = courses.filter((c) =>
    instructor?.courseIds?.includes(c.course_id || c.id)
  );

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!questionContent.trim()) return;
    setSubmittingQuestion(true);
    try {
      await createSupportRequest({
        instructor_id: instructor?.id,
        course_id: questionCourseId ? Number(questionCourseId) : undefined,
        content: questionContent.trim(),
        type: 'INSTRUCTOR_QUESTION',
      });
      setQuestionSent(true);
      setTimeout(() => {
        setQuestionSent(false);
        setShowQuestionModal(false);
        setQuestionContent('');
      }, 1500);
    } catch {
      alert('Không thể gửi câu hỏi lúc này, vui lòng thử lại sau.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted small mt-2">Đang tải hồ sơ giảng viên...</p>
      </Container>
    );
  }

  if (!instructor) {
    return (
      <Container className="py-5 text-center">
        <h4>Không tìm thấy thông tin giảng viên</h4>
        <Button variant="primary" className="mt-3" onClick={onBack}>
          Quay lại danh sách giảng viên
        </Button>
      </Container>
    );
  }

  return (
    <div className="instructor-detail-page pb-5 page-fade-in">
      {/* 1. Header Hero */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0a2540 0%, #001226 100%)' }}
      >
        <Container className="app-container">
          <Button
            variant="outline-light"
            size="sm"
            className="rounded-pill px-3 mb-3 border-light border-opacity-25"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách giảng viên
          </Button>

          <div className="d-flex flex-wrap align-items-center gap-4">
            <img
              src={instructor.avatar}
              alt={instructor.displayName}
              className="rounded-circle border border-3 border-white shadow-lg"
              style={{ width: 110, height: 110, objectFit: 'cover' }}
            />
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h1 className="fw-bold display-6 mb-0 text-white">{instructor.displayName}</h1>
                <Badge bg="success" className="px-2 py-1 rounded-pill small">
                  <i className="bi bi-patch-check-fill me-1"></i>Đã Xác Thực
                </Badge>
              </div>
              <p className="lead text-light mb-2" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                {instructor.roleTitle}
              </p>
              <div className="d-flex align-items-center gap-3">
                <span className="small text-light text-opacity-75">
                  <i className="bi bi-journal-code me-1 text-warning"></i>
                  Phụ trách {instructor.coursesTaughtCount} khóa học chuyên sâu
                </span>
                {instructor.github && (
                  <a href={instructor.github} target="_blank" rel="noreferrer" className="text-light hover-primary">
                    <i className="bi bi-github fs-5"></i>
                  </a>
                )}
                {instructor.linkedin && (
                  <a href={instructor.linkedin} target="_blank" rel="noreferrer" className="text-light hover-primary">
                    <i className="bi bi-linkedin fs-5"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="app-container">
        <Row className="g-4">
          {/* Main Column: Bio & Methodology & Courses */}
          <Col lg={8}>
            {/* Giới thiệu & Kinh nghiệm */}
            <Card className="border rounded-4 shadow-xs p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-person-lines-fill text-primary me-2"></i>
                Giới Thiệu & Kinh Nghiệm Nghề Nghiệp
              </h5>
              <p className="text-secondary" style={{ lineHeight: 1.7, fontSize: '0.98rem' }}>
                {instructor.bio}
              </p>

              <h6 className="fw-bold text-dark mt-3 mb-2">Chuyên môn & Công nghệ cốt lõi:</h6>
              <div className="d-flex flex-wrap gap-2">
                {instructor.expertiseTags?.map((tag) => (
                  <Badge
                    key={tag}
                    bg="light"
                    text="dark"
                    className="border px-3 py-2 rounded-pill fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Phương pháp giảng dạy */}
            <Card className="border rounded-4 shadow-xs p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                Phương Pháp Giảng Dạy & Triết Lý Đào Tạo
              </h5>
              <p className="text-secondary mb-0" style={{ lineHeight: 1.7, fontSize: '0.98rem' }}>
                {instructor.teachingMethodology}
              </p>
            </Card>

            {/* Các khóa học do giảng viên phụ trách */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark mb-0">
                  <i className="bi bi-collection-play-fill text-primary me-2"></i>
                  Khóa Học Do {instructor.displayName} Phụ Trách ({instructorCourses.length})
                </h5>
              </div>

              {instructorCourses.length === 0 ? (
                <div className="p-4 bg-white rounded-4 border text-center text-muted">
                  Hiện chưa có khóa học công khai nào.
                </div>
              ) : (
                <Row className="g-3">
                  {instructorCourses.map((c) => (
                    <Col key={c.course_id || c.id} md={6}>
                      <Card className="h-100 border rounded-4 shadow-xs hover-shadow transition-all bg-white overflow-hidden">
                        <img
                          src={c.thumbnail_url}
                          alt={c.title}
                          style={{ height: 160, objectFit: 'cover' }}
                        />
                        <Card.Body className="p-3 d-flex flex-column">
                          <Badge bg="primary-subtle" text="primary" className="mb-2 align-self-start">
                            {c.category?.name || 'Lập trình'}
                          </Badge>
                          <h6 className="fw-bold text-dark mb-2 text-truncate-2" style={{ height: 42 }}>
                            {c.title}
                          </h6>
                          <div className="small text-muted mb-3">
                            <i className="bi bi-clock me-1"></i>
                            Thời lượng: {c.duration || '40 giờ'}
                          </div>
                          <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                            <div className="fw-bold text-primary font-monospace fs-6">
                              {Number(c.price || 0).toLocaleString('vi-VN')} đ
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="fw-bold rounded-pill px-3"
                              onClick={() => {
                                if (onSelectCourse) onSelectCourse(c);
                              }}
                            >
                              Xem khóa học
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>

          {/* Sidebar Column: Quick Contact & Trial */}
          <Col lg={4}>
            {/* Thẻ hỏi đáp trực tiếp */}
            <Card className="border rounded-4 shadow-xs p-4 bg-white mb-4 text-center">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 60, height: 60 }}
              >
                <i className="bi bi-chat-dots-fill fs-3"></i>
              </div>
              <h5 className="fw-bold text-dark mb-1">Gửi Câu Hỏi Cho Giảng Viên</h5>
              <p className="text-secondary small mb-3">
                Bạn có thắc mắc về lộ trình hoặc nội dung bài giảng của {instructor.displayName}? Hãy để lại câu hỏi để được phản hồi!
              </p>
              <Button
                variant="primary"
                className="w-100 fw-bold rounded-pill shadow-xs"
                onClick={() => setShowQuestionModal(true)}
              >
                <i className="bi bi-send me-1"></i> Đặt Câu Hỏi Ngay
              </Button>
            </Card>

            {/* Trải nghiệm học thử miễn phí */}
            <Card className="border-0 rounded-4 shadow-xs p-4 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-laptop fs-4 text-warning"></i>
                <h6 className="fw-bold mb-0 text-white">Trải Nghiệm Học Thử Miễn Phí</h6>
              </div>
              <p className="small text-light text-opacity-90 mb-3">
                Bạn muốn thử viết code trực tiếp trước khi quyết định đăng ký? Trải nghiệm ngay workspace thực hành tương tác!
              </p>
              <Button
                variant="light"
                size="sm"
                className="fw-bold rounded-pill text-primary w-100 shadow-xs"
                onClick={() => onNavigate('try')}
              >
                <i className="bi bi-play-circle me-1"></i> Bắt Đầu Học Thử
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Đặt Câu Hỏi */}
      <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">
            Gửi câu hỏi tới {instructor.displayName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {questionSent ? (
            <div className="text-center py-4 text-success">
              <i className="bi bi-check-circle-fill fs-1"></i>
              <h6 className="fw-bold mt-2">Câu hỏi của bạn đã được gửi thành công!</h6>
              <p className="small text-muted mb-0">Giảng viên sẽ phản hồi qua hệ thống thông báo hoặc email đăng nhập của bạn.</p>
            </div>
          ) : (
            <Form onSubmit={handleSendQuestion}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Khóa học liên quan (Tùy chọn)</Form.Label>
                <Form.Select
                  value={questionCourseId}
                  onChange={(e) => setQuestionCourseId(e.target.value)}
                >
                  <option value="">-- Chọn khóa học bạn đang quan tâm --</option>
                  {instructorCourses.map((c) => (
                    <option key={c.course_id || c.id} value={c.course_id || c.id}>
                      {c.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Nội dung câu hỏi của bạn *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Ví dụ: Em đã có nền tảng JavaScript cơ bản, liệu có đủ để theo kịp khóa React 19 này không ạ?..."
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowQuestionModal(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit" disabled={submittingQuestion || !questionContent.trim()}>
                  {submittingQuestion ? 'Đang gửi...' : 'Gửi Câu Hỏi'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
