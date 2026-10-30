# TỔNG HỢP TOÀN DIỆN THAY ĐỔI VÀ TÍNH NĂNG MỚI NỀN TẢNG EDUVIET

> **Ngày cập nhật:** 30/10/2026  
> **Dự án:** Nền tảng học lập trình thực chiến EduViet (nhom6-N01-26)  
> **Repository GitHub:** [https://github.com/nguyenkhai05/nhom6-N01-26.git](https://github.com/nguyenkhai05/nhom6-N01-26.git)  
> **Nhánh:** `main`  
> **Môi trường hoạt động:** Frontend (`http://localhost:5173`), Backend API (`http://localhost:3000`)

---

## 1. Mục Tiêu Tái Cấu Trúc & Định Hướng Mới

Dựa trên yêu cầu từ tài liệu đặc tả tham khảo Codecademy (`THIET_KE_LAI_EDUVIET_THAM_KHAO_CODECADEMY.md`) và các phản hồi trực tiếp từ người dùng, hệ thống EduViet được định vị là:
* **Nền tảng bán khóa học lập trình thực chiến** giữ vững bản sắc nhận diện thương hiệu Booking.com (viền vàng `#ffb700`, màu chủ đạo xanh navy `#003b95`).
* **Trải nghiệm học tập & thực hành hiện đại theo tiêu chuẩn Codecademy:** Giúp học viên *"Chọn đúng khóa trước khi mua — Học thử trải nghiệm trước khi trả tiền — Luyện tập & Sửa lỗi thực tế sau khi sở hữu"*.
* **Xác thực linh hoạt, bảo mật:** Đăng nhập/Đăng ký nhanh bằng tài khoản Google bất kỳ, không phụ thuộc vào các hộp thoại native trình duyệt.

---

## 2. Kiến Trúc Điều Hướng (Navigation Architecture)

### 2.1. Thanh Điều Hướng Chính (Header)
Menu chính trên toàn hệ thống đã được đồng bộ với 6 cột trụ rõ ràng:

1. **Khóa học (`/courses`):** Danh mục toàn bộ khóa học lập trình Frontend, Backend, AI & Data Science kèm bộ lọc chủ đề và giảng viên.
2. **Học thử (`/try`):** Trải nghiệm bài học thực tế trong môi trường tương tác Sandbox 3 vùng.
3. **Luyện tập (`/practice`):** Kho bài tập lập trình, chế độ Sửa lỗi code (Bug Fixing), đánh giá kỹ năng chuẩn hóa và đề phỏng vấn.
4. **Chọn khóa phù hợp (`/find-course`):** Khảo sát 4 câu hỏi minh bạch và so sánh tối đa 3 khóa học song song.
5. **Cộng đồng & Bài viết (`/community`):** Không gian hỏi đáp kỹ thuật, thảo luận bài học và các bài viết chia sẻ kinh nghiệm công nghệ.
6. **Hỗ trợ (`/help`):** Trung tâm trợ giúp FAQ và biểu mẫu gửi ticket yêu cầu kỹ thuật/tư vấn.

### 2.2. Tiện Ích Học Viên Đã Đăng Nhập
* **Nút "Học tiếp" màu xanh lá nổi bật:** Nằm ngay cạnh giỏ hàng ở thanh tiêu đề, bấm vào sẽ dẫn trực tiếp vào bài học đang dở trong **Góc học tập của tôi** (`/my-learning`).
* **Menu người dùng:** Xem số dư ví, thông tin cá nhân, lịch sử đơn hàng, nạp tiền và đổi mật khẩu.

### 2.3. Bố Cục Trang Chủ (Homepage)
* **5 Thẻ Truy Cập Nhanh:** Được bố trí dưới dạng lưới co giãn linh hoạt (`row-cols-2 row-cols-md-3 row-cols-lg-5`):
  * *Khám Phá Khóa Học* (`courses`)
  * *Học Thử Tương Tác* (`try`)
  * *Luyện Tập & Sửa Lỗi* (`practice`)
  * *Chọn Khóa Phù Hợp* (`find-course`)
  * *Hỏi Đáp Cộng Đồng* (`community`)
* **Chuyển hướng đường dẫn cũ:** Các route cũ như `/roadmap` hay `/docs` được hiển thị biểu ngữ điều hướng lịch sự dẫn người dùng sang `/find-course` và `/help`.

---

## 3. Chi Tiết Các Phân Hệ Chức Năng Mới

### 3.1. Phân Hệ A: Bộ Chọn Khóa Phù Hợp & So Sánh Khóa Học (`/find-course`)
* **Khảo sát 4 câu hỏi xác định nhu cầu:**
  1. *Mục tiêu học tập:* Frontend (React/Next.js), Backend (NestJS/Node/MySQL), AI & Khoa học dữ liệu (Python), hoặc Làm quen lập trình cơ bản.
  2. *Nền tảng kiến thức hiện tại:* Mới bắt đầu, đã biết HTML/CSS, đã có nền tảng JavaScript/Logic.
  3. *Ngân sách dự kiến:* Dưới 1 triệu, từ 1 – 2 triệu, trên 2 triệu hoặc chưa xác định.
  4. *Quỹ thời gian dành cho việc học hàng tuần:* Dưới 5h, 5-10h, hoặc trên 10h/tuần.
* **Quy tắc gợi ý minh bạch:**
  * Chạy trên catalog thật đã xuất bản (published); không dùng thuật toán đen hay ép bán khóa đắt tiền.
  * Chỉ rõ **Lý do phù hợp** và **Cảnh báo kiến thức tiền đề (Prerequisites)** còn thiếu để học viên cân nhắc.
* **Thanh & Bảng So Sánh Tối Đa 3 Khóa Học (`GET /courses/compare?ids=1,2,3`):**
  * Ghim nổi ở cuối màn hình khi học viên chọn các khóa cần so sánh.
  * So sánh đối chiếu trực quan các tiêu chí: Học phí hiện tại, Trình độ (Beginner/Intermediate/Advanced), Thời lượng video, Yêu cầu tiên quyết, Kỹ năng đầu ra, Ngôn ngữ thực hành, và Giảng viên phụ trách.

### 3.2. Phân Hệ B: Học Thử Tương Tác Sandbox 3 Vùng (`/try`)
* **Bố cục 3 vùng chuẩn Codecademy:**
  * **Vùng 1 (Bên trái):** Hướng dẫn lý thuyết ngắn gọn, mục tiêu cần đạt và các gợi ý bước (Step Hints) có thể mở dần.
  * **Vùng 2 (Ở giữa):** Trình soạn thảo mã nguồn tích hợp sẵn mã khởi đầu (Starter Code) và nút khôi phục mã gốc.
  * **Vùng 3 (Bên phải):** Kết quả thực thi thực tế (Console Output) cùng danh sách Test Cases kiểm thử tự động.
* **Thực thi mã an toàn (Sandbox Security):**
  * Mã nguồn JavaScript của học viên được thực thi hoàn toàn trong **Web Worker** cô lập.
  * Tích hợp bộ đếm giờ **Watchdog 2.000ms** tự động ngắt nếu phát hiện vòng lặp vô tận (`while(true)`), ngăn chặn việc treo trình duyệt.
  * Không cho phép truy cập biến toàn cục, LocalStorage, Cookie hay Session của ứng dụng.
* **Modal hoàn thành:** Khi vượt qua các bài kiểm thử, hệ thống hiển thị modal chúc mừng kèm nút xem chi tiết khóa học đầy đủ để tiến hành đăng ký.

### 3.3. Phân Hệ C: Luyện Tập Đa Năng & Sửa Lỗi Code (`/practice`)
* **Chế độ Sửa Lỗi Code (Bug Fixing):**
  * Cung cấp các đoạn code có lỗi thực tế thường gặp trong dự án doanh nghiệp:
    * *Lỗi bất đồng bộ:* `async/await` bên trong vòng lặp `forEach` làm trả về mảng rỗng trước khi nạp dữ liệu xong.
    * *Lỗi đột biến State (Mutation Bug):* Thay đổi trực tiếp thuộc tính lồng nhau làm hỏng cơ chế re-render của React.
  * Học viên phân tích, sửa code và bấm *Chạy Thử Nghiệm* để kiểm tra với các test case tự động.
* **Kho bài luyện kỹ năng:** Luyện viết thuật toán, xử lý chuỗi (Two Pointers), Custom Hooks React 19 (`useDebounce`), truy vấn SQL.
* **Đề kiểm tra năng lực & Phỏng vấn:** Bộ câu hỏi trắc nghiệm chuyên sâu có tính thời gian, chấm điểm tự động và giải thích chi tiết từng câu hỏi.
* **Radar ôn tập điểm yếu:** Tổng hợp các kỹ năng còn yếu dựa trên lịch sử làm bài để gợi ý bài luyện tương ứng.

### 3.4. Phân Hệ D: Trung Tâm Hỗ Trợ Học Viên (`/help`)
* **Hệ thống FAQ dạng Accordion:** Phân loại theo 3 nhóm vấn đề cốt lõi:
  * *Học phí, Giỏ hàng & Thanh toán qua Ví:* Cách nạp ví, chính sách hoàn tiền 7 ngày.
  * *Chính sách Học thử & Khóa học:* Quyền truy cập bài học thử, thời hạn sở hữu trọn đời.
  * *Môi trường Code Sandbox & Luyện tập:* Cách sửa lỗi, trình biên dịch mã an toàn.
* **Gửi Ticket Hỗ Trợ (`POST /help/requests`):**
  * Form tiếp nhận thắc mắc kỹ thuật hoặc tư vấn trước khi mua (`PRE_SALE`).
  * Tự động sinh mã tra cứu ticket chuẩn hóa dạng `TCK-xxxxxx` để học viên theo dõi tiến độ xử lý.

### 3.5. Phân Hệ E: Góc Học Tập Của Tôi (`/my-learning`)
* **Card "Học Tiếp" nổi bật:** Hiển thị khóa học đang học gần nhất, phần trăm hoàn thành (%) cùng nút bấm vào thẳng phòng học (`learning-room`).
* **Tổng quan học tập:** Thống kê số lượng khóa học đã kích hoạt, danh mục các bài học cần ôn lại và lối tắt nạp tiền vào ví.

---

## 4. Hệ Thống Thông Báo Ưu Đãi Giảm Giá Combo Khóa Học

Nhằm đáp ứng yêu cầu vừa có thông báo ở đầu trang vừa có pop-up nổi bật:
* **Thanh Thông Báo Ở Đầu Trang (Top Announcement Bar):**
  * Thiết kế theo phong cách Booking.com với nền xanh navy sang trọng và huy hiệu vàng `#ffb700` *"THÔNG BÁO ƯU ĐÃI"*.
  * Thông báo mức tiết kiệm lên tới **22%** khi mua combo, kèm nút *"Xem Chi Tiết Giảm Giá"* và nút *"Ẩn 4 tiếng"*.
* **Modal Pop-Up Ở Giữa Màn Hình:**
  * Tự động bật lên sau khi vào trang chủ (giống phong cách Modal đăng nhập).
  * Hiển thị danh sách các gói combo, tính năng **Smart Quote** báo giá động trực tiếp từ máy chủ NestJS và nút thanh toán trực tiếp qua ví.
  * Checkbox tùy chọn *"Không hiển thị lại thông báo này trong 4 tiếng"*.
* **Lưu trạng thái & Nút ghim mở lại:**
  * Lưu trạng thái ẩn 4 tiếng vào bộ nhớ trình duyệt (`eduviet_combo_notice_snooze_v2`).
  * Luôn có nút ghim nổi *"Ưu Đãi Combo (-22%)"* ở góc dưới bên trái màn hình để học viên có thể bấm mở lại bất kỳ lúc nào.

---

## 5. Nâng Cấp Hệ Thống Xác Thực Google OAuth

* **Hộp thoại chọn tài khoản Google (Google Account Chooser):**
  * Tái hiện giao diện xác thực chính thức của Google với logo đa sắc, áp dụng cho cả luồng **Đăng nhập** và **Đăng ký**.
  * **Danh sách tài khoản sẵn có:**
    * `student.google@phenikaa-uni.edu.vn` (Tài khoản học viên mẫu Phenikaa).
    * `nuicuti15@gmail.com` (Tài khoản quản trị/học viên thực tế).
    * Bất kỳ email nào học viên vừa nhập trong form.
  * **Tùy chọn "Sử dụng một tài khoản Google khác...":**
    * Cho phép học viên tự nhập bất kỳ địa chỉ Gmail cá nhân nào (`@gmail.com`) cùng họ tên tùy chọn.
    * Bấm *Tiếp theo* để đăng nhập hoặc đăng ký ngay lập tức.
  * **Quà tặng đăng ký mới:** Đăng ký bằng Google được kích hoạt tài khoản ngay và **tặng 1.000.000đ** vào ví học tập kèm bảng chúc mừng chính thức.
  * **Hỗ trợ kết nối Google Cloud Console trực tiếp:** Cung cấp ô nhập Client ID để chuyển hướng trực tiếp sang trang xác thực của `accounts.google.com` nếu dự án có thông số OAuth Production.
* **Xử lý dứt điểm các lỗi runtime:**
  * Thay thế hoàn toàn lệnh `window.prompt()` native (vốn bị trình duyệt hiện đại chặn gây lỗi `prompt() is not supported`).
  * Sửa lỗi tham chiếu `loginForm is not defined` về đúng biến trạng thái `loginEmail`.
  * Sửa lỗi TDZ `ReferenceError: Cannot access 'checkIsSnoozed' before initialization`.

---

## 6. Tổng Hợp File & Cấu Trúc Mã Nguồn Thay Đổi

```
nhom6-N01-26-main/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx               # Bổ sung Google Account Chooser & Đăng ký Google
│   │   │   ├── CourseFinderPage.jsx        # [MỚI] Bộ chọn khóa 4 câu & so sánh 3 khóa
│   │   │   ├── InteractiveTrialPage.jsx    # [MỚI] Học thử Sandbox 3 vùng Codecademy
│   │   │   ├── PracticeHub.jsx             # Nâng cấp chế độ Sửa lỗi code (Bug Fixing)
│   │   │   ├── CommunityHub.jsx            # Hub tích hợp Cộng đồng thảo luận & Bài viết
│   │   │   ├── HelpCenterPage.jsx          # [MỚI] Trung tâm hỗ trợ FAQ & gửi ticket
│   │   │   ├── MyLearningDashboard.jsx     # [MỚI] Dashboard Góc học tập của tôi
│   │   │   └── home/
│   │   │       └── ComboNoticeBanner.jsx   # Thanh thông báo đầu trang + Pop-up modal ưu đãi
│   │   ├── services/
│   │   │   └── hubApi.js                   # API client: compare, finder, trials, help
│   │   ├── App.jsx                         # Định tuyến 6 cột trụ & 5 thẻ truy cập nhanh
│   │   ├── Header.jsx                      # Menu chuẩn hóa kèm nút "Học tiếp"
│   │   └── Footer.jsx                      # Liên kết chân trang cập nhật
│   └── vite.config.js                      # Proxy API /course-finder, /trials, /help
│
└── lms/ (Backend NestJS)
    ├── src/
    │   ├── app.module.ts                   # Đăng ký CourseFinder, Trial, Help modules
    │   ├── course/                         # Endpoint GET /courses/compare?ids=1,2,3
    │   ├── course-finder/                  # [MỚI] Module khảo sát & gợi ý khóa học
    │   ├── trial/                          # [MỚI] Module bài học thử & test runner
    │   ├── practice/                       # Bổ sung bài tập dạng BUG_FIXING
    │   ├── help/                           # [MỚI] Module FAQ & Ticket hỗ trợ
    │   └── auth/                           # Xử lý đăng nhập / đăng ký Google OAuth
    └── test/unit/
        └── codecademy-features.service.spec.ts # [MỚI] 12 unit tests kiểm thử tính năng mới
```

---

## 7. Kết Quả Kiểm Thử & Lịch Sử Commit Git

### 7.1. Kết Quả Kiểm Thử
* **Unit Tests Backend:** **109 / 109 tests passed (100%)** qua 10 test suites Vitest.
* **Frontend Build:** `vite build` biên dịch thành công, **0 lỗi cú pháp / TypeScript**.
* **Trạng thái máy chủ:** Cả 2 tiến trình daemon Backend (port `3000`) và Frontend (port `5173`) đang hoạt động ổn định với mã HTTP `200 OK`.

### 7.2. Lịch Sử Commit Đã Đẩy Lên Nhánh `main`
| Mã Commit | Thông Điệp Commit (Commit Message) |
| :--- | :--- |
| `6edf9fa` | `feat(codecademy): implement 5-pillar navigation, Course Finder, interactive trials, bug fixing, and My Learning dashboard` |
| `03e1cec` | `feat(ui): restore Community tab on nav & quick cards, and ensure Combo discount banner & pop-up modal are fully active` |
| `338f9cc` | `fix(notice): declare checkIsSnoozed before useState call to prevent ReferenceError` |
| `759511b` | `fix(auth): remove window.prompt from Google login and gracefully fallback in CommunityHub` |
| `4af82fe` | `feat(auth): fix loginEmail reference and add 1-click Google registration with 1.000.000đ bonus` |
| `5b19616` | `feat(auth): implement Google Account Chooser popup with Use Another Account option and live accounts.google.com OAuth redirect` |
