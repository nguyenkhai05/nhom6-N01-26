import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Accordion, Modal, Nav, ProgressBar } from 'react-bootstrap';
import { getTrials, getTrial, getTrialSolution } from '../services/hubApi';
import { runCodeInSandbox, checkTestCasesInSandbox } from '../utils/codeRunner';

export default function InteractiveTrialPage({ currentUser, onNavigate, onCourseSelect }) {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrialId, setSelectedTrialId] = useState(1);
  const [activeTrial, setActiveTrial] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Điều hướng 3 chế độ cột trái: Lý thuyết/Video -> Thực hành từng bước -> Lộ trình & Ưu đãi
  const [leftTab, setLeftTab] = useState('lecture'); // 'lecture' | 'instructions' | 'curriculum'

  // Điều hướng 2 chế độ hiển thị kết quả cột phải: Giao diện trực quan (UI Live) -> Console dòng lệnh
  const [outputTab, setOutputTab] = useState('preview'); // 'preview' | 'console'

  // Workspace editor state
  const [userCode, setUserCode] = useState('');
  const [outputLogs, setOutputLogs] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Lời giải tham khảo của giảng viên
  const [teacherSolution, setTeacherSolution] = useState(null);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const activeRunnerRef = useRef(null);

  useEffect(() => {
    loadTrials();
  }, []);

  const loadTrials = async () => {
    setLoading(true);
    try {
      const data = await getTrials();
      setTrials(data || []);
      if (data && data.length > 0) {
        loadTrialDetail(data[0].trial_id);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách bài học thử:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrialDetail = async (id) => {
    setSelectedTrialId(id);
    setLoadingDetail(true);
    setOutputLogs([]);
    setTestResults(null);
    setShowSolution(false);
    setTeacherSolution(null);
    try {
      const data = await getTrial(id);
      setActiveTrial(data);
      setUserCode(data.initial_code || '');
    } catch (err) {
      alert(err.message || 'Không thể mở bài học thử');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleResetCode = () => {
    if (activeTrial && window.confirm('Bạn có chắc muốn khôi phục mã nguồn về trạng thái mẫu ban đầu?')) {
      setUserCode(activeTrial.initial_code || '');
      setOutputLogs([]);
      setTestResults(null);
    }
  };

  // Tải lời giải tham khảo từ giảng viên
  const handleLoadSolution = async () => {
    if (showSolution) {
      setShowSolution(false);
      return;
    }
    if (teacherSolution) {
      setShowSolution(true);
      return;
    }
    setLoadingSolution(true);
    try {
      const res = await getTrialSolution(activeTrial.trial_id);
      setTeacherSolution(res.solution_code);
      setShowSolution(true);
    } catch (err) {
      alert(err.message || 'Không thể tải lời giải');
    } finally {
      setLoadingSolution(false);
    }
  };

  // Dừng thực thi nếu sinh viên bấm "Dừng" hoặc code bị lặp
  const handleStopExecution = () => {
    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
      activeRunnerRef.current = null;
    }
    setIsRunning(false);
    setOutputLogs((prev) => [...prev, '⏹️ Đã dừng thực thi theo yêu cầu người dùng.']);
  };

  // Chạy mã nguồn an toàn bằng Web Worker Sandbox
  const handleRunCode = async () => {
    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
    }
    setIsRunning(true);
    setOutputLogs(['[Đang thực thi mã nguồn trong Web Worker Sandbox...]']);
    setTestResults(null);

    const runner = runCodeInSandbox({ code: userCode, timeoutMs: 3000 });
    activeRunnerRef.current = runner;

    try {
      const res = await runner.promise;
      setIsRunning(false);
      activeRunnerRef.current = null;

      if (res.success) {
        setOutputLogs(res.logs || ['(Thực thi hoàn tất không có lỗi)']);
      } else {
        setOutputLogs([...(res.logs || []), `Lỗi thực thi: ${res.error}`]);
      }
    } catch (err) {
      setIsRunning(false);
      activeRunnerRef.current = null;
      setOutputLogs([`Lỗi sandbox: ${err.message}`]);
    }
  };

  // Kiểm tra đáp án thực tế qua Web Worker Sandbox
  const handleCheckSolution = async () => {
    if (!activeTrial?.test_cases?.length) {
      setOutputLogs(['Bài học này không có test cases tự động. Bạn hãy xem mục Gợi ý để kiểm tra.']);
      return;
    }

    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
    }

    setIsRunning(true);
    setOutputLogs(['[Đang nạp mã nguồn vào Sandbox và kiểm tra từng Test Case...]']);
    setTestResults(null);

    const runner = checkTestCasesInSandbox({
      code: userCode,
      testCases: activeTrial.test_cases,
      trialId: activeTrial.trial_id,
      timeoutMs: 3500,
    });
    activeRunnerRef.current = runner;

    try {
      const data = await runner.promise;
      setIsRunning(false);
      activeRunnerRef.current = null;

      if (data.results) {
        setTestResults({
          passedCount: data.passedCount || 0,
          total: data.total || activeTrial.test_cases.length,
          results: data.results,
        });

        if (data.passedCount === (data.total || activeTrial.test_cases.length)) {
          setOutputLogs([
            '🎉 CHÚC MỪNG BẠN ĐÃ VƯỢT QUA BÀI HỌC THỬ!',
            'Toàn bộ Test Cases đã đạt chuẩn đầu ra. Mã nguồn của bạn xử lý chính xác 100% các tình huống thực tế!',
          ]);
          setTimeout(() => setShowCompletionModal(true), 900);
        } else {
          setOutputLogs([
            '⚠️ Một số Test Cases chưa vượt qua kết quả thực tế.',
            data.error || 'Hãy xem mục Chi tiết Test Cases bên dưới để đối chiếu Actual vs Expected.',
          ]);
          setOutputTab('console');
        }
      } else {
        setOutputLogs([data.error || 'Kiểm tra thất bại.']);
      }
    } catch (err) {
      setIsRunning(false);
      activeRunnerRef.current = null;
      setOutputLogs([`Lỗi sandbox: ${err.message}`]);
    }
  };

  // Tính toán dữ liệu hiển thị Live UI Preview trực quan theo từng bài học
  const renderLiveUIPreview = () => {
    if (!activeTrial) return null;

    // Bài 1: React 19 Component
    if (activeTrial.trial_id === 1) {
      const hasWelcomeInCode = userCode.includes('Xin chào');
      return (
        <div className="p-4 bg-white rounded-4 border shadow-sm text-center page-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <span className="small text-muted fw-bold">
              <i className="bi bi-display me-1 text-primary"></i> Live Component Preview (React 19)
            </span>
            <Badge bg="success-subtle" className="text-success border border-success-subtle">
              Virtual DOM Active
            </Badge>
          </div>

          <div className="my-3 p-3 bg-light rounded-4 border mx-auto" style={{ maxWidth: 420 }}>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
              alt="Học viên"
              className="rounded-circle shadow-sm mb-2"
              style={{ width: 68, height: 68, objectFit: 'cover' }}
            />
            <h5 className="fw-bold text-dark mb-1">Nguyễn Văn Dev</h5>
            <Badge bg="primary" className="px-3 py-1 rounded-pill mb-3">
              Frontend Developer
            </Badge>

            <div className={`p-3 rounded-3 text-start small ${hasWelcomeInCode ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'}`}>
              <div className="fw-bold mb-1">
                <i className={`bi ${hasWelcomeInCode ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-warning'} me-1`}></i>
                Thông điệp Render từ Component:
              </div>
              <div className="font-monospace fs-6">
                {hasWelcomeInCode
                  ? 'Xin chào Nguyễn Văn Dev - Vai trò: Frontend Developer'
                  : 'Component đang chờ bạn hoàn thiện hàm WelcomeCard...'}
              </div>
            </div>
          </div>
          <small className="text-muted d-block mt-2">
            Thay đổi code trong Workspace và xem giao diện cập nhật ngay lập tức!
          </small>
        </div>
      );
    }

    // Bài 2: NestJS REST API Controller
    if (activeTrial.trial_id === 2) {
      const isImplemented = userCode.includes('success') && userCode.includes('find');
      return (
        <div className="p-3 bg-dark text-light rounded-4 font-monospace small page-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-50">
            <div className="d-flex align-items-center gap-2">
              <Badge bg="success">GET</Badge>
              <span className="text-info">https://api.eduviet.vn/courses/1</span>
            </div>
            <span className="badge bg-success-subtle text-success border border-success-subtle">
              HTTP 200 OK • 38ms
            </span>
          </div>

          <div className="bg-black p-3 rounded-3 text-warning">
            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {isImplemented
                ? JSON.stringify(
                    {
                      status: 'success',
                      data: {
                        id: 1,
                        title: 'React 19 Chuyên Sâu',
                        price: 890000,
                        instructor: 'Vũ Quốc Huy (Lead Frontend)',
                      },
                    },
                    null,
                    2
                  )
                : JSON.stringify(
                    {
                      status: 'not_found',
                      message: 'Course not found (Hãy hoàn thiện logic Controller)',
                    },
                    null,
                    2
                  )}
            </pre>
          </div>
          <div className="mt-2 text-secondary small d-flex justify-content-between align-items-center">
            <span>Mô phỏng Swagger & Postman REST Client</span>
            <span className="text-success"><i className="bi bi-shield-check me-1"></i> NestJS Route Active</span>
          </div>
        </div>
      );
    }

    // Bài 3: Python / Data & AI
    if (activeTrial.trial_id === 3) {
      return (
        <div className="p-4 bg-white rounded-4 border shadow-sm page-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <span className="small text-muted fw-bold">
              <i className="bi bi-bar-chart-fill me-1 text-primary"></i> Data Pipeline Dashboard
            </span>
            <Badge bg="primary-subtle" className="text-primary border border-primary-subtle">
              Cleaned Data Stream
            </Badge>
          </div>

          <Row className="g-3 my-2 text-center">
            <Col xs={6}>
              <div className="p-3 bg-light rounded-3 border">
                <small className="text-muted d-block">Điểm Trung Bình (Hợp lệ)</small>
                <div className="display-6 fw-bold text-success my-1">9.0</div>
                <small className="text-success fw-semibold">Đạt chuẩn xuất sắc</small>
              </div>
            </Col>
            <Col xs={6}>
              <div className="p-3 bg-light rounded-3 border">
                <small className="text-muted d-block">Dữ liệu dị biệt (Outliers)</small>
                <div className="display-6 fw-bold text-danger my-1">2</div>
                <small className="text-muted">Đã loại [-5, 12]</small>
              </div>
            </Col>
          </Row>

          <div className="mt-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Độ hoàn thành tiền xử lý:</span>
              <span className="fw-bold text-primary">100%</span>
            </div>
            <ProgressBar now={90} variant="primary" className="rounded-pill" style={{ height: 8 }} />
          </div>
        </div>
      );
    }

    // Bài 4: DevOps CI/CD
    if (activeTrial.trial_id === 4) {
      const isSuccess = userCode.includes('valid: true') || userCode.includes('hasBuild');
      return (
        <div className="p-4 bg-white rounded-4 border shadow-sm page-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <span className="small text-muted fw-bold">
              <i className="bi bi-diagram-3-fill me-1 text-primary"></i> Multi-Stage CI/CD Pipeline
            </span>
            <Badge bg={isSuccess ? 'success' : 'danger'}>
              {isSuccess ? 'PIPELINE PASSED' : 'PIPELINE IN PROGRESS'}
            </Badge>
          </div>

          <div className="d-flex justify-content-around align-items-center flex-wrap gap-2 text-center my-3">
            <div className="p-3 rounded-4 border bg-success-subtle text-success-emphasis" style={{ minWidth: 120 }}>
              <i className="bi bi-box-seam fs-2 text-success"></i>
              <div className="fw-bold small mt-1">1. BUILD</div>
              <Badge bg="success" className="small">Success (14s)</Badge>
            </div>
            <i className="bi bi-arrow-right fs-3 text-muted"></i>
            <div className="p-3 rounded-4 border bg-success-subtle text-success-emphasis" style={{ minWidth: 120 }}>
              <i className="bi bi-check2-circle fs-2 text-success"></i>
              <div className="fw-bold small mt-1">2. TEST</div>
              <Badge bg="success" className="small">117 Passed</Badge>
            </div>
            <i className="bi bi-arrow-right fs-3 text-muted"></i>
            <div className={`p-3 rounded-4 border ${isSuccess ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis'}`} style={{ minWidth: 120 }}>
              <i className={`bi ${isSuccess ? 'bi-cloud-check-fill text-success' : 'bi-cloud-arrow-up text-warning'} fs-2`}></i>
              <div className="fw-bold small mt-1">3. DEPLOY</div>
              <Badge bg={isSuccess ? 'success' : 'warning'}>{isSuccess ? 'Production OK' : 'Pending'}</Badge>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="interactive-trial-page pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-4 mb-3 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
                <i className="bi bi-mortarboard-fill me-1"></i> KHÔNG GIAN HỌC THỬ TƯƠNG TÁC THỰC CHIẾN
              </Badge>
              <h1 className="fw-bold fs-3 mb-1">Học Thử Trước Khi Đăng Ký — Học Thật Bằng Code Thật</h1>
              <p className="text-light small mb-0 opacity-85">
                Xem video bài giảng mẫu, nắm vững tư duy cốt lõi, thực hành code trên Sandbox và quan sát kết quả trực quan ngay lập tức!
              </p>
            </div>

            <Button
              variant="outline-light"
              size="sm"
              className="rounded-pill px-3 fw-semibold"
              onClick={() => onNavigate('courses')}
            >
              <i className="bi bi-arrow-left me-1"></i> Danh mục khóa học đầy đủ
            </Button>
          </div>

          {/* Dải chọn bài học thử */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
            {trials.map((t) => (
              <Button
                key={t.trial_id}
                variant={selectedTrialId === t.trial_id ? 'warning' : 'outline-light'}
                size="sm"
                className={`rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 ${selectedTrialId === t.trial_id ? 'text-dark shadow-sm' : 'border-0 bg-dark bg-opacity-25 text-white'}`}
                onClick={() => loadTrialDetail(t.trial_id)}
              >
                <i className="bi bi-laptop"></i>
                <span>Bài {t.trial_id}: {t.title.split(':')[0]}</span>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. KHÔNG GIAN TƯƠNG TÁC 3 VÙNG CHUẨN ĐÀO TẠO */}
      <Container className="app-container">
        {loadingDetail || !activeTrial ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang nạp dữ liệu bài giảng và không gian Sandbox tương tác...</p>
          </div>
        ) : (
          <Row className="g-3">
            {/* ========================================================
                VÙNG 1: TƯ DUY, BÀI GIẢNG & HƯỚNG DẪN (CỘT TRÁI)
               ======================================================== */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column bg-white">
                {/* Thanh điều hướng 3 Tab Cột Trái */}
                <Card.Header className="bg-light border-bottom p-2">
                  <Nav variant="pills" className="nav-fill gap-1">
                    <Nav.Item>
                      <Nav.Link
                        active={leftTab === 'lecture'}
                        onClick={() => setLeftTab('lecture')}
                        className="py-1 px-2 small fw-bold rounded-pill text-truncate"
                      >
                        <i className="bi bi-play-circle-fill me-1 text-danger"></i> 1. Bài Giảng & Lý Thuyết
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        active={leftTab === 'instructions'}
                        onClick={() => setLeftTab('instructions')}
                        className="py-1 px-2 small fw-bold rounded-pill text-truncate"
                      >
                        <i className="bi bi-card-text me-1 text-primary"></i> 2. Nhiệm Vụ & Gợi Ý
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        active={leftTab === 'curriculum'}
                        onClick={() => setLeftTab('curriculum')}
                        className="py-1 px-2 small fw-bold rounded-pill text-truncate"
                      >
                        <i className="bi bi-gift-fill me-1 text-warning"></i> 3. Ưu Đãi Khóa
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body className="p-3 overflow-auto" style={{ maxHeight: '720px' }}>
                  {/* TAB 1: BÀI GIẢNG VIDEO & KHÁI NIỆM TRỌNG TÂM */}
                  {leftTab === 'lecture' && (
                    <div className="page-fade-in">
                      <div className="mb-3">
                        <span className="badge bg-primary rounded-pill mb-1">{activeTrial.language.toUpperCase()}</span>
                        <h5 className="fw-bold text-dark mb-1">{activeTrial.title}</h5>
                        <p className="text-muted small mb-3">{activeTrial.summary}</p>
                      </div>

                      {/* Video bài giảng mẫu (Mini-Lecture) */}
                      <div className="mb-4 rounded-4 overflow-hidden shadow-sm border bg-black position-relative" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${activeTrial.video_id || 'bMknfKXIFA8'}?start=${activeTrial.video_start || 0}&autoplay=0&rel=0&modestbranding=1`}
                          title="Mini Lecture"
                          className="position-absolute top-0 start-0 w-100 h-100 border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      {/* Tóm tắt tư duy và khái niệm */}
                      <div className="p-3 bg-light rounded-4 border mb-3">
                        <div
                          className="text-dark small"
                          style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
                        >
                          {activeTrial.concept_summary}
                        </div>
                      </div>

                      <div className="text-center mt-3">
                        <Button
                          variant="outline-primary"
                          className="rounded-pill px-4 fw-bold w-100"
                          onClick={() => setLeftTab('instructions')}
                        >
                          Tiếp Tục: Sang Bước Thực Hành <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: NHIỆM VỤ THỰC HÀNH & GỢI Ý TỪNG BƯỚC */}
                  {leftTab === 'instructions' && (
                    <div className="page-fade-in">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong className="text-dark">Nhiệm Vụ Thực Hành Của Bạn</strong>
                        <Badge bg="info-subtle" className="text-info border border-info-subtle">
                          Thời gian: ~{activeTrial.duration_minutes} phút
                        </Badge>
                      </div>

                      <div
                        className="trial-instructions text-dark mb-3 p-3 bg-light rounded-4 border small"
                        style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
                      >
                        {activeTrial.instructions}
                      </div>

                      {/* Gợi ý từng bước (Hints Accordion) */}
                      {activeTrial.hints?.length > 0 && (
                        <Accordion className="mb-3">
                          <Accordion.Item eventKey="0" className="border rounded-3 overflow-hidden">
                            <Accordion.Header>
                              <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                              <span className="small fw-bold">Gợi ý từng bước của Giảng viên</span>
                            </Accordion.Header>
                            <Accordion.Body className="p-3 bg-warning-subtle text-dark small">
                              <ul className="mb-0 ps-3">
                                {activeTrial.hints.map((h, hIdx) => (
                                  <li key={hIdx} className="mb-1">{h}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      )}

                      {/* Nút Xem Lời Giải Tham Khảo */}
                      <div className="p-3 border rounded-3 bg-light mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Bị tắc ý tưởng? Xem code chuẩn:</span>
                          <Button
                            variant={showSolution ? 'outline-danger' : 'outline-secondary'}
                            size="sm"
                            className="rounded-pill px-3 fw-bold"
                            onClick={handleLoadSolution}
                            disabled={loadingSolution}
                          >
                            {loadingSolution ? (
                              <Spinner animation="border" size="sm" />
                            ) : showSolution ? (
                              'Ẩn lời giải'
                            ) : (
                              'Xem lời giải tham khảo'
                            )}
                          </Button>
                        </div>

                        {showSolution && teacherSolution && (
                          <div className="mt-2 pt-2 border-top">
                            <small className="text-success fw-bold d-block mb-1">
                              <i className="bi bi-check-circle-fill me-1"></i> Lời giải chuẩn từ Ban Chuyên Môn:
                            </small>
                            <pre className="bg-dark text-warning p-2 rounded small font-monospace mb-0">
                              {teacherSolution}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LỘ TRÌNH KHÓA HỌC GỐC & MÃ ƯU ĐÃI ĐỘC QUYỀN */}
                  {leftTab === 'curriculum' && (
                    <div className="page-fade-in">
                      <div className="p-3 bg-light rounded-4 border mb-3">
                        <Badge bg="primary" className="mb-2">Khóa Học Đầy Đủ</Badge>
                        <h5 className="fw-bold text-dark mb-2">{activeTrial.course_title}</h5>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fs-5 fw-bold text-danger">
                            {Number(activeTrial.course_price).toLocaleString('vi-VN')} đ
                          </span>
                          <Badge bg="warning" text="dark">Cam kết đầu ra</Badge>
                        </div>
                        <p className="text-muted small mb-3">
                          Khi đăng ký khóa học chính thức, bạn sẽ được học toàn bộ video chất lượng cao 4K, 12 đồ án lớn, hỗ trợ sửa bài 1-1 qua Discord cùng Mentor và cấp chứng chỉ hoàn thành.
                        </p>
                        <Button
                          variant="primary"
                          className="w-100 rounded-pill fw-bold py-2 shadow-sm"
                          onClick={() => onNavigate('courses')}
                        >
                          Xem Thông Tin Khóa Học <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>

                      {/* Mã voucher ưu đãi học thử */}
                      <div className="p-3 bg-warning-subtle border border-warning-subtle rounded-4 text-dark text-center">
                        <i className="bi bi-ticket-perforated-fill fs-2 text-warning d-block mb-1"></i>
                        <h6 className="fw-bold mb-1">Mã Ưu Đãi Độc Quyền Dành Cho Bạn</h6>
                        <p className="small text-muted mb-2">Giảm ngay 50.000đ khi đăng ký khóa học sau khi học thử:</p>
                        <div className="bg-white p-2 rounded border border-warning text-danger fw-bold fs-5 font-monospace mb-2">
                          CHAOHANG
                        </div>
                        <small className="text-muted d-block">Hoặc mã <strong>GIAM20</strong> giảm 20% cho đơn từ 200.000đ.</small>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* ========================================================
                VÙNG 2 & 3: WORKSPACE SOẠN THẢO & LIVE UI PREVIEW (CỘT PHẢI)
               ======================================================== */}
            <Col lg={7}>
              <div className="d-flex flex-column gap-3 h-100">
                {/* TRÌNH SOẠN THẢO WORKSPACE CODE */}
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: '#1f2430' }}>
                  <div className="d-flex justify-content-between align-items-center p-2 px-3 bg-dark border-bottom border-secondary border-opacity-25 text-white">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-terminal-fill text-warning"></i>
                      <span className="small fw-semibold">Workspace Editor ({activeTrial.language})</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary text-light py-0 px-2 small"
                        onClick={handleResetCode}
                        title="Khôi phục lại mã ban đầu"
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i> Khôi phục mẫu
                      </button>
                    </div>
                  </div>

                  <Card.Body className="p-2">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="form-control font-monospace border-0 shadow-none text-light"
                      rows={11}
                      spellCheck="false"
                      style={{
                        backgroundColor: '#1f2430',
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        resize: 'vertical',
                      }}
                    />
                  </Card.Body>

                  {/* Thanh điều khiển nút Chạy & Kiểm Tra */}
                  <div className="p-2 px-3 bg-dark border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <small className="text-secondary">
                      <i className="bi bi-shield-check text-success me-1"></i> Sandbox Web Worker cách ly an toàn
                    </small>

                    <div className="d-flex gap-2">
                      {isRunning && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="fw-bold rounded-pill px-3 shadow-sm"
                          onClick={handleStopExecution}
                        >
                          <i className="bi bi-stop-circle-fill me-1"></i> Dừng
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="fw-bold rounded-pill px-3"
                        disabled={isRunning}
                        onClick={handleRunCode}
                      >
                        <i className="bi bi-play-fill me-1"></i> Chạy Thử Code
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="fw-bold rounded-pill px-4 shadow-sm"
                        disabled={isRunning}
                        onClick={handleCheckSolution}
                      >
                        {isRunning ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Đang kiểm tra...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-1"></i> Kiểm Tra & Hoàn Thành
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* VÙNG 3: HIỂN THỊ KẾT QUẢ - LIVE UI PREVIEW & CONSOLE TEST CASES */}
                <Card className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden bg-white">
                  <Card.Header className="bg-light p-2 px-3 d-flex justify-content-between align-items-center">
                    <Nav variant="pills" className="gap-2">
                      <Nav.Item>
                        <Nav.Link
                          active={outputTab === 'preview'}
                          onClick={() => setOutputTab('preview')}
                          className="py-1 px-3 small fw-bold rounded-pill"
                        >
                          <i className="bi bi-eye-fill me-1 text-primary"></i> Xem Live UI Trực Quan
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          active={outputTab === 'console'}
                          onClick={() => setOutputTab('console')}
                          className="py-1 px-3 small fw-bold rounded-pill"
                        >
                          <i className="bi bi-terminal me-1 text-dark"></i> Console & Test Cases
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    {testResults && (
                      <Badge bg={testResults.passedCount === testResults.total ? 'success' : 'danger'}>
                        {testResults.passedCount}/{testResults.total} Đạt yêu cầu
                      </Badge>
                    )}
                  </Card.Header>

                  <Card.Body className="p-3" style={{ minHeight: '180px', backgroundColor: outputTab === 'console' ? '#f8f9fa' : '#ffffff' }}>
                    {outputTab === 'preview' ? (
                      /* CHẾ ĐỘ 1: XEM LIVE UI TRỰC QUAN */
                      <div>
                        {renderLiveUIPreview()}
                      </div>
                    ) : (
                      /* CHẾ ĐỘ 2: CONSOLE LOGS & TEST CASES */
                      <div className="font-monospace small">
                        {outputLogs.map((log, idx) => (
                          <div key={idx} className="mb-1 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                            {log}
                          </div>
                        ))}

                        {testResults && (
                          <div className="mt-3 pt-2 border-top">
                            <strong className="d-block text-muted mb-2">Chi tiết đối chiếu Test Cases:</strong>
                            {testResults.results.map((tc, idx) => (
                              <div
                                key={idx}
                                className={`p-2 px-3 rounded-3 mb-2 border ${tc.passed ? 'bg-success-subtle border-success-subtle text-success-emphasis' : 'bg-danger-subtle border-danger-subtle text-danger-emphasis'}`}
                              >
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="fw-bold">
                                    <i className={`bi ${tc.passed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                                    {tc.description}
                                  </span>
                                  <Badge bg={tc.passed ? 'success' : 'danger'}>
                                    {tc.passed ? 'PASSED' : 'FAILED'}
                                  </Badge>
                                </div>
                                <div className="small font-monospace text-muted mt-1 bg-white p-2 rounded border">
                                  <div><strong>Đầu vào (Input):</strong> <code>{tc.input}</code></div>
                                  <div><strong>Kết quả thực tế (Actual):</strong> <code className={tc.passed ? 'text-success fw-bold' : 'text-danger fw-bold'}>{tc.actual !== undefined ? tc.actual : 'undefined'}</code></div>
                                  <div><strong>Kỳ vọng (Expected):</strong> <code className="text-primary">{tc.expected_output}</code></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* 3. MODAL CHỨNG NHẬN HOÀN THÀNH BÀI THỬ & CTA MÃ ƯU ĐÃI */}
      <Modal
        show={showCompletionModal}
        onHide={() => setShowCompletionModal(false)}
        centered
        size="lg"
        className="trial-completion-modal"
      >
        <Modal.Body className="p-4 text-center">
          <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-block mb-3">
            <i className="bi bi-award-fill fs-1"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Chúc Mừng Bạn Đã Hoàn Thành Bài Học Thử!</h3>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: 520 }}>
            Bạn đã xuất sắc vượt qua bài thực hành tương tác trực tiếp. Tư duy lập trình và khả năng giải quyết vấn đề của bạn rất phù hợp với chuyên ngành này!
          </p>

          {/* Chứng nhận hoàn thành học thử */}
          <div className="p-4 rounded-4 border bg-light text-start mb-4 shadow-sm position-relative overflow-hidden">
            <div className="position-absolute top-0 end-0 m-3 opacity-25">
              <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '5rem' }}></i>
            </div>
            <Badge bg="success" className="px-3 py-1 rounded-pill mb-2">CHỨNG NHẬN TRẢI NGHIỆM EDUVIET</Badge>
            <h5 className="fw-bold text-dark mb-1">{activeTrial?.title}</h5>
            <small className="text-muted d-block mb-3">Thuộc chương trình: <strong>{activeTrial?.course_title}</strong></small>

            <div className="p-3 bg-white rounded-3 border d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <small className="text-muted d-block">Mã ưu đãi học tập được tặng:</small>
                <span className="fs-5 fw-bold text-danger font-monospace">CHAOHANG</span>
                <small className="text-muted ms-2">(Giảm ngay 50.000đ khi đăng ký)</small>
              </div>
              <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill">
                Học phí: {Number(activeTrial?.course_price || 0).toLocaleString('vi-VN')} đ
              </Badge>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="outline-secondary"
              className="rounded-pill px-4 fw-bold"
              onClick={() => {
                setShowCompletionModal(false);
                const nextId = (selectedTrialId % trials.length) + 1;
                loadTrialDetail(nextId);
              }}
            >
              Học Thử Bài Tiếp Theo →
            </Button>
            <Button
              variant="primary"
              className="rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => {
                setShowCompletionModal(false);
                onNavigate('courses');
              }}
            >
              Kích Hoạt Khóa Học Đầy Đủ Ngay
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
