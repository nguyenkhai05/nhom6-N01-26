import { useState } from 'react';
import { Row, Col, Card, Button, Form, Badge, Alert, Modal } from 'react-bootstrap';

export default function CheckoutPage({
  checkoutData,
  currentUser,
  onCompleteOrder,
  onOpenDeposit,
  onOpenLogin,
  onNavigate
}) {
  const [paymentMethod, setPaymentMethod] = useState('WALLET'); // 'WALLET' | 'BANK_QR' | 'MOMO'
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const items = checkoutData?.items || [];
  const rawTotal = checkoutData?.rawTotal || 0;
  const discountAmount = checkoutData?.discountAmount || 0;
  const finalTotal = checkoutData?.finalTotal || 0;
  const appliedCoupon = checkoutData?.appliedCoupon || null;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const walletBalance = Number(currentUser?.walletBalance || 0);
  const isWalletSufficient = walletBalance >= finalTotal;

  const handleOpenConfirmModal = () => {
    if (!currentUser) {
      onOpenLogin?.();
      return;
    }

    if (paymentMethod === 'WALLET' && !isWalletSufficient) {
      alert('Số dư ví EduViet không đủ để thanh toán. Vui lòng nạp thêm tiền hoặc chọn phương thức Chuyển khoản QR Ngân hàng!');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmOrder = () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        userEmail: currentUser.email,
        userName: currentUser.fullName,
        items: items.map((i) => ({ course_id: i.course_id, title: i.title, price: i.price })),
        amount: finalTotal,
        method: paymentMethod === 'WALLET' ? 'Ví EduViet' : paymentMethod === 'BANK_QR' ? 'QR Ngân hàng (Vietcombank)' : 'Ví MoMo',
        status: paymentMethod === 'WALLET' ? 'Completed' : 'Completed',
        date: new Date().toLocaleString('vi-VN'),
        coupon: appliedCoupon?.code || null,
        note
      };

      setIsProcessing(false);
      setOrderSuccess(newOrder);
      onCompleteOrder?.(newOrder);
    }, 1200);
  };

  return (
    <div className="app-container py-5 page-fade-in">
      {/* Thông báo đặt hàng thành công */}
      {orderSuccess ? (
        <Card className="border-0 rounded-4 shadow-sm p-4 p-md-5 text-center bg-white">
          <div
            className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 88, height: 88 }}
          >
            <i className="bi bi-check2-circle display-4"></i>
          </div>

          <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mb-2">
            GIAO DỊCH HOÀN TẤT
          </span>
          <h2 className="fw-bold text-dark mb-2">Thanh Toán Khóa Học Thành Công!</h2>
          <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: 550 }}>
            Mã đơn hàng: <strong className="font-monospace text-dark fs-6">{orderSuccess.id}</strong>. 
            Bạn đã được cấp quyền truy cập toàn bộ bài giảng, tài liệu và phòng thực hành Code Arena.
          </p>

          <div className="p-4 bg-light rounded-4 border mx-auto mb-4 text-start" style={{ maxWidth: 600 }}>
            <h6 className="fw-bold mb-3 border-bottom pb-2">Chi Tiết Đơn Hàng</h6>
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Học viên:</span>
              <strong className="text-dark">{orderSuccess.userName} ({orderSuccess.userEmail})</strong>
            </div>
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Phương thức:</span>
              <span className="badge bg-primary-subtle text-primary">{orderSuccess.method}</span>
            </div>
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Số lượng khóa học:</span>
              <strong>{orderSuccess.items?.length} khóa học</strong>
            </div>
            <div className="d-flex justify-content-between small pt-2 border-top">
              <span className="fw-bold">Tổng thanh toán:</span>
              <strong className="text-success fs-5 font-monospace">{Number(orderSuccess.amount).toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              className="fw-bold px-4 py-2 rounded-pill shadow-sm"
              onClick={() => onNavigate('my-learning')}
            >
              <i className="bi bi-play-circle-fill me-2"></i>Vào Phòng Học Ngay
            </Button>
            <Button
              variant="outline-secondary"
              className="fw-semibold px-4 py-2 rounded-pill"
              onClick={() => onNavigate('home')}
            >
              Về Trang Chủ
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Header Trang Xác Nhận Thanh Toán */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold mb-2">
                <i className="bi bi-shield-lock-fill me-1"></i> THANH TOÁN AN TOÀN 256-BIT SSL
              </span>
              <h2 className="fw-bold text-dark mb-1">Xác Nhận & Thanh Toán Đơn Hàng</h2>
              <p className="text-secondary small mb-0">
                Lựa chọn phương thức thanh toán thuận tiện nhất để kích hoạt quyền sở hữu khóa học trọn đời.
              </p>
            </div>

            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3 mt-3 mt-md-0 fw-semibold"
              onClick={() => onNavigate('cart')}
            >
              <i className="bi bi-arrow-left me-1"></i> Quay lại giỏ hàng
            </Button>
          </div>

          <Row className="g-4">
            {/* Cột trái: Chọn Phương Thức Thanh Toán */}
            <Col lg={7}>
              <Card className="border-0 rounded-4 shadow-sm bg-white p-4 mb-4">
                <h5 className="fw-bold text-dark mb-3">1. Chọn Phương Thức Thanh Toán</h5>

                <div className="d-flex flex-column gap-3 mb-4">
                  {/* Lựa chọn 1: Ví EduViet */}
                  <div
                    className={`p-3 rounded-4 border transition-all cursor-pointer ${
                      paymentMethod === 'WALLET' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'bg-light'
                    }`}
                    onClick={() => setPaymentMethod('WALLET')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'WALLET'}
                          onChange={() => setPaymentMethod('WALLET')}
                        />
                        <div
                          className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center"
                          style={{ width: 44, height: 44 }}
                        >
                          <i className="bi bi-wallet2 fs-4"></i>
                        </div>
                        <div>
                          <strong className="text-dark d-block">Ví Học Tập EduViet</strong>
                          <span className="small text-secondary">
                            Số dư ví: <strong className="text-success font-monospace">{walletBalance.toLocaleString('vi-VN')} đ</strong>
                          </span>
                        </div>
                      </div>

                      <div>
                        {isWalletSufficient ? (
                          <Badge bg="success" className="rounded-pill px-2 py-1">
                            <i className="bi bi-check-circle me-1"></i>Khả dụng
                          </Badge>
                        ) : (
                          <Button
                            variant="warning"
                            size="sm"
                            className="fw-bold rounded-pill px-2 py-0"
                            style={{ fontSize: '0.75rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDeposit?.();
                            }}
                          >
                            + Nạp thêm ví
                          </Button>
                        )}
                      </div>
                    </div>

                    {!isWalletSufficient && (
                      <div className="mt-2 text-danger small fst-italic">
                        * Số dư hiện tại không đủ. Bạn cần nạp thêm tối thiểu {(finalTotal - walletBalance).toLocaleString('vi-VN')} đ.
                      </div>
                    )}
                  </div>

                  {/* Lựa chọn 2: Chuyển khoản QR Ngân hàng */}
                  <div
                    className={`p-3 rounded-4 border transition-all cursor-pointer ${
                      paymentMethod === 'BANK_QR' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'bg-light'
                    }`}
                    onClick={() => setPaymentMethod('BANK_QR')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'BANK_QR'}
                        onChange={() => setPaymentMethod('BANK_QR')}
                      />
                      <div
                        className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 44, height: 44 }}
                      >
                        <i className="bi bi-qr-code-scan fs-4"></i>
                      </div>
                      <div>
                        <strong className="text-dark d-block">Chuyển Khoản Mã QR Ngân Hàng (Vietcombank / Napas247)</strong>
                        <span className="small text-secondary">Tự động kích hoạt trong 30 giây ngay sau khi quét mã VietQR</span>
                      </div>
                    </div>

                    {paymentMethod === 'BANK_QR' && (
                      <div className="mt-3 p-3 bg-white rounded-3 border">
                        <Row className="align-items-center">
                          <Col sm={4} className="text-center mb-2 mb-sm-0">
                            <img
                              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=EDUVET_ORDER_PAYMENT"
                              alt="QR Code"
                              className="img-fluid border p-1 rounded-2 shadow-sm"
                              width={130}
                            />
                            <span className="small d-block text-muted mt-1" style={{ fontSize: '0.7rem' }}>Quét bằng App Ngân hàng</span>
                          </Col>
                          <Col sm={8} className="small">
                            <div className="mb-1"><strong>Ngân hàng:</strong> Vietcombank CN Hà Nội</div>
                            <div className="mb-1"><strong>Số tài khoản:</strong> <span className="text-primary fw-bold font-monospace">1029384756</span></div>
                            <div className="mb-1"><strong>Chủ tài khoản:</strong> CÔNG TY CÔNG NGHỆ EDUVIET</div>
                            <div className="mb-1"><strong>Số tiền:</strong> <span className="text-success fw-bold font-monospace">{finalTotal.toLocaleString('vi-VN')} đ</span></div>
                            <div><strong>Nội dung:</strong> <span className="text-danger fw-bold font-monospace">EDU {currentUser?.email?.split('@')[0] || 'PAY'}</span></div>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Lựa chọn 3: Ví MoMo */}
                  <div
                    className={`p-3 rounded-4 border transition-all cursor-pointer ${
                      paymentMethod === 'MOMO' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'bg-light'
                    }`}
                    onClick={() => setPaymentMethod('MOMO')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'MOMO'}
                        onChange={() => setPaymentMethod('MOMO')}
                      />
                      <div
                        className="bg-danger text-white rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 44, height: 44 }}
                      >
                        <i className="bi bi-phone-fill fs-4"></i>
                      </div>
                      <div>
                        <strong className="text-dark d-block">Thanh Toán Ví MoMo</strong>
                        <span className="small text-secondary">Liên kết một chạm với ứng dụng MoMo trên điện thoại</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ghi chú đơn hàng */}
                <h5 className="fw-bold text-dark mb-2">2. Thông Tin Bổ Sung</h5>
                <Form.Group className="mb-2">
                  <Form.Label className="small text-muted">Ghi chú cho bộ phận học vụ / xuất hóa đơn VAT (nếu có)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="VD: Cần xuất hóa đơn công ty hoặc yêu cầu hỗ trợ lộ trình đặc biệt..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
              </Card>
            </Col>

            {/* Cột phải: Thông Tin Tóm Tắt & Nút Xác Nhận */}
            <Col lg={5}>
              <Card className="border-0 rounded-4 shadow-sm bg-white p-4 sticky-top" style={{ top: 85 }}>
                <h5 className="fw-bold text-dark mb-3">Thông Tin Thanh Toán</h5>

                {/* Danh sách các khóa học được mua */}
                <div className="d-flex flex-column gap-2 mb-3 pb-3 border-bottom" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {items.map((it) => (
                    <div key={it.course_id} className="d-flex justify-content-between align-items-center small">
                      <div className="d-flex align-items-center gap-2 overflow-hidden">
                        <i className="bi bi-play-circle-fill text-primary"></i>
                        <span className="text-truncate fw-semibold" style={{ maxWidth: 220 }}>{it.title}</span>
                      </div>
                      <strong className="text-primary font-monospace flex-shrink-0">
                        {Number(it.price).toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Bảng tính chi phí */}
                <div className="d-flex flex-column gap-2 small pb-3 mb-3 border-bottom">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Tổng tiền gốc:</span>
                    <span className="font-monospace">{rawTotal.toLocaleString('vi-VN')} đ</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Giảm giá ({appliedCoupon?.code || 'Ưu đãi'}):</span>
                      <span className="font-monospace fw-bold">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between text-muted">
                    <span>Phí chuyển khoản / cổng thanh toán:</span>
                    <span className="badge bg-success-subtle text-success">0 đ (Tài trợ)</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-baseline mb-4">
                  <span className="fw-bold text-dark fs-6">Tổng Thanh Toán:</span>
                  <div className="text-end">
                    <strong className="fs-2 fw-bold text-primary font-monospace">
                      {finalTotal.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                </div>

                {/* Nút mở bảng xác nhận thanh toán */}
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 fw-bold py-3 rounded-pill shadow-sm mb-3"
                  onClick={handleOpenConfirmModal}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang Xử Lý Giao Dịch...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Kiểm Tra & Xác Nhận Thanh Toán
                    </>
                  )}
                </Button>

                <div className="p-3 bg-light rounded-4 small text-secondary">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-lock-fill text-success"></i>
                    <span>Cam kết bảo mật thông tin & an toàn tuyệt đối</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-headset text-primary"></i>
                    <span>Hotline hỗ trợ kỹ thuật: <strong>1900-EDUVIET</strong></span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* BẢNG XÁC NHẬN CHI TIẾT TRƯỚC KHI THANH TOÁN */}
          <Modal
            show={showConfirmModal}
            onHide={() => setShowConfirmModal(false)}
            centered
            size="lg"
            className="detail-confirmation-modal"
          >
            <Modal.Header closeButton className="bg-light border-bottom">
              <Modal.Title className="fw-bold fs-5 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-receipt text-warning fs-4"></i>
                XÁC NHẬN CHI TIẾT ĐƠN HÀNG & THANH TOÁN
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Alert variant="info" className="d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <span>Vui lòng rà soát lại thông tin học viên, danh sách khóa học và phương thức thanh toán trước khi kích hoạt.</span>
              </Alert>

              {/* Thông tin học viên */}
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-person-badge-fill text-primary me-2"></i>
                  Thông Tin Tài Khoản Kích Hoạt
                </h6>
                <div className="row g-2 small text-secondary">
                  <div className="col-sm-6">
                    Họ và tên: <strong className="text-dark">{currentUser?.fullName}</strong>
                  </div>
                  <div className="col-sm-6">
                    Email nhận bài học: <strong className="text-dark">{currentUser?.email}</strong>
                  </div>
                  <div className="col-sm-6">
                    Số điện thoại: <strong className="text-dark">{currentUser?.phone || 'Chưa cung cấp'}</strong>
                  </div>
                  <div className="col-sm-6">
                    Thời điểm tạo đơn: <strong className="text-dark">{new Date().toLocaleString('vi-VN')}</strong>
                  </div>
                </div>
              </div>

              {/* Danh sách khóa học */}
              <h6 className="fw-bold text-dark mb-2">
                <i className="bi bi-journal-bookmark-fill text-success me-2"></i>
                Danh Sách Khóa Học Trong Đơn ({items.length})
              </h6>
              <div className="table-responsive border rounded-3 mb-3">
                <table className="table table-sm table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2 ps-3">Khóa học</th>
                      <th className="text-center py-2">Thời hạn học</th>
                      <th className="text-end py-2 pe-3">Giá niêm yết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((course, idx) => (
                      <tr key={idx}>
                        <td className="ps-3 py-2">
                          <div className="fw-bold text-dark">{course.title}</div>
                          <span className="badge bg-primary-subtle text-primary border me-1">Mã #{course.course_id}</span>
                          <span className="text-muted">Cấp chứng chỉ hoàn thành</span>
                        </td>
                        <td className="text-center py-2 text-success fw-bold">Trọn đời (Lifetime)</td>
                        <td className="text-end pe-3 py-2 font-monospace fw-bold">
                          {Number(course.price).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chi tiết thanh toán & Phương thức */}
              <div className="p-3 border rounded-3 bg-white mb-3 shadow-xs">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-credit-card-2-front-fill text-warning me-2"></i>
                  Chi Tiết Thanh Toán & Ưu Đãi
                </h6>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Tạm tính giá gốc:</span>
                  <span className="font-monospace">{rawTotal.toLocaleString('vi-VN')} đ</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between small text-success mb-1">
                    <span>Mã giảm giá ({appliedCoupon?.code}):</span>
                    <span className="font-monospace fw-bold">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Phí dịch vụ & Cổng thanh toán:</span>
                  <span className="badge bg-success-subtle text-success">0 đ (Miễn phí)</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Phương thức đã chọn:</span>
                  <span className="fw-bold text-primary">
                    {paymentMethod === 'WALLET' && 'Ví EduViet (Trừ trực tiếp số dư)'}
                    {paymentMethod === 'BANK_QR' && 'Chuyển khoản QR Ngân hàng (Vietcombank)'}
                    {paymentMethod === 'MOMO' && 'Ví điện tử MoMo Auto-Pay'}
                  </span>
                </div>
                {paymentMethod === 'WALLET' && (
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Số dư ví hiện tại:</span>
                    <span className="font-monospace fw-bold">{walletBalance.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {paymentMethod === 'WALLET' && (
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Số dư ví còn lại sau thanh toán:</span>
                    <span className="font-monospace fw-bold text-success">
                      {(walletBalance - finalTotal).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-baseline">
                  <strong className="text-dark fs-6">SỐ TIỀN CẦN THANH TOÁN:</strong>
                  <strong className="fs-3 fw-bold text-danger font-monospace">
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              {/* Cam kết & Chính sách */}
              <div className="p-3 bg-light rounded-3 small text-muted border">
                <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                  <i className="bi bi-shield-fill-check text-success"></i> Cam Kết Quyền Lợi Học Viên:
                </div>
                <ul className="mb-0 ps-3">
                  <li>Khóa học được kích hoạt tự động vào mục "Khóa học của tôi" ngay sau khi giao dịch hoàn tất.</li>
                  <li>Bảo hành truy cập trọn đời, được cập nhật miễn phí giáo trình và bài tập mới.</li>
                  <li>Hỗ trợ hoàn tiền 100% trong vòng 7 ngày nếu không hài lòng theo chính sách EduEnglish.</li>
                </ul>
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4 fw-bold"
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                <i className="bi bi-arrow-left me-1"></i> Sửa Lại / Hủy
              </Button>
              <Button
                variant="success"
                className="rounded-pill px-4 fw-bold shadow-sm"
                onClick={handleConfirmOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-1"></i> Đồng Ý & Thanh Toán Ngay
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}
