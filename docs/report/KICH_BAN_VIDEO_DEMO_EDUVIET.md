# KỊCH BẢN VIDEO DEMO HỆ THỐNG EDUVIET (< 8 PHÚT)

**Dự án:** Nền tảng Học trực tuyến EduViet LMS  
**Học phần:** Thiết kế Web Nâng cao — Trường Đại học Phenikaa  
**Giảng viên hướng dẫn:** TS. Nguyễn Lệ Thu  
**Nhóm sinh viên thực hiện (Nhóm 6):**
1. Phù Ngọc Hào — MSSV: 23010384
2. Nguyễn Quốc Khải — MSSV: 23010403 (Trưởng nhóm)
3. Nguyễn Hoàng Sơn — MSSV: 23010878  

**Thời lượng tổng cộng:** 07 phút 45 giây (Đáp ứng yêu cầu khắt khe: dưới 8 phút).  
**Độ phân giải video:** Full HD (1920x1080) @ 60fps, âm thanh stereo rõ ràng, có phụ đề tiếng Việt.

---

## BẢNG PHÂN BỔ MỐC THỜI GIAN VÀ NỘI DUNG CHI TIẾT

| Mốc thời gian | Phân cảnh / Màn hình | Thao tác kỹ thuật & Demo trực quan | Người thuyết minh | Lời thoại kịch bản (Voice-over) |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 – 00:30** (30s) | **Màn hình giới thiệu & Kiến trúc tổng thể** | - Hiện slide thông tin nhóm 6, môn học, giảng viên TS. Nguyễn Lệ Thu.<br>- Sơ đồ kiến trúc 3 tầng: React 19 Frontend + NestJS Backend + MySQL Database. | **Nguyễn Quốc Khải** | "Kính chào cô Nguyễn Lệ Thu và các bạn. Em là Nguyễn Quốc Khải, đại diện Nhóm 6 gồm ba thành viên: Phù Ngọc Hào, Nguyễn Quốc Khải và Nguyễn Hoàng Sơn. Hôm nay nhóm em xin trình diễn toàn bộ chức năng thực tế của hệ thống EduViet — nền tảng học lập trình trực tuyến được xây dựng theo kiến trúc chuẩn Clean Architecture, bảo mật phân quyền 3 vai trò và tuân thủ chặt chẽ 10 câu hỏi đề cương môn học." |
| **00:30 – 01:15** (45s) | **Trang chủ & Bộ lọc phong cách Booking.com (US05)** | - Quay màn hình Navbar full-width (`container-fluid px-lg-4`).<br>- Focus vào thanh tìm kiếm màu vàng viền 3px `#ffb700`.<br>- Nhập từ khóa 'React', lọc danh mục 'Frontend', chọn mức giá từ 400.000đ đến 900.000đ, sắp xếp 'Giá tăng dần'.<br>- Hiển thị kết quả tìm kiếm mượt mà từ API. | **Phù Ngọc Hào** | "Giao diện EduViet được thiết kế bám sát chuẩn tham chiếu Booking.com với thanh tìm kiếm viền vàng bo tròn đặc trưng. Học viên có thể tìm kiếm đa tiêu chí: theo từ khóa, danh mục chuyên ngành, trình độ và khoảng giá. Bộ lọc được xử lý hoàn toàn tại server backend với validation chặt chẽ, ngăn chặn triệt để trường hợp nhập sai khoảng giá." |
| **01:15 – 02:00** (45s) | **Trang chi tiết & Chính sách học thử (US06)** | - Vào chi tiết khóa học 'React 19 Masterclass'.<br>- Xem mục tiêu, giảng viên, cấu trúc chương học và bài giảng.<br>- Nhấp vào bài học thử `is_preview = true`: video phát mượt mà.<br>- Mở Network tab: chứng minh bài học khóa bị ẩn hoàn toàn URL học liệu đối với người chưa mua. | **Phù Ngọc Hào** | "Tại trang chi tiết, học viên dễ dàng xem toàn bộ đề cương giáo trình. EduViet triển khai chính sách Preview Policy nghiêm ngặt: người dùng vãng lai chỉ xem được các bài học thử miễn phí. Mọi URL học liệu của các bài học tính phí đều được backend che giấu, bảo vệ tối đa tài sản số của giảng viên." |
| **02:00 – 03:00** (60s) | **Giỏ hàng, Báo giá Server, Ví & Thanh toán (US08–US11)** | - Bấm 'Thêm vào giỏ hàng'. Thử thêm lần 2: cảnh báo trùng lặp.<br>- Nhập mã giảm giá `GIAM20`: giảm ngay 20% trên tổng giá trị.<br>- Chuyển sang nạp tiền: tạo yêu cầu nạp ví mô phỏng Sandbox.<br>- Bấm 'Thanh toán bằng ví': số dư trừ tự động, ghi sổ cái WalletLedger và cấp quyền Enrollment ngay lập tức. | **Nguyễn Hoàng Sơn** | "Toàn bộ quy trình thương mại của EduViet đảm bảo tính toàn vẹn dữ liệu: giá tiền và mức giảm giá được tính toán 100% tại server, client không thể can thiệp. Hệ thống tích hợp ví học tập với sổ cái bất biến WalletLedger. Khi thanh toán thành công, đơn hàng chuyển trạng thái PAID và quyền truy cập khóa học được kích hoạt tức thì." |
| **03:00 – 04:30** (90s) | **Phòng học thông minh & Thuật toán Interval Union (US14, US15)** | - Truy cập 'Khóa học của tôi' và bấm 'Học tiếp'.<br>- Trình phát video tự động resume vị trí đã dừng.<br>- Thử nghiệm kiểm tra gian lận: kéo thanh tua thẳng về cuối video -> tiến độ không tăng vượt mức.<br>- Cho phát liên tục qua các đoạn: thuật toán Interval Union hợp nhất các khoảng thời gian xem thực tế, khi đạt $\ge 90\%$ bài học mới được đánh dấu hoàn thành.<br>- Ghi chú tại giây thứ 45: lưu thành công kèm timestamp. | **Nguyễn Quốc Khải** | "Đây là điểm cốt lõi trong trải nghiệm phòng học: EduViet tách biệt vị trí dừng xem và thời gian xem thực tế. Thuật toán Interval Union hợp nhất các đoạn thời gian học viên đã phát, ngăn chặn việc tua vội để gian lận hoàn thành. Chỉ khi thời lượng xem thực chất đạt từ 90% trở lên, bài học mới được chứng nhận hoàn thành." |
| **04:30 – 05:30** (60s) | **Trắc nghiệm Quiz Server & Code Arena Web Worker (US18, US19)** | - Vào bài trắc nghiệm: kiểm tra mã nguồn trang không chứa đáp án.<br>- Chọn đáp án và submit: server chấm điểm chuẩn hóa thang 100 và trả về kết luận đạt/chưa đạt kèm giải thích.<br>- Chuyển sang Code Arena: chạy thử thuật toán Two Sum.<br>- Thử nghiệm chèn vòng lặp vô hạn `while(true)`: Web Worker sandbox tự động ngắt sau đúng 2000ms timeout, tab trình duyệt hoàn toàn mượt mà không bị treo. | **Nguyễn Quốc Khải** | "EduViet trang bị phòng thực hành lập trình an toàn tuyệt đối: mã nguồn học viên được thực thi trong môi trường Web Worker cô lập hoàn toàn khỏi DOM và storage, cơ chế timeout 2 giây tự động dập tắt mọi vòng lặp vô hạn. Hệ thống trắc nghiệm chấm điểm trực tiếp tại server, bảo đảm tính khách quan." |
| **05:30 – 06:45** (75s) | **Cổng Giảng viên & Quản trị viên Đối soát (US27–US33)** | - Đăng nhập tài khoản Admin (`admin@eduviet.vn`).<br>- Mở Dashboard quản trị: xem thống kê doanh thu, danh sách đơn hàng và sổ cái tài chính.<br>- Duyệt yêu cầu hoàn tiền cho đơn hàng: tiền tự động cộng lại vào ví học viên và quyền học (Enrollment) lập tức bị thu hồi an toàn.<br>- Đăng nhập Giảng viên: biên soạn đề cương, thêm chương và sắp xếp lại thứ tự bài giảng. | **Nguyễn Hoàng Sơn** | "Cổng quản trị cung cấp đầy đủ công cụ đối soát tài chính và kiểm duyệt. Khi Admin phê duyệt yêu cầu hoàn tiền, hệ thống tự động hoàn tiền vào ví, ghi nhận giao dịch REFUND trên sổ cái và thu hồi quyền học một cách nhất quán. Giảng viên sở hữu trình biên soạn đề cương linh hoạt, trực quan." |
| **06:45 – 07:45** (60s) | **Minh chứng kiểm thử, OpenAPI Contract & Tổng kết** | - Mở terminal chạy `npm --prefix lms test`: hiển thị 76/76 unit tests pass 100% trong 2.5 giây.<br>- Mở tài liệu Swagger/OpenAPI 3.0 (`docs/api/openapi.json`).<br>- Trình chiếu bảng đối chiếu 10 câu hỏi rubric và phân công thành viên.<br>- Lời cảm ơn kết thúc video. | **Cả nhóm 6** | "Toàn bộ hệ thống EduViet được bảo vệ bởi 76 bài unit test tự động bao phủ 100% các nghiệp vụ trọng yếu, hợp đồng API chuẩn OpenAPI 3.0 và tài liệu báo cáo học thuật chuyên sâu. Nhóm 6 xin chân thành cảm ơn cô Nguyễn Lệ Thu đã tận tình hướng dẫn chúng em trong suốt học phần Thiết kế Web Nâng cao!" |

---

## DANH SÁCH TÀI KHOẢN VÀ DỮ LIỆU MẪU PHỤC VỤ QUAY VIDEO

1. **Quản trị viên (Admin):**
   - Email: `admin@eduviet.vn`
   - Mật khẩu: `Eduenglish123`
   - Vai trò: Quản trị toàn hệ thống, duyệt khóa học, đối soát nạp tiền và xử lý hoàn tiền.
2. **Giảng viên (Instructor):**
   - Email: `giangvien@eduviet.vn`
   - Mật khẩu: `Giangvien@123`
   - Vai trò: Quản lý khóa học được phân công, biên soạn đề cương giáo trình, thêm video và tài liệu.
3. **Học viên (Student):**
   - Email: `dev.nguyen@gmail.com`
   - Mật khẩu: `Eduviet@2026`
   - Số dư ví khởi tạo: `1.000.000 VNĐ`
   - Vai trò: Tìm kiếm khóa học, mua khóa học, học video, làm quiz và luyện code.
4. **Mã ưu đãi (Voucher):**
   - Mã: `GIAM20` (Giảm 20% cho đơn hàng từ 200.000 VNĐ, tối đa 300.000 VNĐ).
