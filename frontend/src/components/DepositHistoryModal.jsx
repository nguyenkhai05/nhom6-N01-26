import React from 'react';
import { Modal, Table, Badge, Button, Card, Row, Col } from 'react-bootstrap';

export default function DepositHistoryModal({
  show,
  onHide,
  depositHistory = [],
  currentUser,
  onOpenDeposit
}) {
  const totalDeposited = depositHistory
    .filter(item => item.status === 'Thành công')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-rounded">
      <Modal.Header closeButton className="border-bottom-0 pb-1 pt-3 px-4">
        <div>
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-dark">
            <span
              className="bg-warning bg-opacity-25 text-warning-emphasis rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
              style={{ width: 42, height: 42 }}
            >
              <i className="bi bi-clock-history fs-5"></i>
            </span>
            <span>Lịch Sử Giao Dịch & Nạp Tiền Ví</span>
          </Modal.Title>
          <p className="text-secondary small mb-0 mt-1">
            Theo dõi chi tiết các lần nạp tiền, ưu đãi quà tặng và trạng thái giao dịch ví EduViet.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* KPI Thống Kê Nhanh */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Card className="border-0 rounded-4 bg-light p-3">
              <span className="small text-muted fw-semibold">Số Dư Khả Dụng Hiện Tại</span>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <span className="fs-3 fw-bold text-success">
                  {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')}
                </span>
                <span className="small text-muted fw-bold">VNĐ</span>
              </div>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 rounded-4 bg-light p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="small text-muted fw-semibold">Tổng Đã Nạp / Thưởng</span>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <span className="fs-3 fw-bold text-primary">
                      {totalDeposited.toLocaleString('vi-VN')}
                    </span>
                    <span className="small text-muted fw-bold">VNĐ</span>
                  </div>
                </div>
                <Button
                  variant="success"
                  size="sm"
                  className="fw-bold rounded-pill px-3 shadow-sm"
                  onClick={() => {
                    onHide();
                    onOpenDeposit();
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i> Nạp thêm
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bảng Lịch Sử Giao Dịch */}
        <div className="table-responsive rounded-4 border bg-white overflow-hidden shadow-sm">
          <Table hover className="align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th className="py-3 px-3">Mã Giao Dịch</th>
                <th className="py-3">Thời Gian</th>
                <th className="py-3">Phương Thức</th>
                <th className="py-3 text-end">Số Tiền</th>
                <th className="py-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {depositHistory && depositHistory.length > 0 ? (
                depositHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3">
                      <span className="fw-bold font-monospace text-dark">{item.id}</span>
                      <small className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                        {item.note || 'Nạp ví học tập'}
                      </small>
                    </td>
                    <td className="py-3 text-muted small">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.date}
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border px-2 py-1 rounded-3">
                          {item.method || 'QR Ngân hàng / ATM'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-end fw-bold text-success font-monospace">
                      +{Number(item.amount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        bg={item.status === 'Thành công' ? 'success' : 'warning'}
                        className="rounded-pill px-2 py-1 fw-semibold"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className={`bi ${item.status === 'Thành công' ? 'bi-check-circle-fill' : 'bi-hourglass-split'} me-1`}></i>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                    Chưa có giao dịch nạp tiền nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top-0 pt-0 px-4 pb-3">
        <Button variant="secondary" className="rounded-pill px-4 fw-semibold" onClick={onHide}>
          Đóng
        </Button>
        <Button
          variant="primary"
          className="rounded-pill px-4 fw-bold"
          onClick={() => {
            onHide();
            onOpenDeposit();
          }}
        >
          <i className="bi bi-wallet2 me-1"></i> Nạp Tiền Ngay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
