import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Nav, Form, Spinner, Alert, ProgressBar, Modal } from 'react-bootstrap';
import { getPracticeExercises, getSkillAssessments, getSkillAssessment, submitSkillAssessment, getWeeklyChallenge } from '../services/hubApi';

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

  // Assessment flow
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const workerRef = useRef(null);

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
  };

  // Chạy code an toàn qua Web Worker Sandbox kèm Watchdog 2000ms
  const handleRunCode = () => {
    if (!userCode.trim()) return;
    setRunningCode(true);
    setCodeOutput('Đang thực thi mã nguồn trong Web Worker Sandbox...');

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const workerCode = `
      self.onmessage = function(e) {
        let logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        try {
          const runFn = new Function(e.data);
          runFn();
          self.postMessage({ success: true, logs: logs.join('\\n') });
        } catch (err) {
          self.postMessage({ success: false, error: err.toString() });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const timer = setTimeout(() => {
      worker.terminate();
      setRunningCode(false);
      setCodeOutput('⚠️ Quá thời gian thực thi (Watchdog Timeout 2000ms). Mã nguồn có thể chứa vòng lặp vô hạn!');
    }, 2000);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      setRunningCode(false);
      if (e.data.success) {
        setCodeOutput(e.data.logs || 'Thực thi thành công (Không có đầu ra console).');
      } else {
        setCodeOutput(`❌ Lỗi thực thi: ${e.data.error}`);
      }
    };

    worker.postMessage(userCode);
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
                  <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-0">{activeExercise.title}</h5>
                      <small className="text-secondary">{activeExercise.skill} · Cấp độ: {activeExercise.difficulty}</small>
                    </div>
                    <Button
                      variant="success"
                      className="fw-bold px-4 rounded-pill shadow-sm"
                      disabled={runningCode}
                      onClick={handleRunCode}
                    >
                      {runningCode ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-play-fill me-1"></i>}
                      Chạy Thử Nghiệm
                    </Button>
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
                    <div>
                      <Form.Label className="small fw-bold text-secondary">
                        <i className="bi bi-display me-1"></i> Kết quả thực thi (Console Output):
                      </Form.Label>
                      <pre className="bg-dark text-light p-3 rounded-3 small mb-0" style={{ minHeight: 80, maxHeight: 150, overflowY: 'auto' }}>
                        {codeOutput || '// Nhấn "Chạy Thử Nghiệm" để xem kết quả xuất ra màn hình console...'}
                      </pre>
                    </div>
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
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
            <i className="bi bi-shield-check text-success display-3 mb-3 d-block"></i>
            <h4 className="fw-bold text-dark mb-2">Trung Tâm Ôn Tập Lỗ Hổng Kiến Thức</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: 600 }}>
              Hệ thống tự động theo dõi các câu hỏi trắc nghiệm bạn trả lời sai trong các bài kiểm tra năng lực và phòng học trực tuyến để tạo các bài ôn luyện chuyên sâu.
            </p>
            <div>
              <Button variant="primary" className="fw-bold rounded-pill px-4" onClick={() => setActiveTab('assessment')}>
                Kiểm Tra Năng Lực Ngay
              </Button>
            </div>
          </Card>
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
