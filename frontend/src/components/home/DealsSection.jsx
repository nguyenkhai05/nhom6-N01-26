import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import ScrollRow from './ScrollRow';
import { FALLBACK_IMG, formatVnd, levelLabel } from '../../utils/catalog';

const WISHLIST_KEY = 'eduviet_wishlist';

function readWishlist() {
  try {
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// Mẫu 4: thẻ "Ưu đãi" + hàng "Nhà ở mà khách yêu thích" → khóa học yêu thích (nút tim lưu localStorage).
export default function DealsSection({ courses, onViewDetail, onSelectCombo }) {
  const [wishlist, setWishlist] = useState(readWishlist);

  const toggle = (id) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(next)); } catch { /* bỏ qua nếu storage bị chặn */ }
      return next;
    });
  };

  return (
    <Container className="bv-section" as="section" aria-labelledby="bv-deals-title">
      <h2 id="bv-deals-title">Ưu đãi</h2>
      <p className="bv-sub">Khuyến mãi, giảm giá và ưu đãi đặc biệt dành riêng cho bạn</p>

      <div className="bv-promo">
        <div className="bv-promo-copy">
          <span className="bv-eyebrow">Ưu đãi cuối năm</span>
          <h3>Tiết kiệm đến 22% khi đăng ký lộ trình Combo</h3>
          <p>Tiết kiệm học phí với combo React, NestJS và Docker. Đăng ký ngay để bắt đầu hành trình trở thành lập trình viên thực chiến.</p>
          <Button onClick={onSelectCombo}>Tìm ưu đãi</Button>
        </div>
        <img className="bv-promo-img" src={courses[0]?.thumbnail_url || FALLBACK_IMG} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
      </div>

      <div className="bv-head-row bv-mt">
        <h2>Khóa học học viên yêu thích</h2>
        <button type="button" className="booking-text-link" onClick={onSelectCombo}>Xem tất cả khóa học</button>
      </div>
      <ScrollRow>
        {courses.map((course) => {
          const liked = wishlist.includes(course.course_id);
          const hasOld = course.old_price && course.old_price > course.price;
          return (
            <article key={course.course_id} className="bv-card bv-card-lg bv-stay" onClick={() => onViewDetail(course)}>
              <div className="bv-stay-img">
                <img src={course.thumbnail_url || FALLBACK_IMG} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                <button
                  type="button"
                  className="bv-heart"
                  aria-pressed={liked}
                  aria-label={liked ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                  onClick={(e) => { e.stopPropagation(); toggle(course.course_id); }}
                >
                  <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`} />
                </button>
              </div>
              <strong className="bv-clamp-2">{course.title}</strong>
              <span className="bv-meta">{course.instructor?.name ? `Giảng viên: ${course.instructor.name}` : (course.category?.name ?? '')}</span>
              <div className="bv-score">
                <span className="bv-score-box"><i className="bi bi-mortarboard-fill" /></span>
                <span className="bv-meta"><b>{levelLabel(course.level)}</b><br />{course.category?.name ?? 'Lập trình'}</span>
              </div>
              <div className="bv-price">
                <small>Học phí từ</small>
                {hasOld && <s>{formatVnd(course.old_price)}</s>}
                <b>{formatVnd(course.price)}</b>
              </div>
            </article>
          );
        })}
      </ScrollRow>
    </Container>
  );
}
