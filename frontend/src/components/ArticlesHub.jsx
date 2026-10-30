import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { getArticles, getArticle, likeArticle } from '../services/hubApi';

const CATEGORIES = [
  { key: 'ALL', label: 'Tất Cả Bài Viết', icon: 'bi-grid-fill' },
  { key: 'Frontend', label: 'Frontend & UI', icon: 'bi-layout-text-window-reverse' },
  { key: 'Backend', label: 'Backend & APIs', icon: 'bi-hdd-network-fill' },
  { key: 'DevOps', label: 'DevOps & Cloud', icon: 'bi-clouds-fill' },
  { key: 'AI', label: 'Trí Tuệ Nhân Tạo', icon: 'bi-cpu-fill' },
  { key: 'Career', label: 'Phỏng Vấn & Sự Nghiệp', icon: 'bi-briefcase-fill' },
];

export default function ArticlesHub({ onNavigate, onCourseSelect }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [activeCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles({
        category: activeCategory !== 'ALL' ? activeCategory : undefined,
        keyword: keyword.trim() || undefined,
      });
      setArticles(data || []);
    } catch (err) {
      console.error('Lỗi tải bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleOpenArticle = async (idOrSlug) => {
    setReadingLoading(true);
    try {
      const art = await getArticle(idOrSlug);
      setSelectedArticle(art);
      // Cập nhật views_count trên UI
      setArticles((prev) =>
        prev.map((a) => (a.article_id === art.article_id ? { ...a, views_count: art.views_count } : a))
      );
    } catch (err) {
      alert(err.message || 'Không thể mở bài viết');
    } finally {
      setReadingLoading(false);
    }
  };

  const handleLike = async (id, e) => {
    if (e) e.stopPropagation();
    setLikeLoading(true);
    try {
      const res = await likeArticle(id);
      setArticles((prev) =>
        prev.map((a) => (a.article_id === id ? { ...a, likes_count: res.likes_count } : a))
      );
      if (selectedArticle && selectedArticle.article_id === id) {
        setSelectedArticle((prev) => ({ ...prev, likes_count: res.likes_count }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="articles-hub pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-journal-text me-1"></i> BÀI VIẾT & CẨM NANG CÔNG NGHỆ
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Kiến Thức Lập Trình Thực Chiến & Bí Quyết Nghề Nghiệp</h1>
          <p className="lead text-light mb-4" style={{ maxWidth: 820 }}>
            Tổng hợp các bài viết chuyên sâu từ Giảng viên & Tech Lead: Tối ưu hiệu năng React 19, thiết kế Clean Architecture với NestJS, kiến trúc RAG AI, cùng 50 câu hỏi phỏng vấn chuẩn bị cho sự nghiệp công nghệ.
          </p>

          {/* Search Box */}
          <Form onSubmit={handleSearchSubmit} className="d-flex gap-2" style={{ maxWidth: 580 }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <Form.Control
                type="text"
                placeholder="Tìm bài viết theo tiêu đề, tag, công nghệ (React, NestJS, Docker, STAR...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border-0 shadow-none py-2"
              />
              <Button type="submit" variant="warning" className="fw-bold px-4">
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </Container>
      </section>

      <Container className="app-container">
        {/* 2. Category Filters */}
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? 'primary' : 'outline-secondary'}
              size="sm"
              className={`rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold ${activeCategory === cat.key ? 'shadow-sm' : 'border-0 bg-light text-dark'}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <i className={`bi ${cat.icon}`}></i>
              {cat.label}
            </Button>
          ))}
        </div>

        {/* 3. Articles Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải danh sách bài viết...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5">
            <i className="bi bi-journal-x fs-1 text-muted d-block mb-3"></i>
            <h5 className="fw-bold">Không tìm thấy bài viết phù hợp</h5>
            <p className="text-muted">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển chuyên mục.</p>
            <Button variant="outline-primary" size="sm" onClick={() => { setActiveCategory('ALL'); setKeyword(''); }}>
              Xem tất cả bài viết
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {articles.map((art) => {
              let tagsArray = [];
              try {
                tagsArray = typeof art.tags === 'string' ? JSON.parse(art.tags) : (art.tags || []);
              } catch {
                tagsArray = [];
              }

              return (
                <Col key={art.article_id} lg={4} md={6}>
                  <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column hover-shadow transition">
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src={art.thumbnail_url}
                        alt={art.title}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <Badge
                        bg="dark"
                        className="position-absolute top-0 end-0 m-3 px-3 py-2 bg-opacity-75 rounded-pill fw-semibold"
                      >
                        <i className="bi bi-clock me-1"></i> {art.read_time}
                      </Badge>
                      <Badge
                        bg="primary"
                        className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill fw-bold"
                      >
                        {art.category}
                      </Badge>
                    </div>

                    <Card.Body className="p-3 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img
                          src={art.author_avatar}
                          alt={art.author_name}
                          className="rounded-circle"
                          style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                        />
                        <span className="small text-muted fw-semibold">{art.author_name}</span>
                      </div>

                      <h6 className="fw-bold text-dark mb-2" style={{ lineHeight: 1.4, minHeight: '42px' }}>
                        {art.title}
                      </h6>
                      <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.5 }}>
                        {art.summary}
                      </p>

                      {/* Tag pills */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {tagsArray.map((t, idx) => (
                          <span key={idx} className="badge bg-light text-secondary border small">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                        <div className="d-flex align-items-center gap-3 text-muted small">
                          <span>
                            <i className="bi bi-eye me-1"></i> {art.views_count}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-muted text-decoration-none d-flex align-items-center gap-1"
                            onClick={(e) => handleLike(art.article_id, e)}
                            title="Thích bài viết"
                          >
                            <i className="bi bi-hand-thumbs-up text-primary"></i>
                            <span>{art.likes_count}</span>
                          </button>
                        </div>

                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3 fw-bold"
                          onClick={() => handleOpenArticle(art.slug || art.article_id)}
                        >
                          Đọc tiếp <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* 4. Reading Modal */}
      <Modal
        show={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        size="lg"
        centered
        scrollable
        className="article-reader-modal"
      >
        {selectedArticle && (
          <>
            <Modal.Header closeButton className="border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Badge bg="primary" className="rounded-pill px-3 py-1">
                  {selectedArticle.category}
                </Badge>
                <span className="text-muted small">
                  <i className="bi bi-clock me-1"></i> {selectedArticle.read_time}
                </span>
              </div>
            </Modal.Header>
            <Modal.Body className="p-4">
              <h3 className="fw-bold mb-3">{selectedArticle.title}</h3>

              <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={selectedArticle.author_avatar}
                    alt={selectedArticle.author_name}
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <strong className="d-block text-dark">{selectedArticle.author_name}</strong>
                    <small className="text-muted">Chuyên gia giảng dạy tại EduViet</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted">
                    <i className="bi bi-eye me-1"></i> {selectedArticle.views_count} lượt xem
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill px-3 d-flex align-items-center gap-1"
                    onClick={() => handleLike(selectedArticle.article_id)}
                    disabled={likeLoading}
                  >
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                    <span>Thích ({selectedArticle.likes_count})</span>
                  </Button>
                </div>
              </div>

              {/* Nội dung bài viết */}
              <div
                className="article-content lh-lg text-dark mb-4"
                style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}
              >
                {selectedArticle.content}
              </div>

              {/* Khóa học thực chiến liên quan */}
              {selectedArticle.related_course_id && (
                <div className="p-4 bg-primary-subtle border border-primary-subtle rounded-4 mt-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <span className="badge bg-primary text-white mb-2">KHÓA HỌC THỰC CHIẾN GỢI Ý</span>
                      <h5 className="fw-bold text-dark mb-1">
                        Áp dụng kiến thức bài viết này vào đồ án chuyên nghiệp
                      </h5>
                      <small className="text-secondary">
                        Đăng ký học để nhận giáo trình chi tiết, source code hoàn chỉnh và sửa bài 1-1 cùng Giảng viên.
                      </small>
                    </div>
                    <Button
                      variant="primary"
                      className="fw-bold px-4 rounded-pill shadow-sm"
                      onClick={() => {
                        setSelectedArticle(null);
                        onNavigate?.('courses');
                      }}
                    >
                      <i className="bi bi-mortarboard me-1"></i> Khám Phá Khóa Học
                    </Button>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-top">
              <Button variant="secondary" onClick={() => setSelectedArticle(null)}>
                Đóng
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
