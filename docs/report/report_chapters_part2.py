# -*- coding: utf-8 -*-
"""
Nội dung chi tiết Báo cáo Đồ án EduViet LMS - Chương 2: Phân tích nghiệp vụ & Thiết kế kiến trúc
"""

from make_report import style_heading, add_body_p, add_callout, add_styled_table, add_code_block
import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_chapter_2(doc, md):
    style_heading(doc.add_paragraph(), 1, "CHƯƠNG 2: PHÂN TÍCH NGHIỆP VỤ VÀ THIẾT KẾ HỆ THỐNG")

    # 2.1 Mô hình miền nghiệp vụ
    style_heading(doc.add_paragraph(), 2, "2.1 Mô hình miền nghiệp vụ (Domain Model) và Máy trạng thái (State Machines)")
    add_body_p(doc, "Mô hình miền nghiệp vụ của EduViet LMS được xây dựng xoay quanh 4 trụ cột chính: Quản lý Người dùng & Phân quyền (Identity & Access Management), Danh mục khóa học & Đề cương đào tạo (Catalog & Curriculum), Thương mại điện tử & Sổ cái tài chính (Commerce & Ledger), Không gian phòng học số & Đánh giá (Learning & Assessment).")
    
    add_body_p(doc, "Để đảm bảo tính toàn vẹn dữ liệu trong suốt vòng đời của các thực thể nghiệp vụ, hệ thống thiết lập 4 máy trạng thái (Finite State Machines - FSM) nghiêm ngặt:")

    add_body_p(doc, "1. Máy trạng thái Đơn hàng (Order State Machine):", bold_prefix="• ")
    add_body_p(doc, "Đơn hàng khởi tạo ở trạng thái PENDING. Khi học viên thanh toán thành công qua số dư ví điện tử, đơn hàng chuyển ngay sang trạng thái PAID (thanh toán hoàn tất) và kích hoạt tạo bản ghi Enrollment. Nếu người học yêu cầu hoàn tiền và được Admin phê duyệt, đơn hàng chuyển sang trạng thái REFUNDED. Trường hợp đơn hàng bị hủy bỏ trước khi thanh toán, trạng thái sẽ là CANCELLED. Tuyệt đối không cho phép chuyển trạng thái tùy ý từ CANCELLED hay REFUNDED ngược lại thành PAID.")
    
    add_body_p(doc, "2. Máy trạng thái Nạp tiền (Topup Request State Machine):", bold_prefix="• ")
    add_body_p(doc, "Yêu cầu nạp tiền khởi tạo với trạng thái PENDING kèm mã giao dịch đối soát duy nhất (e.g., TOPUP_3_1730261111). Chỉ khi Quản trị viên đối soát khớp bằng chứng chuyển khoản thành công, yêu cầu mới chuyển sang CONFIRMED, kích hoạt cộng tiền ví và ghi sổ cái DEPOSIT một lần duy nhất. Nếu từ chối, yêu cầu chuyển sang REJECTED. Yêu cầu quá hạn 24 giờ chưa thanh toán sẽ tự động chuyển sang EXPIRED.")

    add_body_p(doc, "3. Máy trạng thái Hoàn tiền (Refund Request State Machine):", bold_prefix="• ")
    add_body_p(doc, "Học viên chỉ được tạo yêu cầu hoàn tiền khi đơn hàng đang ở trạng thái PAID. Yêu cầu tạo mới ở trạng thái PENDING. Quản trị viên xem xét lý do và đưa ra quyết định: nếu APPROVED, hệ thống tự động hoàn tiền vào ví, ghi sổ cái REFUND và đổi trạng thái Enrollment sang REFUNDED; nếu REJECTED, đơn hàng vẫn duy trì quyền học bình thường.")

    add_body_p(doc, "4. Máy trạng thái Khóa học (Course State Machine):", bold_prefix="• ")
    add_body_p(doc, "Khóa học do giảng viên tạo mới luôn bắt đầu ở trạng thái DRAFT (Bản nháp), lúc này khóa học hoàn toàn ẩn khỏi catalog công khai. Sau khi hoàn thiện đề cương bài giảng, giảng viên gửi yêu cầu xuất bản. Quản trị viên duyệt và chuyển trạng thái sang PUBLISHED để mở bán. Khi khóa học lỗi thời hoặc ngừng đào tạo, quản trị viên chuyển sang ARCHIVED (Lưu trữ).")

    # 2.2 Use Case & UML Class
    style_heading(doc.add_paragraph(), 2, "2.2 Biểu đồ ca sử dụng (Use Case) và Biểu đồ lớp phân tích (UML Class Diagram)")
    add_body_p(doc, "Hệ thống bao gồm các gói Use Case chính: Gói Xác thực (Auth Package), Gói Khóa học (Course Package), Gói Thương mại (Commerce Package) và Gói Phòng học (Learning Package). Các Actor tương tác trực tiếp với hệ thống gồm Khách (Guest), Học viên (Student), Giảng viên (Instructor) và Quản trị viên (Admin).")
    
    add_body_p(doc, "Dưới đây là mô tả mối quan hệ giữa các lớp phân tích chính trong hệ thống:")
    add_body_p(doc, "- Lớp User: Chứa thông tin tài khoản, mật khẩu băm, trạng thái is_active, liên kết nhiều-nhiều với Role thông qua bảng trung gian user_roles.")
    add_body_p(doc, "- Lớp Course: Chứa thông tin tiêu đề, slug, giá tiền, cấp độ, trạng thái; liên kết n-1 với Category, n-1 với User (Instructor), 1-n với CourseModule và 1-n với Enrollment.")
    add_body_p(doc, "- Lớp CourseModule: Đại diện cho chương học, liên kết 1-n với Lesson.")
    add_body_p(doc, "- Lớp Lesson: Đại diện cho bài giảng số, chứa thuộc tính content_type (Video, Article, Quiz, Document), content_url, duration_seconds và cờ is_preview.")
    add_body_p(doc, "- Lớp Wallet & WalletLedger: Ví điện tử của người dùng liên kết 1-n với sổ cái giao dịch bất biến ghi nhận mọi biến động tài chính.")
    add_body_p(doc, "- Lớp Order & OrderItem: Đơn hàng thanh toán liên kết 1-n với các chi tiết khóa học được mua.")

    # 2.3 ERD & Từ điển dữ liệu
    style_heading(doc.add_paragraph(), 2, "2.3 Mô hình dữ liệu quan hệ (ERD) và Từ điển dữ liệu chi tiết 15 bảng CSDL")
    add_body_p(doc, "Cơ sở dữ liệu của EduViet LMS được thiết kế chuẩn hóa đạt chuẩn dạng chuẩn 3 (3NF - Third Normal Form), loại bỏ hoàn toàn các phụ thuộc bắc cầu và dư thừa dữ liệu. Dưới đây là từ điển dữ liệu đặc tả chi tiết các bảng trọng yếu:")

    headers_dict = ["Tên bảng", "Khóa chính (PK)", "Khóa ngoại (FK)", "Mô tả thực thể & Ràng buộc toàn vẹn"]
    rows_dict = [
      ["users", "user_id (INT AUTO_INCREMENT)", "Không", "Lưu trữ tài khoản người dùng; email UNIQUE; password_hash băm an toàn; reset_token_hash."],
      ["roles", "role_id (INT AUTO_INCREMENT)", "Không", "Danh mục vai trò hệ thống: Admin, Instructor, Student; role_name UNIQUE."],
      ["user_roles", "(user_id, role_id)", "user_id -> users, role_id -> roles", "Bảng kết hợp phân quyền đa vai trò cho người dùng; ràng buộc CASCADE khi xóa."],
      ["categories", "category_id (INT AUTO_INCREMENT)", "parent_id -> categories", "Cây danh mục phân cấp đa tầng; tự tham chiếu parent_id có cơ chế chống chu trình."],
      ["courses", "course_id (INT AUTO_INCREMENT)", "instructor_id -> users, category_id -> categories", "Khóa học trực tuyến; slug UNIQUE; price kiểu DECIMAL(10,2); status ENUM."],
      ["modules", "module_id (INT AUTO_INCREMENT)", "course_id -> courses", "Chương học thuộc khóa học; order_index sắp xếp thứ tự; CASCADE khi xóa khóa học."],
      ["lessons", "lesson_id (INT AUTO_INCREMENT)", "module_id -> modules", "Bài học trong chương; content_type ENUM; is_preview BOOLEAN; duration_seconds INT."],
      ["enrollments", "enrollment_id (INT AUTO_INCREMENT)", "student_id -> users, course_id -> courses", "Ghi nhận quyền sở hữu khóa học của học viên; progress_percent; status ENUM."],
      ["cart_items", "id (INT AUTO_INCREMENT)", "user_id -> users, course_id -> courses", "Giỏ hàng lưu server của học viên; unique cặp (user_id, course_id)."],
      ["vouchers", "voucher_id (INT AUTO_INCREMENT)", "Không", "Mã ưu đãi giảm giá; code UNIQUE; discount_type ENUM; used_count, usage_limit."],
      ["wallets", "wallet_id (INT AUTO_INCREMENT)", "user_id -> users (UNIQUE)", "Ví học tập của người dùng; balance DECIMAL(12,2) không âm; cập nhật qua ledger."],
      ["wallet_ledgers", "ledger_id (INT AUTO_INCREMENT)", "wallet_id -> wallets, user_id -> users", "Sổ cái tài chính bất biến; type ENUM (DEPOSIT, PURCHASE, REFUND); số dư trước/sau."],
      ["topup_requests", "request_id (INT AUTO_INCREMENT)", "user_id -> users", "Yêu cầu nạp ví mô phỏng Sandbox; transaction_ref UNIQUE; status ENUM."],
      ["orders", "order_id (INT AUTO_INCREMENT)", "user_id -> users, voucher_id -> vouchers", "Đơn hàng thanh toán; order_code UNIQUE; total_amount, discount_amount, final_amount."],
      ["order_items", "item_id (INT AUTO_INCREMENT)", "order_id -> orders, course_id -> courses", "Chi tiết các khóa học thuộc đơn hàng; lưu snapshot giá bán tại thời điểm mua."],
      ["refund_requests", "refund_id (INT AUTO_INCREMENT)", "order_id -> orders, user_id -> users", "Yêu cầu hoàn tiền đơn hàng; amount DECIMAL(12,2); status ENUM."],
      ["lesson_progress", "id (INT AUTO_INCREMENT)", "user_id -> users, lesson_id -> lessons", "Lưu vết tiến độ học; resume_position_seconds; watched_intervals JSON; is_completed."],
      ["lesson_notes", "id (INT AUTO_INCREMENT)", "user_id -> users, lesson_id -> lessons", "Ghi chú cá nhân của người học; timestamp_seconds gắn với video bài giảng."],
      ["lesson_attachments", "attachment_id (INT AUTO_INCREMENT)", "lesson_id -> lessons", "Tài liệu học tập đính kèm (PDF, Source Code); file_url, is_preview."],
      ["quiz_questions", "question_id (INT AUTO_INCREMENT)", "lesson_id -> lessons", "Câu hỏi trắc nghiệm; options JSON array; correct_answer_index; points trọng số."],
      ["quiz_attempts", "attempt_id (INT AUTO_INCREMENT)", "user_id -> users, lesson_id -> lessons", "Lịch sử nộp bài trắc nghiệm; score thang 0-100; is_passed BOOLEAN."]
    ]
    add_styled_table(doc, headers_dict, rows_dict, [1.4, 1.8, 1.8, 2.2])

    # 2.4 Thiết kế thuật toán & Sequence Diagrams
    style_heading(doc.add_paragraph(), 2, "2.4 Thiết kế thuật toán, luồng dữ liệu (Data Flow) và Biểu đồ tuần tự")
    add_body_p(doc, "Hệ thống EduViet triển khai các thuật toán xử lý dữ liệu phức tạp đòi hỏi độ chính xác toán học tuyệt đối:")

    add_body_p(doc, "1. Thuật toán hợp nhất các khoảng thời gian xem thực tế (Interval Union Algorithm):", bold_prefix="• ")
    add_body_p(doc, "Để chống gian lận tua nhanh video, client gửi heartbeat chứa đoạn thời gian vừa phát [start, end]. Server nhận danh sách các đoạn rời rạc, sắp xếp theo thời gian bắt đầu và hợp nhất các đoạn giao nhau hoặc kề nhau:")
    
    add_code_block(doc, 
"""// Thuật toán hợp nhất Interval Union trong LearningService
export function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (!intervals || intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = merged[merged.length - 1];

    if (current[0] <= prev[1] + 1) { // Giao nhau hoặc liền kề
      prev[1] = Math.max(prev[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}""", caption="Thuật toán hợp nhất Interval Union bảo vệ tiến độ học tập")

    add_body_p(doc, "Tổng thời gian học thực chất được tính bằng: T = sum(end_i - start_i) cho mọi khoảng trong danh sách đã hợp nhất. Tỷ lệ hoàn thành = min(100, round((T / duration) * 100)). Chỉ khi tỷ lệ này >= 90%, bài học mới được đánh dấu is_completed = true.")

    add_body_p(doc, "2. Thuật toán phát hiện chu trình trên cây danh mục (Cycle Detection Algorithm):", bold_prefix="• ")
    add_body_p(doc, "Trong CategoryService, khi quản trị viên cập nhật parent_id cho danh mục X thành Y, hệ thống duyệt ngược từ Y lên các tổ tiên (ancestors). Nếu gặp lại chính X, hệ thống phát hiện chu trình và lập tức ném lỗi BadRequestException('Không thể thiết lập danh mục cha tạo thành vòng lặp').")

    # 2.5 Wireframe & Booking UI
    style_heading(doc.add_paragraph(), 2, "2.5 Thiết kế giao diện (Wireframes) và Quy chuẩn trải nghiệm Booking.com")
    add_body_p(doc, "Giao diện người dùng của EduViet tuân thủ bộ quy tắc kiến trúc chuẩn (EduEnglish Master Template) và lấy cảm hứng từ trải nghiệm tìm kiếm tiện ích của Booking.com:")
    add_body_p(doc, "1. Thanh tìm kiếm trung tâm (Booking Search Box): Sử dụng khung viền vàng nổi bật màu #ffb700 dày 3px, bo góc 14px, bao bọc toàn bộ các trường nhập liệu (Từ khóa, Danh mục, Trình độ) trên nền trắng tinh tế. Trạng thái hover có hiệu ứng bóng đổ và nâng nhẹ giao diện (translateY(-2px)).")
    add_body_p(doc, "2. Bố cục không gian toàn trang (Layout Philosophy): Thanh điều hướng Header và chân trang Footer luôn phủ kín toàn bộ chiều rộng màn hình (container-fluid px-lg-4), trong khi phần nội dung thân trang được gom gọn trong khung chứa trung tâm .app-container (max-width: 1240px, căn giữa) giúp tối ưu tầm nhìn của mắt người dùng.")
    add_body_p(doc, "3. Nguyên tắc công thái học Usability: Mọi tác vụ chính (Tìm khóa học, Đăng nhập, Mua khóa học, Vào phòng học, Làm bài thi) đều được tối ưu để hoàn thành trong tối đa không quá 4 lượt tương tác nhấp chuột.")

    doc.add_page_break()

# End of Chapter 2
