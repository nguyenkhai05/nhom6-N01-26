import { Container } from 'react-bootstrap';
import ScrollRow from './ScrollRow';
import { FALLBACK_IMG, LEVELS, coursesOfCategory, resolveCategories } from '../../utils/catalog';

const imgFallback = (e) => { e.currentTarget.src = FALLBACK_IMG; };

// Mẫu 3: "Tìm theo loại chỗ nghỉ" → tìm theo trình độ; "Khám phá Việt Nam" → khám phá chuyên ngành (kèm số khóa học).
export default function BrowseSections({ courses, categories, onBrowse }) {
  const cats = resolveCategories(categories, courses);
  const levelCards = [
    ...LEVELS.map((l) => ({
      key: l.value,
      title: l.label,
      count: courses.filter((c) => c.level === l.value).length,
      img: courses.find((c) => c.level === l.value)?.thumbnail_url,
      filter: { level: l.value },
    })),
    { key: 'ALL', title: 'Tất cả khóa học', count: courses.length, img: courses[0]?.thumbnail_url, filter: {} },
  ];

  return (
    <Container className="bv-section" as="section" aria-labelledby="bv-level-title">
      <h2 id="bv-level-title">Tìm theo trình độ</h2>
      <ScrollRow>
        {levelCards.map((c) => (
          <button key={c.key} type="button" className="bv-card bv-card-lg" onClick={() => onBrowse(c.filter)}>
            <img src={c.img || FALLBACK_IMG} alt="" loading="lazy" onError={imgFallback} />
            <strong>{c.title}</strong>
            <span className="bv-meta">{c.count} khóa học</span>
          </button>
        ))}
      </ScrollRow>

      <h2 className="bv-mt" id="bv-explore-title">Khám phá chuyên ngành</h2>
      <p className="bv-sub">Các chuyên ngành phổ biến này có nhiều điều chờ đón bạn</p>
      <ScrollRow>
        {cats.map((cat) => {
          const list = coursesOfCategory(courses, cat.name);
          return (
            <button key={cat.id} type="button" className="bv-card bv-card-sm" onClick={() => onBrowse({ techCategory: cat.name })}>
              <img src={list[0]?.thumbnail_url || FALLBACK_IMG} alt="" loading="lazy" onError={imgFallback} />
              <strong>{cat.name}</strong>
              <span className="bv-meta">{list.length} khóa học</span>
            </button>
          );
        })}
      </ScrollRow>
    </Container>
  );
}
