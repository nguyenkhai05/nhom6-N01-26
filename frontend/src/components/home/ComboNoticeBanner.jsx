import { useState, useEffect } from 'react';
import { Container, Badge, Button, Modal, Row, Col, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { getBundles, getBundleQuote, checkoutBundle } from '../../services/hubApi';

export default function ComboNoticeBanner({ currentUser, onOpenDeposit, onNavigate }) {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getBundles()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setBundles(data);
        }
      })
      .catch((err) => console.error('Lỗi tải thông báo combo:', err));
    return () => {
      isMounted = false;
    };
  }, []);

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
      if (currentUser && res.balance_after !== undefined) {
        currentUser.walletBalance = res.balance_after;
      }
      setTimeout(() => {
        setShowModal(false);
        setSelectedBundle(null);
        onNavigate?.('my-learning');
      }, 1500);
    } catch (err) {
      setAlertInfo({ variant: 'danger', message: err.message || 'Thanh toán combo thất bại' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const maxSaving = bundles.length > 0 
    ? Math.max(...bundles.map(b => b.savings_percent || 0)) 
    : 22;

  return (
    <>
      {/* 1. Thanh Thông Báo Nổi Bật Trên Trang Chủ */}
      {!isDismissed ? (
        <div 
          className="combo-announcement-bar py-2 px-3 shadow-sm border-bottom"
          style={{
            background: 'linear-gradient(90deg, #0d3b66 0%, #174276 50%, #001e3d 100%)',
            color: '#ffffff',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="container-fluid px-lg-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className="badge rounded-pill text-dark fw-bold px-3 py-1" style={{ backgroundColor: '#ffb700' }}>
                <i className="bi bi-megaphone-fill me-1"></i> THÔNG BÁO ƯU ĐÃI
              </span>
              <span className="small fw-semibold">
                🔥 <strong>Tiết kiệm đến {maxSaving}%</strong> khi đăng ký học theo <strong>Gói Combo</strong> (Fullstack, DevOps AI, Mobile Flutter).
              </span>
              <span className="small text-light d-none d-md-inline opacity-75">
                | Thuật toán Smart Quote tự động khấu trừ học phí các khóa bạn đã sở hữu!
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 ms-auto">
              <button
                type="button"
                className="btn btn-sm fw-bold px-3 py-1 rounded-pill shadow-sm"
                style={{ backgroundColor: '#ffb700', color: '#0d3b66', border: 'none' }}
                onClick={() => {
                  setShowModal(true);
                  if (bundles.length > 0 && !selectedBundle) {
                    handleOpenQuote(bundles[0]);
                  }
                }}
              >
                <i className="bi bi-tag-fill me-1"></i> Xem Chi Tiết Combo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-link text-white-50 p-0 text-decoration-none ms-1"
                onClick={() => setIsDismissed(true)}
                title="Tạm ẩn thông báo này"
                style={{ fontSize: '1.2rem', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Nút Ghim Nhỏ Mở Lại Thông Báo Khi Đã Ẩn */
        <div className="position-fixed bottom-0 start-0 m-3" style={{ zIndex: 1050 }}>
          <button
            type="button"
            className="btn btn-sm rounded-pill shadow d-flex align-items-center gap-2 px-3 py-2 fw-semibold border"
            style={{ backgroundColor: '#0d3b66', color: '#ffb700', borderColor: '#ffb700' }}
            onClick={() => setIsDismissed(false)}
          >
            <i className="bi bi-bell-fill"></i>
            <span>Ưu Đãi Combo (-{maxSaving}%)</span>
          </button>
        </div>
      )}

      {/* 2. Modal Thông Báo Chi Tiết & Báo Giá Smart Quote */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        className="combo-notice-modal"
      >
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)', color: '#fff' }}>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-tags-fill text-warning"></i>
            Thông Báo Ưu Đãi: Các Gói Combo Đang Mở Bán
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="alert alert-info py-2 px-3 rounded-3 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-info-circle-fill fs-5 text-primary"></i>
            <div>
              <strong>Chính sách giá minh bạch:</strong> Khi đăng ký gói Combo, nếu bạn đã từng mua 1 hoặc nhiều khóa học trong gói, hệ thống sẽ <strong>tự động trừ tiền tương ứng</strong>, bạn chỉ cần trả phần chênh lệch ưu đãi!
            </div>
          </div>

          {/* Danh Sách Chọn Gói Combo */}
          <div className="mb-4">
            <label className="fw-bold small text-muted text-uppercase mb-2">Chọn gói Combo bạn quan tâm:</label>
            <Row className="g-2">
              {bundles.map((b) => (
                <Col key={b.bundle_id} md={4} sm={6}>
                  <div 
                    className={`p-3 rounded-3 border h-100 cursor-pointer transition ${selectedBundle?.bundle_id === b.bundle_id ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white hover-shadow'}`}
                    onClick={() => handleOpenQuote(b)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <Badge bg="danger" className="rounded-pill">-{b.savings_percent}%</Badge>
                      <small className="text-muted">{b.items?.length || 2} khóa</small>
                    </div>
                    <div className="fw-bold text-dark small mb-1" style={{ minHeight: '38px', lineHeight: 1.3 }}>
                      {b.title}
                    </div>
                    <div className="d-flex align-items-baseline gap-1 mt-2">
                      <span className="fw-bold text-primary">{Number(b.bundle_price).toLocaleString('vi-VN')} đ</span>
                      <s className="text-muted x-small">{Number(b.retail_total).toLocaleString('vi-VN')} đ</s>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Chi Tiết Báo Giá Smart Quote */}
          {selectedBundle && (
            <div className="border rounded-4 p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-calculator text-primary"></i>
                  Báo Giá Trực Tiếp Từ Máy Chủ (Smart Quote)
                </h6>
                <Badge bg="success" className="px-2 py-1">Tiết kiệm {Number(selectedBundle.savings_amount).toLocaleString('vi-VN')} đ</Badge>
              </div>

              {quoteLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <span className="ms-2 small text-muted">Đang phân bổ chiết khấu máy chủ...</span>
                </div>
              ) : quote ? (
                <div>
                  <Table responsive size="sm" className="mb-3 bg-white rounded border">
                    <thead className="table-light">
                      <tr className="small">
                        <th>Khóa học trong gói</th>
                        <th className="text-end">Giá gốc</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-end">Giá phân bổ</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {quote.items?.map((it) => (
                        <tr key={it.course_id}>
                          <td>{it.title}</td>
                          <td className="text-end text-muted">{Number(it.original_price).toLocaleString('vi-VN')} đ</td>
                          <td className="text-center">
                            {it.is_already_owned ? (
                              <Badge bg="secondary">Đã sở hữu (-100%)</Badge>
                            ) : (
                              <Badge bg="success-subtle" className="text-success border border-success-subtle">
                                Trong gói
                              </Badge>
                            )}
                          </td>
                          <td className="text-end fw-bold">
                            {it.is_already_owned ? (
                              <span className="text-success">0 đ (Đã trừ)</span>
                            ) : (
                              `${Number(it.final_price).toLocaleString('vi-VN')} đ`
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded-3 border mb-3">
                    <div>
                      <small className="text-muted d-block">Tổng học phí cần thanh toán:</small>
                      <span className="fs-4 fw-bold text-danger">
                        {Number(quote.final_amount).toLocaleString('vi-VN')} đ
                      </span>
                      {quote.owned_count > 0 && (
                        <small className="text-success d-block">
                          Đã tự động giảm trừ {quote.owned_count} khóa học bạn đã có!
                        </small>
                      )}
                    </div>

                    <div className="text-end">
                      <small className="text-muted d-block">
                        Số dư ví hiện tại: <strong>{Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                      </small>
                      {currentUser && currentUser.walletBalance < quote.final_amount && (
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="mt-1 fw-bold text-dark"
                          onClick={() => {
                            setShowModal(false);
                            onOpenDeposit?.();
                          }}
                        >
                          <i className="bi bi-wallet2 me-1"></i> Nạp thêm ví
                        </Button>
                      )}
                    </div>
                  </div>

                  {alertInfo && (
                    <Alert variant={alertInfo.variant} className="py-2 small">
                      {alertInfo.message}
                    </Alert>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                      Để sau
                    </Button>
                    {!currentUser ? (
                      <Button variant="primary" size="sm" className="fw-bold" onClick={() => alert('Vui lòng đăng nhập để thanh toán combo')}>
                        <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập để mua
                      </Button>
                    ) : (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="fw-bold px-4" 
                        disabled={checkoutLoading || currentUser.walletBalance < quote.final_amount}
                        onClick={handleCheckout}
                      >
                        {checkoutLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Đang xử lý giao dịch...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-1"></i> Thanh Toán Gói Ngay
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
