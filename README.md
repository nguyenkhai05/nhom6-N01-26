CẤU TRÚC THƯ MỤC DỰ ÁN
tkwnc/
├── .devcontainer/         # Cấu hình môi trường phát triển ảo bằng Docker Dev Container
│   └── devcontainer.json
├── config/                # Cấu hình kết nối và cơ sở dữ liệu
│   └── dbconnection.js
├── controllers/           # Tầng xử lý logic nghiệp vụ
│   └── courseController.js
├── models/                # Tầng tương tác và truy vấn CSDL MySQL
│   └── courseModel.js
├── routes/                # Tầng định tuyến các Endpoints/API
│   └── courseRoutes.js
├── .env                   # Chứa thông tin cấu hình và biến môi trường (Bảo mật - không commit)
├── .env.example           # File mẫu danh sách các biến môi trường
├── .gitignore             # Khai báo các file/thư mục không đưa lên Git
├── lms_db.sql             # Script SQL tạo cơ sở dữ liệu và bảng mẫu MySQL
├── package.json           # Quản lý thư viện phụ thuộc (dependencies) và kịch bản chạy
├── server.js              # File khởi chạy chính của ứng dụng Express Server
└── README.md              # Tài liệu hướng dẫn sử dụng dự án
Hướng dẫn Cài đặt & Khởi chạy
cài đặt các công cụ sau:
Node.js (Phiên bản LTS) & npm
Git
Docker Desktop 
VS Code kèm extension Dev Containers
XAMPP / MySQL Server