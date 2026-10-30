import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Modal, Table, Alert } from 'react-bootstrap';
import { getCourseFinderConfig, getCourseRecommendations, compareCourses } from '../services/hubApi';

export default function CourseFinderPage({ currentUser, onNavigate, onCourseSelect, onAddToCart }) {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Form state
  const [goal, setGoal] = useState('FRONTEND');
  const [knownSkills, setKnownSkills] = useState(['HTML_CSS']);
  const [budgetMaxVnd, setBudgetMaxVnd] = useState(900000);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);

  // Results state
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Compare state
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoadingConfig(true);
    try {
      const data = await getCourseFinderConfig();
      setConfig(data);
      // Chạy gợi ý mặc định lần đầu
      handleFindCourses({
        goal: 'FRONTEND',
        knownSkills: ['HTML_CSS'],
        budgetMaxVnd: 900000,
        hoursPerWeek: 8,
      });
    } catch (err) {
      console.error('Lỗi tải cấu hình chọn khóa:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleFindCourses = async (customPayload) => {
    setLoadingResults(true);
    setHasSearched(true);
    try {
      const payload = customPayload || {
        goal,
        knownSkills,
        budgetMaxVnd: Number(budgetMaxVnd),
        hoursPerWeek: Number(hoursPerWeek),
      };
      const res = await getCourseRecommendations(payload);
      setResults(res);
    } catch (err) {
      console.error('Lỗi gợi ý khóa học:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const toggleSkill = (skillValue) => {
    setKnownSkills((prev) =>
      prev.includes(skillValue) ? prev.filter((s) => s !== skillValue) : [...prev, skillValue]
    );
  };

  const toggleCompare = (courseId) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      if (prev.length >= 3) {
        alert('Chỉ được so sánh tối đa 3 khóa học cùng lúc.');
        return prev;
      }
      return [...prev, courseId];
    });
  };

  const handleOpenCompareModal = async () => {
    if (selectedCompareIds.length === 0) return;
    setLoadingCompare(true);
    setShowCompareModal(true);
    try {
      const data = await compareCourses(selectedCompareIds);
      setCompareData(data || []);
    } catch (err) {
      alert(err.message || 'Lỗi tải dữ liệu so sánh');
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className="course-finder-page pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-compass me-1"></i> BỘ CHỌN KHÓA PHÙ HỢP (CODECADEMY STYLE)
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Tìm Khóa Học Phù Hợp Với Mục Tiêu Của Bạn</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 840 }}>
            Không còn băn khoăn nên bắt đầu từ đâu! Chỉ với 4 câu hỏi ngắn, thuật toán minh bạch của EduViet sẽ phân tích mục tiêu, nền tảng hiện có và ngân sách để đề xuất khóa học chuẩn xác nhất kèm lý do chi tiết.
          </p>
        </Container>
      </section>

      <Container className="app-container">
        <Row className="g-4">
          {/* CỘT TRÁI: BỘ CÂU HỎI KHẢO SÁT */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-primary"></i>
                  Khảo Sát Nhu Cầu
                </h5>
                <Badge bg="light" text="dark" className="border">
                  Phiên bản: {config?.ruleVersion || 'finder-1'}
                </Badge>
              </div>

              {loadingConfig ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <p className="mt-2 text-muted small">Đang tải câu hỏi...</p>
                </div>
              ) : (
                <Form onSubmit={(e) => { e.preventDefault(); handleFindCourses(); }}>
                  {/* Câu 1: Mục tiêu */}
                  <div className="mb-3">
                    <label className="fw-bold small text-muted text-uppercase d-block mb-2">
                      1. Bạn muốn học để làm gì? *
                    </label>
                    <div className="d-flex flex-column gap-2">
                      {[
                        { value: 'FRONTEND', label: 'Làm giao diện Web (React 19 / Next.js)', icon: 'bi-window-sidebar' },
                        { value: 'BACKEND', label: 'Xây dựng API & Database (NestJS / MySQL)', icon: 'bi-hdd-network' },
                        { value: 'AI', label: 'Phân tích dữ liệu & AI (Python / Prompting)', icon: 'bi-cpu' },
                        { value: 'FOUNDATION', label: 'Làm quen lập trình từ số 0 (Mobile / Cơ sở)', icon: 'bi-stars' },
                      ].map((item) => (
                        <div
                          key={item.value}
                          className={`p-2 px-3 rounded-3 border cursor-pointer transition d-flex align-items-center gap-2 ${goal === item.value ? 'border-primary bg-primary-subtle text-primary fw-bold shadow-sm' : 'bg-white text-dark'}`}
                          onClick={() => setGoal(item.value)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className={`bi ${item.icon} fs-5`}></i>
                          <span className="small">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Câu 2: Nền tảng hiện có */}
                  <div className="mb-3">
                    <label className="fw-bold small text-muted text-uppercase d-block mb-2">
                      2. Bạn đã có nền tảng gì? (Chọn các mục phù hợp)
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        { value: 'ZERO', label: 'Chưa biết gì (Số 0)' },
                        { value: 'HTML_CSS', label: 'HTML5 / CSS3' },
                        { value: 'JAVASCRIPT', label: 'JavaScript ES6' },
                        { value: 'PYTHON', label: 'Python cơ bản' },
                        { value: 'SQL', label: 'Cú pháp SQL' },
                      ].map((s) => {
                        const checked = knownSkills.includes(s.value);
                        return (
                          <Button
                            key={s.value}
                            variant={checked ? 'primary' : 'outline-secondary'}
                            size="sm"
                            className={`rounded-pill px-3 py-1 ${checked ? 'shadow-sm' : 'border-0 bg-light text-dark'}`}
                            onClick={() => toggleSkill(s.value)}
                          >
                            {checked && <i className="bi bi-check-lg me-1"></i>}
                            {s.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Câu 3: Ngân sách */}
                  <div className="mb-3">
                    <label className="fw-bold small text-muted text-uppercase d-block mb-2">
                      3. Khoảng ngân sách dự kiến:
                    </label>
                    <Form.Select
                      size="sm"
                      className="rounded-3"
                      value={budgetMaxVnd}
                      onChange={(e) => setBudgetMaxVnd(Number(e.target.value))}
                    >
                      <option value="500000">Dưới 500.000 đ (Tiết kiệm)</option>
                      <option value="900000">Dưới 900.000 đ (Phổ biến)</option>
                      <option value="1500000">Dưới 1.500.000 đ (Chuyên sâu)</option>
                      <option value="0">Chưa xác định (Xem tất cả các mức giá)</option>
                    </Form.Select>
                  </div>

                  {/* Câu 4: Thời gian mỗi tuần */}
                  <div className="mb-4">
                    <label className="fw-bold small text-muted text-uppercase d-block mb-2">
                      4. Thời gian học mỗi tuần:
                    </label>
                    <div className="d-flex gap-2">
                      {[
                        { value: 4, label: '3 - 5 giờ' },
                        { value: 8, label: '6 - 10 giờ' },
                        { value: 15, label: '> 10 giờ' },
                      ].map((h) => (
                        <Button
                          key={h.value}
                          variant={hoursPerWeek === h.value ? 'primary' : 'outline-secondary'}
                          size="sm"
                          className="flex-grow-1 rounded-pill"
                          onClick={() => setHoursPerWeek(h.value)}
                        >
                          {h.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 fw-bold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={loadingResults}
                  >
                    {loadingResults ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Đang phân tích tiêu chí...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic text-warning"></i>
                        Xem Gợi Ý Khóa Học Phù Hợp
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Card>
          </Col>

          {/* CỘT PHẢI: KẾT QUẢ GỢI Ý & SO SÁNH */}
          <Col lg={7}>
            {loadingResults ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                <Spinner animation="border" variant="primary" />
                <h5 className="fw-bold mt-3">Đang đối chiếu catalog khóa học thực tế...</h5>
                <p className="text-muted small">Phân tích mục tiêu, độ khó và ngân sách của bạn.</p>
              </div>
            ) : !results || results.items?.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                <h5 className="fw-bold">Chưa tìm thấy khóa học khớp 100% tiêu chí</h5>
                <p className="text-muted small mb-3">
                  {results?.notice || 'Hãy thử nới lỏng ngân sách hoặc chọn thêm nền tảng kỹ năng để nhận được nhiều đề xuất hơn.'}
                </p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setBudgetMaxVnd(0);
                    handleFindCourses({ goal, knownSkills, budgetMaxVnd: 0, hoursPerWeek });
                  }}
                >
                  Bỏ giới hạn ngân sách & Xem lại
                </Button>
              </div>
            ) : (
              <div>
                {/* Thông báo phân tích */}
                <Alert variant="info" className="d-flex align-items-center gap-2 py-2 px-3 rounded-4 shadow-sm mb-4">
                  <i className="bi bi-info-circle-fill fs-5 text-primary"></i>
                  <div className="small">
                    <strong>Kết quả gợi ý:</strong> {results.notice}
                  </div>
                </Alert>

                <div className="d-flex flex-column gap-4">
                  {results.items.map((item, idx) => {
                    const c = item.course;
                    const isComparing = selectedCompareIds.includes(c.course_id);

                    return (
                      <Card
                        key={c.course_id}
                        className="border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition"
                      >
                        <Row className="g-0">
                          <Col md={4} className="position-relative">
                            <img
                              src={c.thumbnail_url}
                              alt={c.title}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover', minHeight: '180px' }}
                            />
                            <Badge
                              bg="warning"
                              text="dark"
                              className="position-absolute top-0 start-0 m-2 px-2 py-1 fw-bold rounded-pill"
                            >
                              Top {idx + 1} Phù hợp
                            </Badge>
                          </Col>

                          <Col md={8}>
                            <Card.Body className="p-3 d-flex flex-column h-100">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle">
                                  {c.category_name} · {c.level}
                                </Badge>
                                <span className="fw-bold text-danger fs-6">
                                  {Number(c.price).toLocaleString('vi-VN')} đ
                                </span>
                              </div>

                              <h6 className="fw-bold text-dark mb-2" style={{ lineHeight: 1.3 }}>
                                {c.title}
                              </h6>

                              {/* Lý do phù hợp */}
                              <div className="p-2 bg-light rounded-3 mb-2 small">
                                <strong className="text-success d-block mb-1">
                                  <i className="bi bi-check-circle-fill me-1"></i> Lý do phù hợp với bạn:
                                </strong>
                                <ul className="mb-0 ps-3 text-secondary" style={{ fontSize: '0.82rem' }}>
                                  {item.reasons.map((r, rIdx) => (
                                    <li key={rIdx}>{r}</li>
                                  ))}
                                </ul>

                                {item.missingPrerequisites?.length > 0 && (
                                  <div className="mt-1 pt-1 border-top text-warning-emphasis">
                                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                    <strong>Lưu ý kiến thức:</strong> {item.missingPrerequisites.join(', ')}
                                  </div>
                                )}
                              </div>

                              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-auto pt-2 border-top">
                                <div className="d-flex gap-2">
                                  {item.canTry && (
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="fw-bold rounded-pill px-3"
                                      onClick={() => onNavigate('try')}
                                      title="Làm bài học thử 5-10 phút trước khi mua"
                                    >
                                      <i className="bi bi-laptop me-1"></i> Học thử ngay
                                    </Button>
                                  )}

                                  <Button
                                    variant={isComparing ? 'warning' : 'outline-secondary'}
                                    size="sm"
                                    className="rounded-pill px-3 fw-semibold"
                                    onClick={() => toggleCompare(c.course_id)}
                                  >
                                    <i className={`bi ${isComparing ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-1`}></i>
                                    {isComparing ? 'Đã thêm so sánh' : 'So sánh'}
                                  </Button>
                                </div>

                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="fw-bold rounded-pill px-3"
                                  onClick={() => onCourseSelect ? onCourseSelect(c) : onNavigate('courses')}
                                >
                                  Xem chi tiết khóa
                                </Button>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* 2. THANH SO SÁNH NỔI (FLOAT BAR) KHI ĐÃ CHỌN KHÓA */}
      {selectedCompareIds.length > 0 && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg p-3 rounded-pill bg-white border d-flex align-items-center gap-3"
          style={{ zIndex: 1045, maxWidth: '92%', minWidth: '320px' }}
        >
          <div className="d-flex align-items-center gap-2">
            <Badge bg="primary" className="rounded-pill px-3 py-2">
              {selectedCompareIds.length}/3 khóa đã chọn
            </Badge>
            <span className="small text-dark fw-semibold d-none d-sm-inline">
              So sánh điều kiện, giá và học thử
            </span>
          </div>

          <div className="d-flex gap-2 ms-auto">
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-2"
              onClick={() => setSelectedCompareIds([])}
            >
              Hủy
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="fw-bold rounded-pill px-4 shadow-sm"
              onClick={handleOpenCompareModal}
            >
              <i className="bi bi-arrow-left-right me-1"></i> Bảng So Sánh Ngay
            </Button>
          </div>
        </div>
      )}

      {/* 3. MODAL SO SÁNH TỐI ĐA 3 KHÓA HỌC (CA-US03) */}
      <Modal
        show={showCompareModal}
        onHide={() => setShowCompareModal(false)}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)', color: '#fff' }}>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-arrow-left-right text-warning"></i>
            Bảng So Sánh Chi Tiết Khóa Học EduViet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loadingCompare ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải dữ liệu so sánh...</p>
            </div>
          ) : compareData.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Không có dữ liệu so sánh.
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="align-middle bg-white mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '20%' }} className="small text-muted text-uppercase">Tiêu chí so sánh</th>
                    {compareData.map((c) => (
                      <th key={c.course_id} style={{ width: `${80 / compareData.length}%` }} className="text-center">
                        <img
                          src={c.thumbnail_url}
                          alt={c.title}
                          className="rounded-3 mb-2 shadow-sm"
                          style={{ width: '100%', maxHeight: '110px', objectFit: 'cover' }}
                        />
                        <strong className="d-block text-dark small" style={{ minHeight: '38px' }}>{c.title}</strong>
                        <span className="text-danger fw-bold fs-6">{Number(c.price).toLocaleString('vi-VN')} đ</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="small">
                  <tr>
                    <td className="fw-bold bg-light">Trình độ & Danh mục</td>
                    {compareData.map((c) => (
                      <td key={c.course_id} className="text-center">
                        <Badge bg="secondary" className="me-1">{c.level}</Badge>
                        <Badge bg="primary">{c.category_name}</Badge>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Thời lượng giáo trình</td>
                    {compareData.map((c) => (
                      <td key={c.course_id} className="text-center fw-semibold text-primary">
                        <i className="bi bi-clock me-1"></i> {c.duration}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Yêu cầu đầu vào (Prerequisites)</td>
                    {compareData.map((c) => (
                      <td key={c.course_id}>
                        <ul className="mb-0 ps-3 text-secondary">
                          {c.prerequisites?.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Kỹ năng đạt được sau khóa</td>
                    {compareData.map((c) => (
                      <td key={c.course_id}>
                        <ul className="mb-0 ps-3 text-success">
                          {c.outcomes?.map((o, idx) => (
                            <li key={idx}>{o}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Hình thức thực hành</td>
                    {compareData.map((c) => (
                      <td key={c.course_id} className="text-center">
                        <Badge bg="info-subtle" className="text-dark border">
                          {c.practice_format}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Giảng viên phụ trách</td>
                    {compareData.map((c) => (
                      <td key={c.course_id} className="text-center fw-semibold">
                        <i className="bi bi-person-badge text-muted me-1"></i>
                        {c.instructor_name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold bg-light">Trải nghiệm học thử</td>
                    {compareData.map((c) => (
                      <td key={c.course_id} className="text-center">
                        {c.has_trial ? (
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-pill px-3 fw-bold"
                            onClick={() => {
                              setShowCompareModal(false);
                              onNavigate('try');
                            }}
                          >
                            <i className="bi bi-laptop me-1"></i> Học thử bài này
                          </Button>
                        ) : (
                          <span className="text-muted">Xem bài mẫu trong khóa</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowCompareModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
