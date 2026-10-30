# 🎓 EduViet LMS - Nền Tảng Học Lập Trình Trực Tuyến Thực Chiến

> **Dự án Nhóm 6 - Lớp N01-26**  
> Kiến trúc Master Template: Giao diện Booking.com Search Bar chuẩn Responsive, Phân quyền RBAC 3 cấp độ (Guest, Học viên có Ví điện tử, Admin Singleton), và Phòng Học Live Code Studio tương tác.

---

## 🌟 Tính Năng Nổi Bật

### 1. 🛡️ Bảo Mật & Phân Quyền (3-Role RBAC Security Matrix)

- **Khách vãng lai (Guest)**: Xem danh mục khóa học, tìm kiếm theo công nghệ/độ khó, xem đề cương bài giảng và học thử miễn phí.
- **Học viên chính thức (Student / User)**:
  - Đăng ký tài khoản nhận ngay **1.000.000 đ** vào ví học tập qua sổ cái bất biến trên máy chủ.
  - Hỗ trợ đăng nhập / đăng ký nhanh bằng Google OAuth (Google Account Chooser Modal chuẩn giao diện `accounts.google.com`).
  - Quản lý ví điện tử: Nạp tiền mô phỏng tự động qua **Vietcombank QR (VietQR 24/7)** và **Ví MoMo Auto-Pay**.
  - Xem lịch sử biến động số dư ví (Wallet Ledger), đơn hàng đã mua và tiến độ học tập thực tế đồng bộ từ backend.
  - Sở hữu khóa học trọn đời, phòng học trực tuyến lưu mốc thời gian xem video và ghi chú bài giảng.
- **Quản trị viên (Admin Singleton)**:
  - Tài khoản quản trị độc quyền: `admin@eduviet.vn` / `Eduenglish123`.
  - Nghiêm cấm mọi hành vi tự do đăng ký tài khoản quyền Admin qua form ngoài.
  - Toàn quyền CRUD khóa học (`POST/PUT/DELETE /courses`), quản lý danh sách học viên (`/admin/users`), duyệt đơn hàng đối soát và xem báo cáo giao dịch.

### 2. 📝 Bộ Modal Xác Nhận & Chúc Mừng Chi Tiết (Detailed Confirmations)

- **Bảng Xác Nhận Đăng Ký Tài Khoản**: Rà soát đầy đủ họ tên, email, số điện thoại, lộ trình theo đuổi, thẻ định danh học viên `STU-xxxxxx` và quà tặng chào mừng.
- **Bảng Xác Nhận Đăng Ký Khóa Học**: Đối soát học phí, số dư ví hiện có, số dư còn lại sau khi thanh toán, quyền lợi học trọn đời và cam kết chất lượng.
- **Bảng Xác Nhận Nạp Tiền Vào Ví**: Quy trình 2 bước trực quan, tự động cập nhật số dư ví và lưu sổ cái giao dịch máy chủ.
- **Màn Hình Chúc Mừng Vinh Danh**: Thông báo hoàn tất kèm biên lai điện tử và nút **"Vào Học Ngay Lập Tức"**.

### 3. 💻 Phòng Học Trực Tuyến & Bộ Công Cụ Tương Tác

- **Trình chiếu Video bài giảng YouTube IFrame API**: Tích hợp danh sách bài học chia theo chương, theo dõi tiến độ hoàn thành tự động theo tỉ lệ phần trăm và autosave lên máy chủ (`PUT /learning/courses/:id/lessons/:id/progress`).
- **Ghi chú bài giảng đồng bộ server**: Học viên có thể ghi chú tại từng bài học, dữ liệu lưu trữ trực tiếp vào bảng `lesson_notes`.
- **Học thử tương tác (`/try`)**: Web Worker Sandbox chạy mã nguồn an toàn, watchdog 3000ms tự ngắt vòng lặp vô tận, kiểm thử Actual vs Expected không lộ đáp án.
- **Trung tâm luyện tập (`/practice`)**: Bài tập thuật toán, sửa lỗi bất đồng bộ/đột biến state và trung tâm ôn tập lỗ hổng kiến thức tự động ghi nhận câu sai.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
nhom6-N01-26/
├── frontend/                     # Ứng dụng Single Page App (React 19 + Vite + Bootstrap 5)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx        # Bảng điều khiển quản trị (nối API /admin/users, /commerce/admin)
│   │   │   ├── AuthModal.jsx             # Đăng nhập/Đăng ký & Google Account Chooser
│   │   │   ├── CartPage.jsx              # Giỏ hàng khóa học & Mã giảm giá
│   │   │   ├── CheckoutPage.jsx          # Thanh toán & Bảng xác nhận đơn hàng
│   │   │   ├── CourseLearningRoom.jsx    # Phòng học bài giảng, lưu tiến độ & ghi chú server
│   │   │   ├── CourseFinderPage.jsx      # Tìm khóa phù hợp (thuật toán 3 tiêu chí G, P, B)
│   │   │   ├── InteractiveTrialPage.jsx  # Học thử tương tác Web Worker Sandbox
│   │   │   ├── PracticeHub.jsx           # Luyện thuật toán & Ôn tập điểm yếu
│   │   │   ├── CommunityHub.jsx          # Diễn đàn hỏi đáp lập trình
│   │   │   ├── ArticlesHub.jsx           # Bài viết kiến thức chuyên sâu
│   │   │   └── home/                     # Các khối giao diện trang chủ Booking.com style
│   │   ├── services/
│   │   │   ├── api.js                    # Khóa học & danh mục
│   │   │   ├── auth.js                   # Xác thực JWT, Google Login, thông tin người dùng
│   │   │   ├── commerceApi.js            # Ví tiền, giỏ hàng, checkout, tiến độ học, quản trị admin
│   │   │   └── hubApi.js                 # API học thử, bài viết, cộng đồng, gợi ý khóa
│   │   └── utils/
│   │       └── codeRunner.js             # Bộ thực thi sandbox Web Worker dùng chung
│   ├── package.json
│   └── vite.config.js
│
├── lms/                          # Backend API Services (NestJS 12 + TypeORM + MySQL)
│   ├── src/
│   │   ├── auth/                 # Đăng nhập, đăng ký, JWT Guard, Google OAuth, Admin User controller
│   │   ├── category/             # Quản lý danh mục
│   │   ├── course/               # CRUD khóa học, đề cương, lọc theo công nghệ/trình độ
│   │   ├── commerce/             # Ví học tập, giỏ hàng, mã giảm giá, checkout, nạp tiền, hoàn tiền
│   │   ├── learning/             # Tiến độ bài học, ghi chú, trắc nghiệm, khóa học của tôi
│   │   ├── bundle/               # Gói combo khóa học
│   │   ├── project/              # Đồ án thực chiến & nộp bài
│   │   ├── practice/             # Kho bài tập thuật toán, sửa lỗi & đánh giá năng lực
│   │   ├── community/            # Bài viết cộng đồng, bình luận & duyệt bài
│   │   ├── article/              # Chuyên mục bài viết công nghệ
│   │   ├── course-finder/        # Thuật toán gợi ý khóa học thích ứng
│   │   ├── trial/                # Học thử tương tác
│   │   ├── help/                 # Trung tâm hỗ trợ & quản lý ticket
│   │   └── database/             # Kết nối TypeORM MySQL & Fallback Demo in-memory
│   ├── test/unit/                # 10 test suites (117 unit tests đạt 100%)
│   ├── .env.example              # Mẫu cấu hình biến môi trường
│   └── package.json
│
└── lms_db.sql                    # Script CSDL MySQL đầy đủ 30 bảng kèm dữ liệu mẫu
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Chuẩn bị Cơ Sở Dữ Liệu MySQL

1. Mở MySQL bằng MySQL Workbench, XAMPP hoặc phpMyAdmin.
2. Import file **`lms_db.sql`** tại thư mục gốc. Script tự động khởi tạo database `lms_db` cùng **30 bảng** đồng bộ 100% với TypeORM entities và nạp sẵn dữ liệu mẫu.
3. Sao chép `lms/.env.example` thành `lms/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=lms_db
DB_SYNCHRONIZE=false
DEMO_MODE=false
```

> **Ghi chú về `DEMO_MODE`:**
> - `DEMO_MODE=false`: Kết nối CSDL MySQL thật (khuyến nghị khi nộp bài và chấm điểm bảo vệ).
> - `DEMO_MODE=true`: Tự động kích hoạt bộ giả lập in-memory demo (dùng khi máy chấm chưa cài đặt dịch vụ MySQL).

### 2. Khởi chạy Backend (NestJS)

```bash
cd lms
npm install
npm run start:dev
# Hoặc chạy bản build sẵn: node dist/main.js
```

Backend mặc định lắng nghe tại: `http://localhost:3000`.

### 3. Khởi chạy Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Giao diện web sẵn sàng tại: 👉 **`http://localhost:5173`**.

---

## 📡 Danh Mục API Endpoints Chính

| Phân Hệ | Phương Thức & Đường Dẫn | Chức Năng |
| :--- | :--- | :--- |
| **Xác thực** | `POST /auth/login` | Đăng nhập tài khoản, trả về JWT Token |
| | `POST /auth/register` | Đăng ký học viên mới, cấp ví 1.000.000đ |
| | `POST /auth/google` | Đăng nhập / đăng ký nhanh qua Google |
| | `GET /auth/me` | Lấy thông tin tài khoản hiện tại |
| | `GET /admin/users` | Quản trị viên xem danh sách học viên |
| | `PUT /admin/users/:id/status` | Khóa / mở khóa tài khoản học viên |
| **Khóa học** | `GET /courses` | Danh sách khóa học (lọc từ khóa, level, danh mục) |
| | `GET /courses/:id` | Chi tiết khóa học và đề cương chương mục |
| | `POST /courses` | Thêm khóa học mới (Admin/Instructor) |
| | `PUT /courses/:id` | Cập nhật thông tin khóa học |
| | `DELETE /courses/:id` | Xóa khóa học |
| **Thương mại** | `GET /commerce/wallet` | Xem số dư ví học tập thực tế |
| | `GET /commerce/wallet/ledger` | Xem lịch sử sổ cái biến động số dư |
| | `POST /commerce/topup` | Nạp tiền ví học tập |
| | `GET /commerce/cart` | Lấy danh sách khóa học trong giỏ |
| | `POST /commerce/cart` | Thêm khóa học vào giỏ |
| | `DELETE /commerce/cart/:id` | Xóa khóa học khỏi giỏ |
| | `POST /commerce/checkout` | Thanh toán đơn hàng trừ số dư ví |
| | `GET /commerce/orders` | Danh sách đơn hàng cá nhân |
| | `GET /commerce/admin/orders` | Quản trị viên đối soát toàn bộ đơn hàng |
| **Học tập** | `GET /learning/my-courses` | Danh sách khóa học đã thanh toán sở hữu |
| | `PUT /learning/courses/:cId/lessons/:lId/progress` | Cập nhật tiến độ học và mốc video |
| | `GET /learning/lessons/:id/notes` | Lấy danh sách ghi chú bài học |
| | `POST /learning/lessons/:id/notes` | Tạo ghi chú bài học mới |
| **Tính năng Hub** | `POST /course-finder/recommendations` | Thuật toán gợi ý khóa học theo điểm số |
| | `GET /trials` / `GET /trials/:id` | Danh sách và chi tiết bài học thử sandbox |
| | `GET /practice/exercises` | Kho bài tập luyện kỹ năng và sửa lỗi code |
| | `GET /community/posts` | Danh sách thảo luận hỏi đáp cộng đồng |
| | `GET /articles` | Danh sách bài viết chuyên môn |

---

## 🔑 Tài Khoản Thử Nghiệm

| Vai Trò | Email / Đăng Nhập | Mật Khẩu | Đặc Quyền |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin@eduviet.vn` hoặc `admin` | `Eduenglish123` | Toàn quyền quản trị khóa học, học viên, đối soát đơn hàng |
| **Giảng Viên (Instructor)** | `giangvien@eduviet.vn` | `Giangvien@123` | Quản lý khóa học được phân công giảng dạy |
| **Học Viên Đã Có Sẵn** | `dev.nguyen@gmail.com` | `Hocvien@123` | Ví sẵn 1.000.000đ, sở hữu khóa học và tiến độ học |
| **Đăng Ký Mới** | _(Bất kỳ Gmail nào)_ | _(Tối thiểu 8 ký tự)_ | Tặng ngay **1.000.000 đ** vào ví học tập khi kích hoạt |
| **Google Sign-In** | Chọn tài khoản qua Google Modal | Một chạm | Đăng nhập/Đăng ký tức thì, tự động đồng bộ ví |

---

## 👥 Nhóm Thực Hiện
- **Dự án**: Nền tảng học lập trình trực tuyến EduViet LMS
- **Đơn vị**: Nhóm 6 - Lớp N01-26
- **Công nghệ**: React 19, Vite, Bootstrap 5, NestJS 12, TypeORM, MySQL 8, Web Worker Sandbox
