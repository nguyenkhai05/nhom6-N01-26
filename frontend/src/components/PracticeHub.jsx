import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Nav, Form, Spinner, Alert, ProgressBar, Modal, Table } from 'react-bootstrap';
import { getPracticeExercises, getSkillAssessments, getSkillAssessment, submitSkillAssessment, getWeeklyChallenge } from '../services/hubApi';
import { runCodeInSandbox, checkTestCasesInSandbox } from '../utils/codeRunner';

export default function PracticeHub({ currentUser }) {
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' | 'bug-fixing' | 'assessment' | 'review' | 'challenge'
  const [exercises, setExercises] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exercise filters & active exercise
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeExercise, setActiveExercise] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [runningCode, setRunningCode] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);

  // Assessment flow
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const activeRunnerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exData, asData, chData] = await Promise.all([
        getPracticeExercises(),
        getSkillAssessments(),
        getWeeklyChallenge(),
      ]);
      setExercises(exData || []);
      setAssessments(asData || []);
      setChallenge(chData || null);
      if (exData && exData.length > 0) {
        selectExercise(exData[0]);
      }
      // Load saved weak areas for student
      const weakKey = `eduviet_weak_areas_${currentUser?.userId || 'guest'}`;
      try {
        const stored = JSON.parse(localStorage.getItem(weakKey) || '[]');
        setWeakAreas(stored);
      } catch {
        setWeakAreas([]);
      }
    } catch (err) {
      console.error('Lỗi nạp dữ liệu Luyện tập:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectExercise = (ex) => {
    setActiveExercise(ex);
    setUserCode(ex.initial_code || '');
    setCodeOutput('');
    setTestResults(null);
  };

  // Dừng thực thi sandbox
  const handleStopCode = () => {
    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
      activeRunnerRef.current = null;
    }
    setRunningCode(false);
    setCodeOutput((prev) => (prev ? prev + '\n' : '') + '⏹️ Đã dừng thực thi theo yêu cầu người dùng.');
  };

  // Chạy code an toàn qua Web Worker Sandbox kèm Watchdog 3000ms
  const handleRunCode = async () => {
    if (!userCode.trim()) return;
    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
    }
    setRunningCode(true);
    setCodeOutput('Đang thực thi mã nguồn trong Web Worker Sandbox...');
    setTestResults(null);

    const runner = runCodeInSandbox({ code: userCode, timeoutMs: 3000 });
    activeRunnerRef.current = runner;

    try {
      const res = await runner.promise;
      setRunningCode(false);
      activeRunnerRef.current = null;

      if (res.success) {
        setCodeOutput((res.logs || []).join('\n') || 'Thực thi thành công (Không có đầu ra console).');
      } else {
        setCodeOutput([...(res.logs || []), `❌ Lỗi: ${res.error}`].join('\n'));
      }
    } catch (err) {
      setRunningCode(false);
      activeRunnerRef.current = null;
      setCodeOutput(`❌ Lỗi thực thi Sandbox: ${err.message}`);
    }
  };

  // Kiểm tra đáp án thực tế với bộ Test Cases
  const handleCheckExercise = async () => {
    if (!activeExercise?.test_cases?.length) {
      setCodeOutput('Bài tập này không có test cases tự động.');
      return;
    }
    if (activeRunnerRef.current) {
      activeRunnerRef.current.cancel();
    }
    setRunningCode(true);
    setCodeOutput('Đang kiểm tra mã nguồn với bộ Test Cases chuẩn...');
    setTestResults(null);

    const runner = checkTestCasesInSandbox({
      code: userCode,
      testCases: activeExercise.test_cases,
      timeoutMs: 3500,
    });
    activeRunnerRef.current = runner;

    try {
      const data = await runner.promise;
      setRunningCode(false);
      activeRunnerRef.current = null;

      if (data.results) {
        setTestResults({
          passedCount: data.passedCount || 0,
          total: data.total || activeExercise.test_cases.length,
          results: data.results,
        });
        if (data.passedCount === (data.total || activeExercise.test_cases.length)) {
          setCodeOutput('🎉 Chúc mừng! Toàn bộ Test Cases đã vượt qua thành công 100%.');
        } else {
          setCodeOutput(`⚠️ Đã hoàn thành kiểm tra: Vượt qua ${data.passedCount}/${data.total} test cases.`);
        }
      } else {
        setCodeOutput(`❌ Kiểm tra thất bại: ${data.error || 'Lỗi không xác định'}`);
      }
    } catch (err) {
      setRunningCode(false);
      activeRunnerRef.current = null;
      setCodeOutput(`❌ Lỗi Sandbox: ${err.message}`);
    }
  };

  // Bắt đầu làm bài đánh giá năng lực
  const handleStartAssessment = async (asId) => {
    setLoading(true);
    setUserAnswers({});
    setAssessmentResult(null);
    try {
      const detail = await getSkillAssessment(asId);
      setActiveAssessment(detail);
    } catch (err) {
      alert(err.message || 'Không thể tải đề kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qId, idx) => {
    setUserAnswers({ ...userAnswers, [qId]: idx });
  };

  const handleSubmitAssessment = async () => {
    if (!activeAssessment) return;
    setSubmittingAssessment(true);
    try {
      const answersArray = Object.entries(userAnswers).map(([qId, ansIdx]) => ({
        question_id: Number(qId),
        selected_index: ansIdx,
      }));
      const res = await submitSkillAssessment(activeAssessment.assessment_id, answersArray);
      setAssessmentResult(res);

      // Lưu lại các câu sai vào lịch sử ôn tập điểm yếu (Weak Areas)
      if (res.detailed_results) {
        const missed = res.detailed_results
          .filter((r) => !r.is_correct)
          .map((r) => ({
            id: r.question_id,
            assessmentTitle: activeAssessment.title,
            questionText: r.question_text,
            skillCategory: r.skill_category,
            explanation: r.explanation,
            timestamp: new Date().toLocaleDateString('vi-VN'),
          }));
        if (missed.length > 0) {
          const weakKey = `eduviet_weak_areas_${currentUser?.userId || 'guest'}`;
          const prev = JSON.parse(localStorage.getItem(weakKey) || '[]');
          const combined = [...missed, ...prev.filter((p) => !missed.some((m) => m.id === p.id))].slice(0, 15);
          localStorage.setItem(weakKey, JSON.stringify(combined));
          setWeakAreas(combined);
        }
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi nộp bài');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    if (activeTab === 'bug-fixing') {
      if (ex.exercise_type !== 'BUG_FIXING') return false;
    } else if (activeTab === 'exercises') {
      if (ex.exercise_type === 'BUG_FIXING') return false;
    }
    if (selectedSkill !== 'All' && ex.skill.toLowerCase() !== selectedSkill.toLowerCase()) return false;
    if (selectedDifficulty !== 'All' && ex.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="practice-hub pb-5">
      {/* Banner */}
      <section className="bg-primary text-white py-5 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0b2545 0%, #134074 100%)' }}>
        <Container className="app-container">
          <Badge bg="success" text="white" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-code-square me-1"></i> TRUNG TÂM LUYỆN TẬP ĐA NĂNG
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Luyện Tập Kỹ Năng & Kiểm Tra Năng Lực</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 850 }}>
            Nâng cao tư duy giải quyết vấn đề với kho bài tập chuyên sâu, làm bài đánh giá kỹ năng chuẩn hóa, tham gia thử thách hàng tuần và nhận diện các điểm kiến thức còn yếu.
          </p>
        </Container>
      </section>

      <Container className="app-container">
        {/* Navigation Tabs */}
        <Nav variant="pills" className="bg-light p-1 rounded-4 border mb-4 flex-wrap">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'exercises'}
              onClick={() => {
                setActiveTab('exercises');
                const firstSkill = exercises.find(e => e.exercise_type !== 'BUG_FIXING');
                if (firstSkill) selectExercise(firstSkill);
              }}
              className="fw-bold px-4 py-2 rounded-3"
            >
              <i className="bi bi-code-slash me-2 text-primary"></i> Luyện Kỹ Năng ({exercises.filter(e => e.exercise_type !== 'BUG_FIXING').length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'bug-fixing'}
              onClick={() => {
                setActiveTab('bug-fixing');
                const firstBug = exercises.find(e => e.exercise_type === 'BUG_FIXING');
                if (firstBug) selectExercise(firstBug);
              }}
              className="fw-bold px-4 py-2 rounded-3"
            >
              <i className="bi bi-bug-fill me-2 text-danger"></i> Sửa Lỗi (Bug Fixing) ({exercises.filter(e => e.exercise_type === 'BUG_FIXING').length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'assessment'}
              onClick={() => { setActiveTab('assessment'); setActiveAssessment(null); }}
              className="fw-bold px-4 py-2 rounded-3"
            >
              <i className="bi bi-clipboard2-check me-2 text-success"></i> Đề Phỏng Vấn & Đánh Giá
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'review'}
              onClick={() => setActiveTab('review')}
              className="fw-bold px-4 py-2 rounded-3"
            >
              <i className="bi bi-arrow-repeat me-2"></i> Ôn Phần Còn Yếu
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'challenge'}
              onClick={() => setActiveTab('challenge')}
              className="fw-bold px-4 py-2 rounded-3"
            >
              <i className="bi bi-trophy-fill me-2 text-warning"></i> Thử Thách Tuần
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* TAB 1 & TAB 2: KHO BÀI LUYỆN & SỬA LỖI CODE */}
        {(activeTab === 'exercises' || activeTab === 'bug-fixing') && (
          <Row className="g-4">
            {/* Sidebar danh sách bài */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 p-3 mb-3 bg-light">
                <div className="d-flex gap-2 mb-2 flex-wrap">
                  {['All', 'JavaScript', 'React', 'SQL', 'Algorithm'].map((s) => (
                    <Button
                      key={s}
                      variant={selectedSkill === s ? 'primary' : 'outline-secondary'}
                      size="sm"
                      className="rounded-pill fw-semibold"
                      onClick={() => setSelectedSkill(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </Card>

              <div className="d-flex flex-column gap-2" style={{ maxHeight: 600, overflowY: 'auto' }}>
                {filteredExercises.map((ex) => (
                  <Card
                    key={ex.exercise_id}
                    className={`border-0 rounded-4 p-3 cursor-pointer transition ${
                      activeExercise?.exercise_id === ex.exercise_id ? 'bg-primary text-white shadow' : 'bg-light hover-bg'
                    }`}
                    onClick={() => selectExercise(ex)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className={`badge ${activeExercise?.exercise_id === ex.exercise_id ? 'bg-light text-dark' : 'bg-secondary'}`}>
                        {ex.skill}
                      </span>
                      <small className={activeExercise?.exercise_id === ex.exercise_id ? 'text-white-50' : 'text-muted'}>
                        {ex.difficulty}
                      </small>
                    </div>
                    <h6 className="fw-bold mb-0 text-truncate">{ex.title}</h6>
                  </Card>
                ))}
              </div>
            </Col>

            {/* Màn hình Code Sandbox */}
            <Col lg={8}>
              {activeExercise ? (
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold mb-0">{activeExercise.title}</h5>
                      <small className="text-secondary">{activeExercise.skill} · Cấp độ: {activeExercise.difficulty}</small>
                    </div>
                    <div className="d-flex gap-2">
                      {runningCode && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="fw-bold px-3 rounded-pill shadow-sm"
                          onClick={handleStopCode}
                        >
                          <i className="bi bi-stop-circle-fill me-1"></i> Dừng
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="fw-bold px-3 rounded-pill"
                        disabled={runningCode}
                        onClick={handleRunCode}
                      >
                        <i className="bi bi-play-fill me-1"></i> Chạy Thử
                      </Button>
                      {activeExercise.test_cases?.length > 0 && (
                        <Button
                          variant="success"
                          size="sm"
                          className="fw-bold px-4 rounded-pill shadow-sm"
                          disabled={runningCode}
                          onClick={handleCheckExercise}
                        >
                          {runningCode ? <Spinner size="sm" animation="border" className="me-1" /> : <i className="bi bi-check2-circle me-1"></i>}
                          Kiểm Tra Đáp Án
                        </Button>
                      )}
                    </div>
                  </div>

                  <Card.Body className="p-4">
                    <p className="text-muted mb-3">{activeExercise.description}</p>
                    {activeExercise.hint && (
                      <Alert variant="warning" className="small py-2 rounded-3 mb-3">
                        <i className="bi bi-lightbulb-fill me-1"></i> Gợi ý: {activeExercise.hint}
                      </Alert>
                    )}

                    {/* Trình soạn thảo */}
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">
                        <i className="bi bi-terminal me-1"></i> Mã nguồn thực thi (JavaScript):
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="font-monospace bg-light text-dark p-3 rounded-3"
                        style={{ fontSize: '0.9rem', lineHeight: '1.4' }}
                      />
                    </Form.Group>

                    {/* Console Output */}
                    <div className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">
                        <i className="bi bi-display me-1"></i> Kết quả thực thi (Console Output):
                      </Form.Label>
                      <pre className="bg-dark text-light p-3 rounded-3 small mb-0" style={{ minHeight: 80, maxHeight: 150, overflowY: 'auto' }}>
                        {codeOutput || '// Nhấn "Chạy Thử" để xem log console hoặc "Kiểm Tra Đáp Án" để chạy test cases...'}
                      </pre>
                    </div>

                    {/* Bảng kết quả Test Cases (Actual vs Expected) */}
                    {testResults && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Form.Label className="small fw-bold text-secondary mb-0">
                            <i className="bi bi-check2-all me-1"></i> Kết quả kiểm thử ({testResults.passedCount}/{testResults.total} đạt):
                          </Form.Label>
                          <Badge bg={testResults.passedCount === testResults.total ? 'success' : 'warning'}>
                            {testResults.passedCount === testResults.total ? 'TOÀN BỘ ĐẠT' : 'CHƯA ĐẠT HẾT'}
                          </Badge>
                        </div>
                        <div className="table-responsive">
                          <Table size="sm" bordered hover className="small mb-0 align-middle">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>Mô tả</th>
                                <th>Đầu vào (Input)</th>
                                <th>Kỳ vọng (Expected)</th>
                                <th>Thực tế (Actual)</th>
                                <th>Kết quả</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testResults.results.map((tr, idx) => (
                                <tr key={idx} className={tr.passed ? 'table-success-subtle' : 'table-danger-subtle'}>
                                  <td>{idx + 1}</td>
                                  <td>{tr.description || 'Test case'}</td>
                                  <td className="font-monospace">{tr.input}</td>
                                  <td className="font-monospace text-success">{tr.expected_output}</td>
                                  <td className="font-monospace">{tr.actual}</td>
                                  <td>
                                    <Badge bg={tr.passed ? 'success' : 'danger'}>
                                      {tr.passed ? 'PASSED' : 'FAILED'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ) : null}
            </Col>
          </Row>
        )}

        {/* TAB 2: KIỂM TRA NĂNG LỰC */}
        {activeTab === 'assessment' && (
          <div>
            {!activeAssessment ? (
              <Row className="g-4">
                {assessments.map((as) => (
                  <Col key={as.assessment_id} md={6}>
                    <Card className="h-100 shadow-sm border-0 rounded-4 p-4 hover-shadow">
                      <Badge bg="primary-subtle" text="primary" className="px-3 py-1 rounded-pill fw-bold mb-2 align-self-start">
                        {as.topic}
                      </Badge>
                      <h5 className="fw-bold text-dark mb-2">{as.title}</h5>
                      <p className="text-muted small mb-4">
                        <i className="bi bi-clock me-1"></i> Thời lượng: {as.duration_minutes} phút | <i className="bi bi-list-check me-1"></i> {as.total_questions} câu hỏi chuẩn hóa
                      </p>
                      <Button
                        variant="primary"
                        className="fw-bold mt-auto rounded-pill px-4"
                        onClick={() => handleStartAssessment(as.assessment_id)}
                      >
                        Bắt Đầu Làm Bài <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : assessmentResult ? (
              /* KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC */
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <div className="text-center py-4 border-bottom mb-4">
                  <Badge
                    bg={assessmentResult.is_passed ? 'success' : 'warning'}
                    text={assessmentResult.is_passed ? 'white' : 'dark'}
                    className="px-4 py-2 rounded-pill fs-6 fw-bold mb-3"
                  >
                    {assessmentResult.is_passed ? 'ĐẠT TIÊU CHUẨN ĐÁNH GIÁ' : 'CẦN ÔN TẬP THÊM'}
                  </Badge>
                  <h2 className="display-4 fw-bold text-dark mb-1">{assessmentResult.score} / 100đ</h2>
                  <p className="text-muted">Đúng {assessmentResult.correct_count} trên tổng số {assessmentResult.total_questions} câu hỏi</p>
                  <Alert variant={assessmentResult.is_passed ? 'success' : 'info'} className="mx-auto" style={{ maxWidth: 600 }}>
                    {assessmentResult.recommendation}
                  </Alert>
                </div>

                {/* Phân tích kỹ năng (Skill Radar Breakdown) */}
                <h5 className="fw-bold text-dark mb-3">Phân Tích Năng Lực Theo Từng Kỹ Năng:</h5>
                <Row className="g-3 mb-4">
                  {assessmentResult.skill_radar?.map((item, idx) => (
                    <Col key={idx} md={6}>
                      <div className="bg-light p-3 rounded-3 border">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold text-dark">{item.skill}</span>
                          <span className="fw-bold text-primary">{item.accuracy_percent}%</span>
                        </div>
                        <ProgressBar now={item.accuracy_percent} variant={item.accuracy_percent >= 70 ? 'success' : 'warning'} />
                      </div>
                    </Col>
                  ))}
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="light" onClick={() => { setActiveAssessment(null); setAssessmentResult(null); }}>
                    Quay Về Danh Sách Đề
                  </Button>
                  <Button variant="primary" onClick={() => handleStartAssessment(activeAssessment.assessment_id)}>
                    Làm Lại Đề Này
                  </Button>
                </div>
              </Card>
            ) : (
              /* MÀN HÌNH LÀM BÀI TRẮC NGHIỆM */
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{activeAssessment.title}</h5>
                    <small className="text-muted">Thời lượng ước tính: {activeAssessment.duration_minutes} phút</small>
                  </div>
                  <Button variant="outline-secondary" size="sm" onClick={() => setActiveAssessment(null)}>
                    Hủy bài thi
                  </Button>
                </div>

                <div className="d-flex flex-column gap-4 mb-4">
                  {activeAssessment.questions?.map((q, qIdx) => (
                    <div key={q.question_id} className="p-3 bg-light rounded-4 border">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="badge bg-primary-subtle text-primary fw-bold">
                          Câu {qIdx + 1} ({q.skill_category})
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-3">{q.question_text}</h6>
                      <div className="d-flex flex-column gap-2">
                        {q.options?.map((opt, optIdx) => (
                          <Form.Check
                            key={optIdx}
                            type="radio"
                            id={`q-${q.question_id}-opt-${optIdx}`}
                            name={`q-${q.question_id}`}
                            label={opt}
                            checked={userAnswers[q.question_id] === optIdx}
                            onChange={() => handleSelectAnswer(q.question_id, optIdx)}
                            className="p-2 border rounded-3 bg-white"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    className="fw-bold px-5 py-2 rounded-pill shadow-sm"
                    disabled={submittingAssessment}
                    onClick={handleSubmitAssessment}
                  >
                    {submittingAssessment ? 'Đang chấm điểm...' : 'Nộp Bài Đánh Giá'}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* TAB 3: ÔN TẬP ĐIỂM YẾU */}
        {activeTab === 'review' && (
          <div>
            {weakAreas.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
                <i className="bi bi-shield-check text-success display-3 mb-3 d-block"></i>
                <h4 className="fw-bold text-dark mb-2">Trung Tâm Ôn Tập Lỗ Hổng Kiến Thức</h4>
                <p className="text-muted mx-auto mb-4" style={{ maxWidth: 600 }}>
                  Hiện tại bạn chưa có câu hỏi nào bị trả lời sai hoặc cần ôn tập bổ sung. Hãy làm bài kiểm tra năng lực để hệ thống tự động phân tích và tạo lộ trình ôn tập cá nhân hóa!
                </p>
                <div>
                  <Button variant="primary" className="fw-bold rounded-pill px-4" onClick={() => setActiveTab('assessment')}>
                    Làm Bài Kiểm Tra Năng Lực Ngay
                  </Button>
                </div>
              </Card>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <h4 className="fw-bold text-dark mb-1">
                      <i className="bi bi-bullseye text-danger me-2"></i>
                      Danh Mục Câu Hỏi Cần Củng Cố ({weakAreas.length})
                    </h4>
                    <p className="text-muted small mb-0">
                      Được ghi nhận tự động từ các câu trả lời chưa chính xác trong các bài đánh giá năng lực gần đây.
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xóa lịch sử các câu hỏi cần ôn tập?')) {
                          const weakKey = `eduviet_weak_areas_${currentUser?.userId || 'guest'}`;
                          localStorage.removeItem(weakKey);
                          setWeakAreas([]);
                        }
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Xóa lịch sử
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-pill fw-bold"
                      onClick={() => setActiveTab('assessment')}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i> Kiểm tra lại
                    </Button>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {weakAreas.map((w, idx) => (
                    <Card key={idx} className="border-0 shadow-sm rounded-4 p-4 border-start border-4 border-warning">
                      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="warning-subtle" text="warning" className="px-3 py-1 rounded-pill fw-bold border border-warning-subtle">
                            {w.skillCategory || 'Chuyên đề'}
                          </Badge>
                          <small className="text-muted">{w.assessmentTitle}</small>
                        </div>
                        <small className="text-muted">{w.timestamp}</small>
                      </div>
                      <h6 className="fw-bold text-dark mb-2">{w.questionText}</h6>
                      {w.explanation && (
                        <div className="p-3 bg-light rounded-3 small text-secondary border">
                          <strong className="text-dark d-block mb-1">
                            <i className="bi bi-lightbulb-fill text-warning me-1"></i> Giải thích kiến thức trọng tâm:
                          </strong>
                          {w.explanation}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: THỬ THÁCH TUẦN & LEADERBOARD */}
        {activeTab === 'challenge' && challenge && (
          <Row className="g-4">
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
                <Badge bg="warning" text="dark" className="px-3 py-1 rounded-pill fw-bold mb-2 align-self-start">
                  ĐANG DIỄN RA
                </Badge>
                <h4 className="fw-bold text-dark mb-3">{challenge.title}</h4>
                <p className="text-muted mb-4">
                  Thử thách tuần là cơ hội để toàn bộ học viên cùng giải quyết một bài toán thuật toán thực tế trong điều kiện giới hạn thời gian và tài nguyên máy tính.
                </p>
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">Hạn chót tham gia:</span>
                    <span className="small fw-bold text-danger">05/11/2026 23:59 GMT+7</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Phần thưởng:</span>
                    <span className="small fw-bold text-success">{challenge.reward}</span>
                  </div>
                </div>
                <Button variant="primary" className="fw-bold py-2 rounded-pill shadow-sm mt-auto" onClick={() => setActiveTab('exercises')}>
                  Tham Gia Thử Thách Ngay
                </Button>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-trophy-fill text-warning me-2"></i> Bảng Xếp Hạng Tuần (Opt-in)
                </h5>
                <div className="d-flex flex-column gap-2">
                  {challenge.leaderboard?.map((u) => (
                    <div key={u.rank} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light border">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge rounded-circle ${u.rank === 1 ? 'bg-warning text-dark' : u.rank === 2 ? 'bg-secondary' : 'bg-dark'}`} style={{ width: 24, height: 24, lineHeight: '18px' }}>
                          {u.rank}
                        </span>
                        <span className="fw-bold small text-dark">{u.display_name}</span>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold text-success small">{u.score}đ</span>
                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>{u.time_seconds}s</small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
