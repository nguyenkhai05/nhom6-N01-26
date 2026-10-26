import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, InputGroup, Tabs, Tab } from 'react-bootstrap';

export default function AuthModal({
  show,
  onHide,
  initialMode = 'login',
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [roleMode, setRoleMode] = useState('student'); // 'student' | 'admin'

  useEffect(() => {
    if (show) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [show, initialMode]);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTarget, setRegTarget] = useState('Frontend');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Bảng xác nhận đăng ký (Confirmation Step)
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [registeredStudentData, setRegisteredStudentData] = useState(null);

  // Alert error/success
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForms = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoginPassword('');
    setRegPassword('');
    setRegConfirmPassword('');
    setShowConfirmStep(false);
    setPendingStudent(null);
    setIsRegisterSuccess(false);
    setRegisteredStudentData(null);
  };

  const handleTabChange = (k) => {
    setMode(k);
    resetForms();
  };

  const handleQuickFillAdmin = () => {
    setLoginEmail('admin');
    setLoginPassword('Eduenglish123');
    setRoleMode('admin');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailTrimmed = loginEmail.trim();

    // 1. Singleton Admin check: admin / Eduenglish123 (theo kiến trúc EduEnglish Master Template)
    if (
      (emailTrimmed === 'admin' || emailTrimmed === 'admin@eduviet.vn') &&
      loginPassword === 'Eduenglish123'
    ) {
      const adminUser = {
        userId: 1,
        fullName: 'Quản Trị Viên EduViet',
        email: 'admin@eduviet.vn',
        phone: '0988.888.999',
        role: 'ADMIN',
        walletBalance: 999999999,
        enrolledCourses: [1, 2, 3, 4, 5, 6],
        bio: 'Quản trị viên kỹ thuật tối cao của hệ sinh thái EduViet.',
        targetTrack: 'Fullstack Enterprise Architecture',
        joinDate: '01/01/2026',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };

      setSuccessMsg('Đăng nhập Quản trị viên thành công! Đang chuyển hướng...');
      setTimeout(() => {
        onLoginSuccess(adminUser);
        onHide();
        resetForms();
      }, 500);
      return;
    }

    // 2. Học viên đăng nhập
    if (emailTrimmed && loginPassword) {
      if (emailTrimmed.toLowerCase().includes('admin') && loginPassword !== 'Eduenglish123') {
        setErrorMsg('Sai mật khẩu tài khoản Quản trị viên!');
        return;
      }

      if (loginPassword.length < 6) {
        setErrorMsg('Mật khẩu phải từ 6 ký tự trở lên.');
        return;
      }

      // Lấy thông tin user đã lưu hoặc tạo mới
      const existingUsers = JSON.parse(localStorage.getItem('eduviet_registered_users') || '[]');
      const found = existingUsers.find(
        (u) => u.email.toLowerCase() === emailTrimmed.toLowerCase() && u.password === loginPassword
      );

      let studentUser;
      if (found) {
        studentUser = {
          userId: found.userId,
          fullName: found.fullName,
          email: found.email,
          phone: found.phone || '0912.345.678',
          role: 'USER',
          walletBalance: found.walletBalance || 1000000,
          enrolledCourses: found.enrolledCourses || [],
          bio: found.bio || 'Học viên đam mê chinh phục công nghệ lập trình.',
          targetTrack: found.targetTrack || 'Frontend Web Engineer',
          joinDate: found.joinDate || 'Hôm nay',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        };
      } else {
        studentUser = {
          userId: Date.now(),
          fullName: emailTrimmed.split('@')[0].toUpperCase() || 'Học Viên EduViet',
          email: emailTrimmed,
          phone: '0912.345.678',
          role: 'USER',
          walletBalance: 1500000, // Tặng sẵn trải nghiệm
          enrolledCourses: [],
          bio: 'Học viên mới tham gia EduViet.',
          targetTrack: 'Fullstack Web Engineer',
          joinDate: 'Hôm nay',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        };
      }

      setSuccessMsg('Đăng nhập học viên thành công!');
      setTimeout(() => {
        onLoginSuccess(studentUser);
        onHide();
        resetForms();
      }, 500);
    } else {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin email và mật khẩu.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Rule: Tuyệt đối cấm đăng ký quyền Admin
    if (regEmail.toLowerCase().includes('admin')) {
      setErrorMsg('Nghiêm cấm đăng ký tài khoản Quản trị viên qua biểu mẫu này!');
      return;
    }

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu phải từ 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Bạn cần đồng ý với Điều khoản & Chính sách của EduViet để tiếp tục.');
      return;
    }

    // Chuẩn bị thông tin tài khoản và chuyển sang Bảng Xác Nhận
    const candidateStudent = {
      userId: Date.now(),
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || 'Chưa cập nhật',
      password: regPassword,
      role: 'USER',
      walletBalance: 1000000, // Quà tặng chào mừng 1.000.000đ
      enrolledCourses: [],
      bio: `Mục tiêu nghề nghiệp: ${regTarget}`,
      targetTrack: regTarget,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    setPendingStudent(candidateStudent);
    setShowConfirmStep(true);
  };

  const handleFinalConfirmRegister = () => {
    if (!pendingStudent) return;

    // Lưu vào database giả lập LocalStorage
    const existingUsers = JSON.parse(localStorage.getItem('eduviet_registered_users') || '[]');
    existingUsers.push(pendingStudent);
    localStorage.setItem('eduviet_registered_users', JSON.stringify(existingUsers));

    setRegisteredStudentData(pendingStudent);
    setIsRegisterSuccess(true);
    setShowConfirmStep(false);
  };

  const handleFinishRegisterCelebration = () => {
    if (registeredStudentData) {
      onLoginSuccess(registeredStudentData);
    }
    onHide();
    resetForms();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size={showConfirmStep || isRegisterSuccess ? 'lg' : 'md'}
      className="auth-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-2">
          <span className="brand-badge" style={{ width: 34, height: 34, fontSize: '1.05rem' }}>
            <i className="bi bi-code-slash"></i>
          </span>
          <h5 className="fw-bold mb-0">EduViet Authentication</h5>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-2 pb-4 px-4">
        {/* Navigation Tabs */}
        <div className="d-flex bg-light p-1 rounded-4 mb-4 mt-2 border">
          <button
            type="button"
            className={`btn flex-grow-1 fw-bold rounded-3 py-2 ${
              mode === 'login' ? 'btn-white bg-white shadow-sm text-primary' : 'text-secondary border-0 bg-transparent'
            }`}
            onClick={() => handleTabChange('login')}
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập
          </button>
          <button
            type="button"
            className={`btn flex-grow-1 fw-bold rounded-3 py-2 ${
              mode === 'register' ? 'btn-white bg-white shadow-sm text-primary' : 'text-secondary border-0 bg-transparent'
            }`}
            onClick={() => handleTabChange('register')}
          >
            <i className="bi bi-person-plus me-1"></i> Đăng Ký Học Viên
          </button>
        </div>

        {errorMsg && (
          <Alert variant="danger" className="py-2 small rounded-3 border-0 shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success" className="py-2 small rounded-3 border-0 shadow-sm">
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMsg}
          </Alert>
        )}

        {/* FORM ĐĂNG NHẬP */}
        {mode === 'login' && (
          <Form onSubmit={handleLoginSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted fw-semibold">Bạn đăng nhập với vai trò:</span>
              <div className="d-flex gap-1">
                <Button
                  size="sm"
                  variant={roleMode === 'student' ? 'primary' : 'outline-secondary'}
                  className="rounded-pill py-0 px-2 fw-semibold"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setRoleMode('student')}
                >
                  Học viên
                </Button>
                <Button
                  size="sm"
                  variant={roleMode === 'admin' ? 'danger' : 'outline-secondary'}
                  className="rounded-pill py-0 px-2 fw-semibold"
                  style={{ fontSize: '0.75rem' }}
                  onClick={handleQuickFillAdmin}
                >
                  Quản trị viên (Admin)
                </Button>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email hoặc Tên đăng nhập *</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nhập email học viên hoặc 'admin'..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="small fw-bold mb-0">Mật khẩu *</Form.Label>
                <a
                  href="#forgot"
                  className="small text-decoration-none text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Hệ thống đã gửi liên kết khôi phục mật khẩu đến email của bạn!');
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="border-start-0 border-end-0"
                  required
                />
                <Button
                  variant="light"
                  className="border border-start-0 text-muted"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  <i className={`bi ${showLoginPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check
                type="checkbox"
                id="rememberMeCheck"
                label="Ghi nhớ đăng nhập"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="small text-secondary"
              />
              {roleMode === 'admin' && (
                <span className="badge bg-danger-subtle text-danger small">
                  Tài khoản Admin: admin | Eduenglish123
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant={roleMode === 'admin' ? 'danger' : 'primary'}
              className="w-100 fw-bold py-2 mb-3 shadow-sm"
            >
              {roleMode === 'admin' ? 'Đăng Nhập Quản Trị Viên' : 'Đăng Nhập Ngay'}
            </Button>

            <div className="text-center">
              <span className="small text-muted">Chưa có tài khoản học tập? </span>
              <button
                type="button"
                className="btn btn-link p-0 small fw-bold text-decoration-none"
                onClick={() => handleTabChange('register')}
              >
                Đăng ký nhận 1.000.000đ ngay
              </button>
            </div>
          </Form>
        )}

        {/* FORM ĐĂNG KÝ HỌC VIÊN */}
        {mode === 'register' && (
          showConfirmStep && pendingStudent ? (
            /* BẢNG XÁC NHẬN THÔNG TIN ĐĂNG KÝ CHI TIẾT */
            <div className="registration-confirm-panel page-fade-in">
              <div className="text-center mb-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
                  <i className="bi bi-shield-check me-1"></i> BƯỚC 2: XÁC NHẬN HỒ SƠ HỌC VIÊN
                </span>
                <h4 className="fw-bold text-dark mb-1">Rà Soát Chi Tiết Thông Tin Kích Hoạt</h4>
                <p className="text-secondary small mb-0">
                  Vui lòng kiểm tra kỹ lưỡng các thông số định danh học viên bên dưới trước khi khởi tạo tài khoản trên EduViet Platform.
                </p>
              </div>

              {/* Thẻ tóm tắt hồ sơ & Avatar mặc định */}
              <div className="p-3 bg-light rounded-4 border mb-3">
                <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
                  <img
                    src={pendingStudent.avatarUrl}
                    alt="Student Avatar"
                    className="rounded-circle border border-2 border-primary shadow-sm"
                    style={{ width: 56, height: 56, objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{pendingStudent.fullName}</h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle me-2">
                      <i className="bi bi-check-circle-fill me-1"></i> Học Viên Chính Thức
                    </span>
                    <span className="badge bg-info-subtle text-info border border-info-subtle">
                      <i className="bi bi-mortarboard-fill me-1"></i> {pendingStudent.targetTrack}
                    </span>
                  </div>
                </div>

                <h6 className="fw-bold text-dark small mb-2">
                  <i className="bi bi-card-checklist text-primary me-2"></i>
                  Thông Số Định Danh Học Viên
                </h6>

                <div className="row g-2 small">
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Họ và tên học viên:</span>
                      <strong className="text-dark">{pendingStudent.fullName}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Email đăng nhập & nhận bài:</span>
                      <strong className="text-primary font-monospace">{pendingStudent.email}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Số điện thoại liên hệ:</span>
                      <strong className="text-dark font-monospace">{pendingStudent.phone}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Thời điểm khởi tạo:</span>
                      <strong className="text-dark">{new Date().toLocaleString('vi-VN')}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Mật khẩu bảo vệ:</span>
                      <span className="font-monospace text-secondary">
                        {'•'.repeat(Math.min(pendingStudent.password.length, 12))} ({pendingStudent.password.length} ký tự, mã hóa SHA-256)
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Mã định danh Student ID:</span>
                      <strong className="text-secondary font-monospace">STU-{String(pendingStudent.userId).slice(-6)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quyền lợi thành viên & Gói quà tặng */}
              <div className="p-3 border rounded-4 bg-white mb-3 shadow-xs">
                <h6 className="fw-bold text-dark small mb-2">
                  <i className="bi bi-stars text-warning me-2"></i>
                  Gói Quyền Lợi Thành Viên Được Kích Hoạt Tức Thì
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th className="py-2 ps-2">Quyền lợi dành cho học viên</th>
                        <th className="py-2 text-center">Trạng thái</th>
                        <th className="py-2 text-end pe-2">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-2 py-2">
                          <strong className="text-dark">Ví học tập EduViet (Tặng sẵn):</strong>
                          <div className="text-muted small">Dùng thanh toán mọi khóa học trên hệ thống</div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-success-subtle text-success">Cộng ngay</span>
                        </td>
                        <td className="text-end pe-2 font-monospace fw-bold text-success fs-6">
                          +1.000.000 đ
                        </td>
                      </tr>
                      <tr>
                        <td className="ps-2 py-2">
                          <strong className="text-dark">Luyện thuật toán tương tác (Code Arena):</strong>
                          <div className="text-muted small">Truy cập không giới hạn đề thi thuật toán & interview</div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary-subtle text-primary">Mở khóa</span>
                        </td>
                        <td className="text-end pe-2 font-monospace text-muted">
                          Miễn phí trọn đời
                        </td>
                      </tr>
                      <tr>
                        <td className="ps-2 py-2">
                          <strong className="text-dark">Cố vấn giải đáp kỹ thuật qua Chatbot AI 24/7:</strong>
                          <div className="text-muted small">Hỗ trợ debug code và giải thích kiến thức trực tuyến</div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary-subtle text-primary">Kích hoạt</span>
                        </td>
                        <td className="text-end pe-2 font-monospace text-muted">
                          Không giới hạn
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cam kết pháp lý & Bảo mật */}
              <div className="p-3 bg-light rounded-3 small text-muted border mb-3">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-shield-lock-fill text-success me-1"></i> Cam Kết Bảo Mật Thông Tin Cá Nhân:
                </div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-check2 text-success fw-bold"></i>
                  <span>Thông tin học viên được bảo mật chuẩn mã hóa SSL/TLS, tuyệt đối không chia sẻ cho bên thứ ba.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check2 text-success fw-bold"></i>
                  <span>Bạn có thể chỉnh sửa thông tin hồ sơ cá nhân và đổi mật khẩu bất kỳ lúc nào trong mục Quản lý hồ sơ.</span>
                </div>
              </div>

              {/* 2 nút hành động: Sửa lại hoặc Xác nhận */}
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="w-50 fw-semibold rounded-pill py-2"
                  onClick={() => setShowConfirmStep(false)}
                >
                  <i className="bi bi-pencil-square me-1"></i> Sửa Lại Thông Tin
                </Button>
                <Button
                  variant="success"
                  className="w-50 fw-bold rounded-pill py-2 shadow-sm"
                  onClick={handleFinalConfirmRegister}
                >
                  <i className="bi bi-check2-circle me-1"></i> Đồng Ý & Kích Hoạt Tài Khoản
                </Button>
              </div>
            </div>
          ) : isRegisterSuccess && registeredStudentData ? (
            /* BẢNG CHÚC MỪNG ĐĂNG KÝ THÀNH CÔNG CHI TIẾT */
            <div className="registration-success-panel text-center page-fade-in py-2">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle shadow-sm"
                style={{ width: 80, height: 80, fontSize: '2.5rem' }}
              >
                <i className="bi bi-check-lg"></i>
              </div>

              <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-bold mb-2">
                <i className="bi bi-award-fill me-1"></i> KÍCH HOẠT HỒ SƠ THÀNH CÔNG 100%
              </span>

              <h3 className="fw-bold text-dark mb-1">
                CHÚC MỪNG HỌC VIÊN {registeredStudentData.fullName.toUpperCase()}!
              </h3>
              <p className="text-secondary small mb-3">
                Chào mừng bạn gia nhập cộng đồng lập trình viên tinh hoa EduViet Platform. Hồ sơ của bạn đã được khởi tạo thành công vào hệ thống.
              </p>

              {/* Thông tin thẻ học viên và quà tặng */}
              <div className="p-3 bg-light rounded-4 border text-start mb-3">
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Mã Học Viên Định Danh:</span>
                  <strong className="text-primary font-monospace fs-6">
                    STU-{String(registeredStudentData.userId).slice(-6)}
                  </strong>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Email Tài Khoản:</span>
                  <strong className="text-dark font-monospace small">
                    {registeredStudentData.email}
                  </strong>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Lộ Trình Đã Chọn:</span>
                  <span className="badge bg-primary text-white">
                    {registeredStudentData.targetTrack}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-1">
                  <div>
                    <span className="fw-bold text-dark d-block">Quà Tặng Thành Viên Mới:</span>
                    <span className="text-muted small">Đã nạp trực tiếp vào ví học tập cá nhân</span>
                  </div>
                  <strong className="text-success fs-4 font-monospace">
                    +1.000.000 đ
                  </strong>
                </div>
              </div>

              {/* Hướng dẫn các bước tiếp theo */}
              <div className="p-3 bg-white border rounded-3 text-start small text-secondary mb-3 shadow-xs">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-compass-fill text-primary me-2"></i>
                  Bạn Có Thể Làm Gì Tiếp Theo?
                </h6>
                <div className="d-flex align-items-center gap-2 mb-1 text-dark">
                  <i className="bi bi-bag-check-fill text-success"></i>
                  <span>Dùng 1.000.000đ trong ví để đăng ký ngay các khóa học chuyên sâu.</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-1 text-dark">
                  <i className="bi bi-code-square text-primary"></i>
                  <span>Tham gia đấu trường thuật toán Code Arena để nâng cao tư duy giải thuật.</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-dark">
                  <i className="bi bi-chat-dots-fill text-info"></i>
                  <span>Trao đổi 1-1 với trợ lý ảo AI nếu có bất kỳ thắc mắc bài học nào.</span>
                </div>
              </div>

              <Button
                variant="success"
                size="lg"
                className="w-100 fw-bold py-2 rounded-pill shadow-sm"
                onClick={handleFinishRegisterCelebration}
              >
                <i className="bi bi-rocket-takeoff-fill me-2"></i> Bắt Đầu Trải Nghiệm Học Tập Ngay
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <div className="alert alert-success border-0 rounded-3 p-2 small mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-gift-fill fs-5 text-success"></i>
                <div>
                  <strong>Ưu đãi độc quyền học viên mới:</strong> Tặng ngay <strong>1.000.000 đ</strong> vào ví học tập khi hoàn tất đăng ký!
                </div>
              </div>

              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Họ và tên đầy đủ *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Dev"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Email Gmail chính xác *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="developer@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="0912.xxx.xxx"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Mục tiêu học tập</Form.Label>
                    <Form.Select
                      value={regTarget}
                      onChange={(e) => setRegTarget(e.target.value)}
                    >
                      <option value="Frontend Web Engineer">Frontend (React/Next)</option>
                      <option value="Backend Cloud Engineer">Backend (NestJS/MySQL)</option>
                      <option value="AI & Data Scientist">AI & Python Data</option>
                      <option value="DevOps Specialist">DevOps & Cloud</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Mật khẩu *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Xác nhận mật khẩu *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Check
                type="checkbox"
                id="agreeTermsCheck"
                label="Tôi đồng ý với Quy chế đào tạo và Chính sách bảo mật thông tin của EduViet"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="small text-secondary mb-3"
              />

              <Button type="submit" variant="primary" className="w-100 fw-bold py-2 mb-3 shadow-sm rounded-pill">
                <i className="bi bi-arrow-right-circle me-1"></i> Tiếp Tục: Xem Bảng Xác Nhận
              </Button>

              <div className="text-center">
                <span className="small text-muted">Đã có tài khoản từ trước? </span>
                <button
                  type="button"
                  className="btn btn-link p-0 small fw-bold text-decoration-none"
                  onClick={() => handleTabChange('login')}
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </Form>
          )
        )}
      </Modal.Body>
    </Modal>
  );
}

