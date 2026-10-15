import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function Her({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [techCategory, setTechCategory] = useState('ALL');
  const [level, setLevel] = useState('ALL');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, techCategory, level });
    }
  };

  return (
    <div className="app-container pt-4">
      {/* Banner Hero Lập Trình */}
      <div className="banner-section p-4 p-md-5 mb-4">
        <Row className="align-items-center">
          <Col lg={8}>
            <span className="badge hero-code-badge px-3 py-2 rounded-pill fw-semibold mb-3">
              <i className="bi bi-cpu me-1"></i> NỀN TẢNG ĐÀO TẠO KỸ SƯ LẬP TRÌNH THỰC CHIẾN
            </span>
            <h1 className="text-white display-5 fw-bold mb-3">
              Học Lập Trình Chuẩn Doanh Nghiệp Cùng EduViet
            </h1>
            <p className="text-light opacity-75 fs-5 mb-4">
              Lộ trình từ Zero đến Master: Web Fullstack (React, Node, NestJS), Python AI/Data, 
              Mobile Flutter & Hệ thống Microservices với dự án thực tế.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="#courses" className="btn btn-primary btn-lg px-4 fw-bold">
                <i className="bi bi-code-slash me-2"></i>Khám phá khóa học
              </a>
              <a href="#roadmap" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                <i className="bi bi-diagram-3 me-2"></i>Xem lộ trình nghề nghiệp
              </a>
            </div>
          </Col>
          <Col lg={4} className="d-none d-lg-block text-center">
            <div className="p-4 bg-dark bg-opacity-50 rounded-4 border border-secondary text-start font-monospace small text-success">
              <div><span className="text-warning">const</span> dev = <span className="text-info">new</span> Developer();</div>
              <div>dev.<span className="text-primary">learn</span>([<span className="text-white">'React'</span>, <span className="text-white">'NestJS'</span>, <span className="text-white">'MySQL'</span>]);</div>
              <div>dev.<span className="text-primary">buildProjects</span>();</div>
              <div className="text-light">// Result: Ready for High-Paying Dev Jobs! 🚀</div>
              <div>dev.<span className="text-primary">achieveDreamJob</span>();</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Booking.com Iconic Yellow Search Bar */}
      <div className="booking-search-box mb-4">
        <Form onSubmit={handleSubmit}>
          <div className="booking-search-inner d-flex flex-column flex-lg-row align-items-stretch">
            {/* Field 1: Search keyword */}
            <div className="booking-search-field flex-grow-1 d-flex align-items-center px-3 py-2">
              <i className="bi bi-search text-muted fs-5 me-2"></i>
              <div className="w-100">
                <label className="booking-label d-block text-muted text-uppercase mb-0">
                  Bạn muốn học công nghệ gì?
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm border-0 p-0 shadow-none fw-semibold"
                  placeholder="React, NestJS, Python, MySQL, Golang..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="booking-search-divider d-none d-lg-block"></div>

            {/* Field 2: Tech Category */}
            <div className="booking-search-field booking-field-dropdown d-flex align-items-center px-3 py-2">
              <i className="bi bi-stack text-primary fs-5 me-2"></i>
              <div className="w-100">
                <label className="booking-label d-block text-muted text-uppercase mb-0">
                  Mảng Lập Trình
                </label>
                <select
                  className="form-select form-select-sm border-0 p-0 shadow-none fw-semibold"
                  value={techCategory}
                  onChange={(e) => setTechCategory(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="ALL">Tất cả chuyên ngành</option>
                  <option value="Frontend">Frontend (React, Vue)</option>
                  <option value="Backend">Backend (Node, NestJS, Go)</option>
                  <option value="Database">Cơ sở dữ liệu & SQL</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Mobile">Lập trình Mobile</option>
                </select>
              </div>
            </div>

            <div className="booking-search-divider d-none d-lg-block"></div>

            {/* Field 3: Target Level */}
            <div className="booking-search-field booking-field-dropdown d-flex align-items-center px-3 py-2">
              <i className="bi bi-trophy text-warning fs-5 me-2"></i>
              <div className="w-100">
                <label className="booking-label d-block text-muted text-uppercase mb-0">
                  Trình độ học viên
                </label>
                <select
                  className="form-select form-select-sm border-0 p-0 shadow-none fw-semibold"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="ALL">Mọi trình độ</option>
                  <option value="Beginner">Người mới bắt đầu (Zero)</option>
                  <option value="Intermediate">Đã có nền tảng (Junior)</option>
                  <option value="Advanced">Chuyên sâu / Nâng cao (Senior)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="p-2 d-flex align-items-center bg-white">
              <Button
                type="submit"
                className="booking-search-submit text-white px-4 py-2 w-100"
              >
                <i className="bi bi-search me-1"></i> Tìm Khóa Học
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}