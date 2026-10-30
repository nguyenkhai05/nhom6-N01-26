import { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Button, Nav, Form, Spinner, Alert, ProgressBar, Modal, Table } from 'react-bootstrap';
import { getPracticeExercises, getSkillAssessments, getSkillAssessment, submitSkillAssessment, getWeeklyChallenge } from '../services/hubApi';
import { runCodeInSandbox, checkTestCasesInSandbox } from '../utils/codeRunner';

export default function PracticeHub({
  currentUser,
  courses = [],
  onNavigate,
  onStartLearning,
  onOpenLogin,
  onOpenRegister,
}) {
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' | 'bug-fixing' | 'assessment' | 'review' | 'challenge'
  const [exercises, setExercises] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quyền truy cập phòng luyện tập: Sau khi học xong bài giảng
  const [forceBypass, setForceBypass] = useState(false);
  const enrolledCourseIds = currentUser?.enrolledCourses || [];
  const isPrivileged = currentUser?.role === 'ADMIN' || currentUser?.role === 'INSTRUCTOR';

  // Danh sách các khóa học học viên đã sở hữu
  const userEnrolledCourses = useMemo(() => {
    return courses.filter((c) => enrolledCourseIds.includes(c.course_id));
  }, [courses, enrolledCourseIds]);

  // Đếm tổng số bài học đã hoàn thành thực tế từ tiến độ phòng học
  const totalCompletedLessons = useMemo(() => {
    if (!currentUser) return 0;
    const uId = currentUser?.userId || currentUser?.id || 'demo';
    let count = 0;
    for (const cId of enrolledCourseIds) {
      try {
        const stored = JSON.parse(localStorage.getItem(`eduviet_course_progress_${uId}_${cId}`) || '{}');
        if (Array.isArray(stored.completedLessons)) {
          count += stored.completedLessons.length;
        }
      } catch {}
    }
    return count;
  }, [currentUser, enrolledCourseIds]);

  // Điều kiện vào phòng luyện tập: Phải đăng nhập, sở hữu khóa học và đã hoàn thành ít nhất 1 bài học (hoặc Admin/Giảng viên)
  const hasAccess = isPrivileged || forceBypass || (enrolledCourseIds.length > 0 && totalCompletedLessons > 0);

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
        {!hasAccess ? (
          /* ========================================================
             GATING: YÊU CẦU HỌC XONG BÀI GIẢNG TRƯỚC KHI VÀO LUYỆN TẬP
             ======================================================== */
          <div className="py-4 page-fade-in text-center">
            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto bg-white" style={{ maxWidth: '820px' }}>
              {!currentUser ? (
                /* Trường hợp 1: Khách chưa đăng nhập */
                <>
                  <div
                    className="mx-auto mb-3 p-3 bg-warning-subtle text-warning rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-shield-lock-fill fs-1 text-dark"></i>
                  </div>
                  <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mx-auto mb-3 fs-6">
                    <i className="bi bi-lock-fill me-1"></i> PHÒNG LUYỆN TẬP CÓ ĐIỀU KIỆN
                  </Badge>
                  <h2 className="fw-bold text-dark mb-3">Luyện Tập Dành Cho Học Viên Đã Học Xong</h2>
                  <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
                    Tại EduViet, quy trình đào tạo thực chiến là: <strong>"Học lý thuyết & xem video bài giảng trước → Hoàn thành bài học → Vào phòng thực hành luyện tập & sửa lỗi"</strong>. Phòng Luyện tập không dành cho việc test code tự do khi chưa có kiến thức nền tảng.
                  </p>

                  <div className="row g-3 text-start mb-4">
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded-3 border h-100">
                        <div className="fw-bold text-primary mb-1">1. Đăng Ký Học Viên</div>
                        <small className="text-muted">Nhận ngay 1.000.000đ vào ví học tập để kích hoạt khóa học.</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded-3 border h-100">
                        <div className="fw-bold text-primary mb-1">2. Hoàn Thành Bài Học</div>
                        <small className="text-muted">Xem bài giảng trong Phòng học để tích lũy kiến thức.</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded-3 border h-100">
                        <div className="fw-bold text-success mb-1">3. Mở Khóa Luyện Tập</div>
                        <small className="text-muted">Giải bài tập, sửa lỗi code và làm bài đánh giá chuẩn hóa.</small>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold shadow-sm"
                      onClick={() => onOpenLogin?.()}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i> Đăng Nhập Học Viên
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                      onClick={() => onOpenRegister?.()}
                    >
                      <i className="bi bi-person-plus me-2"></i> Đăng Ký Nhận Ví 1.000.000đ
                    </Button>
                    <Button
                      variant="light"
                      size="lg"
                      className="rounded-pill px-4 fw-bold border text-secondary"
                      onClick={() => onNavigate?.('try')}
                    >
                      <i className="bi bi-play-circle me-2 text-warning"></i> Trải Nghiệm Tab "Học Thử"
                    </Button>
                  </div>
                </>
              ) : enrolledCourseIds.length === 0 ? (
                /* Trường hợp 2: Đã đăng nhập nhưng chưa đăng ký khóa học nào */
                <>
                  <div
                    className="mx-auto mb-3 p-3 bg-info-subtle text-info rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-mortarboard-fill fs-1"></i>
                  </div>
                  <Badge bg="info" text="dark" className="px-3 py-2 fw-bold rounded-pill mx-auto mb-3 fs-6">
                    <i className="bi bi-info-circle-fill me-1"></i> CHƯA CÓ KHÓA HỌC ĐƯỢC KÍCH HOẠT
                  </Badge>
                  <h2 className="fw-bold text-dark mb-3">Hãy Học Lý Thuyết Trước Khi Luyện Tập!</h2>
                  <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
                    Xin chào <strong>{currentUser.fullName}</strong>! Để tránh việc làm bài tập mò mẫm không hiệu quả, hệ thống yêu cầu bạn đăng ký khóa học và hoàn thành bài giảng trước khi vào phòng Luyện tập.
                  </p>

                  <div className="d-flex justify-content-center flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold shadow-sm"
                      onClick={() => onNavigate?.('courses')}
                    >
                      <i className="bi bi-grid-fill me-2"></i> Khám Phá Các Khóa Học
                    </Button>
                    <Button
                      variant="outline-info"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                      onClick={() => onNavigate?.('find-course')}
                    >
                      <i className="bi bi-compass me-2"></i> Chọn Khóa Học Phù Hợp
                    </Button>
                    <Button
                      variant="light"
                      size="lg"
                      className="rounded-pill px-4 fw-bold border text-secondary"
                      onClick={() => onNavigate?.('try')}
                    >
                      <i className="bi bi-play-circle me-2 text-warning"></i> Học Thử Trải Nghiệm Trước
                    </Button>
                  </div>
                </>
              ) : (
                /* Trường hợp 3: Đã đăng ký khóa học nhưng chưa hoàn thành bài học nào */
                <>
                  <div
                    className="mx-auto mb-3 p-3 bg-warning-subtle text-warning rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-hourglass-split fs-1 text-dark"></i>
                  </div>
                  <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mx-auto mb-3 fs-6">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> CẦN HOÀN THÀNH BÀI HỌC TRƯỚC
                  </Badge>
                  <h2 className="fw-bold text-dark mb-3">Bạn Chưa Hoàn Thành Bài Học Nào!</h2>
                  <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
                    Bạn đã sở hữu <strong>{userEnrolledCourses.length || enrolledCourseIds.length}</strong> khóa học trên EduViet. Tuy nhiên, bạn chưa hoàn thành bài giảng lý thuyết nào trong Phòng học. Hãy vào xem video bài giảng và nắm vững cú pháp trước khi vào giải bài tập nhé!
                  </p>

                  {userEnrolledCourses.length > 0 && (
                    <div className="row g-3 justify-content-center mb-4 text-start">
                      {userEnrolledCourses.slice(0, 3).map((c) => (
                        <div key={c.course_id} className="col-md-6 col-lg-4">
                          <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                            <div>
                              <span className="badge bg-primary mb-2">{c.category?.name || 'Lập trình'}</span>
                              <div className="fw-bold text-dark text-truncate" title={c.title}>{c.title}</div>
                              <small className="text-muted d-block mt-1">Chưa hoàn thành bài học</small>
                            </div>
                            <Button
                              variant="success"
                              size="sm"
                              className="rounded-pill mt-3 fw-bold w-100"
                              onClick={() => (onStartLearning ? onStartLearning(c) : onNavigate?.('courses'))}
                            >
                              <i className="bi bi-play-fill me-1"></i> Vào Phòng Học
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold shadow-sm"
                      onClick={() => {
                        if (userEnrolledCourses.length > 0 && onStartLearning) {
                          onStartLearning(userEnrolledCourses[0]);
                        } else {
                          onNavigate?.('courses');
                        }
                      }}
                    >
                      <i className="bi bi-play-circle-fill me-2"></i> Vào Phòng Học Ngay
                    </Button>
                    <button
                      type="button"
                      className="btn btn-link text-muted small text-decoration-none"
                      onClick={() => setForceBypass(true)}
                    >
                      Tôi đã nắm vững kiến thức ngoài, muốn mở khóa thử sức ngay →
                    </button>
                  </div>
                </>
              )}
            </Card>
          </div>
        ) : (
          /* ========================================================
             ĐÃ ĐỦ ĐIỀU KIỆN: HIỂN THỊ TRỌN VẸN 5 TABS & WORKSPACE
             ======================================================== */
          <>
            {/* Thanh trạng thái chứng nhận mở khóa */}
            <div className="bg-success-subtle border border-success-subtle text-success-emphasis p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2 page-fade-in">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: 38, height: 38 }}
                >
                  <i className="bi bi-check2-circle fs-4"></i>
                </div>
                <div>
                  <div className="fw-bold">
                    {isPrivileged
                      ? 'Quyền Quản Trị / Giảng Viên: Đã Mở Khóa Toàn Bộ Phòng Luyện Tập'
                      : `Đã Mở Khóa Quyền Luyện Tập: Đã Hoàn Thành ${totalCompletedLessons} Bài Học!`}
                  </div>
                  <small className="text-muted">
                    {isPrivileged
                      ? 'Bạn có toàn quyền kiểm thử và đánh giá mọi bài tập lập trình.'
                      : 'Kiến thức lý thuyết từ video bài giảng đã sẵn sàng, hãy tự tin giải bài và sửa lỗi code bên dưới.'}
                  </small>
                </div>
              </div>
              <Badge bg="success" className="px-3 py-2 rounded-pill fw-semibold">
                <i className="bi bi-unlock-fill me-1"></i> ĐÃ ĐỦ ĐIỀU KIỆN LUYỆN TẬP
              </Badge>
            </div>

            {/* Navigation Tabs */}
            <Nav variant="pills" className="bg-light p-1 rounded-4 border mb-4 flex-wrap">
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'exercises'}
                  onClick={() => {
                    setActiveTab('exercises');
                    const firstSkill = exercises.find((e) => e.exercise_type !== 'BUG_FIXING');
                    if (firstSkill) selectExercise(firstSkill);
                  }}
                  className="fw-bold px-4 py-2 rounded-3"
                >
                  <i className="bi bi-code-slash me-2 text-primary"></i> Luyện Kỹ Năng ({exercises.filter((e) => e.exercise_type !== 'BUG_FIXING').length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'bug-fixing'}
                  onClick={() => {
                    setActiveTab('bug-fixing');
                    const firstBug = exercises.find((e) => e.exercise_type === 'BUG_FIXING');
                    if (firstBug) selectExercise(firstBug);
                  }}
                  className="fw-bold px-4 py-2 rounded-3"
                >
                  <i className="bi bi-bug-fill me-2 text-danger"></i> Sửa Lỗi (Bug Fixing) ({exercises.filter((e) => e.exercise_type === 'BUG_FIXING').length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'assessment'}
                  onClick={() => {
                    setActiveTab('assessment');
                    setActiveAssessment(null);
                  }}
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
          </>
        )}
      </Container>
    </div>
  );
}
