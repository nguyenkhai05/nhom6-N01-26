import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

export default function Offers({ onClaimVoucher, onSelectCombo }) {
  // Countdown Flash Sale (tạo cảm giác cấp bách Urgency)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: 1,
      tag: 'Flash Deal Giới Hạn',
      title: 'Combo Siêu Kỹ Sư Fullstack 2026 (React + NestJS + Docker)',
      desc: 'Giảm sốc 40% trọn gói combo 3 khóa học cốt lõi. Tặng kèm bộ 50 câu hỏi phỏng vấn chuẩn FAANG và tài khoản GitHub Copilot Pro 3 tháng.',
      oldPrice: '2.530.000 đ',
      salePrice: '1.490.000 đ',
      icon: 'bi-lightning-charge-fill',
      bgClass: 'bg-primary text-white',
      btnVariant: 'light',
      btnText: 'Săn Deal Combo Ngay',
      action: onSelectCombo
    },
    {
      id: 2,
      tag: 'Tài Trợ Học Viên Mới',
      title: 'Học Bổng Chuyển Đổi Nghề IT 1.000.000đ Vào Ví',
      desc: 'Áp dụng cho mọi tài khoản đăng ký thành viên mới trong tháng. Trừ thẳng vào giỏ hàng khi ghi danh khóa học bất kỳ.',
      oldPrice: null,
      salePrice: '+1.000.000 đ Ví Học Tập',
      icon: 'bi-gift-fill',
      bgClass: 'bg-warning text-dark',
      btnVariant: 'dark',
      btnText: 'Nhận 1.000.000đ Ngay',
      action: onClaimVoucher
    },
    {
      id: 3,
      tag: 'Chính Sách Hoàn Tiền',
      title: 'Học Thử 7 Ngày - Hoàn Học Phí 100% Không Điều Kiện',
      desc: 'Truy cập toàn bộ video, source code, tham gia nhóm Discord giải đáp. Nếu bạn cảm thấy chưa phù hợp, EduViet hoàn lại 100% học phí.',
      oldPrice: null,
      salePrice: 'Rủi Ro = 0%',
      icon: 'bi-shield-check',
      bgClass: 'bg-dark text-white',
      btnVariant: 'warning',
      btnText: 'Trải Nghiệm Ngay',
      action: onClaimVoucher
    }
  ];

  return (
    <div className="app-container mb-5">
      {/* Header với Đồng Hồ Countdown Khẩn Cấp */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-3 p-md-4 rounded-4 border shadow-sm mb-4">
        <div>
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill fw-bold mb-2">
            <i className="bi bi-fire me-1"></i> TUẦN LỄ ƯU ĐÃI NĂNG LƯỢNG MỚI
          </span>
          <h2 className="h4 fw-bold mb-1 text-dark">
            Chương Trình Học Bổng & Giảm Học Phí Đặc Quyền
          </h2>
          <p className="text-secondary small mb-0">Hỗ trợ tối đa chi phí để bạn tiếp cận kiến thức lập trình đỉnh cao.</p>
        </div>

        {/* Đồng hồ đếm ngược */}
        <div className="mt-3 mt-md-0 d-flex align-items-center gap-2 bg-light p-2 rounded-4 border">
          <span className="small text-danger fw-bold d-flex align-items-center">
            <i className="bi bi-stopwatch-fill fs-5 me-1 text-danger"></i> Ưu đãi kết thúc sau:
          </span>
          <div className="d-flex gap-1 font-monospace fw-bold">
            <span className="bg-dark text-white px-2 py-1 rounded-3">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-dark text-white px-2 py-1 rounded-3">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-danger text-white px-2 py-1 rounded-3">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      <Row className="g-3">
        {deals.map((deal) => (
          <Col md={4} key={deal.id}>
            <Card className={`border-0 rounded-4 shadow-sm p-4 h-100 ${deal.bgClass} hover-lift`}>
              <Card.Body className="d-flex flex-column justify-content-between p-0">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-white text-dark fw-bold px-3 py-1 shadow-sm">
                      <i className={`bi ${deal.icon} me-1 text-primary`}></i>
                      {deal.tag}
                    </span>
                  </div>

                  <h3 className="fs-5 fw-bold mt-2 mb-2">{deal.title}</h3>
                  <p className="small opacity-90 mb-3" style={{ lineHeight: '1.55' }}>
                    {deal.desc}
                  </p>
                </div>

                <div className="border-top border-white border-opacity-25 pt-3 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      {deal.oldPrice && (
                        <span className="text-decoration-line-through small opacity-75 d-block" style={{ fontSize: '0.78rem' }}>
                          Gốc: {deal.oldPrice}
                        </span>
                      )}
                      <strong className="fs-5">{deal.salePrice}</strong>
                    </div>
                  </div>

                  <Button
                    variant={deal.btnVariant}
                    size="sm"
                    className="fw-bold px-3 py-2 w-100 rounded-pill shadow-sm"
                    onClick={() => deal.action?.()}
                  >
                    {deal.btnText} <i className="bi bi-arrow-right ms-1"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}