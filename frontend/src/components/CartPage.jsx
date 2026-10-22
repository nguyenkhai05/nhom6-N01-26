import { useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, Alert } from 'react-bootstrap';

export default function CartPage({
  cart = [],
  onRemoveFromCart,
  onClearCart,
  onProceedToCheckout,
  onNavigate
}) {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const rawTotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'EDUVIET2026') {
      const discount = Math.round(rawTotal * 0.2); // 20%
      setDiscountAmount(discount);
      setAppliedCoupon({ code, desc: 'Giảm 20% học phí (Mã EDUVIET2026)' });
      setCouponMsg({ type: 'success', text: `Áp dụng thành công! Bạn được giảm ${discount.toLocaleString('vi-VN')} đ.` });
    } else if (code === 'DEVNEWBIE') {
      const discount = Math.min(rawTotal, 100000);
      setDiscountAmount(discount);
      setAppliedCoupon({ code, desc: 'Giảm 100.000đ học viên mới (Mã DEVNEWBIE)' });
      setCouponMsg({ type: 'success', text: `Áp dụng thành công! Bạn được giảm 100.000 đ.` });
    } else {
      setCouponMsg({ type: 'danger', text: 'Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponMsg({ type: '', text: '' });
  };

  return (
    <div className="app-container py-5 page-fade-in">
      {/* Tiêu đề giỏ hàng */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
            <i className="bi bi-cart3 me-1"></i> GIỎ HÀNG KHÓA HỌC
          </span>
          <h2 className="fw-bold text-dark mb-1">Giỏ Hàng Của Bạn ({cart.length})</h2>
          <p className="text-secondary small mb-0">
            Xem lại các khóa học đã chọn trước khi tiến hành xác nhận thanh toán & kích hoạt bài học.
          </p>
        </div>

        {cart.length > 0 && (
          <div className="mt-3 mt-md-0">
            <Button
              variant="outline-danger"
              size="sm"
              className="fw-bold rounded-pill px-3"
              onClick={onClearCart}
            >
              <i className="bi bi-trash3 me-1"></i> Xóa toàn bộ giỏ hàng
            </Button>
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <Card className="border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <div className="py-4">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 80, height: 80 }}
            >
              <i className="bi bi-cart-x display-4"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h4>
            <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: 450 }}>
              Hãy khám phá thư viện khóa học lập trình thực chiến từ Frontend, Backend đến AI & DevOps để bắt đầu lộ trình nghề nghiệp.
            </p>
            <Button
              variant="primary"
              className="fw-bold px-4 py-2 rounded-pill shadow-sm"
              onClick={() => onNavigate('courses')}
            >
              <i className="bi bi-grid me-2"></i>Khám Phá Khóa Học Ngay
            </Button>
          </div>
        </Card>
      ) : (
        <Row className="g-4">
          {/* Cột trái: Danh sách các khóa học trong giỏ */}
          <Col lg={8}>
            <Card className="border-0 rounded-4 shadow-sm bg-white overflow-hidden p-3 p-md-4">
              <div className="d-flex flex-column gap-3">
                {cart.map((item) => (
                  <div
                    key={item.course_id}
                    className="p-3 border rounded-4 bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 hover-lift"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.thumbnail_url || 'https://placehold.co/100x70'}
                        alt={item.title}
                        width={90}
                        height={64}
                        className="rounded-3 object-fit-cover shadow-sm flex-shrink-0"
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Badge bg="primary" className="rounded-pill px-2 py-0" style={{ fontSize: '0.7rem' }}>
                            {item.category?.name || 'Lập trình'}
                          </Badge>
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-clock me-1"></i>{item.duration || '40 giờ'}
                          </span>
                        </div>
                        <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                        <span className="small text-muted d-block" style={{ fontSize: '0.78rem' }}>
                          Giảng viên: <strong>{item.instructor?.name || 'EduViet Mentor'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="d-flex sm-flex-column align-items-end justify-content-between justify-content-sm-center gap-2 flex-shrink-0">
                      <div className="text-sm-end">
                        <strong className="fs-5 text-primary font-monospace d-block">
                          {Number(item.price || 0).toLocaleString('vi-VN')} đ
                        </strong>
                        {item.old_price && (
                          <span className="text-decoration-line-through text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
                            {Number(item.old_price).toLocaleString('vi-VN')} đ
                          </span>
                        )}
                      </div>

                      <Button
                        variant="link"
                        className="text-danger p-0 text-decoration-none small fw-semibold"
                        onClick={() => onRemoveFromCart(item.course_id)}
                      >
                        <i className="bi bi-x-circle me-1"></i>Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chính sách cam kết an tâm */}
              <div className="mt-4 p-3 bg-light rounded-4 border">
                <div className="row g-2 text-secondary small">
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-success fs-5"></i>
                    <span>Hoàn tiền 100% trong 7 ngày nếu không hài lòng</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check-fill text-primary fs-5"></i>
                    <span>Sở hữu trọn đời & cập nhật giáo trình miễn phí</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Cột phải: Khối tóm tắt đơn hàng & Mã giảm giá */}
          <Col lg={4}>
            <Card className="border-0 rounded-4 shadow-sm bg-white p-4 sticky-top" style={{ top: 85 }}>
              <h5 className="fw-bold text-dark mb-3">Tóm Tắt Đơn Hàng</h5>

              {/* Nhập mã giảm giá */}
              <Form onSubmit={handleApplyCoupon} className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.72rem' }}>
                  Mã Giảm Giá / Voucher
                </Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="VD: EDUVIET2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="font-monospace text-uppercase"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button variant="outline-danger" size="sm" onClick={handleRemoveCoupon}>
                      Bỏ
                    </Button>
                  ) : (
                    <Button type="submit" variant="dark" size="sm" className="fw-bold px-3">
                      Áp dụng
                    </Button>
                  )}
                </div>
                <Form.Text className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Thử mã: <code className="text-primary fw-bold">EDUVIET2026</code> (-20%) hoặc <code className="text-primary fw-bold">DEVNEWBIE</code> (-100k)
                </Form.Text>
              </Form>

              {couponMsg.text && (
                <Alert variant={couponMsg.type} className="py-2 px-3 small rounded-3 mb-3">
                  {couponMsg.text}
                </Alert>
              )}

              {/* Chi tiết tính toán */}
              <div className="d-flex flex-column gap-2 pb-3 mb-3 border-bottom small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Tổng học phí ({cart.length} khóa):</span>
                  <span className="fw-semibold font-monospace">{rawTotal.toLocaleString('vi-VN')} đ</span>
                </div>

                {appliedCoupon && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Ưu đãi voucher ({appliedCoupon.code}):</span>
                    <span className="fw-bold font-monospace">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <span className="text-muted">Kích hoạt tài khoản & Mentor 1:1:</span>
                  <span className="badge bg-success-subtle text-success fw-bold">MIỄN PHÍ</span>
                </div>
              </div>

              {/* Tổng thanh toán cuối cùng */}
              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark fs-6">Thành Tiền:</span>
                <div className="text-end">
                  <strong className="fs-3 fw-bold text-primary font-monospace">
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </strong>
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                    (Đã bao gồm thuế GTGT & tài liệu)
                  </small>
                </div>
              </div>

              {/* Nút chuyển sang bước xác nhận thanh toán */}
              <Button
                variant="primary"
                size="lg"
                className="w-100 fw-bold rounded-pill py-3 shadow mb-2"
                onClick={() => onProceedToCheckout({
                  items: cart,
                  rawTotal,
                  discountAmount,
                  finalTotal,
                  appliedCoupon
                })}
              >
                <i className="bi bi-credit-card-2-front-fill me-2"></i>Tiến Hành Thanh Toán
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100 rounded-pill py-2 border-0 text-muted"
                onClick={() => onNavigate('courses')}
              >
                <i className="bi bi-arrow-left me-1"></i>Chọn thêm khóa học khác
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
