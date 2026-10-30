import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Accordion, Modal } from 'react-bootstrap';
import { getTrials, getTrial } from '../services/hubApi';

export default function InteractiveTrialPage({ currentUser, onNavigate, onCourseSelect }) {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrialId, setSelectedTrialId] = useState(1);
  const [activeTrial, setActiveTrial] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Workspace editor state
  const [userCode, setUserCode] = useState('');
  const [outputLogs, setOutputLogs] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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

  // Chạy mã nguồn an toàn bằng Web Worker
  const handleRunCode = () => {
    setIsRunning(true);
    setOutputLogs(['[Đang thực thi mã nguồn...]']);
    setTestResults(null);

    const workerScript = `
      self.onmessage = function(e) {
        const code = e.data.code;
        const logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        try {
          const run = new Function(code);
          run();
          self.postMessage({ success: true, logs: logs.length ? logs : ['(Thực thi thành công, không có log)'] });
        } catch (err) {
          self.postMessage({ success: false, error: err.message, logs: logs });
        }
      };
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      const timeoutId = setTimeout(() => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setIsRunning(false);
        setOutputLogs(['Lỗi: Quá thời gian thực thi (Timeout 3000ms). Vui lòng kiểm tra vòng lặp vô tận.']);
      }, 3000);

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setIsRunning(false);

        if (e.data.success) {
          setOutputLogs(e.data.logs);
        } else {
          setOutputLogs([...(e.data.logs || []), `Lỗi thực thi: ${e.data.error}`]);
        }
      };

      worker.postMessage({ code: userCode });
    } catch (err) {
      setIsRunning(false);
      setOutputLogs([`Lỗi khởi tạo sandbox: ${err.message}`]);
    }
  };

  // Kiểm tra đáp án thực tế qua Web Worker Sandbox (Thực thi test cases thật, không giả lập chuỗi)
  const handleCheckSolution = () => {
    if (!activeTrial?.test_cases?.length) {
      setOutputLogs(['Bài học này không có test cases tự động. Bạn hãy xem mục Gợi ý để kiểm tra.']);
      return;
    }

    setIsRunning(true);
    setOutputLogs(['[Đang nạp mã nguồn vào Sandbox và thực thi từng Test Case thực tế...]']);
    setTestResults(null);

    const workerScript = `
      self.onmessage = function(e) {
        const { code, testCases, trialId } = e.data;
        const results = [];
        let passedCount = 0;

        try {
          const fnScope = new Function(\`
            \${code};
            return {
              WelcomeCard: typeof WelcomeCard !== 'undefined' ? WelcomeCard : undefined,
              getCourseOverview: typeof getCourseOverview !== 'undefined' ? getCourseOverview : undefined,
              calculateAverageScore: typeof calculateAverageScore !== 'undefined' ? calculateAverageScore : (typeof calculate_average_score !== 'undefined' ? calculate_average_score : undefined),
              validateDevOpsPipeline: typeof validateDevOpsPipeline !== 'undefined' ? validateDevOpsPipeline : undefined,
              __eval: function(expr) { return eval(expr); }
            };
          \`);
          const exports = fnScope();

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            let actualVal;
            let passed = false;

            try {
              let result;
              if (trialId === 1 && typeof exports.WelcomeCard === 'function') {
                const args = new Function('return (' + tc.input + ')')();
                result = exports.WelcomeCard(args);
              } else if (trialId === 2 && typeof exports.getCourseOverview === 'function') {
                result = exports.__eval(tc.input);
              } else if (trialId === 3 && (typeof exports.calculateAverageScore === 'function' || typeof exports.calculate_average_score === 'function')) {
                const fn = exports.calculateAverageScore || exports.calculate_average_score;
                const args = new Function('return (' + tc.input + ')')();
                result = fn(args);
              } else if (trialId === 4 && typeof exports.validateDevOpsPipeline === 'function') {
                const args = new Function('return (' + tc.input + ')')();
                result = exports.validateDevOpsPipeline(args);
              } else {
                result = exports.__eval(tc.input);
              }

              const actualStr = typeof result === 'object' && result !== null ? JSON.stringify(result) : String(result);
              actualVal = actualStr;

              const expTrim = String(tc.expected_output).trim();
              const actTrim = actualStr.trim();

              if ((actTrim.startsWith('{') || actTrim.startsWith('[')) && (expTrim.startsWith('{') || expTrim.startsWith('['))) {
                try {
                  passed = JSON.stringify(JSON.parse(actTrim)) === JSON.stringify(JSON.parse(expTrim));
                } catch {
                  passed = actTrim === expTrim;
                }
              } else {
                passed = actTrim === expTrim;
              }
            } catch (execErr) {
              actualVal = 'Lỗi thực thi: ' + execErr.message;
              passed = false;
            }

            if (passed) passedCount++;
            results.push({
              ...tc,
              passed,
              actual: actualVal,
            });
          }

          self.postMessage({
            success: true,
            passedCount,
            total: testCases.length,
            results,
          });
        } catch (syntaxErr) {
          self.postMessage({
            success: false,
            error: 'Lỗi cú pháp (SyntaxError): ' + syntaxErr.message,
            results: testCases.map(tc => ({ ...tc, passed: false, actual: 'Lỗi cú pháp: ' + syntaxErr.message })),
          });
        }
      };
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      const timeoutId = setTimeout(() => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setIsRunning(false);
        setOutputLogs(['Lỗi: Quá thời gian thực thi (Timeout 3000ms). Vui lòng kiểm tra vòng lặp vô tận.']);
      }, 3000);

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setIsRunning(false);

        const data = e.data;
        if (data.results) {
          setTestResults({
            passedCount: data.passedCount || 0,
            total: data.total || activeTrial.test_cases.length,
            results: data.results,
          });

          if (data.passedCount === (data.total || activeTrial.test_cases.length)) {
            setOutputLogs([
              '🎉 Chúc mừng! Toàn bộ Test Cases đã vượt qua thành công.',
              'Mã nguồn của bạn đã thực thi chuẩn xác và trả về kết quả khớp với toàn bộ điều kiện kiểm thử!',
            ]);
            setTimeout(() => setShowCompletionModal(true), 800);
          } else {
            setOutputLogs([
              '⚠️ Một số Test Cases chưa vượt qua kết quả thực tế.',
              data.error || 'Hãy xem mục Chi tiết Test Cases bên dưới để đối chiếu Actual vs Expected.',
            ]);
          }
        } else {
          setOutputLogs([data.error || 'Kiểm tra thất bại.']);
        }
      };

      worker.postMessage({
        code: userCode,
        testCases: activeTrial.test_cases || [],
        trialId: activeTrial.trial_id,
      });
    } catch (err) {
      setIsRunning(false);
      setOutputLogs([`Lỗi khởi tạo sandbox: ${err.message}`]);
    }
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
              <Badge bg="success" className="px-3 py-2 fw-bold rounded-pill mb-2">
                <i className="bi bi-laptop me-1"></i> CODECADEMY-STYLE INTERACTIVE TRIAL
              </Badge>
              <h1 className="fw-bold fs-3 mb-1">Học Thử Tương Tác: Trải Nghiệm Trước Khi Đăng Ký</h1>
              <p className="text-light small mb-0 opacity-85">
                Viết mã thực tế ngay trên trình duyệt với Sandbox an toàn, nhận phản hồi tức thời từ máy chấm và khám phá giáo trình chuyên sâu.
              </p>
            </div>

            <Button
              variant="outline-light"
              size="sm"
              className="rounded-pill px-3 fw-semibold"
              onClick={() => onNavigate('courses')}
            >
              <i className="bi bi-arrow-left me-1"></i> Trở về danh mục khóa học
            </Button>
          </div>

          {/* Dải chọn bài học thử */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
            {trials.map((t) => (
              <Button
                key={t.trial_id}
                variant={selectedTrialId === t.trial_id ? 'warning' : 'outline-light'}
                size="sm"
                className={`rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 ${selectedTrialId === t.trial_id ? 'text-dark shadow-sm' : 'border-0 bg-dark bg-opacity-25'}`}
                onClick={() => loadTrialDetail(t.trial_id)}
              >
                <i className="bi bi-code-square"></i>
                <span>Bài {t.trial_id}: {t.title.split(':')[0]}</span>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. KHÔNG GIAN TƯƠNG TÁC 3 VÙNG (CODECADEMY WORKSPACE) */}
      <Container className="app-container">
        {loadingDetail || !activeTrial ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang khởi tạo không gian Sandbox tương tác...</p>
          </div>
        ) : (
          <Row className="g-3">
            {/* VÙNG 1: HƯỚNG DẪN & LÝ THUYẾT (CỘT TRÁI) */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                <Card.Header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary" className="rounded-pill">
                      {activeTrial.language.toUpperCase()}
                    </Badge>
                    <span className="small text-muted fw-semibold">
                      <i className="bi bi-clock me-1"></i> {activeTrial.duration_minutes} phút trải nghiệm
                    </span>
                  </div>
                  <Badge bg="success-subtle" className="text-success border border-success-subtle">
                    Miễn phí học thử
                  </Badge>
                </Card.Header>

                <Card.Body className="p-4 overflow-auto" style={{ maxHeight: '680px' }}>
                  <h5 className="fw-bold text-dark mb-2">{activeTrial.title}</h5>
                  <p className="text-muted small mb-3">{activeTrial.summary}</p>

                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <small className="text-muted d-block mb-1">Khóa học gốc:</small>
                    <strong className="text-primary d-block small mb-2">{activeTrial.course_title}</strong>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-danger small">
                        Học phí: {Number(activeTrial.course_price).toLocaleString('vi-VN')} đ
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-primary small text-decoration-none fw-bold"
                        onClick={() => onNavigate('courses')}
                      >
                        Xem khóa học <i className="bi bi-arrow-right"></i>
                      </Button>
                    </div>
                  </div>

                  <div
                    className="trial-instructions text-dark mb-4"
                    style={{ fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}
                  >
                    {activeTrial.instructions}
                  </div>

                  {/* Gợi ý từng bước (Hints Accordion) */}
                  {activeTrial.hints?.length > 0 && (
                    <Accordion className="mt-3">
                      <Accordion.Item eventKey="0" className="border rounded-3 overflow-hidden">
                        <Accordion.Header>
                          <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                          <span className="small fw-bold">Gợi ý từng bước (Nhấp để mở)</span>
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
                </Card.Body>
              </Card>
            </Col>

            {/* VÙNG 2 & 3: TRÌNH SOẠN THẢO CODE & CONSOLE OUTPUT (CỘT PHẢI) */}
            <Col lg={7}>
              <div className="d-flex flex-column gap-3 h-100">
                {/* VÙNG 2: CODE EDITOR */}
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
                      rows={12}
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
                  <div className="p-2 px-3 bg-dark border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <small className="text-secondary">
                      <i className="bi bi-shield-check text-success me-1"></i> Sandbox Web Worker cách ly
                    </small>

                    <div className="d-flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="fw-bold rounded-pill px-3"
                        disabled={isRunning}
                        onClick={handleRunCode}
                      >
                        <i className="bi bi-play-fill me-1"></i> Chạy thử
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
                            <i className="bi bi-check2-circle me-1"></i> Kiểm tra đáp án
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* VÙNG 3: OUTPUT CONSOLE & TEST CASES */}
                <Card className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden bg-white">
                  <Card.Header className="bg-light p-2 px-3 d-flex justify-content-between align-items-center">
                    <strong className="small text-muted d-flex align-items-center gap-1">
                      <i className="bi bi-card-checklist text-primary"></i>
                      Kết quả & Test Cases
                    </strong>
                    {testResults && (
                      <Badge bg={testResults.passedCount === testResults.total ? 'success' : 'danger'}>
                        {testResults.passedCount}/{testResults.total} Đạt yêu cầu
                      </Badge>
                    )}
                  </Card.Header>

                  <Card.Body className="p-3 font-monospace small" style={{ minHeight: '140px', backgroundColor: '#f8f9fa' }}>
                    {outputLogs.map((log, idx) => (
                      <div key={idx} className="mb-1 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                        {log}
                      </div>
                    ))}

                    {testResults && (
                      <div className="mt-3 pt-2 border-top">
                        <strong className="d-block text-muted mb-2">Chi tiết Test Cases:</strong>
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
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* 3. MODAL CHÚC MỪNG HOÀN THÀNH BÀI THỬ & CTA MUA KHÓA */}
      <Modal
        show={showCompletionModal}
        onHide={() => setShowCompletionModal(false)}
        centered
        className="trial-completion-modal"
      >
        <Modal.Body className="p-4 text-center">
          <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-block mb-3">
            <i className="bi bi-trophy-fill fs-1"></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">Xuất Sắc! Bạn Đã Hoàn Thành Bài Học Thử</h4>
          <p className="text-muted small mb-4">
            Bạn đã làm chủ được kiến thức nền tảng trong bài học thử này. Tiếp tục lộ trình đầy đủ với giáo trình bài bản, hỗ trợ sửa code 1-1 cùng Giảng viên và chứng chỉ nghề nghiệp!
          </p>

          {activeTrial && (
            <div className="p-3 bg-light rounded-4 border mb-4 text-start">
              <span className="small text-muted d-block">Khóa học trọn gói tiếp theo:</span>
              <strong className="text-dark d-block mb-2">{activeTrial.course_title}</strong>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold text-danger">
                  {Number(activeTrial.course_price).toLocaleString('vi-VN')} đ
                </span>
                <span className="badge bg-warning text-dark">Cam kết đầu ra</span>
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="flex-grow-1 rounded-pill"
              onClick={() => setShowCompletionModal(false)}
            >
              Học thử bài khác
            </Button>
            <Button
              variant="primary"
              className="flex-grow-1 fw-bold rounded-pill shadow-sm"
              onClick={() => {
                setShowCompletionModal(false);
                onNavigate('courses');
              }}
            >
              Xem Khóa Học Đầy Đủ
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
