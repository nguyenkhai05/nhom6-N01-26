import { useState } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';

const QUICK_LINKS = [
  { label: 'Tất cả khóa học', route: 'courses' },
  { label: 'Học thử tương tác', route: 'try' },
  { label: 'Chọn khóa phù hợp', route: 'find-course' },
  { label: 'Đội ngũ giảng viên', route: 'instructors' },
  { label: 'Cộng đồng học tập', route: 'community' },
  { label: 'Trung tâm hỗ trợ & FAQ', route: 'help' },
  { label: 'Góc học tập của tôi', route: 'my-learning' },
];

const POLICY_DETAILS = {
  privacy: {
    title: 'Chính Sách Bảo Mật Dữ Liệu Học Viên (Privacy Policy)',
    content: (
      <div>
        <h6 className="fw-bold text-dark">1. Mục đích thu thập thông tin</h6>
        <p className="text-secondary small">
          EduViet chỉ thu thập các thông tin cơ bản phục vụ cho việc tạo tài khoản và ghi nhận tiến độ học tập của học viên: Họ tên hiển thị, địa chỉ email, ảnh đại diện và lịch sử hoàn thành các bài học/thực hành.
        </p>
        <h6 className="fw-bold text-dark">2. Bảo mật mật khẩu & xác thực</h6>
        <p className="text-secondary small">
          Mật khẩu của người dùng được băm mã hóa một chiều bằng thuật toán scrypt/bcrypt an toàn ngay khi nhận tại máy chủ backend và không bao giờ được lưu dưới dạng văn bản thuần (plain text). Token phiên làm việc tuân thủ chuẩn JWT RFC 7519.
        </p>
        <h6 className="fw-bold text-dark">3. Cam kết không chia sẻ dữ liệu</h6>
        <p className="text-secondary small mb-0">
          EduViet cam kết không bán, chia sẻ hoặc tiết lộ thông tin cá nhân của học viên cho bất kỳ bên thứ ba nào vì mục đích quảng cáo thương mại.
        </p>
      </div>
    ),
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ & Quy Chế Đào Tạo (Terms of Service)',
    content: (
      <div>
        <h6 className="fw-bold text-dark">1. Quyền sử dụng tài khoản học tập</h6>
        <p className="text-secondary small">
          Mỗi tài khoản được cấp quyền truy cập trọn đời vào các khóa học đã thanh toán hoặc bài học thử nghiệm. Học viên có trách nhiệm bảo vệ thông tin đăng nhập cá nhân.
        </p>
        <h6 className="fw-bold text-dark">2. Bản quyền bài giảng & học liệu</h6>
        <p className="text-secondary small">
          Toàn bộ video bài giảng, tài liệu slide, mã nguồn mẫu và bộ test cases trong hệ thống thuộc quyền sở hữu trí tuệ của EduViet Platform và giảng viên phụ trách. Nghiêm cấm sao chép, phân phối lại vì mục đích thương mại khi chưa có sự đồng ý.
        </p>
        <h6 className="fw-bold text-dark">3. Môi trường thực thi mã nguồn</h6>
        <p className="text-secondary small mb-0">
          Người dùng cam kết không inject mã độc, vòng lặp phá hoại tài nguyên hoặc thực hiện các hành vi tấn công gây ảnh hưởng tới sự sẵn sàng của hệ thống.
        </p>
      </div>
    ),
  },
  refund: {
    title: 'Chính Sách Hoàn Học Phí Trong 7 Ngày (Refund Policy)',
    content: (
      <div>
        <h6 className="fw-bold text-dark">1. Điều kiện áp dụng hoàn tiền 100%</h6>
        <p className="text-secondary small">
          Học viên được quyền yêu cầu hoàn trả 100% học phí trong vòng <strong>7 ngày</strong> kể từ thời điểm giao dịch thanh toán thành công nếu:
        </p>
        <ul className="text-secondary small ps-3">
          <li>Tổng thời lượng học chưa vượt quá 20% toàn bộ khóa học.</li>
          <li>Chưa thực hiện nộp bài thi đánh giá hoặc nhận chứng chỉ tốt nghiệp.</li>
        </ul>
        <h6 className="fw-bold text-dark">2. Quy trình & Thời gian hoàn trả</h6>
        <p className="text-secondary small mb-0">
          Yêu cầu hoàn phí được tiếp nhận qua mục Hỗ trợ hoặc hotline 1900-EDUVIET. Khoản tiền hoàn lại sẽ được chuyển trả vào số dư ví EduViet hoặc số tài khoản ngân hàng gốc trong vòng 24 - 48 giờ làm việc.
        </p>
      </div>
    ),
  },
};

export default function Footer({ onNavigate }) {
  const [activePolicyModal, setActivePolicyModal] = useState(null);

  const openPolicy = (policyKey) => {
    setActivePolicyModal(POLICY_DETAILS[policyKey] || null);
  };

  return (
    <footer className="footer-booking">
      {/* 1. Dải liên kết nhanh trên nền trắng */}
      <div className="footer-quick-bar">
        <Container className="app-container">
          <ul className="footer-quick-list">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={`#${link.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(link.route);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* 2. Khối liên kết chính 3 nhóm trên nền xám */}
      <div className="footer-columns-bar">
        <Container className="app-container">
          <div className="row g-4">
            {/* Nhóm 1: Nền tảng & Học tập */}
            <div className="col-lg-4 col-md-6">
              <h6 className="footer-col-title fw-bold">Khám Phá & Học Tập</h6>
              <ul className="footer-col-list list-unstyled small">
                <li className="mb-2">
                  <a href="#courses" onClick={(e) => { e.preventDefault(); onNavigate?.('courses'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Khóa học lập trình thực chiến
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#try" onClick={(e) => { e.preventDefault(); onNavigate?.('try'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Học thử tương tác Sandbox
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#find-course" onClick={(e) => { e.preventDefault(); onNavigate?.('find-course'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Bộ chọn khóa theo mục tiêu
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#instructors" onClick={(e) => { e.preventDefault(); onNavigate?.('instructors'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Đội ngũ giảng viên & chuyên gia
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#community" onClick={(e) => { e.preventDefault(); onNavigate?.('community'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Cộng đồng hỏi đáp kỹ thuật
                  </a>
                </li>
              </ul>
            </div>

            {/* Nhóm 2: Hỗ trợ & Khóa của tôi */}
            <div className="col-lg-4 col-md-6">
              <h6 className="footer-col-title fw-bold">Hỗ Trợ & Học Viên</h6>
              <ul className="footer-col-list list-unstyled small">
                <li className="mb-2">
                  <a href="#my-learning" onClick={(e) => { e.preventDefault(); onNavigate?.('my-learning'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Khóa học của tôi (Góc học tập)
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#help" onClick={(e) => { e.preventDefault(); onNavigate?.('help'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Trung tâm trợ giúp học viên & FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#refund" onClick={(e) => { e.preventDefault(); openPolicy('refund'); }}>
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Chính sách hoàn học phí trong 7 ngày
                  </a>
                </li>
                <li className="mb-2">
                  <span className="text-secondary">
                    <i className="bi bi-telephone-fill me-1 text-success"></i> Hotline hỗ trợ: 1900-EDUVIET (8:00 - 21:00)
                  </span>
                </li>
              </ul>
            </div>

            {/* Nhóm 3: Chính sách & Quy chuẩn */}
            <div className="col-lg-4 col-md-12">
              <h6 className="footer-col-title fw-bold">Chính Sách & Quy Chế</h6>
              <ul className="footer-col-list list-unstyled small">
                <li className="mb-2">
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); openPolicy('privacy'); }}>
                    <i className="bi bi-shield-check me-1 text-success"></i> Chính sách bảo mật dữ liệu học viên
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#terms" onClick={(e) => { e.preventDefault(); openPolicy('terms'); }}>
                    <i className="bi bi-file-text me-1 text-info"></i> Điều khoản dịch vụ & Quy chế đào tạo
                  </a>
                </li>
                <li className="mt-3 p-3 bg-white rounded-3 border">
                  <div className="fw-bold text-dark small mb-1">
                    <i className="bi bi-mortarboard-fill text-primary me-1"></i> EduViet Platform v2.6
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                    Nền tảng đào tạo lập trình thực chiến theo kiến trúc phân tầng chuẩn doanh nghiệp.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. Dòng bản quyền dưới cùng */}
      <div className="footer-bottom-bar text-center py-3 border-top">
        <Container className="app-container">
          <p className="footer-copyright mb-0 text-muted small">
            &copy; 2026 EduViet Platform. Bản quyền thuộc về Nhóm 6 - Đồ án Công Nghệ Web Nâng Cao.
          </p>
        </Container>
      </div>

      {/* Modal Hiển Thị Nội Dung Chính Sách & Điều Khoản Chi Tiết */}
      <Modal
        show={Boolean(activePolicyModal)}
        onHide={() => setActivePolicyModal(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold text-dark">
            {activePolicyModal?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-4">
          {activePolicyModal?.content}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" className="px-4 rounded-pill" onClick={() => setActivePolicyModal(null)}>
            Đã Hiểu & Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
}
