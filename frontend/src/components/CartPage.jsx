import { useState, useMemo } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, Alert } from 'react-bootstrap';

export default function CartPage({
  cart = [],
  onRemoveFromCart,
  onClearCart,
  onProceedToCheckout,
  onNavigate
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const rawTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [cart]
  );

  // R14: Tính toán lại mức giảm giá động từ rawTotal hiện tại
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || rawTotal === 0) return 0;
    if (appliedCoupon.code === 'EDUVIET2026') return Math.round(rawTotal * 0.2);
    if (appliedCoupon.code === 'DEVNEWBIE') return Math.min(rawTotal, 100000);
    if (appliedCoupon.code === 'FULLSTACKVIP') return Math.round(rawTotal * 0.25);
    return 0;
  }, [appliedCoupon, rawTotal]);

  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'EDUVIET2026') {
      setAppliedCoupon({ code, desc: 'Giảm 20% học phí (Mã EDUVIET2026)' });
      setCouponMsg({ type: 'success', text: 'Áp dụng thành công mã EDUVIET2026 giảm 20%!' });
    } else if (code === 'DEVNEWBIE') {
      setAppliedCoupon({ code, desc: 'Giảm 100.000đ học viên mới (Mã DEVNEWBIE)' });
      setCouponMsg({ type: 'success', text: 'Áp dụng thành công mã DEVNEWBIE giảm 100.000 đ!' });
    } else if (code === 'FULLSTACKVIP') {
      setAppliedCoupon({ code, desc: 'Ưu đãi VIP giảm 25% (Mã FULLSTACKVIP)' });
      setCouponMsg({ type: 'success', text: 'Áp dụng thành công mã FULLSTACKVIP giảm 25%!' });
    } else {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'danger', text: 'Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMsg({ type: '', text: '' });
  };

  return (
    <div className="app-container py-5 page-fade-in">
      {/* Tiêu đề giỏ hàng */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-cart3 text-primary"></i> Giỏ Hàng Khóa Học
          </h2>
          <p className="text-secondary small mb-0">
            Xem lại các khóa học lập trình thực chiến đã chọn trước khi thanh toán.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill px-3"
            onClick={() => onNavigate?.('courses')}
          >
            <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn khóa học
          </Button>
          {cart.length > 0 && (
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={onClearCart}
            >
              <i className="bi bi-trash3 me-1"></i> Xóa toàn bộ giỏ hàng
            </Button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body className="py-5">
            <div className="text-secondary mb-3" style={{ fontSize: '4rem' }}>
              <i className="bi bi-cart-x"></i>
            </div>
            <h4 className="fw-bold text-dark">Giỏ hàng của bạn đang trống</h4>
            <p className="text-secondary mb-4">
              Hãy khám phá hơn 50+ khóa học Frontend, Backend, DevOps chất lượng cao trên EduViet.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="fw-bold rounded-pill px-4 shadow-sm"
              onClick={() => onNavigate?.('courses')}
            >
              <i className="bi bi-mortarboard me-2"></i> Khám Phá Khóa Học Ngay
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {/* Cột trái: Danh sách khóa học trong giỏ */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-3">
              <Card.Header className="bg-white py-3 border-bottom">
                <span className="fw-bold text-dark">Danh sách ({cart.length} khóa học)</span>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary small">
                      <tr>
                        <th className="ps-4">Khóa học</th>
                        <th>Chuyên ngành</th>
                        <th className="text-end">Học phí</th>
                        <th className="text-center" style={{ width: 80 }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.course_id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.thumbnail_url || 'https://placehold.co/100x60/1e293b/38bdf8?text=EduViet'}
                                alt={item.title}
                                className="rounded-3 object-fit-cover shadow-sm"
                                style={{ width: 84, height: 52 }}
                              />
                              <div>
                                <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                  {item.title}
                                </h6>
                                <span className="text-secondary small d-block">
                                  Giảng viên: {item.instructor?.name || 'Mentor EduViet'} • {item.level || 'Beginner'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-2 py-1 rounded-pill">
                              {item.category?.name || 'Lập trình'}
                            </Badge>
                          </td>
                          <td className="text-end">
                            <span className="fw-bold text-primary font-monospace">
                              {Number(item.price || 0).toLocaleString('vi-VN')} đ
                            </span>
                            {item.old_price && (
                              <span className="d-block text-muted text-decoration-line-through small font-monospace">
                                {Number(item.old_price).toLocaleString('vi-VN')} đ
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="rounded-circle p-0"
                              style={{ width: 32, height: 32 }}
                              title="Xóa khóa học khỏi giỏ"
                              onClick={() => onRemoveFromCart?.(item.course_id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Thông tin cam kết & Hỗ trợ học tập */}
            <div className="p-3 bg-white rounded-4 shadow-sm border d-flex flex-wrap gap-4 align-items-center justify-content-between text-secondary small">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <span>Bảo hành hoàn tiền 100% trong 7 ngày</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-infinity text-primary fs-5"></i>
                <span>Sở hữu trọn đời & cập nhật kiến thức liên tục</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-patch-check-fill text-warning fs-5"></i>
                <span>Cấp chứng chỉ hoàn thành khóa học</span>
              </div>
            </div>
          </Col>

          {/* Cột phải: Mã giảm giá & Tóm tắt thanh toán */}
          <Col lg={4}>
            {/* Nhập mã ưu đãi */}
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Header className="bg-white py-3 border-bottom">
                <span className="fw-bold text-dark">Mã ưu đãi / Khuyến mãi</span>
              </Card.Header>
              <Card.Body>
                {couponMsg.text && (
                  <Alert variant={couponMsg.type} className="py-2 px-3 small rounded-3 mb-3">
                    {couponMsg.text}
                  </Alert>
                )}

                {appliedCoupon ? (
                  <div className="p-3 bg-success-subtle rounded-3 border border-success-subtle d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="success">{appliedCoupon.code}</Badge>
                        <strong className="text-success small">Đang áp dụng</strong>
                      </div>
                      <small className="text-secondary d-block mt-1">{appliedCoupon.desc}</small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-2 py-0"
                      onClick={handleRemoveCoupon}
                      title="Gỡ mã giảm giá"
                    >
                      Gỡ
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleApplyCoupon}>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Nhập mã: EDUVIET2026..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="rounded-pill text-uppercase font-monospace"
                      />
                      <Button type="submit" variant="primary" className="rounded-pill px-3 fw-bold">
                        Áp dụng
                      </Button>
                    </div>
                    <div className="mt-2 text-muted small" style={{ fontSize: '0.78rem' }}>
                      <i className="bi bi-lightbulb me-1 text-warning"></i>
                      Thử mã <strong>EDUVIET2026</strong> (giảm 20%) hoặc <strong>DEVNEWBIE</strong> (giảm 100k).
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>

            {/* Tóm tắt chi phí đơn hàng */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white py-3 border-bottom">
                <span className="fw-bold text-dark">Tóm tắt đơn hàng</span>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between mb-2 text-secondary">
                  <span>Học phí gốc:</span>
                  <span className="fw-semibold font-monospace">{rawTotal.toLocaleString('vi-VN')} đ</span>
                </div>

                {appliedCoupon && (
                  <div className="d-flex justify-content-between text-success mb-2">
                    <span>Ưu đãi voucher ({appliedCoupon.code}):</span>
                    <span className="fw-bold font-monospace">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3 text-secondary">
                  <span>VAT / Phí cổng thanh toán:</span>
                  <span className="text-success fw-bold font-monospace">Miễn phí (0 đ)</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-baseline mb-4">
                  <span className="fw-bold fs-6 text-dark">Tổng thanh toán:</span>
                  <span className="fw-bold fs-4 text-primary font-monospace">
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 fw-bold rounded-pill shadow-sm py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => onProceedToCheckout({
                    items: cart,
                    rawTotal,
                    discountAmount,
                    finalTotal,
                    appliedCoupon
                  })}
                >
                  <span>Tiến Hành Thanh Toán</span>
                  <i className="bi bi-arrow-right"></i>
                </Button>

                <div className="text-center mt-3 text-secondary" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-lock-fill me-1 text-success"></i>
                  Giao dịch được bảo mật và mã hóa 256-bit SSL an toàn.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
