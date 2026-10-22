import { useState } from 'react';
import { Row, Col, Card, Button, Form, Badge, Alert, Tab, Nav, ProgressBar } from 'react-bootstrap';

export default function UserProfile({
  currentUser,
  onUpdateUser,
  enrolledCoursesData = [],
  onOpenDeposit,
  depositHistory = [],
  initialTab = 'info',
  onStartLearning
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Edit profile states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '0912.345.678');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [targetTrack, setTargetTrack] = useState(currentUser?.targetTrack || 'Frontend Web Engineer');
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || 'https://github.com/developer');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');

  // Password change states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      fullName,
      phone,
      bio,
      targetTrack,
      githubUrl,
      avatarUrl
    };
    onUpdateUser?.(updated);
    setAlertMsg({ type: 'success', text: 'Cập nhật thông tin hồ sơ cá nhân thành công!' });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setAlertMsg({ type: 'danger', text: 'Vui lòng điền đầy đủ thông tin mật khẩu.' });
      return;
    }
    if (newPass.length < 6) {
      setAlertMsg({ type: 'danger', text: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
      return;
    }
    if (newPass !== confirmNewPass) {
      setAlertMsg({ type: 'danger', text: 'Mật khẩu mới xác nhận không khớp.' });
      return;
    }

    setAlertMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy lưu lại để đăng nhập cho các lần sau.' });
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="app-container py-5 page-fade-in">
      {/* Header Profile */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
            <i className="bi bi-person-badge-fill me-1"></i> TRANG CÁ NHÂN & HỒ SƠ NĂNG LỰC
          </span>
          <h2 className="fw-bold text-dark mb-1">
            Quản Lý Hồ Sơ {currentUser?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Học Viên'}
          </h2>
          <p className="text-secondary small mb-0">
            Xem tiến độ học tập, quản lý số dư ví cá nhân, bảo mật tài khoản và chứng chỉ kỹ năng.
          </p>
        </div>

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Button variant="success" className="fw-bold px-3 shadow-sm" onClick={onOpenDeposit}>
            <i className="bi bi-wallet2 me-2"></i>Nạp Thêm Vào Ví
          </Button>
        </div>
      </div>

      {alertMsg.text && (
        <Alert variant={alertMsg.type} className="rounded-3 shadow-sm mb-4">
          <i className={`bi ${alertMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
          {alertMsg.text}
        </Alert>
      )}

      <Row className="g-4">
        {/* Cột trái: Thẻ tóm tắt thông tin học viên */}
        <Col lg={4}>
          <Card className="border-0 rounded-4 shadow-sm p-4 text-center bg-white h-100">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="rounded-circle border border-3 border-primary object-fit-cover shadow-sm"
                width={110}
                height={110}
              />
              <span
                className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"
                style={{ width: 18, height: 18 }}
                title="Trực tuyến"
              ></span>
            </div>

            <h4 className="fw-bold text-dark mb-1">{currentUser?.fullName}</h4>
            <div className="text-muted small font-monospace mb-2">{currentUser?.email}</div>

            <div className="mb-3">
              <Badge
                bg={currentUser?.role === 'ADMIN' ? 'danger' : 'primary'}
                className="px-3 py-2 rounded-pill fw-bold"
              >
                {currentUser?.role === 'ADMIN' ? 'QUẢN TRỊ VIÊN TOÀN QUYỀN' : 'HỌC VIÊN CHÍNH THỨC'}
              </Badge>
            </div>

            <p className="small text-secondary px-2 mb-4">
              "{bio || 'Chăm chỉ mỗi ngày để trở thành kỹ sư phần mềm xuất sắc.'}"
            </p>

            {/* Khối Số dư ví */}
            <div className="p-3 bg-light rounded-4 mb-4 text-start border">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-bold">SỐ DƯ VÍ EDUVIET</span>
                <i className="bi bi-wallet-fill text-success fs-5"></i>
              </div>
              <div className="fs-4 fw-bold text-success">
                {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ
              </div>
              <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                Dùng để mua khóa học & thanh toán tài liệu bản quyền
              </div>
            </div>

            {/* Các thông số khác */}
            <div className="row g-2 text-start">
              <div className="col-6">
                <div className="p-2 border rounded-3 text-center">
                  <span className="small text-muted d-block">Khóa học</span>
                  <strong className="fs-5 text-primary">{enrolledCoursesData.length}</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 border rounded-3 text-center">
                  <span className="small text-muted d-block">Chứng chỉ</span>
                  <strong className="fs-5 text-warning">2</strong>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Cột phải: Các Tabs chi tiết */}
        <Col lg={8}>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Card className="border-0 rounded-4 shadow-sm bg-white p-3 p-md-4">
              <Nav variant="pills" className="bg-light p-1 rounded-4 mb-4 border">
                <Nav.Item>
                  <Nav.Link eventKey="info" className="fw-bold px-3 rounded-3">
                    <i className="bi bi-person-lines-fill me-2"></i>Thông Tin Cá Nhân
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="courses" className="fw-bold px-3 rounded-3">
                    <i className="bi bi-mortarboard-fill me-2"></i>Khóa Học & Tiến Độ ({enrolledCoursesData.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="deposits" className="fw-bold px-3 rounded-3">
                    <i className="bi bi-clock-history me-2"></i>Lịch Sử Nạp Tiền ({depositHistory.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="security" className="fw-bold px-3 rounded-3">
                    <i className="bi bi-shield-check me-2"></i>Bảo Mật & Mật Khẩu
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* TAB 1: THÔNG TIN HỒ SƠ */}
                <Tab.Pane eventKey="info">
                  <Form onSubmit={handleSaveProfile}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Họ và tên đầy đủ</Form.Label>
                          <Form.Control
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Địa chỉ Email (Định danh)</Form.Label>
                          <Form.Control
                            type="email"
                            value={currentUser?.email}
                            disabled
                            className="bg-light"
                          />
                          <Form.Text className="text-muted" style={{ fontSize: '0.72rem' }}>
                            Email đăng nhập không thể thay đổi
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Số điện thoại liên hệ</Form.Label>
                          <Form.Control
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Chuyên ngành theo đuổi</Form.Label>
                          <Form.Select
                            value={targetTrack}
                            onChange={(e) => setTargetTrack(e.target.value)}
                          >
                            <option value="Frontend Web Engineer">Frontend Web Engineer (React/Next)</option>
                            <option value="Backend & Cloud Engineer">Backend & Cloud (NestJS/MySQL)</option>
                            <option value="AI & Data Scientist">AI & Python Data Science</option>
                            <option value="DevOps Specialist">DevOps & Cloud Microservices</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Đường dẫn GitHub / Portfolio cá nhân</Form.Label>
                          <Form.Control
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Tiểu sử giới thiệu (Bio)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Mô tả ngắn về kinh nghiệm và mục tiêu sự nghiệp của bạn..."
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                      <Button type="submit" variant="primary" className="fw-bold px-4">
                        <i className="bi bi-save me-1"></i> Lưu Thay Đổi Hồ Sơ
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>

                {/* TAB 2: KHÓA HỌC & TIẾN ĐỘ */}
                <Tab.Pane eventKey="courses">
                  <h5 className="fw-bold mb-3">Khóa Học Đã Đăng Ký & Tiến Độ Tốt Nghiệp</h5>
                  {enrolledCoursesData.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {enrolledCoursesData.map((course, idx) => (
                        <div key={course.course_id} className="p-3 border rounded-4 bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={course.thumbnail_url}
                                alt=""
                                width={60}
                                height={45}
                                className="rounded-3 object-fit-cover shadow-sm"
                              />
                              <div>
                                <strong className="text-dark d-block">{course.title}</strong>
                                <span className="text-muted small">Giảng viên: {course.instructor?.name}</span>
                              </div>
                            </div>
                            <Button
                              variant="success"
                              size="sm"
                              className="fw-bold rounded-pill px-3 shadow-sm"
                              onClick={() => onStartLearning?.(course)}
                            >
                              <i className="bi bi-play-circle-fill me-1"></i> Vào Học Ngay
                            </Button>
                          </div>

                          <div className="mt-2">
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>Tiến độ hoàn thành</span>
                              <span className="fw-bold text-primary">{35 + idx * 20}%</span>
                            </div>
                            <ProgressBar now={35 + idx * 20} variant="primary" style={{ height: 6 }} className="rounded-pill" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-journal-code text-muted display-4 d-block mb-3"></i>
                      <h6>Bạn chưa đăng ký khóa học lập trình nào</h6>
                      <p className="text-secondary small">Hãy khám phá thư viện khóa học để nâng cấp kỹ năng ngay hôm nay.</p>
                    </div>
                  )}
                </Tab.Pane>

                {/* TAB 3: LỊCH SỬ NẠP TIỀN */}
                <Tab.Pane eventKey="deposits">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Lịch Sử Nạp Tiền & Biến Động Số Dư</h5>
                      <p className="text-secondary small mb-0">Theo dõi toàn bộ nhật ký nạp tiền, quà tặng khuyến mãi và thanh toán.</p>
                    </div>
                    <Button variant="success" size="sm" className="fw-bold px-3 rounded-pill shadow-sm" onClick={onOpenDeposit}>
                      <i className="bi bi-plus-circle me-1"></i> Nạp thêm
                    </Button>
                  </div>

                  {depositHistory && depositHistory.length > 0 ? (
                    <div className="table-responsive rounded-4 border bg-white overflow-hidden shadow-sm">
                      <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                        <thead className="table-light">
                          <tr className="text-secondary" style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>
                            <th className="py-3 px-3">Mã GD</th>
                            <th className="py-3">Thời Gian</th>
                            <th className="py-3">Phương Thức</th>
                            <th className="py-3 text-end">Số Tiền</th>
                            <th className="py-3 text-center">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {depositHistory.map((item) => (
                            <tr key={item.id}>
                              <td className="py-3 px-3">
                                <span className="fw-bold font-monospace text-dark">{item.id}</span>
                                <small className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                                  {item.note || 'Nạp ví học tập'}
                                </small>
                              </td>
                              <td className="py-3 text-muted small">
                                <i className="bi bi-clock me-1"></i>
                                {item.date}
                              </td>
                              <td className="py-3">
                                <span className="badge bg-light text-dark border px-2 py-1 rounded-3">
                                  {item.method || 'QR Ngân hàng / ATM'}
                                </span>
                              </td>
                              <td className="py-3 text-end fw-bold text-success font-monospace">
                                +{Number(item.amount).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 text-center">
                                <Badge
                                  bg={item.status === 'Thành công' ? 'success' : 'warning'}
                                  className="rounded-pill px-2 py-1 fw-semibold"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <i className={`bi ${item.status === 'Thành công' ? 'bi-check-circle-fill' : 'bi-hourglass-split'} me-1`}></i>
                                  {item.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5 border rounded-4 bg-light">
                      <i className="bi bi-wallet2 text-muted display-4 d-block mb-3"></i>
                      <h6>Chưa có lịch sử giao dịch nạp tiền</h6>
                      <p className="text-secondary small mb-3">Số dư của bạn sẽ được bảo mật và cộng dồn ngay sau khi nạp.</p>
                      <Button variant="primary" size="sm" className="fw-bold rounded-pill px-3" onClick={onOpenDeposit}>
                        Nạp tiền ngay
                      </Button>
                    </div>
                  )}
                </Tab.Pane>

                {/* TAB 4: BẢO MẬT & MẬT KHẨU */}
                <Tab.Pane eventKey="security">
                  <h5 className="fw-bold mb-3">Đổi Mật Khẩu Đăng Nhập</h5>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3" style={{ maxWidth: 450 }}>
                      <Form.Label className="small fw-bold">Mật khẩu hiện tại</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu đang dùng..."
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ maxWidth: 450 }}>
                      <Form.Label className="small fw-bold">Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Tối thiểu 6 ký tự..."
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" style={{ maxWidth: 450 }}>
                      <Form.Label className="small fw-bold">Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập lại mật khẩu mới..."
                        value={confirmNewPass}
                        onChange={(e) => setConfirmNewPass(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="danger" className="fw-bold px-4">
                      <i className="bi bi-key-fill me-1"></i> Cập Nhật Mật Khẩu Mới
                    </Button>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </div>
  );
}
