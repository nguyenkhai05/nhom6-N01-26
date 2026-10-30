import { useState, useEffect } from 'react';
import { Badge, Button, Modal, Row, Col, Alert, Spinner, Table, Form } from 'react-bootstrap';
import { getBundles, getBundleQuote, checkoutBundle } from '../../services/hubApi';

const SNOOZE_STORAGE_KEY = 'eduviet_combo_notice_snooze_v2';
const SNOOZE_HOURS = 4;

export default function ComboNoticeBanner({ currentUser, onOpenDeposit, onNavigate }) {
  const [bundles, setBundles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [snoozeCheckbox, setSnoozeCheckbox] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [remainingText, setRemainingText] = useState('');
  const [isTopBannerDismissed, setIsTopBannerDismissed] = useState(checkIsSnoozed);

  // Kiểm tra xem có đang trong thời gian 4 tiếng ẩn hay không
  const checkIsSnoozed = () => {
    try {
      const snoozedUntil = localStorage.getItem(SNOOZE_STORAGE_KEY);
      if (snoozedUntil && Date.now() < Number(snoozedUntil)) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const updateRemainingText = () => {
    try {
      const snoozedUntil = localStorage.getItem(SNOOZE_STORAGE_KEY);
      if (snoozedUntil) {
        const diffMs = Number(snoozedUntil) - Date.now();
        if (diffMs > 0) {
          const hours = Math.ceil(diffMs / (1000 * 60 * 60));
          setRemainingText(`Ẩn còn ~${hours}h`);
          return;
        }
      }
    } catch {
      // ignore
    }
    setRemainingText('');
  };

  useEffect(() => {
    // Tải danh sách bundles từ backend
    getBundles()
      .then((data) => {
        if (Array.isArray(data)) {
          setBundles(data);
          if (data.length > 0) setSelectedBundle(data[0]);
        }
      })
      .catch((err) => console.error('Lỗi tải thông báo combo:', err));

    // Kiểm tra tự động POP RA khi vào đầu trang và hiển thị thanh banner
    const isSnoozed = checkIsSnoozed();
    setIsTopBannerDismissed(isSnoozed);
    if (isSnoozed) {
      setIsOpen(false);
      updateRemainingText();
    } else {
      // Chưa bị ẩn: Tự động pop-up sau 400ms để trải nghiệm mượt mà
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Xử lý đóng modal
  const handleClose = (e, forceSnooze = false) => {
    if (forceSnooze || snoozeCheckbox) {
      const until = Date.now() + SNOOZE_HOURS * 60 * 60 * 1000;
      try {
        localStorage.setItem(SNOOZE_STORAGE_KEY, String(until));
      } catch (err) {
        console.error(err);
      }
      setIsTopBannerDismissed(true);
      setRemainingText('Ẩn 4h');
    }
    setIsOpen(false);
  };

  // Nút ẩn 4 tiếng trực tiếp từ thanh đầu trang
  const handleSnooze4Hours = (e) => {
    if (e) e.stopPropagation();
    const until = Date.now() + SNOOZE_HOURS * 60 * 60 * 1000;
    try {
      localStorage.setItem(SNOOZE_STORAGE_KEY, String(until));
    } catch (err) {
      console.error(err);
    }
    setIsTopBannerDismissed(true);
    setIsOpen(false);
    setRemainingText('Ẩn 4h');
  };

  // Mở lại modal & thanh thông báo thủ công từ nút ghim nổi
  const handleReopen = () => {
    try {
      localStorage.removeItem(SNOOZE_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    setIsTopBannerDismissed(false);
    setRemainingText('');
    setIsOpen(true);
  };

  // Lấy báo giá Smart Quote
  const handleOpenQuote = async (bundle) => {
    setSelectedBundle(bundle);
    setQuote(null);
    setAlertInfo(null);
    setQuoteLoading(true);
    try {
      const q = await getBundleQuote(bundle.bundle_id);
      setQuote(q);
    } catch (err) {
      setAlertInfo({ variant: 'danger', message: err.message || 'Không thể tính toán báo giá combo' });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Thanh toán combo
  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thực hiện mua gói combo.');
      return;
    }
    setCheckoutLoading(true);
    setAlertInfo(null);
    try {
      const res = await checkoutBundle(selectedBundle.bundle_id);
      setAlertInfo({ variant: 'success', message: res.message });
      if (currentUser && res.balance_after !== undefined) {
        currentUser.walletBalance = res.balance_after;
      }
      setTimeout(() => {
        setIsOpen(false);
        onNavigate?.('my-learning');
      }, 1500);
    } catch (err) {
      setAlertInfo({ variant: 'danger', message: err.message || 'Thanh toán combo thất bại' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const maxSaving = bundles.length > 0
    ? Math.max(...bundles.map((b) => b.savings_percent || 0))
    : 22;

  return (
    <>
      {/* 1. THANH THÔNG BÁO GIẢM GIÁ LUÔN XUẤT HIỆN Ở ĐẦU TRANG */}
      {!isTopBannerDismissed && (
        <div
          className="combo-announcement-bar py-2 px-3 border-bottom shadow-sm"
          style={{
            background: 'linear-gradient(90deg, #0d3b66 0%, #174276 50%, #001e3d 100%)',
            color: '#ffffff',
            position: 'relative',
            zIndex: 1040,
          }}
        >
          <div className="container-fluid px-lg-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span
                className="badge rounded-pill text-dark fw-bold px-3 py-1 shadow-sm"
                style={{ backgroundColor: '#ffb700' }}
              >
                <i className="bi bi-megaphone-fill me-1"></i> THÔNG BÁO ƯU ĐÃI
              </span>
              <span className="fw-semibold">
                🔥 Tiết kiệm lên tới <strong>{maxSaving}%</strong> khi mua combo các khóa học lập trình thực chiến EduViet!
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="warning"
                size="sm"
                className="fw-bold rounded-pill text-dark px-3 shadow-sm"
                onClick={() => {
                  if (bundles.length > 0 && !selectedBundle) setSelectedBundle(bundles[0]);
                  setIsOpen(true);
                }}
              >
                <i className="bi bi-gift-fill me-1"></i> Xem Chi Tiết Giảm Giá
              </Button>
              <button
                type="button"
                className="btn btn-sm btn-link text-white text-decoration-none"
                onClick={handleSnooze4Hours}
                title="Tạm ẩn thông báo này trong 4 tiếng"
              >
                <i className="bi bi-clock-history me-1"></i> Ẩn 4 tiếng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL POP-UP NỔI Ở ĐẦU TRANG (Chuẩn phong cách EduViet Popup) */}
      <Modal
        show={isOpen}
        onHide={() => handleClose(null, false)}
        centered
        backdrop="static"
        keyboard={true}
        className="combo-popup-modal"
        contentClassName="border-0 shadow-lg"
        style={{ zIndex: 1060 }}
      >
        <div className="p-4" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
          {/* Header với Icon Badge phong cách EduViet */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center text-white shadow-sm"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0d3b66 100%)',
                  fontSize: '1.25rem',
                }}
              >
                <i className="bi bi-gift-fill text-warning"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  EduViet Promotion
                  <Badge bg="danger" className="rounded-pill px-2 py-1 small">
                    HOT -{maxSaving}%
                  </Badge>
                </h5>
                <small className="text-muted">Thông báo ưu đãi combo khóa học đặc biệt</small>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-2 text-muted shadow-sm hover-shadow"
              onClick={() => handleClose(null, false)}
              style={{ width: '36px', height: '36px', lineHeight: 1 }}
              title="Đóng"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Banner Giới Thiệu Ưu Đãi */}
          <div
            className="p-3 rounded-4 mb-3 text-white"
            style={{
              background: 'linear-gradient(135deg, #0d3b66 0%, #174276 50%, #001e3d 100%)',
              border: '2px solid #ffb700',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-warning text-dark fw-bold px-2 py-1">
                <i className="bi bi-stars me-1"></i> TIẾT KIỆM ĐẾN {maxSaving}%
              </span>
              <span className="small text-warning fw-semibold">Thuật toán Smart Quote</span>
            </div>
            <p className="small mb-0 text-light" style={{ lineHeight: 1.5 }}>
              Đăng ký trọn gói lộ trình Fullstack, Mobile hoặc DevOps. Hệ thống <strong>tự động khấu trừ tiền các khóa bạn đã sở hữu</strong>, không bao giờ phải trả phí 2 lần!
            </p>
          </div>

          {/* Danh Sách Các Gói Combo Đang Bán */}
          <div className="mb-3">
            <label className="fw-bold small text-muted text-uppercase mb-2 d-flex justify-content-between align-items-center">
              <span>Chọn gói Combo đang mở bán:</span>
              <span className="x-small text-primary">{bundles.length} gói ưu đãi</span>
            </label>
            <Row className="g-2">
              {bundles.map((b) => {
                const isSelected = selectedBundle?.bundle_id === b.bundle_id;
                return (
                  <Col key={b.bundle_id} xs={12}>
                    <div
                      className={`p-2 px-3 rounded-3 border transition d-flex align-items-center justify-content-between cursor-pointer ${isSelected ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white hover-shadow'}`}
                      onClick={() => handleOpenQuote(b)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2" style={{ maxWidth: '65%' }}>
                        <Badge bg="danger" className="rounded-pill">-{b.savings_percent}%</Badge>
                        <div>
                          <strong className="d-block text-dark small text-truncate" title={b.title}>
                            {b.title}
                          </strong>
                          <span className="text-muted x-small">
                            {b.items?.length || 2} khóa học · Tiết kiệm {Number(b.savings_amount).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="fw-bold text-primary d-block small">
                          {Number(b.bundle_price).toLocaleString('vi-VN')} đ
                        </span>
                        <s className="text-muted x-small">
                          {Number(b.retail_total).toLocaleString('vi-VN')} đ
                        </s>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Chi Tiết Báo Giá Smart Quote (Nếu Đã Chọn) */}
          {selectedBundle && quote && (
            <div className="border rounded-3 p-3 bg-light mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-dark d-flex align-items-center gap-1">
                  <i className="bi bi-calculator text-primary"></i>
                  Chiết khấu Smart Quote:
                </span>
                <span className="badge bg-success">
                  Học phí thực trả: {Number(quote.final_amount).toLocaleString('vi-VN')} đ
                </span>
              </div>

              {quote.owned_count > 0 && (
                <div className="text-success small mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-check-circle-fill"></i>
                  Đã tự động trừ {quote.owned_count} khóa học bạn đang có!
                </div>
              )}

              {alertInfo && (
                <Alert variant={alertInfo.variant} className="py-1 small mb-2">
                  {alertInfo.message}
                </Alert>
              )}

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <small className="text-muted">
                  Ví của bạn: <strong>{Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                </small>

                {!currentUser ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="fw-bold rounded-pill px-3"
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate?.('bundles');
                    }}
                  >
                    Xem chi tiết gói
                  </Button>
                ) : currentUser.walletBalance < quote.final_amount ? (
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="fw-bold text-dark rounded-pill px-3"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenDeposit?.();
                    }}
                  >
                    <i className="bi bi-wallet2 me-1"></i> Nạp thêm ví
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    className="fw-bold rounded-pill px-3"
                    disabled={checkoutLoading}
                    onClick={handleCheckout}
                  >
                    {checkoutLoading ? 'Đang mua...' : 'Thanh toán ngay'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Dải Nút Hành Động & Lựa Chọn Ẩn 4 Tiếng (Giống Mẫu Auth) */}
          <div className="pt-2 border-top">
            {/* Checkbox ẩn thông báo 4 tiếng */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Form.Check
                type="checkbox"
                id="snooze-4h-checkbox"
                checked={snoozeCheckbox}
                onChange={(e) => setSnoozeCheckbox(e.target.checked)}
                label={
                  <span className="small text-muted fw-semibold">
                    Không hiển thị lại thông báo này trong 4 tiếng
                  </span>
                }
                className="user-select-none"
              />

              <Button
                variant="link"
                size="sm"
                className="text-muted p-0 small text-decoration-none"
                onClick={() => handleClose(null, true)}
                title="Ẩn ngay thông báo trong 4 tiếng"
              >
                <i className="bi bi-clock-history me-1"></i> Ẩn 4 tiếng
              </Button>
            </div>

            {/* Các Nút Hành Động Chính */}
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                className="fw-bold rounded-3 shadow-sm py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  if (!quote && selectedBundle) {
                    handleOpenQuote(selectedBundle);
                  } else {
                    setIsOpen(false);
                    onNavigate?.('bundles');
                  }
                }}
              >
                {quoteLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Đang tính giá ưu đãi...
                  </>
                ) : quote ? (
                  <>
                    <i className="bi bi-tags-fill text-warning"></i>
                    Đến Trang Chi Tiết Combo
                  </>
                ) : (
                  <>
                    <i className="bi bi-tag-fill text-warning"></i>
                    Nhận Báo Giá Thông Minh & Xem Gói
                  </>
                )}
              </Button>

              <Button
                variant="light"
                size="sm"
                className="text-muted border-0 fw-semibold py-2"
                onClick={() => handleClose(null, false)}
              >
                Để xem sau, tiếp tục duyệt khóa học
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. NÚT GHIM NỔI Ở GÓC MÀN HÌNH (Để mở lại bất cứ lúc nào) */}
      <div className="position-fixed bottom-0 start-0 m-3" style={{ zIndex: 1040 }}>
        <button
          type="button"
          className="btn btn-sm rounded-pill shadow-lg d-flex align-items-center gap-2 px-3 py-2 fw-semibold border transition hover-shadow"
          style={{
            backgroundColor: '#0d3b66',
            color: '#ffb700',
            borderColor: '#ffb700',
            cursor: 'pointer',
          }}
          onClick={handleReopen}
          title="Nhấn để mở xem thông báo ưu đãi Combo"
        >
          <i className="bi bi-bell-fill text-warning"></i>
          <span>Ưu Đãi Combo (-{maxSaving}%)</span>
          {remainingText && (
            <span className="badge bg-warning text-dark ms-1 small">{remainingText}</span>
          )}
        </button>
      </div>
    </>
  );
}
