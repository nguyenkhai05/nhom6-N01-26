# BÁO CÁO ĐỐI SOÁT VÀ ĐÁNH GIÁ HIỆN TRẠNG BASELINE (GAP ANALYSIS)

- **Thời điểm lập:** 30/10/2026
- **Mốc commit kiểm chứng:** `f5732a3ded6c7ab4446cad2234f10c70c4d859e6`
- **Kho lưu trữ:** `https://github.com/nguyenkhai05/nhom6-N01-26.git`
- **Học phần:** Thiết kế web nâng cao — Đại học Phenikaa
- **Nhóm 6:** Phù Ngọc Hào (23010384), Nguyễn Quốc Khải (23010403), Nguyễn Hoàng Sơn (23010878)
- **Giảng viên hướng dẫn:** TS Nguyễn Lệ Thu

---

## 1. MÔI TRƯỜNG THỰC NGHIỆM VÀ ĐỊNH DANH HỆ THỐNG

| Thành phần | Phiên bản / Cấu hình thực tế | Ghi chú |
| :--- | :--- | :--- |
| **Node.js** | v24.22.1 LTS | Môi trường runtime chạy frontend, backend và test suites |
| **Frontend Framework** | React 19.2.8 + Vite 8.3.4 | Khởi chạy tại `127.0.0.1:5173` |
| **Backend Framework** | NestJS 12.0.1 + TypeORM 0.3.20 | Khởi chạy tại `127.0.0.1:3000` |
| **Cơ sở dữ liệu** | MySQL 8.4.13 + In-memory Mock Fallback | Khởi tạo qua schema `lms_db.sql` |
| **Trình kiểm thử** | Vitest 4.1.11 | Chạy 15/15 unit tests hiện hữu đạt 100% |
| **Trình phân tích tĩnh** | Oxlint 1.58.0 / 1.81.0 | 0 lỗi cú pháp / type-aware trên toàn bộ dự án |

---

## 2. BẢNG ĐỐI CHIẾU 13 VẤN ĐỀ NỀN TẢNG (P0: FIX01 – FIX13)

| Mã | Vấn đề được chỉ ra | Hiện trạng mã nguồn tại baseline | Kết luận kiểm chứng |
| :--- | :--- | :--- | :--- |
| **FIX01** | Mua khóa, nạp ví và QR có thể báo thành công chỉ bằng state/localStorage; DB chưa có quyền học tương ứng. | State giỏ hàng và ví còn lưu trên trình duyệt (`App.jsx`), API tạo `orders`/`payments` chưa được nối vào controller riêng. | **CẦN SỬA (Đợt 3):** Server tính giá, ghi đơn/giao dịch/enrollment trong transaction; reload giữ nguyên. |
| **FIX02** | Tài khoản bị khóa vẫn dùng token cũ vào một API quản trị; sửa extras local có thể đổi vai trò trên UI. | `JwtAuthGuard` kiểm tra chữ ký nhưng chưa truy vấn trạng thái `is_active`/`token_version` từ CSDL; frontend map role từ `localStorage`. | **CẦN SỬA (Đợt 1):** Guard đọc trạng thái hiện hành từ server; identity client không ghi đè server. |
| **FIX03** | Ghi chú dùng khóa demo chung do lệch `id`/`userId`; đổi người có thể thấy dữ liệu nhau. | Key localStorage phòng học dùng `currentUser?.id || 'demo'`; chưa đồng bộ qua REST API `/lessons/:id/notes`. | **CẦN SỬA (Đợt 4):** Đồng bộ notes theo User ID máy chủ; chặn xem chéo dữ liệu A/B. |
| **FIX04** | Tua gần cuối có thể tăng hoàn thành; callback video dùng trạng thái cũ; autoplay OFF vẫn chuyển bài ở một tình huống. | Đã có logic tính $\ge 90\%$ thời lượng bài giảng trong `CourseLearningRoom.jsx`, nhưng chưa có bảng `watched_intervals` lưu hợp khoảng phát. | **CẦN SỬA (Đợt 4):** Tách vị trí phát và thời lượng xem hợp lệ; kiểm tra `end_seconds` chính xác. |
| **FIX05** | Đã kiểm tra thực tế chọn bài 2/3 tua đúng mốc YouTube. | Đã tích hợp `window.YT.Player` với `seekTo(start_seconds, true)` và `loadVideoById`. Cần thêm guard chống race condition khi click nhanh. | **DUY TRÌ & HOÀN THIỆN (Đợt 4):** Thêm queue và intentId chống race condition. |
| **FIX06** | Khóa 7/8 rơi về giáo trình React; một sample Nest dùng `process.env` trong browser. | Đã tạo `courseCurriculum.js` có 6 khóa học với start/end seconds và sample code JS ES6 hợp lệ. Cần bổ sung nốt khóa 7 (Golang) và khóa 8 (Next.js 15). | **CẦN SỬA (Đợt 2):** Khóa học nào có giáo trình riêng khóa học đó; runtime JS an toàn. |
| **FIX07** | `new Function` chạy cùng origin; mã học viên đọc được dữ liệu ứng dụng; throw làm hỏng khôi phục console. | Đã có try/catch và khôi phục `console.log` trong finally, nhưng vẫn chạy cùng thread ứng dụng. | **CẦN SỬA (Đợt 4):** Chuyển runner vào Web Worker / Sandbox iframe cô lập hoàn toàn. |
| **FIX08** | Quiz có thể hiện 150/100; bài Arena mẫu bị chấm sai do chuỗi/kỳ vọng sai. | CodeArena đã sửa test cases `[0,1]`, `teiVudE`; component Quiz cần chuẩn hóa thang điểm 100 từ server. | **CẦN SỬA (Đợt 4):** Chấm điểm server, trọng số đúng, điểm 0–100. |
| **FIX09** | CRUD admin, đổi mật khẩu, tải PDF, hỏi mentor có phần chỉ thay state/alert hoặc chưa có handler. | Các route admin courses/categories đã có trên NestJS nhưng frontend một số nút còn gọi `alert()`. | **CẦN SỬA (Đợt 2 & 6):** Nối toàn bộ UI vào API thực; phản hồi lỗi chuẩn. |
| **FIX10** | Phòng học mobile cắt nút Bài tiếp; JSON local hỏng có thể làm trắng trang. | Đã thêm responsive và `overflow-x: clip`, ẩn header/footer bán hàng khi vào phòng học; cần bọc safe JSON parse. | **CẦN SỬA (Đợt 5):** Thêm Error Boundary và safe JSON parse. |
| **FIX11** | Cài backend sạch bị peer conflict mapped-types/Nest; thiếu `.env.example`. | Xung đột giữa `@nestjs/mapped-types@2.1.0` và `@nestjs/common@12.0.1`. Thiếu tệp `.env.example`. | **ĐÃ XỬ LÝ (Đợt 1):** Nâng `@nestjs/mapped-types` lên `^12.0.0`; tạo đầy đủ `.env.example`. `npm install` sạch 100%. |
| **FIX12** | Query tìm khóa bị bỏ qua; parent category sai trả 500; backend có cảnh báo dependency. | CourseController mới hỗ trợ lọc cơ bản; CategoryService cần chặn chu trình parent_id. | **CẦN SỬA (Đợt 2):** Bổ sung DTO query validation cho `/courses` và `/categories`. |
| **FIX13** | Thống kê, chứng chỉ, footer, lời hứa AI/hỗ trợ có dữ liệu hoặc tác dụng mô phỏng. | Các số liệu "340+ đánh giá", "Học viên 220" đang là mock; footer có một số link chưa có trang đích. | **CẦN SỬA (Đợt 6):** Ghi rõ nhãn dữ liệu thực / dữ liệu mô phỏng; hoàn thiện link thật. |

---

## 3. KIỂM KÊ DỮ LIỆU & TÀI SẢN MÃ NGUỒN (DATA INVENTORY)

1. **Entity CSDL hiện có (`lms/src/`):**
   - `User` (`user.entity.ts`): id, email, password_hash, full_name, is_active, created_at, updated_at.
   - `Role` (`role.entity.ts`): role_id, role_name ('Admin', 'Instructor', 'Student').
   - `Category` (`category.entity.ts`): category_id, category_name, parent_id, order_index.
   - `Course` (`course.entity.ts`): course_id, instructor_id, category_id, title, slug, price, level, status.
   - `CourseModule` (`course-module.entity.ts`): module_id, course_id, title, order_index.
   - `Lesson` (`lesson.entity.ts`): lesson_id, module_id, title, content_type, duration_seconds, is_preview, order_index.
   - `Enrollment` (`enrollment.entity.ts`): enrollment_id, student_id, course_id, enrolled_at, progress_percent.
2. **Entity cần bổ sung trong Đợt 1 & Đợt 3:**
   - `AuthSession`: Quản lý refresh token hash, ngày hết hạn, thu hồi phiên theo thiết bị.
   - `Order` & `OrderItem`: Quản lý đơn hàng, mã đơn, tổng tiền, trạng thái `PENDING / PAID / CANCELLED`.
   - `WalletTransaction`: Sổ cái ledger giao dịch bất biến (`DEPOSIT`, `PURCHASE`, `REFUND`).
   - `LessonProgress`: Lưu `watched_intervals`, `resume_position_seconds`, `is_completed`.
   - `Note`: Lưu ghi chú cá nhân kèm `timestamp_seconds`.
3. **Tài nguyên tĩnh & bản quyền:**
   - Đã cập nhật `LICENSE` có đủ thông báo bản quyền của Kamil Mysliwiec (NestJS gốc) và Nhóm 6.
   - Đã tạo `THIRD_PARTY_NOTICES.md` kiểm kê chi tiết toàn bộ thư viện nguồn mở và tài nguyên media.
