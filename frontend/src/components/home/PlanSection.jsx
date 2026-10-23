import { useState } from 'react';
import { Container } from 'react-bootstrap';
import ScrollRow from './ScrollRow';
import { FALLBACK_IMG, coursesOfCategory, formatVnd, levelLabel, resolveCategories } from '../../utils/catalog';

// Mẫu 1: "Lên kế hoạch dễ dàng và nhanh chóng" → tab chuyên ngành + hàng thẻ khóa học,
// bên dưới là hàng thẻ lớn "lộ trình nghề nghiệp".
export default function PlanSection({ courses, categories, onViewDetail, onBrowse }) {
  const cats = resolveCategories(categories, courses);
  const [activeName, setActiveName] = useState(null);
  const active = cats.find((c) => c.name === activeName) ?? cats[0];
  const shown = active ? coursesOfCategory(courses, active.name) : [];

  return (
    <Container className="bv-section" as="section" aria-labelledby="bv-plan-title">
      <h2 id="bv-plan-title">Lên lộ trình học dễ dàng và nhanh chóng</h2>
      <p className="bv-sub">Khám phá các khóa học hàng đầu theo chuyên ngành bạn quan tâm</p>

      <div className="bv-pills" role="tablist">
        {cats.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.name === active?.name}
            className={`bv-pill ${c.name === active?.name ? 'is-active' : ''}`}
            onClick={() => setActiveName(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="bv-empty">Chưa có khóa học nào trong chuyên ngành này.</p>
      ) : (
        <ScrollRow>
          {shown.map((course) => (
            <button key={course.course_id} type="button" className="bv-card bv-card-sm" onClick={() => onViewDetail(course)}>
              <img src={course.thumbnail_url || FALLBACK_IMG} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
              <strong className="bv-clamp-2">{course.title}</strong>
              <span className="bv-meta">{levelLabel(course.level)} · {formatVnd(course.price)}</span>
            </button>
          ))}
        </ScrollRow>
      )}

      <h2 className="bv-mt" id="bv-tracks-title">Bạn đang tìm lộ trình nghề nghiệp?</h2>
      <p className="bv-sub">Chọn một hướng đi và xem toàn bộ khóa học để bắt đầu lên kế hoạch</p>
      <ScrollRow>
        {cats.slice(0, 4).map((cat) => {
          const list = coursesOfCategory(courses, cat.name);
          return (
            <button key={cat.id} type="button" className="bv-card bv-card-lg" onClick={() => onBrowse({ techCategory: cat.name })}>
              <img src={list[0]?.thumbnail_url || FALLBACK_IMG} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
              <strong>Lộ trình {cat.name}</strong>
              <span className="bv-meta bv-clamp-2">
                {list.length ? `${list.slice(0, 3).map((c) => c.title).join(' • ')}${list.length > 3 ? ' và các khóa khác' : ''}` : 'Sắp có khóa học mới'}
              </span>
            </button>
          );
        })}
      </ScrollRow>
    </Container>
  );
}
