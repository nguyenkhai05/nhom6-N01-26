import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="site-footer mt-5">
      <Container className="py-5">
        <Row className="gy-4">
          {/* Thông tin thương hiệu EduViet */}
          <Col xs={12} md={6} lg={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-badge" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
                <i className="bi bi-code-slash"></i>
              </span>
              <h4 className="footer-brand mb-0">EduViet Code</h4>
            </div>
            <p className="footer-text mb-3">
              Nền tảng đào tạo lập trình thực chiến trực tuyến hàng đầu Việt Nam. 
              Chúng tôi trang bị kỹ năng chuyên sâu từ Frontend, Backend, Database đến DevOps và AI, 
              sẵn sàng đáp ứng tiêu chuẩn tuyển dụng của các tập đoàn công nghệ.
            </p>
            <div className="d-flex gap-3">
              <a href="#github" className="footer-social fs-5"><i className="bi bi-github"></i></a>
              <a href="#facebook" className="footer-social fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#youtube" className="footer-social fs-5"><i className="bi bi-youtube"></i></a>
              <a href="#linkedin" className="footer-social fs-5"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>

          {/* Khóa học Lập trình */}
          <Col xs={6} md={3} lg={2}>
            <h5 className="footer-title">Khóa Lập Trình</h5>
            <ul className="footer-links">
              <li><a href="#courses">ReactJS & Vite</a></li>
              <li><a href="#courses">Node.js & NestJS</a></li>
              <li><a href="#courses">Cơ sở dữ liệu MySQL</a></li>
              <li><a href="#courses">Python & Trí tuệ AI</a></li>
              <li><a href="#courses">Docker & DevOps</a></li>
            </ul>
          </Col>

          {/* Lộ trình & Tài nguyên */}
          <Col xs={6} md={3} lg={2}>
            <h5 className="footer-title">Tài Nguyên Dev</h5>
            <ul className="footer-links">
              <li><a href="#roadmap">Lộ trình Frontend</a></li>
              <li><a href="#roadmap">Lộ trình Backend</a></li>
              <li><a href="#practice">Sân chơi luyện Code</a></li>
              <li><a href="#docs">Tài liệu API Docs</a></li>
              <li><a href="#community">Cộng đồng Discord</a></li>
            </ul>
          </Col>

          {/* Nhận bản tin công nghệ */}
          <Col xs={12} md={12} lg={4}>
            <h5 className="footer-title">Bản Tin Lập Trình Tuần</h5>
            <p className="footer-text">
              Nhận thông báo bài viết công nghệ mới, webinar chia sẻ từ Tech Lead và mã giảm giá độc quyền.
            </p>

            <Form
              onSubmit={(event) => {
                event.preventDefault();
                alert('Cảm ơn bạn đã đăng ký nhận bản tin EduViet!');
              }}
              className="d-flex gap-2"
            >
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn..."
                required
                className="bg-dark text-white border-secondary"
              />
              <Button type="submit" variant="primary" className="fw-bold text-nowrap">
                Đăng ký
              </Button>
            </Form>
          </Col>
        </Row>

        <hr className="footer-divider my-4" />

        <Row className="align-items-center gy-2">
          <Col md={6}>
            <p className="footer-copyright mb-0">
              © {new Date().getFullYear()} EduViet Code Platform. Toàn bộ bản quyền được bảo lưu.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <span className="text-secondary small">
              Xây dựng trên kiến trúc Master Edu Template • React + Bootstrap
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
