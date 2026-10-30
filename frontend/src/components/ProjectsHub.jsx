import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Tab, Nav, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { getProjects, getProject, getMyProjectSubmission, saveProjectSubmission, getProjectShowcase } from '../services/hubApi';

export default function ProjectsHub({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'showcase'
  const [projects, setProjects] = useState([]);
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  // Form states
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projData, showData] = await Promise.all([
        getProjects(),
        getProjectShowcase(),
      ]);
      setProjects(projData || []);
      setShowcases(showData || []);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu dự án:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkspace = async (project) => {
    setSelectedProject(project);
    setAlertInfo(null);
    setModalLoading(true);
    setRepoUrl('');
    setDemoUrl('');
    setNotes('');
    setCompletedMilestones([]);
    setIsPublic(false);

    try {
      if (currentUser) {
        const sub = await getMyProjectSubmission(project.project_id);
        if (sub) {
          setMySubmission(sub);
          setRepoUrl(sub.repo_url || '');
          setDemoUrl(sub.demo_url || '');
          setNotes(sub.notes || '');
          setCompletedMilestones(sub.completed_milestones || []);
          setIsPublic(sub.is_public || false);
        } else {
          setMySubmission(null);
        }
      }
    } catch (err) {
      console.error('Lỗi tải bài nộp:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleMilestone = (m) => {
    if (completedMilestones.includes(m)) {
      setCompletedMilestones(completedMilestones.filter((item) => item !== m));
    } else {
      setCompletedMilestones([...completedMilestones, m]);
    }
  };

  const handleSaveOrSubmit = async (isSubmit) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu không gian làm việc hoặc nộp bài.');
      return;
    }
    setSavingLoading(true);
    setAlertInfo(null);
    try {
      const res = await saveProjectSubmission(selectedProject.project_id, {
        repo_url: repoUrl,
        demo_url: demoUrl,
        notes,
        completed_milestones: completedMilestones,
        is_submit: isSubmit,
        is_public: isPublic,
      });
      setMySubmission(res);
      setAlertInfo({
        variant: 'success',
        message: isSubmit
          ? 'Đã nộp bài dự án thành công! Giảng viên sẽ chấm điểm theo Rubric và gửi phản hồi.'
          : 'Đã lưu bản nháp không gian làm việc dự án thành công.',
      });
    } catch (err) {
      setAlertInfo({ variant: 'danger', message: err.message || 'Lỗi lưu thông tin bài làm' });
    } finally {
      setSavingLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter === 'All') return true;
    return p.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="projects-hub pb-5">
      {/* Banner */}
      <section className="bg-primary text-white py-5 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #1d3557 0%, #0d1b2a 100%)' }}>
        <Container className="app-container">
          <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-kanban-fill me-1"></i> HỌC QUA DỰ ÁN THỰC CHIẾN
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Kho Đề Dự Án & Không Gian Thực Hành</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 850 }}>
            Biến kiến thức lý thuyết thành sản phẩm chạy thực tế. Mỗi dự án đều có tiêu chuẩn Rubric chi tiết, checklist mốc triển khai và cơ hội trưng bày sản phẩm trên bảng Showcase toàn hệ thống.
          </p>
        </Container>
      </section>

      <Container className="app-container">
        {/* Navigation Tabs */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <Nav variant="pills" className="bg-light p-1 rounded-4 border">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                className="fw-bold px-4 py-2 rounded-3"
              >
                <i className="bi bi-grid-fill me-2"></i> Danh Mục Đề Bài ({projects.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'showcase'}
                onClick={() => setActiveTab('showcase')}
                className="fw-bold px-4 py-2 rounded-3"
              >
                <i className="bi bi-stars me-2"></i> Showcase Học Viên ({showcases.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'projects' && (
            <div className="d-flex gap-2">
              {['All', 'Frontend', 'Backend', 'Fullstack'].map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'primary' : 'outline-secondary'}
                  size="sm"
                  className="rounded-pill fw-semibold px-3"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'All' ? 'Tất cả lĩnh vực' : cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải dữ liệu dự án thực tế...</p>
          </div>
        ) : activeTab === 'projects' ? (
          /* TAB 1: DANH SÁCH ĐỀ BÀI */
          <Row className="g-4">
            {filteredProjects.map((project) => (
              <Col key={project.project_id} lg={6}>
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column hover-shadow">
                  <Row className="g-0 h-100">
                    <Col md={5}>
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', minHeight: 220 }}
                      />
                    </Col>
                    <Col md={7} className="d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="secondary" className="px-2 py-1 rounded-pill">
                          {project.category}
                        </Badge>
                        <Badge
                          bg={
                            project.difficulty === 'Beginner'
                              ? 'success'
                              : project.difficulty === 'Intermediate'
                              ? 'warning'
                              : 'danger'
                          }
                          text={project.difficulty === 'Intermediate' ? 'dark' : 'white'}
                          className="px-2 py-1 rounded-pill"
                        >
                          {project.difficulty}
                        </Badge>
                      </div>

                      <h5 className="fw-bold text-dark mb-2 line-clamp-2">{project.title}</h5>
                      <p className="text-muted small mb-3 flex-grow-1 line-clamp-3">
                        {project.brief}
                      </p>

                      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                        <small className="text-muted">
                          <i className="bi bi-check2-all text-primary me-1"></i> {project.milestones?.length || 0} mốc hoàn thiện
                        </small>
                        <Button
                          variant="outline-primary"
                          className="fw-bold rounded-pill px-3"
                          size="sm"
                          onClick={() => handleOpenWorkspace(project)}
                        >
                          Không Gian Làm Bài <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          /* TAB 2: SHOWCASE SẢN PHẨM */
          <Row className="g-4">
            {showcases.length === 0 ? (
              <Col xs={12} className="text-center py-5 bg-light rounded-4 border">
                <i className="bi bi-award text-muted display-4 mb-3 d-block"></i>
                <h5 className="fw-bold text-dark">Chưa có sản phẩm nào được công khai</h5>
                <p className="text-muted small">
                  Hãy hoàn thành dự án thực tế, nộp bài và opt-in công khai để sản phẩm của bạn xuất hiện tại đây!
                </p>
              </Col>
            ) : (
              showcases.map((item, idx) => (
                <Col key={idx} lg={4} md={6}>
                  <Card className="h-100 shadow-sm border-0 rounded-4 p-4 hover-shadow">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="success-subtle" text="success" className="border border-success-subtle px-3 py-1 rounded-pill fw-bold">
                        <i className="bi bi-patch-check-fill me-1"></i> Đã Phê Duyệt ({item.grade_score}/100đ)
                      </Badge>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{item.project_title}</h5>
                    <p className="text-muted small mb-3">Tác giả: <strong>{item.student_name}</strong></p>
                    {item.notes && <p className="text-secondary small italic mb-3">"{item.notes}"</p>}
                    <div className="d-flex gap-2 pt-3 border-top mt-auto">
                      {item.demo_url && (
                        <a href={item.demo_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm flex-grow-1 fw-bold rounded-3">
                          <i className="bi bi-box-arrow-up-right me-1"></i> Live Demo
                        </a>
                      )}
                      {item.repo_url && (
                        <a href={item.repo_url} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm flex-grow-1 fw-bold rounded-3">
                          <i className="bi bi-github me-1"></i> Mã Nguồn
                        </a>
                      )}
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>

      {/* Modal Không Gian Làm Bài Dự Án */}
      <Modal show={!!selectedProject} onHide={() => setSelectedProject(null)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-primary">
            <i className="bi bi-terminal-split me-2"></i> Không Gian Làm Bài & Nộp Dự Án
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {alertInfo && (
            <Alert variant={alertInfo.variant} className="rounded-3 shadow-sm">
              <i className={`bi ${alertInfo.variant === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
              {alertInfo.message}
            </Alert>
          )}

          {selectedProject && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark mb-0">{selectedProject.title}</h4>
                {mySubmission && (
                  <Badge
                    bg={
                      mySubmission.status === 'ACCEPTED'
                        ? 'success'
                        : mySubmission.status === 'SUBMITTED'
                        ? 'primary'
                        : mySubmission.status === 'CHANGES_REQUESTED'
                        ? 'danger'
                        : 'secondary'
                    }
                    className="px-3 py-2 rounded-pill"
                  >
                    Trạng thái: {mySubmission.status}
                  </Badge>
                )}
              </div>

              {mySubmission?.feedback && (
                <Alert variant="info" className="rounded-3 mb-4">
                  <h6 className="fw-bold mb-1">
                    <i className="bi bi-chat-quote-fill me-2"></i> Nhận xét từ Giảng viên ({mySubmission.grade_score} điểm):
                  </h6>
                  <p className="mb-0 small">{mySubmission.feedback}</p>
                </Alert>
              )}

              {/* Mốc triển khai (Checklist) */}
              <div className="bg-light p-3 rounded-4 border mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-list-check me-2 text-primary"></i> Checklist Mốc Triển Khai
                  </h6>
                  <small className="text-muted fw-bold">
                    Hoàn thành: {completedMilestones.length} / {selectedProject.milestones?.length || 0}
                  </small>
                </div>
                <ProgressBar
                  now={
                    selectedProject.milestones?.length
                      ? Math.round((completedMilestones.length / selectedProject.milestones.length) * 100)
                      : 0
                  }
                  className="mb-3"
                  style={{ height: 6 }}
                />
                <div className="d-flex flex-column gap-2">
                  {selectedProject.milestones?.map((m, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      id={`milestone-${idx}`}
                      label={m}
                      checked={completedMilestones.includes(m)}
                      onChange={() => handleToggleMilestone(m)}
                      className="small text-secondary"
                    />
                  ))}
                </div>
              </div>

              {/* Tiêu chí đánh giá Rubric */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-award me-2 text-warning"></i> Barem Đánh Giá (Rubric)
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle small mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tiêu chí đánh giá</th>
                        <th className="text-center" style={{ width: 110 }}>Trọng số</th>
                        <th>Yêu cầu chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.rubric?.map((r, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{r.criterion}</td>
                          <td className="text-center fw-bold text-primary">{r.weight_percent}%</td>
                          <td className="text-muted">{r.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form nộp bài */}
              <Form>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Kho Mã Nguồn (GitHub Repository URL) *</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://github.com/username/project-repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Địa Chỉ Chạy Thử (Live Demo URL)</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://my-project.vercel.app"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Ghi Chú Triển Khai / Lưu Ý Kỹ Thuật</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Mô tả tóm tắt kiến trúc hoặc tài khoản test (nếu có)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  id="optInShowcase"
                  label="Cho phép công khai sản phẩm trên bảng Showcase sau khi được giảng viên phê duyệt (Opt-in Showcase)"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="small text-muted mb-3"
                />
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setSelectedProject(null)}>
            Đóng
          </Button>
          <Button
            variant="outline-primary"
            className="fw-bold"
            disabled={savingLoading}
            onClick={() => handleSaveOrSubmit(false)}
          >
            <i className="bi bi-save me-1"></i> Lưu Bản Nháp
          </Button>
          <Button
            variant="primary"
            className="fw-bold px-4 shadow-sm"
            disabled={savingLoading || !repoUrl.trim()}
            onClick={() => handleSaveOrSubmit(true)}
          >
            {savingLoading ? 'Đang gửi bài...' : 'Nộp Bài Dự Án'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
