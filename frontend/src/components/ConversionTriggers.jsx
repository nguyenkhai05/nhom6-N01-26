import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';

export default function ConversionTriggers({ onClaimBonus, onExploreRoadmap }) {
  const guarantees = [
    {
      icon: 'bi-shield-check',
      title: 'Cam Kết Hoàn Học Phí 100%',
      desc: 'Bảo hành chất lượng trong 7 ngày đầu. Nếu không hài lòng với phương pháp giảng dạy, hoàn tiền 100% không hỏi thêm.',
      color: 'text-success',
      bg: 'bg-success bg-opacity-10'
    },
    {
      icon: 'bi-briefcase-fill',
      title: 'Hỗ Trợ Việc Làm & Kết Nối Doanh Nghiệp',
      desc: 'Mạng lưới 120+ đối tác công nghệ (FPT, VNG, Viettel, Momo). Được review CV 1-1 và mock interview cùng Tech Lead.',
      color: 'text-primary',
      bg: 'bg-primary bg-opacity-10'
    },
    {
      icon: 'bi-chat-dots-fill',
      title: 'Mentor 1:1 Hỗ Trợ Gỡ Bug 24/7',
      desc: 'Không lo bị kẹt lỗi lập trình. Đội ngũ trợ giảng & Senior Mentor giải đáp trực tiếp qua chat hoặc Ultraview/Teamviewer.',
      color: 'text-warning',
      bg: 'bg-warning bg-opacity-10'
    },
    {
      icon: 'bi-award-fill',
      title: 'Chứng Chỉ Số Xác Thực Blockchain',
      desc: 'Cấp chứng nhận hoàn thành khóa học có ID định danh chống giả mạo, dễ dàng đính kèm vào LinkedIn và hồ sơ xin việc.',
      color: 'text-danger',
      bg: 'bg-danger bg-opacity-10'
    }
  ];

  const studentReviews = [
    {
      name: 'Nguyễn Đình Khang',
      role: 'Frontend Developer @ Techcombank',
      course: 'Lộ trình Frontend ReactJS & Next.js',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Từ sinh viên ngành khác rẽ ngang sang IT, nhờ giáo trình bám sát dự án thực tế và sự hỗ trợ tận tâm của Mentor EduViet, mình đã pass thử việc vị trí Junior Frontend với mức lương 17.5M sau 5 tháng học!',
      rating: 5,
      badge: 'Tuyển dụng ngay sau tốt nghiệp'
    },
    {
      name: 'Trần Bích Phương',
      role: 'Backend Engineer @ VNG Corp',
      course: 'Kiến trúc NestJS & CSDL MySQL',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      comment: 'Khóa học dạy rất sâu về bản chất: từ Indexing B-Tree, tối ưu query MySQL đến NestJS Clean Architecture. Nhờ đồ án lớn cuối khóa mà mình tự tin trả lời phỏng vấn các câu hỏi hóc búa của anh Technical Lead.',
      rating: 5,
      badge: 'Tăng 60% mức thu nhập'
    },
    {
      name: 'Lê Minh Tuấn',
      role: 'AI & Data Analyst @ Shopee',
      course: 'Python for AI & Data Science',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Trải nghiệm học trên sân chơi Code Arena chấm test tự động cực kỳ trực quan. Cảm giác vừa code vừa nhìn thấy kết quả test xanh mướt tạo động lực học mỗi ngày!',
      rating: 5,
      badge: 'Học viên xuất sắc'
    }
  ];

  return (
    <div className="conversion-triggers-section py-4">
      {/* 1. Thanh Số Liệu Uy Tín (Social Proof Strip) */}
      <div className="bg-white rounded-4 border p-4 shadow-sm mb-5">
        <Row className="g-4 text-center">
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-primary mb-1">15.000+</div>
            <div className="text-secondary small fw-semibold">Học Viên Đã Tốt Nghiệp</div>
          </Col>
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-success mb-1">94.8%</div>
            <div className="text-secondary small fw-semibold">Có Việc Làm Trong 90 Ngày</div>
          </Col>
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-warning mb-1">120+</div>
            <div className="text-secondary small fw-semibold">Doanh Nghiệp CNTT Đối Tác</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="display-6 fw-bold text-danger mb-1">4.92 / 5</div>
            <div className="text-secondary small fw-semibold">Đánh Giá Hài Lòng Tuyệt Đối</div>
          </Col>
        </Row>
      </div>

      {/* 2. Cam Kết Vàng 4 Trụ Cột (Tại sao nên chọn EduViet) */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
            QUYỀN LỢI ĐỘC QUYỀN
          </span>
          <h2 className="fw-bold text-dark mb-2">Cam Kết Đồng Hành Đến Khi Có Việc</h2>
          <p className="text-secondary small mx-auto" style={{ maxWidth: 650 }}>
            EduViet không chỉ bán video bài giảng, chúng tôi cung cấp giải pháp chuyển đổi sự nghiệp toàn diện với người hướng dẫn và bảo hành học tập.
          </p>
        </div>

        <Row className="g-4">
          {guarantees.map((g, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card className="h-100 border-0 rounded-4 shadow-sm p-3 bg-white hover-lift">
                <Card.Body className="d-flex flex-column p-2">
                  <div
                    className={`${g.bg} ${g.color} rounded-4 d-inline-flex align-items-center justify-content-center mb-3`}
                    style={{ width: 52, height: 52, fontSize: '1.5rem' }}
                  >
                    <i className={`bi ${g.icon}`}></i>
                  </div>
                  <h3 className="fs-6 fw-bold text-dark mb-2">{g.title}</h3>
                  <p className="text-secondary small mb-0 flex-grow-1" style={{ lineHeight: '1.55' }}>
                    {g.desc}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3. Đánh Giá Từ Học Viên Thành Đạt (Testimonials / Stories) */}
      <div className="mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              CÂU CHUYỆN THỰC TẾ
            </span>
            <h2 className="fw-bold text-dark mb-1">Học Viên Nói Gì Về EduViet Code</h2>
            <p className="text-secondary small mb-0">Hàng ngàn cựu học viên đang làm việc tại các công ty công nghệ trong & ngoài nước.</p>
          </div>
          <div className="mt-2 mt-md-0">
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
              <i className="bi bi-patch-check-fill me-1"></i> 100% Đánh giá thật đã kiểm duyệt
            </span>
          </div>
        </div>

        <Row className="g-4">
          {studentReviews.map((rev, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-lift d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="rounded-circle object-fit-cover shadow-sm border border-2 border-primary"
                      width={52}
                      height={52}
                    />
                    <div>
                      <strong className="text-dark d-block fs-6">{rev.name}</strong>
                      <span className="text-primary small fw-semibold d-block">{rev.role}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-2 text-warning small">
                  {[...Array(rev.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill me-1"></i>
                  ))}
                </div>

                <p className="text-secondary small flex-grow-1 fst-italic mb-3" style={{ lineHeight: '1.6' }}>
                  "{rev.comment}"
                </p>

                <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                  <span className="badge bg-light text-muted border px-2 py-1 font-monospace" style={{ fontSize: '0.72rem' }}>
                    {rev.course}
                  </span>
                  <span className="badge bg-success-subtle text-success fw-semibold" style={{ fontSize: '0.72rem' }}>
                    {rev.badge}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 4. Banner Kêu Gọi Hành Động (CTA: Tặng 1.000.000đ khi đăng ký thành viên mới) */}
      <div className="rounded-4 p-4 p-md-5 text-white shadow-lg position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)'
        }}
      >
        <Row className="align-items-center position-relative" style={{ zIndex: 2 }}>
          <Col lg={8}>
            <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-3">
              <i className="bi bi-gift-fill me-1"></i> QUÀ TẶNG KHỞI NGHIỆP LẬP TRÌNH 2026
            </span>
            <h2 className="display-6 fw-bold mb-2">Đăng Ký Tài Khoản Nhận Ngay 1.000.000đ Vào Ví</h2>
            <p className="fs-6 opacity-90 mb-4" style={{ maxWidth: 640 }}>
              Áp dụng trừ trực tiếp khi thanh toán các khóa học Lập trình Web Fullstack, Backend NestJS, Database & AI Python. 
              Học thử miễn phí các bài giảng nhập môn trước khi quyết định.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-warning btn-lg px-4 py-2 fw-bold text-dark shadow rounded-pill"
                onClick={onClaimBonus}
              >
                <i className="bi bi-wallet-fill me-2"></i>Nhận 1.000.000đ Ngay
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold rounded-pill"
                onClick={onExploreRoadmap}
              >
                <i className="bi bi-compass me-2"></i>Tư Vấn Lộ Trình 1:1 Miễn Phí
              </button>
            </div>
          </Col>
          <Col lg={4} className="d-none d-lg-block text-center mt-3 mt-lg-0">
            <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-25 backdrop-blur">
              <i className="bi bi-code-square display-1 text-warning mb-2 d-block"></i>
              <h4 className="fw-bold mb-1">Code Mỗi Ngày</h4>
              <p className="small opacity-75 mb-0">Hơn 500+ bài tập thuật toán & test tự động đang chờ đón bạn!</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
