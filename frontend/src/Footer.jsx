import { Container } from 'react-bootstrap';

// Chân trang theo mẫu Booking.com: dải liên kết nhanh + 5 cột trên nền xám.
// Mục có `route` điều hướng trong app; các mục còn lại là liên kết giữ chỗ (chưa có trang đích).
const QUICK_LINKS = [
  { label: 'Tất cả khóa học', route: 'courses' },
  { label: 'Lộ trình nghề nghiệp', route: 'roadmap' },
  { label: 'Sân chơi luyện code', route: 'practice' },
  { label: 'Tài liệu', route: 'docs' },
  { label: 'Khóa học của tôi', route: 'my-learning' },
  { label: 'Ưu đãi theo mùa' },
  { label: 'Bài viết công nghệ' },
];

const COLUMNS = [
  { title: 'Hỗ trợ', links: [
    { label: 'Quản lý khóa học của bạn', route: 'my-learning' },
    { label: 'Liên hệ chăm sóc học viên' },
    { label: 'Trung tâm thông tin bảo mật' },
  ] },
  { title: 'Khám phá thêm', links: [
    { label: 'Chương trình học viên thân thiết' },
    { label: 'Ưu đãi theo mùa và dịp lễ' },
    { label: 'Bài viết về công nghệ' },
    { label: 'EduViet dành cho doanh nghiệp' },
    { label: 'Lộ trình nghề nghiệp', route: 'roadmap' },
    { label: 'Sân chơi luyện code', route: 'practice' },
  ] },
  { title: 'Điều khoản và cài đặt', links: [
    { label: 'Chính sách bảo mật' },
    { label: 'Điều khoản dịch vụ' },
    { label: 'Chính sách hoàn học phí 7 ngày' },
    { label: 'Chính sách về quyền riêng tư' },
  ] },
  { title: 'Dành cho giảng viên', links: [
    { label: 'Đăng nhập trang giảng viên' },
    { label: 'Trợ giúp giảng viên' },
    { label: 'Đăng khóa học của bạn' },
    { label: 'Trở thành đối tác' },
  ] },
  { title: 'Về chúng tôi', links: [
    { label: 'Về EduViet' },
    { label: 'Chúng tôi hoạt động như thế nào' },
    { label: 'Cơ hội việc làm' },
    { label: 'Liên hệ công ty' },
    { label: 'Hướng dẫn và báo cáo nội dung' },
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
          <p className="bv-footer-copy">© 2026 EduViet Code · Dự án nhóm 6 – N01-26, môn Thiết kế web nâng cao.</p>
        </Container>
      </div>
    </footer>
  );
}
