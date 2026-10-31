import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { getInstructors } from '../services/hubApi';

export default function InstructorsPage({ onNavigate, onSelectInstructor }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    getInstructors()
      .then((data) => {
        if (isMounted) {
          setInstructors(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Lỗi tải danh sách giảng viên:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const tags = [
    { key: 'ALL', label: 'Tất Cả Chuyên Môn' },
    { key: 'React', label: 'React / Frontend' },
    { key: 'NestJS', label: 'NestJS / Backend' },
    { key: 'MySQL', label: 'Cơ Sở Dữ Liệu' },
    { key: 'Python', label: 'Python / AI' },
  ];

  const filteredInstructors = instructors.filter((inst) => {
    const matchSearch =
      (inst.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.roleTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.bio || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchTag =
      selectedTag === 'ALL' ||
      (inst.expertiseTags || []).some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchSearch && matchTag;
  });

  return (
    <div className="instructors-page pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0a2540 0%, #001226 100%)' }}
      >
        <Container className="app-container">
          <Badge bg="primary" className="px-3 py-2 fw-bold rounded-pill mb-2 border border-primary-subtle">
            <i className="bi bi-person-video3 me-1"></i> ĐỘI NGŨ CHUYÊN GIA GIẢNG DẠY
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Giảng Viên & Chuyên Gia Kỹ Thuật Thực Chiến</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 840, fontSize: '1.05rem', opacity: 0.9 }}>
            Đội ngũ giảng viên tại EduViet đều là các Lead Engineer, Solution Architect với nhiều năm kinh nghiệm thiết kế hệ thống và dẫn dắt các dự án quy mô lớn trong ngành công nghệ.
          </p>
        </Container>
      </section>

      {/* 2. Search & Filter Bar */}
      <Container className="app-container mb-4">
        <div className="p-3 bg-white rounded-4 border shadow-xs d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="flex-grow-1" style={{ maxWidth: 420 }}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm giảng viên theo tên, kỹ năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
              {searchTerm && (
                <Button variant="light" className="border border-start-0 text-muted" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x-circle"></i>
                </Button>
              )}
            </InputGroup>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold px-3 ${
                  selectedTag === t.key ? 'btn-primary shadow-xs' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedTag(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* 3. Instructors Grid */}
      <Container className="app-container">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Đang tải hồ sơ giảng viên...</p>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <i className="bi bi-person-x fs-1 text-muted"></i>
            <h5 className="fw-bold text-dark mt-2">Không tìm thấy giảng viên phù hợp</h5>
            <p className="text-secondary small mb-3">Vui lòng thử tìm kiếm bằng từ khóa hoặc bộ lọc chuyên môn khác.</p>
            <Button variant="outline-primary" size="sm" onClick={() => { setSearchTerm(''); setSelectedTag('ALL'); }}>
              Đặt lại bộ lọc
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filteredInstructors.map((inst) => (
              <Col key={inst.id} lg={6}>
                <Card className="h-100 border rounded-4 shadow-xs hover-shadow transition-all bg-white overflow-hidden">
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex align-items-start gap-3 pb-3 border-bottom mb-3">
                      <img
                        src={inst.avatar}
                        alt={inst.displayName}
                        className="rounded-circle border border-2 border-primary shadow-sm"
                        style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div className="min-w-0 flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h5 className="fw-bold text-dark mb-0 text-truncate">{inst.displayName}</h5>
                          <Badge bg="success-subtle" text="success" className="border border-success-subtle small">
                            <i className="bi bi-patch-check-fill me-1"></i>Đã Xác Thực
                          </Badge>
                        </div>
                        <p className="text-primary fw-semibold small mb-1">{inst.roleTitle}</p>
                        <span className="text-muted small">
                          <i className="bi bi-book-half me-1 text-secondary"></i>
                          Phụ trách <strong>{inst.coursesTaughtCount} khóa học</strong> chuyên sâu
                        </span>
                      </div>
                    </div>

                    <p className="text-secondary small mb-3 flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {inst.bio}
                    </p>

                    <div className="mb-3">
                      <div className="small fw-bold text-dark mb-2">Chuyên môn kỹ thuật:</div>
                      <div className="d-flex flex-wrap gap-1">
                        {inst.expertiseTags?.map((tag) => (
                          <span
                            key={tag}
                            className="badge bg-light text-secondary border rounded-pill px-2 py-1"
                            style={{ fontSize: '0.78rem' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                      <div className="d-flex align-items-center gap-2">
                        {inst.github && (
                          <a href={inst.github} target="_blank" rel="noreferrer" className="text-muted hover-primary">
                            <i className="bi bi-github fs-5"></i>
                          </a>
                        )}
                        {inst.linkedin && (
                          <a href={inst.linkedin} target="_blank" rel="noreferrer" className="text-muted hover-primary">
                            <i className="bi bi-linkedin fs-5"></i>
                          </a>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="fw-bold px-3 rounded-pill shadow-xs"
                        onClick={() => {
                          if (onSelectInstructor) onSelectInstructor(inst.slug);
                        }}
                      >
                        Xem Hồ Sơ Chi Tiết <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
