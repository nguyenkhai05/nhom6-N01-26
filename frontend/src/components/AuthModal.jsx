import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { apiLogin, apiGoogleLogin, apiRegister, saveToken, toFrontendUser, DEFAULT_AVATAR } from '../services/auth';

export default function AuthModal({
  show,
  onHide,
  initialMode = 'login',
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTarget, setRegTarget] = useState('Frontend Web Engineer');
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
    setLoading(false);
  };

  // Mỗi lần mở modal: về đúng tab được yêu cầu và xóa trạng thái cũ
  useEffect(() => {
    if (show) {
      setMode(initialMode);
      resetForms();
    }
  }, [show, initialMode]);

  const handleTabChange = (k) => {
    setMode(k);
    resetForms();
  };

  // Đăng nhập: gửi email + mật khẩu lên POST /auth/login, nhận token và thông tin người dùng
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const email = loginEmail.trim();
    if (!email || !loginPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const { access_token, user } = await apiLogin(email, loginPassword);
      saveToken(access_token, rememberMe);
      const frontendUser = toFrontendUser(user);

      setSuccessMsg(
        frontendUser.role === 'ADMIN'
          ? 'Đăng nhập Quản trị viên thành công! Đang chuyển hướng...'
          : 'Đăng nhập thành công!'
      );
      setTimeout(() => {
        onLoginSuccess(frontendUser);
        onHide();
        resetForms();
      }, 500);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  // Đăng nhập nhanh với Google OAuth (Không dùng window.prompt gây lỗi trình duyệt)
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Ưu tiên email người dùng đã gõ trong ô 'Email *' ở trên, nếu chưa nhập thì dùng tài khoản Google học viên
      const emailInput = loginForm.email?.trim() || '';
      const emailToUse = (emailInput && emailInput.includes('@'))
        ? emailInput.toLowerCase()
        : 'student.google@phenikaa-uni.edu.vn';

      const rawName = emailToUse.split('@')[0].replace(/[\._]/g, ' ');
      const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Học viên Google';

      const googleUser = {
        email: emailToUse,
        full_name: formattedName,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      };

      const { access_token, user } = await apiGoogleLogin(googleUser);
      saveToken(access_token, rememberMe);
      const frontendUser = toFrontendUser(user);

      setSuccessMsg(`Đăng nhập Google thành công: ${googleUser.email}`);
      setTimeout(() => {
        onLoginSuccess(frontendUser);
        onHide();
        resetForms();
      }, 400);
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập Google thất bại');
      setLoading(false);
    }
  };

  // Bước 1 của đăng ký: kiểm tra dữ liệu nhập rồi chuyển sang bảng xác nhận
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*).');
      return;
    }

    // Quy tắc mật khẩu phải khớp backend (RegisterDto: 8–72 ký tự)
    if (regPassword.length < 8) {
      setErrorMsg('Mật khẩu tối thiểu phải từ 8 ký tự.');
      return;
    }

    if (regPassword.length > 72) {
      setErrorMsg('Mật khẩu tối đa 72 ký tự.');
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

    // Chỉ giữ thông tin hiển thị ở bảng xác nhận. Mật khẩu vẫn nằm ở state regPassword,
    // không đưa vào đối tượng này và không lưu ở bất kỳ đâu.
    setPendingStudent({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || 'Chưa cập nhật',
      targetTrack: regTarget,
    });
    setShowConfirmStep(true);
  };

  // Bước 2: gọi POST /auth/register. Vai trò luôn do máy chủ đặt là Student.
  const handleFinalConfirmRegister = async () => {
    if (!pendingStudent) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const { access_token, user } = await apiRegister({
        full_name: pendingStudent.fullName,
        email: pendingStudent.email,
        password: regPassword,
      });
      saveToken(access_token, true);

      // Ví, số điện thoại, mục tiêu học tập là dữ liệu giả lập ở frontend (backend chưa có)
      const frontendUser = toFrontendUser(user, {
        phone: pendingStudent.phone,
        bio: `Mục tiêu nghề nghiệp: ${pendingStudent.targetTrack}`,
        targetTrack: pendingStudent.targetTrack,
        walletBalance: 1000000, // Quà tặng chào mừng 1.000.000đ
        enrolledCourses: [],
        joinDate: new Date().toLocaleDateString('vi-VN'),
      });

      // Đăng nhập ngay sau khi đăng ký; App sẽ ghi nhận quà tặng khi isNew = true
      onLoginSuccess(frontendUser, { isNew: true });
      setRegisteredStudentData(frontendUser);
      setIsRegisterSuccess(true);
      setShowConfirmStep(false);
    } catch (err) {
      // Ví dụ 409 "Email đã được đăng ký": quay lại biểu mẫu để sửa
      setErrorMsg(err.message);
      setShowConfirmStep(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishRegisterCelebration = () => {
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
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email *</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Nhập email của bạn..."
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
                    alert('Tính năng khôi phục mật khẩu chưa được hỗ trợ. Vui lòng liên hệ quản trị viên để được cấp lại.');
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
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 fw-bold py-2 mb-3 shadow-sm"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Ngay'}
            </Button>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1 text-muted" />
              <span className="px-2 small text-muted">HOẶC</span>
              <hr className="flex-grow-1 text-muted" />
            </div>

            <Button
              type="button"
              variant="outline-dark"
              className="w-100 fw-bold py-2 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2 border-secondary-subtle bg-white hover-shadow"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Đăng nhập nhanh với Google</span>
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
                    src={DEFAULT_AVATAR}
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
                        {'•'.repeat(Math.min(regPassword.length, 12))} ({regPassword.length} ký tự, máy chủ băm bằng scrypt)
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 bg-white rounded-3 border">
                      <span className="text-muted d-block small">Mã định danh Student ID:</span>
                      <strong className="text-secondary font-monospace">Cấp sau khi kích hoạt</strong>
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
                  disabled={loading}
                >
                  <i className="bi bi-check2-circle me-1"></i> {loading ? 'Đang tạo tài khoản...' : 'Đồng Ý & Kích Hoạt Tài Khoản'}
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
                    STU-{String(registeredStudentData.userId).padStart(6, '0')}
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
                      placeholder="Tối thiểu 8 ký tự"
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

