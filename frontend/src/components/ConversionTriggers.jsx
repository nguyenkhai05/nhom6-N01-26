import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default function ConversionTriggers({ onClaimBonus, onExploreRoadmap }) {
  const guarantees = [
    {
      icon: 'bi-shield-check',
      title: 'Chính Sách Hoàn Phí 7 Ngày',
      desc: 'Bảo đảm quyền lợi học viên trong 7 ngày đầu. Nếu cảm thấy nội dung chưa phù hợp, bạn được hoàn trả 100% học phí theo quy chế.',
      color: 'text-success',
      bg: 'bg-success bg-opacity-10'
    },
    {
      icon: 'bi-laptop-fill',
      title: 'Học Qua Dự Án Thực Chiến',
      desc: 'Mỗi khóa học đều đi kèm đồ án lớn hoàn chỉnh (Fullstack, Microservices, App di động), giúp bạn có sản phẩm thật trong portfolio.',
      color: 'text-primary',
      bg: 'bg-primary bg-opacity-10'
    },
    {
      icon: 'bi-code-square',
      title: 'Code Sandbox Trực Tiếp',
      desc: 'Trình biên dịch và chạy code trong Web Worker Sandbox an toàn, phản hồi kết quả tức thì và tự động phát hiện lỗi vòng lặp.',
      color: 'text-warning',
      bg: 'bg-warning bg-opacity-10'
    },
    {
      icon: 'bi-award-fill',
      title: 'Chứng Nhận Hoàn Thành Khóa',
      desc: 'Cấp chứng nhận hoàn thành khóa học có mã số định danh kiểm tra trực tuyến, giúp khẳng định năng lực chuyên môn trong CV.',
      color: 'text-danger',
      bg: 'bg-danger bg-opacity-10'
    }
  ];

  const studentReviews = [
    {
      name: 'Nguyễn Đình Khang',
      role: 'Học viên Frontend React 19',
      course: 'Lộ trình Frontend ReactJS & Next.js',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Giáo trình bám sát các tính năng mới nhất của React 19 và Server Components. Cách thầy phân tích vòng đời và tối ưu render bằng ví dụ thực tế giúp mình hiểu rõ bản chất thay vì học thuộc lòng.',
      rating: 5,
      badge: 'Đã hoàn thành 100%'
    },
    {
      name: 'Trần Bích Phương',
      role: 'Học viên Backend NestJS',
      course: 'Kiến trúc NestJS & CSDL MySQL',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      comment: 'Khóa học dạy rất sâu về Clean Architecture, phân tách tầng Controller - Service - Repository và tối ưu Indexing trong MySQL. Rất thích hợp cho ai muốn nâng tầm tư duy hệ thống.',
      rating: 5,
      badge: 'Đã hoàn thành đồ án'
    },
    {
      name: 'Lê Minh Tuấn',
      role: 'Học viên Python & AI',
      course: 'Python for AI & Data Science',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Trải nghiệm vừa học video vừa thực hành code ngay trong sandbox rất thuận tiện, không cần tốn thời gian cài đặt môi trường ban đầu phức tạp.',
      rating: 5,
      badge: 'Học viên tích cực'
    }
  ];

  return (
    <div className="conversion-triggers-section py-4">
      {/* 1. Thanh Số Liệu Năng Lực Nền Tảng (Platform Highlights Strip) */}
      <div className="bg-white rounded-4 border p-4 shadow-sm mb-5">
        <Row className="g-4 text-center">
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-primary mb-1">8+</div>
            <div className="text-secondary small fw-semibold">Khóa Học Chuyên Sâu</div>
          </Col>
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-success mb-1">100%</div>
            <div className="text-secondary small fw-semibold">Thực Hành Sandbox Trực Tiếp</div>
          </Col>
          <Col xs={6} md={3} className="border-end-md">
            <div className="display-6 fw-bold text-warning mb-1">4</div>
            <div className="text-secondary small fw-semibold">Giảng Viên Chuyên Môn</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="display-6 fw-bold text-danger mb-1">7 Ngày</div>
            <div className="text-secondary small fw-semibold">Cam Kết Hoàn Học Phí</div>
          </Col>
        </Row>
      </div>

      {/* 2. Cam Kết Vàng 4 Trụ Cột (Tại sao nên chọn EduViet) */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
            GIÁ TRỊ ĐÀO TẠO
          </span>
          <h2 className="fw-bold text-dark mb-2">Phương Pháp Đào Tạo Thực Chiến & Minh Bạch</h2>
          <p className="text-secondary small mx-auto" style={{ maxWidth: 650 }}>
            EduViet tập trung vào chất lượng đào tạo thực chất: kết hợp video bài giảng chi tiết, thực hành code trực tiếp trong sandbox và hỗ trợ giải đáp từ giảng viên.
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

      {/* 3. Đánh Giá Từ Học Viên (Testimonials / Stories) */}
      <div className="mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              CẢM NHẬN HỌC VIÊN
            </span>
            <h2 className="fw-bold text-dark mb-1">Học Viên Nói Gì Về Trải Nghiệm Học Tập</h2>
            <p className="text-secondary small mb-0">Phản hồi thực tế từ các học viên đang theo học các chương trình chuyên sâu tại EduViet.</p>
          </div>
          <div className="mt-2 mt-md-0">
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
              <i className="bi bi-patch-check-fill me-1"></i> Đánh giá từ tài khoản học viên
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

                <div className="text-warning small mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill me-1"></i>
                  ))}
                </div>

                <p className="text-secondary small flex-grow-1 mb-3" style={{ lineHeight: '1.6' }}>
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted text-truncate" style={{ maxWidth: 180 }}>{rev.course}</small>
                  <span className="badge bg-light text-secondary border small">{rev.badge}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
