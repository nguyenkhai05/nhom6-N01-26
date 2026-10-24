# 🎓 EduViet LMS - Nền Tảng Học Lập Trình Trực Tuyến Thực Chiến
> **Dự án Nhóm 6 - Lớp N01-26**  
> Kiến trúc Master Template: Giao diện Booking.com Search Bar chuẩn Responsive, Phân quyền RBAC 3 cấp độ (Guest, Học viên có Ví điện tử, Admin Singleton), và Phòng Học Live Code Studio tương tác.

---

## 🌟 Tính Năng Nổi Bật

### 1. 🛡️ Bảo Mật & Phân Quyền (3-Role RBAC Security Matrix)
- **Khách vãng lai (Guest)**: Xem danh mục khóa học, tìm kiếm theo công nghệ/độ khó, xem đề cương bài giảng và học thử miễn phí.
- **Học viên chính thức (Student / User)**:
  - Đăng ký tài khoản nhận ngay **1.000.000 đ** vào ví học tập.
  - Quản lý ví điện tử: Nạp tiền tự động qua **Vietcombank QR (VietQR 24/7)** và **Ví MoMo Auto-Pay**.
  - Xem lịch sử biến động số dư ví, nạp tiền và hóa đơn điện tử.
  - Sở hữu khóa học trọn đời, cấp chứng chỉ tốt nghiệp điện tử có mã QR xác thực.
- **Quản trị viên (Admin Singleton)**:
  - Tài khoản quản trị độc quyền: `admin` / `Eduenglish123`.
  - Nghiêm cấm mọi hành vi tự do đăng ký tài khoản quyền Admin qua form ngoài.
  - Toàn quyền CRUD khóa học, duyệt đơn hàng thanh toán chuyển khoản, nạp/trừ ví học viên và quản lý mã giảm giá Voucher.

### 2. 📝 Bộ Modal Xác Nhận & Chúc Mừng Chi Tiết (Detailed Confirmations)
- **Bảng Xác Nhận Đăng Ký Tài Khoản**: Rà soát đầy đủ họ tên, email Gmail, số điện thoại, lộ trình theo đuổi, mật khẩu mã hóa SHA-256, thẻ định danh học viên `STU-xxxxxx` và quà tặng chào mừng.
- **Bảng Xác Nhận Đăng Ký Khóa Học**: Đối soát học phí, số dư ví hiện có, số dư còn lại sau khi thanh toán, quyền lợi học trọn đời và cam kết hoàn tiền 100% trong 7 ngày.
- **Bảng Xác Nhận Nạp Tiền Vào Ví**: Quy trình 2 bước trực quan, tự động miễn phí 100% cổng thanh toán, sinh mã tham chiếu `DEP-xxxxx`.
- **Màn Hình Chúc Mừng Vinh Danh**: Thông báo hoàn tất kèm biên lai điện tử và nút **"Vào Học Ngay Lập Tức"**.

### 3. 💻 Phòng Học Trực Tuyến Tương Tác (Course Learning Room)
- **Trình chiếu Video bài giảng**: Tích hợp danh sách bài học chia theo chương, theo dõi tiến độ hoàn thành tự động theo tỉ lệ phần trăm.
- **EduViet Live Interactive Code Studio**:
  - Khung soạn thảo code trực tiếp trên trình duyệt (JavaScript / Node.js 20).
  - Tích hợp Terminal Console Output biên dịch code trực tuyến tức thì.
- **Mục "Quóa Học Của Tôi"**: Tự động chuyển đổi nút sang **"Vào Học Ngay"** và **"Giáo Trình & Tài Liệu"** cho những khóa học đã sở hữu.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
nhom6-N01-26/
├── frontend/                     # Ứng dụng Single Page App (React 19 + Vite + Bootstrap 5)
│   ├── public/                   # Tài nguyên tĩnh, favicon, icons
│   ├── src/
│   │   ├── assets/               # Hình ảnh, logo, vector
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx        # Bảng điều khiển quản trị hệ thống
│   │   │   ├── AuthModal.jsx             # Đăng nhập / Đăng ký & Bảng xác nhận hồ sơ
│   │   │   ├── CareerRoadmap.jsx         # Lộ trình nghề nghiệp Frontend/Backend/AI
│   │   │   ├── CartPage.jsx              # Giỏ hàng khóa học & Mã giảm giá
│   │   │   ├── ChatSupport.jsx           # Trợ lý ảo AI & Hỗ trợ kỹ thuật 24/7
│   │   │   ├── CheckoutPage.jsx          # Thanh toán & Bảng xác nhận đơn hàng
│   │   │   ├── CodeArena.jsx             # Đấu trường luyện thuật toán trực tuyến
│   │   │   ├── ConversionTriggers.jsx    # Ưu đãi khuyến mãi & Đếm ngược Voucher
│   │   │   ├── CourseCard.jsx            # Thẻ khóa học thông minh đa trạng thái
│   │   │   ├── CourseLearningRoom.jsx    # Phòng học bài giảng & Live Code Studio
│   │   │   ├── CourseList.jsx            # Danh sách khóa học có bộ lọc công nghệ
│   │   │   ├── DepositHistoryModal.jsx   # Sổ giao dịch nạp ví & Hóa đơn điện tử
│   │   │   ├── home/                     # Các khối trang chủ theo mẫu Booking.com
│   │   │   │   ├── ScrollRow.jsx             # Hàng thẻ cuộn ngang + nút mũi tên tròn
│   │   │   │   ├── PlanSection.jsx           # Tab chuyên ngành + "Lộ trình nghề nghiệp"
│   │   │   │   ├── BrowseSections.jsx        # Tìm theo trình độ & Khám phá chuyên ngành
│   │   │   │   ├── DealsSection.jsx          # Thẻ ưu đãi & Khóa học yêu thích (nút tim)
│   │   │   │   └── SavingsAndPopular.jsx     # Banner đăng nhập & Lưới liên kết phổ biến
│   │   │   └── UserProfile.jsx           # Hồ sơ cá nhân & Quản lý khóa học của tôi
│   │   ├── hooks/
│   │   │   └── useCatalog.js             # Tải khóa học + danh mục từ backend (loading/ready/error)
│   │   ├── services/
│   │   │   └── api.js                    # Gọi API NestJS (GET /courses, /categories), chuẩn hóa dữ liệu
│   │   ├── utils/
│   │   │   └── catalog.js                # Nhãn trình độ, định dạng giá, gom danh mục
│   │   ├── App.jsx                       # Điều hướng chính, State Store & Modals
│   │   ├── Header.jsx                    # Header Full-Width & Dropdown tài khoản
│   │   ├── Her.jsx                       # Booking.com style Search Bar (Viền vàng 3px)
│   │   ├── Offers.jsx                    # Khối "Vì sao chọn EduViet?"
│   │   ├── Footer.jsx                    # Chân trang 5 cột + dải liên kết nhanh (kiểu Booking.com)
│   │   ├── home-sections.css             # CSS các khối trang chủ (tiền tố bv-)
│   │   └── main.jsx                      # Điểm khởi chạy React DOM
│   ├── .env.example                  # Mẫu biến môi trường (VITE_API_URL)
│   ├── package.json
│   └── vite.config.js
│
├── lms/                          # Backend API Services (NestJS 12 + TypeORM + MySQL)
│   ├── src/
│   │   ├── category/             # Module quản lý danh mục khóa học
│   │   ├── course/               # Module API khóa học (kèm danh mục + giảng viên, lọc category_id/level/q)
│   │   ├── course-module/        # Module chương mục bài học
│   │   ├── enrollment/           # Module đăng ký & phân quyền học viên
│   │   ├── student/              # Module hồ sơ học viên & ví tiền
│   │   ├── user/                 # Module xác thực người dùng
│   │   └── database/             # Kết nối cơ sở dữ liệu MySQL
│   ├── .env.example              # Mẫu cấu hình kết nối MySQL (copy thành .env)
│   ├── package.json
│   └── tsconfig.json
│
├── .devcontainer/                # Cấu hình môi trường ảo Docker Dev Containers
├── lms_db.sql                    # Script CSDL MySQL khởi tạo bảng và dữ liệu mẫu
├── GEMINI.md                     # Bản đặc tả kiến trúc EduEnglish Master Template
└── README.md                     # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18.x trở lên (khuyên dùng LTS 20.x hoặc 22.x)
- **Git**
- **Trình duyệt**: Chrome, Edge, Firefox hoặc Safari mới nhất

---

### 1. Khởi chạy Ứng Dụng Frontend (React + Vite)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện dependencies
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Sau khi chạy lệnh trên, ứng dụng sẽ hoạt động tại:  
👉 **`http://localhost:5173`** (hoặc địa chỉ IP hiển thị trên terminal).

> Trang chủ lấy khóa học và danh mục từ backend. Nếu backend chưa bật, trang hiện cảnh báo và dùng dữ liệu lưu sẵn. Nếu backend chạy ở địa chỉ khác, sao chép `frontend/.env.example` thành `frontend/.env` và sửa `VITE_API_URL`.

---

### 2. Khởi chạy Máy Chủ Backend (NestJS - Tùy chọn)

```bash
# Di chuyển vào thư mục lms
cd lms

# Cài đặt thư viện dependencies
npm install

# Khởi chạy máy chủ NestJS ở chế độ Development
npm run start:dev
```

Máy chủ backend sẽ chạy tại:  
👉 **`http://localhost:3000`**

| Endpoint | Mô tả |
| :--- | :--- |
| `GET /courses` | Khóa học đã Published, kèm danh mục và tên giảng viên. Lọc bằng `?category_id=`, `?level=` (Beginner/Intermediate/Advanced), `?q=` |
| `GET /courses/:id` | Chi tiết một khóa học (404 nếu không tồn tại) |
| `GET /categories` | Danh sách danh mục |

---

### 3. Cơ Sở Dữ Liệu MySQL (Database)
- Import file **`lms_db.sql`** ở thư mục gốc vào MySQL / phpMyAdmin / XAMPP.
- Sao chép `lms/.env.example` thành `lms/.env` rồi chỉnh thông tin kết nối:
  ```env
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=
  DB_DATABASE=lms_db
  ```

---

## 🔑 Tài Khoản Thử Nghiệm Hệ Thống

| Vai Trò | Email / Tên Đăng Nhập | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin` | `Eduenglish123` | Toàn quyền quản trị CSDL, thêm/sửa/xóa khóa học, duyệt đơn hàng, nạp ví học viên |
| **Học Viên (Student)** | `dev.nguyen@gmail.com` | `123456` | Số dư sẵn có, sở hữu khóa học, học trực tuyến |
| **Đăng Ký Mới** | *(Bất kỳ Gmail nào)* | *(Tự chọn $\ge$ 6 ký tự)* | Nhận ngay **1.000.000 đ** vào ví học tập khi hoàn tất đăng ký |

---

## 👥 Nhóm Thực Hiện
- **Dự án**: Hệ thống quản lý học tập & kinh doanh khóa học lập trình trực tuyến EduViet LMS
- **Đơn vị**: Nhóm 6 - Lớp N01-26
- **Công nghệ chính**: React 19, Vite, Bootstrap 5, NestJS 12, TypeORM, MySQL, Git