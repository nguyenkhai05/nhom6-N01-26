import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Offers({ onClaimVoucher, onSelectCombo }) {
  const benefits = [
    { icon: 'bi-calendar2-check', title: 'Học theo lộ trình rõ ràng', text: 'Bắt đầu từ nền tảng, thực hành qua dự án và từng bước nâng cao kỹ năng.' },
    { icon: 'bi-patch-check-fill', title: 'Nội dung thực chiến', text: 'Kiến thức và bài tập được xây dựng để áp dụng vào công việc thực tế.' },
    { icon: 'bi-globe2', title: 'Nhiều chuyên ngành', text: 'Khám phá Frontend, Backend, cơ sở dữ liệu, DevOps và nhiều hơn nữa.' },
    { icon: 'bi-headset', title: 'Luôn có hỗ trợ', text: 'Theo dõi tiến độ học và sử dụng các công cụ hỗ trợ ngay trên EduViet.' }
  ];

  return (
    <Container className="booking-home-sections">
      <section className="booking-promo-card">
        <div className="booking-promo-copy">
          <span className="booking-eyebrow">Ưu đãi dành riêng cho bạn</span>
          <h2>Giảm học phí đến 40% cho combo Fullstack</h2>
          <p>Tiết kiệm chi phí học tập với combo React, NestJS và Docker. Đăng ký để bắt đầu hành trình trở thành lập trình viên thực chiến.</p>
          <Button onClick={onSelectCombo}>Khám phá ưu đãi <i className="bi bi-arrow-right ms-2" /></Button>
        </div>
        <div className="booking-promo-art" aria-hidden="true"><i className="bi bi-mortarboard-fill" /><span>EDUVIET</span></div>
      </section>

      <section className="booking-benefits">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
          <div><h2>Vì sao chọn EduViet?</h2><p>Những công cụ và tài nguyên giúp bạn học hiệu quả hơn.</p></div>
          <button className="booking-text-link" onClick={onClaimVoucher}>Nhận ưu đãi học viên mới <i className="bi bi-arrow-right" /></button>
        </div>
        <Row className="g-3">
          {benefits.map(item => <Col key={item.title} xs={12} sm={6} lg={3}>
            <Card className="booking-benefit-card h-100"><Card.Body>
              <div className="booking-benefit-icon"><i className={`bi ${item.icon}`} /></div>
              <h3>{item.title}</h3><p>{item.text}</p>
            </Card.Body></Card>
          </Col>)}
        </Row>
      </section>
    </Container>
  );
}
