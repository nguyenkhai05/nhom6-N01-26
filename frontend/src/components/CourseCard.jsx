import { Card, Button, Badge } from 'react-bootstrap';

export default function CourseCard({ course, onViewDetail, onEnroll, isEnrolled, onAddToCart, isInCart, onStartLearning }) {
  const getBadgeColor = (categoryName) => {
    switch (categoryName) {
      case 'Frontend':
        return 'primary';
      case 'Backend':
        return 'success';
      case 'Cơ sở dữ liệu':
      case 'Database':
        return 'warning';
      case 'DevOps':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const discountPercent = course.old_price && course.price
    ? Math.round(((course.old_price - course.price) / course.old_price) * 100)
    : null;

  return (
    <Card className="h-100 border-0 shadow-sm course-card rounded-4 overflow-hidden position-relative hover-lift">
      {/* Thumbnail + Overlays */}
      <div className="position-relative overflow-hidden" style={{ height: 180 }}>
        <Card.Img
          variant="top"
          src={
            course.thumbnail_url ||
            'https://placehold.co/600x350/1e293b/38bdf8?text=EduViet+Code'
          }
          alt={course.title}
          className="course-image w-100 h-100 object-fit-cover transition-transform"
        />

        {/* Giảm giá badge */}
        {discountPercent && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-danger fw-bold rounded-pill px-2 py-1 shadow-sm">
            <i className="bi bi-fire me-1"></i> -{discountPercent}%
          </span>
        )}

        {/* Thời lượng */}
        <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-2 py-1">
          <i className="bi bi-clock me-1"></i>
          {course.duration || '40 giờ'}
        </span>

        {/* Level badge */}
        <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-3 px-2 py-1 small">
          <i className="bi bi-bar-chart-fill me-1 text-warning"></i>
          {course.level || 'Beginner'}
        </span>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg={getBadgeColor(course.category?.name)} className="px-2 py-1 rounded-pill fw-semibold">
            {course.category?.name || 'Lập trình'}
          </Badge>
          <div className="d-flex align-items-center text-warning small fw-bold">
            <i className="bi bi-star-fill me-1"></i>
            <span className="text-dark">{course.rating || '4.9'}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>(340+)</span>
          </div>
        </div>

        <Card.Title className="fw-bold fs-6 mb-2 text-truncate-2 text-dark" style={{ minHeight: 44 }}>
          {course.title}
        </Card.Title>

        <Card.Text className="text-secondary small mb-3 flex-grow-1 text-truncate-2" style={{ fontSize: '0.82rem' }}>
          {course.description || 'Chương trình đào tạo thực chiến cùng giảng viên chuyên gia từ doanh nghiệp công nghệ.'}
        </Card.Text>

        {/* Lợi ích hoặc Tiến độ học tập */}
        {isEnrolled ? (
          <div className="p-2 bg-success-subtle border border-success-subtle rounded-3 mb-3 small" style={{ fontSize: '0.75rem' }}>
            <div className="d-flex justify-content-between align-items-center text-success fw-bold mb-1">
              <span><i className="bi bi-patch-check-fill me-1"></i> Quyền truy cập:</span>
              <span>Trọn đời (Lifetime)</span>
            </div>
            <div className="d-flex justify-content-between text-muted">
              <span>Cấp chứng chỉ:</span>
              <span className="text-dark fw-semibold">Đủ điều kiện nhận bằng</span>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-light rounded-3 mb-3 small" style={{ fontSize: '0.75rem' }}>
            <div className="d-flex align-items-center text-success mb-1">
              <i className="bi bi-check-circle-fill me-1 text-success"></i>
              <span>Bảo hành hoàn học phí 100% trong 7 ngày</span>
            </div>
            <div className="d-flex align-items-center text-primary">
              <i className="bi bi-patch-check-fill me-1 text-primary"></i>
              <span>Cấp chứng chỉ & kết nối việc làm đối tác</span>
            </div>
          </div>
        )}

        {/* Thông tin Giảng viên & Số học viên */}
        <div className="text-secondary small mb-3 d-flex align-items-center justify-content-between pt-1 border-top" style={{ fontSize: '0.78rem' }}>
          <span className="text-truncate" style={{ maxWidth: 160 }} title={course.instructor?.name}>
            <i className="bi bi-person-badge-fill me-1 text-primary"></i>
            {course.instructor?.name || 'EduViet Mentor'}
          </span>
          <span className="text-muted">
            <i className="bi bi-people-fill me-1 text-success"></i>
            <strong>{course.studentsCount || 120}</strong> học viên
          </span>
        </div>

        {/* Giá & Nút kêu gọi hành động */}
        <div className="border-top pt-2 mt-auto">
          {isEnrolled ? (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small">
                <i className="bi bi-check-circle-fill me-1"></i> ĐÃ SỞ HỮU KHÓA HỌC
              </span>
              <span className="text-muted small font-monospace">Học phí: Đã thanh toán</span>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-baseline mb-2">
              <div>
                <span className="small text-muted d-block" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Học phí ưu đãi</span>
                <span className="fw-bold text-primary fs-5 font-monospace">
                  {Number(course.price || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
              {course.old_price && (
                <span className="text-decoration-line-through text-muted small font-monospace">
                  {Number(course.old_price).toLocaleString('vi-VN')} đ
                </span>
              )}
            </div>
          )}

          <div className="d-flex gap-2">
            {isEnrolled ? (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="flex-grow-1 fw-semibold rounded-pill d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onViewDetail?.(course)}
                  title="Xem giáo trình và tài liệu bài giảng"
                >
                  <i className="bi bi-journal-bookmark"></i>
                  <span>Giáo Trình & Tài Liệu</span>
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="flex-grow-1 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onStartLearning?.(course)}
                  title="Bấm để vào phòng học trực tuyến ngay"
                >
                  <i className="bi bi-play-circle-fill"></i>
                  <span>Vào Học Ngay</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="flex-grow-1 fw-semibold rounded-pill"
                  onClick={() => onViewDetail?.(course)}
                >
                  Xem chi tiết
                </Button>

                <Button
                  variant={isInCart ? "warning" : "light"}
                  size="sm"
                  className={`border rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm ${
                    isInCart ? 'text-dark fw-bold' : 'text-primary'
                  }`}
                  style={{ width: 34, height: 34, flexShrink: 0 }}
                  title={isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                  onClick={() => onAddToCart?.(course)}
                >
                  <i className={`bi ${isInCart ? 'bi-cart-check-fill fs-6' : 'bi-cart-plus fs-6'}`}></i>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="flex-grow-1 fw-bold rounded-pill shadow-sm"
                  onClick={() => onEnroll?.(course)}
                >
                  <i className="bi bi-lightning-charge-fill me-1"></i> Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
