# EDUVIET — KIỂM TRA VERCEL/GITHUB VÀ ĐẶC TẢ GIAO DIỆN, LUYỆN TẬP TRONG KHÓA HỌC

**Ngày kiểm tra:** 31/10/2026, múi giờ Asia/Saigon.  
**Website:** [eduviet-academy.vercel.app](https://eduviet-academy.vercel.app/).  
**GitHub:** [nguyenkhai05/nhom6-N01-26](https://github.com/nguyenkhai05/nhom6-N01-26).  
**Commit đối chiếu:** `4c35660d25dc3b5054de3db5a12ab36900444546`, thông điệp `feat: complete university-grade curriculum modal, real MBBank QR integration, interactive trial learning experience, and Vercel cloud deployment`.  
**Commit time:** 31/10/2026, 02:53:05 +07:00.

## 1. Kết luận và thay đổi người dùng đã yêu cầu

**Chưa đủ căn cứ coi bản Vercel đã hoàn thiện để vận hành bán khóa học.** Giao diện đã lên, menu và modal có thể mở, nhưng kết nối API đang sai: các đường API đã kiểm tra trả HTML của SPA, không phải JSON. Tình trạng này làm một số mục trông như không có dữ liệu hoặc cứ đang tải, dù source backend đã có module.

Ưu tiên theo thứ tự:

1. Sửa triển khai frontend–backend và các nhánh báo thành công khi server chưa xác nhận.
2. Chuyển Luyện tập vào từng khóa/bài, kiểm tra quyền và tiến độ theo đúng ngữ cảnh ở backend.
3. Thay mục Luyện tập trên menu bằng **Giảng viên**: danh sách và hồ sơ người dạy, liên kết các khóa do họ phụ trách.
4. Làm gọn trang chủ/card/footer/modal; số liệu và cam kết phải có nguồn.

**Menu đích:**

> **Khóa học · Học thử · Chọn khóa · Giảng viên · Cộng đồng · Hỗ trợ**

“Chọn khóa” là nhãn ngắn của bộ Chọn khóa phù hợp; “Cộng đồng” vẫn có tab Bài viết/Hỏi đáp. Sau login có Học tiếp/Góc học tập và menu tài khoản. Combo tiếp tục là announcement/modal, không thêm tab riêng.

Tệp này là đầu vào chính cho lần chỉnh sửa mới, thay thế các MD trước còn đặt Luyện tập ở menu chính. Tái sử dụng bộ chấm, bản nháp và lượt nộp đã có trong mã nguồn; chuyển phần điều hướng và quyền sang ngữ cảnh khóa theo đặc tả trong tệp này.

### 1.1 Phạm vi đã kiểm tra

- Đọc commit mới nhất qua kết nối GitHub, đối chiếu với repo cục bộ đang ở cùng HEAD.
- Mở website bằng browser thật: homepage, combo modal, catalog/detail, Học thử, Finder, Practice guest gate, Community, Help, footer policy và URL trực tiếp `/try`.
- Kiểm tra desktop 1280×720 và homepage/menu mobile 390×844; đã khôi phục viewport sau khi kiểm tra.
- Thực hiện một khảo sát chọn khóa bằng thông tin nhu cầu không nhạy cảm; không gửi ticket, bài cộng đồng hoặc dữ liệu cá nhân.
- GET chín API public theo đường được frontend/source sử dụng; kiểm tra Content-Type/body, không chỉ status.
- Chạy lại unit thuộc `lms/test/unit`, frontend build/lint, backend build; không chạy test DB phá dữ liệu.

### 1.2 Giới hạn

Chưa đăng nhập tài khoản học viên/giảng viên/admin, chưa thanh toán/nạp tiền thật, chưa kiểm thử E2E có MySQL triển khai hoặc luồng Google hoàn chỉnh. Những nhận định về phòng học/thanh toán/backend trong phần source là **quan sát mã**, không phải đã khai thác hoặc thực hiện giao dịch trên website.

Tệp này chỉ là báo cáo và đặc tả cho AI. Chưa sửa mã ứng dụng, chưa deploy, chưa chuyển menu hay nội dung của website thật.

## 2. Bằng chứng từ bản Vercel

### 2.1 Chín API đều trả HTML

GET với `Accept: application/json` tới origin hiện tại:

| Đường gọi | HTTP | Content-Type | Kết quả |
| --- | --- | --- | --- |
| `/courses` | 200 | text/html; charset=utf-8 | HTML SPA, không phải list khóa JSON. |
| `/categories` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/trials` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/course-finder/config` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/help/faq` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/practice/exercises` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/community/posts` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/articles` | 200 | text/html; charset=utf-8 | HTML SPA. |
| `/bundles` | 200 | text/html; charset=utf-8 | HTML SPA. |

Cả chín body có cùng SHA256 `59b8c8c525dc44f5e3c01a075f3d53d253e85345826a1ebf9ada58bd5a77648f`, bắt đầu bằng `<!doctype html>`. **HTTP 200 ở đây không phải API hoạt động đúng.** `/courses` có thể là URL trang frontend hợp lệ, nhưng client hiện cũng gọi nó như JSON API trên cùng origin nên bị xung đột.

Bundle đang phục vụ: `/assets/index-mzdMJl_m.js`. SHA256 `821807b9f44bfcc67399ca486c458264fdc5969f5138dac19b5653dabc67afa1`, **khớp chính xác bundle build lại từ repo cục bộ ở commit đối chiếu**. Trong bundle, helper hub fetch dùng `fetch(`${e}`, ...)`, tức URL tương đối; không có base backend đã được chèn vào nhánh đó.

### 2.2 Quan sát bằng browser

| Mã | Thao tác/khung nhìn | Kết quả quan sát |
| --- | --- | --- |
| UI01 | Mở homepage lần đầu | Có announcement và popup combo; modal ghi 0 gói ưu đãi nhưng vẫn có CTA nhận báo giá. |
| UI02 | Mở Học thử, quan sát lại sau đó | Nội dung vẫn ghi đang nạp dữ liệu, chưa có workspace bài thử. |
| UI03 | Finder: Frontend, JavaScript, 3–5 giờ, gửi gợi ý | Console ghi lỗi máy chủ 405; UI vẫn biểu diễn như không tìm được khóa khớp tiêu chí. |
| UI04 | Mở Community tab bài viết | Hiện không tìm thấy bài viết, trong khi homepage quảng bá 12 bài viết. |
| UI05 | Mở Help | Khu FAQ không có câu hỏi; form tư vấn vẫn hiện và hứa phản hồi 2–4 giờ. Chưa gửi form. |
| UI06 | Mở Practice khi chưa login | Hiện gate yêu cầu học viên đã hoàn thành bài học; xác nhận đây đang là một mục cấp cao độc lập. |
| UI07 | Catalog và chi tiết khóa đầu tiên | Chín card fallback hiện được; modal có giáo trình/tài liệu/đầu ra và giá. Đây chưa chứng minh API/giáo trình DB đã được tải. |
| UI08 | Điều hướng giữa các mục qua header | URL tiếp tục là `/`; điều hướng dựa state không tạo địa chỉ trang tương ứng. |
| UI09 | Truy cập thẳng `/try` bằng URL | App hiển thị hero và search homepage, không mở đúng Học thử. |
| UI10 | Click Chính sách bảo mật dữ liệu ở footer | Không có trang/nội dung chính sách mới; source cho thấy link không có route. |
| UI11 | Homepage mobile 390×844 | Không thấy tràn ngang trong phép đo: document clientWidth và scrollWidth đều 375 px; announcement cao khoảng 174 px, nhiều nút nổi chồng nhau phía dưới. |
| UI12 | Mở menu mobile và chọn Học thử | Menu mở được, nhưng sau chọn vẫn expanded; nút toggle thiếu accessible name/aria-label. |

UI03 là thao tác stateless chọn nội dung, không là đăng ký tài khoản/giao dịch. Các kết quả “không có dữ liệu” ở UI02–05 cần sửa lỗi kết nối/error state trước khi coi là catalog thực sự rỗng.

## 3. Kiểm tra local và ý nghĩa thực tế

| Kiểm tra | Command/phạm vi | Kết quả lần này |
| --- | --- | --- |
| Backend unit | `npm test -- test/unit` trong lms | **100 tests / 7 files đạt**, Vitest; chỉ phạm vi test/unit. |
| Backend build | `npm run build` trong lms | Đạt. |
| Frontend build | `npm run build` trong frontend | Đạt, có cảnh báo chunk lớn. |
| Frontend lint | `npm run lint` trong frontend | Exit 0; đếm **96 dòng cảnh báo** trong log, không lỗi làm command thất bại. |
| JS entry build | `index-mzdMJl_m.js` | 929,61 kB, gzip 254,90 kB. |
| CSS build | File CSS entry | 335,10 kB, gzip khoảng 51 kB. |
| MySQL integration, browser login, payment thật | Chưa thực hiện | Không được ghi PASS. |

100 unit pass không có nghĩa coverage 100% hay bản production hoạt động đủ. Build local không kiểm tra được việc Vercel có phục vụ backend/DB đúng hay không. Không thay số liệu cũ 109 tests trong báo cáo bằng 100 mà bỏ mất thông tin command/phạm vi khác nhau.

## 4. Danh sách thiếu sót và mức ưu tiên

**Live** = đã thấy trên website; **Source** = đọc code tại commit đối chiếu; không tự coi Source là một ca exploit/giao dịch đã chạy.

| Mã | Mức | Bằng chứng | Việc phải sửa |
| --- | --- | --- | --- |
| DEP01 | P0 | Live + `vercel.json`, API client, bundle: API tương đối gặp SPA fallback | Triển khai/kết nối NestJS thật, tách API namespace/origin với frontend router. |
| DEP02 | P0 | `hubApi.js` parse JSON thất bại thành null dù status 200 | Validate Content-Type/schema, lỗi tải phải là error state, không giả list rỗng hoặc spinner mãi. |
| PAY01 | P0 | `CheckoutPage.jsx:42–63` tự tạo Completed sau timer; `App.jsx:634–660` nuốt lỗi checkout rồi vẫn thêm order/enrollment state | UI chỉ thành công theo trạng thái server xác nhận; không cấp quyền/trừ ví dự phòng sau API fail. |
| PAY02 | P0 trước thu tiền thật | `App.jsx:487–491` gửi auto_confirm=true; `commerce.service.ts:214–250` xác nhận/credit theo DTO | Tách DEMO/LIVE rõ; người học không tự xác nhận tiền thật. QR không là bằng chứng đã nhận tiền. |
| RUN01 | P0 khi mở code tự do | `CourseLearningRoom.jsx:325–349` dùng new Function trực tiếp trong context app, runtime hiển thị cố định 0,14s | Chuyển sang runner chung đã có; actual timing/error/timeout đúng, không tái dùng handler cũ khi đưa practice vào khóa. |
| LEARN01 | P1 | `PracticeHub.jsx:22–47` gate từ enrolledCourses/completedLessons local và forceBypass; PracticeController chưa có context khóa/bài | Backend kiểm tra binding, enrollment và điều kiện mở bài tập theo từng tài nguyên. |
| LEARN02 | P1 | `courseCurriculum.js:743–753` fallback curriculum React; file chỉ có keys 1–6 trong khi homepage bán chín khóa | Giáo trình riêng từng khóa, thiếu thì thông báo đúng; không đổi title mà dùng video/bài React cho khóa khác. |
| LEARN03 | P1 | Room tính completed theo currentTime >=90% đoạn, save lỗi bị bỏ qua nhưng hiện saved | Tách resume với watched time/completion policy, save status trung thực; kiểm tra seek/autoplay thật sau khi sửa. |
| NAV01 | P1 | Live UI08/09, `App.jsx` currentRoute state | URL routing thật, reload/Back/share đúng, tách route API. |
| CONTENT01 | P1 | `ConversionTriggers.jsx` hardcode 15.000+, 94,8%, 120+, mentor 24/7, blockchain và testimonials | Dữ liệu/căn cứ thật hoặc bỏ/ghi minh họa; không công bố lời hứa chưa có quy trình. |
| CONTENT02 | P1 | `CourseCard.jsx:49–66` fallback thời lượng/rating và (340+) cố định | Tính từ giáo trình/review hợp lệ, chưa có thì ghi chưa có; không dữ liệu mặc định gây hiểu nhầm. |
| CONTENT03 | P1 | Live 22% ở notice nhưng khối Deals ghi giảm đến 40%; combo modal 0 gói | Một campaign/quote source, không hiển thị CTA mua khi không có gói; loading/empty/error riêng. |
| FOOT01 | P1 | Live UI10 và `Footer.jsx` link thiếu route | Trang policy/contact thực hoặc bỏ link chưa có, không nhiều cột link chết. |
| UI-A01 | P1 | Hero H1 màu rgb(15,23,42) trên nền xanh đậm, screenshot desktop/mobile khó đọc chữ Học | Chữ trắng/nhấn vàng phù hợp, headline ổn định, kiểm tra contrast/focus. |
| UI-A02 | P2 | Homepage lặp nhiều hàng khóa, mục trình độ/chuyên ngành/lộ trình, CTA quà tặng và ưu đãi | Rút thành khoảng bảy khối có nhiệm vụ riêng; bỏ phần trùng và marketing thiếu căn cứ. |
| UI-A03 | P2 | Hai nút nổi promo/support chồng nhau; mobile bar rất cao | Một điểm hỗ trợ nổi, mở lại combo từ header; announcement một–hai dòng. |
| UI-A04 | P2 | Header desktop phải xuống hàng; mobile không tự đóng sau route, thiếu label | Rút nhãn, bố trí utility hợp lý, controlled menu/Offcanvas và aria-label. |
| PERF01 | P2 | Entry JS 929,61 kB và lint có 96 dòng cảnh báo | Lazy load route/editor/admin, sửa warning có ý nghĩa; không chỉ tăng ngưỡng cảnh báo build. |

P0 về payment/runner là kết luận cần sửa từ source, chưa thử giao dịch hoặc chạy code nguy hiểm trên site. Khi AI sửa, phải test lại từng nhánh thay vì chỉ sửa label hoặc giấu nút.

## 5. Sửa triển khai trước khi trang trí giao diện

### 5.1 Nguyên nhân quan sát được

`vercel.json` hiện build `frontend`, xuất `frontend/dist`, rewrite `/(.*)` về `/index.html`. Cấu hình này phục vụ SPA nhưng không tự khởi động hoặc route NestJS trong `lms`.

Client `API_URL = import.meta.env.VITE_API_URL ?? ''`; bundle production đang gọi relative path. `/trials` và `/course-finder/config` rơi vào SPA fallback, parser nhận HTML. POST recommendations gặp 405. Có backend source trong repo không có nghĩa backend đã được deploy cùng frontend.

### 5.2 Hai phương án hợp lệ, chọn một kiến trúc nhất quán

**A — Frontend Vercel, backend có HTTPS riêng:** triển khai NestJS + MySQL/migration trên môi trường phù hợp; đặt VITE_API_URL tới API origin thật trong môi trường build frontend, cấu hình CORS allowlist đúng frontend origin và auth topology. Build/deploy lại frontend sau khi đổi env.

**B — API cùng origin qua namespace riêng:** `/api/...` được route tới backend/function phù hợp, frontend pages dùng router của SPA; API routes xử lý trước và không bị SPA fallback nuốt. Các URL API không tồn tại phải trả lỗi API phù hợp, không index.html.

Không mặc định Vercel không chạy được NestJS: Vercel có tài liệu triển khai NestJS, nhưng cần cấu hình triển khai backend thực sự, không chỉ dùng config static frontend hiện tại. [Vercel NestJS](https://vercel.com/docs/frameworks/backend/nestjs), [Rewrites](https://vercel.com/docs/routing/rewrites).

### 5.3 Quy tắc cấu hình

- Không dùng localhost hoặc đường tunnel tạm như API production cho người dùng khác.
- VITE_API_URL chỉ là public API URL. DB password, JWT secret, Google client secret, signing secret chỉ ở backend, không đặt vào `VITE_*`.
- Vite thay env client tại build time; đổi cấu hình phải build/deploy lại và kiểm tra bundle/request thực. [Vite Env and Modes](https://vite.dev/guide/env-and-mode).
- Có health/readiness checks và build SHA/public version tối thiểu để đối chiếu deployment; không public env thô hoặc DB details.
- Production không silently fallback dữ liệu mẫu thành trạng thái đang vận hành. Nếu demo, hiển thị nhãn rõ và khóa các lời hứa/giao dịch tiền thật.

### 5.4 API client và error states

- Nếu endpoint đòi JSON nhưng nhận text/html hoặc payload sai schema, throw API_RESPONSE_INVALID; không trả null như thành công.
- Tách network error, timeout, 4xx/5xx, dữ liệu rỗng và chưa gửi form. Finder chưa gửi không hiện “không khớp 100%”; lỗi API không được đổ cho ngân sách của khách.
- Trial loading xong nhưng không có data phải hiện empty/error và Retry, không spinner vĩnh viễn.
- Combo fetch lỗi không auto-open modal 0 gói với nút checkout hoạt động.
- Không hướng người dùng website chạy npm bật backend; UI chỉ báo dịch vụ tạm chưa sẵn sàng và cách thử lại/liên hệ.

### 5.5 Cổng nghiệm thu deployment

API thực trả đúng JSON/schema; dữ liệu catalog/trial/help xuất hiện đúng nguồn; recommendations chạy được; 404 API không trả SPA; refresh frontend routes đúng; CORS/auth cookie hoặc bearer đúng topology; restart backend/DB không mất dữ liệu. Chưa qua cổng này chưa nhận đã hoàn thiện production.

## 6. Mục mới thay Luyện tập: Giảng viên

### 6.1 Lý do chọn

Giúp người mua biết ai dạy, người đó phụ trách nội dung gì và khóa nào đáng xem. Dự án đã có `Course.instructor_id`, quan hệ `User.coursesTaught`, nên có thể phát triển bằng dữ liệu hiện có thay vì thêm một nghiệp vụ cần đội vận hành riêng.

Đây là **đề xuất tính năng mới**, không phải mục đã có trên bản Vercel. Không cần lịch mentor, gọi video, tư vấn 24/7 hoặc marketplace tuyển dụng để tính năng này có ích.

### 6.2 GV01: Danh sách giảng viên

- Route đích `/instructors`; search theo tên hiển thị, lọc chuyên môn bằng metadata và pagination.
- Card: avatar có quyền sử dụng, tên hiển thị, chuyên môn, giới thiệu ngắn, số khóa đã xuất bản và CTA Xem hồ sơ.
- Số khóa lấy query thật. Không thêm số năm kinh nghiệm, công ty từng làm, rating, chứng chỉ hoặc hàng nghìn học viên nếu chưa có dữ liệu được xác nhận.
- Chỉ profile được phép công bố mới hiện; không liệt kê mọi user có email trong hệ thống.
- Nếu chỉ có dữ liệu đồ án minh họa thì ghi rõ minh họa; không tạo danh tính giảng viên/đối tác giả để làm đầy trang.

### 6.3 GV02: Hồ sơ công khai

- Route `/instructors/:slug`; tên, giới thiệu, chuyên môn, cách giảng/nội dung phụ trách và liên kết chuyên môn được chủ thể cho phép công khai.
- Danh sách khóa published do giảng viên đó phụ trách; CTA Xem khóa/Học thử nếu có preview thật.
- Hỏi về khóa mở ticket gắn courseId; không mặc định công khai email/số điện thoại riêng của giảng viên.
- Khóa sở hữu hiện Vào học cho đúng người; profile không tự cấp quyền xem bài khóa.
- Không cần một bảng review giảng viên riêng ở bản đầu. Có thể tổng hợp review khóa hợp lệ nếu giải thích rõ nguồn và cỡ mẫu.

### 6.4 GV03: Soạn và duyệt hồ sơ

Tái sử dụng User làm định danh, thêm `InstructorProfile` nếu thiếu: userId, slug, displayName, bio, expertiseTags, avatar/public links, status, publishedAt. Role và thông tin công khai là hai việc khác nhau: công bố profile không tự nâng quyền.

Giảng viên sửa hồ sơ của mình theo policy, admin duyệt/publish/archive; có kiểm tra slug, URL/image và audit. Không sửa thông tin người khác bằng userId trong body.

Public DTO không có email đăng nhập, password/reset token, wallet, phone riêng hoặc chi tiết role/permission nội bộ.

### 6.5 API và nghiệm thu

Đề xuất `GET /instructors`, `GET /instructors/:slug`, `GET /instructors/:slug/courses`; authoring dùng route riêng có quyền, ví dụ `PATCH /me/instructor-profile` và action duyệt admin. Chọn path thống nhất conventions hiện hành.

Test: profile draft không public; người A không sửa B; số khóa chỉ tính published, lọc/search/pagination đúng; DTO không lộ riêng tư; khóa trên profile đúng instructor_id; slug sai trả 404; chưa có profile có empty state; thêm instructor mới không phải sửa frontend seed.

## 7. Chuyển Luyện tập vào khóa học: nghiệp vụ và giao diện

### 7.1 Mục tiêu

Luyện tập trở thành **một loại hoạt động của khóa**, gắn bài/chương cụ thể và dùng chung quyền học, tiến độ, bản nháp. Người dùng không cần rời khóa để vào một hub toàn hệ thống rồi tự chọn lại công nghệ.

Không chỉ xóa nút trên header. Cần sửa UI, routing, data binding, authorization, draft/attempt/history và migration cùng nhau.

### 7.2 Vị trí trong phòng học

**Sidebar giáo trình** có các hoạt động được sắp xếp:

```text
Khóa A
  Chương 1
    [Video] Bài 1: Kiến thức nền
    [Bài tập] Áp dụng kiến thức Bài 1
    [Sửa lỗi] Tình huống liên quan
    [Quiz] Kiểm tra chương 1
  Chương 2 ...
  [Dự án] Bài tổng kết nếu khóa có
```

- Mỗi item có loại, title, thời lượng tham khảo, trạng thái, điều kiện mở nếu có.
- Chọn Video hiển thị player; chọn Bài tập/Sửa lỗi hiển thị workspace; chọn Quiz hiển thị câu hỏi. Không giữ một video khổng lồ và một editor khổng lồ chồng nối tiếp mọi lúc.
- Ngay dưới bài video có CTA **Luyện bài này** và **Bài tiếp theo**, chỉ hiện khi có binding thật.
- Một tab **Thực hành** trong khóa cho xem toàn bộ bài của khóa, filter theo chương/trạng thái; không cần một trang global ở menu công khai.
- Hỏi đáp/Ghi chú theo lesson vẫn giữ đúng ngữ cảnh, không tự xóa khi đổi activity type.

### 7.3 Điều kiện mở

Default đề xuất: học viên có enrollment hợp lệ được làm bài tập liên quan trong lúc học. Không mặc định bắt hoàn thành cả khóa hoặc xem một bài bất kỳ ở khóa khác để mở tất cả bài tập.

Nếu người soạn muốn gating, cấu hình theo từng binding:

| Policy | Ý nghĩa | Hiển thị khi chưa đủ |
| --- | --- | --- |
| IMMEDIATE | Đủ quyền khóa là có thể luyện | CTA bắt đầu/tiếp tục. |
| AFTER_LESSON | Cần hoàn thành lesson xác định | Nêu bài cần học và nút quay tới đúng bài. |
| AFTER_MODULE | Cần điều kiện chương xác định | Checklist điều kiện còn thiếu, không thông báo chung. |

Server kiểm tra policy từ dữ liệu quyền/tiến độ hợp lệ. `forceBypass`, localStorage hoặc enrolledCourses phía browser không phải bằng chứng quyền. Admin/instructor preview theo policy riêng, không biến preview thành enrollment học viên.

### 7.4 Dữ liệu binding và quyền tài nguyên

Tái sử dụng Exercise/Assessment versions và runner hiện có; thêm quan hệ khi thiếu, ví dụ:

```text
CoursePracticeBinding
  binding_id
  course_id
  module_id? / lesson_id?
  exercise_version_id hoặc assessment_version_id theo loại
  activity_type / position / status
  unlock_policy / prerequisite_ref?
  required_for_completion
```

- Lesson/module phải thực sự thuộc course; loại activity và FK tương ứng phải hợp lệ, tránh một binding vừa trỏ exercise vừa trỏ quiz sai quy tắc.
- Một bài dùng được ở nhiều khóa qua nhiều binding. Đọc theo binding B phải có quyền khóa B, không chỉ vì user được xem exercise đó ở khóa A.
- Draft/history gắn user + binding + contentVersion theo thiết kế; không chỉ dùng exerciseId khiến trộn bài giữa khóa/bài.
- Quiz attempt có owner, version, deadline và idempotency. Kết quả browser code chỉ là luyện tập, không tự thành điểm đáng tin để cấp xác nhận.
- Required_for_completion chỉ có tác dụng khi quy tắc chấm đáng tin đã được định nghĩa; không ép hoàn thành bằng cách gửi passed=true từ client.

### 7.5 API scoped theo khóa/bài

Hợp đồng đích minh họa:

| API | Quy tắc |
| --- | --- |
| `GET /courses/:courseId/practice` | Chỉ hoạt động thuộc khóa, metadata/visibility đúng quyền. |
| `GET /courses/:courseId/lessons/:lessonId/practice` | Lesson thuộc course và user có quyền/preview phù hợp. |
| `GET /practice-bindings/:bindingId` | Kiểm tra binding/course/enrollment/policy, không đoán ID đọc nội dung khóa khác. |
| `GET/PUT /practice-bindings/:bindingId/draft` | Own, version/conflict và context rõ. |
| `POST /practice-bindings/:bindingId/attempts` | Snapshot contentVersion, owner, authority/time policy. |
| API submit/run/grade/history hiện có được mapping | Server kiểm tra context ở mọi action, không chỉ khi tải list. |

Endpoint mới là đề xuất, chưa tồn tại. Nếu giữ API global cũ để tương thích/admin authoring, phải có policy thích hợp; không để nó thành đường vòng qua endpoint scoped.

### 7.6 Runner và player

- `PracticeHub.jsx` hiện đã import `runCodeInSandbox`, `checkTestCasesInSandbox` từ `frontend/src/utils/codeRunner`; đánh giá và tái sử dụng runner đó.
- Thay handler new Function trong Room, không copy nó sang tab Thực hành. Giữ comparator/async/timeout/output/runId/cleanup dùng chung với Học thử khi phù hợp.
- Giữ đúng runtime thật; React hook/SQL/Python không được chấm như JS thuần nếu thiếu adapter.
- Từ video sang bài tập: flush tiến độ/draft, pause player nếu thiết kế yêu cầu, giữ mốc resume. Trở lại video không nhảy về đầu trái lựa chọn.
- Bài học chọn trong giáo trình vẫn seek đúng start/end/video ID. Theo dõi cuối đoạn và autoplay phải dùng activity hiện hành, không callback của bài cũ.
- Tách thời gian đã xem với vị trí tua; lưu lỗi phải hiện chưa đồng bộ, không báo saved khi API thất bại.

### 7.7 Migration và đường dẫn cũ

1. Lập bảng mapping exercise/assessment hiện có → course/module/lesson bằng người soạn xác nhận, không đoán từ ID hoặc từ khóa rồi cấp quyền sai.
2. Backfill binding/version, giữ ID nội dung và lịch sử cần thiết; unique/index/constraint qua migration, không xóa DB để làm lại.
3. History cũ chưa xác định được khóa giữ như legacy record; không tự chuyển thành điểm hoàn thành khóa mới.
4. `/practice` cũ: nếu có context hợp lệ thì chuyển tới practice của khóa đó. Không có context thì dẫn chọn Khóa của tôi; chưa login thì giữ return context qua login. Không tự mở khóa đầu tiên như đã sở hữu.
5. Bỏ CTA Practice toàn cục ở header/footer/quick cards/profile shortcut. Thay bằng Giảng viên hoặc Bài tập trong khóa phù hợp vị trí.
6. Giữ chức năng ôn tập: từ Góc học tập chọn khóa → kỹ năng/bài cần ôn của chính khóa đó; không mất tính năng chỉ vì bỏ menu.

### 7.8 Test migration bắt buộc

Khóa A/B và hai người có quyền khác nhau; bài shared qua hai binding; chưa mua, hết quyền, prerequisite chưa đạt; đổi bindingId/lessonId; draft hai tab; assessment version; quay lại video; resume sau refresh/thiết bị khác; source code sai/đúng; legacy history và route /practice cũ. Không nhận “đã chuyển vào khóa” chỉ từ việc ẩn tab.

## 8. Thiết kế giao diện đẹp và gọn hơn

### 8.1 Header và chữ

- Header nền trắng, chữ/navy rõ, logo giữ nhận diện; hero navy chữ trắng, vàng chỉ nhấn có kiểm soát. Chữ Học không còn tối trên nền tối.
- Rút nhãn thành menu ở mục 1. Header một hàng khi đủ chỗ, hai hàng có chủ đích hoặc menu collapse khi thiếu; không xuống hàng ngẫu nhiên giữa login/register.
- Nút menu mobile có aria-label Mở menu, aria-expanded đúng; chọn route thì tự đóng, trả focus hợp lý.
- H1 đề xuất tĩnh: **Học lập trình để tự xây dựng sản phẩm**. Một dòng phụ ngắn, một CTA chính và một CTA học thử. Nếu giữ animation phải có reduced motion và không làm đổi chiều cao liên tục.
- Thống nhất tiếng Việt cho level: Cơ bản/Trung cấp/Nâng cao; font, spacing, radius, icon và button states dùng chung.

### 8.2 Trang chủ khoảng bảy khối

| Thứ tự | Khối | Nội dung giới hạn |
| --- | --- | --- |
| 1 | Hero + tìm kiếm | Từ khóa, chủ đề, level; CTA Khám phá/Học thử. Announcement là thanh phụ, không lặp nhiều banner. |
| 2 | Chủ đề nổi bật | Một hàng chips/cards nhỏ, lấy chủ đề thật. |
| 3 | Khóa nổi bật | Khoảng sáu card desktop, mobile ưu tiên ba và Xem tất cả; không render chín khóa rồi lặp lại cả chín ở mục khác. |
| 4 | Học thử | Hai–ba bài published có dữ liệu; lỗi API thì thông báo, không workspace rỗng. |
| 5 | Giảng viên | Hai–ba profile đã được phép công bố, link directory. |
| 6 | Nội dung cộng đồng | Hai–ba bài viết hoặc câu đã giải đáp, một khối, không nhiều vùng nội dung trùng. |
| 7 | FAQ/hỗ trợ gọn | Ba câu phổ biến và CTA xem Help; footer tối giản phía dưới. |

Sau login đặt Học tiếp gần đầu và giảm CTA khuyến mại tài khoản mới. Bỏ các vùng marketing không có căn cứ và các khối Lộ trình/Ưu đãi/Phổ biến lặp cùng catalog. Không tự cắt chức năng: các danh sách đầy đủ vẫn ở trang riêng.

### 8.3 Card khóa học

Chỉ cần ảnh, tên tối đa hai dòng, một mô tả ngắn, level/giảng viên, thời lượng có nguồn, giá thật và CTA **Xem khóa**. Học thử là action phụ nếu có preview; giỏ/so sánh/yêu thích có vị trí tiết chế.

Không để ba CTA lớn và hai lời hứa bảo hành/việc làm lặp trên mọi card. Chưa có review thì không hiện 4,9 và 340+. Phân biệt số phút video với workload dự kiến; số bài/giờ phải khớp nguồn giáo trình, không fallback 40 giờ cho khóa thiếu dữ liệu.

### 8.4 Trang chi tiết khóa

Nên có URL riêng để chia sẻ/refresh/SEO; modal hiện tại có thể giữ làm xem nhanh. Trang đầy đủ chia Tổng quan/Nội dung/Giảng viên/Đánh giá, khối giá rõ, preview và câu hỏi trước mua.

Nội dung chương hiển thị Video/Bài tập/Sửa lỗi/Quiz theo dữ liệu thật. Public chỉ thấy metadata cho phép và preview; nội dung/tài nguyên trả phí ở phòng học theo quyền. Tài liệu nếu có nằm trong bài hoặc Tài nguyên thực hành, không cần tab lớn “Kho giáo trình & tài liệu tải về” để cạnh tranh với nhu cầu mua/học.

Không dựng giáo trình placeholder như nội dung đã có. Khóa 7/8/9 thiếu curriculum phải hiện đúng trạng thái hoặc hoàn thiện thật, không dùng video React đổi tên.

### 8.5 Phòng học đích

```text
┌ Quay lại khóa | Tên khóa | Tiến độ | Hỗ trợ đúng ngữ cảnh           ┐
│ VÙNG HOẠT ĐỘNG CHÍNH                    │ GIÁO TRÌNH              │
│ Chọn Video: player + tên bài            │ Chương 1                │
│ Chọn Exercise: đề + editor + output     │  Video bài 1            │
│ Chọn Quiz: câu hỏi + trạng thái nộp     │  Bài tập bài 1          │
│                                        │  Sửa lỗi bài 1          │
│ [Trước] [Luyện bài này] [Tiếp]          │  Quiz chương            │
│ Ghi chú | Hỏi đáp | Tài nguyên theo bài │ Chương 2 ...            │
└──────────────────────────────────────────────────────────────────┘
```

Mobile: video/activity một cột, Nội dung mở drawer, editor và output thành tabs; toolbar không bị các nút nổi che. Một activity là một vùng làm việc, không nhân đôi editor từ Room và PracticeHub.

### 8.6 Announcement, modal và nút nổi

- Desktop announcement một hàng; mobile tối đa hai dòng nội dung ngắn với nút Xem gọn. Nếu cần nhiều chữ, để trong modal chủ động mở.
- Không auto-popup khuyến mại khi không tải được gói hoặc có 0 gói; không hiện trên checkout/phòng học/editor.
- Một điểm hỗ trợ nổi là đủ. Mở lại combo từ announcement/header hoặc vị trí không chồng lên chat; mobile tránh góc điều khiển quan trọng.
- Snooze 4 giờ dùng một nguồn/campaignVersion, có safe parse/storage error; đóng/ẩn không tạo lỗi trắng trang.

### 8.7 Footer, policies và nội dung trung thực

Footer ba nhóm: Nền tảng, Hỗ trợ, Điều khoản/quyền riêng tư. Mỗi link có route/trang đích thật. Link chưa có nội dung chưa nên giả như đã hoàn chỉnh bằng href="#" không tác dụng.

Rà lại các câu 15.000 tốt nghiệp, 94,8% có việc, 120 đối tác, mentor 24/7, blockchain, 100% review thật, 500+ bài, miễn phí 1 triệu. Chỉ công bố khi có nguồn/phạm vi/chính sách và khả năng thực hiện. Không tự lấy logo công ty/tiểu sử/thu nhập người khác làm testimonial.

Quà demo/credit khuyến mại và tiền thật phải được nhận diện. Hoàn tiền “không hỏi thêm” ở homepage cần khớp điều kiện thực tế trong Help/backend; không có hai chính sách khác nhau ở hai nơi.

## 9. Những luồng phải đầy đủ sau khi sửa

Không cần thêm nhiều module để gọi là đầy đủ. Các luồng đang cung cấp phải có tác dụng thật:

| Nhóm | Đủ nhu cầu nghĩa là | Tình trạng kiểm tra hiện tại |
| --- | --- | --- |
| Khám phá/mua khóa | Search/filter/so sánh/chi tiết → giỏ → server quote → payment/order → quyền học bền vững | Giao diện catalog/detail đã quan sát; API origin đang sai, chưa test mua. |
| Học thử | Trial đúng khóa/runtime → code/quiz → phản hồi → xem khóa → giữ context qua login | Bản Vercel đang dừng ở trạng thái tải; chưa kiểm thử runner online. |
| Chọn khóa | Input → rule có lý do → kết quả/empty/error đúng → so sánh/học thử | POST trên bản live báo 405; không được coi như không có khóa phù hợp. |
| Giảng viên | Directory/profile được phép → khóa published → học thử/hỏi đúng khóa | Chức năng mới đề xuất, chưa có. |
| Học chính thức | API enrollment → giáo trình riêng → chọn bài seek đúng → resume → lưu dữ liệu | Đã đọc source, chưa test phòng học có login; còn fallback curriculum/runner/progress cần sửa. |
| Luyện trong khóa | Binding đúng → quyền/policy → draft/run/attempt → kết quả/history theo khóa | Đang là hub global, cần migration và thay menu. |
| Cộng đồng/bài viết | Đọc/search → đăng/reply/accepted → report/moderate; article draft/publish | Live không tải được list, chưa test mutation/moderation. |
| Hỗ trợ | FAQ đúng policy → ticket riêng → staff phản hồi/status → người dùng theo dõi | FAQ live trống, form chưa gửi, chưa test persistence/thread. |
| Tài khoản | Đăng ký/login/reset/Google verified/session/role/owner → logout | Chưa test authenticated trong đợt này, không nhận PASS. |
| Quản trị/vận hành | Authoring/publish/profile/review/order/refund/audit/backup theo quyền | Cần test trên backend/DB triển khai sau khi fix DEP01. |

Catalog production là dữ liệu DB/API đã chốt. Không tạo order hoặc cấp quyền chỉ theo khóa nằm trong frontend fallback mà backend không có. Metadata/video/giáo trình/bài tập/giảng viên phải trỏ cùng ID/phiên bản hợp lệ.

### 9.1 Thanh toán và nạp ví cần sửa cụ thể

- Gộp một luồng checkout service cho mua lẻ/giỏ/combo theo phạm vi đang có; UI chờ kết quả server, không có nhánh setTimeout tự kết luận Completed.
- API fail/response HTML/null/timeout: giữ trạng thái lỗi hoặc đang đối soát, không xóa giỏ/cộng enrollment/trừ ví rồi thông báo thành công.
- Chuyển khoản/QR là pending cho đến khi có căn cứ xác nhận hợp lệ. Vẽ QR hoặc người học tự bấm xác nhận không chứng minh tiền vào.
- DEMO có nhãn và môi trường/quyền giới hạn; LIVE không nhận auto_confirm do học viên quyết định. Endpoint/admin action xác nhận phải có policy riêng.
- Transaction/idempotency cho ví/order/ledger/enrollment; xử lý double click, callback lặp, sai amount/currency/order và lỗi một phần.
- Nếu tích hợp payment provider, xác minh sự kiện theo tài liệu của chính provider. [Stripe Webhooks](https://docs.stripe.com/webhooks) chỉ là nguồn tham khảo về mô hình xử lý sự kiện, không là tài liệu tích hợp MBBank/VietQR và không yêu cầu chuyển cổng thanh toán sang Stripe.
- Quyền sau hoàn tiền dựa nguồn đã cấp; không làm mất quyền có từ trước hoặc hoàn quá giá trị đã trả. Chưa hỗ trợ nhánh nào thì UI/policy phải nói đúng.

## 10. Tệp cần sửa và kiến trúc đích

### 10.1 Mapping thực hiện

| Khu vực | Tệp/module đọc trước | Yêu cầu thay đổi |
| --- | --- | --- |
| Deployment/API | root/frontend vercel config, `frontend/src/services/api.js`, `hubApi.js`, backend bootstrap | API origin/namespace, env build, CORS, JSON/schema errors, health/version. |
| Routes | `frontend/src/App.jsx`, Header/Footer, entry routing | URL routes thật, Link/NavLink hoặc giải pháp router tương đương, deep links và Back/refresh. |
| Giảng viên | User/Course entities/repositories, components mới theo feature | Public profile/directory, own/admin authoring, không lộ account DTO. |
| Chuyển practice | `PracticeHub.jsx`, Room, curriculum, PracticeController/Service | Tách workspace khỏi global hub, binding/context/owner, policy, route legacy. |
| Runner | `frontend/src/utils/codeRunner`, handler Room hiện tại | Một engine phù hợp runtime, bỏ execution main context và số thời gian giả, cleanup/error/test. |
| Content | CourseCard, `utils/courseCurriculum.js`, curriculum modal/API | Metadata thật, curriculum riêng, preview/paid visibility, loại activity. |
| Home/marketing | Her/Offers/home sections/ConversionTriggers | Rút section trùng, headline/contrast, dữ liệu và cam kết có nguồn. |
| Promo/support | ComboNoticeBanner/ChatSupport | Không chồng nút, snooze/empty/error, nhãn và thời gian hỗ trợ thực tế. |
| Payment | CheckoutPage, App callbacks, CommerceService/DTO | Server authority, remove fake Completed, DEMO/LIVE, idempotency/ledger. |
| Tests/docs | Existing test/unit, integration/E2E config, frontend tests/OpenAPI | Cases sau sửa, source vs live vs mock rõ, cập nhật docs và traceability. |

Tên file có thể tách lại theo feature nếu cần, nhưng không refactor toàn bộ ứng dụng một lần. Giữ các thay đổi có thể review, không để App.jsx tiếp tục chứa mọi state và nghiệp vụ của site.

### 10.2 Dữ liệu và API mới tối thiểu

- InstructorProfile gắn User, có public projection và status.
- CoursePracticeBinding gắn Course/Module/Lesson với nội dung/version; draft/attempt/history theo binding và user.
- Course curriculum lấy nguồn chuẩn; khóa thiếu dữ liệu có trạng thái thật, không fallback khóa khác.
- API và frontend route phải dưới base/namespace đã chọn ở mục 5, tránh lại xung đột `/instructors`, `/courses` giữa JSON và trang HTML.
- Chỉ tối ưu query/index sau khi định nghĩa access/relations/pagination; TypeORM entity không đủ nếu service vẫn đọc mảng seed.
- Public endpoint không trả email riêng, password/reset hashes, wallet, tokens, hidden answers hoặc draft người khác.

### 10.3 Routing và hiệu năng

Chọn router phù hợp React/package hiện có, xử lý nested route và parameters. Có thể dùng React Router theo [tài liệu Routing chính thức](https://reactrouter.com/start/declarative/routing); không nâng major/migrate framework chỉ vì ví dụ dùng phiên bản mới.

Lazy load course player/editor, instructor/admin pages và các feature ít dùng; giữ loading/error boundary và tránh import mọi component vào initial bundle. Đo production entry/chunks/network sau thay đổi, không chỉ tăng chunkSizeWarningLimit để mất cảnh báo.

## 11. Bộ nghiệm thu cho AI sau khi chỉnh sửa

Các case dưới đây là **yêu cầu cần chạy sau sửa**, không phải test đã đạt trong lần kiểm tra này.

| Mã | Tình huống | Expected |
| --- | --- | --- |
| RET01 | GET catalog/trials/help trên đúng API origin/namespace | JSON/schema đúng, không HTML hoặc null thành công giả. |
| RET02 | API path không tồn tại, frontend route hợp lệ | API lỗi không SPA; frontend refresh hiển thị đúng trang. |
| RET03 | POST finder với input hợp lệ/không có match/API fail | Ba trạng thái đúng; lỗi triển khai không đổ cho ngân sách khách. |
| RET04 | API timeout/503/malformed JSON | Error/retry có hành động, không spinner mãi hoặc empty giả. |
| RET05 | Đăng nhập/Google/reset/session/role trên môi trường test triển khai | Danh tính/quyền đúng, user khóa/phiên thu hồi không dùng được theo policy. |
| RET06 | Wallet/QR/server checkout thất bại | Không Completed, không thêm quyền hoặc trừ số dư frontend thay server. |
| RET07 | Student gửi auto_confirm ở LIVE, DEMO không nhãn | LIVE từ chối/bỏ trường theo policy, DEMO nhận diện rõ và giới hạn quyền/môi trường. |
| RET08 | Double submit/callback lặp/thiếu tiền/lỗi giữa transaction | Không hai ledger/order hoặc cấp quyền lặp, rollback/đối soát đúng. |
| RET09 | Hai khóa A/B và user chỉ sở hữu A | Chỉ thấy/làm bài của A; đổi binding/course/lesson ID không vượt quyền. |
| RET10 | Một exercise dùng ở hai binding khác khóa | Quyền/progress/draft tính theo context đúng, không mở B nhờ có A. |
| RET11 | IMMEDIATE/AFTER_LESSON/AFTER_MODULE | Điều kiện và lời giải thích đúng server, không dựa một bài đã xem bất kỳ hoặc local flag. |
| RET12 | Video → bài tập → quiz → video | Pause/resume/seek/context/draft đúng, không reset hoặc cộng completion do click. |
| RET13 | Code đúng/sai/throw/loop/async/output lớn | Runner trả actual, timeout/cancel sạch, không đọc phiên app; không runtime 0,14s cố định. |
| RET14 | Khóa 7/8/9 hoặc khóa mới chưa có curriculum | Không dùng curriculum React giả; public/paid metadata và empty state đúng. |
| RET15 | History/draft legacy sau migration | Không mất dữ liệu, không tự biến thành completion mới, /practice cũ có đích đúng. |
| RET16 | Instructor list/detail/filter và profile draft | DTO public đúng, draft không lộ, courses thuộc đúng người, số liệu thật. |
| RET17 | Instructor A sửa profile/content B, admin publish | A bị chặn; admin đúng policy/audit, publish không tự đổi role. |
| RET18 | Mobile 360/390 và desktop/tablet | Không overflow/cắt controls; menu có label, chọn route tự đóng; CTA/tabs/focus đúng. |
| RET19 | Promo 0 gói/API lỗi, snooze/reload/4h, nút nổi | Không popup mua gói rỗng; lỗi/empty riêng; không chồng controls, preference bền vững. |
| RET20 | Footer/privacy/refund/contact và nội dung quảng bá | Link có đích thật, policy khớp khả năng/backend, không số liệu/claim thiếu căn cứ. |
| RET21 | Giảng viên có/không nội dung đủ, nguồn ảnh/tiểu sử | Empty/demo rõ, không tự bịa hồ sơ hoặc công khai thông tin riêng. |
| RET22 | Student thiết bị khác/logout/login và note/progress/attempt | Owner và persistence đúng, không lẫn tài khoản, API save lỗi không giả saved. |
| RET23 | Community/article/help sau khi API kết nối được | Đọc/đăng/reply/moderation/ticket workflow đúng và private; test DB thật, không chỉ mock. |
| RET24 | Build/lint/unit/integration/E2E và bundle production | Log theo SHA/env, public JSON đúng, scope/coverage rõ, bundle lazy-load được đo. |

Ưu tiên unit tests có ý nghĩa trong `test` cho quyền/binding, state transitions, grade, payment/idempotency và mapping. Integration dùng DB test riêng. Browser tests phải đi qua frontend → backend → DB; không đổi assert để biến hành vi sai thành PASS.

### 11.1 Evidence phải nộp theo mỗi đợt

Commit/deployment URL, môi trường, command/thao tác, expected/actual, status PASS/FAIL/NOT_RUN/BLOCKED, log/screenshot/DB assertion và giới hạn. Không ghi coverage 100% từ số tests pass; không nhận production pass chỉ vì build hoặc HTTP200 root.

Nếu không có credential/service để kiểm tra phần private, ghi rõ NOT_RUN/BLOCKED đúng phần phụ thuộc và hoàn thành các phần độc lập; không dùng quyền giả ở browser để minh họa như giao dịch thật.

## 12. Lộ trình chỉnh sửa vừa sức

| Đợt | Việc | Kết quả cần review |
| --- | --- | --- |
| 0 | Chốt HEAD/deployment, lưu evidence, mapping frontend/backend/config | Hiểu DEP01 và trạng thái dữ liệu, không reset/ghi đè source. |
| 1 — P0 | Kết nối/deploy backend thật, API client, routing namespace, payment fail-safe | JSON hoạt động, error states đúng, không success/grant giả; RET01–08 được kiểm tra. |
| 2 — P0/P1 | Binding/migration và runner Room, policy per course/lesson | Luyện tập trong khóa chạy thật, quyền/draft/history không mất; RET09–15/22. |
| 3 — P1 | Directory/profile Giảng viên, menu/route/legacy links | Public DTO/authoring đúng; thay Practice khỏi menu/quick cards/shortcut; RET16–17/21. |
| 4 — P1/P2 | Home/card/detail/footer, promo/mobile, nội dung trung thực | Bảy khối gọn, typography/contrast/focus, đúng dữ liệu; RET18–20. |
| 5 | E2E, community/help private, docs/ảnh/hiệu năng | RET23–24, bằng chứng triển khai thật và danh sách hạn chế cuối. |

Test/security/docs phải đi cùng mỗi đợt, không chờ cuối. Không yêu cầu viết lại auth/commerce đã đúng, nhưng các nhánh source nêu rõ trong báo cáo phải được xác minh và sửa đúng.

### 12.1 Definition of Done tổng thể

Người mới chọn khóa/học thử được; mua hợp lệ có quyền bền vững; vào học đúng giáo trình và mốc; thực hành/quiz ngay trong đúng khóa theo policy; lưu/ôn/hỏi đáp/hỗ trợ hoạt động; instructor/admin có công cụ lưu dữ liệu thật; website production dùng API/DB đúng và nội dung không gây hiểu nhầm. Mỗi điều cần case và bằng chứng, không đánh dấu theo số menu hoặc lời quảng cáo.

## 13. Prompt giao AI triển khai

> Hãy sửa EduViet theo tệp BAO_CAO_KIEM_TRA_VERCEL_VA_THIET_KE_LAI_EDUVIET_20261031.md trên code mới nhất của tôi. Baseline kiểm tra là 4c35660d25dc3b5054de3db5a12ab36900444546; đối chiếu HEAD/deployment hiện tại trước khi sửa. Ưu tiên DEP01/DEP02: Vercel đang trả SPA HTML cho API relative, Finder lỗi 405, vì vậy cần kết nối/triển khai NestJS thật và tách API namespace/origin với router frontend. Không làm dữ liệu demo trở thành production thành công giả. Sửa checkout/topup theo server authority, tách DEMO/LIVE và kiểm tra idempotency/ledger, không auto-confirm tiền thật từ body người học. Theo yêu cầu mới, đưa Luyện tập vào từng khóa/bài qua binding/policy/draft/attempt/history có quyền backend; bỏ nó khỏi menu/header/footer/quick cards toàn cục, xử lý /practice cũ không mất dữ liệu. Tái sử dụng codeRunner hiện có, thay new Function chạy trực tiếp ở Room, không runtime giả hoặc cấp điểm/chứng nhận từ client. Thay menu bằng Giảng viên: directory/profile/public DTO/khóa phụ trách và authoring đúng role, không bịa tiểu sử/số liệu hoặc public email riêng. Menu đích Khóa học, Học thử, Chọn khóa, Giảng viên, Cộng đồng, Hỗ trợ. Combo vẫn là announcement/modal, không thêm tab Combo/Tài liệu/Lộ trình. Làm gọn home/card/detail/footer/mobile theo mục 8, bỏ nội dung/claim không có căn cứ, giảm chồng nút/popup và duplicate sections. Giữ React/react-bootstrap, NestJS phân lớp, TypeORM/MySQL; migration giữ dữ liệu, không viết lại các phần đã ổn ngoài phạm vi. Cập nhật OpenAPI/UML/ERD/wireframe/traceability/README, chạy RET01–24 với unit/DB integration/browser tests phù hợp, log actual theo SHA và môi trường. Sau mỗi đợt báo phần đã sửa/tái sử dụng, file/migration, command/test thực sự đã chạy, lỗi/giới hạn và cổng nghiệm thu. Không fake PASS, không sửa lịch sử Git, không tự public deploy hoặc chuyển tiền thật ngoài yêu cầu rõ của phiên triển khai.

## 14. Hồ sơ kiểm chứng và nguồn tham khảo

### 14.1 Evidence local của lần kiểm tra này

Thư mục: `C:/Users/nuicu/OneDrive/Documents/ChatGPT/webnangcao/.audit-eduviet-vercel-20261031`.

- `public-api-results.json`: chín GET, status/Content-Type/prefix/hash.
- `bundle-api-evidence.json`: URL/SHA bundle, đoạn fetch relative, so khớp build local.
- `verification-summary.json`: command/phạm vi unit/build/lint, số liệu bundle và giới hạn.
- `browser-observations.json`: ghi chép quan sát UI được đối chiếu từ phiên browser, không phải transcript E2E tự động.
- `backend-unit.log`, `backend-build.log`, `frontend-build.log`, `frontend-lint.log`: output các command đã chạy.

Khi gửi AI ở máy khác, có thể gửi kèm evidence; các bảng trong MD vẫn ghi rõ kết quả và cách tái hiện. Log/snapshot không được thay thành kết quả của commit mới nếu chưa chạy lại.

### 14.2 Source anchors tại commit đối chiếu

- [Cấu hình Vercel](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/vercel.json).
- [API client frontend](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/services/api.js), [Hub API](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/services/hubApi.js).
- [CheckoutPage](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/components/CheckoutPage.jsx#L42), [App order callback](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/App.jsx#L634).
- [Commerce topup](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/lms/src/commerce/commerce.service.ts#L214).
- [Room runner](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/components/CourseLearningRoom.jsx#L325), [Curriculum fallback](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/utils/courseCurriculum.js#L743).
- [PracticeHub](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/components/PracticeHub.jsx), [PracticeController](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/lms/src/practice/practice.controller.ts).
- [Footer](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/Footer.jsx), [Marketing component](https://github.com/nguyenkhai05/nhom6-N01-26/blob/4c35660d25dc3b5054de3db5a12ab36900444546/frontend/src/components/ConversionTriggers.jsx).

### 14.3 Tài liệu kỹ thuật chính thức đã đối chiếu

[Vercel Rewrites](https://vercel.com/docs/routing/rewrites), [NestJS trên Vercel](https://vercel.com/docs/frameworks/backend/nestjs), [Vite env](https://vite.dev/guide/env-and-mode), [React Router routing](https://reactrouter.com/start/declarative/routing), [Payment event model tham khảo](https://docs.stripe.com/webhooks). Tra ngày 31/10/2026. Các thiết kế Giảng viên/binding/layout trong tệp là đề xuất riêng cho EduViet, không phải tính năng được xác nhận đã có.

**Trạng thái bàn giao:** đã kiểm tra public site, đối chiếu GitHub/source và chạy các command local được ghi ở mục 3; đã viết báo cáo/đặc tả. Chưa sửa code ứng dụng, chưa đăng nhập/giao dịch tiền thật, chưa xác nhận E2E production hoặc thực hiện deploy.
