import { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

export default function Header({
  currentUser,
  cartCount = 0,
  onOpenLogin,
  onOpenRegister,
  onOpenDeposit,
  onOpenDepositHistory,
  onLogout,
  currentRoute,
  onNavigate
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom custom-navbar sticky-top">
        <div className="container-fluid px-lg-4">
          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <span className="brand-badge">
              <i className="bi bi-code-slash"></i>
            </span>
            <span className="fw-bold fs-4 text-primary">
              Edu<span className="text-dark">Viet</span>
            </span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
              <li className="nav-item">
                <button
                  className={`nav-link border-0 bg-transparent ${currentRoute === 'home' ? 'active' : ''}`}
                  onClick={() => onNavigate('home')}
                >
                  <i className="bi bi-house-door me-1"></i> Trang chủ
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 bg-transparent ${currentRoute === 'courses' ? 'active' : ''}`}
                  onClick={() => onNavigate('courses')}
                >
                  <i className="bi bi-mortarboard me-1"></i> Khóa học Lập trình
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 bg-transparent ${currentRoute === 'roadmap' ? 'active' : ''}`}
                  onClick={() => onNavigate('roadmap')}
                >
                  <i className="bi bi-signpost-split me-1 text-primary"></i> Lộ trình Frontend/Backend
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 bg-transparent ${currentRoute === 'practice' ? 'active' : ''}`}
                  onClick={() => onNavigate('practice')}
                >
                  <i className="bi bi-terminal me-1 text-success"></i> Luyện Code & Test
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 bg-transparent ${currentRoute === 'docs' ? 'active' : ''}`}
                  onClick={() => onNavigate('docs')}
                >
                  <i className="bi bi-journal-code me-1 text-danger"></i> Tài liệu Dev
                </button>
              </li>
              {currentUser?.role === 'ADMIN' && (
                <li className="nav-item">
                  <button
                    className={`nav-link border-0 bg-transparent text-danger fw-bold ${currentRoute === 'admin' ? 'active' : ''}`}
                    onClick={() => onNavigate('admin')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Quản Trị CSDL
                  </button>
                </li>
              )}
            </ul>

            {/* Giỏ hàng khóa học Button */}
            <div className="d-flex align-items-center me-2">
              <Button
                variant={currentRoute === 'cart' ? 'primary' : 'light'}
                className="position-relative border rounded-pill px-3 py-1 d-flex align-items-center gap-2 fw-semibold shadow-sm"
                onClick={() => onNavigate('cart')}
                title="Xem giỏ hàng khóa học"
              >
                <i className={`bi bi-cart3 fs-5 ${currentRoute === 'cart' ? 'text-white' : 'text-primary'}`}></i>
                <span className="d-none d-sm-inline small">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="badge rounded-pill bg-danger shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Guest Actions */}
            {!currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="px-3 fw-bold"
                  onClick={onOpenLogin}
                >
                  <i className="bi bi-google me-1 text-danger"></i> Đăng nhập Gmail
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="px-3 fw-bold"
                  onClick={onOpenRegister}
                >
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </Button>
              </div>
            ) : (
              /* User/Admin Actions */
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="light"
                  className="border d-flex align-items-center gap-1 me-2"
                  onClick={onOpenDeposit}
                  title="Bấm để nạp tiền vào ví"
                >
                  <i className="bi bi-wallet2 text-success fs-5"></i>
                  <span className="fw-bold text-success small">
                    {Number(currentUser.walletBalance || 0).toLocaleString('vi-VN')} đ
                  </span>
                  <span className="badge bg-success text-white small ms-1">+ Nạp</span>
                </Button>

                <div className="dropdown position-relative" ref={dropdownRef}>
                  <button
                    className={`btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle rounded-pill px-3 py-1 shadow-sm ${
                      dropdownOpen ? 'show border-primary' : ''
                    }`}
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    <i className="bi bi-person-circle fs-5 text-primary"></i>
                    <span className="fw-bold">{currentUser.fullName}</span>
                    <span
                      className={`badge ms-1 ${
                        currentUser.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'
                      }`}
                    >
                      {currentUser.role === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : 'HỌC VIÊN'}
                    </span>
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow-lg user-profile-dropdown-menu ${
                      dropdownOpen ? 'show' : ''
                    }`}
                    style={{ display: dropdownOpen ? 'block' : 'none', position: 'absolute', right: 0 }}
                  >
                    {/* Header Card: Tên, Email & Số Dư Ví */}
                    <div className="dropdown-header-card">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{ width: 38, height: 38, fontSize: '1rem' }}
                        >
                          {currentUser.fullName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <strong className="text-dark d-block text-truncate small" style={{ maxWidth: 210 }}>
                            {currentUser.fullName}
                          </strong>
                          <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.72rem', maxWidth: 210 }}>
                            {currentUser.email}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                        <div>
                          <span className="text-muted small d-block" style={{ fontSize: '0.7rem' }}>Số dư khả dụng</span>
                          <strong className="text-success small">
                            {Number(currentUser.walletBalance || 0).toLocaleString('vi-VN')} đ
                          </strong>
                        </div>
                        <Button
                          variant="success"
                          size="sm"
                          className="py-1 px-3 fw-bold rounded-pill shadow-sm"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenDeposit();
                          }}
                        >
                          + Nạp ví
                        </Button>
                      </div>
                    </div>

                    {/* Section 1: Tài Khoản Của Tôi */}
                    <div className="dropdown-section-title">Hồ Sơ & Học Tập</div>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#profile"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigate('profile');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-primary bg-opacity-10 text-primary">
                          <i className="bi bi-person-badge"></i>
                        </div>
                        <div>
                          <span>Hồ sơ cá nhân & Bảo mật</span>
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Thông tin, mật khẩu & chứng chỉ</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#learning"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigate('my-learning');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-info bg-opacity-10 text-info">
                          <i className="bi bi-play-circle"></i>
                        </div>
                        <div>
                          <span>Khóa học đã đăng ký</span>
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Tiếp tục học bài giảng dở dang</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#practice"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigate('practice');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-success bg-opacity-10 text-success">
                          <i className="bi bi-terminal"></i>
                        </div>
                        <div>
                          <span>Sân chơi Code Arena</span>
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Luyện thuật toán & chấm điểm test</small>
                        </div>
                      </a>
                    </li>

                    {/* Section 2: Quản Trị Hệ Thống (Nếu là Admin) */}
                    {currentUser.role === 'ADMIN' && (
                      <>
                        <div className="dropdown-section-title text-danger">Quản Trị Tối Cao</div>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#admin"
                            onClick={(e) => {
                              e.preventDefault();
                              setDropdownOpen(false);
                              onNavigate('admin');
                            }}
                          >
                            <div className="dropdown-item-icon-wrapper bg-danger bg-opacity-10 text-danger">
                              <i className="bi bi-shield-lock"></i>
                            </div>
                            <div>
                              <span className="text-danger fw-bold">Admin Console</span>
                              <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Quản lý CSDL, học viên & đơn hàng</small>
                            </div>
                          </a>
                        </li>
                      </>
                    )}

                    {/* Section 3: Cài Đặt & Lịch Sử Giao Dịch */}
                    <div className="dropdown-section-title">Giao Dịch & Giỏ Hàng</div>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#cart"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onNavigate('cart');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-primary bg-opacity-10 text-primary">
                          <i className="bi bi-cart3"></i>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div>
                            <span className="fw-semibold text-dark">Giỏ hàng của bạn</span>
                            <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Các khóa học đang chờ thanh toán</small>
                          </div>
                          {cartCount > 0 && (
                            <span className="badge rounded-pill bg-danger ms-2">
                              {cartCount}
                            </span>
                          )}
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#deposit-history"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          onOpenDepositHistory ? onOpenDepositHistory() : onNavigate('deposit-history');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-warning bg-opacity-10 text-warning">
                          <i className="bi bi-clock-history"></i>
                        </div>
                        <div>
                          <span className="fw-semibold text-dark">Lịch sử nạp tiền ví EduViet</span>
                          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Xem chi tiết các lần nạp & khuyến mãi</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#help"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          alert('Cố vấn kỹ thuật EduViet hỗ trợ 24/7 qua hotline 1900-EDUVIET hoặc khung chat góc trái màn hình!');
                        }}
                      >
                        <div className="dropdown-item-icon-wrapper bg-secondary bg-opacity-10 text-secondary">
                          <i className="bi bi-question-circle"></i>
                        </div>
                        <span>Trợ giúp & Hỗ trợ kỹ thuật</span>
                      </a>
                    </li>

                    {/* Nút Đăng Xuất Nhanh & Nổi Bật Luôn Hiển Thị Rõ Ràng */}
                    <div className="p-2 mt-2 border-top border-secondary border-opacity-15 bg-light rounded-bottom-4">
                      <li>
                        <button
                          type="button"
                          className="dropdown-item dropdown-item-danger border-0 bg-danger text-white w-100 rounded-3 py-2 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                          onClick={() => {
                            setDropdownOpen(false);
                            onLogout();
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-box-arrow-right fs-5 me-2"></i>
                          <span>ĐĂNG XUẤT TÀI KHOẢN</span>
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}