# EDUVIET — ĐẶC TẢ CHUYÊN SÂU CHỌN KHÓA PHÙ HỢP, LUYỆN TẬP VÀ HỌC THỬ

**Ngày lập:** 30/10/2026. **Mục đích:** giao AI triển khai chi tiết ba phần người dùng ưu tiên.  
**Repo cục bộ:** `C:/Users/nuicu/vibe_coder/nhom6-N01-26-main`.  
**HEAD quan sát khi viết:** `37959a4`. **Loại tài liệu:** thiết kế đích và tiêu chí nghiệm thu, không phải kết quả đã triển khai.

## 1. Phạm vi, nền tảng hiện có và cách dùng

Tài liệu này bổ sung cho `TONG_HOP_EDUVIET_2026_BAN_CHI_TIET_VA_DINH_HUONG_HOAN_THIEN.md`, thay thế phần mô tả tổng quan ở các mục Học thử/Luyện tập/Chọn khóa bằng đặc tả cụ thể hơn. Không mở rộng phạm vi sang một website khác.

Giữ React + react-bootstrap, NestJS phân lớp, TypeORM/MySQL, auth/payment/enrollment hiện có. Giữ sáu menu trong tổng hợp mới; combo tiếp tục ở announcement/modal, không thêm tab Combo, Tài liệu hay Lộ trình.

**Đọc nhanh:** mục 2–5 là Chọn khóa phù hợp; mục 6–9 là Luyện tập; mục 10–12 là Học thử; mục 13–17 là dữ liệu/API, kiểm thử, trình tự thực hiện và prompt giao AI.

### 1.1 Những thay đổi trong source đã được ghi nhận

Ở lần đọc source này:

- Finder đã chuyển từ danh sách course_id cố định sang tìm từ khóa trong title/description/category; không còn fallback giá cũ tự nhân 1,3 trong nhánh được đọc. Cần nâng tiếp sang metadata có cấu trúc và lý do dựa trên dữ liệu.
- Trial đã có nhánh thực thi từng test case trong Worker. Không lặp lại kết luận cũ rằng toàn bộ Check vẫn chỉ dùng từ khóa. Tuy nhiên vẫn có nhánh theo trialId, input là biểu thức và comparator cần đặc tả thống nhất.
- API chi tiết trial đã loại solution_code; có endpoint lấy solution riêng. Endpoint riêng không đồng nghĩa đã có policy bảo vệ lời giải.
- Practice đã có Run trong Worker và assessment chấm ở service; cần chi tiết hóa vòng đời attempt, history, quyền, draft và phần ôn tập.

Đây là **quan sát mã nguồn chọn lọc, chưa chạy lại app/test**. AI thực hiện phải kiểm tra HEAD mới và tái sử dụng phần đang đúng, không tự áp lại bản audit ở commit cũ.

### 1.2 Kết quả sản phẩm mong muốn

```text
Khách chưa biết chọn gì
  → Khai nhu cầu → nhận gợi ý có lý do → so sánh → học thử đúng khóa
  → xem giá/chi tiết → đăng nhập/mua → học theo quyền hợp lệ

Học viên đang học
  → luyện kỹ năng hoặc sửa lỗi → nhận kết quả đúng → ôn phần chưa đạt
  → quay về bài học liên quan → tiếp tục đúng vị trí
```

Mỗi phần phải có dữ liệu, luồng chính, nhánh lỗi, quản trị nội dung và kiểm thử. Tạo thêm card/menu hoặc tăng số bài mẫu không đủ điều kiện hoàn thành.

## 2. Chọn khóa phù hợp — Màn hình và thao tác

### 2.1 CF01: Trang bắt đầu

- Tiêu đề: “Tìm khóa phù hợp với mục tiêu của bạn”. Nêu rõ kết quả từ thông tin tự khai, không phải chứng nhận trình độ hay cam kết việc làm.
- Một form bốn nhóm câu hỏi; có thể trình bày dạng stepper nhưng không bắt login để xem kết quả.
- Bắt đầu lại/Sửa lựa chọn rõ; không thu email/điện thoại làm điều kiện xem gợi ý.
- Load config từ API có version; đang tải, config lỗi, catalog chưa có khóa cần empty/error state phù hợp.

### 2.2 CF02: Bốn nhóm câu hỏi

| Nhóm | Trường/điều khiển | Quy tắc |
| --- | --- | --- |
| Mục tiêu | Chọn một goal đang được catalog hỗ trợ | Ví dụ FRONTEND, BACKEND, AI, FOUNDATION; không hiện lựa chọn không có nội dung phù hợp. Có giải thích ngắn thay vì nhãn công nghệ khó hiểu. |
| Nền tảng | Mới bắt đầu / Tự chọn kỹ năng đã biết / Chưa chắc | Khi chọn kỹ năng, cho multiple select theo taxonomy. “Chưa biết gì” không chọn đồng thời với HTML/CSS/JS. “Chưa chắc” không bị coi như đã đáp ứng prerequisite. |
| Ngân sách | Chưa xác định / Giới hạn bắt buộc / Có thể cân nhắc vượt | Nhập/chọn mức tối đa VND; 0 có nghĩa chỉ khóa miễn phí, khác với chưa xác định. Không coi giá vượt ngân sách là phù hợp hoàn toàn. |
| Thời gian | Số giờ/tuần hoặc Chưa xác định | Dùng tính lịch ước lượng khi có workload thật; không tự sinh lời hứa học xong trong 3–4 tuần cho mọi khóa. |

**Validation đích:** goal/skills/mode thuộc allowlist; tiền nguyên không âm; hours là null hoặc số hữu hạn trong giới hạn cấu hình, gợi ý 0,5–40 giờ/tuần. Từ chối NaN/Infinity, string sai kiểu, skills trùng hoặc mâu thuẫn. Giới hạn số phần tử/độ dài input.

Các giới hạn là đề xuất cần cấu hình, không phải giới hạn đã được chứng minh của sản phẩm. DTO phải có validation runtime; type TypeScript đơn thuần không kiểm tra JSON từ client.

### 2.3 CF03: Trang kết quả

Hiển thị tóm tắt điều kiện đã chọn, nút Sửa lựa chọn, tối đa ba gợi ý chính và các nhóm cần xem xét nếu có.

Mỗi card gồm:

1. Tên/level/giảng viên/giá lấy catalog hiện hành.
2. Hai hoặc ba lý do cụ thể: “Phù hợp mục tiêu làm giao diện”, “Bạn đã khai biết JavaScript”, “Giá trong giới hạn đã chọn”.
3. Prerequisite còn thiếu/chưa chắc; tuyệt đối không mặc định “đã sẵn sàng” chỉ vì khóa có từ React.
4. Thời lượng video, workload tổng ước lượng nếu được biên soạn, lịch dự kiến theo giờ/tuần và chú thích không bảo đảm tiến độ.
5. CTA Xem khóa, Học thử nếu có thật, Thêm so sánh. Đã sở hữu thì Vào học thay vì ép mua lại.

Đừng hiện “phù hợp 98%” như xác suất chắc chắn. Nếu dùng điểm nội bộ để giải thích, ghi đó là điểm xếp hạng theo rule, không là xác suất thành công của người học.

### 2.4 CF04: Không có gợi ý

- Nói điều kiện nào làm hết kết quả: ngân sách, prerequisite hoặc chưa có nội dung đúng mục tiêu.
- Cho người dùng tự nới một điều kiện và gửi lại; không tự đổi STRICT thành FLEXIBLE.
- Có Hỏi tư vấn gắn câu trả lời đã chọn theo consent, hoặc quay lại catalog.
- Không nhét khóa không phù hợp vào danh sách chỉ để tránh màn hình rỗng.

### 2.5 CF05: So sánh

- Thêm tối đa ba khóa, không trùng. Thanh chọn gọn, không che CTA trên mobile; có Bỏ/Xóa hết.
- Bảng: mục tiêu/đầu ra, prerequisite, level, giá, workload có nguồn, dạng thực hành, runtime, giảng viên, preview, quyền đã sở hữu.
- Không có metadata thì “Chưa có thông tin”; không tự tạo lợi thế bằng giá cũ, rating hoặc thời lượng giả.
- Mobile mặc định so hai khóa hoặc lần lượt từng cột có nhãn; lựa chọn thứ ba vẫn quản lý được.
- URL giữ IDs/tab cần thiết; giá/quyền lấy lại từ server. Browser có thể cache IDs lựa chọn, không cache quyền như nguồn quyết định.

## 3. Chọn khóa phù hợp — Thuật toán đích có thể kiểm thử

### 3.1 Metadata cần có

| Trường | Ý nghĩa | Ai quản lý? |
| --- | --- | --- |
| goals/goalFit | Goal có hỗ trợ và mức liên quan đã biên soạn | Giảng viên đề xuất, người có quyền duyệt. |
| prerequisites | Nhóm kỹ năng required/recommended, quan hệ AND/OR | Nội dung khóa; không suy ra tùy ý từ chuỗi mô tả. |
| level | Beginner/Intermediate/Advanced theo quy ước chung | Giảng viên/admin. |
| outcomes/skillsTaught | Các kỹ năng thực sự dạy | Người phụ trách khóa. |
| videoMinutes/estimatedPracticeMinutes | Nguồn thời lượng và workload ước lượng | Từ giáo trình/biên soạn, có ngày/version. |
| price/status/visibility | Giá và khả năng được giới thiệu | Catalog hiện hành. |
| publishedPreview | Trial/lesson preview thực sự có quyền public | Từ dữ liệu trial/lesson, không hardcode ID. |

Tránh dò substring ngắn như `ai`, `ui`, `next` trong văn bản tự do để quyết định mục tiêu. Từ khóa có thể hỗ trợ gán nhãn khi soạn, nhưng metadata đã duyệt mới là nguồn xếp hạng đích.

### 3.2 Phân loại điều kiện đầu vào

- `READY`: các prerequisites bắt buộc đã được đáp ứng theo thông tin tự khai.
- `CHECK_PREREQUISITES`: người dùng chưa chắc, còn điều kiện chưa được xác định.
- `NEEDS_FOUNDATION`: đã xác định còn thiếu prerequisite bắt buộc.

Ví dụ React yêu cầu HTML/CSS **và** JavaScript thì biết mỗi HTML/CSS chưa đủ. Nếu có nhánh JavaScript **hoặc** kinh nghiệm tương đương, phải được người soạn cấu hình rõ; không tự đổi AND thành OR.

Các khóa NEEDS_FOUNDATION không gắn nhãn sẵn sàng. Có thể hiện trong khu “Cần chuẩn bị thêm”, ngoài gợi ý chính, với giải thích. Không xây lại menu Lộ trình nhiều tầng chỉ để xử lý trường hợp này.

### 3.3 Lọc trước khi chấm điểm

1. Khóa published, public và còn được phép bán/giới thiệu theo policy.
2. Có metadata phù hợp goal, không thuộc nhóm không liên quan.
3. Budget STRICT: loại khóa vượt max; max=0 chỉ chấp nhận khóa miễn phí.
4. Xác định readiness; không cho phần giá rẻ bù mất prerequisite bắt buộc.
5. Xử lý khóa đã sở hữu với nhãn/CTA riêng. Không gợi ý mua lại cùng quyền hiện hành.

### 3.4 Công thức tham khảo `finder-v2`

Đây là **lựa chọn thiết kế đề xuất**, cần version và bộ test, không phải thuật toán đã tồn tại:

```text
G = độ liên quan goal theo metadata, trong [0,1]
P = 1 nếu READY; 0,5 nếu CHECK_PREREQUISITES
B = 1 nếu trong budget hoặc khóa miễn phí
    0,5 nếu budget chưa xác định (giá trị trung tính)
    maxBudget / price nếu FLEXIBLE và price vượt maxBudget

score = 60*G + 30*P + 10*B
```

- NEEDS_FOUNDATION không dùng P thấp để chen vào gợi ý “sẵn sàng”; xử lý riêng như trên.
- B có giới hạn [0,1], không chia cho 0; budget=0/price>0 trong FLEXIBLE cho B=0, kèm cảnh báo vượt ngân sách.
- Sắp READY trước CHECK_PREREQUISITES, rồi score giảm dần, rồi courseId tăng dần để ổn định. Tối đa ba gợi ý chính, đánh nhãn readiness rõ.
- Ví dụ G=1, P=1, B=0,5 thì score=95. Đây là điểm rule, không phải tỷ lệ người dùng sẽ học thành công.
- Giờ/tuần dùng cho thông tin lịch học, **không giả có trọng số khi thiếu workload**. Nếu muốn đưa vào score phải tạo rule version khác và giải thích ảnh hưởng.
- Không dùng hoa hồng/doanh thu để âm thầm tăng điểm phù hợp. Thứ tự người dùng chọn phải tái hiện được từ input và version.

### 3.5 Ước lượng thời gian

Nếu có workload hợp lệ: `estimatedWeeks = ceil((videoHours + estimatedPracticeHours)/hoursPerWeek)`. Ví dụ tổng 30 giờ và 5 giờ/tuần → khoảng 6 tuần, kèm chú thích tùy tốc độ thực tế và không tính các gián đoạn.

Nếu chỉ có thời lượng video, chỉ hiện thời lượng video; không gọi đó là tổng thời gian hoàn thành khóa. Không hardcode mọi khóa thành các bài 8–15 phút hoặc học xong 3–4 tuần.

### 3.6 Quản trị rule và nghiệp vụ lỗi

- Config draft → validate → preview trên fixture → publish version; có rollback version và audit.
- Sửa câu trả lời rồi gửi lại phải nhận kết quả request mới nhất; response cũ tới muộn không ghi đè.
- Course ngừng bán/đổi giá sau khi mở kết quả: refresh metadata khi vào chi tiết/checkout; có thông báo thay đổi, không giữ quote giả.
- Khi đọc lại kết quả đã lưu, ghi version cũ và cho cập nhật; không hứa thứ tự bất biến sau khi catalog đổi.

## 4. Chọn khóa phù hợp — Hợp đồng API và ví dụ

Giữ `GET /course-finder/config`, `POST /course-finder/recommendations`, `GET /courses/compare` hiện có nếu phù hợp. Trường mới cần migration/adapter tương thích; không đổi DTO khiến client cũ bị hỏng ngầm.

### 4.1 Request đích minh họa

```json
{
  "configVersion": "finder-v2",
  "goal": "FRONTEND",
  "experienceMode": "SELECTED",
  "knownSkills": ["HTML_CSS", "JAVASCRIPT"],
  "budgetMode": "STRICT",
  "budgetMaxVnd": 1000000,
  "hoursPerWeek": 5
}
```

`experienceMode`: BEGINNER/SELECTED/UNSURE. BEGINNER và UNSURE không nhận skills mâu thuẫn; giá trị legacy ZERO cần mapping rõ. Budget UNSPECIFIED đi cùng max=null; hours=null là chưa xác định. Không mặc định số 0 thành “chưa chọn”.

### 4.2 Response đích rút gọn

```json
{
  "requestId": "sample-request",
  "ruleVersion": "finder-v2",
  "items": [
    {
      "courseId": 22,
      "readiness": "READY",
      "rankingScore": 100,
      "reasons": [
        {"code": "GOAL_MATCH", "text": "Phù hợp mục tiêu làm giao diện"},
        {"code": "PREREQUISITES_MET", "text": "Đáp ứng HTML/CSS và JavaScript theo thông tin bạn khai"},
        {"code": "WITHIN_BUDGET", "text": "Giá hiện tại nằm trong giới hạn đã chọn"}
      ],
      "missingPrerequisites": [],
      "estimatedWeeks": 6,
      "previewTrialId": 7,
      "owned": false
    }
  ],
  "needsPreparation": [],
  "notice": "Gợi ý dựa trên thông tin tự khai; lịch học là ước lượng."
}
```

Các ID/số liệu là **fixture minh họa**, không phải khóa hoặc response thật của EduViet. Course DTO/giá thực được lấy từ catalog, không gán ID 22 thành kết quả mọi tình huống.

API phải có error code như INPUT_INVALID, CONFIG_CHANGED, CATALOG_UNAVAILABLE; kết quả rỗng là 200 với lý do, không bắt buộc 500. Public payload không chứa thông tin giảng viên riêng, token hoặc nội dung khóa chưa có quyền.

## 5. Chọn khóa phù hợp — Checklist nghiệm thu riêng

| Mã | Tình huống | Mong đợi |
| --- | --- | --- |
| CF-T01 | Người mới, goal có khóa foundation và khóa advanced | Foundation sẵn sàng; advanced thiếu nền tảng không bị gắn READY. |
| CF-T02 | Biết HTML/CSS nhưng thiếu JavaScript, khóa cần cả hai | Missing prerequisite JavaScript, không coi OR. |
| CF-T03 | Chọn UNSURE | Không tự khẳng định đủ điều kiện. |
| CF-T04 | Budget STRICT thấp hơn mọi khóa | Không kết quả phù hợp, đề xuất chỉnh điều kiện; không tự nới budget. |
| CF-T05 | Budget 0 và budget null | 0 lọc miễn phí nếu strict; null không áp trần giá. |
| CF-T06 | FLEXIBLE, khóa vượt ngân sách | Có cảnh báo, budget score đúng, không ghi “trong ngân sách”. |
| CF-T07 | Thêm khóa ID mới với metadata đúng | Tự tham gia ranking, không sửa service theo ID. |
| CF-T08 | Đổi tiêu đề có substring ai/ui nhưng metadata không liên quan | Không bị gán sai goal. |
| CF-T09 | Workload thiếu hoặc hours chưa xác định | Không tự sinh số tuần/cam kết chung. |
| CF-T10 | Draft/ngừng bán hoặc đã sở hữu | Visibility và CTA đúng, không mua trùng quyền. |
| CF-T11 | Hai request liên tiếp, request cũ trả chậm | UI giữ kết quả request mới. |
| CF-T12 | So sánh trùng/sai/quá ba, mobile | Validate và bố cục đúng; không lộ private DTO. |

Đây là các expected cần test, chưa phải kết quả chạy. Rule unit tests phải dùng fixture có metadata khác nhau, có case tie-break và readiness, không chỉ assert top1 là một ID quen thuộc.

## 6. Luyện tập — Các màn hình và trải nghiệm

### 6.1 PR01: Trang kho bài

Các tab chính: **Luyện kỹ năng · Sửa lỗi · Đánh giá/Phỏng vấn · Ôn tập của tôi**. Thử thách tuần đã có có thể là mục phụ, không bắt buộc thi đấu hoặc thưởng.

Card bài cần: tiêu đề, skill tags, độ khó, loại bài, runtime, thời gian tham khảo, trạng thái cá nhân, quyền miễn phí/theo khóa và CTA Bắt đầu/Tiếp tục. Bài đã làm được nhưng đã xem lời giải có nhãn phù hợp, không làm mất lịch sử.

Filter search/tags/level/type/status; pagination server, URL giữ filter. Khách xem catalog và làm phần public; lịch sử cá nhân/ôn tập cần login. Bài khóa hiện điều kiện mở rõ, không chặn bằng UI rồi để API trả toàn bộ nội dung.

### 6.2 PR02: Chi tiết đề

Trước khi vào code, người học phải biết:

- Tình huống, yêu cầu phải làm, điều kiện đầu vào/đầu ra.
- Hàm/entry point cần hoàn thiện, định dạng return, ví dụ, ràng buộc và điều gì không nằm trong phạm vi.
- Runtime thực và thư viện được hỗ trợ; bài mô phỏng phải được ghi rõ.
- Tiêu chí chấm, policy gợi ý/lời giải, dữ liệu nào được lưu.
- Với bài sửa lỗi: triệu chứng, mã đang lỗi, hành vi đúng và cách tái hiện.

Không buộc mở nhiều modal để đọc hết đề. Trong workspace vẫn xem được đề và ví dụ; không xóa code khi quay lại mô tả.

### 6.3 PR03: Workspace

Desktop: hướng dẫn cột trái, editor và output/test cột phải hoặc ba vùng nếu đủ rộng. Mobile: tabs Đề bài/Code/Kết quả, trạng thái chạy và lưu vẫn nhìn thấy.

| Hành động | Tác dụng | Trường hợp cần xử lý |
| --- | --- | --- |
| Chạy | Chạy snapshot code hiện tại, hiện stdout/lỗi thật | Không đồng nghĩa đạt bài; không tự cấp điểm. |
| Kiểm tra/Nộp | Chạy tests/chấm theo authority quy định | Code đã đổi sau lần chạy phải hiện kết quả cũ, không gắn tick cho bản mới. |
| Dừng | Terminate tác vụ đang chạy, dọn timer/resources | Response cũ không ghi đè tác vụ mới. |
| Gợi ý | Mở gợi ý từ khái niệm tới hướng giải | Không mở toàn bộ lời giải ngay như default. |
| Khôi phục | Nạp starter code version hiện tại | Xác nhận khi có thay đổi, không xóa lịch sử/bản đã nộp. |
| Xem lời giải | Mở theo policy, ghi đã tham khảo khi có lưu | Không nhận là tự giải; public solution không được gọi là bí mật. |
| Lưu | Save draft theo owner/contentVersion/context | Hiện Đang lưu/Đã lưu/Lỗi/xung đột, không chỉ alert. |

Editor được giữ khi chuyển tab. Nếu cho sửa trong lúc chạy, kết quả gắn với codeHash đã chạy; sửa tiếp làm nhãn “Kết quả thuộc bản trước”.

### 6.4 PR04: Kết quả và bước tiếp

- Tổng số case đạt và từng case public: input, expected, actual thật, lỗi/thời gian khi đo được.
- Phân biệt: sai logic, syntax error, runtime error, timeout, output quá lớn, adapter chưa hỗ trợ, hệ thống chấm lỗi.
- Bài sai: gợi ý kỹ năng liên quan hoặc hint tiếp theo; không thay mọi lỗi bằng “Chưa đạt”.
- Bài đạt: bài tương tự khó hơn hoặc quay về lesson liên quan; nếu đã mua, ưu tiên nội dung có sẵn.
- Lưu lịch sử: ngày, version đề, trạng thái, score có nguồn, hint/solution usage khi policy cần, code snapshot theo retention.

### 6.5 PR05: Ôn tập của tôi

- Danh sách kỹ năng/câu chưa đạt, có số lượt/cỡ mẫu và liên kết xem kết quả cũ.
- Tạo phiên ôn mới theo kỹ năng hoặc chọn bài; không sửa record lần làm trước.
- Không đủ dữ liệu thì gợi ý luyện cơ bản, không dựng biểu đồ điểm yếu có sẵn.
- Được chọn bỏ qua/đổi kỹ năng; ôn tập không tự thêm giỏ hoặc ép mua khóa.

## 7. Luyện tập — Bộ chấm và nội dung cụ thể

### 7.1 Hợp đồng bài code

Đề xuất cho bài JavaScript dạng hàm:

```json
{
  "exerciseVersionId": "ex-async-v2",
  "runtime": "JAVASCRIPT_BROWSER",
  "entryPoint": "fetchAllUserData",
  "functionType": "ASYNC",
  "resultType": "JSON",
  "comparator": {"type": "DEEP_EQUAL", "arrayOrder": "EXACT"},
  "limits": {"totalTimeoutMs": 3000, "maxOutputLines": 200, "maxOutputBytes": 65536},
  "publicTests": [
    {
      "id": "case-empty",
      "args": [[]],
      "expected": [],
      "injectedArguments": [{"position": 1, "fixtureId": "MOCK_USERS_FETCH_V1"}]
    }
  ]
}
```

Đây là schema minh họa, không phải bản ghi đã có. Fixture là adapter dữ liệu của đề, không phải code người học gửi lên để backend tự chạy. Position tính từ 0: fixture trên chèn mockFetch vào đối số thứ hai sau userIds. Fixture ID phải thuộc allowlist đã biên soạn; không nhận định nghĩa hàm thực thi từ payload người học. `args` chứa dữ liệu JSON có cấu trúc, không chuỗi biểu thức để eval. Tên entry point được validate/allowlist theo định dạng, không nhúng input tùy ý vào code chính.

### 7.2 Comparator

- **Số:** exact hoặc tolerance tuyệt đối/tương đối theo đề; không tự làm tròn mọi kết quả. Tolerance công bố, có case biên.
- **Chuỗi:** giữ case/khoảng trắng mặc định; trim/normalize chỉ khi đề cho phép.
- **Array:** so cấu trúc, đúng thứ tự mặc định; unordered chỉ khi bài toán định nghĩa là tập/tập đa phần tử và xử lý duplicate rõ.
- **Object:** so giá trị và tập keys theo cấu trúc; thứ tự chèn key không làm một object tương đương bị sai. Không coi JSON.stringify đơn giản là deep equal đầy đủ.
- Không coi số 1 và chuỗi "1" là một. Output undefined/NaN/circular object hoặc không serialize được phải có lỗi/type rõ; bản MVP có thể chỉ hỗ trợ output JSON hợp lệ.
- Không chỉ in expected trong console để được tính đạt nếu đề yêu cầu return; comparator lấy giá trị trả về thực tế.

### 7.3 Bài sửa lỗi A — Bất đồng bộ

**Đề:** sửa `fetchAllUserData(userIds, mockFetch)` để trả Promise của danh sách kết quả, giữ thứ tự đầu vào, không trả trước khi các tác vụ hoàn tất.

**Fixture:** dữ liệu người dùng cố định, độ trễ kiểm soát để response có thể về khác thứ tự; không gọi API công cộng/ngẫu nhiên.

**Tests:** input rỗng; một user; nhiều user có độ trễ đảo thứ tự; ID lặp theo đúng policy giữ phần tử; mockFetch reject theo yêu cầu đề. Phải await Promise trước so actual.

**Lời giải hợp lệ:** for...of với await hoặc Promise.all nếu cùng đáp ứng hợp đồng. Không ép học viên dùng đúng một từ khóa/mẫu code.

**Sai cần bắt:** forEach async trả sớm; quên return Promise; kết quả sai thứ tự; nuốt lỗi trái hợp đồng. Một lời giải sai vẫn có chữ await/return không được qua.

### 7.4 Bài sửa lỗi B — Không làm đột biến state

**Đề:** `updateCity(state, newCity)` tạo state mới, cập nhật city của user và giữ input gốc không đổi; fixture là plain JSON, cấu trúc được cho trong đề.

**Tests:** input snapshot không đổi; city mới đúng; các field khác giữ giá trị; object ở đường dẫn được sửa có reference mới; edge input theo hợp đồng. Không bắt buộc mọi nhánh không đổi giữ reference nếu đề chỉ yêu cầu không mutation.

Nếu bài dùng hàm JS mô phỏng, gọi đúng là bài immutability. Chỉ nói đã test React re-render khi có adapter render/hook test thực sự. `useDebounce` cần môi trường React/timer phù hợp; không nhận chạy Worker JS thuần là kiểm thử hook React.

### 7.5 Hỗ trợ SQL/Python/React

- Chỉ bật Chạy/Kiểm tra khi adapter đúng runtime và bộ test có thể kiểm chứng.
- SQL luyện tập chạy trên dữ liệu mẫu cô lập, không nhận query tự do vào database kinh doanh. Dialect phải ghi rõ; SQLite không được quảng cáo như MySQL hoàn toàn tương đương.
- Python cần adapter Python thực; nếu chưa có, dùng câu hỏi đọc hiểu/sửa lỗi được ghi đúng hình thức và không giả output.
- React/hook cần transpile/render/timer hoặc test harness đúng; bài mô phỏng phải nói phạm vi.
- Giữ nội dung chưa có runtime ở trạng thái chưa hỗ trợ/chưa xuất bản tương ứng, không chấm bằng tìm từ khóa hoặc đổi tên ngôn ngữ thành JS một cách âm thầm.

### 7.6 Authority của kết quả

Luyện browser có thể lưu record với nhãn `BROWSER_PRACTICE`, dùng cho phản hồi cá nhân. Người dùng kiểm soát browser nên kết quả đó không là bằng chứng đáng tin để cấp chứng nhận, tiền thưởng hoặc quyền học.

Các điểm có giá trị nghiệp vụ dùng `SERVER_GRADED`: server chấm quiz bằng dữ liệu riêng hoặc runner server cô lập đã có. Nếu chưa có runner server an toàn, bản đầu chỉ xác nhận phần quiz/bài giảng theo policy; không dựng endpoint nhận `{passed: true}` từ client rồi chứng nhận đạt.

## 8. Luyện tập — Assessment, phỏng vấn và ôn tập có lịch sử

### 8.1 PR06: Trước khi bắt đầu

Hiện chủ đề, số câu, thời lượng, ngưỡng đạt, số lần được làm/cooldown nếu có, quy tắc xem đáp án và tác dụng của điểm. Không gọi kết quả là đánh giá chuẩn hóa nghề nghiệp khi chưa có cơ sở.

Khách có thể xem bộ đề công khai; lưu kết quả cá nhân, giới hạn lần làm và thông tin điểm yếu cần identity phù hợp. Không chỉ truyền assessmentId + answers và nhận điểm không gắn một attempt cụ thể nếu đang công bố history/time limit.

### 8.2 Vòng đời attempt

```text
CREATED → IN_PROGRESS → SUBMITTED → GRADED
                   └→ EXPIRED → GRADED theo đáp án đã lưu hợp lệ
```

- Bắt đầu trả attemptId, assessmentVersion, startedAt, deadlineAt, serverNow; user/đề/thời hạn do server quyết định.
- Đáp án autosave có version/sequence và trạng thái; response cũ không ghi đè lựa chọn mới.
- Refresh tiếp tục cùng attempt nếu còn thời gian; sửa đồng hồ máy không tăng thời lượng.
- Server không nhận thay đáp án sau deadline. Nếu finalize khi hết giờ, dùng đáp án đã lưu hợp lệ; dữ liệu offline chưa đồng bộ không được giả là đã nộp.
- Submit idempotent: cùng attempt không tạo hai điểm; body conflict/state sai trả lỗi rõ. Cùng một câu không xuất hiện nhiều câu trả lời mâu thuẫn trong payload.
- Đề sửa giữa lượt không đổi assessmentVersion của attempt đang làm; lượt mới theo version mới.

### 8.3 Chấm và feedback

- Ưu tiên ID question/option ổn định theo version; nếu tương thích selected_index cũ, mapping ở server theo snapshot, không theo danh sách đề mới.
- Điểm theo trọng số, nằm 0–100; xử lý đề không có câu/weight tổng bằng 0 trước publish.
- Chỉ trả đáp án/giải thích theo policy sau khi hoàn tất. Trước nộp không có `correct_answer_index`, solution hoặc hidden expected trong DTO.
- Tách lỗi học viên với lỗi hệ thống chấm: hệ thống lỗi không tự chấm 0 hoặc dùng hết lượt khi chưa chốt chính sách.
- Kết quả có correct/total, score, pass threshold, kỹ năng và các bước ôn; không cam kết đủ năng lực đi làm.

### 8.4 Tính điểm yếu

Đề xuất bản đầu: dùng các attempt đã chấm hợp lệ trong 30 ngày, lấy kết quả gần nhất cho từng logical question để tránh làm lặp một câu làm sai lệch cỡ mẫu. Skill mapping theo phiên bản lúc chấm.

Gợi ý cấu hình: ít nhất năm câu khác nhau từ ít nhất hai lượt hợp lệ mới gắn nhãn cần ôn theo tỷ lệ đúng dưới 60%. Đây là ngưỡng sản phẩm đề xuất, không phải chuẩn đo lường khoa học. UI luôn hiện cỡ mẫu/khung thời gian và Chưa đủ dữ liệu khi thiếu.

Review session tạo bản chọn câu/bài mới, liên kết history và không ghi đè lượt cũ. Cho thay đổi mục tiêu ôn, không tự xếp hạng công khai hoặc gửi nhắc học khi chưa có opt-in.

## 9. Luyện tập — Checklist nghiệm thu riêng

| Mã | Tình huống | Mong đợi |
| --- | --- | --- |
| PR-T01 | Lọc nhiều kỹ năng/type/status và khóa có/không quyền | Catalog, quyền và empty state đúng, draft riêng. |
| PR-T02 | Hai lời giải tương đương, khác cách viết | Cùng đạt theo hợp đồng, không lệ thuộc từ khóa. |
| PR-T03 | Object khác thứ tự key, số khác chuỗi, array đảo thứ tự | Comparator theo kiểu và policy, không stringify sai. |
| PR-T04 | Async callback trả khác thứ tự hoặc reject | Await, order và lỗi đúng hợp đồng. |
| PR-T05 | Mutation input | Bị phát hiện khi đề yêu cầu bất biến. |
| PR-T06 | Sửa code trong lúc chạy, dừng rồi chạy lại | Kết quả gắn code snapshot/runId, response cũ bị bỏ. |
| PR-T07 | Runtime chưa hỗ trợ SQL/Python/React | Không fake Chạy/đạt bài; UI nói đúng trạng thái. |
| PR-T08 | Assessment 0/một phần/100%, duplicate answers, fake score | Server chấm đúng, validation/state/idempotency. |
| PR-T09 | Refresh, đổi clock, quá deadline và offline | Thời hạn server, phần chưa lưu được thông báo thật. |
| PR-T10 | Đề đổi giữa lượt, user khác đổi attemptId | Snapshot version giữ; owner/API chặn đọc/sửa. |
| PR-T11 | Điểm yếu chưa đủ mẫu, làm lặp một câu | Không kết luận giả, dedup/cỡ mẫu đúng. |
| PR-T12 | Ôn lại và login ở thiết bị khác | Lượt mới độc lập, history/draft/kết quả được lưu theo policy. |

Leaderboard/thử thách đã có dữ liệu demo phải được nhận diện; không gộp vào số người thật. Không yêu cầu xây mới tính năng thi đấu để đóng các test trên.

## 10. Học thử — Các màn hình và đường đi cụ thể

### 10.1 TR01: Danh sách học thử

Có search, tags/chủ đề, level, runtime/dạng bài. Card gồm tên bài, mục tiêu nhỏ sẽ làm được, khóa liên quan, thời gian tham khảo, miễn phí và CTA Bắt đầu/Tiếp tục.

- Danh sách lấy nội dung published và có liên kết khóa hợp lệ; giá/tên khóa lấy nguồn catalog, không snapshot cứng trong mảng trial mãi mãi.
- Từ khóa A bấm Học thử phải mở trial của A; không mặc định trial ID 1 cho mọi khóa.
- Một khóa có nhiều bài thử thì chọn rõ; không có thì ẩn CTA hoặc giải thích, không tự mở bài React cho khóa Python.
- Khách bắt đầu không cần payment, không mở modal đăng ký ngay trước mọi bài. Muốn lưu theo tài khoản mới login.

### 10.2 TR02: Workspace bài thử

**Thanh trên:** breadcrumb Khóa/Bài thử, runtime/version, thời gian tham khảo, trạng thái lưu và Thoát.

**Vùng Hướng dẫn:** mục tiêu, nội dung giải thích ngắn, ví dụ, yêu cầu và hints từng mức. Video chỉ xuất hiện khi bài có video thật; dùng cấu hình/mốc đúng bài, không tạo khung video rỗng bắt buộc.

**Vùng Editor:** starter code, cú pháp/runtime đúng, input mẫu/custom input khi hỗ trợ, Chạy, Dừng, Kiểm tra, Khôi phục. Không đưa hàm cần export vào danh sách hardcode theo trialId.

**Vùng Kết quả:** console, return value, test public, lỗi/cách sửa. Output theo code snapshot hiện tại; dùng aria-live hợp lý, không phát lại toàn bộ output dài làm phiền người dùng trợ năng.

Mobile dùng tabs Hướng dẫn/Code/Kết quả, không mất draft khi chuyển tab; toolbar không bị support/combo nút nổi che. Giữ nhãn tab đang có lỗi hoặc kết quả mới để dễ quay lại.

### 10.3 TR03: Học từng bước

Một bài thử 5–10 phút có thể có 3 bước:

1. Đọc ví dụ và hiểu mục tiêu nhỏ.
2. Sửa/hoàn thiện code hoặc trả lời câu hỏi.
3. Chạy, kiểm tra và đọc giải thích, rồi xem nội dung đầy đủ của khóa.

Thời gian là ước lượng biên soạn, không dùng countdown ép mua. Tiến độ bước không đồng nghĩa hoàn thành khóa. Các bước phải cùng bài/version và state nhất quán khi quay lại.

### 10.4 TR04: Gợi ý và lời giải

- Hint 1 gợi khái niệm; hint 2 gợi cấu trúc; hint 3 giải thích lỗi thường gặp. Không cần mọi bài đủ ba hint nếu nội dung ngắn.
- Xem lời giải là lựa chọn chủ động, có thông báo ảnh hưởng nhãn “tự làm” nếu policy sử dụng nhãn đó.
- Với bài thử public, có thể cho tham khảo lời giải theo thiết kế. Endpoint solution tách riêng hiện có không tự là kiểm soát truy cập; nếu giới hạn sau nộp thì phải enforce server trên identity/attempt hợp lệ.
- Không dùng hidden tests/đáp án private của bài thi như nội dung trial public. Lời giải mẫu của bài luyện không cần được quảng cáo như bí mật chống gian lận.

### 10.5 TR05: Hoàn thành và chuyển sang khóa

- Hoàn thành khi đạt tiêu chí của bài thử: code qua public tests thật hoặc quiz đạt theo config, không dựa đã click/xem modal.
- Hiện kết quả, kiến thức vừa thử, hạn chế phạm vi và lựa chọn Luyện thêm/Xem khóa đầy đủ.
- Khóa chưa mua: đến đúng trang chi tiết/giỏ với giá server; login giữ trialId/courseId và nguồn đi vào.
- Khóa đã có quyền: CTA Vào học hoặc Học tiếp; backend xác minh enrollment.
- Không cộng điểm/chứng nhận toàn khóa từ trạng thái trial do browser tự gửi; nếu chuyển kết quả thử sang tiến độ phải có mapping/version/policy và authority phù hợp.

### 10.6 TR06: Authoring và preview nội dung

Giảng viên đúng khóa quản lý title, summary, lesson link, instructions, starter code, entry point, function type, runtime/version, input schema, comparator, public tests, hints, solution và publish status.

Trước publish: chạy lời giải mẫu; kiểm tra ít nhất một code sai bị trượt; đảm bảo runtime có adapter; xác minh course/trial link, URL/video nếu có; kiểm tra public DTO và solution policy. Preview dùng cùng renderer/runner như học viên, không dùng một trang demo khác.

Sửa đề tạo version mới. Draft/attempt cũ vẫn tham chiếu version cũ; nếu không còn runtime tương thích phải có trạng thái hướng dẫn, không âm thầm chấm lại theo đề mới.

## 11. Học thử — Nội dung mẫu, runtime, lưu và bảo vệ dữ liệu

### 11.1 Ví dụ bài thử JavaScript có thể triển khai ngay

**Tên đề xuất:** “Tạo lời chào bằng hàm JavaScript”, liên kết khóa thật có nội dung phù hợp. Chỉ gắn nhãn React component nếu đã có JSX/render adapter.

**Hợp đồng:** `WelcomeCard({ name, role = "Học viên" })` trả chuỗi `Xin chào <name> - Vai trò: <role>`. Role mặc định khi thiếu thuộc tính; chuỗi rỗng được giữ theo hợp đồng, không tự chuyển thành default.

| Case | Arguments JSON | Expected |
| --- | --- | --- |
| Có role | `[{"name":"Nam","role":"Developer"}]` | `Xin chào Nam - Vai trò: Developer` |
| Thiếu role | `[{"name":"Linh"}]` | `Xin chào Linh - Vai trò: Học viên` |
| Unicode trong tên | `[{"name":"Hào","role":"Học viên"}]` | `Xin chào Hào - Vai trò: Học viên` |
| Role rỗng | `[{"name":"An","role":""}]` | `Xin chào An - Vai trò: ` |

So chuỗi theo policy được công bố; case role rỗng có khoảng trắng cuối từ định dạng mẫu, không bị một bước trim toàn cục thay nghĩa. Nếu muốn đơn giản hóa, thay hợp đồng và tests đồng bộ, không đổi comparator để che sai lệch.

Hai bài thử khác có thể là xử lý danh sách/immutable object bằng JS. Python/SQL/Docker bài hiện có phải giữ nhãn và adapter đúng; không tự thay công nghệ chỉ để làm đủ ba bài.

### 11.2 Runner dùng chung cho trial/practice

- Một bộ adapter/test contract dùng lại, thay vì hai phiên bản comparator/timer/hardcode export khác nhau ở hai component.
- Entry point/type/arguments từ cấu hình bài được validate; test input là JSON, không eval chuỗi biểu thức tải từ API.
- FUNCTION mode: gọi entry point với args, await Promise theo contract, thu return value và console. Bản đầu ưu tiên mode này để có kết quả xác định.
- Nếu giữ SCRIPT mode để chạy console tự do, nói rõ cách chờ async; không nhận đã kiểm tra xong chỉ vì script synchronous trả về trước timer/Promise ngoài contract.
- Mỗi test có môi trường sạch đủ để không phụ thuộc state test trước; có thể worker riêng hoặc isolation tương đương đã kiểm chứng. Shared state ngoài ý muốn không được tạo false pass.
- Đề xuất default tổng thời gian 3.000 ms, source tối đa 32 KiB và output 200 dòng/64 KiB, có override bị giới hạn theo runtime/bài. Đây là cấu hình đề xuất, không phải số đo đã đạt.
- Trial hiện dùng 3.000 ms, Practice Run hiện dùng 2.000 ms trong phần source đọc. Hai mức có thể khác nếu là policy có chủ đích; UI/FAQ/docs phải lấy config đúng, không hardcode lời giải thích mâu thuẫn.

### 11.3 Boundary thực thi

Worker tách luồng và không thao tác DOM trực tiếp, nhưng có thể gọi network APIs; không xem Worker là sandbox tuyệt đối. [MDN — Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

Thiết kế triển khai phải có:

- Bối cảnh runner không nhận token/session/secret của app; isolation origin/iframe/CSP và network policy phù hợp kiến trúc đã chọn.
- Không mở CSP/eval/network toàn ứng dụng để một bài chạy được. Dynamic execution chỉ trong runner riêng đã kiểm chứng.
- Message schema, instance/runId, kiểm tra source/nonce phù hợp; không tin message bất kỳ từ tab/iframe khác. Những kiểm tra này không biến kết quả do người dùng kiểm soát thành SERVER_GRADED.
- Cleanup timer, worker, blob URL, handler khi finish/error/timeout/cancel/unmount; phản hồi lỗi tạo Worker cũng được xử lý.
- Output truncate, serialization có lỗi/type rõ, không lưu/log mã nguồn riêng ngoài policy.
- Không hứa giới hạn RAM cứng hoặc chống mọi hành vi phá browser chỉ bằng Worker. Nếu cần chấm mã đáng tin/giới hạn tài nguyên chặt, dùng runtime server cô lập phù hợp; đây không phải lý do để chạy code người học trên server chính.

### 11.4 Bản nháp khách và tài khoản

**Khách:** có thể lưu draft tạm trong browser theo anonymous session/context/version và TTL; đây chỉ là tiện ích, không là bằng chứng danh tính/điểm. Có Xóa dữ liệu thử và xử lý storage không khả dụng.

**Đăng nhập:** hỏi nhập bản nháp khách vào account khi có dữ liệu khác; backend xác định owner từ phiên, không nhận userId tùy ý. Không tự nhập code/tiến độ của người dùng trước trên máy dùng chung.

**Tài khoản:** draft server có codeVersion/updatedAt, autosave gợi ý debounce khoảng một giây, flush khi đổi bài/route và có hàng chờ retry giới hạn. Không dựa duy nhất vào beforeunload để hứa không mất dữ liệu.

**Xung đột:** optimistic version/ETag; hai tab cùng sửa nhận conflict rõ, cho giữ bản đang gõ/copy/so sánh rồi lựa chọn. Không âm thầm last-write-wins làm mất bản mới hơn.

Không cache quyền học, wallet hoặc grade nghiệp vụ ở localStorage làm nguồn quyết định. Kết quả browser trial khi lưu vào account vẫn mang authority phù hợp, không tự trở thành điểm chấm server.

### 11.5 Ngữ cảnh và đường quay lại

- Dùng trialId/courseId/source trong router state/URL nội bộ đã validate; không nhận returnTo tùy ý dẫn ra domain lạ.
- Finder → Trial → Chi tiết → Login/Checkout đều giữ đúng khóa. Trở về trial không tự reset draft.
- Mua thất bại vẫn xem lại bài thử public; mua thành công mới nhận quyền học chính thức theo server.
- Khóa/trial bị archive hoặc đổi version giữa phiên phải có thông báo và lựa chọn phù hợp, không trắng trang hay load ngầm một bài khác.

## 12. Học thử — Checklist nghiệm thu riêng

| Mã | Tình huống | Mong đợi |
| --- | --- | --- |
| TR-T01 | Mở trial từ hai khóa khác nhau | Đúng course/trial, không luôn ID 1. |
| TR-T02 | Khách không đăng nhập bắt đầu trial public | Học được phần đã mở, không bắt payment. |
| TR-T03 | Đổi ID sang trial draft hoặc nội dung khóa | Backend kiểm tra visibility/enrollment. |
| TR-T04 | Correct code, wrong code cùng có return/+ | Actual từ thực thi; sai logic không pass. |
| TR-T05 | Thêm trial ID mới/entry point mới | Runner từ config, không cần thêm if trialId. |
| TR-T06 | Loop/throw/async/output lớn, Run rồi Check nhanh | Timeout/error/await/runId/cleanup đúng; không treo UI theo phép thử. |
| TR-T07 | Mở hints/solution | Đúng policy, không nhận endpoint riêng là bảo mật; public/graded answer tách rõ. |
| TR-T08 | Chuyển tab/mobile/đổi bài/refresh/login | Draft/context được giữ theo policy, không lẫn user. |
| TR-T09 | Hai tab sửa, storage hỏng, API save lỗi | Conflict/empty/error/retry rõ, không báo đã lưu giả. |
| TR-T10 | Finder → trial → login → checkout | Đúng khóa và giá server, không open redirect. |
| TR-T11 | Chưa mua/đã sở hữu/payment fail/khóa archive | CTA/quyền đúng; thử không tự mở nội dung trả phí. |
| TR-T12 | Giảng viên publish/sửa trial mới | Ownership/version/runtime/solution/tests hợp lệ, attempt cũ không bị đổi nghĩa. |

Các test public về sandbox phải chạy trong browser thật phù hợp; không lấy mock Worker làm bằng chứng cách ly đã đạt. Mọi kết quả runtime hiện vẫn là NOT_RUN trong tài liệu này.

## 13. Dữ liệu dùng chung và quản trị nội dung

### 13.1 Mô hình tối thiểu cần mapping

| Đối tượng đích | Trường/quan hệ cần rõ | Ràng buộc |
| --- | --- | --- |
| CourseSkill/Prerequisite/Outcome | Course, skill taxonomy, goalFit, required/recommended, AND/OR | Cùng nguồn catalog; không parse mô tả thay thế toàn bộ metadata. |
| FinderConfig | Version, câu hỏi, options, weights, status, publishedAt | Version immutable khi publish hoặc có lịch sử; admin policy/audit. |
| ExerciseVersion | Runtime, entryPoint, functionType, input/output contract, comparator, hints, status | Publish kiểm tra adapter/test/lời giải; version cũ còn tham chiếu được. |
| TrialConfiguration | Course/lesson/exerciseVersion, nội dung thử, visibility, CTA context | Trial thuộc khóa hợp lệ; không copy giá thành nguồn checkout. |
| TestCase | ExerciseVersion, JSON args, expected hoặc expectedError, visibility, order | Không input biểu thức eval; hidden test không trả DTO public. |
| CodeDraft | Owner, contentVersion, context TRIAL/PRACTICE/COURSE, code, version, updatedAt | Unique theo owner/contentVersion/context; CAS/ETag tránh lost update. |
| PracticeRun | Owner/session, exerciseVersion, codeHash, runtime, status, authority, safe result | Authority do server phân loại; browser result không tự thành SERVER_GRADED. |
| AssessmentVersion/Question/Option | Đề, trọng số, skill mapping, policy | Attempt dùng snapshot; answer key private đúng giai đoạn. |
| AssessmentAttempt/Answer | Owner, version, startedAt/deadline, state, answers, score, sequence | Owner/state/deadline; unique attempt-question; submit idempotent. |
| ReviewSession | Owner, question/exercise references, nguồn chọn, kết quả | Lượt mới độc lập, history không bị ghi đè. |

Tên model là thiết kế đích; có entity tương đương thì tái sử dụng. Không yêu cầu tạo cả bộ bảng thứ hai hoặc chuyển sang database khác. Query/ORM, indexes/FK/unique/migration phải mô tả theo schema thực tế.

### 13.2 Quản trị cho giảng viên/admin

- Danh sách nội dung theo khóa, runtime, status; editor có draft/preview/publish và lỗi theo trường.
- Giảng viên chỉ soạn nội dung khóa được giao; quyền publish theo policy. Admin không được thay thế ownership bằng input body hoặc ID cố định.
- Fixture/validator cấu hình có giới hạn, không cung cấp trường admin tự viết JavaScript/SQL để chạy trong server chính.
- Trước publish, tự chạy lời giải mẫu và các lời giải sai mẫu được lưu cho đề. Validation lỗi thì không publish.
- Thay runtime/schema/comparator tạo version hoặc migration tương thích; không sửa âm thầm để lịch sử trước đây sai thành đúng hoặc ngược lại.
- Changelog/audit lưu ai đổi gì và version, không ghi secret hoặc dữ liệu riêng vượt nhu cầu.

### 13.3 Phân lớp và dữ liệu cá nhân

Frontend quản lý form/editor/route/loading; service backend quyết định visibility, owner, quyền, rule, thời hạn và điểm đáng tin. Repository/TypeORM quản lý persist/query/transaction. Runner adapter là boundary riêng, không gắn trực tiếp code người học vào Nest service.

Chỉ lưu câu trả lời finder khi có nhu cầu/consent; khách có thể nhận gợi ý stateless. Draft/mã bài làm có retention và cơ chế xóa theo policy; không gửi mã riêng sang dịch vụ bên thứ ba chỉ để phân tích lỗi khi chưa được phép.

## 14. API đề xuất và xử lý lỗi thống nhất

Giữ conventions hiện có, không tự thêm prefix toàn repo. Endpoint mới dưới đây là **hợp đồng cần triển khai hoặc mapping**, không khẳng định đã tồn tại.

| Nhóm | API đích | Quyền/quy tắc |
| --- | --- | --- |
| Finder | GET `/course-finder/config`; POST `/course-finder/recommendations` | Public input validated, config/rule version, không PII bắt buộc. |
| Compare | GET `/courses/compare?ids=...` | Tối đa ba, public fields, owned theo phiên nếu có; route không xung đột `:id`. |
| Bài luyện | GET `/practice/exercises`; GET `/practice/exercises/:id` | Query validated/pagination; public hoặc enrollment theo item; đúng contentVersion. |
| Draft | GET/PUT `/practice/exercises/:id/draft`; endpoint draft trial tương đương nếu context khác | Own; expectedVersion/If-Match; conflict trả 409, không ghi đè im lặng. |
| Lượt luyện | POST `/practice/exercises/:id/runs`; GET `/me/practice/runs` | Nếu ghi browser run phải là authority BROWSER_PRACTICE; chấm server cần adapter riêng thực sự đã có. |
| Assessment list | GET `/practice/assessments`; GET `/practice/assessments/:id` | Metadata/đề theo policy, không answer key trước nộp. |
| Bắt đầu | POST `/practice/assessments/:id/attempts` | Auth hoặc guest session được thiết kế giới hạn; server time/version/owner. |
| Lượt làm | GET `/practice/attempts/:id`; PUT `/practice/attempts/:id/answers`; POST `/practice/attempts/:id/submit` | Owner/deadline/state/version/idempotency, từ chối score/role/userId tự khai. |
| Ôn tập | GET `/me/practice/skills`; POST `/me/practice/review-sessions`; GET `/me/practice/review-sessions/:id` | Own, dữ liệu đủ căn cứ, lịch sử mới độc lập. |
| Trial | GET `/trials`; GET `/trials/:id`; GET `/trials/:id/solution` theo policy | Published-only, course link đúng, public tests/solution và assessment private tách rõ. |
| Trial state | GET/PUT `/me/trials/:id/draft`; POST `/trials/:id/practice-runs` khi cần record | Own hoặc guest policy, state không tự tạo quyền/chứng nhận; API tránh trùng engine practice. |
| Authoring | CRUD/publish configs/exercise/trial/assessment versions trong route quản trị hiện có | Role+ownership, validation, preview/audit; DTO riêng người soạn. |

### 14.1 Runtime validation và response

Mỗi DTO có decorators/schema validation thực tế, allowlist fields, enum/range/size; không chỉ thêm `type`/union trong TypeScript. Tham khảo [NestJS Validation](https://docs.nestjs.com/techniques/validation), đối chiếu phiên bản package đang dùng.

Response lỗi an toàn: code, message, fieldErrors khi phù hợp, requestId. Không SQL stack/path server/token. HTTP 400 đầu vào, 401/403 danh tính/quyền, 404 không có/không được tiết lộ, 409 version/state conflict, 413 quá kích thước, 429 giới hạn tần suất; không trả mọi lỗi bằng 200.

Mã lỗi cần có: CONFIG_CHANGED, NO_MATCH là kết quả phù hợp chứ không lỗi hệ thống, VERSION_CONFLICT, ATTEMPT_EXPIRED, ALREADY_SUBMITTED, RUNTIME_UNSUPPORTED, EXECUTION_TIMEOUT, OUTPUT_LIMIT, RUNNER_UNAVAILABLE. Quy định mã trả ở body và status nhất quán; không dùng 500 cho người học code sai.

### 14.2 Bản ghi kết quả kiểm tra minh họa

```json
{
  "runId": "sample-run",
  "exerciseVersionId": "welcome-v2",
  "codeHash": "sample-code-hash",
  "authority": "BROWSER_PRACTICE",
  "status": "FINISHED",
  "passedCount": 1,
  "total": 2,
  "results": [
    {"caseId": "public-1", "passed": true, "actual": "Xin chào Nam - Vai trò: Developer"},
    {"caseId": "public-2", "passed": false, "actual": "", "reason": "VALUE_MISMATCH"}
  ]
}
```

Chỉ là mẫu hợp đồng. Actual/authority phải phản ánh cách thực thi thật; không gán SERVER_GRADED theo body client. UI không dùng mẫu này như fixture phản hồi cho mọi lần chạy.

### 14.3 Tương thích và khả năng vận hành

- API submit assessment cũ theo assessmentId cần adapter/deprecation khi chuyển sang attemptId; UI và tests phải đổi cùng đợt, không âm thầm bỏ history của user.
- Migrate input test từ chuỗi sang JSON có kiểm tra, không tự eval chuỗi để chuyển dữ liệu trong production.
- Rule/config/adapter version được ghi vào result, log có request/runId để debug; mã nguồn/output nhạy cảm không log thô mặc định.
- DB/service lỗi thì error/retry, không chuyển sang INITIAL seed rồi báo đã lưu/đạt bài. Seed chỉ trong môi trường/mode được nhận diện rõ.

## 15. User Stories và ma trận truy vết ba phần

18 stories chuyên sâu dưới đây cần mapping vào US/CA-US/DUS đã có, **không mặc định tăng thêm 18 stories mới trùng nghiệp vụ**. Khi đưa vào phần kết quả, phải có tests/evidence; ở đây là yêu cầu.

| Mã | User Story | Màn hình/thiết kế | Bộ case nghiệm thu |
| --- | --- | --- | --- |
| CF-US01 | Là khách truy cập, tôi muốn khai mục tiêu và nền tảng rõ ràng để hệ thống hiểu đúng nhu cầu chọn khóa. | CF01–02, validation | CF-T01, CF-T02, CF-T03 |
| CF-US02 | Là khách truy cập, tôi muốn nhận gợi ý có lý do dựa trên dữ liệu khóa để cân nhắc có căn cứ. | CF03, metadata/rule | CF-T07, CF-T08 |
| CF-US03 | Là khách truy cập, tôi muốn quy định ngân sách bắt buộc hoặc linh hoạt để không bị hiểu sai khả năng chi trả. | CF02–04, budget modes | CF-T04, CF-T05, CF-T06 |
| CF-US04 | Là khách truy cập, tôi muốn xem lịch học ước lượng có nguồn để tự sắp xếp thời gian. | CF03, workload estimate | CF-T09 |
| CF-US05 | Là người học, tôi muốn nhận kết quả theo tình trạng khóa và quyền đã có để không chọn mua lại nội dung mình đang sở hữu. | CF03–04, state/async | CF-T10, CF-T11 |
| CF-US06 | Là khách truy cập, tôi muốn so sánh tối đa ba khóa để nhìn rõ khác biệt trước khi quyết định. | CF05 | CF-T12 |
| PR-US01 | Là người học, tôi muốn lọc bài theo kỹ năng và trạng thái để chọn bài luyện đúng nhu cầu. | PR01–02 | PR-T01 |
| PR-US02 | Là người học, tôi muốn lời giải được chấm theo kết quả và hợp đồng bài để nhận phản hồi chính xác. | PR02–04, comparator/async/mutation | PR-T02, PR-T03, PR-T04, PR-T05 |
| PR-US03 | Là người học, tôi muốn lưu và tiếp tục bản nháp mà không mất kết quả đang làm để duy trì việc luyện tập. | PR03–04, draft/version/runId | PR-T06, PR-T12 |
| PR-US04 | Là người học, tôi muốn biết đúng runtime và dạng bài được hỗ trợ để không hiểu nhầm khả năng thực thi. | PR02–03, runtime policy | PR-T07 |
| PR-US05 | Là người học, tôi muốn làm assessment có thời hạn và lịch sử riêng để tự đánh giá theo quy tắc công bố. | PR06, attempt lifecycle | PR-T08, PR-T09, PR-T10 |
| PR-US06 | Là người học, tôi muốn ôn các kỹ năng có kết quả chưa đạt để cải thiện từ lịch sử của mình. | PR05, weak skills/review | PR-T11, PR-T12 |
| TR-US01 | Là khách truy cập, tôi muốn mở đúng bài thử của khóa đang cân nhắc để đánh giá nội dung trước khi mua. | TR01–02 | TR-T01, TR-T02, TR-T03 |
| TR-US02 | Là người học thử, tôi muốn chạy và kiểm tra bài trong workspace có phản hồi thật để hiểu kết quả thao tác của mình. | TR02–03, shared runner | TR-T04, TR-T05, TR-T06 |
| TR-US03 | Là người học thử, tôi muốn mở gợi ý hoặc lời giải theo quy tắc rõ để tiếp tục khi bị vướng. | TR04 | TR-T07 |
| TR-US04 | Là người học thử, tôi muốn giữ bản nháp qua chuyển trang hoặc đăng nhập để tiếp tục bài đang làm. | TR02, guest/user drafts | TR-T08, TR-T09 |
| TR-US05 | Là người học thử, tôi muốn chuyển tới đúng khóa và phương thức đăng ký sau trải nghiệm để mua hoặc vào học thuận tiện. | TR05, return context | TR-T10, TR-T11 |
| TR-US06 | Là giảng viên được phân quyền, tôi muốn soạn và kiểm tra bài thử theo phiên bản để nội dung public phản ánh đúng khóa. | TR06, authoring | TR-T12 |

### 15.1 Cách tổ chức test thực tế

- Unit backend trong `lms/test/unit`, gom theo finder/practice/trial; test rule/comparator/state/score/owner với case đúng/sai/ranh giới. Cấu hình phải thực sự nạp tệp.
- Unit/component frontend trong `frontend/test`, test form, result race, editor state và draft conflict bằng runner phù hợp. Không chỉ kiểm tra component render được.
- Integration Nest + MySQL riêng: persist/version/FK/ownership/transactions, start/deadline/submit và schema migration.
- Browser E2E: đường đi chéo ba phần, runtime thực, mobile/keyboard/refresh/login. Mock Worker chỉ dùng unit edge cases; không thay kiểm tra boundary browser thật.
- Không chạy destructive tests trên DB đang dùng; không dùng token thật trong fixture/ảnh/log.

### 15.2 Kịch bản end-to-end bắt buộc

1. Khách chọn goal → nhận gợi ý đúng ngân sách → so sánh hai khóa → mở đúng bài thử → làm đúng/sai → đến đúng chi tiết → login/mua → có quyền/học tiếp.
2. User làm bài async và mutation → xem actual lỗi → sửa đúng → lưu/đổi thiết bị → thấy history đúng → tạo phiên ôn.
3. Bắt đầu assessment → autosave → refresh → hết giờ/submit → grade đúng version → feedback có mẫu số → review session riêng.
4. Instructor tạo trial/exercise ID mới → preview → publish → user làm được mà không thêm nhánh hardcode ID → sửa version không phá record cũ.
5. Hai user/hai tab, stale API responses, mất mạng, storage hỏng, runtime chưa hỗ trợ; UI phản hồi thật và dữ liệu không lẫn.

Mỗi kết quả ghi commit, runId, môi trường, command/thao tác, expected/actual, PASS/FAIL/NOT_RUN/BLOCKED và log/screenshot/DB assertions. Số bài pass không tự là coverage hoặc tỷ lệ sản phẩm hoàn thiện.

## 16. Các đợt triển khai và cổng nghiệm thu

| Đợt | Việc cần làm | Điều kiện hoàn thành |
| --- | --- | --- |
| 0 | Đọc HEAD, map schema/routes/runner hiện có, chốt policy và nội dung | Tái sử dụng bản đã sửa; biết loại nào browser practice, loại nào server graded; không ghi đè code người dùng. |
| 1 | Finder metadata + form validation + rule version + compare | CF-T01–12 có test, gợi ý có lý do thật, không hardcoded ID/substring/cam kết thời gian chung. |
| 2 | Runner contract/comparator/async/cancel/output/runtime dùng chung | Run khác Check, entry point theo config, không eval test input, PR-T02–07 và TR-T04–06 có kết quả. |
| 3 | Practice draft/history/attempt/deadline/grade/review | Quyền/dữ liệu/time/version thật; PR-T01,08–12 được kiểm tra, không fake weak skills. |
| 4 | Trial workspace/hints/guest-login drafts/context mua/authoring | TR-T01–03,07–12 được kiểm tra, đúng course link, mobile và purchase context; trial không tự cấp quyền. |
| 5 | E2E, accessibility/mobile, regression và tài liệu | 36 cases và stories có evidence, known limitations rõ, OpenAPI/UML/ERD/README cập nhật. |

Không bắt buộc làm mọi adapter ngôn ngữ trong một đợt. Hoàn thành chắc một phạm vi nội dung/runtime công bố, còn phần khác đặt trạng thái đúng; không dựng nút giả hoặc âm thầm đổi ngôn ngữ bài.

### 16.1 Nội dung tối thiểu để nghiệm thu có ý nghĩa

- Catalog có metadata đủ cho ít nhất các khóa được đưa vào gợi ý, gồm case beginner/advanced, giá khác nhau, có/không preview và một khóa draft.
- Khoảng 12 bài luyện biên soạn thật ở hai hoặc ba kỹ năng: có bài sửa lỗi async, immutability và bài được chấm theo cấu trúc dữ liệu; không nhân bản để đủ số.
- Hai bộ assessment nhỏ có blueprint/skill tags và giải thích; đủ dữ liệu test cỡ mẫu bằng fixture, không bịa thành tích người dùng thật.
- Ba bài trial đại diện, liên kết đúng khóa/runtime, hints và lời giải được test; ID không cần là 1/2/3.
- Mọi seed được nhận diện trong môi trường demo; UI vận hành không fake số lượt học, score/ranking hay testimonials.

### 16.2 Bàn giao kỹ thuật và báo cáo

Yêu cầu cập nhật: metadata/schema migration; OpenAPI request/response/errors/auth; class/ERD và sequence finder/runner/attempt/trial-to-checkout; wireframe/screenshot cùng breakpoint; traceability stories-test; hướng dẫn chạy/seed/test và giới hạn runtime.

Nội dung báo cáo phải phân biệt thiết kế và đã thực hiện. Chỉ trích số liệu test sau chạy; không suy ra 60 trang Word từ độ dài MD hoặc tạo hình/log giả. Các thay đổi ở ba phần phải regression mua khóa, auth/enrollment, player/progress và các menu khác; không cần refactor toàn app ngoài phạm vi.

## 17. Prompt giao AI và checklist cuối

> Hãy triển khai chuyên sâu ba phần Chọn khóa phù hợp, Luyện tập và Học thử theo tệp này trên code mới nhất của tôi. Baseline được đọc khi viết là 37959a4; kiểm tra HEAD thực tế trước khi sửa, tái sử dụng phần đã có và không áp lại lỗi của commit cũ. Làm theo mục 16, ưu tiên finder có metadata/rule version/budget readiness rõ, runner dùng chung có input JSON và comparator/async/runId thật, practice có draft/attempt/deadline/history/ôn tập, trial có workspace/hints/version và chuyển tới đúng khóa qua login/checkout. Giữ React/react-bootstrap, NestJS phân lớp, TypeORM/MySQL và sáu menu hiện tại; combo vẫn ở announcement/modal, không thêm tab mới. Không tự gọi rule-based finder là AI, không hardcode ID/substrings/giá hoặc thời gian học, không actual=expected hay keyword grading. Runtime chưa hỗ trợ phải nói đúng; browser practice không là điểm server để cấp quyền/chứng nhận. Mỗi story công bố hoàn thành có validation/role/owner/error, unit trong test, MySQL integration và E2E/UI tương ứng với các CF-T/PR-T/TR-T. Migration giữ dữ liệu; OpenAPI/UML/ERD/wireframe/traceability/README và log thực theo commit cần được cập nhật. Sau mỗi đợt báo file đã sửa, phần tái sử dụng, command/test đã chạy, lỗi/giới hạn và cổng nghiệm thu; không fake PASS hoặc host/public deploy ngoài yêu cầu phiên triển khai.

### Checklist

- [ ] Đúng baseline mới và mapping, không áp lại nhận định cũ cho phần đã sửa.
- [ ] Bốn nhóm câu hỏi, validation, readiness, budget strict/flexible/unknown và score minh bạch.
- [ ] So sánh tối đa ba khóa bằng dữ liệu thật; lịch học từ workload, không lời hứa chung.
- [ ] Practice có hợp đồng đề/input/output/runtime và bài sửa lỗi thực tế.
- [ ] Run/Check/Stop/Reset/Hint/Solution/Save có tác dụng rõ và trạng thái lỗi đúng.
- [ ] Comparator theo kiểu, await async, test isolation, runId/codeHash và giới hạn output/time.
- [ ] Browser practice và server graded phân biệt; không dùng client pass để cấp quyền/điểm đáng tin.
- [ ] Assessment có attempt/version/owner/deadline/idempotency/feedback đúng policy.
- [ ] Weak skill/review từ history đủ căn cứ, không fake radar hoặc ghi đè lượt cũ.
- [ ] Trial chọn đúng khóa/ID/version, không default một bài cho mọi khóa.
- [ ] Hints/solution theo policy, không nhầm endpoint riêng với bảo vệ đáp án.
- [ ] Guest/account drafts, conflict/retry, login/checkout context và quyền xử lý đúng.
- [ ] Authoring có owner/publish/preview/validator và lời giải mẫu đã test.
- [ ] 18 stories và 36 cases được mapping, log actual theo commit; không gọi NOT_RUN là PASS.
- [ ] Docs/sơ đồ/report cập nhật, không sửa dữ liệu, source ngoài phạm vi hoặc lịch sử Git để làm đẹp kết quả.

**Trạng thái tài liệu:** đã đặc tả; chưa sửa code ứng dụng, chưa chạy host hoặc kiểm thử ứng dụng trong lượt này. Nguồn kỹ thuật đối chiếu ngày 30/10/2026 là MDN Web Workers và NestJS Validation đã dẫn ở các mục liên quan; quyết định scoring, workflow và ngưỡng trong tệp là đề xuất riêng cho EduViet.
