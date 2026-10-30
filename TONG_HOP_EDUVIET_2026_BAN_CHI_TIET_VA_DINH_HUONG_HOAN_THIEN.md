# EDUVIET 2026 — TỔNG HỢP HIỆN TRẠNG, ĐẶC TẢ CHI TIẾT VÀ HƯỚNG HOÀN THIỆN

**Ngày biên soạn:** 30/10/2026.  
**Tài liệu gốc:** `TONG_HOP_THAY_DOI_VA_TINH_NANG_EDUVIET_2026.md`.  
**Repo:** [nguyenkhai05/nhom6-N01-26](https://github.com/nguyenkhai05/nhom6-N01-26).  
**Bản mã cục bộ được đọc:** `C:/Users/nuicu/vibe_coder/nhom6-N01-26-main`.  
**Commit HEAD quan sát:** `31549af` — `docs: add comprehensive markdown report summarizing all new features, architecture and Google OAuth enhancements`.

## 1. Mục đích và cách đọc

Bản này viết lại nội dung tổng hợp để dùng đồng thời cho **định hướng sản phẩm, giao AI triển khai và chuẩn bị báo cáo**. Không chỉ liệt kê tên menu: mỗi mục được làm rõ về màn hình, hành vi, dữ liệu, quản trị, tình huống lỗi và điều kiện nghiệm thu.

Giữ nguyên bản gốc để đối chiếu. Bản mới **không tự nhận mọi chức năng mô tả đã hoàn thành**.

### 1.1 Phân biệt ba loại thông tin

| Nhãn | Ý nghĩa | Có thể kết luận gì? |
| --- | --- | --- |
| Theo tổng hợp gốc | Nội dung/số liệu được tệp người dùng cung cấp ghi nhận | Là thông tin lịch sử của dự án, cần bằng chứng tương ứng trước khi dùng như kết quả kiểm định. |
| Quan sát mã nguồn | Đọc trực tiếp các tệp liên quan trong repo cục bộ ở commit trên | Xác nhận được cấu trúc/nhánh xử lý trong mã; chưa chứng minh mọi trường hợp chạy thực tế. |
| Thiết kế đích/đề xuất | Chi tiết hóa hoặc bổ sung cho giai đoạn tiếp theo | Là yêu cầu để triển khai, không phải tính năng đã nghiệm thu. |

**Phạm vi kiểm tra lần này:** đọc tệp tổng hợp, Git HEAD, một số component/service/controller và test liên quan. Chưa host lại, chưa chạy lại 109 tests, chưa kiểm thử toàn app hoặc xác nhận hai cổng local đang hoạt động.

**Các mục 5–15 bên dưới chủ yếu mô tả thiết kế đích.** Khi dùng làm báo cáo kết quả, chỉ chuyển những phần đã có bằng chứng sang trạng thái “đã thực hiện”; các phần khác giữ ở kế hoạch/hạn chế.

### 1.2 Mức ưu tiên

- **P0 — Điều kiện nền:** xác thực thật, quyền truy cập, chấm đúng, dữ liệu không mất/lộ. Xử lý trước khi mở rộng hoặc công bố sẵn sàng vận hành.
- **P1 — Hoàn thiện sáu mục chính:** tác vụ chạy trọn vẹn, lưu thật, có quản trị và test.
- **P2 — Cải thiện sau:** cá nhân hóa, thông báo, ôn tập tinh gọn, biên tập nội dung thuận tiện hơn.

Không thêm mục menu mới chỉ để tăng số chức năng. Tập trung hoàn thiện các mục đã xuất hiện trên website.

## 2. Định hướng sản phẩm và phạm vi giữ lại

EduViet là **nền tảng bán khóa học lập trình, có học thử, học chính thức và thực hành**. Hành trình chính:

> Tìm/chọn khóa → học thử → mua/nhận quyền hợp lệ → học tiếp và luyện tập → hỏi đáp/nhận hỗ trợ → theo dõi kết quả.

Giữ các quyết định hiện tại:

1. **Sáu mục chính:** Khóa học, Học thử, Luyện tập, Chọn khóa phù hợp, Cộng đồng & Bài viết, Hỗ trợ.
2. **Góc học tập của tôi** phục vụ học viên đăng nhập, có Học tiếp dễ thấy.
3. **Combo ưu đãi** tiếp tục ở thông báo trang chủ/modal hiện có; không tạo thêm tab Combo hay sàn combo riêng.
4. Không đưa **Lộ trình** và **Tài liệu** trở lại menu chính. File trong bài nếu đã có vẫn theo quyền khóa; OpenAPI/README/tài liệu kỹ thuật vẫn phải giữ.
5. React và **react-bootstrap** ở frontend; NestJS phân lớp, TypeORM/MySQL ở backend. Tham khảo Codecademy về trải nghiệm thực hành, duy trì phần nhận diện/mẫu Booking cần cho học phần.
6. Giữ các nghiệp vụ đã có như ví, giỏ hàng, payment, enrollment, bài dự án và quyền giảng viên; mở rộng qua cùng nguồn dữ liệu, không tạo bản sao ở frontend.

Việc Cộng đồng được khôi phục trong tệp tổng hợp mới được tôn trọng. Không áp lại đề xuất năm menu của bản MD trước để tự gỡ mục này.

## 3. Hiện trạng cần diễn đạt lại cho chính xác

Đây là các điểm đọc được ở mã hiện tại, **không phải một đợt khai thác lỗ hổng hoặc test runtime mới**. Đường dẫn/dòng áp dụng ở bản đã đọc, có thể đổi khi AI sửa.

| Mã | Quan sát cụ thể | Tác động tới cách viết và hướng hoàn thiện |
| --- | --- | --- |
| HT01 | `lms/src/auth/auth.service.ts:100–147` nhận email trực tiếp; nếu có id_token thì đọc payload base64, chưa thấy xác minh chữ ký/audience/issuer/expiry trong luồng này | Không gọi đây là Google OAuth hoàn chỉnh/an toàn. Luồng nhận email chưa chứng minh quyền sở hữu tài khoản; ưu tiên sửa P0. |
| HT02 | `frontend/src/components/AuthModal.jsx:133–152` gửi email/tên tự nhập rồi đặt `walletBalance: 1000000` phía frontend ở luồng register | Không coi số dư hiển thị là ledger khuyến mại đã ghi ở server; không phát hành tiền/voucher từ client. |
| HT03 | `InteractiveTrialPage.jsx:119–159` kiểm tra bài bằng từ khóa rồi gán `actual` bằng `expected_output` | Đây là kiểm tra mô phỏng theo chuỗi, chưa phải chạy từng test case để chấm thực tế; P0 sửa bộ chấm. |
| HT04 | `InteractiveTrialPage.jsx:68–112` chạy JavaScript trong Worker, timeout 3.000 ms; tổng hợp gốc ghi 2.000 ms | Chốt cấu hình thật và thống nhất UI/FAQ/docs/test. Worker không có DOM không đồng nghĩa bị cấm mạng và mọi storage. |
| HT05 | `lms/src/trial/trial.service.ts` chứa bài Python/Dockerfile nhưng runner được đọc là JavaScript; `findOne` trả cả object trial có solution_code | Cần adapter/loại bài đúng runtime; quy tắc tiết lộ lời giải rõ, không dùng endpoint public như đáp án kín của bài thi. |
| HT06 | `lms/src/help/help.service.ts:53–87` push ticket vào mảng RAM và trả mã; chưa có lưu DB trong nhánh này | Tạo mã không đủ để coi là helpdesk theo dõi được; cần persist, list/detail/reply/status/ownership. |
| HT07 | `lms/src/community/community.service.ts:78–157` đọc/ghi `INITIAL_COMMUNITY_POSTS`; có inject repository nhưng tác vụ được đọc vẫn dùng mảng | Thảo luận hiện cần chuyển sang nguồn bền vững, có pagination và workflow đầy đủ. |
| HT08 | Community `acceptReply` dùng `currentUserId !== 1` như điều kiện admin; `reportContent` chỉ trả object thành công | Dùng role/policy thật, lưu report và có hàng chờ xử lý; không dùng ID 1 như bằng chứng quyền admin. |
| HT09 | `MyLearningDashboard.jsx:14–16,66–76` có fallback khóa đầu tiên và các giá trị 14:20, Bài 3, 42% cố định; danh sách điểm yếu cũng có nội dung tĩnh | Không coi dashboard là kết quả cá nhân thực tế; cần API enrollment/progress/attempt thật và empty state. |
| HT10 | `course-finder.service.ts` gợi ý theo các course_id cố định; canTry là danh sách ID; có fallback old_price = price ×1,3 | Chuyển sang metadata/tags/preview thật. Không tự tạo giá gạch ngang; khảo sát quỹ thời gian cần tác dụng rõ hoặc ghi là tham khảo. |
| HT11 | Tệp unit mới dùng mock repository và kiểm tra metadata/config/tạo ticket; frontend package chưa có script test trong phần đọc | 109/109 là số pass được tổng hợp gốc báo, không phải coverage 100% hoặc bằng chứng các luồng browser/DB đã đạt. |
| HT12 | Bài viết có repository và fallback `INITIAL_ARTICLES` trong article service | Phải phân biệt dữ liệu DB và fallback demo; không kết luận toàn bộ Bài viết đã/ chưa lưu DB chỉ từ việc thấy entity. Cần test từng thao tác. |

### 3.1 Những câu không nên giữ nguyên như kết luận

- “Đăng nhập Google bằng bất kỳ email tự nhập” không thay được xác thực với Google.
- “Web Worker cách ly hoàn toàn cookie/token/toàn bộ trình duyệt” vượt quá căn cứ hiện có. MDN nêu Worker còn dùng được network APIs và một số storage. [MDN — Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).
- “109 tests passed (100%)” chỉ có thể nghĩa 109/109 bài được chạy đạt trong lần có log; không tự suy ra coverage/tỷ lệ hoàn thiện 100%.
- “Build không có lỗi TypeScript” không được suy ra chỉ từ `vite build` nếu chưa có bước type-check phù hợp.
- “Máy chủ đang ổn định 200 OK” phải gắn thời điểm/probe thật; không sao chép kết quả lịch sử thành trạng thái hiện tại.
- “Hoàn tiền 7 ngày”, “trọn đời”, “phản hồi 2–4 giờ”, “ưu đãi 22%”, “tặng 1 triệu” cần chính sách/cấu hình/quy trình thật. Chưa có thì mô tả là cam kết cần đối chiếu, không tự xác nhận đã đáp ứng.

## 4. Điều hướng, trang chủ và nguyên tắc giao diện chung

### 4.1 Bản đồ điều hướng

| Mục | Route hiện được mô tả | Trang con cần rõ | Hành động chính |
| --- | --- | --- | --- |
| Khóa học | `/courses` | Danh sách, chi tiết, so sánh, học thử liên quan | Chọn/xem/mua hoặc Vào học. |
| Học thử | `/try` | Danh sách bài, workspace, phản hồi | Bắt đầu, chạy, kiểm tra, xem khóa đầy đủ. |
| Luyện tập | `/practice` | Kho bài, sửa lỗi, assessment/phỏng vấn, ôn tập | Chọn kỹ năng, làm bài, xem kết quả, ôn lại. |
| Chọn khóa phù hợp | `/find-course` | Form nhu cầu, kết quả có lý do, bảng so sánh | Gợi ý, sửa điều kiện, so sánh, học thử. |
| Cộng đồng & Bài viết | `/community` | Tab Bài viết/Hỏi đáp, trang chi tiết, soạn bài | Đọc, tìm, hỏi/trả lời, lưu, báo cáo. |
| Hỗ trợ | `/help` | FAQ, tạo yêu cầu, yêu cầu của tôi, chi tiết thread | Tìm hướng dẫn, gửi/theo dõi/phản hồi ticket. |
| Góc học tập | `/my-learning` | Đang học, hoàn thành, luyện tập, phản hồi | Học tiếp và xử lý việc đang dở. |

Giữ route đang hoạt động hoặc mapping có migration; đường dẫn con chưa có trong repo là yêu cầu bổ sung. Header sáu mục nên dùng hai hàng trên desktop nếu cần, mobile Offcanvas, không thu nhỏ chữ để nhồi tất cả vào một hàng.

### 4.2 Trang chủ chi tiết hơn nhưng gọn

1. Combo announcement hiện có; có khả năng mở chi tiết và tôn trọng trạng thái ẩn.
2. Hero: thông điệp bán khóa + CTA Khám phá/Học thử; khách chưa biết chọn có link `/find-course`.
3. Năm thẻ truy cập nhanh như bản hiện tại: khóa học, học thử, luyện tập, chọn khóa, cộng đồng. Hỗ trợ vẫn dễ tìm ở header/footer, không bắt buộc đủ sáu thẻ.
4. Khóa nổi bật từ dữ liệu thật, tiêu chí chọn được cấu hình.
5. Bài học thử tiêu biểu và ví dụ tương tác thật.
6. Bài luyện/sửa lỗi có nội dung xuất bản; không bịa số người đã làm.
7. Bài viết và câu hỏi đã giải đáp được duyệt; tách dữ liệu mẫu khỏi thống kê thật.
8. Liên hệ/hỗ trợ, điều khoản, riêng tư, thông tin nhóm/đơn vị theo phạm vi triển khai.

Học viên đăng nhập thấy Học tiếp gần đầu trang. Bố cục giữ hệ màu/nav/search đang dùng và React Bootstrap; không thay framework để “làm đẹp”.

### 4.3 Chuẩn cho mọi màn hình

- Loading, empty, error/retry, permission denied, success có tác dụng thật; không chỉ console.log khi API lỗi.
- URL giữ tab/filter/ID cần chia sẻ; refresh/Back/Forward đúng. Nội dung chính không chỉ mở trong modal không có link.
- Form có label, validation tại trường, trạng thái gửi, chặn bấm lặp và retry phù hợp.
- Keyboard/focus, tương phản, tiếng Việt, mobile; nút nổi không che play/chạy code/gửi form.
- Test ở 360,390,768,1280,1920 px; số liệu giao diện đều có nguồn dữ liệu hoặc nhãn demo.

## 5. Mục chính 1 — Khóa học

### 5.1 Mục tiêu và màn hình

Người dùng biết **khóa dạy gì, cần biết gì, ai dạy, thực hành ra sao, giá và quyền lợi thực tế**, rồi mua hoặc vào học đúng trạng thái.

**Danh sách:** search tên/mô tả/tags; filter chủ đề, level, giảng viên, khoảng giá; sort mới nhất/giá. Server pagination, đếm kết quả và bỏ từng filter. Không thêm filter không có dữ liệu.

**Card:** ảnh, tên, mô tả ngắn, level, giảng viên thật, thời lượng có nguồn, giá hiện tại, review có căn cứ, nút so sánh/học thử. Chưa có review hiện “Chưa có đánh giá”. Không tự dựng old_price.

**Chi tiết:** Tổng quan → Học được gì → Đầu vào → Giáo trình → Giảng viên → Đánh giá → FAQ khóa. Khối giá/CTA rõ, có Hỏi về khóa này và preview đúng bài. Giáo trình công khai chỉ trả trường được phép; nội dung trả phí kiểm tra enrollment.

### 5.2 Trạng thái CTA

| Người dùng/khóa | CTA chính | Phản ứng đúng |
| --- | --- | --- |
| Khách, còn bán | Đăng ký học/Thêm giỏ | Giữ ngữ cảnh qua login, server báo giá. |
| Học viên chưa mua | Mua khóa | Kiểm tra quote/payment, không tự cấp quyền frontend. |
| Đã có quyền | Vào học/Học tiếp | Backend xác minh quyền, mở đúng khóa/bài. |
| Khóa draft/private | Không public | Không lọt search/so sánh/gợi ý/học thử trái chính sách. |
| Khóa ngừng bán | Xem thông tin hoặc không tìm thấy theo policy | Không tạo order mới; người đã có quyền xử lý theo chính sách công bố. |

### 5.3 Quản trị và dữ liệu

- Course metadata phải soạn được: mục tiêu, prerequisites, tags, level, ngôn ngữ/runtime, thời lượng, giảng viên, quyền lợi và policy version.
- Giáo trình draft/review/published/archive, ownership giảng viên, validator mốc video và tài nguyên như hệ thống đang có.
- Chỉnh giá không đổi snapshot order cũ. Xóa/ẩn khóa không làm mất dữ liệu người đã mua ngoài quy trình hợp lệ.

### 5.4 Bổ sung thực tế

- **Đã xem gần đây:** lưu danh sách ID ở client nếu chỉ là tiện ích; dữ liệu giá/quyền lấy mới từ server.
- **Cập nhật nội dung gần nhất:** từ changelog thật, không tự đổi ngày mỗi lần sửa trang quảng cáo.
- **Hỏi trước mua:** tạo ticket gắn courseId; không yêu cầu người học tự ghi lại tên/mã khóa.

### 5.5 Nghiệm thu

Từ khóa không tồn tại trả rỗng; nhiều filter hoạt động cùng nhau; URL khôi phục bộ lọc; khóa draft không public; giá UI/quote đúng; người đã mua không bị dụ mua lại; card không fake rating/giảng viên; mất mạng có retry và không mất giỏ.

## 6. Mục chính 2 — Học thử tương tác

### 6.1 Cấu trúc trải nghiệm

**Danh sách:** bài thử theo chủ đề/level/runtime/khóa; mỗi bài có đầu ra, thời gian ước lượng, dạng bài và liên kết khóa liên quan.

**Workspace desktop:** Hướng dẫn/gợi ý → Editor → Kết quả/test. Mobile dùng tabs, giữ editor draft khi chuyển tab. Có tên bài, runtime/version, trạng thái lưu, Chạy, Dừng, Kiểm tra, Khôi phục mẫu.

**Kết thúc:** tóm tắt làm được gì, test nào đạt/chưa đạt, giải thích theo policy, Xem khóa đầy đủ/Học tiếp bài thử khác. Modal chúc mừng là tùy chọn, không được che mất kết quả hoặc xuất hiện khi chỉ có từ khóa hợp lệ.

### 6.2 Phân biệt Chạy và Kiểm tra

- **Chạy:** thực thi code và trả stdout/stderr/lỗi thật. Không có lỗi runtime không đồng nghĩa giải đúng đề.
- **Kiểm tra:** gọi đúng entry function với từng input, thu actual thật, so sánh bằng comparator của đề và trả từng case.
- Không gán `actual = expected`, không coi có `return`, dấu `+` hoặc `find` là đã đúng.
- Test public cho học thử có thể được công khai; hidden tests/answer key của assessment phải theo quy tắc khác, không dùng chung DTO phát hết đáp án.
- Nếu có Xem lời giải, công bố điều kiện và đánh dấu lượt xem khi cần; không gọi lời giải đã gửi sẵn về browser là bí mật.

### 6.3 Runtime và an toàn

| Dạng bài | Cách đáp ứng thực tế | Không nhận nhầm |
| --- | --- | --- |
| JavaScript thuần | Runner JS có timeout/output limit, input có cấu trúc, lỗi rõ | Không phải Node.js/NestJS runtime. |
| HTML/CSS/JS giao diện | Iframe tách quyền phù hợp và kiểm chứng cách ly | Worker JS không tự render React/DOM. |
| React component | Adapter có JSX/render/test hoặc bài mô phỏng được ghi đúng | Hàm trả chuỗi không phải bằng chứng đã render component React. |
| Python/SQL | Adapter đúng ngôn ngữ hoặc bài quiz/mô phỏng có nhãn | Không đưa Python vào new Function JS rồi báo môi trường hỗ trợ Python. |
| Dockerfile/NestJS hạ tầng | Bài đọc/sửa cấu hình với validator rõ, hoặc môi trường chuyên dụng | Không nhận đã build container/chạy Nest nếu chỉ kiểm tra text. |

- Chốt timeout bằng config; bản đọc hiện là 3.000 ms trong trial frontend, không giữ số 2.000 ms trong report nếu chưa đổi implementation.
- Worker tách luồng và thiếu DOM trực tiếp nhưng vẫn có API khác. Thiết kế boundary origin/CSP/network/message để không truy cập phiên/token/API nội bộ; test thực tế thay vì suy ra từ tên Sandbox.
- Có runId, bỏ kết quả run cũ, cleanup worker/blob/timer khi chuyển bài/unmount, handle onerror/messageerror, truncate output, terminate khi Dừng/timeout.
- Không gửi token app vào runner. Kết quả luyện client không là nguồn cấp điểm có giá trị nghiệp vụ nếu chưa có chấm server đáng tin.

### 6.4 Lưu và chuyển tiếp

- Khách có draft tạm có version/TTL; trước khi gắn vào account phải xác nhận đúng phiên/ngữ cảnh, không trộn với người đăng nhập trước.
- User đăng nhập lưu draft/attempt server theo owner và trialVersion; không dùng chung khóa demo.
- Học thử không tự tạo enrollment. Nếu policy cho chuyển kết quả thử sang bài thật, phải map lesson/version và chỉ áp sau kiểm tra quyền; không tự cộng hoàn thành toàn khóa.
- Đổi bài có draft chưa lưu cần flush/cảnh báo phù hợp; lỗi mạng hiện trạng thái, không báo đã lưu giả.

### 6.5 Nội dung/quản trị và nghiệm thu

Giảng viên quản lý bài thử gắn khóa mình, hướng dẫn, hints, entry point, sample input/output, test cases, comparator và runtime. Validator không cho publish đề thiếu bộ chấm tương ứng; lời giải mẫu phải được chạy qua test.

Nghiệm thu bằng **hai lời giải đúng khác cách viết và ít nhất ba lời giải sai** cho một đề; có code đúng cú pháp nhưng sai logic, loop timeout, throw, output lớn, đổi bài nhanh, Python chưa có adapter và truy cập dữ liệu app từ runner. Kết quả trong report chỉ ghi sau khi chạy.

## 7. Mục chính 3 — Luyện tập, sửa lỗi và đánh giá

### 7.1 Các tab đề xuất

1. **Theo kỹ năng:** tags, level, loại bài, chưa làm/đang làm/đã đạt, miễn phí/theo quyền khóa.
2. **Sửa lỗi:** đoạn lỗi có tình huống, hành vi mong muốn, ràng buộc và test; không chỉ một ô code không biết cần sửa gì.
3. **Kiểm tra & phỏng vấn:** bộ đề theo chủ đề, thời gian/lượt làm/ngưỡng đạt công bố.
4. **Ôn tập của tôi:** từ lịch sử sai/chưa đạt, tạo phiên luyện mới.

Nếu đã có thử thách tuần thì giữ trong module này, không bắt buộc xây thêm leaderboard/phần thưởng. Nội dung phụ thuộc runtime hiện có.

### 7.2 Bài sửa lỗi cần chi tiết ra sao?

Ví dụ async/await trong forEach cần: dữ liệu đầu vào, tác vụ bất đồng bộ giả lập xác định, output mong đợi, test có kiểm soát thời gian, nhiều cách sửa hợp lệ. Không dùng delay ngẫu nhiên làm kết quả test chập chờn.

Ví dụ React mutation cần: state ban đầu, hành vi cập nhật, tiêu chí giữ reference đúng/không mutation, môi trường test phù hợp. Nếu chỉ mô phỏng hàm JS, nhãn bài phải phản ánh điều đó; không nói đã kiểm tra re-render thật.

Mỗi bài có skill tags, error explanation, hints và solution version. Không chấm bằng so toàn bộ mã nguồn với một đáp án mẫu.

### 7.3 Assessment và đề phỏng vấn

- Bắt đầu tạo attempt gắn user/version, server time, thời hạn và số lần được phép.
- Question DTO trước nộp không có answer key. Nộp idempotent; score/trạng thái do server quyết định.
- Điểm = tổng trọng số đạt/tổng trọng số hợp lệ ×100; chặn tổng trọng số 0; quy tắc làm tròn thống nhất, điểm luôn 0–100.
- Hết thời gian, reconnect, refresh, submit lại và đề đổi giữa lượt làm có hành vi được định nghĩa.
- Trả giải thích theo policy, kết quả theo kỹ năng và đề xuất ôn. Chỉ gọi “bộ kiểm tra theo tiêu chí của EduViet”, không khẳng định đo lường chuẩn hóa nghề nghiệp khi chưa có căn cứ.

### 7.4 Radar điểm yếu có dữ liệu

- Tính theo skill tags và các lượt hợp lệ trong khoảng thời gian cấu hình; nêu mẫu số/cỡ mẫu. Người mới chưa đủ dữ liệu hiện “Chưa đủ dữ liệu đánh giá”.
- Tách luyện thử nhiều lần với đánh giá phiên bản; không gọi kỹ năng yếu vì một lần bấm sai hoặc vì dữ liệu demo có sẵn.
- Đồ thị radar chỉ là tùy chọn; danh sách kỹ năng + số lần làm + tỷ lệ + bài gợi ý thường dễ đọc hơn.
- Ôn tập tạo lượt mới và giữ lịch sử; nội dung gợi ý ưu tiên quyền học đã có, không gắn mọi lỗi thành lời mời mua khóa đắt hơn.

### 7.5 Quản trị và nghiệm thu

Người soạn quản lý tags, đề, đáp án, comparator, version và trạng thái publish. Có kiểm tra lời giải mẫu, cơ chế sửa đề sai và bảo toàn kết quả cũ.

Test score 0/một phần/100, submit lặp, hết hạn, đổi version, không đủ quyền, giả userId/score, trùng khoảng học, draft hai tài khoản, code đúng/sai cùng chứa từ khóa. Không để chỉ kiểm tra metadata thay cho test nghiệp vụ chấm bài.

## 8. Mục chính 4 — Chọn khóa phù hợp và so sánh

### 8.1 Form nhu cầu

Giữ bốn nhóm hiện tại: mục tiêu, kiến thức nền, ngân sách, quỹ thời gian. Render từ config published; catalog chưa có nhóm AI hoặc công nghệ nào thì không tạo lựa chọn dẫn tới kết quả giả.

- Có Chưa xác định khi phù hợp; giữ dữ liệu khi sửa lựa chọn.
- Ngân sách phân biệt **giới hạn bắt buộc** và **mong muốn linh hoạt**. UI nói rõ để người dùng hiểu vì sao có khóa vượt khoảng dự kiến.
- Quỹ thời gian chỉ dùng khi có metadata workload đáng tin; nếu chỉ thu để tham khảo thì ghi rõ, không giả có ảnh hưởng ranking.
- Khách dùng được không cần để lại contact; muốn lưu vào account cần xác thực và lựa chọn lưu.

### 8.2 Quy tắc gợi ý dựa metadata

1. Lọc khóa published/còn bán theo visibility, điều kiện bắt buộc và budget_mode.
2. So goal với tags/mục tiêu của khóa, prerequisite required/recommended với thông tin tự khai.
3. Xếp hạng theo rule version; tie-break ổn định, không phụ thuộc khóa mang ID 1/2/4.
4. Lấy tối đa ba kết quả; mỗi kết quả có lý do, điều kiện thiếu, tiêu chí khớp/chưa khớp và học thử thật.
5. Không có kết quả thì cho sửa điều kiện/hỏi tư vấn, không ép mọi input ra một khóa.

Thêm khóa mới phải tham gia gợi ý bằng metadata, không cần sửa danh sách course_id trong service. canTry dựa trial/lesson published liên quan; giá gạch ngang chỉ có khi nguồn giá/chính sách cho phép.

### 8.3 Bảng so sánh

Tối đa ba khóa, chống trùng, bỏ/thêm dễ; giữ lựa chọn qua route khi phù hợp. So: giá, level, prerequisite, đầu ra, thời lượng có nguồn, dạng thực hành, runtime/ngôn ngữ, giảng viên và quyền học.

Mobile chọn hai cột hoặc lần lượt từng khóa, có nhãn tiêu chí cố định; không ép bảng rộng gây cắt. Người đã sở hữu có Vào học. Draft/ngừng bán xử lý theo policy, không để endpoint compare làm lộ nội dung private.

### 8.4 Quản trị và nghiệm thu

Admin/giảng viên được phân quyền cập nhật metadata; admin publish rules, có version/audit và bộ case regression. Cho xem preview một bộ input trước khi áp rule mới.

Test khóa mới ID bất kỳ vẫn được gợi ý; ngân sách strict/flexible; người mới với khóa advanced; thiếu metadata; quỹ thời gian rỗng; không có khóa phù hợp; IDs so sánh trùng/sai/quá ba; route compare không bị hiểu như `:id`; không tự sinh giá cũ ×1,3.

## 9. Mục chính 5 — Cộng đồng & Bài viết

Đây là phần cần bổ sung rõ nhất so với tổng hợp gốc. Giữ hai tab với mục đích khác nhau, dùng chung tìm kiếm/navigation khi hợp lý nhưng có quyền và workflow riêng.

### 9.1 Tab Hỏi đáp

**Danh sách:** tìm tiêu đề/nội dung, filter chuyên mục/tag/chưa giải đáp, sort mới nhất/cập nhật; pagination server. Card có tác giả hiển thị, tiêu đề, tags, thời gian, reply count và trạng thái giải đáp; không fake lượt xem/like seed thành số thật.

**Chi tiết có URL:** nội dung câu hỏi, code block an toàn, câu trả lời, nhãn accepted, bài liên quan nếu có. Có Trả lời, Theo dõi/Lưu và Báo cáo. Nếu vẫn dùng modal đọc nhanh, phải có link tới trang chi tiết.

**Tạo/sửa câu hỏi:** đăng nhập, nhập tiêu đề rõ, chuyên mục, mô tả, ví dụ code/lỗi, điều đã thử và tags; validate độ dài. Draft cá nhân không public; tác giả sửa được theo quy tắc và có dấu đã chỉnh sửa.

**Câu trả lời:** đúng post, rate limit, edit own, feedback rõ; chỉ tác giả câu hỏi hoặc staff được policy cho phép mới chọn accepted. Reply phải thuộc post, một accepted hiện hành; có thể đổi/rút khi phù hợp và lưu lịch sử cần thiết.

### 9.2 Tab Bài viết

**Nội dung:** bài kinh nghiệm, giải thích kỹ thuật, case học tập hoặc cập nhật từ giảng viên. Đây là nội dung biên tập đi kèm nền tảng, không khôi phục kho tài liệu/PDF công khai.

**Danh sách:** chủ đề, tags, tác giả, search, sort mới nhất; có summary, thumbnail được phép, thời gian đọc ước lượng từ nội dung.

**Chi tiết:** title, author/profile được phép, ngày xuất bản/cập nhật thật, mục lục nếu bài dài, nội dung markdown an toàn, code block, nguồn tham khảo và liên kết khóa phù hợp. Không tự nhận thành tích/tác giả của seed demo là người thật của nền tảng.

**Soạn/duyệt:** `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`; tác giả là instructor/editor được cấp quyền. Admin/moderator duyệt/trả lại lý do. Sửa bài đã publish theo version hoặc audit, không làm mất lịch sử liên quan.

**Lưu/like:** bookmark riêng theo user; like một lần/user/article, toggle idempotent hoặc action có quy tắc. Chống refresh/click lặp tăng số tùy ý. Tăng view không dùng như bằng chứng người đọc đã hiểu hoặc như số học viên.

### 9.3 Moderation và riêng tư

- Trạng thái community: `PENDING_REVIEW`, `PUBLISHED`, `HIDDEN`, `LOCKED`, `ARCHIVED` theo policy; thread locked không nhận reply mới.
- Report phải lưu target, reporter, reason, status, assignee và kết quả. Tạo report không tự xóa nội dung; người bị báo cáo không xem được danh tính người báo ngoài policy.
- Moderator có hàng chờ, xem ngữ cảnh, ẩn/khôi phục/khóa với lý do; audit quyền thật, không `userId === 1`.
- User không sửa/xóa bài của người khác; instructor badge từ role thật; không dùng tài khoản Google tự nhập để nhận danh tính giảng viên.
- Không public email, thông tin thanh toán, reset link hoặc nội dung ticket; hướng người dùng sang hỗ trợ riêng khi cần.
- Render code/text an toàn; không thực thi HTML/script từ bài viết; link an toàn; không tự fetch URL tùy ý từ server.

### 9.4 Dữ liệu và tác vụ quản trị

Tái sử dụng CommunityPost, CommunityReply, Article entities hiện có; bổ sung Report/Bookmark/Reaction/Category/ModerationAction khi thiếu. Ghi DB qua repository thực, không chỉ khai entity rồi đọc/ghi mảng INITIAL.

Index theo status/category/publishedAt, relation post-reply-author và unique reaction/bookmark; pagination/filter giới hạn pageSize. Fallback demo chỉ khi mode được bật rõ; DB lỗi không được âm thầm “thành công” bằng mảng mẫu.

### 9.5 Nghiệm thu

Đăng → sửa → reload → restart backend vẫn còn; hai tài khoản hỏi/trả lời đúng quyền; reply khác post không accepted; Student mang bất kỳ ID nào không tự có quyền admin. Report xuất hiện trong hàng chờ và xử lý có audit. Article draft/hidden không lọt list/detail/search. Like lặp không tăng vô hạn; bookmark riêng; XSS không chạy; lỗi DB trả lỗi thật, không rơi fallback demo ngoài ý muốn.

## 10. Mục chính 6 — Hỗ trợ học viên

### 10.1 FAQ thực sự có ích

Giữ nhóm thanh toán/quyền học, học thử/nội dung và runtime/luyện tập; thêm tìm kiếm, liên kết bài/khóa/đơn liên quan khi user có quyền. Không cần trung tâm bài dài phức tạp.

FAQ phải phản ánh cấu hình đang chạy. Những câu về timeout, hoàn tiền, đồng bộ học thử, sở hữu trọn đời và gửi email cần có owner nội dung/ngày cập nhật và căn cứ. Không tự giữ lời hứa 7 ngày hoặc 2–4 giờ nếu backend/quy trình chưa thực hiện.

### 10.2 Gửi yêu cầu có ngữ cảnh

Các loại đề xuất: `PRE_SALE`, `PAYMENT`, `ACCOUNT`, `CONTENT_ISSUE`, `TECHNICAL`.

- User đăng nhập: lấy owner từ phiên; courseId/orderId/lessonId là ngữ cảnh được validate và kiểm tra quyền, không tin userId từ body.
- Khách: cho gửi tư vấn nếu có quy trình xác minh/liên hệ. Tra cứu riêng cần token đủ mạnh hoặc link xác minh có hạn; mã TCK sáu chữ số không phải bí mật xác thực.
- Form tối thiểu: chủ đề, nội dung, ngữ cảnh cần thiết; email liên hệ dùng đúng nguồn/quy trình, không hỏi lại dữ liệu đã có nếu không cần.
- Tệp đính kèm chỉ thêm khi có size/MIME/path/private download checks. Bản đầu text + ngữ cảnh là đủ.
- Lưu DB thành công mới thông báo đã tiếp nhận; request thất bại không hiển thị ticket ID giả.

### 10.3 Trang yêu cầu của tôi và thread

Danh sách có mã, chủ đề, ngày, trạng thái, phản hồi gần nhất; filter trạng thái. Chi tiết có thread, reply, thông tin an toàn, nút bổ sung thông tin/đóng/mở lại theo policy.

Luồng đề xuất:

```text
OPEN → IN_PROGRESS → WAITING_USER → RESOLVED → CLOSED
                         ↑               ↓
                         └── REOPEN theo điều kiện ──┘
```

Đây là sơ đồ khái niệm; triển khai state transition hợp lệ trong service, không nhận status bất kỳ từ user. Staff assignment và action cần role; thời hạn/SLA chỉ công bố khi có người vận hành.

### 10.4 Bàn làm việc hỗ trợ

- Hàng chờ theo loại/trạng thái/ưu tiên, người phụ trách, thời gian chưa phản hồi.
- Staff trả lời qua UI, ghi nội bộ riêng không gửi cho user, chọn trạng thái và lý do.
- Email notification dùng adapter có retry/trạng thái, không nói đã gửi nếu mới ghi ticket vào DB. Nếu chưa có email thật, thông báo trong app và nhãn môi trường rõ.
- Sự cố thanh toán chỉ đọc dữ liệu cần thiết; không sửa ledger hoặc cấp học tùy tiện từ giao diện ticket.

### 10.5 Nghiệm thu

Ticket còn sau restart, owner xem đúng yêu cầu, user khác không đoán mã đọc được, staff đủ quyền phản hồi được, state sai bị chặn, gửi lặp không spam, email lỗi không mất ticket, FAQ/search đúng và không chứa cam kết khác với policy/code hiện hành.

## 11. Góc học tập của tôi và nút Học tiếp

### 11.1 Bố cục theo ưu tiên

1. Khóa/bài gần nhất có quyền, vị trí phát thật và nút Học tiếp.
2. Khóa đang học/chưa bắt đầu/hoàn thành, tìm nhanh và filter.
3. Việc cần làm: bài luyện draft, bài cần ôn, bài nộp cần sửa, câu hỏi/ticket có phản hồi.
4. Cập nhật khóa đã mua và mục tiêu tuần nếu có dữ liệu.

Lối tắt ví/đơn hàng nằm ở menu tài khoản hoặc vùng phụ. Không ưu tiên nạp tiền hơn việc tiếp tục học.

### 11.2 Nguồn dữ liệu và quy tắc

- Enrollment server quyết định khóa sở hữu; user chưa mua thấy empty state và CTA Khám phá/Học thử, **không fallback khóa đầu tiên như khóa đã kích hoạt**.
- Resume dựa hoạt động hợp lệ gần nhất trong khóa còn quyền, clamp mốc theo lessonVersion. Chưa có lịch sử thì bắt đầu bài đầu phù hợp.
- Phần trăm từ policy hoàn thành và progress thực, không lấy currentTime tua tới làm số phút đã học; không hardcode 42%, Bài 3 hoặc 14:20.
- Dữ liệu điểm yếu/hoàn thành/task có mẫu số và trạng thái rõ. Chưa có lượt làm thì Chưa đủ dữ liệu, không hiển thị hai kỹ năng sai cố định.
- API tổng hợp nhỏ theo user, các list dài phân trang. Cache theo identity, clear khi logout/đổi tài khoản, không lấy danh sách cả hệ thống về rồi lọc frontend.
- Refresh/đổi thiết bị giữ tiến độ; hai tab không cộng đôi, xung đột version được xử lý.

### 11.3 Nghiệm thu

Tài khoản A/B có enrollment và mốc khác nhau; tài khoản chưa mua không có khóa giả; quyền bị thu hồi không còn Học tiếp; khóa không phải React không hiện tiêu đề bài React; progress đúng sau reload/restart; dữ liệu task thực sự thay đổi sau khi nộp/chấm/trả lời.

## 12. Combo notification hiện có: hoàn thiện trải nghiệm và tính đúng

Giữ mô hình **announcement đầu trang + modal chi tiết + cách mở lại**, không thêm tab Combo. Không yêu cầu xây lại quote/payment nếu phần hiện tại đã hoạt động đúng.

### 12.1 Quy tắc hiển thị

- Thanh gọn, CTA Xem chi tiết; modal có Close rõ, focus trap và trả focus khi đóng.
- Nếu vẫn auto-open ở homepage, mỗi campaign/session chỉ hiện theo policy cấu hình; tôn trọng snooze, không tự mở lại sau mọi route change/render.
- Nút Ẩn 4 tiếng và checkbox trong modal dùng chung quy tắc `hiddenUntil`, campaign/version; không có hai key gây hành vi khác nhau.
- `localStorage` chỉ dùng cho preference hiển thị. Cache hỏng/private mode/storage không khả dụng không được làm trắng trang.
- Không auto-popup trong checkout/phòng học/editor; nút mở lại không che controls trên mobile. Có thể dùng vị trí trong header thay nút nổi khi không đủ chỗ.

### 12.2 Nội dung, quote và trạng thái

- “Lên tới 22%” chỉ hiển thị nếu dữ liệu chiến dịch và giá chứng minh; giá thay đổi thì tính lại, không hardcode vào nút ở mọi thời điểm.
- Smart Quote tính server, nêu khóa đã sở hữu/khóa mới, số tiền và điều kiện voucher/hoàn theo policy thực tế.
- Quote thay đổi/hết hạn cần xác nhận lại; modal thành công chỉ sau payment hợp lệ/enrollment theo cơ chế đang có.
- Pending/failed/cancelled có thông báo và đường hỗ trợ; duplicate/timeout/concurrent không trừ/cấp quyền lặp.
- Không biến số dư thưởng frontend thành tiền thanh toán thật khi chưa có ledger server và chính sách.

### 12.3 Nghiệm thu

Ẩn và refresh, đổi route, qua thời hạn, campaign mới, hai tab, storage bị hỏng; modal keyboard/mobile; không che nút học; mức giảm và quote khớp; thanh toán lặp/thiếu tiền/thất bại không báo thành công hoặc mở khóa ngoài quyền.

## 13. Đăng nhập Google, tài khoản và khuyến mại đăng ký

### 13.1 Hiện trạng cần xử lý P0

Chooser tự dựng cho nhập email/tên chỉ là UI mô phỏng, không chứng minh người dùng sở hữu tài khoản Google. Nhánh backend đọc payload JWT mà không verify cũng chưa chứng minh token hợp lệ. Không được giữ các nhánh đó như phương thức đăng nhập thật hoặc fallback khi OAuth lỗi.

Tài liệu Google yêu cầu kiểm tra chữ ký, `aud`, `iss`, `exp`, và dùng `sub` làm định danh Google ổn định. [Google — Verify ID token on the server](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

### 13.2 Luồng đích cho EduViet

1. Ứng dụng dùng Google Identity Services hoặc luồng OIDC được cấu hình đúng; nút chọn account/consent do Google cung cấp, không danh sách tài khoản cá nhân hardcode.
2. Frontend nhận credential qua cơ chế hợp lệ, gửi backend qua HTTPS; bảo vệ tính toàn vẹn phiên đăng nhập/CSRF/nonce/state theo flow cụ thể.
3. Backend verify bằng thư viện đáng tin, client IDs allowlist do cấu hình ứng dụng quyết định. Từ chối token sai/hết hạn/thiếu và **không fallback nhận email trần**.
4. Map `provider=GOOGLE + subject` sang user; role do server cấp/đọc. Tạo mới mặc định Student; tài khoản bị khóa hoặc mất quyền không được bỏ qua.
5. Tài khoản local trùng email cần quy trình liên kết được xác minh/xác thực lại phù hợp; không dùng email người dùng tự nhập để đăng nhập vào tài khoản đã có.
6. Phát phiên/token của EduViet theo thiết kế session hiện hành; thu hồi/đăng xuất/đổi role có hiệu lực thật, không chỉ trả message đã thu hồi.
7. Cấu hình Client ID/origin/redirect thuộc môi trường triển khai; không yêu cầu khách tự nhập Client ID để đăng nhập. Client ID là định danh công khai, client secret không nằm frontend.

Các bước này là thiết kế ứng dụng đề xuất cần kiểm chứng theo flow/package thực tế. Nếu chưa có Google credentials thì giữ đăng nhập email/password hoạt động; hiển thị Google chưa cấu hình hoặc chỉ demo có nhãn, không mô phỏng thành công và cấp phiên thật.

### 13.3 Số dư/quà tặng

- Nếu “1.000.000đ” là tiền demo, UI và môi trường phải ghi rõ. Nếu là credit khuyến mại, cần định nghĩa phạm vi dùng, điều kiện, hạn mức và cách hoàn; không tự coi như tiền mặt/rút được.
- Server xác định tài khoản mới đủ điều kiện, tạo grant/ledger đúng một lần trong transaction, idempotent qua các cách đăng ký.
- Login lại hoặc chọn nút Register với email đã tồn tại không phát lại quà; liên kết Google/local không nhân đôi credit.
- Frontend chỉ hiển thị số dư server; không nhận `walletBalance=1000000` hoặc account flag từ client làm bằng chứng.
- Không hardcode số điện thoại/tên/email cá nhân làm dữ liệu mặc định của người thật. Avatar bên thứ ba và trường profile phải theo policy dữ liệu hiện hành.

### 13.4 Nghiệm thu

Email đơn lẻ không login Google; token sai chữ ký/sai audience/sai issuer/hết hạn bị từ chối; Google sub đúng map đúng người; account khóa bị chặn; role không do body quyết định; liên kết trùng email theo flow xác minh; login lặp không tặng thêm; không secret/token trong UI/log. Những kiểm tra này cần test tích hợp và flow Google sandbox/thật phù hợp, không chỉ unit mock thành công.

## 14. Dữ liệu, API và phân lớp cần hoàn thiện

### 14.1 Nguồn bền vững

| Nghiệp vụ | Dữ liệu cần có/tái sử dụng | Quy tắc quan trọng |
| --- | --- | --- |
| Catalog/finder | Course, Skill/Tag, prerequisite/outcome, FinderConfig/RuleVersion | Published visibility, metadata thay ID, không giá cũ giả. |
| Trial/practice | Lesson/TrialVersion, ExerciseVersion, TestCase/Comparator, Draft, Attempt/Answer | Runtime đúng, kết quả thật, owner/version, answer policy. |
| Tiến độ | Enrollment, LessonProgress, watched interval/resume | Unique user-course/progress theo thiết kế, không cộng tua/cộng đôi. |
| Community | Post, Reply, Report, Reaction/Bookmark, ModerationAction | Persist DB, accepted đúng post, role/owner, hidden không public. |
| Bài viết | Article, ArticleVersion, category/tag, reaction/bookmark | Workflow publish và fallback demo rõ, view/like có quy tắc. |
| Hỗ trợ | Ticket, Message, Assignment/StatusHistory, Notification | Own/staff, trạng thái hợp lệ, guest lookup đủ bảo vệ. |
| Google | User, ExternalIdentity, Session, token/session version nếu có | Unique(provider,sub), verify trước map, linking đúng. |
| Credit/combo | Wallet/Ledger, PromotionGrant, Campaign, Quote, Order/Items, Payment, Enrollment | Nguồn server, transaction/idempotency, phân biệt demo/thật. |

Tên là mô hình đích để map vào code, không bắt buộc tạo bảng trùng nếu entity tương đương đã có. Có entity không đủ; phải xác nhận controller → service → repository → MySQL thực sự được dùng. Migration giữ dữ liệu, unique/FK/index và restore plan; không drop/reseed DB thật.

### 14.2 API: tách phần đã có trong mã và phần cần bổ sung

Các route ở cột “đã thấy” là quan sát khai báo/mã, **chưa là bằng chứng runtime đã đạt mọi yêu cầu**. Giữ prefix/path đang dùng; không tự thêm `/api/v1` rồi làm hỏng client.

| Nhóm | Đã thấy trong phần mã/tổng hợp | Bổ sung hoặc sửa theo thiết kế đích |
| --- | --- | --- |
| Finder | `GET /course-finder/config`, `POST /course-finder/recommendations` | DTO/config version, metadata rules, budget_mode và admin publish config. |
| Compare | `GET /courses/compare?ids=...` được tổng hợp mô tả và test gọi service | Rà controller/client, published DTO, số lượng/IDs, quyền/owned flag và lỗi. |
| Trial | `GET /trials`, `GET /trials/:id` | Content/version/runtime thật, draft/attempt/grade APIs nếu dùng server, tách answer policy. |
| Practice | GET exercises/detail, assessments/detail, POST assessments/:id/submit, GET challenges/weekly | Start/attempt ownership/time/version, review history, server scoring, authoring đúng quyền. |
| Community | GET/POST posts, detail/replies/accept-reply, POST reports | Repository thật, update/own/delete policy, moderation queue/actions, bookmarks/reactions khi chọn làm. |
| Article | GET list/detail, POST :id/like | Authoring draft/review/publish/archive, reaction unique, bookmarks, safe content và visibility. |
| Help | `GET /help/faq`, `POST /help/requests` | DB ticket; list/detail/reply/status owner/staff; guest lookup riêng; FAQ quản lý được. |
| My learning | Component tổng hợp ở frontend | API overview/enrollments/resume/weak skills từ user hiện hành; bỏ fallback giả. |
| Auth Google | `POST /auth/google` | Verify credential, provider-sub mapping, liên kết tài khoản và session/credit hợp lệ. |
| Combo | Smart quote/payment được tổng hợp mô tả | Xác nhận endpoint/code hiện có trước khi sửa; test policy/giá/enrollment và hiển thị snooze. |

OpenAPI phải có method/path, request schema, response public/private, auth, role/owner, state, errors và ví dụ ẩn danh. Các endpoint mới là đề xuất, AI phải ghi tên thật vào docs khi làm. Không coi bảng này thay thế OpenAPI đầy đủ.

### 14.3 Quy ước chất lượng chung

- DTO allowlist và range/type/size, không mass assignment userId/role/paid/score.
- 400/401/403/404/409/413/429 theo tình huống; lỗi an toàn có requestId; không HTTP 200 cho mọi thất bại.
- Pagination và sort allowlist server; query có tham số; không ghép SQL từ input.
- Idempotency/version/transaction cho tác vụ cần nhiều bản ghi hoặc rủi ro lặp; dùng đúng transaction manager.
- Controller tiếp nhận/validate/policy, service nghiệp vụ, repository dữ liệu; frontend không là nguồn quyền/tiền/điểm.
- Cache theo identity/visibility, không đưa response cá nhân vào cache public; logout dọn dữ liệu cá nhân.

## 15. User Stories và ma trận nghiệm thu chi tiết

Các stories dưới là bản gom để làm rõ phạm vi, không mặc định cộng thêm 24 story mới vào danh sách cũ. Khi triển khai, mapping DUS với US/CA-US/HUB-US tương đương, tránh đếm trùng. Tất cả câu giữ định dạng “Là…, tôi muốn…”.

Các mã UT-Dxx/IT/UI ở đây là **yêu cầu test chưa thực hiện trong lần viết tài liệu**, không phải kết quả đã PASS.

| Mã | User Story | Unit test cần có trong test | Tích hợp/UI và nghiệm thu |
| --- | --- | --- | --- |
| DUS01 | Là khách truy cập, tôi muốn tìm và lọc khóa học để chọn nội dung phù hợp nhu cầu của mình. | UT-D01 query/range/sort và điều kiện rỗng/sai | IT/UI01 filter kết hợp, pagination, URL, draft không public. |
| DUS02 | Là khách truy cập, tôi muốn xem đầu vào, đầu ra, giá và giáo trình để hiểu sản phẩm trước khi mua. | UT-D02 public DTO, metadata thiếu, giá hợp lệ | IT/UI02 khóa đúng dữ liệu, không old_price/rating giả, preview đúng quyền. |
| DUS03 | Là người học đã có quyền, tôi muốn vào học đúng khóa mà không phải mua lại để tiếp tục sử dụng nội dung đã thanh toán. | UT-D03 ownership/enrollment/state | IT/UI03 API quyền, CTA Vào học, revoked bị chặn, reload/thiết bị khác. |
| DUS04 | Là khách truy cập, tôi muốn trải nghiệm bài học thử đại diện để đánh giá cách học trước khi trả tiền. | UT-D04 preview visibility/runtime policy | IT/UI04 học thử thật, đổi ID bài khóa bị chặn, course liên quan chính xác. |
| DUS05 | Là người học, tôi muốn lưu và khôi phục bản nháp bài thử để tiếp tục ở phiên sau. | UT-D05 draft owner/version/context | IT/UI05 save/retry, hai user, đổi bài/unmount, merge khách-login theo policy. |
| DUS06 | Là người học thử, tôi muốn nhận kết quả chạy và test case chính xác để biết mình đã giải đúng hay chưa. | UT-D06 comparator, actual thật, timeout và runId | IT/UI06 hai lời giải đúng, ba sai, fake keyword không đạt, runtime lỗi/loop/output lớn. |
| DUS07 | Là người học, tôi muốn chọn bài luyện theo kỹ năng và trạng thái để luyện đúng phần cần thiết. | UT-D07 tags/access/status filters | IT/UI07 miễn phí/trả phí, history/draft riêng, dữ liệu còn sau restart. |
| DUS08 | Là người học, tôi muốn sửa lỗi code trong tình huống cụ thể để hiểu nguyên nhân và cách khắc phục. | UT-D08 đáp án/edge cases, không chấm theo chuỗi mẫu | IT/UI08 đề/gợi ý/test tương thích runtime, phản hồi đúng, code khác cách viết vẫn đạt. |
| DUS09 | Là người học, tôi muốn làm assessment hoặc đề phỏng vấn có thời gian và phản hồi để tự đánh giá kiến thức. | UT-D09 score 0–100, hết hạn, nộp lặp/version | IT/UI09 attempt own, server time, đáp án không lộ trước nộp, refresh/reconnect. |
| DUS10 | Là người học, tôi muốn ôn lại phần từng sai để củng cố kỹ năng còn yếu. | UT-D10 skill aggregation/sample size/version | IT/UI10 không dữ liệu không fake radar, review session mới, không sửa điểm cũ. |
| DUS11 | Là khách truy cập, tôi muốn nhận gợi ý khóa có lý do từ nhu cầu đã khai để chọn khóa có căn cứ. | UT-D11 metadata ranking, strict/flexible budget, tie-break | IT/UI11 khóa ID mới được gợi ý, không kết quả trả rỗng, hours/requirements rõ. |
| DUS12 | Là khách truy cập, tôi muốn so sánh tối đa ba khóa để thấy khác biệt trước khi mua. | UT-D12 IDs trùng/sai/quá ba, field allowlist | IT/UI12 mobile, giá/owned flags/visibility thật, compare route không xung đột. |
| DUS13 | Là thành viên, tôi muốn đăng và chỉnh sửa câu hỏi của mình để nhận trợ giúp từ cộng đồng. | UT-D13 validation/own edit/state | IT/UI13 DB persistence, thread URL, XSS, edit người khác bị chặn. |
| DUS14 | Là thành viên, tôi muốn trả lời và nhận biết đáp án được chấp nhận để theo dõi kết quả thảo luận. | UT-D14 accepted policy, reply-post relation, một đáp án hiện hành | IT/UI14 role thật thay ID 1, lock thread, thay/rút accepted theo quyền. |
| DUS15 | Là thành viên, tôi muốn đọc, tìm và lưu bài viết để xem lại kiến thức hữu ích. | UT-D15 article visibility/bookmark/like unique | IT/UI15 published-only, bookmark riêng, like lặp, DB lỗi không fallback sai mode. |
| DUS16 | Là giảng viên hoặc biên tập viên được cấp quyền, tôi muốn soạn và gửi duyệt bài viết để chia sẻ nội dung đúng quy trình. | UT-D16 draft/review/publish/owner transitions | IT/UI16 gửi duyệt/trả lại/publish/archive có lịch sử, draft không lộ search. |
| DUS17 | Là người quản trị, tôi muốn xử lý báo cáo nội dung để giữ môi trường cộng đồng phù hợp. | UT-D17 report state/role/action/reason | IT/UI17 report lưu DB, queue xử lý, hide/restore/lock có audit; reporter riêng tư. |
| DUS18 | Là khách hoặc người học, tôi muốn tìm hướng dẫn hỗ trợ đúng vấn đề để tự xử lý tình huống thường gặp. | UT-D18 FAQ visibility/category/search | IT/UI18 FAQ theo config/policy thật, liên kết đúng, thông tin timeout/hoàn không mâu thuẫn. |
| DUS19 | Là người học, tôi muốn gửi và theo dõi yêu cầu riêng để biết vấn đề của mình đang được xử lý thế nào. | UT-D19 ticket create/owner/lookup/idempotency | IT/UI19 còn sau restart, user khác không đoán mã xem được, thread/status thật. |
| DUS20 | Là nhân viên được phân quyền, tôi muốn tiếp nhận và phản hồi yêu cầu để hỗ trợ đúng người và ngữ cảnh. | UT-D20 assignment/status/private notes policy | IT/UI20 staff workflow, user thấy reply không thấy ghi chú nội bộ, mail fail không mất ticket. |
| DUS21 | Là người học, tôi muốn xem việc đang dở và học tiếp đúng mốc để duy trì tiến độ cá nhân. | UT-D21 resume selection/progress/tasks/empty | IT/UI21 hai user khác nhau, tài khoản chưa mua, khóa không phải React, bỏ 42%/14:20 giả. |
| DUS22 | Là người dùng, tôi muốn đăng nhập bằng Google đã xác minh để truy cập đúng tài khoản của mình. | UT-D22 token verification/mapping/locked/linking | IT/UI22 email trần, token giả/sai aud/iss/exp bị chặn; flow Google và session thật. |
| DUS23 | Là người dùng đủ điều kiện, tôi muốn nhận và xem credit khuyến mại được ghi nhận chính xác để sử dụng đúng chính sách. | UT-D23 eligibility/grant-once/ledger/idempotency | IT/UI23 register/login/link không nhân đôi; số dư server; demo/khuyến mại phân biệt. |
| DUS24 | Là người học, tôi muốn xem hoặc tạm ẩn combo và thanh toán theo báo giá thật để chọn ưu đãi mà không bị gián đoạn việc học. | UT-D24 snooze/campaign/quote/price/ownership | IT/UI24 4h, reload/storage lỗi/mobile; payment fail/duplicate không cấp quyền giả. |

## 16. Kiểm thử, số liệu và bằng chứng bàn giao

### 16.1 Cách ghi lại kết quả cũ

| Mục | Điều tệp gốc ghi | Trạng thái trong bản viết lại |
| --- | --- | --- |
| Backend unit | 109/109 qua 10 suites Vitest | Giữ như kết quả do tệp gốc báo; chưa chạy lại, cần log/commit/môi trường. Không gọi là coverage 100%. |
| Frontend build | Build thành công, không lỗi | Chưa chạy lại; cần command/output theo commit mới. Type-check, lint và build là các kiểm tra riêng. |
| Frontend/backend local | Cổng 5173/3000 trả 200 | Thông tin lịch sử; chưa probe trong lần này. Root 200 không chứng minh mọi API đúng. |
| Commit thay đổi | Sáu mã commit tính năng/sửa lỗi được liệt kê | Giữ thông tin lịch sử nhưng không tự xác nhận đã push/triển khai. HEAD cục bộ quan sát là 31549af. |

Các lệnh được thấy trong package backend: `npm test`, `npm run test:cov`, `npm run test:e2e`, `npm run test:api`, `npm run build`, `npm run lint`. Frontend có build/lint nhưng phần package được đọc chưa khai báo test script. AI thêm test/config cần thiết và ghi command thật; không tự nhận đã có test browser chỉ từ test backend.

### 16.2 Các lớp test bắt buộc

1. **Unit:** logic quyền/trạng thái, recommendation rules, grade/comparator, merge draft/resume, ticket state, reaction uniqueness, snooze và grant-once. Test có nhánh đúng/sai/ranh giới, không chỉ assert field tồn tại.
2. **Integration MySQL thật:** repository/migration/unique/FK, persist sau restart, transaction và idempotency. Mock repository không thay thế bước này.
3. **API/contract:** auth, DTO, status, public/private fields, OpenAPI, pagination và route conflict.
4. **Browser E2E:** React → Nest → MySQL cho luồng đã định nghĩa; external OAuth/video/runtime phân loại thật/mô phỏng rõ.
5. **Frontend:** menu/route, filters, modal/drawer/focus, forms, loading/error/empty, responsive, login đổi user, storage hỏng.
6. **Security regression:** giả body role/userId/score/price, token Google sai, worker network/phiên, XSS, IDOR, brute force/rate limit và private ticket.

### 16.3 Bảy luồng end-to-end ưu tiên

| Mã | Luồng | Bằng chứng trọng tâm |
| --- | --- | --- |
| E01 | Khách trả lời finder → so sánh → học thử → login → mua → vào học | Metadata/giá/ngữ cảnh/quyền đúng; không dựa frontend flag. |
| E02 | Mở trial → Run sai → Check sai → sửa đúng → lưu → quay lại | Actual từ code, không keyword grading; persistence/version và runtime thật. |
| E03 | Làm assessment → nhận skill feedback → ôn → mở Góc học tập | Điểm, history, sample size, task đúng tài khoản. |
| E04 | Hỏi cộng đồng → người khác trả lời → accepted → report/moderation | Role/owner, DB persistence, public visibility và audit. |
| E05 | Soạn article → duyệt → publish → like/bookmark → archive | Workflow/version, private draft, unique reaction và search. |
| E06 | Tạo ticket theo order/lesson → staff phản hồi → user bổ sung → đóng | Private thread, state, email failure và reload/restart. |
| E07 | Google login/returning/linking → session → credit nếu đủ điều kiện → logout | Token verified, no email-only bypass, grant-once và thu hồi có tác dụng. |

Combo cần thêm test quote/payment theo E01 khi luồng mua combo được chọn. Không dùng tài khoản/đơn thật để test phá dữ liệu.

### 16.4 Mẫu evidence record

```text
Run ID / commit / branch / ngày giờ / môi trường:
US + test ID + module:
Loại: unit | integration DB thật | API mock | browser thật | external sandbox
Preconditions / dữ liệu mẫu đã ẩn danh:
Command hoặc thao tác chính xác:
Expected:
Actual: [Chỉ điền sau khi chạy]
Status: NOT_RUN | PASS | FAIL | BLOCKED
Log/screenshot/API response/DB assertion:
Defect, nguyên nhân, thay đổi sửa, retest và giới hạn:
```

Coverage phải báo statements/branches/functions/lines, include/exclude và source phạm vi; số bài pass không được gắn nhãn coverage. Ảnh/log không có token, mật khẩu, email cá nhân không được phép hoặc mã tra cứu bí mật.

## 17. Thứ tự hoàn thiện và cách giao việc cho AI

### 17.1 Các đợt thực hiện

| Đợt | Phạm vi | Điều kiện qua đợt |
| --- | --- | --- |
| 0 | Đọc HEAD mới, mapping module/data/route, lập trạng thái từng HT | Không reset/ghi đè bản người dùng; biết phần thật, phần demo, phần chưa test. |
| 1 — P0 | Google verified flow, role/owner/session, credit server | Không còn email-only login cấp phiên, không ID admin hardcode, grant-once/policy rõ; test âm tính đạt. |
| 2 — P0 | Trial/practice Run/Check thật, runtime và sandbox boundary | Không keyword grading/actual=expected, timeout/config thống nhất, sai logic bị chặn, không lộ phiên. |
| 3 — P1 | Persist community/help và workflow articles | Bài/ticket/report còn sau restart, draft/hidden private, staff/moderation có thao tác thật. |
| 4 — P1 | Dashboard thật và finder metadata/compare/catalog | Bỏ dữ liệu 42%/mốc giả, khóa mới tham gia ranking, public DTO/giá đúng. |
| 5 — P1/P2 | Ôn tập, changelog/notification, combo UX và mobile | Dữ liệu cá nhân đúng, không spam/che controls, opt-out/snooze có tác dụng. |
| 6 | Integration/E2E/security/UI, docs và báo cáo | Test theo commit cuối, hạn chế rõ, không tự nhận đã hoàn thiện toàn hệ thống. |

Các đợt đều làm kèm unit/contract test, không đợi cuối mới bổ sung bảo mật. Chỉ mở chức năng cần staff/nội dung khi đã phân công thực tế; không hứa thời gian hoàn thành khi chưa xem phạm vi code và nguồn lực.

### 17.2 Mapping tệp để AI bắt đầu

| Khu vực | Tệp/module nên đọc trước | Công việc trọng tâm |
| --- | --- | --- |
| Header/home | `frontend/src/Header.jsx`, `App.jsx`, `components/home/*` | Giữ 6 menu, quick cards, route, combo/context và quyền. |
| Catalog/finder | `CourseFinderPage.jsx`, course/finder services/controllers | Metadata, rules, compare, visibility và API client. |
| Trial | `InteractiveTrialPage.jsx`, `lms/src/trial/*` | Tách run/check, adapter/version/test cases/draft, safe runtime. |
| Practice | `PracticeHub.jsx`, `lms/src/practice/*` | Attempt/time/score, bug fixing, skill history/ôn tập. |
| Community/article | `CommunityHub.jsx`, `lms/src/community/*`, `lms/src/article/*` | Repository thật, quyền/workflow, report/like/bookmark, safe content. |
| Help | `HelpCenterPage.jsx`, `lms/src/help/*` | DB ticket/threads/status/owner/staff, FAQ đúng policy. |
| Dashboard | `MyLearningDashboard.jsx`, learning/progress/enrollment APIs | Dữ liệu server/resume/tasks, bỏ fallback sở hữu giả. |
| Auth/bonus | `AuthModal.jsx`, `services/auth.js`, `lms/src/auth/*`, wallet/ledger module | Verify Google, session/linking, credit server/idempotency. |
| Combo | `components/home/ComboNoticeBanner.jsx`, quote/order/payment hiện có | Snooze/config, giá/thông báo chính xác, giữ workflow cũ đúng. |
| Test/docs | `lms/test`, frontend test config cần bổ sung, OpenAPI/README | Ma trận stories/bằng chứng, UI/DB thật, số liệu trung thực. |

Không giới hạn thay đổi chỉ trong các tệp liệt kê nếu kiến trúc cần tách; cũng không refactor rộng phần không liên quan chỉ vì đã mở file.

### 17.3 Definition of Done cho từng mục

- Hoàn thành luồng chính và luồng lỗi, có nội dung/quy trình thực tế.
- API/DB/ownership/role/visibility đúng; không thành công giả hoặc silently fallback demo.
- UI desktop/mobile, route, keyboard và trạng thái dùng được; main menu không dead link.
- Unit test đúng/sai trong test, integration/E2E phù hợp và actual evidence.
- OpenAPI, UML/ERD, migration, traceability, README và report status cập nhật theo code cuối.
- Không có secret trong Git/log/report, không xóa dữ liệu hoặc lịch sử để làm đẹp kết quả.

## 18. Cách cập nhật báo cáo và lịch sử thay đổi

### 18.1 Bảo toàn nội dung lịch sử

Tệp gốc liệt kê các commit `6edf9fa`, `03e1cec`, `338f9cc`, `759511b`, `4af82fe`, `5b19616` với nội dung điều hướng, thử/luyện, notice và Google UI. Chúng được ghi nhận là lịch sử do bản tổng hợp cung cấp; không suy ra các commit đó đã giải quyết đúng mọi yêu cầu hoặc đã được triển khai ngoài máy local.

Bản mới đọc HEAD `31549af`; khi AI thực hiện thêm phải thay baseline bằng full commit/date và ghi changelog: chức năng, lý do, migration, test đã chạy, giới hạn. Không sửa lịch sử/author hoặc tạo commit giả để chia điểm.

### 18.2 Mỗi mục chính nên có gì trong báo cáo?

1. Nhu cầu/story và tình huống người dùng cụ thể.
2. Wireframe và screenshot UI thật, desktop/mobile cùng breakpoint.
3. Đối tượng/quan hệ/class/service, state và ràng buộc.
4. Luồng frontend → controller → service → ORM/adapter → DB → response.
5. API/DTO/quyền/lỗi, đoạn code ngắn giải thích quyết định quan trọng.
6. Case đúng/sai/ranh giới, expected/actual, nguyên nhân lỗi và retest.
7. Kết quả, giới hạn và nội dung chưa làm; không đưa đề xuất vào phần thành tựu.

Ví dụ Học thử có thể phân tích entry point/input schema/comparator/timeout/visibility, rồi bằng chứng code sai bị chấm sai và code đúng được chấm đúng. Cộng đồng có thể phân tích workflow publish/accepted/report/DB/role và truy vết một report được xử lý. Các nội dung đó giúp báo cáo sâu hơn mà không cần thêm một menu không cần thiết.

### 18.3 Giữ yêu cầu học phần trước đó

- Báo cáo trên 60 trang phải được tạo/render và đếm thực tế theo font/cỡ chữ/mẫu `final (1).docx`, không suy ra từ số dòng MD.
- Không hiện Danh mục hình ảnh và Danh mục bảng theo yêu cầu đã có; vẫn có caption và dẫn chiếu.
- Giảng viên: **TS Nguyễn Lệ Thu**. Thành viên: **Phù Ngọc Hào — 23010384; Nguyễn Quốc Khải — 23010403; Nguyễn Hoàng Sơn — 23010878**.
- User Stories đúng định dạng, UML Class/thuật toán, wireframe, NestJS/React/LICENSE/security/API docs/ORM và test phải truy vết được.
- Video demo thật dưới 8 phút, link repo đúng commit, đóng góp thực tế có bằng chứng. Thảo luận/chuyên cần do lớp xác nhận, AI không tạo thay.
- Các chính sách/bản quyền/đạo đức phải phản ánh việc đã làm; không tự nhận tuân thủ/an toàn tuyệt đối bằng một checklist.

## 19. Prompt giao AI và checklist cuối

### 19.1 Prompt triển khai

> Hãy dùng tệp TONG_HOP_EDUVIET_2026_BAN_CHI_TIET_VA_DINH_HUONG_HOAN_THIEN.md làm đặc tả để chi tiết hóa và hoàn thiện EduViet trên code mới nhất của tôi. Đọc baseline và các HT01–HT12, kiểm tra lại trên HEAD hiện tại rồi làm theo các đợt ở mục 17. Giữ sáu menu Khóa học, Học thử, Luyện tập, Chọn khóa phù hợp, Cộng đồng & Bài viết, Hỗ trợ; có Góc học tập/Học tiếp và combo ở announcement/modal, không tạo tab Combo/Tài liệu/Lộ trình. Tái sử dụng các phần đang chạy đúng. Ưu tiên xác thực Google thật, role/owner, grant server, chấm test case thực tế, runtime/sandbox đúng; rồi hoàn thiện lưu DB và workflow cộng đồng/bài viết/ticket, dashboard cá nhân thật và finder theo metadata. Không coi nhập email là Google OAuth, không chỉ decode JWT, không keyword grading, không actual=expected, không số liệu/tiền/quyền do frontend tự khai. Giữ React/react-bootstrap, NestJS phân lớp, TypeORM/MySQL, dùng migration bảo toàn dữ liệu. Với mỗi story công bố hoàn thành, bổ sung unit trong test, integration DB/API, E2E/UI phù hợp và log actual theo commit; cập nhật OpenAPI/UML/ERD/wireframe/traceability/README. Không gọi số tests pass là coverage, không chép HTTP200 lịch sử thành trạng thái đang chạy và không giả cam kết hoàn tiền/SLA/ưu đãi. Kết thúc từng đợt báo file thay đổi, phần tái sử dụng, lệnh đã chạy, lỗi/giới hạn và cổng nghiệm thu. Không tự xóa dữ liệu, sửa lịch sử Git, host/public deploy ngoài yêu cầu của phiên làm việc.

### 19.2 Checklist giao nhận

- [ ] Tài liệu đã phân biệt thông tin tổng hợp gốc, quan sát source và thiết kế đích.
- [ ] Sáu mục chính giữ đúng tên/vị trí, có màn hình chi tiết và tác vụ thật; Cộng đồng không bị gỡ theo MD cũ.
- [ ] Course metadata/giá/visibility/CTA đúng, không giá cũ hoặc số liệu giả.
- [ ] Trial Run/Check tách biệt, actual từ thực thi, runtime và timeout nhất quán.
- [ ] Sandbox được kiểm chứng theo API/network/storage/phiên, không quảng cáo cách ly tuyệt đối chỉ nhờ Worker.
- [ ] Practice/assessment có score/time/version/owner đúng; weak areas từ dữ liệu đủ căn cứ.
- [ ] Finder theo metadata, strict/flexible budget rõ, compare tối đa ba và không fallback old_price giả.
- [ ] Community/article/report/reaction/workflow lưu DB, role/owner thật, không dùng ID admin cố định.
- [ ] Help có ticket/thread/status/owner/staff và riêng tư; FAQ không vượt khả năng hiện tại.
- [ ] Dashboard bỏ enrollment fallback/mốc/42%/điểm yếu hardcode, lấy server theo user.
- [ ] Combo notification/modal/snooze có tác dụng, giá/ưu đãi/quote đúng, không tab Combo.
- [ ] Google verify credential trước cấp phiên, map provider-sub, linking/session đúng; không email-only fallback.
- [ ] Credit demo/khuyến mại có chính sách, server ledger/grant-once, không tự cộng frontend.
- [ ] Tests và kết quả có log/commit/phạm vi; 109/109 lịch sử không được tự đổi thành coverage 100%.
- [ ] Migration/docs/sơ đồ/báo cáo khớp code và dữ liệu không bị mất; thông tin nhóm và giảng viên chính xác.

### 19.3 Nguồn để đối chiếu

- Tệp tổng hợp gốc trong cùng thư mục và các đường dẫn source đã ghi ở mục 3/17. Bản gốc được giữ nguyên.
- [Google Identity — Xác minh ID token phía server](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), tra ngày 30/10/2026.
- [MDN — Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), tra ngày 30/10/2026.
- [Codecademy](https://www.codecademy.com/) là nguồn định hướng trải nghiệm đã được tham khảo trong phiên thiết kế trước; không là bằng chứng EduViet có cùng chất lượng/công nghệ.

**Trạng thái bàn giao tài liệu:** đã viết lại và chi tiết hóa yêu cầu; không sửa code ứng dụng, không chạy host hoặc test ứng dụng mới trong lần này. Những điểm source nêu ra cần AI triển khai kiểm tra lại ở commit hiện hành, sửa đúng và bổ sung bằng chứng trước khi cập nhật thành báo cáo hoàn thành.
