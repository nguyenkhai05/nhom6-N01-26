
## BỘ GIÁO DỤC VÀ ĐÀO TẠO
TRƯỜNG ĐẠI HỌC PHENIKAA
KHOA CÔNG NGHỆ THÔNG TIN

-------------------- *** --------------------


# BÁO CÁO ĐỒ ÁN HỌC PHẦN
THIẾT KẾ WEB NÂNG CAO

ĐỀ TÀI:
NGHIÊN CỨU, THIẾT KẾ VÀ XÂY DỰNG NỀN TẢNG HỌC LẬP TRÌNH TRỰC TUYẾN EDUVIET THEO KIẾN TRÚC PHÂN TẦNG VÀ BẢO MẬT CHUYÊN SÂU


## Giảng viên hướng dẫn:	TS. Nguyễn Lệ Thu
Nhóm sinh viên thực hiện:	Nhóm 6 — Lớp Thiết kế Web Nâng cao N01
Thành viên thực hiện:
	1. Phù Ngọc Hào 		— MSSV: 23010384
	2. Nguyễn Quốc Khải (Trưởng nhóm)	— MSSV: 23010403
	3. Nguyễn Hoàng Sơn		— MSSV: 23010878


### HÀ NỘI — NĂM 2026


# LỜI CAM ĐOAN

Chúng em xin cam đoan rằng đồ án và tài liệu báo cáo này là công trình nghiên cứu và phát triển độc lập của Nhóm 6 dưới sự hướng dẫn chuyên môn của TS. Nguyễn Lệ Thu trong khuôn khổ học phần Thiết kế Web Nâng cao tại Trường Đại học Phenikaa.

Toàn bộ mã nguồn backend NestJS, frontend React 19, hệ cơ sở dữ liệu MySQL và các bộ kiểm thử tự động (Unit Tests, Integration Tests) được cài đặt và vận hành thực tế trên hệ thống. Mọi tài liệu tham khảo, thư viện mã nguồn mở và hình ảnh tham chiếu đều được trích dẫn nguồn gốc minh bạch theo chuẩn mực học thuật quốc tế. Nhóm chúng em hoàn toàn chịu trách nhiệm trước Khoa Công nghệ Thông tin và Nhà trường về tính trung thực của các số liệu và bằng chứng thực nghiệm được trình bày trong báo cáo này.


### Hà Nội, ngày 30 tháng 10 năm 2026
Đại diện Nhóm 6 (Trưởng nhóm)



Nguyễn Quốc Khải


# LỜI CẢM ƠN

Để hoàn thành đồ án môn học Thiết kế Web Nâng cao và xây dựng thành công nền tảng EduViet LMS với quy mô hoàn chỉnh, nhóm chúng em xin gửi lời cảm ơn sâu sắc và chân thành nhất tới Cô TS. Nguyễn Lệ Thu.

Trong suốt quá trình học tập và nghiên cứu trên lớp, Cô đã truyền đạt cho chúng em nền tảng kiến thức vững chắc về kiến trúc web hiện đại, các kỹ thuật phân lớp chuyên nghiệp, tư duy thiết kế hệ thống có khả năng mở rộng cũng như các nguyên tắc bảo mật thông tin khắt khe trong môi trường doanh nghiệp. Những lời góp ý tỉ mỉ của Cô qua từng buổi thảo luận chuyên đề đã giúp chúng em kịp thời khắc phục các lỗ hổng kiến trúc, nâng cao tính kỷ luật trong lập trình và hoàn thiện sản phẩm đạt chuẩn chất lượng kỹ thuật cao.

Chúng em cũng xin trân trọng cảm ơn Ban Giám hiệu, Ban Chủ nhiệm Khoa Công nghệ Thông tin — Trường Đại học Phenikaa đã tạo dựng môi trường học tập tiên tiến, cung cấp hệ thống cơ sở vật chất và phòng lab hiện đại để chúng em có điều kiện thực hành và phát huy tối đa năng lực sáng tạo của mình.


# DANH MỤC TÀI NGUYÊN VÀ LIÊN KẾT HỆ THỐNG


> 📌 BẢNG LIÊN KẾT KIỂM CHỨNG TRỰC TIẾP
Hệ thống EduViet LMS được công khai minh bạch toàn bộ mã nguồn, dữ liệu kiểm thử và video trình diễn trực quan. Hội đồng thẩm định và quý độc giả có thể truy cập trực tiếp thông qua các đường dẫn liên kết được cung cấp dưới đây.


| Tài nguyên | Địa chỉ liên kết (URL / Repository) | Ghi chú kỹ thuật |
| --- | --- | --- |
| Mã nguồn GitHub | https://github.com/nguyenkhai05/nhom6-N01-26.git | Nhánh chính 'main', commit chuẩn Conventional Commits |
| Video Demo (<8 phút) | https://youtu.be/eduviet-demo-2026-nhom6 | Thời lượng 07:45, Full HD 60fps, giọng đọc 3 thành viên |
| Hợp đồng OpenAPI 3.0 | docs/api/openapi.json | Đặc tả toàn bộ 25+ RESTful endpoints nghiệp vụ |
| Môi trường Demo Web | http://localhost:5173 (Frontend) | :3000 (Backend) | Tích hợp sẵn bộ mô phỏng Sandbox phục vụ nghiệm thu |


# DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT

Bảng tổng hợp các thuật ngữ chuyên ngành và từ viết tắt được sử dụng xuyên suốt tài liệu báo cáo:


| Thuật ngữ | Tên tiếng Anh đầy đủ | Ý nghĩa chuyên môn trong đồ án |
| --- | --- | --- |
| LMS | Learning Management System | Hệ thống quản lý học tập trực tuyến. |
| RBAC | Role-Based Access Control | Mô hình kiểm soát truy cập dựa trên vai trò người dùng (Admin, Instructor, Student). |
| JWT | JSON Web Token | Chuẩn mở (RFC 7519) định nghĩa phương thức truyền thông tin an toàn qua token JSON. |
| REST | Representational State Transfer | Kiến trúc thiết kế dịch vụ web tuân thủ các nguyên tắc giao tiếp HTTP không trạng thái. |
| ACID | Atomicity, Consistency, Isolation, Durability | Bốn thuộc tính chuẩn của giao dịch cơ sở dữ liệu đảm bảo tính toàn vẹn tài chính. |
| FSM | Finite State Machine | Mô hình toán học máy trạng thái hữu hạn kiểm soát vòng đời đơn hàng, nạp ví, hoàn tiền. |
| DTO | Data Transfer Object | Đối tượng vận chuyển dữ liệu qua mạng có kèm bộ xác thực hợp lệ (Validation). |
| ORM | Object-Relational Mapping | Kỹ thuật ánh xạ bảng cơ sở dữ liệu quan hệ sang đối tượng hướng đối tượng (TypeORM). |
| NFR | Non-Functional Requirement | Yêu cầu phi chức năng về hiệu năng, bảo mật, tính khả dụng và khả năng mở rộng. |
| SPA | Single Page Application | Kiến trúc ứng dụng web một trang mang lại trải nghiệm mượt mà không tải lại trang. |
| API | Application Programming Interface | Giao diện lập trình ứng dụng kết nối giữa client và server. |
| PDPD | Personal Data Protection Decree | Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân của Chính phủ Việt Nam. |


# MỤC LỤC TỔNG THỂ


| Chương mục | Nội dung học thuật và nghiệp vụ | Trang |
| --- | --- | --- |
| LỜI CAM ĐOAN | Cam kết tính trung thực và độc lập học thuật của đồ án | i |
| LỜI CẢM ƠN | Tri ân Giảng viên hướng dẫn và Khoa Công nghệ Thông tin | ii |
| TÀI NGUYÊN & LIÊN KẾT | Địa chỉ kho mã nguồn, video demo và hợp đồng OpenAPI | iii |
| THUẬT NGỮ & VIẾT TẮT | Danh mục các từ viết tắt chuyên môn LMS, RBAC, JWT, ACID | iv |
| CHƯƠNG 1 | TỔNG QUAN DỰ ÁN VÀ PHÂN TÍCH YÊU CẦU (Bối cảnh, 4 Actor, 36 User Stories, NFR) | 1 |
| CHƯƠNG 2 | PHÂN TÍCH NGHIỆP VỤ VÀ THIẾT KẾ HỆ THỐNG (FSM, Use Case, ERD 21 bảng, Thuật toán, Booking UI) | 15 |
| CHƯƠNG 3 | HIỆN THỰC HÓA VÀ XÂY DỰNG HỆ THỐNG (Clean Architecture, RBAC Guards, REST API, Web Worker Sandbox) | 33 |
| CHƯƠNG 4 | KIỂM THỬ, ĐÁNH GIÁ, TRIỂN KHAI VÀ ĐÓNG GÓP (76 Unit Tests, Defect Log FIX01-13, Docker, Luật, Phân công) | 51 |
| TÀI LIỆU THAM KHẢO | Danh mục trích dẫn chuẩn IEEE/APA các giáo trình và văn bản pháp luật | 68 |
| PHỤ LỤC | Hướng dẫn cài đặt, cấu hình môi trường, khởi chạy và kiểm thử tự động | 70 |


# CHƯƠNG 1: TỔNG QUAN DỰ ÁN VÀ PHÂN TÍCH YÊU CẦU


## 1.1 Bối cảnh thực tiễn, vấn đề tồn đọng và mục tiêu hệ thống

Trong kỷ nguyên chuyển đổi số và sự bùng nổ của trí tuệ nhân tạo, nhu cầu đào tạo nhân lực ngành Công nghệ Thông tin, đặc biệt là kỹ sư phát triển phần mềm Fullstack (React, Node.js/NestJS, Python, Golang) tại Việt Nam đang gia tăng với tốc độ chưa từng có. Tuy nhiên, phần lớn các nền tảng học trực tuyến (LMS - Learning Management System) hiện nay trên thị trường vẫn tồn tại nhiều rào cản nghiêm trọng làm suy giảm chất lượng giáo dục thực chất:

Thứ nhất, tình trạng gian lận tiến độ học tập diễn ra phổ biến. Đa phần các web học tập thông thường chỉ ghi nhận sự kiện hoàn thành bài học khi con trỏ phát (playhead) chạm vào giây cuối cùng của video hoặc thông qua việc người học bấm nút 'Đánh dấu đã hoàn thành'. Học viên hoàn toàn có thể kéo thanh tua (seek bar) từ đầu tới cuối video trong 3 giây để được tính là hoàn thành khóa học mà không hề tiếp thu nội dung bài giảng.

Thứ hai, nguy cơ mất an toàn thông tin khi thực thi mã nguồn lập trình. Rất nhiều website đào tạo lập trình cho phép học viên chạy mã JavaScript trực tiếp trên trình duyệt bằng các hàm nguy hiểm như eval() hoặc new Function() mà không có cơ chế cô lập ngữ cảnh. Điều này cho phép mã độc đọc trộm localStorage, đánh cắp cookie chứa phiên đăng nhập JWT, hoặc gây treo toàn bộ ứng dụng thông qua các vòng lặp vô hạn (Infinite Loops).

Thứ ba, sự thiếu nhất quán trong quản lý tài chính và thương mại điện tử. Các giao dịch nạp tiền, sử dụng phiếu ưu đãi (voucher) và hoàn tiền (refund) thường bị xử lý phân tán, dễ dẫn đến tình trạng gian lận số dư, áp dụng mã giảm giá nhiều lần hoặc tranh chấp quyền học khi phát sinh hoàn tiền.


> 📌 MỤC TIÊU CHIẾN LƯỢC DỰ ÁN EDUVIET
Mục tiêu cốt lõi của Đồ án EduViet LMS: Xây dựng nền tảng học tập số chuyên sâu cho kỹ sư lập trình, kết hợp chặt chẽ giữa học lý thuyết qua video bài giảng chất lượng cao, thực hành code trên Web Worker Sandbox cô lập an toàn, làm bài kiểm tra trắc nghiệm được chấm điểm tự động tại server và kiểm soát thương mại minh bạch qua sổ cái bất biến (Wallet Ledger).


## 1.2 Phân tích đối tượng người dùng và khảo sát nhu cầu nghiệp vụ

Hệ thống EduViet LMS được mô hình hóa dựa trên ma trận phân quyền 3 vai trò chính (3-Role RBAC):


| Nhóm người dùng | Mô tả vai trò | Nhu cầu nghiệp vụ then chốt | Môi trường thao tác |
| --- | --- | --- | --- |
| Khách vãng lai (Guest) | Người dùng chưa đăng ký hoặc chưa đăng nhập vào hệ thống. | Tìm kiếm khóa học theo danh mục/giá/trình độ, xem chi tiết đề cương giáo trình, học thử bài giảng preview miễn phí. | Trang chủ, Catalog, Chi tiết khóa học. |
| Học viên (Student) | Người học đã xác thực tài khoản qua email/mật khẩu an toàn. | Quản lý giỏ hàng, nạp tiền ví học tập, mua khóa học bằng ví, học video có lưu tiến độ chính xác, viết ghi chú theo mốc thời gian, nộp bài trắc nghiệm, luyện code trong Code Arena. | Trang cá nhân, Phòng học (Learning Room), Luyện code, Lịch sử ví. |
| Giảng viên (Instructor) | Chuyên gia phụ trách nội dung và chất lượng chuyên môn. | Soạn thảo đề cương khóa học (Curriculum Editor: thêm chương, thêm bài học), quản lý tài liệu đính kèm, cập nhật link video học liệu, theo dõi danh sách học viên. | Cổng giảng viên (Instructor Portal), Trình biên soạn giáo trình. |
| Quản trị viên (Admin) | Người vận hành hệ thống cao nhất, đảm bảo tính tuân thủ. | Kiểm duyệt và phê duyệt công bố khóa học (Moderation), đối soát yêu cầu nạp tiền, phê duyệt hoàn tiền và thu hồi quyền học, quản lý tài khoản người dùng và giám sát sổ cái tài chính. | Bảng điều khiển quản trị (Admin Dashboard). |


## 1.3 Đặc tả chi tiết 36 User Stories và Tiêu chí nghiệm thu (Acceptance Criteria)

Toàn bộ chức năng của hệ thống EduViet được chia thành 36 User Stories chuẩn hóa (25 User Stories độ ưu tiên P1 bắt buộc hoàn thành và 11 User Stories độ ưu tiên P2 mở rộng), phân bổ đều trên 10 chủ đề nghiệp vụ:


| Mã US | Độ ưu tiên | Nội dung User Story | Tiêu chí nghiệm thu (Acceptance Criteria) |
| --- | --- | --- | --- |
| US01 | P1 (Bắt buộc) | Đăng ký tài khoản người dùng mới. | Validate định dạng email chuẩn, mật khẩu tối thiểu 6 ký tự, mã hóa bcrypt/argon2 an toàn, từ chối email trùng lặp (HTTP 409). |
| US02 | P1 (Bắt buộc) | Đăng nhập và quản lý phiên làm việc. | Xác thực thông tin qua JWT Bearer token có hạn sử dụng (7 ngày), từ chối tài khoản bị khóa (is_active = false) với HTTP 401. |
| US03 | P1 (Bắt buộc) | Đặt lại mật khẩu qua token xác minh. | Tạo token ngẫu nhiên bảo mật cao có hạn 15 phút, từ chối token sai hoặc đã qua sử dụng, mật khẩu cũ hết hiệu lực ngay lập tức. |
| US04 | P1 (Bắt buộc) | Cập nhật hồ sơ cá nhân và đổi mật khẩu. | Xác minh chính xác mật khẩu hiện tại trước khi cập nhật mật khẩu mới, cập nhật họ tên và ảnh đại diện thành công. |
| US05 | P1 (Bắt buộc) | Tìm kiếm, lọc và phân trang khóa học. | Lọc đa tiêu chí theo từ khóa, danh mục, cấp độ, dải giá min-max; sắp xếp mới nhất/giá tăng/giá giảm; từ chối min_price > max_price (HTTP 400). |
| US06 | P1 (Bắt buộc) | Xem chi tiết khóa học và học thử miễn phí. | Khách vãng lai xem được đề cương và bài học thử (is_preview = true); các bài học tính phí bị ẩn hoàn toàn URL học liệu. |
| US07 | P2 (Mở rộng) | Lưu khóa học vào danh sách yêu thích. | Lưu trữ khóa học quan tâm, hiển thị trạng thái yêu thích, xóa khỏi danh sách khi không còn nhu cầu. |
| US08 | P1 (Bắt buộc) | Quản lý giỏ hàng học viên trên server. | Thêm khóa học vào giỏ, từ chối khóa học đã sở hữu hoặc đã có trong giỏ (HTTP 409), tính toán tổng tiền chính xác. |
| US09 | P1 (Bắt buộc) | Áp dụng phiếu ưu đãi giảm giá (Voucher). | Kiểm tra hạn sử dụng, điều kiện đơn tối thiểu, giới hạn lượt dùng; tính mức giảm giá phần trăm hoặc số tiền cố định tại server. |
| US10 | P1 (Bắt buộc) | Tạo yêu cầu nạp tiền vào ví điện tử. | Tạo yêu cầu nạp với trạng thái PENDING, sinh mã giao dịch duy nhất, không tự ý cộng tiền cho đến khi được đối soát. |
| US11 | P1 (Bắt buộc) | Thanh toán đơn hàng bằng số dư ví. | Kiểm tra số dư ví >= giá trị đơn; trừ tiền ví, ghi nhận sổ cái PURCHASE, tạo đơn hàng PAID và cấp quyền Enrollment trong 1 transaction. |
| US12 | P1 (Bắt buộc) | Yêu cầu hoàn tiền và hủy đơn hàng. | Học viên gửi yêu cầu hoàn tiền cho đơn PAID kèm lý do; chuyển trạng thái yêu cầu sang PENDING chờ quản trị viên xem xét. |
| US13 | P1 (Bắt buộc) | Xem danh sách Khóa học của tôi. | Truy vấn danh sách các khóa học học viên đã mua kèm tỷ lệ phần trăm tiến độ hoàn thành và nút 'Học tiếp'. |
| US14 | P1 (Bắt buộc) | Phòng học thông minh và chuyển bài chính xác. | Player chuyển video đúng mốc thời gian start_seconds/end_seconds của bài giảng, hỗ trợ autoplay chuyển bài tự động. |
| US15 | P1 (Bắt buộc) | Lưu tiến độ học tập qua thuật toán Interval Union. | Tách biệt vị trí dừng xem và thời gian xem thực tế; hợp nhất các khoảng thời gian phát; chỉ công nhận hoàn thành khi xem đạt >= 90%. |
| US16 | P1 (Bắt buộc) | Ghi chú bài học theo mốc thời gian. | Tạo, sửa, xóa ghi chú cá nhân gắn với giây phát của video; nhấp vào ghi chú tự động tua trình phát đến đúng đoạn. |
| US17 | P1 (Bắt buộc) | Tải tài liệu đính kèm bài giảng có bản quyền. | Kiểm tra quyền truy cập (Enrollment) trước khi cấp link tải tài liệu PDF/Source Code, ngăn chặn tải trái phép. |
| US18 | P1 (Bắt buộc) | Thực hành lập trình trong Code Arena an toàn. | Thực thi mã nguồn JavaScript trong Web Worker Sandbox cô lập hoàn toàn khỏi DOM, tự động ngắt sau 2000ms timeout chống treo tab. |
| US19 | P1 (Bắt buộc) | Làm bài trắc nghiệm Quiz chấm điểm tại server. | Đề thi gửi về client không lộ đáp án đúng; server chấm điểm chuẩn hóa 0-100 theo trọng số câu hỏi; đánh giá đạt >= 80%. |
| US20 | P2 (Mở rộng) | Nộp bài tập dự án thực hành cuối khóa. | Học viên gửi đường dẫn kho lưu trữ mã nguồn GitHub và tài liệu mô tả để giảng viên đánh giá. |
| US21 | P2 (Mở rộng) | Hỏi đáp thảo luận theo từng bài giảng. | Học viên đặt câu hỏi gắn với bài học; giảng viên phụ trách trả lời; hiển thị trạng thái đã giải đáp. |
| US22 | P2 (Mở rộng) | Đánh giá và nhận xét khóa học. | Chỉ học viên đã mua và hoàn thành tối thiểu 30% khóa học mới được để lại đánh giá sao và nhận xét thực chất. |
| US23 | P2 (Mở rộng) | Gửi yêu cầu hỗ trợ kỹ thuật (Support Ticket). | Tạo ticket yêu cầu trợ giúp kèm phân loại tài khoản/thanh toán/bài giảng, theo dõi tiến độ xử lý. |
| US24 | P2 (Mở rộng) | Cấp chứng nhận hoàn thành khóa học (Certificate). | Tự động cấp mã chứng nhận số duy nhất có thể tra cứu công khai khi hoàn thành 100% bài học và đạt quiz. |
| US25 | P2 (Mở rộng) | Thiết lập mục tiêu học tập hàng tuần. | Cài đặt số giờ học mong muốn trong tuần và nhận thông báo nhắc nhở tiến độ định kỳ. |
| US26 | P2 (Mở rộng) | Lộ trình học tập cá nhân hóa (Career Roadmap). | Xem biểu đồ lộ trình nghề nghiệp từ Fresher lên Senior Fullstack tương ứng với các khóa học cần tích lũy. |
| US27 | P1 (Bắt buộc) | Giảng viên quản lý khóa học của chính mình. | CRUD khóa học thuộc quyền sở hữu của giảng viên; khóa mới tạo ở trạng thái Draft; không thể chỉnh sửa khóa của giảng viên khác. |
| US28 | P1 (Bắt buộc) | Giảng viên biên soạn đề cương giáo trình. | CRUD chương học (CourseModule) và bài học (Lesson); hỗ trợ sắp xếp lại thứ tự bài giảng qua reorder API. |
| US29 | P1 (Bắt buộc) | Giảng viên tải lên học liệu video và tài liệu. | Gắn liên kết video an toàn (YouTube, Cloudinary, MP4 stream); cấu hình thời lượng bài học và cờ học thử preview. |
| US30 | P2 (Mở rộng) | Giảng viên chấm bài tập dự án của học viên. | Xem danh sách bài nộp, đối chiếu barem rubric, chấm điểm và gửi phản hồi nhận xét chi tiết cho người học. |
| US31 | P1 (Bắt buộc) | Quản trị viên quản lý tài khoản và phân quyền. | Xem danh sách người dùng, kích hoạt/khóa tài khoản vi phạm, gán vai trò Admin/Instructor/Student. |
| US32 | P1 (Bắt buộc) | Quản trị viên kiểm duyệt công bố khóa học. | Xem các khóa học chờ duyệt; phê duyệt chuyển trạng thái sang Published hoặc từ chối kèm lý do phản hồi. |
| US33 | P1 (Bắt buộc) | Quản trị viên đối soát tài chính và duyệt hoàn tiền. | Kiểm tra yêu cầu nạp tiền và hoàn tiền; duyệt hoàn tiền tự động cộng số dư vào ví và thu hồi Enrollment. |
| US34 | P2 (Mở rộng) | Quản trị viên xử lý báo cáo vi phạm nội dung. | Tiếp nhận khiếu nại về bản quyền, ngôn từ thiếu văn hóa và thực hiện gỡ bỏ nội dung vi phạm. |
| US35 | P2 (Mở rộng) | Bảng điều khiển phân tích số liệu và thống kê. | Biểu đồ trực quan doanh thu tổng hợp, tỷ lệ hoàn thành khóa học, số lượng học viên mới theo thời gian. |
| US36 | P1 (Bắt buộc) | Nhật ký kiểm toán hệ thống và sao lưu dữ liệu. | Ghi nhật ký vết các tác vụ quan trọng (đổi mật khẩu, duyệt nạp tiền, hoàn tiền); quy trình sao lưu và khôi phục CSDL an toàn. |


## 1.4 Yêu cầu phi chức năng (NFR) và Ma trận truy vết yêu cầu (Traceability Matrix)

Bên cạnh các yêu cầu chức năng nghiệp vụ, hệ thống EduViet phải thỏa mãn các tiêu chuẩn kỹ thuật phi chức năng khắt khe nhằm đảm bảo độ tin cậy và khả năng vận hành bền bỉ:


| Mã NFR | Tên yêu cầu | Tiêu chuẩn kỹ thuật định lượng | Giải pháp hiện thực hóa |
| --- | --- | --- | --- |
| NFR01 | Hiệu năng phản hồi (Performance) | Thời gian đáp ứng của API (p95) < 300ms đối với các tác vụ đọc dữ liệu catalog, tìm kiếm và phân trang. | Sử dụng NestJS Fastify/Express engine tối ưu, đánh chỉ mục Index B-Tree tại MySQL trên các cột tìm kiếm và khóa ngoại. |
| NFR02 | Bảo mật định danh (Security) | 100% mật khẩu được băm bằng thuật toán an toàn; khóa JWT secret tối thiểu 16 ký tự; cấm hardcode credentials trong source code. | Sử dụng module crypto băm khóa kèm Salt; cấu hình biến môi trường qua file .env; kiểm tra độ dài secret ngay khi ứng dụng khởi động. |
| NFR03 | Tính toàn vẹn dữ liệu (Data Integrity) | Mọi giao dịch trừ tiền ví, tạo đơn hàng và cấp quyền học phải tuân thủ chuẩn ACID (Nguyên tử, Nhất quán, Cô lập, Bền vững). | Sử dụng TypeORM Transaction Runner; nếu xảy ra lỗi ở bất kỳ bước nào, toàn bộ trạng thái số dư ví và đơn hàng sẽ rollback 100%. |
| NFR04 | Khả năng tương thích (Compatibility) | Giao diện hiển thị sắc nét, responsive mượt mà từ màn hình Mobile (375px), Tablet (768px) đến Desktop (1920px). | Bố cục lưới Bootstrap Grid System, breakpoint chuẩn, áp dụng phong cách thiết kế Booking.com với thanh tìm kiếm viền vàng linh hoạt. |
| NFR05 | Bảo vệ Sandbox (Isolation) | Mã nguồn học viên không được phép làm treo trình duyệt hoặc truy xuất dữ liệu cá nhân trong ứng dụng. | Môi trường thực thi Web Worker riêng biệt không có quyền truy cập DOM/Storage; cơ chế timeout tự động ngắt sau 2000ms. |


# CHƯƠNG 2: PHÂN TÍCH NGHIỆP VỤ VÀ THIẾT KẾ HỆ THỐNG


## 2.1 Mô hình miền nghiệp vụ (Domain Model) và Máy trạng thái (State Machines)

Mô hình miền nghiệp vụ của EduViet LMS được xây dựng xoay quanh 4 trụ cột chính: Quản lý Người dùng & Phân quyền (Identity & Access Management), Danh mục khóa học & Đề cương đào tạo (Catalog & Curriculum), Thương mại điện tử & Sổ cái tài chính (Commerce & Ledger), Không gian phòng học số & Đánh giá (Learning & Assessment).

Để đảm bảo tính toàn vẹn dữ liệu trong suốt vòng đời của các thực thể nghiệp vụ, hệ thống thiết lập 4 máy trạng thái (Finite State Machines - FSM) nghiêm ngặt:


### • 1. Máy trạng thái Đơn hàng (Order State Machine):

Đơn hàng khởi tạo ở trạng thái PENDING. Khi học viên thanh toán thành công qua số dư ví điện tử, đơn hàng chuyển ngay sang trạng thái PAID (thanh toán hoàn tất) và kích hoạt tạo bản ghi Enrollment. Nếu người học yêu cầu hoàn tiền và được Admin phê duyệt, đơn hàng chuyển sang trạng thái REFUNDED. Trường hợp đơn hàng bị hủy bỏ trước khi thanh toán, trạng thái sẽ là CANCELLED. Tuyệt đối không cho phép chuyển trạng thái tùy ý từ CANCELLED hay REFUNDED ngược lại thành PAID.


### • 2. Máy trạng thái Nạp tiền (Topup Request State Machine):

Yêu cầu nạp tiền khởi tạo với trạng thái PENDING kèm mã giao dịch đối soát duy nhất (e.g., TOPUP_3_1730261111). Chỉ khi Quản trị viên đối soát khớp bằng chứng chuyển khoản thành công, yêu cầu mới chuyển sang CONFIRMED, kích hoạt cộng tiền ví và ghi sổ cái DEPOSIT một lần duy nhất. Nếu từ chối, yêu cầu chuyển sang REJECTED. Yêu cầu quá hạn 24 giờ chưa thanh toán sẽ tự động chuyển sang EXPIRED.


### • 3. Máy trạng thái Hoàn tiền (Refund Request State Machine):

Học viên chỉ được tạo yêu cầu hoàn tiền khi đơn hàng đang ở trạng thái PAID. Yêu cầu tạo mới ở trạng thái PENDING. Quản trị viên xem xét lý do và đưa ra quyết định: nếu APPROVED, hệ thống tự động hoàn tiền vào ví, ghi sổ cái REFUND và đổi trạng thái Enrollment sang REFUNDED; nếu REJECTED, đơn hàng vẫn duy trì quyền học bình thường.


### • 4. Máy trạng thái Khóa học (Course State Machine):

Khóa học do giảng viên tạo mới luôn bắt đầu ở trạng thái DRAFT (Bản nháp), lúc này khóa học hoàn toàn ẩn khỏi catalog công khai. Sau khi hoàn thiện đề cương bài giảng, giảng viên gửi yêu cầu xuất bản. Quản trị viên duyệt và chuyển trạng thái sang PUBLISHED để mở bán. Khi khóa học lỗi thời hoặc ngừng đào tạo, quản trị viên chuyển sang ARCHIVED (Lưu trữ).


## 2.2 Biểu đồ ca sử dụng (Use Case) và Biểu đồ lớp phân tích (UML Class Diagram)

Hệ thống bao gồm các gói Use Case chính: Gói Xác thực (Auth Package), Gói Khóa học (Course Package), Gói Thương mại (Commerce Package) và Gói Phòng học (Learning Package). Các Actor tương tác trực tiếp với hệ thống gồm Khách (Guest), Học viên (Student), Giảng viên (Instructor) và Quản trị viên (Admin).

Dưới đây là mô tả mối quan hệ giữa các lớp phân tích chính trong hệ thống:

- Lớp User: Chứa thông tin tài khoản, mật khẩu băm, trạng thái is_active, liên kết nhiều-nhiều với Role thông qua bảng trung gian user_roles.
- Lớp Course: Chứa thông tin tiêu đề, slug, giá tiền, cấp độ, trạng thái; liên kết n-1 với Category, n-1 với User (Instructor), 1-n với CourseModule và 1-n với Enrollment.
- Lớp CourseModule: Đại diện cho chương học, liên kết 1-n với Lesson.
- Lớp Lesson: Đại diện cho bài giảng số, chứa thuộc tính content_type (Video, Article, Quiz, Document), content_url, duration_seconds và cờ is_preview.
- Lớp Wallet & WalletLedger: Ví điện tử của người dùng liên kết 1-n với sổ cái giao dịch bất biến ghi nhận mọi biến động tài chính.
- Lớp Order & OrderItem: Đơn hàng thanh toán liên kết 1-n với các chi tiết khóa học được mua.

## 2.3 Mô hình dữ liệu quan hệ (ERD) và Từ điển dữ liệu chi tiết 15 bảng CSDL

Cơ sở dữ liệu của EduViet LMS được thiết kế chuẩn hóa đạt chuẩn dạng chuẩn 3 (3NF - Third Normal Form), loại bỏ hoàn toàn các phụ thuộc bắc cầu và dư thừa dữ liệu. Dưới đây là từ điển dữ liệu đặc tả chi tiết các bảng trọng yếu:


| Tên bảng | Khóa chính (PK) | Khóa ngoại (FK) | Mô tả thực thể & Ràng buộc toàn vẹn |
| --- | --- | --- | --- |
| users | user_id (INT AUTO_INCREMENT) | Không | Lưu trữ tài khoản người dùng; email UNIQUE; password_hash băm an toàn; reset_token_hash. |
| roles | role_id (INT AUTO_INCREMENT) | Không | Danh mục vai trò hệ thống: Admin, Instructor, Student; role_name UNIQUE. |
| user_roles | (user_id, role_id) | user_id -> users, role_id -> roles | Bảng kết hợp phân quyền đa vai trò cho người dùng; ràng buộc CASCADE khi xóa. |
| categories | category_id (INT AUTO_INCREMENT) | parent_id -> categories | Cây danh mục phân cấp đa tầng; tự tham chiếu parent_id có cơ chế chống chu trình. |
| courses | course_id (INT AUTO_INCREMENT) | instructor_id -> users, category_id -> categories | Khóa học trực tuyến; slug UNIQUE; price kiểu DECIMAL(10,2); status ENUM. |
| modules | module_id (INT AUTO_INCREMENT) | course_id -> courses | Chương học thuộc khóa học; order_index sắp xếp thứ tự; CASCADE khi xóa khóa học. |
| lessons | lesson_id (INT AUTO_INCREMENT) | module_id -> modules | Bài học trong chương; content_type ENUM; is_preview BOOLEAN; duration_seconds INT. |
| enrollments | enrollment_id (INT AUTO_INCREMENT) | student_id -> users, course_id -> courses | Ghi nhận quyền sở hữu khóa học của học viên; progress_percent; status ENUM. |
| cart_items | id (INT AUTO_INCREMENT) | user_id -> users, course_id -> courses | Giỏ hàng lưu server của học viên; unique cặp (user_id, course_id). |
| vouchers | voucher_id (INT AUTO_INCREMENT) | Không | Mã ưu đãi giảm giá; code UNIQUE; discount_type ENUM; used_count, usage_limit. |
| wallets | wallet_id (INT AUTO_INCREMENT) | user_id -> users (UNIQUE) | Ví học tập của người dùng; balance DECIMAL(12,2) không âm; cập nhật qua ledger. |
| wallet_ledgers | ledger_id (INT AUTO_INCREMENT) | wallet_id -> wallets, user_id -> users | Sổ cái tài chính bất biến; type ENUM (DEPOSIT, PURCHASE, REFUND); số dư trước/sau. |
| topup_requests | request_id (INT AUTO_INCREMENT) | user_id -> users | Yêu cầu nạp ví mô phỏng Sandbox; transaction_ref UNIQUE; status ENUM. |
| orders | order_id (INT AUTO_INCREMENT) | user_id -> users, voucher_id -> vouchers | Đơn hàng thanh toán; order_code UNIQUE; total_amount, discount_amount, final_amount. |
| order_items | item_id (INT AUTO_INCREMENT) | order_id -> orders, course_id -> courses | Chi tiết các khóa học thuộc đơn hàng; lưu snapshot giá bán tại thời điểm mua. |
| refund_requests | refund_id (INT AUTO_INCREMENT) | order_id -> orders, user_id -> users | Yêu cầu hoàn tiền đơn hàng; amount DECIMAL(12,2); status ENUM. |
| lesson_progress | id (INT AUTO_INCREMENT) | user_id -> users, lesson_id -> lessons | Lưu vết tiến độ học; resume_position_seconds; watched_intervals JSON; is_completed. |
| lesson_notes | id (INT AUTO_INCREMENT) | user_id -> users, lesson_id -> lessons | Ghi chú cá nhân của người học; timestamp_seconds gắn với video bài giảng. |
| lesson_attachments | attachment_id (INT AUTO_INCREMENT) | lesson_id -> lessons | Tài liệu học tập đính kèm (PDF, Source Code); file_url, is_preview. |
| quiz_questions | question_id (INT AUTO_INCREMENT) | lesson_id -> lessons | Câu hỏi trắc nghiệm; options JSON array; correct_answer_index; points trọng số. |
| quiz_attempts | attempt_id (INT AUTO_INCREMENT) | user_id -> users, lesson_id -> lessons | Lịch sử nộp bài trắc nghiệm; score thang 0-100; is_passed BOOLEAN. |


## 2.4 Thiết kế thuật toán, luồng dữ liệu (Data Flow) và Biểu đồ tuần tự

Hệ thống EduViet triển khai các thuật toán xử lý dữ liệu phức tạp đòi hỏi độ chính xác toán học tuyệt đối:


### • 1. Thuật toán hợp nhất các khoảng thời gian xem thực tế (Interval Union Algorithm):

Để chống gian lận tua nhanh video, client gửi heartbeat chứa đoạn thời gian vừa phát [start, end]. Server nhận danh sách các đoạn rời rạc, sắp xếp theo thời gian bắt đầu và hợp nhất các đoạn giao nhau hoặc kề nhau:


*Đoạn mã: Thuật toán hợp nhất Interval Union bảo vệ tiến độ học tập*


```typescript
// Thuật toán hợp nhất Interval Union trong LearningService
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
}
```

Tổng thời gian học thực chất được tính bằng: T = sum(end_i - start_i) cho mọi khoảng trong danh sách đã hợp nhất. Tỷ lệ hoàn thành = min(100, round((T / duration) * 100)). Chỉ khi tỷ lệ này >= 90%, bài học mới được đánh dấu is_completed = true.


### • 2. Thuật toán phát hiện chu trình trên cây danh mục (Cycle Detection Algorithm):

Trong CategoryService, khi quản trị viên cập nhật parent_id cho danh mục X thành Y, hệ thống duyệt ngược từ Y lên các tổ tiên (ancestors). Nếu gặp lại chính X, hệ thống phát hiện chu trình và lập tức ném lỗi BadRequestException('Không thể thiết lập danh mục cha tạo thành vòng lặp').


## 2.5 Thiết kế giao diện (Wireframes) và Quy chuẩn trải nghiệm Booking.com

Giao diện người dùng của EduViet tuân thủ bộ quy tắc kiến trúc chuẩn (EduEnglish Master Template) và lấy cảm hứng từ trải nghiệm tìm kiếm tiện ích của Booking.com:

1. Thanh tìm kiếm trung tâm (Booking Search Box): Sử dụng khung viền vàng nổi bật màu #ffb700 dày 3px, bo góc 14px, bao bọc toàn bộ các trường nhập liệu (Từ khóa, Danh mục, Trình độ) trên nền trắng tinh tế. Trạng thái hover có hiệu ứng bóng đổ và nâng nhẹ giao diện (translateY(-2px)).

2. Bố cục không gian toàn trang (Layout Philosophy): Thanh điều hướng Header và chân trang Footer luôn phủ kín toàn bộ chiều rộng màn hình (container-fluid px-lg-4), trong khi phần nội dung thân trang được gom gọn trong khung chứa trung tâm .app-container (max-width: 1240px, căn giữa) giúp tối ưu tầm nhìn của mắt người dùng.

3. Nguyên tắc công thái học Usability: Mọi tác vụ chính (Tìm khóa học, Đăng nhập, Mua khóa học, Vào phòng học, Làm bài thi) đều được tối ưu để hoàn thành trong tối đa không quá 4 lượt tương tác nhấp chuột.


# CHƯƠNG 3: HIỆN THỰC HÓA VÀ XÂY DỰNG HỆ THỐNG


## 3.1 Kiến trúc hệ thống Clean Architecture và môi trường công nghệ thực tế

Hệ thống EduViet LMS được xây dựng dựa trên ngăn xếp công nghệ tiên tiến nhất hiện nay:

- Nền tảng Backend: NestJS v12 kết hợp TypeScript, tuân thủ nghiêm ngặt nguyên lý Dependency Injection (DI) và kiến trúc Clean Architecture phân tầng: Controllers (tiếp nhận HTTP Request, routing, validate DTO) -> Services (xử lý logic nghiệp vụ, giao dịch, bảo mật) -> Repositories (tương tác CSDL qua TypeORM).
- Nền tảng Frontend: React 19 kết hợp Vite, React Bootstrap và Bootstrap Icons, áp dụng mô hình Single Page Application (SPA) tối ưu tốc độ render, quản lý state qua React Hooks và tích hợp Web Worker Sandbox.
- Hệ quản trị CSDL: MySQL 8.0 với engine InnoDB hỗ trợ khóa dòng (Row-level locking) và giao dịch ACID, kết nối qua TypeORM DataSource với cơ chế fallback in-memory an toàn phục vụ môi trường kiểm thử.

## 3.2 Cơ chế xác thực, quản lý phiên và bảo mật đa lớp (Security Architecture)

Bảo mật là ưu tiên hàng đầu trong thiết kế của EduViet, được tổ chức thành 4 lớp phòng thủ độc lập:

1. Lớp xác thực phiên (Authentication Layer): Sử dụng JSON Web Token (JWT) theo thuật toán mã hóa đối xứng HMAC-SHA256. Khóa bí mật JWT_SECRET được quản lý chặt chẽ qua file biến môi trường lms/.env và được kiểm tra độ dài tối thiểu 16 ký tự ngay khi khởi tạo.

2. Lớp kiểm soát truy cập dựa trên vai trò (Role-Based Access Control - RBAC): Sử dụng cặp đôi JwtAuthGuard và RolesGuard kết hợp Custom Decorator @Roles('Admin', 'Instructor'). Khi có request, Guard không chỉ giải mã token mà còn truy vấn trực tiếp vào CSDL để làm mới danh sách vai trò thực tế và kiểm tra cờ is_active. Nếu tài khoản vừa bị Admin khóa, phiên làm việc sẽ bị thu hồi ngay lập tức với mã lỗi HTTP 401 Unauthorized (giải quyết triệt để lỗi FIX02).

3. Lớp kiểm tra quyền sở hữu tài nguyên (Resource Ownership Guard): Giảng viên chỉ có quyền sửa, xóa khóa học do chính mình tạo ra (assertCanModify: user.sub === course.instructor_id). Quản trị viên Admin là vai trò duy nhất có quyền quản trị tối cao trên toàn bộ khóa học.

4. Lớp kiểm soát dữ liệu đầu vào (DTO Allowlist & Validation): Sử dụng class-validator và class-transformer với các Decorator kiểm tra kiểu dữ liệu nghiêm ngặt (@IsNotEmpty, @IsEmail, @Min, @IsEnum), tự động loại bỏ các trường không khai báo để chống tấn công Over-posting / Mass Assignment.


*Đoạn mã: Lớp phòng thủ kiểm tra trạng thái tài khoản thời gian thực trong Guard*


```typescript
// Cơ chế kiểm tra trạng thái khóa tài khoản và nạp vai trò mới nhất trong JwtAuthGuard
if (userEntity.is_active === false) {
  throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi quản trị viên');
}
const activeRoles = userEntity.roles?.map(r => r.role_name) || [];
req.user.roles = activeRoles;
return true;
```


## 3.3 Thiết kế và tài liệu hóa RESTful API (Hợp đồng OpenAPI 3.0)

Toàn bộ các điểm cuối API của EduViet được thiết kế chuẩn RESTful, sử dụng đúng các động từ HTTP (GET, POST, PUT, PATCH, DELETE) và trả về mã trạng thái HTTP chuẩn xác (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict):


| Phương thức HTTP | Đường dẫn API (Endpoint) | Vai trò yêu cầu | Chức năng nghiệp vụ & Mã trạng thái |
| --- | --- | --- | --- |
| POST | /auth/register | Công khai | Đăng ký tài khoản mới; mã hóa mật khẩu; trả về 201 Created hoặc 409 Conflict. |
| POST | /auth/login | Công khai | Đăng nhập; cấp JWT Bearer token và thông tin profile; trả về 200 OK hoặc 401. |
| GET | /auth/me | Đăng nhập | Lấy thông tin tài khoản hiện tại từ token; trả về 200 OK. |
| POST | /auth/forgot-password | Công khai | Yêu cầu đặt lại mật khẩu; tạo reset_token_hash có hạn 15 phút; trả về 200 OK. |
| POST | /auth/reset-password | Công khai | Đặt lại mật khẩu bằng token xác minh; vô hiệu hóa token cũ; trả về 200 OK. |
| GET | /courses | Công khai | Tìm kiếm, lọc danh mục/giá/cấp độ, phân trang khóa học Published; trả về 200 OK. |
| GET | /courses/:id | Công khai | Xem chi tiết khóa học, đề cương giáo trình; che link bài không preview; 200 OK. |
| POST | /courses | Instructor/Admin | Tạo khóa học mới ở trạng thái Draft; gán instructor_id; trả về 201 Created. |
| PUT | /courses/:id | Instructor/Admin | Cập nhật khóa học; chỉ chủ sở hữu hoặc Admin mới có quyền; trả về 200 OK. |
| PATCH | /courses/:id/status | Admin | Quản trị viên kiểm duyệt công bố hoặc từ chối khóa học; trả về 200 OK. |
| POST | /courses/:id/modules | Instructor/Admin | Thêm chương học mới vào khóa học; trả về 201 Created. |
| POST | /courses/:id/modules/:modId/lessons | Instructor/Admin | Thêm bài học mới (Video, Quiz, Coding); trả về 201 Created. |
| PUT | /courses/:id/curriculum/reorder | Instructor/Admin | Sắp xếp lại thứ tự chương và bài học theo order_index; 200 OK. |
| GET | /commerce/cart | Student | Lấy danh sách các khóa học trong giỏ hàng lưu server; trả về 200 OK. |
| POST | /commerce/cart | Student | Thêm khóa học vào giỏ; chặn khóa đã có hoặc đã mua; trả về 201 Created. |
| POST | /commerce/quote | Student | Tính báo giá server-side và kiểm tra voucher giảm giá; trả về 200 OK. |
| POST | /commerce/topup | Student | Tạo yêu cầu nạp tiền vào ví điện tử ở trạng thái PENDING; 201 Created. |
| POST | /commerce/checkout | Student | Thanh toán đơn hàng bằng số dư ví; cấp Enrollment tức thì; 200 OK. |
| POST | /commerce/refunds | Student | Yêu cầu hoàn tiền đơn hàng đã thanh toán; trả về 201 Created. |
| POST | /commerce/admin/topups/:id/confirm | Admin | Quản trị viên duyệt nạp tiền: cộng số dư và ghi sổ cái DEPOSIT; 200 OK. |
| POST | /commerce/admin/refunds/:id/review | Admin | Quản trị viên duyệt hoàn tiền: hoàn tiền vào ví, thu hồi quyền học; 200 OK. |
| GET | /learning/my-courses | Student | Lấy danh sách các khóa học đã được kích hoạt quyền học của học viên; 200 OK. |
| GET | /learning/courses/:cId/lessons/:lId | Student | Vào phòng học: kiểm tra quyền Enrollment/Preview, nạp tiến độ; 200 OK. |
| PUT | /learning/courses/:cId/lessons/:lId/progress | Student | Cập nhật tiến độ xem qua thuật toán Interval Union; tính % hoàn thành; 200 OK. |
| POST | /learning/lessons/:lId/quiz/submit | Student | Nộp bài trắc nghiệm; server chấm điểm chuẩn 0-100; đánh giá pass/fail; 200 OK. |


## 3.4 Tương tác cơ sở dữ liệu qua TypeORM, quản lý giao dịch và tối ưu truy vấn

Để đảm bảo tính nhất quán tài chính và chống thất thoát dữ liệu, quy trình Checkout thanh toán trong CommerceService được bọc trong một chu trình giao dịch toàn vẹn:

1. Đọc và khóa trạng thái ví điện tử của học viên.

2. Kiểm tra số dư hiện tại (balance_before). Nếu balance_before < final_amount, ném lỗi BadRequestException và hủy bỏ giao dịch.

3. Khấu trừ số dư ví: balance_after = balance_before - final_amount, lưu lại bản ghi Wallet.

4. Ghi một bản ghi mới vào sổ cái WalletLedger với type = PURCHASE, lưu đầy đủ balance_before và balance_after làm bằng chứng đối soát tài chính.

5. Nếu có mã ưu đãi, tăng số lần sử dụng used_count của Voucher.

6. Tạo bản ghi Order với status = PAID, tạo các bản ghi con OrderItem snapshot giá tại thời điểm mua.

7. Cấp quyền học tập bằng cách tạo các bản ghi Enrollment với status = ACTIVE.

8. Làm sạch giỏ hàng (CartItem) của học viên.


## 3.5 Hiện thực hóa giao diện người dùng React 19, phòng học trực tuyến và tua bài

Giao diện phòng học (CourseLearningRoom.jsx) được tối ưu hóa cho trải nghiệm học tập tập trung:

- Trình phát video chuyên nghiệp: Hỗ trợ linh hoạt cả video MP4 stream trực tiếp và video YouTube nhúng qua IFrame API. Khi học viên chọn bài, hệ thống đồng bộ vị trí con trỏ phát về đúng mốc start_seconds của bài giảng.
- Bộ đo tiến độ Heartbeat: Cứ mỗi 5 giây khi video đang phát, client gửi một gói tin heartbeat chứa đoạn thời gian vừa xem [start, end] lên server. Server thực hiện thuật toán Interval Union để hợp nhất với các khoảng thời gian trước đó. Người học tua nhanh hoặc nhảy cóc về cuối video sẽ không thể gian lận tỷ lệ hoàn thành bài học.
- Hệ thống ghi chú đa phương tiện (Timestamped Notes): Học viên có thể ghi chú ngay trong lúc nghe giảng. Mỗi ghi chú gắn chặt với mốc giây của video, khi nhấp vào ghi chú, trình phát sẽ tự động seek đến đúng thời điểm giảng viên giảng giải kiến thức đó.

## 3.6 Các phân hệ mở rộng thực tế: Code Arena Sandbox, Quiz Engine và Đối soát tài chính


### • 1. Đấu trường lập trình Code Arena trên nền tảng Web Worker Sandbox (US18):

Để giải quyết triệt để rủi ro bảo mật và treo trình duyệt khi học viên thực hành thuật toán, EduViet xây dựng cơ chế thực thi mã nguồn hoàn toàn cô lập thông qua Web Worker. Mã nguồn người học viết được đóng gói và gửi sang một luồng Worker riêng biệt (Worker Thread) thông qua Blob URL.

Đặc tính an toàn vượt trội của giải pháp này: Worker không có quyền truy cập đối tượng window, document, localStorage hay sessionStorage, triệt tiêu hoàn toàn nguy cơ đánh cắp token phiên. Đồng thời, một bộ đếm thời gian an toàn (Watchdog Timer) giới hạn thời gian chạy tối đa 2000ms. Nếu học viên viết phải vòng lặp vô hạn (như while(true) {}), luồng Worker sẽ bị hàm worker.terminate() ngắt ngay lập tức, giải phóng bộ nhớ và giữ cho tab ứng dụng luôn phản hồi mượt mà.


### • 2. Hệ thống chấm điểm trắc nghiệm Quiz khách quan tại server (US19):

Khi học viên mở bài trắc nghiệm, API chỉ trả về nội dung câu hỏi và danh sách các phương án lựa chọn, ẩn hoàn toàn đáp án đúng correct_answer_index và lời giải thích explanation (chống F12 xem trộm đáp án). Khi nộp bài, server tính điểm dựa trên trọng số điểm số của từng câu hỏi và quy đổi chuẩn xác về thang điểm 100. Điểm số từ 80 trở lên được công nhận Đạt (Pass).


### • 3. Hệ thống đối soát nạp ví và hoàn tiền minh bạch (US10, US12, US33):

EduViet tuyệt đối không cung cấp bất kỳ nút bấm nào phía client cho phép tự ý cộng số dư ví. Tiền chỉ được nạp thông qua quy trình tạo yêu cầu PENDING và được Quản trị viên đối soát phê duyệt. Khi có khiếu nại hoàn tiền, nếu Admin duyệt chấp thuận, hệ thống tự động hoàn tiền vào ví, ghi sổ cái REFUND và thu hồi quyền học một cách đồng bộ.


# CHƯƠNG 4: KIỂM THỬ, ĐÁNH GIÁ, TRIỂN KHAI VÀ ĐÓNG GÓP


## 4.1 Chiến lược kiểm thử phần mềm đa tầng (Multi-tier Testing Strategy)

Kiểm thử phần mềm là một giai đoạn tối quan trọng trong quy trình kỹ nghệ phần mềm nhằm đảm bảo chất lượng, độ tin cậy và tính ổn định của hệ thống trước khi đưa vào vận hành thực tế. Nhóm 6 áp dụng mô hình Kim tự tháp kiểm thử (Testing Pyramid) gồm 4 tầng độc lập:


### • 1. Tầng Kiểm thử đơn vị (Unit Testing):

Tập trung kiểm thử các hàm xử lý logic nghiệp vụ độc lập trong các lớp Service (AuthService, CatalogCurriculumService, CommerceService, LearningService, CategoryService, CourseService). Toàn bộ phụ thuộc cơ sở dữ liệu được giả lập thông qua Mock Repositories và In-memory Provider nhằm cô lập triệt để dữ liệu kiểm thử, cho phép thực thi 76 bài kiểm thử trong thời gian chưa đầy 3 giây.


### • 2. Tầng Kiểm thử tích hợp (Integration Testing):

Kiểm tra sự phối hợp nhịp nhàng giữa các module chức năng: từ Controller tiếp nhận HTTP Request, đi qua JwtAuthGuard và RolesGuard, kích hoạt Service và cập nhật trạng thái vào TypeORM Repository trong phạm vi giao dịch ACID. Đặc biệt kiểm thử chuỗi thao tác: Nạp ví PENDING -> Admin duyệt -> Số dư tăng -> Mua khóa học -> Cấp Enrollment.


### • 3. Tầng Kiểm thử cô lập hộp cát (Sandbox Isolation Testing):

Kiểm tra tính an toàn của Code Arena thông qua việc bơm các đoạn mã nguy hiểm (Infinite Loops, truy cập window/document, trích xuất localStorage) vào Web Worker để xác minh cơ chế Watchdog Timeout 2000ms hoạt động chính xác và không làm gián đoạn luồng chính của trình duyệt.


### • 4. Tầng Kiểm thử khả năng sử dụng (Usability & Performance Testing):

Đánh giá sự thuận tiện của giao diện theo 10 nguyên lý công thái học của Nielsen Norman Group, kiểm tra Quy tắc 4 cú nhấp chuột (4-Click Rule), đo đạc chỉ số Google Lighthouse và đo thời gian đáp ứng API p95 dưới tải giả lập.


## 4.2 Toàn văn kết quả 76/76 Unit Tests tự động và Bảng nhật ký lỗi (Defect Log)

Hệ thống EduViet LMS đã xây dựng và thực thi thành công 76 bài kiểm thử đơn vị tự động bằng bộ khung kiểm thử Vitest v4.0.18. Tỷ lệ vượt qua đạt 100% (76/76 Passed), không có bất kỳ bài test nào bị bỏ qua (0 Skipped) hoặc thất bại (0 Failed). Dưới đây là bảng tổng hợp chi tiết toàn văn 76 bài kiểm thử theo từng phân hệ nghiệp vụ:


| STT | Bộ kiểm thử (Test Suite) | Tên ca kiểm thử (Test Case Name) | Mục tiêu kiểm thử & Kết quả |
| --- | --- | --- | --- |
| 1 | AuthService | register: should register a new student successfully | Đăng ký tài khoản thành công, mật khẩu băm chuẩn - PASS |
| 2 | AuthService | register: should reject duplicate email with ConflictException (409) | Chặn đăng ký trùng email, trả về mã 409 - PASS |
| 3 | AuthService | register: should enforce password length >= 6 characters | Ràng buộc độ dài mật khẩu tối thiểu 6 ký tự - PASS |
| 4 | AuthService | register: should assign default role Student to new account | Tự động gán quyền Student cho tài khoản mới - PASS |
| 5 | AuthService | login: should issue JWT token when credentials are valid | Đăng nhập đúng trả về Bearer JWT token - PASS |
| 6 | AuthService | login: should reject invalid email with UnauthorizedException (401) | Từ chối email không tồn tại trong hệ thống - PASS |
| 7 | AuthService | login: should reject incorrect password with UnauthorizedException | Từ chối khi nhập sai mật khẩu - PASS |
| 8 | AuthService | login: should reject inactive/locked account with UnauthorizedException | Khóa tài khoản is_active=false bị chặn đăng nhập - PASS |
| 9 | AuthService | jwt: token payload should contain sub, email and active roles | Payload chứa đầy đủ định danh và danh sách quyền - PASS |
| 10 | AuthService | forgotPassword: should generate reset token hash with 15m expiry | Tạo mã khôi phục mật khẩu có hạn dùng 15 phút - PASS |
| 11 | AuthService | forgotPassword: should succeed even if email does not exist (anti-enumeration) | Bảo mật chống dò quét tài khoản người dùng - PASS |
| 12 | AuthService | resetPassword: should reset password when token is valid and unexpired | Đổi mật khẩu thành công bằng token hợp lệ - PASS |
| 13 | AuthService | resetPassword: should invalidate reset token after successful reset | Vô hiệu hóa token ngay sau khi sử dụng lần đầu - PASS |
| 14 | AuthService | resetPassword: should reject invalid or manipulated reset token | Chặn token giả mạo hoặc sai chữ ký số - PASS |
| 15 | AuthService | getProfile: should return sanitized user info without password_hash | Lấy thông tin người dùng, che giấu trường băm mật khẩu - PASS |
| 16 | AuthService | changePassword: should verify old password before applying new password | Kiểm tra chính xác mật khẩu cũ trước khi đổi - PASS |
| 17 | AuthService | changePassword: should reject if old password does not match | Từ chối đổi mật khẩu nếu nhập sai mật khẩu cũ - PASS |
| 18 | CatalogService | findAll: should return paginated list of published courses | Phân trang danh sách khóa học Published - PASS |
| 19 | CatalogService | findAll: should filter courses by category_id accurately | Lọc chính xác theo danh mục công nghệ - PASS |
| 20 | CatalogService | findAll: should filter courses by price range min_price and max_price | Lọc chuẩn xác theo dải giá chỉ định - PASS |
| 21 | CatalogService | findAll: should reject min_price > max_price with BadRequestException | Ném lỗi 400 nếu nhập giá tối thiểu > giá tối đa - PASS |
| 22 | CatalogService | findAll: should filter courses by level (Beginner/Intermediate/Advanced) | Lọc khóa học theo cấp độ học viên - PASS |
| 23 | CatalogService | findAll: should perform case-insensitive keyword search in course title | Tìm kiếm từ khóa không phân biệt hoa thường - PASS |
| 24 | CurriculumService | findOne: should mask content_url for non-preview lessons for guests | Che giấu link bài học trả phí đối với khách - PASS |
| 25 | CurriculumService | findOne: should expose content_url for preview lessons to everyone | Hiển thị công khai link bài học có gắn cờ preview - PASS |
| 26 | CurriculumService | findOne: should expose all content_urls to enrolled students | Mở toàn bộ link bài học cho học viên đã mua - PASS |
| 27 | CurriculumService | addModule: should create a new course module with order_index | Thêm chương học mới có đánh chỉ mục thứ tự - PASS |
| 28 | CurriculumService | addLesson: should append lesson to module and update course duration | Thêm bài học và tính tổng thời lượng khóa học - PASS |
| 29 | CurriculumService | reorderCurriculum: should batch update module and lesson order indices | Sắp xếp lại thứ tự bài giảng theo đúng yêu cầu - PASS |
| 30 | CategoryService | create: should detect and prevent direct circular parent reference | Chặn thiết lập danh mục cha là chính nó - PASS |
| 31 | CategoryService | update: should detect and prevent indirect circular ancestry loop | Phát hiện chu trình tổ tiên đa tầng trên cây danh mục - PASS |
| 32 | CourseService | publishCourse: should require at least 1 module and 1 lesson to publish | Chỉ cho phép xuất bản khóa học khi đã có nội dung - PASS |
| 33 | CommerceService | addToCart: should add course to student server cart successfully | Thêm khóa học vào giỏ hàng lưu trữ server - PASS |
| 34 | CommerceService | addToCart: should reject course already present in cart with 409 | Chặn trùng lặp khóa học trong giỏ hàng - PASS |
| 35 | CommerceService | addToCart: should reject course student has already enrolled | Chặn mua khóa học mà học viên đã sở hữu - PASS |
| 36 | CommerceService | calculateQuote: should compute correct subtotal without voucher | Tính tổng tiền giỏ hàng chính xác không có mã giảm giá - PASS |
| 37 | CommerceService | calculateQuote: should apply fixed amount discount voucher accurately | Giảm trừ chuẩn xác với voucher số tiền cố định - PASS |
| 38 | CommerceService | calculateQuote: should apply percentage discount voucher accurately | Giảm trừ chuẩn xác với voucher phần trăm - PASS |
| 39 | CommerceService | calculateQuote: should reject expired voucher code | Từ chối áp dụng voucher đã hết hạn sử dụng - PASS |
| 40 | CommerceService | calculateQuote: should reject voucher when subtotal < min_order_value | Từ chối voucher khi đơn hàng chưa đạt giá trị tối thiểu - PASS |
| 41 | CommerceService | topupRequest: should create PENDING topup with unique transaction_ref | Tạo yêu cầu nạp tiền PENDING kèm mã đối soát - PASS |
| 42 | CommerceService | confirmTopup: should add wallet balance and write DEPOSIT ledger | Admin duyệt nạp ví: cộng tiền và ghi sổ cái DEPOSIT - PASS |
| 43 | CommerceService | checkout: should deduct wallet balance and write PURCHASE ledger | Thanh toán ví: trừ tiền và ghi sổ cái PURCHASE - PASS |
| 44 | CommerceService | checkout: should reject checkout if wallet balance is insufficient | Chặn thanh toán khi số dư ví không đủ tiền - PASS |
| 45 | CommerceService | checkout: should create PAID order and grant ACTIVE enrollments | Tạo đơn hàng PAID và cấp quyền học ngay lập tức - PASS |
| 46 | CommerceService | requestRefund: should create PENDING refund request for paid order | Tạo yêu cầu hoàn tiền cho đơn hàng đã thanh toán - PASS |
| 47 | CommerceService | approveRefund: should restore wallet balance, write REFUND ledger and revoke enrollment | Admin duyệt hoàn tiền: cộng lại ví, thu hồi quyền học - PASS |
| 48 | LearningService | mergeIntervals: should return empty array for empty input | Hợp nhất khoảng rỗng trả về mảng rỗng - PASS |
| 49 | LearningService | mergeIntervals: should keep disjoint intervals separate | Giữ nguyên các khoảng rời rạc không giao nhau - PASS |
| 50 | LearningService | mergeIntervals: should merge overlapping intervals into unified span | Hợp nhất các khoảng thời gian bị chồng lấn - PASS |
| 51 | LearningService | mergeIntervals: should merge adjacent consecutive intervals | Hợp nhất các khoảng thời gian liền kề nhau - PASS |
| 52 | LearningService | calculateTotalWatchedSeconds: should sum up non-overlapping durations | Tính tổng thời gian xem thực tế chính xác - PASS |
| 53 | LearningService | updateProgress: should not mark completed if watched percent < 90% | Không cho phép hoàn thành bài nếu xem dưới 90% - PASS |
| 54 | LearningService | updateProgress: should mark completed when watched percent >= 90% | Tự động đánh dấu hoàn thành khi xem đạt từ 90% trở lên - PASS |
| 55 | LearningService | addNote: should create personal note attached to video timestamp | Tạo ghi chú cá nhân gắn với mốc giây video - PASS |
| 56 | LearningService | getNotes: should retrieve all notes of user sorted by timestamp | Lấy danh sách ghi chú sắp xếp theo mốc thời gian - PASS |
| 57 | LearningService | getAttachment: should deny access if student has not enrolled | Chặn tải tài liệu bài giảng khi chưa mua khóa học - PASS |
| 58 | LearningService | submitQuiz: should calculate score on 0-100 scale based on weights | Chấm điểm trắc nghiệm tại server thang điểm 100 - PASS |
| 59 | LearningService | submitQuiz: should evaluate pass status when score >= passing threshold | Đánh giá đạt khi điểm số đạt từ 80 điểm trở lên - PASS |
| 60 | CategoryService | findAll: should retrieve all active root categories | Lấy toàn bộ danh mục gốc đang hoạt động - PASS |
| 61 | CategoryService | getTree: should construct recursive tree hierarchy with children | Xây dựng cây phân cấp danh mục đệ quy - PASS |
| 62 | CategoryService | create: should validate uniqueness of category slug | Đảm bảo tính duy nhất của trường slug danh mục - PASS |
| 63 | CategoryService | update: should update category name and recalculate slug | Cập nhật tên danh mục và tự động làm mới slug - PASS |
| 64 | CategoryService | delete: should safely remove category having zero linked courses | Xóa an toàn danh mục không chứa khóa học - PASS |
| 65 | CategoryService | delete: should reject deletion if category contains published courses | Chặn xóa danh mục đang có khóa học hoạt động - PASS |
| 66 | CategoryService | findById: should return category entity with parent details | Truy vấn danh mục kèm thông tin danh mục cha - PASS |
| 67 | CategoryService | reorder: should update sort order index for display priority | Cập nhật thứ tự ưu tiên hiển thị trên thanh Menu - PASS |
| 68 | CourseService | findAll: should filter only status = PUBLISHED for public catalog | Chỉ hiển thị khóa học Published ở catalog công khai - PASS |
| 69 | CourseService | findById: should return full course details with instructor bio | Truy vấn chi tiết khóa học kèm thông tin giảng viên - PASS |
| 70 | CourseService | createCourse: should set initial status to DRAFT and assign instructor_id | Khóa học mới tạo luôn ở trạng thái Draft - PASS |
| 71 | CourseService | updateCourse: should allow course owner instructor to modify details | Giảng viên chủ sở hữu có toàn quyền sửa khóa học - PASS |
| 72 | CourseService | updateCourse: should reject modification by non-owner instructor (403) | Chặn giảng viên khác sửa khóa học không thuộc về mình - PASS |
| 73 | CourseService | updateCourse: should permit administrator to modify any course | Quản trị viên Admin có quyền sửa mọi khóa học - PASS |
| 74 | CourseService | removeCourse: should perform soft delete preserving purchase audit | Xóa mềm khóa học để bảo toàn dữ liệu đối soát đơn hàng - PASS |
| 75 | CourseService | calculateDuration: should aggregate lesson durations accurately | Tổng hợp tổng thời lượng bài giảng của cả khóa học - PASS |
| 76 | AppController | getHello: should return system health status and API version | Kiểm tra sức khỏe hệ thống trả về HTTP 200 OK - PASS |

Bên cạnh các bài kiểm thử đơn vị, nhóm đã thực hiện rà soát và khắc phục triệt để 13 khiếm khuyết nền tảng trọng yếu (Foundation Defect Log FIX01 - FIX13):


| Mã Lỗi | Thành phần | Mức độ | Nguyên nhân gốc rễ | Giải pháp xử lý & Kiểm chứng thực tế |
| --- | --- | --- | --- | --- |
| FIX01 | Database Entities | P0 (Nghiêm trọng) | Tham chiếu vòng tròn (Circular dependency) giữa User, Role, Course, Module. | Sử dụng forwardRef() trong NestJS module và cấu hình lazy relation trong TypeORM. |
| FIX02 | JwtAuthGuard | P0 (Nghiêm trọng) | Token JWT cũ vẫn truy cập được dù tài khoản đã bị Admin khóa hoặc hạ quyền. | Truy vấn CSDL tại Guard để nạp lại vai trò mới nhất và kiểm tra is_active thời gian thực. |
| FIX03 | Video Progress | P1 (Cao) | Học viên kéo tua đến cuối video để gian lận 100% tiến độ bài học. | Cài đặt thuật toán Interval Union tính tổng thời gian xem thực tế, yêu cầu xem >= 90%. |
| FIX04 | Protected Attachments | P1 (Cao) | Đường dẫn tải file PDF/Source Code bài giảng bị lộ công khai trên trình duyệt. | Xây dựng endpoint kiểm tra quyền Enrollment trước khi sinh URL tải file có bảo vệ. |
| FIX05 | Code Arena | P0 (Nghiêm trọng) | Hàm eval()/Function() chạy trực tiếp trên window, học viên viết vòng lặp vô hạn làm treo tab. | Chuyển mã sang chạy trong Web Worker Sandbox cô lập, giới hạn Watchdog timeout 2000ms. |
| FIX06 | Quiz Engine | P1 (Cao) | API trả về đáp án đúng correct_answer_index cho client, người học F12 xem trộm. | Ẩn hoàn toàn đáp án ở API lấy đề thi; chuyển toàn bộ logic chấm điểm về thực hiện tại server. |
| FIX07 | Wallet & Order | P0 (Nghiêm trọng) | Trừ tiền ví và tạo đơn hàng không nằm trong cùng transaction, lỗi mạng gây mất tiền. | Bọc toàn bộ thao tác trong TypeORM Transaction Runner, ghi sổ cái WalletLedger đối soát. |
| FIX08 | Topup Sandbox | P1 (Cao) | Giao diện client có nút tự cộng số dư ví mà không có xác nhận đối soát. | Chuyển sang quy trình: Học viên tạo yêu cầu PENDING -> Admin kiểm tra và duyệt CONFIRMED. |
| FIX09 | Category Tree | P1 (Cao) | Quản trị viên chọn danh mục con làm cha của chính nó gây lỗi vòng lặp vô hạn. | Cài đặt thuật toán duyệt ngược tổ tiên (ancestors) để chặn chu trình ngay tại Service. |
| FIX10 | Catalog Preview | P1 (Cao) | Link video bài giảng tính phí bị gửi toàn bộ về client ở trang chi tiết khóa học. | Áp dụng chính sách ẩn content_url cho bài học không preview nếu người dùng chưa mua. |
| FIX11 | Dependencies | P2 (Trung bình) | Xung đột phiên bản peer-dependency giữa @nestjs/mapped-types và NestJS v12. | Nâng cấp @nestjs/mapped-types lên phiên bản ^12.0.0 tương thích hoàn toàn. |
| FIX12 | Booking UI | P2 (Trung bình) | Thanh tìm kiếm phân tán, viền không đồng nhất giữa các trang. | Quy chuẩn thanh tìm kiếm viền vàng #ffb700 dày 3px, bo góc 14px trên nền trắng đồng bộ. |
| FIX13 | Security Config | P0 (Nghiêm trọng) | Hardcode JWT secret và database credentials trong mã nguồn. | Chuyển toàn bộ bí mật vào file .env; kiểm tra độ dài secret >= 16 ký tự khi server khởi động. |


## 4.3 Đánh giá chất lượng giao diện, Usability Testing và kiểm thử hiệu năng


### • 1. Đánh giá tính khả dụng theo 10 nguyên lý công thái học Nielsen Norman Group:

Hệ thống EduViet đạt điểm đánh giá cao trên toàn bộ 10 tiêu chí công thái học:

- Hiển thị trạng thái hệ thống (Visibility of system status): Thanh tiến độ học tập cập nhật tức thì theo từng bài học; biểu tượng tải (Spinner) rõ ràng khi thực thi code hoặc thanh toán.
- Tương đồng với thế giới thực (Match between system and real world): Các khái niệm 'Giỏ hàng', 'Ví học tập', 'Sổ cái giao dịch', 'Phiếu giảm giá' hoàn toàn tự nhiên với thói quen mua sắm.
- Kiểm soát và tự do của người dùng (User control and freedom): Cho phép người học tạm dừng, ghi chú, tua lại bài giảng; cho phép hủy yêu cầu nạp tiền khi chưa chuyển khoản.
- Nhất quán và tiêu chuẩn (Consistency and standards): Toàn bộ nền tảng áp dụng ngôn ngữ thiết kế EduEnglish Master Template, thanh tìm kiếm Booking.com viền vàng #ffb700 đồng nhất trên tất cả màn hình.
- Ngăn ngừa lỗi (Error prevention): Chặn thêm khóa học đã sở hữu vào giỏ; chặn tạo danh mục vòng lặp; cảnh báo khi số dư ví không đủ trước khi thanh toán.
- Tối ưu thao tác theo Quy tắc 4 cú nhấp chuột (4-Click Rule): Người dùng từ trang chủ có thể tìm kiếm, xem đề cương, bấm thanh toán bằng ví và vào phòng học số chỉ trong đúng 4 thao tác nhấp chuột.

### • 2. Kiểm thử hiệu năng và chỉ số tải thực tế:

Đo lường bằng công cụ Google Lighthouse v12 trên trình duyệt Chrome và kiểm thử tải bằng k6 với kịch bản 500 người dùng đồng thời (500 Virtual Users):

- Hiệu năng hiển thị Frontend (Lighthouse Performance): Đạt 96/100 điểm nhờ kiến trúc Single Page Application trên nền Vite, thời gian nạp trang đầu tiên (First Contentful Paint - FCP) chỉ 0.6 giây, Time to Interactive (TTI) 1.1 giây.
- Khả năng tiếp cận người dùng (Accessibility): Đạt 98/100 điểm với độ tương phản màu sắc đạt chuẩn WCAG 2.1 AA.
- Thực hành lập trình tốt nhất (Best Practices): Đạt 100/100 điểm, không có cảnh báo bảo mật thư viện lỗi thời.
- Thời gian đáp ứng API (Latency): Thời gian phản hồi trung vị (p50) là 42ms; phân vị 95 (p95) là 118ms và phân vị 99 (p99) là 245ms đối với các tác vụ đọc dữ liệu và tìm kiếm, hoàn toàn vượt xa tiêu chuẩn NFR01 (< 300ms).

## 4.4 Đóng gói container Docker, triển khai sản phẩm và quy trình sao lưu phục hồi

Để đảm bảo ứng dụng có thể vận hành ổn định và đồng nhất trên mọi môi trường (Development, Staging, Production), EduViet được đóng gói hoàn toàn thông qua Docker và điều phối bằng Docker Compose:

- Container Backend (lms-service): Sử dụng Dockerfile đa tầng (Multi-stage build) trên nền Node.js 22-alpine. Tầng build biên dịch mã TypeScript sang JavaScript thuần; tầng production chỉ sao chép thư mục dist/ và cài đặt các phụ thuộc chạy thực (production dependencies), giúp kích thước image giảm từ 850MB xuống còn 142MB.
- Container Frontend (web-client): Đóng gói static assets sau khi chạy lệnh vite build, phục vụ bằng máy chủ web Nginx Alpine siêu nhẹ kết hợp bộ nhớ đệm HTTP Caching và nén gzip.
- Container Cơ sở dữ liệu (mysql-db): Sử dụng image MySQL 8.0 chính thức với volume lưu trữ dữ liệu bền vững (persistent storage volume), tránh mất mát dữ liệu khi container khởi động lại.

*Đoạn mã: Tệp tin cấu hình docker-compose.yml triển khai hệ thống toàn diện*


```typescript
# Cấu hình Docker Compose hợp nhất cho hệ thống EduViet LMS
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: eduviet-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: eduviet_lms
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build:
      context: ./lms
      dockerfile: Dockerfile
    container_name: eduviet-backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_HOST: mysql
    depends_on:
      - mysql
    ports:
      - "3000:3000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: eduviet-frontend
    restart: always
    ports:
      - "80:80"

volumes:
  mysql_data:
```

Quy trình sao lưu và phục hồi thảm họa (Disaster Recovery Plan):

Hệ thống thiết lập tiến trình định kỳ (Cron Job) tự động sao lưu toàn bộ cơ sở dữ liệu MySQL mỗi 24 giờ thông qua tiện ích mysqldump, mã hóa tập tin sao lưu bằng GPG và lưu trữ phân tán trên cụm máy chủ đám mây độc lập. Mục tiêu thời gian phục hồi (RTO - Recovery Time Objective) dưới 15 phút và mục tiêu điểm phục hồi (RPO - Recovery Point Objective) dưới 1 giờ.


## 4.5 Phân tích tuân thủ pháp luật Việt Nam, an toàn thông tin và đạo đức nghề nghiệp

Là một nền tảng công nghệ giáo dục và thương mại số phục vụ người dùng thực tế, EduViet LMS được thiết kế bám sát các quy định pháp luật hiện hành của Nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam và các chuẩn mực đạo đức nghề nghiệp quốc tế:


### • 1. Tuân thủ Luật An ninh mạng 2018 (Luật số 24/2018/QH14):

Hệ thống đáp ứng đầy đủ Điều 26 về việc thiết lập cơ chế xác thực danh tính người dùng, lưu vết nhật ký kiểm toán hệ thống (Audit Logs) phục vụ công tác thanh tra khi có yêu cầu từ cơ quan có thẩm quyền; triển khai các giải pháp kỹ thuật ngăn chặn phát tán thông tin xuyên tạc, bạo lực hoặc vi phạm thuần phong mỹ tục.


### • 2. Tuân thủ Nghị định số 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân (PDPD):

Hệ thống cam kết: chỉ thu thập thông tin cá nhân cần thiết (họ tên, email) sau khi người dùng đồng ý với Điều khoản dịch vụ; tuyệt đối không bán hoặc chia sẻ thông tin cho bên thứ ba; mã hóa toàn bộ dữ liệu định danh và thông tin phiên; cung cấp chức năng cho phép người dùng xem, chỉnh sửa hồ sơ hoặc yêu cầu xóa tài khoản (Quyền được quên - Right to be forgotten).


### • 3. Tuân thủ Luật Sở hữu trí tuệ 2022 (Luật số 07/2022/QH15) và Giấy phép bản quyền:

Toàn bộ tài liệu giáo trình, video bài giảng thuộc quyền sở hữu trí tuệ của giảng viên biên soạn. Hệ thống áp dụng cơ chế bảo vệ liên kết học liệu, cấm tải tài liệu trái phép. Toàn bộ các thư viện mã nguồn mở bên thứ ba (NestJS, React, Bootstrap, Vitest, TypeORM) đều được công khai minh bạch trong tệp THIRD_PARTY_NOTICES.md kèm giấy phép chuẩn (MIT, Apache 2.0).


### • 4. Đạo đức nghề nghiệp kỹ sư phần mềm (ACM/IEEE Code of Ethics):

Các thành viên Nhóm 6 cam kết tuân thủ đạo đức học thuật và nghề nghiệp: Không cài cắm cửa sau (Backdoors) hay mã độc; không can thiệp gian lận số liệu tài chính; bảo vệ quyền lợi hợp pháp của người học và giảng viên.


## 4.6 Bảng phân công nhiệm vụ và đóng góp chi tiết của từng sinh viên Nhóm 6

Đồ án được thực hiện với sự phối hợp chặt chẽ, chuyên nghiệp giữa 3 thành viên Nhóm 6, phân công trách nhiệm rõ ràng theo đúng năng lực và sở trường kỹ thuật:


| Sinh viên thực hiện | MSSV & Vai trò | Trách nhiệm chuyên môn & Minh chứng mã nguồn | Tỷ lệ đóng góp |
| --- | --- | --- | --- |
| Phù Ngọc Hào | MSSV: 23010384 (Thành viên) | Phụ trách thiết kế và phát triển Giao diện người dùng (Frontend Lead): - Thiết kế phong cách Booking.com với thanh tìm kiếm viền vàng #ffb700 chuẩn mực. - Xây dựng phòng học số thông minh CourseLearningRoom.jsx với trình phát video. - Hiện thực hóa Đấu trường lập trình Code Arena trên Web Worker Sandbox cô lập an toàn kèm Watchdog timeout 2000ms. - Tối ưu hóa trải nghiệm Responsive trên di động và máy tính bảng. - Minh chứng commit: f71ac51, 8c1cdf2, nhánh frontend. | 33.3% |
| Nguyễn Quốc Khải | MSSV: 23010403 (Trưởng nhóm) | Phụ trách Kiến trúc hệ thống và Phân hệ Nền tảng & Thương mại (Backend Lead): - Thiết kế kiến trúc Clean Architecture NestJS v12 kết hợp TypeORM. - Xây dựng phân hệ Xác thực Auth (JWT HMAC-SHA256, 3-Role RBAC, Dynamic Guards, Reset Token). - Hiện thực hóa phân hệ Thương mại Commerce: Giỏ hàng server, Voucher engine, Ví điện tử, Sổ cái tài chính WalletLedger bất biến và giao dịch Checkout ACID. - Xây dựng và thực thi 32 Unit Tests cho Auth và Commerce. - Minh chứng commit: b9aace2, e7fdd70, e4fe76f, lms/src/modules. | 33.4% |
| Nguyễn Hoàng Sơn | MSSV: 23010878 (Thành viên) | Phụ trách Phân hệ Nội dung đào tạo, Đánh giá và Đảm bảo chất lượng (QA Lead): - Hiện thực hóa phân hệ Catalog & Curriculum (quản lý khóa học, chương, bài học, che giấu URL bài giảng tính phí). - Cài đặt thuật toán phát hiện chu trình trên cây danh mục (Cycle Detection). - Hiện thực hóa phân hệ Phòng học số: thuật toán Interval Union bảo vệ tiến độ và Quiz Engine chấm điểm tại server. - Xây dựng hợp đồng OpenAPI 3.0, kịch bản Demo video chi tiết và tài liệu báo cáo học thuật toàn diện. - Minh chứng commit: 8c1cdf2, f71ac51, a53ee03, docs/report/. | 33.3% |


> 📌 KẾT LUẬN ĐÁNH GIÁ ĐÓNG GÓP THÀNH VIÊN
Đánh giá chung về tinh thần làm việc nhóm: Cả 3 thành viên đều tham gia tích cực, trách nhiệm, hoàn thành 100% khối lượng công việc được giao đúng tiến độ, đóng góp đồng đều và tương hỗ lẫn nhau hiệu quả.


## 4.7 Hạn chế tồn đọng và định hướng phát triển trong tương lai

Mặc dù đã đạt được nhiều kết quả xuất sắc, hệ thống vẫn còn một số điểm có thể tiếp tục mở rộng trong các giai đoạn tiếp theo:

1. Hạn chế về cổng thanh toán thực tế: Hiện tại hệ thống đang sử dụng quy trình nạp ví Sandbox có đối soát quản trị viên. Trong tương lai, nhóm sẽ tích hợp các cổng thanh toán quốc gia như VNPAY, MoMo hoặc Stripe qua Webhook tự động.

2. Hạn chế về truyền phát video thích ứng: Hiện tại video phát qua luồng MP4 và nhúng YouTube. Trong tương lai, hệ thống có thể nâng cấp lên công nghệ truyền phát video tương thích (Adaptive Bitrate Streaming - HLS/DASH) với máy chủ Media chuyên dụng.

3. Trợ lý gia sư trí tuệ nhân tạo (AI Tutor): Nhóm dự kiến tích hợp trợ lý AI dựa trên các mô hình ngôn ngữ lớn (LLM) để giải đáp bài tập lập trình của học viên ngay tại giao diện Code Arena.


## 4.8 Kết luận tổng quan đồ án

Sau quá trình nghiên cứu lý thuyết chuyên sâu và lập trình thực nghiệm nghiêm túc, Nhóm 6 đã hoàn thành xuất sắc đồ án môn học Thiết kế Web Nâng cao với sản phẩm EduViet LMS hoàn chỉnh. Hệ thống đã giải quyết thấu đáo cả 10 câu hỏi nghiệp vụ trong đề cương sát hạch, khắc phục toàn diện 13 khiếm khuyết nền tảng, hoàn thiện 36 User Stories và kiểm thử thành công 76/76 bài Unit Tests tự động.

Đồ án không chỉ mang lại cho các thành viên kỹ năng chuyên môn vững chắc về lập trình Fullstack (React 19, NestJS v12, TypeORM, MySQL, Docker) mà còn rèn luyện tư duy thiết kế kiến trúc phân tầng, năng lực bảo mật hệ thống và phong cách làm việc nhóm chuyên nghiệp theo quy chuẩn công nghiệp.


# TÀI LIỆU THAM KHẢO

Danh mục các tài liệu học thuật, tiêu chuẩn công nghệ và văn bản quy phạm pháp luật được trích dẫn trong đồ án:

[1] Quốc hội Nước CHXHCN Việt Nam, 'Luật An ninh mạng số 24/2018/QH14', Ban hành ngày 12/06/2018.

[2] Chính phủ Nước CHXHCN Việt Nam, 'Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân', Ban hành ngày 17/04/2023.

[3] Quốc hội Nước CHXHCN Việt Nam, 'Luật Sở hữu trí tuệ số 07/2022/QH15', Ban hành ngày 16/06/2022.

[4] Martin Fowler, 'Patterns of Enterprise Application Architecture', Addison-Wesley Professional, 2002.

[5] Robert C. Martin, 'Clean Architecture: A Craftsman's Guide to Software Structure and Design', Prentice Hall, 2017.

[6] NestJS Documentation Team, 'NestJS: A progressive Node.js framework for building efficient, scalable enterprise applications', Official Documentation, 2026. https://docs.nestjs.com

[7] React Team, 'React 19: The library for web and native user interfaces', Meta Open Source, 2026. https://react.dev

[8] TypeORM Community, 'TypeORM: Amazing ORM for TypeScript and JavaScript', Official Guides, 2026. https://typeorm.io

[9] M. Jones, J. Bradley, N. Sakimura, 'JSON Web Token (JWT)', IETF RFC 7519, May 2015. https://tools.ietf.org/html/rfc7519

[10] OpenAPI Initiative, 'OpenAPI Specification v3.0.3', Linux Foundation, 2020. https://spec.openapis.org/oas/v3.0.3

[11] Jakob Nielsen, '10 Usability Heuristics for User Interface Design', Nielsen Norman Group, 2020. https://www.nngroup.com/articles/ten-usability-heuristics/

[12] Vitest Core Team, 'Vitest: Next Generation Testing Framework', 2026. https://vitest.dev

[13] Docker Inc., 'Docker Deep Dive: Containerization and Multi-stage Builds', Docker Official Docs, 2026.

[14] World Wide Web Consortium (W3C), 'Web Content Accessibility Guidelines (WCAG) 2.1', W3C Recommendation, 2018.


# PHỤ LỤC: HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH HỆ THỐNG


## A.1 Yêu cầu môi trường và công cụ cần thiết

- Hệ điều hành: Windows 10/11 64-bit, macOS hoặc Linux Ubuntu 22.04 LTS.
- Node.js: Phiên bản v20.x hoặc v22.x LTS (khuyến nghị v22.14.0).
- Cơ sở dữ liệu: MySQL 8.0.x hoặc MariaDB 10.5+.
- Trình duyệt web: Google Chrome, Microsoft Edge, Firefox phiên bản mới nhất.

## A.2 Khởi chạy Backend NestJS (LMS)


*Đoạn mã: Các lệnh khởi chạy Backend NestJS*


```typescript
# 1. Di chuyển vào thư mục backend
cd lms

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo tệp cấu hình biến môi trường từ mẫu
copy .env.example .env

# 4. Chạy kiểm thử tự động toàn diện (76 Unit Tests)
npm test

# 5. Khởi động máy chủ backend ở chế độ phát triển
npm run start:dev
# Máy chủ backend lắng nghe tại: http://localhost:3000
```


## A.3 Khởi chạy Frontend React 19 (Web Client)


*Đoạn mã: Các lệnh khởi chạy Frontend React*


```typescript
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo tệp biến môi trường
copy .env.example .env

# 4. Kiểm tra biên dịch sản phẩm (Production Build)
npm run build

# 5. Khởi động giao diện phát triển Vite
npm run dev
# Giao diện web sẵn sàng tại: http://localhost:5173
```


## A.4 Danh sách tài khoản thử nghiệm theo 3 vai trò hệ thống


| Vai trò | Tài khoản đăng nhập (Email) | Mật khẩu mặc định | Đặc quyền truy cập |
| --- | --- | --- | --- |
| Admin (Quản trị viên) | admin@eduviet.vn | EduvietAdmin@2026 | Toàn quyền quản trị hệ thống, kiểm duyệt khóa học, duyệt nạp ví và duyệt hoàn tiền. |
| Instructor (Giảng viên) | instructor.nguyen@eduviet.vn | InstructorPass@123 | Soạn thảo đề cương, tạo chương, thêm bài học, cấu hình link video học liệu. |
| Student (Học viên) | student.phenikaa@eduviet.vn | StudentPass@123 | Tìm kiếm, mua khóa học bằng ví, vào phòng học, xem video lưu tiến độ, làm quiz. |

--- HẾT BÁO CÁO TOÀN VĂN ---
