import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

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
          <h1>Học lập trình, mở ra cơ hội tiếp theo</h1>
          <p>Tìm khóa học chất lượng, lộ trình nghề nghiệp và nhiều hơn nữa...</p>
        </div>
        <Form className="booking-search-box" onSubmit={handleSubmit}>
          <div className="booking-search-inner">
            <div className="booking-search-field search-keyword">
              <i className="bi bi-search" />
              <div className="booking-field-content">
                <label className="booking-label">Bạn muốn học gì?</label>
                <Form.Control value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="React, NestJS, Python, MySQL..." aria-label="Từ khóa khóa học" />
              </div>
            </div>
            <div className="booking-search-field">
              <i className="bi bi-grid" />
              <div className="booking-field-content">
                <label className="booking-label">Chuyên ngành</label>
                <Form.Select value={techCategory} onChange={e => setTechCategory(e.target.value)} aria-label="Chuyên ngành">
                  <option value="ALL">Tất cả chuyên ngành</option>
                  <option value="Frontend">Frontend (React, Vue)</option>
                  <option value="Backend">Backend (Node, NestJS, Go)</option>
                  <option value="Database">Cơ sở dữ liệu & SQL</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Mobile">Lập trình Mobile</option>
                </Form.Select>
              </div>
            </div>
            <div className="booking-search-field">
              <i className="bi bi-bar-chart" />
              <div className="booking-field-content">
                <label className="booking-label">Trình độ</label>
                <Form.Select value={level} onChange={e => setLevel(e.target.value)} aria-label="Trình độ">
                  <option value="ALL">Mọi trình độ</option>
                  <option value="Beginner">Người mới bắt đầu</option>
                  <option value="Intermediate">Đã có nền tảng</option>
                  <option value="Advanced">Chuyên sâu / Nâng cao</option>
                </Form.Select>
              </div>
            </div>
            <Button type="submit" className="booking-search-submit">Tìm khóa học</Button>
          </div>
        </Form>
        <div className="booking-hero-checks">
          <span><i className="bi bi-check-circle-fill" /> Học theo lộ trình thực chiến</span>
          <span><i className="bi bi-check-circle-fill" /> Khóa học cho mọi trình độ</span>
        </div>
      </Container>
    </section>
  );
}
