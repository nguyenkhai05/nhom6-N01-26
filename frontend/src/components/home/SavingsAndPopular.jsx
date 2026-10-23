import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { LEVELS, levelLabel, resolveCategories } from '../../utils/catalog';

const PAGE = 15;

// Mẫu 2: banner "Đi nhiều hơn, chi ít hơn" (chỉ hiện với khách chưa đăng nhập)
// + khối "Phổ biến với..." gồm tab và lưới liên kết 5 cột.
export default function SavingsAndPopular({ courses, categories, currentUser, onOpenLogin, onOpenRegister, onBrowse, onViewDetail }) {
  const cats = resolveCategories(categories, courses);
  const tabs = {
    category: {
      label: 'Theo chuyên ngành',
      items: cats.map((c) => ({ key: c.id, label: `Khóa học ${c.name}`, run: () => onBrowse({ techCategory: c.name }) })),
    },
    level: {
      label: 'Theo trình độ',
      items: LEVELS.map((l) => ({ key: l.value, label: `Khóa học trình độ ${levelLabel(l.value).toLowerCase()}`, run: () => onBrowse({ level: l.value }) })),
    },
    course: {
      label: 'Tất cả khóa học',
      items: courses.map((c) => ({ key: c.course_id, label: c.title, run: () => onViewDetail(c) })),
    },
  };
  const [tab, setTab] = useState('category');
  const [expanded, setExpanded] = useState(false);
  const items = tabs[tab].items;
  const visible = expanded ? items : items.slice(0, PAGE);

  return (
    <Container className="bv-section" as="section">
      {!currentUser && (
        <>
          <h2>Học nhiều hơn, chi ít hơn</h2>
          <div className="bv-signin">
            <div>
              <h3>Đăng nhập để tiết kiệm</h3>
              <p>Đăng ký tài khoản mới để nhận ngay 1.000.000 ₫ vào ví học tập và dùng để mua khóa học.</p>
              <div className="bv-signin-actions">
                <Button onClick={onOpenLogin}>Đăng nhập</Button>
                <button type="button" className="booking-text-link" onClick={onOpenRegister}>Đăng ký</button>
              </div>
            </div>
            <div className="bv-gift" aria-hidden="true"><i className="bi bi-gift-fill" /><span>EDUVIET</span></div>
          </div>
        </>
      )}

      <h2 className={currentUser ? '' : 'bv-mt'}>Phổ biến với học viên Việt Nam</h2>
      <div className="bv-pills" role="tablist">
        {Object.entries(tabs).map(([key, t]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className={`bv-pill ${tab === key ? 'is-active' : ''}`}
            onClick={() => { setTab(key); setExpanded(false); }}>
            {t.label}
          </button>
        ))}
      </div>

      <ul className="bv-links">
        {visible.map((it) => (
          <li key={it.key}><button type="button" onClick={it.run}>{it.label}</button></li>
        ))}
      </ul>
      {items.length > PAGE && (
        <button type="button" className="bv-more" onClick={() => setExpanded((v) => !v)}>
          <i className={`bi ${expanded ? 'bi-dash' : 'bi-plus'}`} /> {expanded ? 'Thu gọn' : 'Hiển thị thêm'}
        </button>
      )}
    </Container>
  );
}
