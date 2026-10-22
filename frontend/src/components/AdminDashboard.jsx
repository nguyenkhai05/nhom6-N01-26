import { useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Tab, Nav, Alert, InputGroup } from 'react-bootstrap';

export default function AdminDashboard({
  courses = [],
  orders: externalOrders,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) {
  const [activeTab, setActiveTab] = useState('courses');

  // Quản lý học viên (Users & Students)
  const [students, setStudents] = useState([
    { id: 101, name: 'Nguyễn Văn Dev', email: 'dev.nguyen@gmail.com', wallet: 1500000, enrolled: 3, status: 'Active', joinDate: '12/10/2026' },
    { id: 102, name: 'Trần Thị Backend', email: 'tran.backend@gmail.com', wallet: 490000, enrolled: 2, status: 'Active', joinDate: '14/10/2026' },
    { id: 103, name: 'Lê Hoàng Long', email: 'long.ai@gmail.com', wallet: 2500000, enrolled: 4, status: 'Active', joinDate: '15/10/2026' },
    { id: 104, name: 'Phạm Đức Anh', email: 'anh.devops@gmail.com', wallet: 0, enrolled: 1, status: 'Locked', joinDate: '01/10/2026' },
  ]);

  // Quản lý đơn hàng & thanh toán (Orders & Transactions)
  const [orders, setOrders] = useState(() => {
    return externalOrders || [
      { id: 'ORD-8821', userEmail: 'dev.nguyen@gmail.com', items: [{ title: 'Lập Trình Web Frontend Chuyên Sâu' }], amount: 890000, method: 'Ví EduViet', status: 'Completed', date: '15/10/2026 21:30' },
      { id: 'ORD-8822', userEmail: 'tran.backend@gmail.com', items: [{ title: 'Backend & RESTful API cùng NestJS' }], amount: 950000, method: 'QR Chuyển Khoản', status: 'Completed', date: '15/10/2026 22:15' },
    ];
  });

  // Quản lý voucher mã giảm giá
  const [coupons, setCoupons] = useState([
    { code: 'EDUVIET2026', discount: '20%', usage: '45/100', status: 'Active', expiry: '31/12/2026' },
    { code: 'DEVNEWBIE', discount: '100.000 đ', usage: '89/200', status: 'Active', expiry: '30/11/2026' },
    { code: 'FULLSTACKVIP', discount: '30%', usage: '12/50', status: 'Active', expiry: '15/11/2026' },
  ]);

  // State Modal Course
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(690000);
  const [courseCategory, setCourseCategory] = useState('Frontend');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDuration, setCourseDuration] = useState('40 giờ');
  const [courseInstructor, setCourseInstructor] = useState('Senior Mentor');

  // State Modal Nạp tiền ví cho học viên
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [walletAmountToAdd, setWalletAmountToAdd] = useState('500000');

  // State Modal Duyệt Đơn Hàng (Xác nhận chi tiết)
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [orderToApprove, setOrderToApprove] = useState(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Course actions
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseTitle('');
    setCoursePrice(690000);
    setCourseCategory('Frontend');
    setCourseDesc('');
    setCourseDuration('40 giờ');
    setCourseInstructor('EduViet Senior Mentor');
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (c) => {
    setEditingCourse(c);
    setCourseTitle(c.title);
    setCoursePrice(c.price);
    setCourseCategory(c.category?.name || 'Frontend');
    setCourseDesc(c.description || '');
    setCourseDuration(c.duration || '40 giờ');
    setCourseInstructor(c.instructor?.name || 'Senior Mentor');
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (editingCourse) {
      onUpdateCourse?.({
        ...editingCourse,
        title: courseTitle,
        price: Number(coursePrice),
        description: courseDesc,
        duration: courseDuration,
        category: { name: courseCategory },
        instructor: { name: courseInstructor },
      });
    } else {
      onAddCourse?.({
        course_id: Date.now(),
        title: courseTitle,
        slug: courseTitle.toLowerCase().replace(/\s+/g, '-'),
        price: Number(coursePrice),
        description: courseDesc,
        duration: courseDuration,
        category: { name: courseCategory },
        instructor: { name: courseInstructor },
        studentsCount: 0,
        rating: '5.0',
        thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      });
    }
    setShowCourseModal(false);
  };

  // Student actions
  const handleToggleStudentStatus = (studentId) => {
    setStudents(prev =>
      prev.map(s => s.id === studentId ? { ...s, status: s.status === 'Active' ? 'Locked' : 'Active' } : s)
    );
  };

  const handleAddWalletBalance = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const addVal = Number(walletAmountToAdd);
    setStudents(prev =>
      prev.map(s => s.id === selectedStudent.id ? { ...s, wallet: s.wallet + addVal } : s)
    );
    setShowWalletModal(false);
    alert(`Đã cộng ${addVal.toLocaleString('vi-VN')} đ vào ví học viên ${selectedStudent.name}!`);
  };

  // Order actions
  const handleApproveOrder = (ordId) => {
    setOrders(prev =>
      prev.map(o => o.id === ordId ? { ...o, status: 'Completed' } : o)
    );
  };

  // Thống kê tổng quan KPI
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalStudents = students.length;
  const totalCourses = courses.length;

  return (
    <div className="app-container py-4 page-fade-in">
      {/* Header Quản Trị */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-danger text-white px-3 py-1 rounded-pill fw-bold mb-2">
            <i className="bi bi-shield-lock-fill me-1"></i> ADMIN CONSOLE • SINGLETON PRIVILEGE
          </span>
          <h2 className="fw-bold text-dark mb-1">
            Trung Tâm Quản Trị Hệ Thống EduViet
          </h2>
          <p className="text-secondary small mb-0">
            Toàn quyền quản lý: Khóa học, Học viên & Ví tiền, Đơn hàng thanh toán, Mã ưu đãi và Doanh thu.
          </p>
        </div>

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Button variant="danger" className="fw-bold px-3 shadow-sm" onClick={handleOpenAddCourse}>
            <i className="bi bi-plus-circle-fill me-2"></i>Thêm Khóa Học Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards Thống Kê Nhanh */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">TỔNG DOANH THU</span>
                <h4 className="fw-bold text-success mb-0 mt-1">
                  {totalRevenue.toLocaleString('vi-VN')} đ
                </h4>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-4 fs-3">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
            <div className="small text-muted mt-2">
              <span className="text-success fw-bold"><i className="bi bi-arrow-up-right me-1"></i>+18.4%</span> so với tuần trước
            </div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">HỌC VIÊN HOẠT ĐỘNG</span>
                <h4 className="fw-bold text-primary mb-0 mt-1">
                  {totalStudents} học viên
                </h4>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-4 fs-3">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="small text-muted mt-2">
              <span className="text-primary fw-bold">100%</span> tài khoản xác thực
            </div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">KHÓA HỌC HIỆN CÓ</span>
                <h4 className="fw-bold text-warning mb-0 mt-1">
                  {totalCourses} khóa học
                </h4>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-4 fs-3">
                <i className="bi bi-mortarboard-fill"></i>
              </div>
            </div>
            <div className="small text-muted mt-2">
              <span className="text-warning fw-bold">4.92 ★</span> Điểm đánh giá TB
            </div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-bold">ĐƠN HÀNG THÀNH CÔNG</span>
                <h4 className="fw-bold text-info mb-0 mt-1">
                  {orders.length} giao dịch
                </h4>
              </div>
              <div className="p-3 bg-info bg-opacity-10 text-info rounded-4 fs-3">
                <i className="bi bi-check-circle-fill"></i>
              </div>
            </div>
            <div className="small text-muted mt-2">
              <span className="text-success fw-bold">100%</span> Tự động kích hoạt
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Tabs Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="bg-white p-2 rounded-4 border shadow-sm mb-4">
          <Nav.Item>
            <Nav.Link eventKey="courses" className="fw-bold px-3">
              <i className="bi bi-book-half me-2"></i>Quản Lý Khóa Học ({courses.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="students" className="fw-bold px-3">
              <i className="bi bi-person-lines-fill me-2"></i>Học Viên & Ví Tiền ({students.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders" className="fw-bold px-3">
              <i className="bi bi-receipt me-2"></i>Lịch Sử Giao Dịch & Đơn ({orders.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="coupons" className="fw-bold px-3">
              <i className="bi bi-ticket-perforated me-2"></i>Mã Giảm Giá Voucher ({coupons.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* TAB 1: QUẢN LÝ KHÓA HỌC */}
          <Tab.Pane eventKey="courses">
            <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Danh Sách Khóa Học Lập Trình</h5>
                <div style={{ width: 280 }}>
                  <InputGroup size="sm">
                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm tên khóa học..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </div>

              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Khóa Học</th>
                    <th>Chuyên Ngành</th>
                    <th>Giảng Viên</th>
                    <th>Thời Lượng</th>
                    <th>Học Phí</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {courses
                    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((course) => (
                      <tr key={course.course_id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={course.thumbnail_url}
                              alt=""
                              className="rounded-3 object-fit-cover"
                              width={54}
                              height={38}
                            />
                            <div>
                              <strong className="text-dark d-block">{course.title}</strong>
                              <span className="text-muted small">ID: #{course.course_id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary">{course.category?.name}</Badge>
                        </td>
                        <td className="small">{course.instructor?.name}</td>
                        <td className="small text-muted">{course.duration || '40 giờ'}</td>
                        <td className="fw-bold text-primary">
                          {Number(course.price).toLocaleString('vi-VN')} đ
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleOpenEditCourse(course)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => onDeleteCourse?.(course.course_id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          {/* TAB 2: QUẢN LÝ HỌC VIÊN & VÍ */}
          <Tab.Pane eventKey="students">
            <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Quản Lý Học Viên & Số Dư Ví</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="fw-bold"
                  onClick={() => alert('Xuất danh sách học viên ra file Excel/CSV thành công!')}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i>Xuất Excel
                </Button>
              </div>

              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Học Viên</th>
                    <th>Email</th>
                    <th>Số Dư Ví</th>
                    <th>Đã Đăng Ký</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Tham Gia</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td className="small font-monospace">{student.email}</td>
                      <td>
                        <strong className="text-success fs-6">
                          {student.wallet.toLocaleString('vi-VN')} đ
                        </strong>
                      </td>
                      <td>
                        <Badge bg="info">{student.enrolled} khóa</Badge>
                      </td>
                      <td>
                        <Badge bg={student.status === 'Active' ? 'success' : 'danger'}>
                          {student.status === 'Active' ? 'Đang hoạt động' : 'Đã khóa'}
                        </Badge>
                      </td>
                      <td className="small text-muted">{student.joinDate}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Nạp tiền vào ví cho học viên"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowWalletModal(true);
                            }}
                          >
                            <i className="bi bi-wallet2 me-1"></i>+ Nạp Ví
                          </Button>
                          <Button
                            variant={student.status === 'Active' ? 'outline-warning' : 'outline-primary'}
                            size="sm"
                            onClick={() => handleToggleStudentStatus(student.id)}
                          >
                            {student.status === 'Active' ? 'Khóa' : 'Mở'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          {/* TAB 3: QUẢN LÝ ĐƠN HÀNG */}
          <Tab.Pane eventKey="orders">
            <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
              <h5 className="fw-bold mb-3">Lịch Sử Giao Dịch & Đơn Hàng Mới Nhất</h5>
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Email Học Viên</th>
                    <th>Khóa Học Mua</th>
                    <th>Số Tiền</th>
                    <th>Phương Thức</th>
                    <th>Thời Gian</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="font-monospace fw-bold">{ord.id}</td>
                      <td className="small">{ord.userEmail || ord.user || 'Học viên'}</td>
                      <td className="small fw-semibold">
                        {ord.items && ord.items.length > 0
                          ? ord.items.map((i) => i.title).join(', ')
                          : ord.course || 'Khóa học lập trình'}
                      </td>
                      <td className="fw-bold text-primary font-monospace">
                        {Number(ord.amount).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="small">
                        <span className="badge bg-light text-dark border">{ord.method}</span>
                      </td>
                      <td className="small text-muted">{ord.date}</td>
                      <td>
                        {ord.status === 'Completed' ? (
                          <Badge bg="success"><i className="bi bi-check2 me-1"></i>Thành công</Badge>
                        ) : (
                          <Button
                            variant="warning"
                            size="sm"
                            className="fw-bold"
                            onClick={() => {
                              setOrderToApprove(ord);
                              setShowApproveModal(true);
                            }}
                          >
                            <i className="bi bi-check2-circle me-1"></i>Xác nhận duyệt
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          {/* TAB 4: MÃ GIẢM GIÁ */}
          <Tab.Pane eventKey="coupons">
            <Card className="border-0 rounded-4 shadow-sm p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Chương Trình Mã Khuyến Mãi (Coupons)</h5>
                <Button
                  variant="primary"
                  size="sm"
                  className="fw-bold"
                  onClick={() => alert('Thêm mã giảm giá mới!')}
                >
                  <i className="bi bi-plus-lg me-1"></i>Tạo Mã Mới
                </Button>
              </div>

              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mã Code</th>
                    <th>Mức Giảm</th>
                    <th>Đã Dùng / Giới Hạn</th>
                    <th>Hạn Sử Dụng</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((cp, idx) => (
                    <tr key={idx}>
                      <td><code className="fs-6 fw-bold text-danger">{cp.code}</code></td>
                      <td className="fw-bold text-success">{cp.discount}</td>
                      <td>{cp.usage}</td>
                      <td className="small text-muted">{cp.expiry}</td>
                      <td><Badge bg="success">{cp.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modal Thêm/Sửa Khóa Học */}
      <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger">
            {editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Lập Trình Mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveCourse}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Tên Khóa Học</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Chuyên Ngành</Form.Label>
                  <Form.Select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Học Phí (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Thời Lượng (giờ)</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Giảng Viên / Mentor</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Mô Tả Khóa Học</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 pt-2 border-top d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="danger" className="fw-bold px-4">
                {editingCourse ? 'Lưu Thay Đổi' : 'Tạo Khóa Học'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Nạp Tiền Vào Ví Học Viên (Dành Cho Admin) */}
      <Modal show={showWalletModal} onHide={() => setShowWalletModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-success">
            <i className="bi bi-wallet2 me-2"></i>Nạp Ví Cho Học Viên
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Form onSubmit={handleAddWalletBalance}>
              <div className="p-3 bg-light rounded-3 mb-3 small">
                <div>Học viên: <strong>{selectedStudent.name}</strong></div>
                <div>Email: <span className="font-monospace">{selectedStudent.email}</span></div>
                <div className="mt-1">Số dư hiện tại: <strong className="text-success">{selectedStudent.wallet.toLocaleString('vi-VN')} đ</strong></div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Số tiền muốn nạp thêm</Form.Label>
                <Form.Select
                  value={walletAmountToAdd}
                  onChange={(e) => setWalletAmountToAdd(e.target.value)}
                >
                  <option value="200000">+ 200.000 đ</option>
                  <option value="500000">+ 500.000 đ</option>
                  <option value="1000000">+ 1.000.000 đ</option>
                  <option value="2000000">+ 2.000.000 đ</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="success" className="w-100 fw-bold py-2">
                Xác Nhận Nạp Vào Tài Khoản
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Bảng Xác Nhận Duyệt Đơn Hàng Chi Tiết (Dành Cho Admin) */}
      <Modal
        show={showApproveModal}
        onHide={() => setShowApproveModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-bold fs-5 text-warning-emphasis d-flex align-items-center gap-2">
            <i className="bi bi-shield-check text-warning fs-4"></i>
            XÁC NHẬN PHÊ DUYỆT ĐƠN HÀNG HỌC VIÊN
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {orderToApprove && (
            <div>
              <Alert variant="warning" className="d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>Thao tác phê duyệt sẽ kích hoạt quyền truy cập học tập trọn đời cho học viên và ghi nhận doanh thu vào hệ thống.</span>
              </Alert>

              <div className="p-3 bg-light rounded-3 border mb-3">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-receipt-cutoff text-primary me-2"></i>
                  Chi Tiết Đơn Hàng #{orderToApprove.id}
                </h6>
                <div className="row g-2 small text-secondary">
                  <div className="col-sm-6">
                    Mã đơn hàng: <strong className="text-dark font-monospace">{orderToApprove.id}</strong>
                  </div>
                  <div className="col-sm-6">
                    Học viên: <strong className="text-dark">{orderToApprove.userName || 'Học viên'}</strong>
                  </div>
                  <div className="col-sm-6">
                    Email: <strong className="text-dark">{orderToApprove.userEmail || orderToApprove.user}</strong>
                  </div>
                  <div className="col-sm-6">
                    Thời điểm tạo: <strong className="text-dark">{orderToApprove.date}</strong>
                  </div>
                  <div className="col-sm-6">
                    Phương thức: <Badge bg="light" className="text-dark border">{orderToApprove.method}</Badge>
                  </div>
                  <div className="col-sm-6">
                    Trạng thái hiện tại: <Badge bg="warning" text="dark">Chờ phê duyệt</Badge>
                  </div>
                </div>
              </div>

              <div className="table-responsive border rounded-3 mb-3">
                <table className="table table-sm align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2 ps-3">Khóa học đăng ký</th>
                      <th className="py-2 text-end pe-3">Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderToApprove.items && orderToApprove.items.length > 0 ? (
                      orderToApprove.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="ps-3 py-2 fw-semibold text-dark">{it.title}</td>
                          <td className="text-end pe-3 py-2 font-monospace fw-bold">
                            {Number(it.price || orderToApprove.amount).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="ps-3 py-2 fw-semibold text-dark">{orderToApprove.course || 'Khóa học lập trình'}</td>
                        <td className="text-end pe-3 py-2 font-monospace fw-bold">
                          {Number(orderToApprove.amount).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    )}
                    <tr className="table-light">
                      <td className="ps-3 py-2 fw-bold text-dark">TỔNG TIỀN PHÊ DUYỆT:</td>
                      <td className="text-end pe-3 py-2 fw-bold fs-5 text-primary font-monospace">
                        {Number(orderToApprove.amount).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-light rounded-3 small text-muted border">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-info-circle text-primary me-1"></i> Sau khi bấm Xác Nhận:
                </div>
                <ul className="mb-0 ps-3">
                  <li>Trạng thái đơn hàng đổi thành <strong>Thành công (Completed)</strong>.</li>
                  <li>Hệ thống gửi email hóa đơn điện tử tự động đến hòm thư của học viên.</li>
                  <li>Khóa học tự động kích hoạt trong danh sách sở hữu của học viên.</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4 fw-bold"
            onClick={() => setShowApproveModal(false)}
          >
            Quay Lại
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 fw-bold shadow-sm"
            onClick={() => {
              if (orderToApprove) {
                handleApproveOrder(orderToApprove.id);
                setShowApproveModal(false);
              }
            }}
          >
            <i className="bi bi-check2-circle me-1"></i> Đồng Ý Phê Duyệt Ngay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
