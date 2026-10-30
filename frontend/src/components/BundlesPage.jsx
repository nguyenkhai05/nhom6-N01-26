import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Alert, Spinner, Table } from 'react-bootstrap';
import { getBundles, getBundleQuote, checkoutBundle } from '../services/hubApi';

export default function BundlesPage({ currentUser, onNavigate, onCourseSelect }) {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const data = await getBundles();
      setBundles(data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách combo:', err);
    } finally {
      setLoading(false);
    }
  };

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
      // Cập nhật số dư ví phía client nếu có
      if (currentUser && res.balance_after !== undefined) {
        currentUser.walletBalance = res.balance_after;
      }
      setTimeout(() => {
        setSelectedBundle(null);
        onNavigate?.('my-learning');
      }, 1500);
    } catch (err) {
      setAlertInfo({ variant: 'danger', message: err.message || 'Thanh toán combo thất bại' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bundles-page pb-5">
      {/* Header Banner */}
      <section className="bg-primary text-white py-5 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}>
        <Container className="app-container">
          <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-tags-fill me-1"></i> ƯU ĐÃI TRỌN GÓI 2026
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Combo Khóa Học Tiết Kiệm Đến 35%</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 800 }}>
            Tiết kiệm tối đa chi phí với các gói lộ trình học trọn vẹn. Thuật toán Smart Quote tự động trừ tiền các khóa bạn đã sở hữu, đảm bảo bạn không bao giờ phải trả hai lần cho cùng một khóa học!
          </p>
        </Container>
      </section>

      <Container className="app-container">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải danh sách combo ưu đãi...</p>
          </div>
        ) : (
          <Row className="g-4">
            {bundles.map((bundle) => (
              <Col key={bundle.bundle_id} lg={4} md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column hover-shadow">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={bundle.thumbnail_url}
                      alt={bundle.title}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold shadow-sm"
                    >
                      Tiết kiệm {bundle.savings_percent}%
                    </Badge>
                  </div>

                  <Card.Body className="d-flex flex-column p-4">
                    <h5 className="fw-bold text-dark mb-2 line-clamp-2" style={{ minHeight: 48 }}>
                      {bundle.title}
                    </h5>
                    <p className="text-muted small mb-3 flex-grow-1 line-clamp-3">
                      {bundle.description}
                    </p>

                    {/* Danh sách các khóa thành phần */}
                    <div className="mb-3">
                      <small className="fw-bold text-secondary d-block mb-1">
                        <i className="bi bi-collection-play me-1"></i> Gồm {bundle.items?.length || 0} khóa học thành phần:
                      </small>
                      <div className="d-flex flex-column gap-1">
                        {bundle.items?.map((item, idx) => (
                          <div key={idx} className="small bg-light p-2 rounded border d-flex justify-content-between align-items-center">
                            <span className="text-truncate me-2" style={{ maxWidth: 220 }}>
                              <i className="bi bi-check2-circle text-success me-1"></i> {item.course?.title}
                            </span>
                            <span className="text-muted fw-semibold">
                              {Number(item.course?.price || 0).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* So sánh giá */}
                    <div className="pt-3 border-top mt-auto">
                      <div className="d-flex justify-content-between align-items-baseline mb-1">
                        <span className="text-muted small">Tổng giá mua lẻ:</span>
                        <span className="text-decoration-line-through text-muted small">
                          {Number(bundle.retail_total || 0).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-baseline mb-3">
                        <span className="fw-bold text-dark">Giá combo ưu đãi:</span>
                        <span className="fs-4 fw-bold text-danger">
                          {Number(bundle.bundle_price || 0).toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        className="w-100 fw-bold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleOpenQuote(bundle)}
                      >
                        <i className="bi bi-calculator"></i>
                        <span>Xem Báo Giá & Mua Gói</span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal Smart Quote & Mua Gói */}
      <Modal show={!!selectedBundle} onHide={() => setSelectedBundle(null)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-primary">
            <i className="bi bi-receipt-cutoff me-2"></i> Báo Giá Thông Minh (Smart Quote)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {alertInfo && (
            <Alert variant={alertInfo.variant} className="rounded-3 shadow-sm">
              <i className={`bi ${alertInfo.variant === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
              {alertInfo.message}
            </Alert>
          )}

          {quoteLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang đối soát quyền sở hữu và tính toán phân bổ giá...</p>
            </div>
          ) : quote ? (
            <div>
              <h5 className="fw-bold text-dark mb-1">{quote.bundle_title}</h5>
              <p className="text-muted small mb-3">
                Thuật toán hệ thống tự động kiểm tra tài khoản của bạn để miễn phí các khóa học bạn đã sở hữu trước đó:
              </p>

              <Table responsive bordered hover className="align-middle mb-4">
                <thead className="table-light">
                  <tr>
                    <th>Khóa học thành phần</th>
                    <th className="text-center">Giá bán lẻ</th>
                    <th className="text-center">Giá phân bổ gói</th>
                    <th className="text-center">Trạng thái quyền học</th>
                    <th className="text-end">Số tiền cần trả</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.allocation_breakdown?.map((item, idx) => (
                    <tr key={idx} className={item.is_owned ? 'table-success' : ''}>
                      <td className="fw-semibold">
                        <i className={`bi ${item.is_owned ? 'bi-shield-check text-success' : 'bi-book'} me-2`}></i>
                        {item.course_title}
                      </td>
                      <td className="text-center text-muted">
                        {Number(item.retail_price).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="text-center fw-semibold text-secondary">
                        {Number(item.allocated_price).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="text-center">
                        {item.is_owned ? (
                          <Badge bg="success" className="px-2 py-1">
                            <i className="bi bi-check-lg me-1"></i> Đã sở hữu
                          </Badge>
                        ) : (
                          <Badge bg="primary" className="px-2 py-1">
                            <i className="bi bi-plus-circle me-1"></i> Sẽ kích hoạt
                          </Badge>
                        )}
                      </td>
                      <td className="text-end fw-bold">
                        {item.is_owned ? (
                          <span className="text-success">0đ</span>
                        ) : (
                          <span>{Number(item.payable_amount).toLocaleString('vi-VN')}đ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light fw-bold">
                    <td colSpan={4} className="text-end">TỔNG SỐ TIỀN CẦN THANH TOÁN:</td>
                    <td className="text-end text-danger fs-5">
                      {Number(quote.final_amount).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                </tfoot>
              </Table>

              {quote.already_owned_all ? (
                <Alert variant="info" className="d-flex align-items-center gap-3">
                  <i className="bi bi-award-fill fs-2 text-primary"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Tuyệt vời! Bạn đã sở hữu tất cả các khóa học trong combo này.</h6>
                    <p className="mb-0 small">Bạn không cần phải thanh toán thêm bất kỳ khoản phí nào.</p>
                  </div>
                </Alert>
              ) : (
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">Hình thức thanh toán:</small>
                      <span className="fw-bold text-dark">
                        <i className="bi bi-wallet2 text-primary me-1"></i> Số dư Ví EduViet
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Số dư hiện tại:</small>
                      <span className="fw-bold text-success">
                        {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setSelectedBundle(null)}>
            Đóng
          </Button>
          {quote?.already_owned_all ? (
            <Button variant="success" className="fw-bold px-4" onClick={() => { setSelectedBundle(null); onNavigate?.('my-learning'); }}>
              <i className="bi bi-play-circle-fill me-1"></i> Vào Phòng Học Ngay
            </Button>
          ) : (
            <Button
              variant="danger"
              className="fw-bold px-4 shadow-sm"
              disabled={quoteLoading || checkoutLoading || quote?.already_owned_all}
              onClick={handleCheckout}
            >
              {checkoutLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" /> Đang thanh toán...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-1"></i> Xác Nhận Thanh Toán ({Number(quote?.final_amount || 0).toLocaleString('vi-VN')}đ)
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
