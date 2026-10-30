import { Container } from 'react-bootstrap';

// Chân trang theo mẫu Booking.com: dải liên kết nhanh + 5 cột trên nền xám.
const QUICK_LINKS = [
  { label: 'Tất cả khóa học', route: 'courses' },
  { label: 'Trung tâm luyện tập', route: 'practice' },
  { label: 'Dự án thực tế', route: 'projects' },
  { label: 'Cộng đồng học viên', route: 'community' },
  { label: 'Combo ưu đãi trọn gói', route: 'bundles' },
  { label: 'Khóa học của tôi', route: 'my-learning' },
];

const COLUMNS = [
  { title: 'Học tập & Thực hành', links: [
    { label: 'Khóa học lập trình', route: 'courses' },
    { label: 'Kho bài tập & Thử thách', route: 'practice' },
    { label: 'Dự án thực chiến có Rubric', route: 'projects' },
    { label: 'Cộng đồng trao đổi Q&A', route: 'community' },
    { label: 'Combo tiết kiệm học phí', route: 'bundles' },
  ] },
  { title: 'Hỗ trợ học viên', links: [
    { label: 'Khóa học của tôi', route: 'my-learning' },
    { label: 'Trung tâm thông tin bảo mật' },
    { label: 'Chính sách hoàn phí 7 ngày' },
    { label: 'Báo cáo vi phạm nội dung' },
  ] },
  { title: 'Điều khoản & Quy định', links: [
    { label: 'Chính sách bảo mật dữ liệu' },
    { label: 'Điều khoản dịch vụ' },
    { label: 'Quy tắc cộng đồng học viên' },
    { label: 'Tiêu chuẩn chất lượng dự án' },
  ] },
  { title: 'Dành cho giảng viên', links: [
    { label: 'Cổng biên soạn giáo trình' },
    { label: 'Hệ thống chấm điểm Rubric' },
    { label: 'Quy chuẩn đăng tải học liệu' },
    { label: 'Hợp tác phát triển nội dung' },
  ] },
  { title: 'Về EduViet', links: [
    { label: 'Giới thiệu nền tảng EduViet' },
    { label: 'Phương pháp đào tạo thực chiến' },
    { label: 'Đội ngũ phát triển (Nhóm 6)' },
    { label: 'Liên hệ hợp tác doanh nghiệp' },
  ] },
];

export default function Footer({ onNavigate }) {
  const FooterLink = ({ link }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (link.route) {
          onNavigate?.(link.route);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      {link.label}
    </a>
  );

  return (
    <footer className="bv-footer mt-5">
      <Container>
        <ul className="bv-footer-quick">
          {QUICK_LINKS.map((l) => <li key={l.label}><FooterLink link={l} /></li>)}
        </ul>
      </Container>
      <div className="bv-footer-main">
        <Container>
          <div className="bv-footer-cols">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3>{col.title}</h3>
                <ul>{col.links.map((l) => <li key={l.label}><FooterLink link={l} /></li>)}</ul>
              </nav>
            ))}
          </div>
          <p className="bv-footer-copy">© 2026 EduViet Platform · Học viện Công nghệ & Lập trình Thực chiến · Nhóm 6.</p>
        </Container>
      </div>
    </footer>
  );
}
