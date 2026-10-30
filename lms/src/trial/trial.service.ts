import { Injectable, NotFoundException } from '@nestjs/common';

export const INITIAL_TRIALS = [
  {
    trial_id: 1,
    title: 'Xây Dựng Component Đầu Tiên với React 19 & Props',
    course_id: 1,
    course_title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
    course_price: 890000,
    language: 'javascript',
    duration_minutes: 8,
    difficulty: 'Beginner',
    video_id: 'bMknfKXIFA8',
    video_start: 60,
    live_preview_type: 'react-component',
    summary: 'Làm quen với tư duy phân rã giao diện (Component-Driven), cú pháp JSX và truyền nhận dữ liệu qua Props trong React 19.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: Component & Props Trong React 19
- **Component**: Là các khối giao diện độc lập, có thể tái sử dụng (giống như các khối Lego ghép lại thành website).
- **Props (Properties)**: Là các tham số đầu vào được truyền từ Component cha xuống Component con. Props là dữ liệu chỉ đọc (Immutable), giúp giao diện phản chiếu trạng thái một cách dự đoán được (Predictable).
- **React 19 Đổi Mới**: Không cần cấu hình prop-types phức tạp, tự động tối ưu hóa re-render thông qua React Compiler.`,
    instructions: `### Mục tiêu bài học thử:
Bạn đang xây dựng một thẻ chào mừng học viên (**Welcome Card**) trong hệ sinh thái EduViet. Thẻ này sẽ nhận tên học viên và chức danh để hiển thị giao diện cá nhân hóa.

#### 📋 Các bước thực hiện:
1. **Bước 1**: Đọc và hiểu hàm component \`WelcomeCard({ name, role })\`.
2. **Bước 2**: Sử dụng Destructuring để gán giá trị mặc định cho \`role = "Học viên"\` nếu người dùng không truyền vào.
3. **Bước 3**: Trả về chuỗi thông điệp chuẩn xác: \`"Xin chào " + name + " - Vai trò: " + role\`.
4. **Bước 4**: Bấm **"Chạy Thử Code"** để xem Live UI Preview và bấm **"Kiểm Tra & Hoàn Thành"** để nhận chứng nhận học thử!`,
    hints: [
      'Gợi ý 1: Bạn có thể khai báo tham số: `function WelcomeCard({ name, role = "Học viên" })`',
      'Gợi ý 2: Sử dụng template string ES6: `return `Xin chào ${name} - Vai trò: ${role}`;`',
      'Gợi ý 3: Xem ngay tab "Giao Diện Live UI" để thấy thẻ card thay đổi tức thời khi bạn code!',
    ],
    initial_code: `function WelcomeCard({ name, role = "Học viên" }) {
  // BƯỚC THỰC HÀNH: Hoàn thiện thông điệp chào mừng
  // Định dạng: "Xin chào " + name + " - Vai trò: " + role
  return "";
}

// Gọi thử hàm để xem kết quả
console.log(WelcomeCard({ name: "Nguyễn Văn Dev", role: "Frontend Developer" }));`,
    solution_code: `function WelcomeCard({ name, role = "Học viên" }) {
  return "Xin chào " + name + " - Vai trò: " + role;
}`,
    test_cases: [
      {
        input: '{ name: "Nam", role: "Developer" }',
        expected_output: 'Xin chào Nam - Vai trò: Developer',
        description: 'Truyền đầy đủ name và role',
      },
      {
        input: '{ name: "Linh" }',
        expected_output: 'Xin chào Linh - Vai trò: Học viên',
        description: 'Sử dụng vai trò mặc định khi không truyền role',
      },
    ],
  },
  {
    trial_id: 2,
    title: 'Định Nghĩa Controller & REST Route Handler Trong NestJS',
    course_id: 2,
    course_title: 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL',
    course_price: 950000,
    language: 'javascript',
    duration_minutes: 10,
    difficulty: 'Intermediate',
    video_id: '2n3xS89TJMI',
    video_start: 120,
    live_preview_type: 'api-response',
    summary: 'Tìm hiểu cơ chế định tuyến (Routing) trong NestJS và cấu trúc một hàm Controller xử lý request chuẩn RESTful API.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: NestJS Controllers & HTTP Lifecycle
- **Controller**: Là tầng đầu tiên tiếp nhận HTTP Request (GET, POST, PUT, DELETE) từ Client thông qua URL Path.
- **Data Transfer Object (DTO)**: Khuôn mẫu dữ liệu gửi lên máy chủ được kiểm định nghiêm ngặt.
- **RESTful Standard**: Định dạng response nhất quán: Thành công trả về status \`"success"\` kèm data; Không tìm thấy trả về \`"not_found"\` kèm message.`,
    instructions: `### 🎯 Mục Tiêu Bài Học Thử:
Bạn đóng vai trò Backend Developer xây dựng API endpoint lấy thông tin khóa học: \`GET /courses/:id\`.

#### 📋 Các bước thực hiện:
1. **Bước 1**: Viết hàm handler \`getCourseOverview(courseId, coursesList)\`.
2. **Bước 2**: Dùng phương thức mảng \`.find()\` để tìm khóa học có \`id === courseId\`.
3. **Bước 3**: Nếu tìm thấy, trả về object: \`{ status: "success", data: course }\`.
4. **Bước 4**: Nếu không tìm thấy, trả về: \`{ status: "not_found", message: "Course not found" }\`.
5. **Bước 5**: Kiểm tra Swagger / Postman Mock Preview bên phải để xem kết quả HTTP thực tế!`,
    hints: [
      'Gợi ý 1: Dùng phương thức `const course = coursesList.find(c => c.id === courseId);`',
      'Gợi ý 2: Kiểm tra điều kiện if (!course) return { status: "not_found", message: "Course not found" };',
    ],
    initial_code: `function getCourseOverview(courseId, coursesList) {
  // BƯỚC THỰC HÀNH: Tìm kiếm khóa học trong danh sách
  // và trả về định dạng JSON chuẩn REST API
  
}

// Dữ liệu mẫu kiểm thử
const mockCourses = [
  { id: 1, title: "React 19 Chuyên Sâu", price: 890000 },
  { id: 2, title: "NestJS Backend Master", price: 950000 }
];
console.log(getCourseOverview(1, mockCourses));`,
    solution_code: `function getCourseOverview(courseId, coursesList) {
  const course = coursesList.find(c => c.id === courseId);
  if (!course) {
    return { status: "not_found", message: "Course not found" };
  }
  return { status: "success", data: course };
}`,
    test_cases: [
      {
        input: 'getCourseOverview(1, [{ id: 1, title: "React 19" }])',
        expected_output: '{"status":"success","data":{"id":1,"title":"React 19"}}',
        description: 'Tìm thấy khóa học thành công',
      },
      {
        input: 'getCourseOverview(99, [{ id: 1, title: "React 19" }])',
        expected_output: '{"status":"not_found","message":"Course not found"}',
        description: 'Khóa học không tồn tại trả về not_found',
      },
    ],
  },
  {
    trial_id: 3,
    title: 'Phân Tích & Lọc Dữ Liệu Bằng Thuật Toán JavaScript (AI & Data)',
    course_id: 4,
    course_title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
    course_price: 790000,
    language: 'javascript',
    duration_minutes: 8,
    difficulty: 'Beginner',
    video_id: 'rfscVS0vtbw',
    video_start: 90,
    live_preview_type: 'data-chart',
    summary: 'Học tư duy tiền xử lý dữ liệu (Data Preprocessing), lọc outliers và tính toán thống kê cơ bản trong phân tích dữ liệu.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: Data Preprocessing & Outlier Cleaning
- **Data Cleansing**: Dữ liệu thực tế luôn chứa rác (nhiễu, giá trị âm, điểm vượt trần). Bước đầu tiên của kỹ sư AI là làm sạch (Sanitize).
- **Outliers**: Các giá trị ngoài khoảng hợp lệ [0, 10] phải bị loại bỏ để không làm méo mó kết quả phân tích thống kê.`,
    instructions: `### 🎯 Mục Tiêu Bài Học Thử:
Bạn phụ trách viết hàm tiền xử lý điểm số học viên trước khi nạp vào mô hình Machine Learning.

#### 📋 Các bước thực hiện:
1. **Bước 1**: Nhận vào danh sách điểm số \`scores\` (ví dụ: \`[8.5, -2, 14, 9.0]\`).
2. **Bước 2**: Lọc bỏ các điểm không hợp lệ (điểm < 0 hoặc điểm > 10).
3. **Bước 3**: Tính điểm trung bình của các điểm hợp lệ (làm tròn số nguyên hoặc 2 chữ số thập phân).
4. **Bước 4**: Nếu không có điểm nào hợp lệ, trả về \`0.0\`.`,
    hints: [
      'Gợi ý 1: Lọc điểm hợp lệ: `const valid = scores.filter(s => s >= 0 && s <= 10);`',
      'Gợi ý 2: Tính tổng: `const sum = valid.reduce((a, b) => a + b, 0);`',
      'Gợi ý 3: Nếu valid.length === 0 return 0.0; ngược lại return Number((sum / valid.length).toFixed(2));',
    ],
    initial_code: `function calculateAverageScore(scores) {
  // BƯỚC THỰC HÀNH: Lọc bỏ điểm < 0 hoặc > 10, sau đó tính trung bình
  return 0.0;
}

// Kiểm tra thử hàm
console.log(calculateAverageScore([8.0, 9.0, 10.0]));`,
    solution_code: `function calculateAverageScore(scores) {
  const valid = scores.filter(s => typeof s === 'number' && s >= 0 && s <= 10);
  if (valid.length === 0) return 0.0;
  const sum = valid.reduce((a, b) => a + b, 0);
  return Number((sum / valid.length).toFixed(2));
}`,
    test_cases: [
      {
        input: '[8.0, 9.0, 10.0]',
        expected_output: '9',
        description: 'Tính trung bình chuẩn với dữ liệu hợp lệ',
      },
      {
        input: '[-5, 12, 7.5, 8.5]',
        expected_output: '8',
        description: 'Loại bỏ điểm số bất thường ngoài khoảng 0-10',
      },
    ],
  },
  {
    trial_id: 4,
    title: 'Kiểm Định Cấu Trình Pipeline CI/CD Trong Môi Trường DevOps',
    course_id: 5,
    course_title: 'Triển Khai Ứng Dụng Với Docker & Tự Động Hóa CI/CD',
    course_price: 690000,
    language: 'javascript',
    duration_minutes: 7,
    video_id: 'fqMOX6JJhGo',
    video_start: 45,
    live_preview_type: 'devops-pipeline',
    difficulty: 'Intermediate',
    summary: 'Hiểu cấu trúc pipeline nhiều tầng (Multi-stage CI/CD) để tự động hóa kiểm định build và deploy an toàn.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: CI/CD Pipeline & Zero-Downtime Deployment
- **CI (Continuous Integration)**: Tự động chạy linter, kiểm thử unit test khi có mã nguồn mới.
- **CD (Continuous Deployment)**: Đóng gói Docker image và tự động triển khai lên cụm máy chủ nếu các bước trước thành công.
- **Fail-Fast Principle**: Bất kỳ bước nào thất bại (Failed), hệ thống phải ngắt pipeline ngay để ngăn chặn rủi ro làm sập Production.`,
    instructions: `### 🎯 Mục Tiêu Bài Học Thử:
Bạn đóng vai trò DevOps Engineer viết hàm kiểm định trạng thái của chuỗi Pipeline tự động hóa.

#### 📋 Các bước thực hiện:
1. **Bước 1**: Nhận mảng các stage: \`[{ name: "build", status: "success" }, ...]\`.
2. **Bước 2**: Đảm bảo pipeline có đủ ít nhất 2 stage bắt buộc: \`"build"\` và \`"deploy"\`.
3. **Bước 3**: Nếu có stage thất bại (status !== "success"), trả về ngay: \`{ valid: false, error: "Pipeline failed at " + stage.name }\`.
4. **Bước 4**: Nếu tất cả đều "success" và đủ bước, trả về: \`{ valid: true }\`.`,
    hints: [
      'Gợi ý 1: Tìm stage lỗi trước: `const failed = stages.find(s => s.status !== "success");`',
      'Gợi ý 2: Kiểm tra tồn tại: `const hasBuild = stages.some(s => s.name === "build");`',
    ],
    initial_code: `function validateDevOpsPipeline(stages) {
  // BƯỚC THỰC HÀNH: Kiểm định trạng thái các stage của Pipeline CI/CD
  return { valid: false };
}

// Kiểm tra thử hàm
console.log(validateDevOpsPipeline([
  { name: "build", status: "success" },
  { name: "deploy", status: "success" }
]));`,
    solution_code: `function validateDevOpsPipeline(stages) {
  const failed = stages.find(s => s.status !== 'success');
  if (failed) {
    return { valid: false, error: 'Pipeline failed at ' + failed.name };
  }
  const hasBuild = stages.some(s => s.name === 'build');
  const hasDeploy = stages.some(s => s.name === 'deploy');
  if (!hasBuild || !hasDeploy) {
    return { valid: false, error: 'Pipeline missing build or deploy stage' };
  }
  return { valid: true };
}`,
    test_cases: [
      {
        input: '[{ name: "build", status: "success" }, { name: "deploy", status: "success" }]',
        expected_output: '{"valid":true}',
        description: 'Tất cả các stage đều thành công',
      },
      {
        input: '[{ name: "build", status: "failed" }, { name: "deploy", status: "success" }]',
        expected_output: '{"valid":false,"error":"Pipeline failed at build"}',
        description: 'Phát hiện chính xác stage bị lỗi build',
      },
    ],
  },
];

@Injectable()
export class TrialService {
  findAll() {
    return INITIAL_TRIALS.map((t) => ({
      trial_id: t.trial_id,
      title: t.title,
      course_id: t.course_id,
      course_title: t.course_title,
      course_price: t.course_price,
      language: t.language,
      duration_minutes: t.duration_minutes,
      difficulty: t.difficulty,
      summary: t.summary,
      video_id: t.video_id,
      live_preview_type: t.live_preview_type,
    }));
  }

  // Lấy chi tiết bài học thử công khai (Bảo mật: không lộ solution_code cho học viên trước khi nộp bài)
  findOne(id: number) {
    const trial = INITIAL_TRIALS.find((t) => t.trial_id === Number(id));
    if (!trial) {
      throw new NotFoundException(`Không tìm thấy bài học thử với ID: ${id}`);
    }
    const { solution_code, ...publicData } = trial;
    return publicData;
  }

  // Tra cứu lời giải tham khảo khi học viên yêu cầu trợ giúp
  getSolution(id: number) {
    const trial = INITIAL_TRIALS.find((t) => t.trial_id === Number(id));
    if (!trial) {
      throw new NotFoundException(`Không tìm thấy bài học thử với ID: ${id}`);
    }
    return {
      trial_id: trial.trial_id,
      solution_code: trial.solution_code,
    };
  }
}
