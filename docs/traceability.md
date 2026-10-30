# MA TRẬN TRUY VẾT YÊU CẦU & KIỂM THỬ (TRACEABILITY MATRIX)

- **Dự án:** EduViet — Nền tảng Đào Tạo Lập Trình Trực Tuyến & Phòng Học Tương Tác
- **Học phần:** Thiết kế web nâng cao — Đại học Phenikaa
- **Nhóm 6:** Phù Ngọc Hào, Nguyễn Quốc Khải, Nguyễn Hoàng Sơn

---

| Mã US | Ưu tiên | Tóm tắt câu chuyện người dùng | Thành phần kiến trúc (Backend / Frontend) | Unit Test / Integration Test | Trạng thái |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **US01** | P1 | Khách đăng ký tài khoản học viên | `AuthController.register`, `AuthService`, `User`, `Role` / `AuthModal.jsx` | `UT01`: register valid / email trùng / chặn gán role | **Đợt 1** |
| **US02** | P1 | Người học đăng nhập, đăng xuất & thu hồi phiên | `AuthController.login`, `logout`, `AuthSession` / `Header.jsx`, `AuthModal.jsx` | `UT02`: token valid / expired / revoked | **Đợt 1** |
| **US03** | P1 | Đặt lại mật khẩu qua token xác minh | `AuthController.forgotPassword`, `resetPassword` / `AuthModal.jsx` | `UT03`: reset token hash / expired / replay attack | **Đợt 1** |
| **US04** | P1 | Cập nhật hồ sơ & đổi mật khẩu | `UserController.updateProfile`, `changePassword` / `UserProfile.jsx` | `UT04`: update valid / current password mismatch | **Đợt 1** |
| **US05** | P1 | Tìm kiếm, lọc và sắp xếp khóa học | `CourseController.findAll`, `CategoryController` / `Her.jsx`, `CourseList.jsx` | `UT05`: query filter / level / price range / sort | **Đợt 2** |
| **US06** | P1 | Xem mục tiêu, giáo trình & học thử preview | `CourseController.findOne`, `preview` / `CourseDetailModal.jsx` | `UT06`: published check / preview allowed / paid restricted | **Đợt 2** |
| **US07** | P2 | Lưu khóa học yêu thích (Wishlist) | `WishlistController`, `Wishlist` / `CourseCard.jsx`, `UserProfile.jsx` | `UT07`: add wishlist / duplicate check / remove | **Đợt 6** |
| **US08** | P1 | Quản lý giỏ hàng khóa học | `CartController`, `CartItem` / `CartPage.jsx` | `UT08`: merge cart / price sync / item removal | **Đợt 3** |
| **US09** | P1 | Áp dụng mã ưu đãi (Voucher) | `VoucherController`, `VoucherService` / `CartPage.jsx`, `CheckoutPage.jsx` | `UT09`: discount calc / max cap / expired / quota race | **Đợt 3** |
| **US10** | P1 | Nạp tiền vào ví & xem lịch sử số dư | `WalletController`, `WalletTransaction` / `DepositModal.jsx`, `DepositHistoryModal.jsx` | `UT10`: credit ledger / duplicate callback / pending state | **Đợt 3** |
| **US11** | P1 | Thanh toán đơn hàng & cấp quyền học | `OrderController.pay`, `EnrollmentService` / `CheckoutPage.jsx` | `UT11`: balance check / transaction rollback / idempotent | **Đợt 3** |
| **US12** | P1 | Theo dõi đơn hàng & yêu cầu hoàn tiền | `OrderController`, `RefundService` / `OrderHistory.jsx`, `RefundModal.jsx` | `UT12`: refund window / approval flow / revoke access | **Đợt 3** |
| **US13** | P1 | Xem khóa học đã mua trong Khóa học của tôi | `EnrollmentController.getMyCourses` / `MyLearningPage.jsx` | `UT13`: enrollment filter / resume link generation | **Đợt 4** |
| **US14** | P1 | Chọn bài học video tua đúng mốc thời gian | `CurriculumController` / `CourseLearningRoom.jsx`, `YT.Player` | `UT14`: seekTo start_seconds / loadVideoById / ready guard | **Đợt 4** |
| **US15** | P1 | Lưu tiến độ & khôi phục bài đang học dở | `ProgressController.heartbeat` / `CourseLearningRoom.jsx` | `UT15`: watched_intervals merge / 90% completion rule | **Đợt 4** |
| **US16** | P1 | Lưu ghi chú kèm timestamp video | `NoteController`, `Note` / `CourseLearningRoom.jsx` | `UT16`: note CRUD / timestamp seek / owner isolation | **Đợt 4** |
| **US17** | P1 | Tải tài liệu đính kèm bài giảng | `ResourceController.download` / `CourseLearningRoom.jsx` | `UT17`: authorization check / safe file stream | **Đợt 4** |
| **US18** | P1 | Thực hành code JavaScript trong Sandbox | `CodeArena.jsx`, Web Worker isolated runner | `UT18`: infinite loop timeout / safe console / comparator | **Đợt 4** |
| **US19** | P1 | Làm bài trắc nghiệm Quiz & chấm điểm | `QuizController.submit`, `QuizAttempt` / `QuizModal.jsx` | `UT19`: weighted score / 0-100 normalization / no key leak | **Đợt 4** |
| **US20** | P2 | Nộp bài tập dự án cuối khóa | `AssignmentController.submit` / `AssignmentView.jsx` | `UT20`: repo URL validation / submission versioning | **Đợt 6** |
| **US21** | P2 | Đặt câu hỏi gắn mốc video bài giảng | `DiscussionController` / `CourseLearningRoom.jsx` | `UT21`: discussion thread / sanitize content / lesson scope | **Đợt 6** |
| **US22** | P2 | Đánh giá khóa học (Reviews & Rating) | `ReviewController`, `CourseReview` / `CourseReviews.jsx` | `UT22`: enrolled-only review / rating range 1-5 / aggregate | **Đợt 6** |
| **US23** | P2 | Gửi phiếu hỗ trợ kỹ thuật (Tickets) | `TicketController`, `SupportTicket` / `ChatSupport.jsx`, `TicketModal.jsx` | `UT23`: ticket state machine / thread messages / staff reply | **Đợt 6** |
| **US24** | P2 | Nhận giấy xác nhận hoàn thành khóa học | `CertificateController.verify` / `CertificateView.jsx` | `UT24`: 100% criteria check / unique verification code | **Đợt 6** |
| **US25** | P2 | Đặt mục tiêu học tập tuần & nhắc nhở | `StudyGoalController` / `UserProfile.jsx` | `UT25`: weekly target minutes / opt-out notification | **Đợt 6** |
| **US26** | P2 | Xuất dữ liệu cá nhân & quyền riêng tư | `PrivacyController.exportData` / `UserProfile.jsx` | `UT26`: personal data bundle / delete request verification | **Đợt 6** |
| **US27** | P1 | Giảng viên tạo bản nháp khóa học | `InstructorCourseController.create` / `InstructorDashboard.jsx` | `UT27`: draft creation / instructor ownership constraint | **Đợt 2** |
| **US28** | P1 | Giảng viên quản lý chương, bài, mốc video | `InstructorCurriculumController` / `CurriculumEditor.jsx` | `UT28`: module order / lesson bounds `0 <= start < end` | **Đợt 2** |
| **US29** | P1 | Giảng viên quản lý đề thực hành & quiz | `InstructorAssessmentController` / `AssessmentEditor.jsx` | `UT29`: quiz question versioning / test case validation | **Đợt 2** |
| **US30** | P2 | Giảng viên chấm bài dự án & nhận xét | `InstructorGradeController` / `GradingDashboard.jsx` | `UT30`: rubric scoring / feedback persistence | **Đợt 6** |
| **US31** | P1 | Quản trị viên phân quyền & khóa tài khoản | `AdminUserController.updateStatus` / `AdminDashboard.jsx` | `UT31`: prevent last admin lock / immediate token revoke | **Đợt 1** |
| **US32** | P1 | Quản trị viên duyệt công bố khóa học | `AdminCourseController.publish` / `AdminDashboard.jsx` | `UT32`: publish prerequisites / category cycle prevention | **Đợt 2** |
| **US33** | P1 | Quản trị viên đối soát nạp ví & hoàn tiền | `AdminReconcileController` / `AdminDashboard.jsx` | `UT33`: ledger balance audit / refund approval action | **Đợt 3** |
| **US34** | P2 | Quản trị viên xử lý báo cáo vi phạm | `AdminModerationController` / `AdminDashboard.jsx` | `UT34`: hide content audit / resolve ticket escalation | **Đợt 6** |
| **US35** | P2 | Quản trị viên xem báo cáo doanh thu & học tập | `AdminMetricsController` / `AdminDashboard.jsx` | `UT35`: gross/net revenue calc / active student count | **Đợt 6** |
| **US36** | P1 | Tra cứu nhật ký Audit Log & sao lưu DB | `AdminAuditController`, backup scripts / `AdminDashboard.jsx` | `UT36`: sensitive field filter / non-destructive restore | **Đợt 7** |
