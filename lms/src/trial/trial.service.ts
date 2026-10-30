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
Trong React 19, một **Component** là một hàm JavaScript trả về các phần tử JSX (giao diện). **Props** là tham số đầu vào giúp component tái sử dụng linh hoạt.

#### Yêu cầu thực hành:
1. Hoàn thiện hàm component \`WelcomeCard({ name, role })\`.
2. Hàm phải trả về một chuỗi HTML/JSX có định dạng:
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
    title: 'Phân Tích & Lọc Dữ Liệu Bằng Cú Pháp Python',
    course_id: 4,
    course_title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
    course_price: 790000,
    language: 'python',
    duration_minutes: 8,
    difficulty: 'Beginner',
    summary: 'Học cách duyệt mảng, trích xuất điểm số sinh viên và tính giá trị trung bình trong phân tích dữ liệu.',
    instructions: `### Mục tiêu bài học thử:
Trong phân tích dữ liệu và AI, bước tiền xử lý (Data Preprocessing) là quan trọng nhất để làm sạch và tổng hợp dữ liệu.

#### Yêu cầu thực hành:
Viết hàm \`calculate_average_score(scores)\` nhận vào danh sách điểm số [8.5, 9.0, 7.5...]:
1. Bỏ qua các điểm không hợp lệ (nhỏ hơn 0 hoặc lớn hơn 10).
2. Tính điểm trung bình của các điểm hợp lệ (làm tròn 2 chữ số thập phân).
3. Nếu không có điểm nào hợp lệ, trả về 0.0.`,
    hints: [
      'Gợi ý 1: Lọc các điểm hợp lệ: `valid = [s for s in scores if 0 <= s <= 10]`.',
      'Gợi ý 2: Dùng `round(sum(valid) / len(valid), 2)`.',
    ],
    initial_code: `def calculate_average_score(scores):
    # Viết mã nguồn Python của bạn tại đây
    pass

print(calculate_average_score([8.0, 9.0, 10.0]))`,
    solution_code: `def calculate_average_score(scores):
    valid = [s for s in scores if 0 <= s <= 10]
    if not valid:
        return 0.0
    return round(sum(valid) / len(valid), 2)`,
    test_cases: [
      {
        input: '[8.0, 9.0, 10.0]',
        expected_output: '9.0',
        description: 'Tính trung bình chuẩn',
      },
      {
        input: '[-5, 12, 7.5, 8.5]',
        expected_output: '8.0',
        description: 'Loại bỏ điểm số bất thường ngoài khoảng 0-10',
      },
    ],
  },
  {
    trial_id: 4,
    title: 'Thiết Kế Multi-Stage Dockerfile Giảm Dung Lượng Container',
    course_id: 5,
    course_title: 'Triển Khai Ứng Dụng Với Docker & Tự Động Hóa CI/CD',
    course_price: 690000,
    language: 'dockerfile',
    duration_minutes: 7,
    difficulty: 'Intermediate',
    summary: 'Hiểu cấu trúc 2 tầng (Build stage và Runner stage) để tối ưu image container trong môi trường DevOps.',
    instructions: `### Mục tiêu bài học thử:
Trong DevOps, một image nhẹ (dưới 100MB) giúp deploy nhanh gấp 5 lần và giảm thiểu bề mặt tấn công bảo mật.

#### Yêu cầu:
Chọn và cấu hình đúng lệnh runtime cho stage cuối cùng:
1. Chỉ copy thư mục \`dist\` đã build từ \`builder\`.
2. Chỉ copy \`node_modules\` phục vụ production.
3. Chỉ định lệnh khởi động container qua cổng 3000.`,
    hints: [
      'Gợi ý 1: Dùng lệnh `COPY --from=builder /app/dist ./dist`',
      'Gợi ý 2: Lệnh CMD trong Dockerfile: `CMD ["node", "dist/main.js"]`',
    ],
    initial_code: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
# Điền lệnh copy sản phẩm build từ stage builder tại đây

EXPOSE 3000
CMD ["node", "dist/main.js"]`,
    solution_code: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
    test_cases: [
      {
        input: 'COPY --from=builder',
        expected_output: 'Valid Multi-stage',
        description: 'Tận dụng sản phẩm build từ builder stage',
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

  findOne(id: number) {
    const trial = INITIAL_TRIALS.find((t) => t.trial_id === Number(id));
    if (!trial) {
      throw new NotFoundException(`Không tìm thấy bài học thử với ID: ${id}`);
    }
    return trial;
  }
}
