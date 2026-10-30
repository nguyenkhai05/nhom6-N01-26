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
    summary: 'Làm quen với cú pháp JSX và cơ chế truyền nhận dữ liệu qua Props trong Functional Component React 19.',
    instructions: `### Mục tiêu bài học thử:
Trong React 19, một **Component** là một hàm JavaScript nhận dữ liệu qua **Props** và trả về giao diện.

#### Yêu cầu thực hành:
1. Hoàn thiện hàm component \`WelcomeCard({ name, role })\`.
2. Hàm phải trả về chuỗi có định dạng:
   \`"Xin chào " + name + " - Vai trò: " + role\`
3. Đảm bảo nếu không truyền \`role\`, giá trị mặc định sẽ là \`"Học viên"\`.`,
    hints: [
      'Gợi ý 1: Bạn có thể dùng destructuring với default value: `{ name, role = "Học viên" }`',
      'Gợi ý 2: Sử dụng template string: `return `Xin chào ${name} - Vai trò: ${role}`;`',
    ],
    initial_code: `function WelcomeCard({ name, role = "Học viên" }) {
  // Hoàn thiện mã nguồn của bạn tại đây
  return "";
}

// Kiểm tra thử hàm
console.log(WelcomeCard({ name: "Nam", role: "Developer" }));`,
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
    summary: 'Tìm hiểu cơ chế định tuyến (Routing) trong NestJS và cấu trúc một hàm Controller xử lý request chuẩn.',
    instructions: `### Mục tiêu bài học thử:
Trong NestJS, mỗi Controller chịu trách nhiệm tiếp nhận HTTP Request đến các endpoint cụ thể và trả về Response tương ứng.

#### Yêu cầu thực hành:
1. Viết một hàm mô phỏng handler \`getCourseOverview(courseId, coursesList)\`.
2. Tìm khóa học có \`id === courseId\` trong danh sách.
3. Nếu tìm thấy, trả về object: \`{ status: "success", data: course }\`.
4. Nếu không tìm thấy, trả về: \`{ status: "not_found", message: "Course not found" }\`.`,
    hints: [
      'Gợi ý 1: Dùng phương thức `coursesList.find(c => c.id === courseId)`.',
      'Gợi ý 2: Kiểm tra if (!course) return { status: "not_found", message: "Course not found" }.',
    ],
    initial_code: `function getCourseOverview(courseId, coursesList) {
  // Viết logic tìm kiếm và trả về định dạng chuẩn
  
}

// Dữ liệu mẫu
const mockCourses = [{ id: 1, title: "React 19" }, { id: 2, title: "NestJS" }];
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
    summary: 'Học cách duyệt mảng, trích xuất điểm số sinh viên và tính giá trị trung bình trong phân tích dữ liệu.',
    instructions: `### Mục tiêu bài học thử:
Trong phân tích dữ liệu và AI, bước tiền xử lý (Data Preprocessing) là quan trọng nhất để làm sạch và tổng hợp dữ liệu.

#### Yêu cầu thực hành:
Viết hàm \`calculateAverageScore(scores)\` nhận vào danh sách điểm số [8.5, 9.0, 7.5...]:
1. Bỏ qua các điểm không hợp lệ (nhỏ hơn 0 hoặc lớn hơn 10).
2. Tính điểm trung bình của các điểm hợp lệ (làm tròn 2 chữ số thập phân).
3. Nếu không có điểm nào hợp lệ, trả về 0.0.`,
    hints: [
      'Gợi ý 1: Lọc các điểm hợp lệ: `const valid = scores.filter(s => s >= 0 && s <= 10);`',
      'Gợi ý 2: Tính tổng: `const sum = valid.reduce((a, b) => a + b, 0);`',
      'Gợi ý 3: Làm tròn: `return Number((sum / valid.length).toFixed(2));`',
    ],
    initial_code: `function calculateAverageScore(scores) {
  // Hoàn thiện thuật toán làm sạch và tính trung bình điểm số
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
    difficulty: 'Intermediate',
    summary: 'Hiểu cấu trúc pipeline nhiều tầng (Multi-stage CI/CD) để tự động hóa kiểm định build và deploy an toàn.',
    instructions: `### Mục tiêu bài học thử:
Trong văn hóa DevOps hiện đại, việc kiểm tra tính toàn vẹn của các giai đoạn pipeline CI/CD trước khi đưa vào môi trường Production là bắt buộc.

#### Yêu cầu:
Viết hàm \`validateDevOpsPipeline(stages)\` nhận vào mảng các stage:
1. Mỗi stage có cấu trúc: \`{ name: string, status: string }\`.
2. Phải có ít nhất 2 stage: \`"build"\` và \`"deploy"\`.
3. Nếu tất cả các stage đều có status \`"success"\`, trả về: \`{ valid: true }\`.
4. Nếu có bất kỳ stage nào fail, trả về: \`{ valid: false, error: "Pipeline failed at " + stage.name }\`.`,
    hints: [
      'Gợi ý 1: Kiểm tra stage thất bại: `const failed = stages.find(s => s.status !== "success");`',
      'Gợi ý 2: Nếu có `failed`, return `{ valid: false, error: "Pipeline failed at " + failed.name }`.',
    ],
    initial_code: `function validateDevOpsPipeline(stages) {
  // Hoàn thiện hàm kiểm định trạng thái các stage CI/CD
  return { valid: false };
}

// Kiểm tra thử hàm
console.log(validateDevOpsPipeline([{ name: "build", status: "success" }, { name: "deploy", status: "success" }]));`,
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
