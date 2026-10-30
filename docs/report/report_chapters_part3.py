# -*- coding: utf-8 -*-
"""
Nội dung chi tiết Báo cáo Đồ án EduViet LMS - Chương 3: Hiện thực hóa & Xây dựng hệ thống
"""

from make_report import style_heading, add_body_p, add_callout, add_styled_table, add_code_block
import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_chapter_3(doc, md):
    style_heading(doc.add_paragraph(), 1, "CHƯƠNG 3: HIỆN THỰC HÓA VÀ XÂY DỰNG HỆ THỐNG")

    # 3.1 Kiến trúc hệ thống
    style_heading(doc.add_paragraph(), 2, "3.1 Kiến trúc hệ thống Clean Architecture và môi trường công nghệ thực tế")
    add_body_p(doc, "Hệ thống EduViet LMS được xây dựng dựa trên ngăn xếp công nghệ tiên tiến nhất hiện nay:")
    add_body_p(doc, "- Nền tảng Backend: NestJS v12 kết hợp TypeScript, tuân thủ nghiêm ngặt nguyên lý Dependency Injection (DI) và kiến trúc Clean Architecture phân tầng: Controllers (tiếp nhận HTTP Request, routing, validate DTO) -> Services (xử lý logic nghiệp vụ, giao dịch, bảo mật) -> Repositories (tương tác CSDL qua TypeORM).")
    add_body_p(doc, "- Nền tảng Frontend: React 19 kết hợp Vite, React Bootstrap và Bootstrap Icons, áp dụng mô hình Single Page Application (SPA) tối ưu tốc độ render, quản lý state qua React Hooks và tích hợp Web Worker Sandbox.")
    add_body_p(doc, "- Hệ quản trị CSDL: MySQL 8.0 với engine InnoDB hỗ trợ khóa dòng (Row-level locking) và giao dịch ACID, kết nối qua TypeORM DataSource với cơ chế fallback in-memory an toàn phục vụ môi trường kiểm thử.")

    # 3.2 Bảo mật & Định danh
    style_heading(doc.add_paragraph(), 2, "3.2 Cơ chế xác thực, quản lý phiên và bảo mật đa lớp (Security Architecture)")
    add_body_p(doc, "Bảo mật là ưu tiên hàng đầu trong thiết kế của EduViet, được tổ chức thành 4 lớp phòng thủ độc lập:")
    add_body_p(doc, "1. Lớp xác thực phiên (Authentication Layer): Sử dụng JSON Web Token (JWT) theo thuật toán mã hóa đối xứng HMAC-SHA256. Khóa bí mật JWT_SECRET được quản lý chặt chẽ qua file biến môi trường lms/.env và được kiểm tra độ dài tối thiểu 16 ký tự ngay khi khởi tạo.")
    add_body_p(doc, "2. Lớp kiểm soát truy cập dựa trên vai trò (Role-Based Access Control - RBAC): Sử dụng cặp đôi JwtAuthGuard và RolesGuard kết hợp Custom Decorator @Roles('Admin', 'Instructor'). Khi có request, Guard không chỉ giải mã token mà còn truy vấn trực tiếp vào CSDL để làm mới danh sách vai trò thực tế và kiểm tra cờ is_active. Nếu tài khoản vừa bị Admin khóa, phiên làm việc sẽ bị thu hồi ngay lập tức với mã lỗi HTTP 401 Unauthorized (giải quyết triệt để lỗi FIX02).")
    add_body_p(doc, "3. Lớp kiểm tra quyền sở hữu tài nguyên (Resource Ownership Guard): Giảng viên chỉ có quyền sửa, xóa khóa học do chính mình tạo ra (assertCanModify: user.sub === course.instructor_id). Quản trị viên Admin là vai trò duy nhất có quyền quản trị tối cao trên toàn bộ khóa học.")
    add_body_p(doc, "4. Lớp kiểm soát dữ liệu đầu vào (DTO Allowlist & Validation): Sử dụng class-validator và class-transformer với các Decorator kiểm tra kiểu dữ liệu nghiêm ngặt (@IsNotEmpty, @IsEmail, @Min, @IsEnum), tự động loại bỏ các trường không khai báo để chống tấn công Over-posting / Mass Assignment.")

    add_code_block(doc,
"""// Cơ chế kiểm tra trạng thái khóa tài khoản và nạp vai trò mới nhất trong JwtAuthGuard
if (userEntity.is_active === false) {
  throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi quản trị viên');
}
const activeRoles = userEntity.roles?.map(r => r.role_name) || [];
req.user.roles = activeRoles;
return true;""", caption="Lớp phòng thủ kiểm tra trạng thái tài khoản thời gian thực trong Guard")

    # 3.3 Thiết kế RESTful API
    style_heading(doc.add_paragraph(), 2, "3.3 Thiết kế và tài liệu hóa RESTful API (Hợp đồng OpenAPI 3.0)")
    add_body_p(doc, "Toàn bộ các điểm cuối API của EduViet được thiết kế chuẩn RESTful, sử dụng đúng các động từ HTTP (GET, POST, PUT, PATCH, DELETE) và trả về mã trạng thái HTTP chuẩn xác (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict):")

    headers_api = ["Phương thức HTTP", "Đường dẫn API (Endpoint)", "Vai trò yêu cầu", "Chức năng nghiệp vụ & Mã trạng thái"]
    rows_api = [
      ["POST", "/auth/register", "Công khai", "Đăng ký tài khoản mới; mã hóa mật khẩu; trả về 201 Created hoặc 409 Conflict."],
      ["POST", "/auth/login", "Công khai", "Đăng nhập; cấp JWT Bearer token và thông tin profile; trả về 200 OK hoặc 401."],
      ["GET", "/auth/me", "Đăng nhập", "Lấy thông tin tài khoản hiện tại từ token; trả về 200 OK."],
      ["POST", "/auth/forgot-password", "Công khai", "Yêu cầu đặt lại mật khẩu; tạo reset_token_hash có hạn 15 phút; trả về 200 OK."],
      ["POST", "/auth/reset-password", "Công khai", "Đặt lại mật khẩu bằng token xác minh; vô hiệu hóa token cũ; trả về 200 OK."],
      ["GET", "/courses", "Công khai", "Tìm kiếm, lọc danh mục/giá/cấp độ, phân trang khóa học Published; trả về 200 OK."],
      ["GET", "/courses/:id", "Công khai", "Xem chi tiết khóa học, đề cương giáo trình; che link bài không preview; 200 OK."],
      ["POST", "/courses", "Instructor/Admin", "Tạo khóa học mới ở trạng thái Draft; gán instructor_id; trả về 201 Created."],
      ["PUT", "/courses/:id", "Instructor/Admin", "Cập nhật khóa học; chỉ chủ sở hữu hoặc Admin mới có quyền; trả về 200 OK."],
      ["PATCH", "/courses/:id/status", "Admin", "Quản trị viên kiểm duyệt công bố hoặc từ chối khóa học; trả về 200 OK."],
      ["POST", "/courses/:id/modules", "Instructor/Admin", "Thêm chương học mới vào khóa học; trả về 201 Created."],
      ["POST", "/courses/:id/modules/:modId/lessons", "Instructor/Admin", "Thêm bài học mới (Video, Quiz, Coding); trả về 201 Created."],
      ["PUT", "/courses/:id/curriculum/reorder", "Instructor/Admin", "Sắp xếp lại thứ tự chương và bài học theo order_index; 200 OK."],
      ["GET", "/commerce/cart", "Student", "Lấy danh sách các khóa học trong giỏ hàng lưu server; trả về 200 OK."],
      ["POST", "/commerce/cart", "Student", "Thêm khóa học vào giỏ; chặn khóa đã có hoặc đã mua; trả về 201 Created."],
      ["POST", "/commerce/quote", "Student", "Tính báo giá server-side và kiểm tra voucher giảm giá; trả về 200 OK."],
      ["POST", "/commerce/topup", "Student", "Tạo yêu cầu nạp tiền vào ví điện tử ở trạng thái PENDING; 201 Created."],
      ["POST", "/commerce/checkout", "Student", "Thanh toán đơn hàng bằng số dư ví; cấp Enrollment tức thì; 200 OK."],
      ["POST", "/commerce/refunds", "Student", "Yêu cầu hoàn tiền đơn hàng đã thanh toán; trả về 201 Created."],
      ["POST", "/commerce/admin/topups/:id/confirm", "Admin", "Quản trị viên duyệt nạp tiền: cộng số dư và ghi sổ cái DEPOSIT; 200 OK."],
      ["POST", "/commerce/admin/refunds/:id/review", "Admin", "Quản trị viên duyệt hoàn tiền: hoàn tiền vào ví, thu hồi quyền học; 200 OK."],
      ["GET", "/learning/my-courses", "Student", "Lấy danh sách các khóa học đã được kích hoạt quyền học của học viên; 200 OK."],
      ["GET", "/learning/courses/:cId/lessons/:lId", "Student", "Vào phòng học: kiểm tra quyền Enrollment/Preview, nạp tiến độ; 200 OK."],
      ["PUT", "/learning/courses/:cId/lessons/:lId/progress", "Student", "Cập nhật tiến độ xem qua thuật toán Interval Union; tính % hoàn thành; 200 OK."],
      ["POST", "/learning/lessons/:lId/quiz/submit", "Student", "Nộp bài trắc nghiệm; server chấm điểm chuẩn 0-100; đánh giá pass/fail; 200 OK."]
    ]
    add_styled_table(doc, headers_api, rows_api, [1.0, 2.5, 1.3, 2.4])

    # 3.4 Quản trị CSDL TypeORM
    style_heading(doc.add_paragraph(), 2, "3.4 Tương tác cơ sở dữ liệu qua TypeORM, quản lý giao dịch và tối ưu truy vấn")
    add_body_p(doc, "Để đảm bảo tính nhất quán tài chính và chống thất thoát dữ liệu, quy trình Checkout thanh toán trong CommerceService được bọc trong một chu trình giao dịch toàn vẹn:")
    add_body_p(doc, "1. Đọc và khóa trạng thái ví điện tử của học viên.")
    add_body_p(doc, "2. Kiểm tra số dư hiện tại (balance_before). Nếu balance_before < final_amount, ném lỗi BadRequestException và hủy bỏ giao dịch.")
    add_body_p(doc, "3. Khấu trừ số dư ví: balance_after = balance_before - final_amount, lưu lại bản ghi Wallet.")
    add_body_p(doc, "4. Ghi một bản ghi mới vào sổ cái WalletLedger với type = PURCHASE, lưu đầy đủ balance_before và balance_after làm bằng chứng đối soát tài chính.")
    add_body_p(doc, "5. Nếu có mã ưu đãi, tăng số lần sử dụng used_count của Voucher.")
    add_body_p(doc, "6. Tạo bản ghi Order với status = PAID, tạo các bản ghi con OrderItem snapshot giá tại thời điểm mua.")
    add_body_p(doc, "7. Cấp quyền học tập bằng cách tạo các bản ghi Enrollment với status = ACTIVE.")
    add_body_p(doc, "8. Làm sạch giỏ hàng (CartItem) của học viên.")

    # 3.5 Frontend React 19
    style_heading(doc.add_paragraph(), 2, "3.5 Hiện thực hóa giao diện người dùng React 19, phòng học trực tuyến và tua bài")
    add_body_p(doc, "Giao diện phòng học (CourseLearningRoom.jsx) được tối ưu hóa cho trải nghiệm học tập tập trung:")
    add_body_p(doc, "- Trình phát video chuyên nghiệp: Hỗ trợ linh hoạt cả video MP4 stream trực tiếp và video YouTube nhúng qua IFrame API. Khi học viên chọn bài, hệ thống đồng bộ vị trí con trỏ phát về đúng mốc start_seconds của bài giảng.")
    add_body_p(doc, "- Bộ đo tiến độ Heartbeat: Cứ mỗi 5 giây khi video đang phát, client gửi một gói tin heartbeat chứa đoạn thời gian vừa xem [start, end] lên server. Server thực hiện thuật toán Interval Union để hợp nhất với các khoảng thời gian trước đó. Người học tua nhanh hoặc nhảy cóc về cuối video sẽ không thể gian lận tỷ lệ hoàn thành bài học.")
    add_body_p(doc, "- Hệ thống ghi chú đa phương tiện (Timestamped Notes): Học viên có thể ghi chú ngay trong lúc nghe giảng. Mỗi ghi chú gắn chặt với mốc giây của video, khi nhấp vào ghi chú, trình phát sẽ tự động seek đến đúng thời điểm giảng viên giảng giải kiến thức đó.")

    # 3.6 Các phân hệ mở rộng
    style_heading(doc.add_paragraph(), 2, "3.6 Các phân hệ mở rộng thực tế: Code Arena Sandbox, Quiz Engine và Đối soát tài chính")
    add_body_p(doc, "1. Đấu trường lập trình Code Arena trên nền tảng Web Worker Sandbox (US18):", bold_prefix="• ")
    add_body_p(doc, "Để giải quyết triệt để rủi ro bảo mật và treo trình duyệt khi học viên thực hành thuật toán, EduViet xây dựng cơ chế thực thi mã nguồn hoàn toàn cô lập thông qua Web Worker. Mã nguồn người học viết được đóng gói và gửi sang một luồng Worker riêng biệt (Worker Thread) thông qua Blob URL.")
    add_body_p(doc, "Đặc tính an toàn vượt trội của giải pháp này: Worker không có quyền truy cập đối tượng window, document, localStorage hay sessionStorage, triệt tiêu hoàn toàn nguy cơ đánh cắp token phiên. Đồng thời, một bộ đếm thời gian an toàn (Watchdog Timer) giới hạn thời gian chạy tối đa 2000ms. Nếu học viên viết phải vòng lặp vô hạn (như while(true) {}), luồng Worker sẽ bị hàm worker.terminate() ngắt ngay lập tức, giải phóng bộ nhớ và giữ cho tab ứng dụng luôn phản hồi mượt mà.")

    add_body_p(doc, "2. Hệ thống chấm điểm trắc nghiệm Quiz khách quan tại server (US19):", bold_prefix="• ")
    add_body_p(doc, "Khi học viên mở bài trắc nghiệm, API chỉ trả về nội dung câu hỏi và danh sách các phương án lựa chọn, ẩn hoàn toàn đáp án đúng correct_answer_index và lời giải thích explanation (chống F12 xem trộm đáp án). Khi nộp bài, server tính điểm dựa trên trọng số điểm số của từng câu hỏi và quy đổi chuẩn xác về thang điểm 100. Điểm số từ 80 trở lên được công nhận Đạt (Pass).")

    add_body_p(doc, "3. Hệ thống đối soát nạp ví và hoàn tiền minh bạch (US10, US12, US33):", bold_prefix="• ")
    add_body_p(doc, "EduViet tuyệt đối không cung cấp bất kỳ nút bấm nào phía client cho phép tự ý cộng số dư ví. Tiền chỉ được nạp thông qua quy trình tạo yêu cầu PENDING và được Quản trị viên đối soát phê duyệt. Khi có khiếu nại hoàn tiền, nếu Admin duyệt chấp thuận, hệ thống tự động hoàn tiền vào ví, ghi sổ cái REFUND và thu hồi quyền học một cách đồng bộ.")

    doc.add_page_break()

# End of Chapter 3
