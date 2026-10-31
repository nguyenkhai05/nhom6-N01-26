import { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { ShimmerButton, TypingText } from './components/animate-ui/index.js';

export default function Her({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [techCategory, setTechCategory] = useState('ALL');
  const [level, setLevel] = useState('ALL');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ keyword, techCategory, level });
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="booking-hero" id="home">
      <Container className="booking-container">
        <div className="booking-hero-copy">
          <h1 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>
            Học lập trình để <span className="text-warning">tự xây dựng sản phẩm</span>
          </h1>
          <p className="text-light opacity-90 fs-6 mb-3">
            Nắm vững kiến thức cốt lõi từ Frontend React 19, Backend NestJS đến AI & DevOps. Học thử tương tác miễn phí và làm chủ công nghệ thực chiến.
          </p>
        </div>
        <Form className="booking-search-box" onSubmit={handleSubmit}>
          <div className="booking-search-inner">
            <div className="booking-search-field search-keyword">
              <i className="bi bi-search" />
              <div className="booking-field-content">
                <label className="booking-label">Bạn muốn học gì?</label>
                <Form.Control
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="React, NestJS, Python, MySQL..."
                  aria-label="Từ khóa khóa học"
                />
              </div>
            </div>
            <div className="booking-search-field">
              <i className="bi bi-grid" />
              <div className="booking-field-content">
                <label className="booking-label">Chuyên ngành</label>
                <Form.Select
                  value={techCategory}
                  onChange={(e) => setTechCategory(e.target.value)}
                  aria-label="Chuyên ngành"
                >
                  <option value="ALL">Tất cả chuyên ngành</option>
                  <option value="Frontend">Frontend (React, Vue)</option>
                  <option value="Backend">Backend (Node, NestJS, Go)</option>
                  <option value="Cơ sở dữ liệu">Cơ sở dữ liệu & SQL</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Mobile">Lập trình Mobile</option>
                </Form.Select>
              </div>
            </div>
            <div className="booking-search-field">
              <i className="bi bi-bar-chart" />
              <div className="booking-field-content">
                <label className="booking-label">Trình độ</label>
                <Form.Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  aria-label="Trình độ"
                >
                  <option value="ALL">Mọi trình độ</option>
                  <option value="Beginner">Người mới bắt đầu</option>
                  <option value="Intermediate">Đã có nền tảng</option>
                  <option value="Advanced">Chuyên sâu / Nâng cao</option>
                </Form.Select>
              </div>
            </div>
            <ShimmerButton
              type="submit"
              className="booking-search-submit text-white"
            >
              Tìm khóa học
            </ShimmerButton>
          </div>
        </Form>
        <div className="booking-hero-checks text-white">
          <span>
            <i className="bi bi-check-circle-fill" /> Học theo lộ trình thực chiến
          </span>
          <span>
            <i className="bi bi-check-circle-fill" /> Khóa học cho mọi trình độ
          </span>
        </div>
      </Container>
    </section>
  );
}
