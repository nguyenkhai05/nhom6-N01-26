import { useState } from 'react';
import { Row, Col, Button, Badge, Card, Tab, Nav, Form, Alert } from 'react-bootstrap';

// Danh sách các bài tập thuật toán lập trình
const CODING_CHALLENGES = [
  {
    id: 'two-sum',
    title: 'Two Sum (Tổng hai số)',
    difficulty: 'Easy',
    points: 100,
    tags: ['Array', 'Hash Map', 'Algorithm'],
    description: `Cho một mảng các số nguyên \`nums\` và một số nguyên \`target\`.
Hãy viết hàm trả về các chỉ số của hai số sao cho tổng của chúng bằng \`target\`.

**Ví dụ:**
- Input: \`nums = [2, 7, 11, 15], target = 9\`
- Output: \`[0, 1]\` (vì nums[0] + nums[1] == 9)`,
    initialCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', fnCall: (fn) => fn([2, 7, 11, 15], 9) },
      { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', fnCall: (fn) => fn([3, 2, 4], 6) },
      { input: 'nums = [3, 3], target = 6', expected: '[0, 1]', fnCall: (fn) => fn([3, 3], 6) },
    ]
  },
  {
    id: 'reverse-string',
    title: 'Reverse String (Đảo ngược chuỗi)',
    difficulty: 'Easy',
    points: 80,
    tags: ['String', 'Two Pointers'],
    description: `Viết hàm nhận vào một chuỗi \`str\` và trả về chuỗi đảo ngược của nó mà không làm biến đổi chuỗi gốc.

**Ví dụ:**
- Input: \`"hello"\` -> Output: \`"olleh"\`
- Input: \`"EduViet"\` -> Output: \`"teivudE"\``,
    initialCode: `function reverseString(str) {
  // Hãy viết mã nguồn của bạn ở đây
  return str.split('').reverse().join('');
}`,
    testCases: [
      { input: 'str = "hello"', expected: '"olleh"', fnCall: (fn) => fn("hello") },
      { input: 'str = "EduViet"', expected: '"teivudE"', fnCall: (fn) => fn("EduViet") },
      { input: 'str = "reactjs"', expected: '"sjctaer"', fnCall: (fn) => fn("reactjs") },
    ]
  },
  {
    id: 'fizz-buzz',
    title: 'FizzBuzz Classic',
    difficulty: 'Easy',
    points: 70,
    tags: ['Math', 'Conditions'],
    description: `Viết hàm \`fizzBuzz(n)\` trả về mảng các chuỗi từ 1 đến n:
- Chia hết cho 3: "Fizz"
- Chia hết cho 5: "Buzz"
- Chia hết cho cả 3 và 5: "FizzBuzz"
- Còn lại: số đó dưới dạng chuỗi`,
    initialCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i.toString());
  }
  return result;
}`,
    testCases: [
      { input: 'n = 5', expected: '["1","2","Fizz","4","Buzz"]', fnCall: (fn) => fn(5) },
      { input: 'n = 3', expected: '["1","2","Fizz"]', fnCall: (fn) => fn(3) },
    ]
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome (Chuỗi đối xứng)',
    difficulty: 'Easy',
    points: 90,
    tags: ['Two Pointers', 'String Processing'],
    description: `Kiểm tra xem chuỗi \`s\` sau khi loại bỏ ký tự đặc biệt, dấu cách và chuyển về chữ thường có phải là chuỗi đối xứng (đọc xuôi ngược như nhau) hay không.
    
**Ví dụ:**
- Input: \`"A man, a plan, a canal: Panama"\` -> Output: \`true\`
- Input: \`"race a car"\` -> Output: \`false\``,
    initialCode: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expected: 'true', fnCall: (fn) => fn("A man, a plan, a canal: Panama") },
      { input: 's = "race a car"', expected: 'false', fnCall: (fn) => fn("race a car") },
      { input: 's = " "', expected: 'true', fnCall: (fn) => fn(" ") },
    ]
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Thuật toán Kadane)',
    difficulty: 'Medium',
    points: 150,
    tags: ['Dynamic Programming', 'Array', 'FAANG'],
    description: `Cho một mảng các số nguyên \`nums\`, hãy tìm dãy con liên tiếp có tổng lớn nhất và trả về giá trị tổng đó.
    
**Ví dụ:**
- Input: \`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\` -> Output: \`6\` (dãy \`[4, -1, 2, 1]\` có tổng 6)`,
    initialCode: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`,
    testCases: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6', fnCall: (fn) => fn([-2, 1, -3, 4, -1, 2, 1, -5, 4]) },
      { input: 'nums = [1]', expected: '1', fnCall: (fn) => fn([1]) },
      { input: 'nums = [5, 4, -1, 7, 8]', expected: '23', fnCall: (fn) => fn([5, 4, -1, 7, 8]) },
    ]
  }
];

// Bộ đề trắc nghiệm lập trình (Technical Quiz)
const TECH_QUIZZES = [
  {
    id: 1,
    category: 'React & Frontend',
    question: 'Trong React, Hook nào được dùng để thực thi Side-effects (như gọi API, lắng nghe event DOM)?',
    options: ['useState', 'useEffect', 'useMemo', 'useReducer'],
    correct: 1,
    explain: '`useEffect` được sinh ra để quản lý các side effects như Fetch data, Timer, Subscription trong functional components.'
  },
  {
    id: 2,
    category: 'JavaScript Core',
    question: 'Kết quả của biểu thức: `typeof null` trong JavaScript là gì?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correct: 2,
    explain: 'Đây là một bug lịch sử nổi tiếng từ phiên bản JS đầu tiên, `typeof null` luôn trả về chuỗi "object".'
  },
  {
    id: 3,
    category: 'NestJS & Backend',
    question: 'Nguyên lý thiết kế cốt lõi nào cho phép NestJS tự động tiêm các dependencies vào controller và service?',
    options: ['Dependency Injection (DI) & IoC', 'Singleton Design Pattern', 'Observer Pattern', 'MVC Pattern'],
    correct: 0,
    explain: 'NestJS xây dựng xoay quanh Inversion of Control (IoC) container và Dependency Injection giúp code dễ test và module hóa cao.'
  },
  {
    id: 4,
    category: 'Database & MySQL',
    question: 'Để tăng tốc độ truy vấn SELECT trên các cột thường xuyên được đưa vào mệnh đề WHERE, ta nên sử dụng kĩ thuật gì?',
    options: ['Tạo INDEX (Chỉ mục B-Tree)', 'Chuyển sang FOREIGN KEY', 'Thêm ràng buộc UNIQUE', 'Chia nhỏ bảng thành nhiều database'],
    correct: 0,
    explain: 'Index giúp cơ sở dữ liệu tìm kiếm dữ liệu theo cây B-Tree thay vì phải duyệt toàn bộ bảng (Full Table Scan).'
  },
  {
    id: 5,
    category: 'DevOps & Docker',
    question: 'Lệnh Docker nào dùng để khởi động toàn bộ cụm dịch vụ (Web, Database, Redis) được định nghĩa trong file docker-compose.yml ở chế độ ngầm?',
    options: ['docker-compose up -d', 'docker run -d', 'docker-compose start --all', 'docker build -t app .'],
    correct: 0,
    explain: 'Tham số `-d` (detached mode) cho phép Docker Compose chạy các container trong background mà không chiếm giữ terminal.'
  },
  {
    id: 6,
    category: 'AI & Machine Learning',
    question: 'Trong kiến trúc ứng dụng RAG (Retrieval-Augmented Generation), thành phần nào chịu trách nhiệm lưu trữ và tìm kiếm vector tương đồng ngữ nghĩa?',
    options: ['Vector Database (Chroma, Pinecone, Milvus)', 'Redis Cache Key-Value', 'Relational MySQL Table', 'Elasticsearch Fulltext'],
    correct: 0,
    explain: 'Vector Database chuyên dụng lưu trữ các Vector Embeddings từ văn bản và cho phép tìm kiếm theo Cosine Similarity cực nhanh.'
  }
];

export default function CodeArena() {
  const [activeTab, setActiveTab] = useState('coding');
  
  // Trạng thái Code Challenge
  const [selectedChallenge, setSelectedChallenge] = useState(CODING_CHALLENGES[0]);
  const [userCode, setUserCode] = useState(CODING_CHALLENGES[0].initialCode);
  const [testResults, setTestResults] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('// Trình biên dịch EduViet JS Engine sẵn sàng.\n// Bấm "Chạy Thử Code" hoặc "Chấm Toàn Bộ Test" để kiểm tra.');
  const [isRunning, setIsRunning] = useState(false);

  // Trạng thái Quiz Trắc Nghiệm
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectChallenge = (ch) => {
    setSelectedChallenge(ch);
    setUserCode(ch.initialCode);
    setTestResults(null);
    setTerminalOutput(`// Đã chuyển sang thử thách: ${ch.title}\n// Hãy hoàn thiện code và bấm Chạy thử.`);
  };

  // Thực thi và chấm mã nguồn trực tiếp
  const runCodeTests = () => {
    setIsRunning(true);
    setTerminalOutput('Đang biên dịch và thực thi trên Web Sandbox...\n');

    setTimeout(() => {
      try {
        // Safe evaluation of the function in sandbox scope
        const evalFunction = new Function(`${userCode}; return ${selectedChallenge.id === 'two-sum' ? 'twoSum' : selectedChallenge.id === 'reverse-string' ? 'reverseString' : 'fizzBuzz'};`)();

        let allPassed = true;
        const results = selectedChallenge.testCases.map((tc, idx) => {
          try {
            const actual = tc.fnCall(evalFunction);
            const actualStr = JSON.stringify(actual);
            const passed = actualStr === tc.expected;
            if (!passed) allPassed = false;
            return {
              id: idx + 1,
              input: tc.input,
              expected: tc.expected,
              actual: actualStr,
              passed
            };
          } catch (err) {
            allPassed = false;
            return {
              id: idx + 1,
              input: tc.input,
              expected: tc.expected,
              actual: `Lỗi: ${err.message}`,
              passed: false
            };
          }
        });

        setTestResults(results);
        if (allPassed) {
          setTerminalOutput(`🎉 XUẤT SẮC! Toàn bộ ${results.length}/${results.length} Test cases đã vượt qua!\nĐiểm thưởng: +${selectedChallenge.points} XP vào hồ sơ lập trình viên EduViet.`);
        } else {
          setTerminalOutput(`⚠️ Có một số test case chưa vượt qua. Vui lòng kiểm tra lại logic và biên dịch lại.`);
        }
      } catch (err) {
        setTestResults([]);
        setTerminalOutput(`❌ Lỗi biên dịch JavaScript (SyntaxError / TypeError):\n${err.message}`);
      }
      setIsRunning(false);
    }, 400);
  };

  // Nộp bài thi trắc nghiệm
  const handleAnswerQuiz = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const submitQuiz = () => {
    let score = 0;
    TECH_QUIZZES.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        score += 25;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="app-container py-4 page-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold mb-2">
            <i className="bi bi-cpu-fill me-1"></i> SÂN CHƠI CODE THỰC CHIẾN
          </span>
          <h2 className="fw-bold mb-1">
            EduViet Code Arena & Đánh Giá Năng Lực
          </h2>
          <p className="text-secondary small mb-0">
            Luyện tập thuật toán trực tiếp, chấm điểm theo thời gian thực và kiểm tra kiến thức Fullstack.
          </p>
        </div>
      </div>

      {/* Tabs điều hướng */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="bg-white p-2 rounded-4 border shadow-sm mb-4">
          <Nav.Item>
            <Nav.Link eventKey="coding" className="fw-bold px-4 py-2">
              <i className="bi bi-terminal-fill me-2"></i> Luyện Code Trực Tuyến (Live Compiler)
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="quiz" className="fw-bold px-4 py-2">
              <i className="bi bi-question-diamond-fill me-2"></i> Test Trắc Nghiệm Tech Stack (Quiz)
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* TAB 1: LIVE CODE ARENA */}
          <Tab.Pane eventKey="coding">
            <Row className="g-4">
              {/* Danh sách bài tập bên trái */}
              <Col lg={4}>
                <Card className="border-0 rounded-4 shadow-sm h-100">
                  <Card.Header className="bg-white border-0 pt-3 pb-0">
                    <h5 className="fw-bold mb-0">Danh Sách Thử Thách</h5>
                    <p className="text-muted small">Chọn thử thách để bắt đầu giải code</p>
                  </Card.Header>
                  <Card.Body className="p-3">
                    <div className="d-flex flex-column gap-2">
                      {CODING_CHALLENGES.map((ch) => (
                        <div
                          key={ch.id}
                          className={`p-3 rounded-3 border cursor-pointer transition-all ${
                            selectedChallenge.id === ch.id
                              ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                              : 'hover-lift bg-white'
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectChallenge(ch)}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong className="fs-6 text-dark">{ch.title}</strong>
                            <Badge bg="success">{ch.difficulty}</Badge>
                          </div>
                          <div className="d-flex gap-1 flex-wrap mb-2">
                            {ch.tags.map((t, idx) => (
                              <span key={idx} className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="text-primary small fw-bold">
                            <i className="bi bi-star-fill text-warning me-1"></i> +{ch.points} XP
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-light rounded-3">
                      <h6 className="fw-bold text-dark mb-2">
                        <i className="bi bi-journal-text text-primary me-2"></i>Mô tả đề bài:
                      </h6>
                      <div className="small text-secondary" style={{ whiteSpace: 'pre-line' }}>
                        {selectedChallenge.description}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Trình soạn thảo Code và Terminal bên phải */}
              <Col lg={8}>
                <div className="code-playground p-3 p-md-4">
                  {/* Thanh tiêu đề IDE */}
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-secondary mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-danger rounded-circle p-1" style={{ width: 10, height: 10 }}> </span>
                      <span className="badge bg-warning rounded-circle p-1" style={{ width: 10, height: 10 }}> </span>
                      <span className="badge bg-success rounded-circle p-1" style={{ width: 10, height: 10 }}> </span>
                      <span className="font-monospace small ms-2 text-info fw-bold">
                        <i className="bi bi-filetype-js me-1"></i>solution.js
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="text-white border-secondary"
                        onClick={() => setUserCode(selectedChallenge.initialCode)}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="fw-bold px-3"
                        onClick={runCodeTests}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Đang chạy...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-play-fill me-1"></i> Chạy & Chấm Điểm
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Vùng gõ code */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={12}
                      className="code-editor-textarea w-100"
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      spellCheck="false"
                    />
                  </Form.Group>

                  {/* Cửa sổ Terminal kết quả */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                      <span className="font-monospace">
                        <i className="bi bi-terminal me-1"></i>EduViet Compiler Output:
                      </span>
                    </div>
                    <div className="terminal-window">
                      {terminalOutput}
                    </div>
                  </div>

                  {/* Bảng kết quả từng Test Case */}
                  {testResults && testResults.length > 0 && (
                    <div className="bg-dark p-3 rounded-3 border border-secondary">
                      <h6 className="text-white fw-bold mb-3">
                        <i className="bi bi-check2-all text-primary me-2"></i>Kết Quả Test Cases:
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {testResults.map((tc) => (
                          <div
                            key={tc.id}
                            className={`p-2 rounded-2 d-flex justify-content-between align-items-center small font-monospace ${
                              tc.passed ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'
                            }`}
                          >
                            <div>
                              <strong className="me-2">Test #{tc.id}:</strong>
                              <span>{tc.input}</span>
                            </div>
                            <div>
                              {tc.passed ? (
                                <Badge bg="success">PASSED</Badge>
                              ) : (
                                <span className="badge bg-danger">
                                  FAILED (Nhận: {tc.actual})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Tab.Pane>

          {/* TAB 2: TECHNICAL QUIZ TEST */}
          <Tab.Pane eventKey="quiz">
            <Card className="border-0 rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                  <h4 className="fw-bold mb-1">Đánh Giá Năng Lực Lập Trình Viên Toàn Diện</h4>
                  <p className="text-secondary small mb-0">Trả lời các câu hỏi để kiểm tra kiến thức nền tảng trước phỏng vấn</p>
                </div>
                {quizSubmitted && (
                  <div className="text-end">
                    <span className="fs-5 fw-bold text-primary">Điểm của bạn: {quizScore}/100</span>
                    <Badge bg={quizScore >= 75 ? 'success' : 'warning'} className="d-block mt-1">
                      {quizScore >= 75 ? 'Đạt chuẩn đầu ra' : 'Cần trau dồi thêm'}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="d-flex flex-column gap-4">
                {TECH_QUIZZES.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary-subtle text-primary fw-bold">Câu {idx + 1} • {q.category}</span>
                    </div>
                    <h5 className="fs-6 fw-bold mb-3">{q.question}</h5>

                    <Row className="g-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;

                        let btnClass = 'btn-outline-secondary text-dark bg-white';
                        if (quizSubmitted) {
                          if (isCorrect) btnClass = 'btn-success text-white fw-bold';
                          else if (isSelected && !isCorrect) btnClass = 'btn-danger text-white';
                        } else if (isSelected) {
                          btnClass = 'btn-primary text-white fw-bold';
                        }

                        return (
                          <Col md={6} key={optIdx}>
                            <Button
                              variant="light"
                              className={`w-100 quiz-option-btn border p-3 ${btnClass}`}
                              onClick={() => handleAnswerQuiz(q.id, optIdx)}
                              disabled={quizSubmitted}
                            >
                              <span className="fw-bold me-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </Button>
                          </Col>
                        );
                      })}
                    </Row>

                    {quizSubmitted && (
                      <div className="mt-3 p-3 bg-white rounded-3 border-start border-4 border-info small">
                        <strong className="text-info d-block mb-1">
                          <i className="bi bi-lightbulb-fill me-1"></i> Giải thích chi tiết:
                        </strong>
                        <span className="text-secondary">{q.explain}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={resetQuiz}
                  className="fw-semibold"
                >
                  Làm lại từ đầu
                </Button>

                {!quizSubmitted ? (
                  <Button
                    variant="primary"
                    className="fw-bold px-4 py-2"
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < TECH_QUIZZES.length}
                  >
                    Nộp Bài Đánh Giá ({Object.keys(quizAnswers).length}/{TECH_QUIZZES.length})
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    className="fw-bold px-4"
                    onClick={() => alert(`Chúc mừng! Kết quả ${quizScore}/100 đã được lưu vào hồ sơ học viên của bạn!`)}
                  >
                    Lưu Kết Quả Vào Hồ Sơ
                  </Button>
                )}
              </div>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
