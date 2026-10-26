// Dữ liệu giáo trình thực tế và timecodes YouTube đối soát theo từng khóa học EduViet
// Tách biệt rõ start_seconds, end_seconds, thời lượng hiển thị và code mẫu JavaScript ES6 hợp lệ.

export const COURSE_CURRICULA = {
  // 1: React & Next.js (Video ID: bMknfKXIFA8 - freeCodeCamp React 2022)
  1: {
    courseId: 1,
    defaultVideoId: 'bMknfKXIFA8',
    modules: [
      {
        moduleTitle: 'Chương 1: Khởi Đầu & Tư Duy Component React',
        lessons: [
          {
            id: 101,
            title: '01. Giới thiệu tổng quan React & Mental Model',
            duration: '21:03',
            videoId: 'bMknfKXIFA8',
            start_seconds: 0,
            end_seconds: 1263,
            description: 'Tìm hiểu tại sao React là thư viện UI phổ biến nhất thế giới, mô hình khai báo (Declarative UI) và cấu trúc ứng dụng Single Page App.',
            sampleCode: `// Bài tập 01: Khởi tạo Component React đầu tiên
function WelcomeBadge({ studentName, track }) {
  return {
    type: 'div',
    props: {
      className: 'badge-welcome',
      children: \`Chào mừng \${studentName} tham gia lộ trình \${track} tại EduViet!\`
    }
  };
}

const element = WelcomeBadge({ studentName: 'Học viên EduViet', track: 'React Frontend' });
console.log('Render Virtual DOM node:', JSON.stringify(element));`
          },
          {
            id: 102,
            title: '02. Tại sao chọn React & Tư duy tư duy Component-Driven',
            duration: '09:35',
            videoId: 'bMknfKXIFA8',
            start_seconds: 1263,
            end_seconds: 1838,
            description: 'So sánh React với JavaScript thuần DOM Manipulation. Cách chia nhỏ giao diện thành các viên gạch độc lập, tái sử dụng cao.',
            sampleCode: `// Bài tập 02: Tái sử dụng Component & Tính điểm
const coursesList = [
  { id: 1, name: 'React Fundamentals', hours: 40 },
  { id: 2, name: 'Next.js App Router', hours: 35 },
  { id: 3, name: 'TypeScript & Redux', hours: 25 }
];

const totalHours = coursesList.reduce((acc, c) => acc + c.hours, 0);
console.log(\`Tổng thời lượng khóa học: \${totalHours} giờ học thực chiến.\`);
console.log('Danh sách module:', coursesList.map(c => c.name).join(', '));`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Cú Pháp JSX & Khởi Tạo Giao Diện',
        lessons: [
          {
            id: 103,
            title: '03. JSX, Virtual DOM & Render Elements',
            duration: '19:19',
            videoId: 'bMknfKXIFA8',
            start_seconds: 1838,
            end_seconds: 2997,
            description: 'Giải mã bản chất cú pháp JSX chuyển đổi qua React.createElement, cơ chế Reconciliation và Virtual DOM Diffing algorithm.',
            sampleCode: `// Bài tập 03: Xử lý danh sách động với Map
const tags = ['Hooks', 'Virtual DOM', 'State', 'Props'];
const tagElements = tags.map((tag, idx) => ({
  id: idx,
  label: \`#\${tag}\`,
  active: idx === 0
}));

console.log('Đã tạo danh sách tags:', JSON.stringify(tagElements));`
          },
          {
            id: 104,
            title: '04. Xây dựng dự án đầu tiên - Setup Markup & Layout',
            duration: '09:58',
            videoId: 'bMknfKXIFA8',
            start_seconds: 2997,
            end_seconds: 3595,
            description: 'Thiết lập khung giao diện chuẩn responsive, tổ chức thư mục assets, components, và styling với CSS Modules / Tailwind.',
            sampleCode: `// Bài tập 04: Bộ lọc dữ liệu bài học
const lessons = [
  { title: 'Intro', completed: true },
  { title: 'JSX Basics', completed: true },
  { title: 'State Hook', completed: false }
];

const completedCount = lessons.filter(l => l.completed).length;
const percent = Math.round((completedCount / lessons.length) * 100);
console.log(\`Tiến độ học tập: \${completedCount}/\${lessons.length} bài (\${percent}%)\`);`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: Custom Components & Local Dev Setup',
        lessons: [
          {
            id: 105,
            title: '05. Custom Components & Kỹ thuật truyền Props',
            duration: '33:12',
            videoId: 'bMknfKXIFA8',
            start_seconds: 3595,
            end_seconds: 5587,
            description: 'Nắm vững Data Flow một chiều (Unidirectional Data Flow), truyền tham số props, default props và destructuring.',
            sampleCode: `// Bài tập 05: Kiểm tra quyền truy cập bài học
function checkLessonAccess(userRole, isEnrolled) {
  if (userRole === 'ADMIN') return { canWatch: true, reason: 'Quản trị viên hệ thống' };
  if (isEnrolled) return { canWatch: true, reason: 'Đã kích hoạt khóa học' };
  return { canWatch: false, reason: 'Cần đăng ký khóa học để tiếp tục' };
}

console.log(checkLessonAccess('USER', true));
console.log(checkLessonAccess('GUEST', false));`
          },
          {
            id: 106,
            title: '06. Setup môi trường Vite / Local Dev & Best Practices',
            duration: '26:53',
            videoId: 'bMknfKXIFA8',
            start_seconds: 5587,
            end_seconds: 7200,
            description: 'Tạo dự án React hiện đại bằng Vite, tích hợp ESLint, Prettier và tối ưu bundle build sẵn sàng cho production.',
            sampleCode: `// Bài tập 06: Tổng kết và xuất chứng nhận
const graduation = {
  student: 'Nguyễn Văn A',
  course: 'React & Next.js Chuyên Sâu',
  score: 9.6,
  status: 'EXCELLENT',
  issuedAt: new Date().toLocaleDateString('vi-VN')
};

console.log('Chúc mừng tốt nghiệp:', JSON.stringify(graduation));`
          }
        ]
      }
    ]
  },

  // 2: NestJS & Backend (Video ID: 1dqp4flwjlk - freeCodeCamp NestJS Course)
  2: {
    courseId: 2,
    defaultVideoId: '1dqp4flwjlk',
    modules: [
      {
        moduleTitle: 'Chương 1: Kiến Trúc Tổng Quan & CLI',
        lessons: [
          {
            id: 201,
            title: '01. Giới thiệu kiến trúc NestJS & Cài đặt môi trường CLI',
            duration: '00:38',
            videoId: '1dqp4flwjlk',
            start_seconds: 0,
            end_seconds: 38,
            description: 'Tổng quan về NestJS - framework Node.js tiến bộ bậc nhất cho Enterprise, dựa trên TypeScript và Clean Architecture.',
            sampleCode: `// Cấu hình server port
const port = process.env.PORT || 3000;
console.log(\`NestJS Application is listening on port \${port}\`);`
          },
          {
            id: 202,
            title: '02. Khởi tạo module & Cấu trúc thư mục Clean Architecture',
            duration: '14:56',
            videoId: '1dqp4flwjlk',
            start_seconds: 38,
            end_seconds: 934,
            description: 'Tổ chức các layer Controller, Service, Repository, DTO và Entity đảm bảo tính mở rộng cao.',
            sampleCode: `// Khởi tạo DTO bằng Javascript ES6
const createUserPayload = {
  email: 'dev@eduviet.vn',
  fullName: 'Kỹ Sư Backend',
  role: 'USER'
};

function validateUserPayload(dto) {
  if (!dto.email || !dto.email.includes('@')) throw new Error('Email không hợp lệ');
  if (!dto.fullName || dto.fullName.length < 3) throw new Error('Họ tên quá ngắn');
  return true;
}

try {
  validateUserPayload(createUserPayload);
  console.log('Xác thực DTO thành công:', createUserPayload);
} catch (err) {
  console.log('Lỗi:', err.message);
}`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Request Pipeline & Dependency Injection',
        lessons: [
          {
            id: 203,
            title: '03. Controllers - Định nghĩa Routes & HTTP Methods',
            duration: '20:55',
            videoId: '1dqp4flwjlk',
            start_seconds: 934,
            end_seconds: 2189,
            description: 'Sử dụng các Decorator @Get, @Post, @Put, @Delete để xử lý HTTP requests và response status codes.',
            sampleCode: `// Mô phỏng Controller Route
const routes = {
  'GET /api/courses': () => [{ id: 1, title: 'NestJS Master' }],
  'POST /api/courses': (body) => ({ id: 2, ...body, created: true })
};

function handleRequest(method, path, body) {
  const handler = routes[\`\${method} \${path}\`];
  return handler ? handler(body) : { status: 404, message: 'Not Found' };
}

console.log(handleRequest('GET', '/api/courses'));`
          },
          {
            id: 204,
            title: '04. Services & Dependency Injection Providers',
            duration: '26:33',
            videoId: '1dqp4flwjlk',
            start_seconds: 2189,
            end_seconds: 3782,
            description: 'Nguyên lý IoC (Inversion of Control) và Dependency Injection trong NestJS để cô lập business logic khỏi HTTP layer.',
            sampleCode: `// Mô phỏng Service Provider
class CourseService {
  constructor() {
    this.courses = ['NestJS', 'TypeORM', 'Docker'];
  }
  findAll() {
    return this.courses;
  }
}

const service = new CourseService();
console.log('Danh sách khóa học từ Service:', service.findAll());`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: DTO Validation & REST API Hoàn Chỉnh',
        lessons: [
          {
            id: 205,
            title: '05. DTOs & Validation Pipe kiểm tra dữ liệu đầu vào',
            duration: '28:46',
            videoId: '1dqp4flwjlk',
            start_seconds: 3782,
            end_seconds: 5508,
            description: 'Tự động kiểm tra schema dữ liệu, loại bỏ các thuộc tính rác với whitelist: true và transform kiểu dữ liệu.',
            sampleCode: `// Validation Pipe Simulation
function pipe(input, schema) {
  const sanitized = {};
  for (const key of Object.keys(schema)) {
    if (input[key] !== undefined) sanitized[key] = input[key];
  }
  return sanitized;
}

const rawInput = { title: 'Lập trình NestJS', hackProp: 'ignore me' };
console.log('Dữ liệu sau khi qua Pipe:', pipe(rawInput, { title: true }));`
          },
          {
            id: 206,
            title: '06. Xây dựng RESTful API CRUD và kết nối CSDL TypeORM',
            duration: '28:12',
            videoId: '1dqp4flwjlk',
            start_seconds: 5508,
            end_seconds: 7200,
            description: 'Kết nối TypeORM với MySQL, viết Repository truy vấn dữ liệu bất đồng bộ và trả về định dạng JSON chuẩn REST.',
            sampleCode: `// Xử lý truy vấn CSDL bất đồng bộ
async function queryDatabase() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Khóa học 1', status: 'ACTIVE' },
        { id: 2, title: 'Khóa học 2', status: 'ACTIVE' }
      ]);
    }, 150);
  });
}

queryDatabase().then((rows) => console.log('Kết quả CSDL:', rows));`
          }
        ]
      }
    ]
  },

  // 3: MySQL Database (Video ID: HXV3zeQKqGY - freeCodeCamp SQL Course)
  3: {
    courseId: 3,
    defaultVideoId: 'HXV3zeQKqGY',
    modules: [
      {
        moduleTitle: 'Chương 1: Cơ Sở Dữ Liệu Quan Hệ & Thiết Kế Lược Đồ',
        lessons: [
          {
            id: 301,
            title: '01. CSDL quan hệ là gì? Khóa chính & Khóa ngoại',
            duration: '23:10',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 0,
            end_seconds: 1390,
            description: 'Hiểu bản chất Relational Database Management System (RDBMS), mô hình bảng dữ liệu, Primary Key và Foreign Key quan hệ 1-N, N-N.',
            sampleCode: `// Mô phỏng quan hệ 1-N giữa User và Khóa học
const users = [{ id: 1, name: 'Nguyễn Văn A' }];
const enrollments = [{ id: 101, userId: 1, courseId: 10, enrolledAt: '2026-10-26' }];

const userWithCourses = users.map(u => ({
  ...u,
  courses: enrollments.filter(e => e.userId === u.id)
}));
console.log('Lược đồ liên kết:', JSON.stringify(userWithCourses));`
          },
          {
            id: 302,
            title: '02. Thiết kế lược đồ CSDL & Chuẩn hóa dữ liệu (1NF, 2NF, 3NF)',
            duration: '20:21',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 1390,
            end_seconds: 2611,
            description: 'Quy trình chuẩn hóa cơ sở dữ liệu để loại bỏ dữ liệu dư thừa, tránh dị thường cập nhật và tối ưu lưu trữ.',
            sampleCode: `// Chuẩn hóa bảng dữ liệu
const rawOrder = {
  orderId: 1,
  customerName: 'Trần Văn B',
  customerPhone: '0912345678',
  item1: 'Khóa học React',
  price1: 790000
};
console.log('Lược đồ gốc cần chuẩn hóa:', rawOrder);`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Cú Pháp SQL Cơ Bản & Thao Tác Bảng',
        lessons: [
          {
            id: 303,
            title: '03. Cú pháp SQL cơ bản & Truy vấn dữ liệu SELECT',
            duration: '32:18',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 2611,
            end_seconds: 4549,
            description: 'Thành thạo SELECT, WHERE, ORDER BY, GROUP BY, HAVING và các hàm tổng hợp COUNT, SUM, AVG.',
            sampleCode: `// Mô phỏng câu lệnh SQL SELECT * WHERE price < 800000
const courses = [
  { name: 'React', price: 790000 },
  { name: 'Go', price: 990000 },
  { name: 'Python', price: 650000 }
];

const affordableCourses = courses.filter(c => c.price < 800000);
console.log('Kết quả lọc:', affordableCourses);`
          },
          {
            id: 304,
            title: '04. Tạo bảng CREATE TABLE & Khai báo Datatypes',
            duration: '15:16',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 4549,
            end_seconds: 5465,
            description: 'Lựa chọn kiểu dữ liệu tối ưu: INT, BIGINT, VARCHAR, TEXT, DATETIME, ENUM, DECIMAL cho số dư ví tiền.',
            sampleCode: `// Định nghĩa Schema
const tableSchema = {
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
    { name: 'email', type: 'VARCHAR(255) NOT NULL UNIQUE' },
    { name: 'wallet_balance', type: 'DECIMAL(12,2) DEFAULT 0.00' }
  ]
};
console.log('Schema DDL:', tableSchema);`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: Thao Tác Dữ Liệu & Ràng Buộc Toàn Vẹn',
        lessons: [
          {
            id: 305,
            title: '05. Chèn dữ liệu INSERT INTO & Cập nhật UPDATE',
            duration: '07:12',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 5465,
            end_seconds: 5897,
            description: 'Thực hiện các thao tác DML (Data Manipulation Language) thêm mới, chỉnh sửa, xóa mềm (Soft Delete).',
            sampleCode: `// Thao tác cập nhật số dư ví an toàn
let userWallet = { userId: 1, balance: 1000000 };
function deposit(amount) {
  if (amount <= 0) throw new Error('Số tiền phải lớn hơn 0');
  userWallet.balance += amount;
  return userWallet;
}

console.log('Sau khi nạp 500.000 đ:', deposit(500000));`
          },
          {
            id: 306,
            title: '06. Ràng buộc toàn vẹn CONSTRAINTS & Tối ưu Index',
            duration: '36:43',
            videoId: 'HXV3zeQKqGY',
            start_seconds: 5897,
            end_seconds: 8100,
            description: 'Sử dụng UNIQUE, NOT NULL, CHECK, FOREIGN KEY ON DELETE CASCADE và đánh chỉ mục B-Tree Index tăng tốc truy vấn.',
            sampleCode: `// Kiểm tra ràng buộc duy nhất (Unique Constraint)
const registeredEmails = new Set(['user1@gmail.com', 'user2@gmail.com']);
function register(email) {
  if (registeredEmails.has(email)) return 'Lỗi: Email đã tồn tại!';
  registeredEmails.add(email);
  return 'Đăng ký thành công!';
}

console.log(register('user1@gmail.com'));
console.log(register('newuser@gmail.com'));`
          }
        ]
      }
    ]
  },

  // 4: Python & AI (Video ID: rfscVS0vtbw - freeCodeCamp Python)
  4: {
    courseId: 4,
    defaultVideoId: 'rfscVS0vtbw',
    modules: [
      {
        moduleTitle: 'Chương 1: Bắt Đầu Với Python & Cài Đặt Môi Trường',
        lessons: [
          {
            id: 401,
            title: '01. Giới thiệu ngôn ngữ Python & Lập trình AI',
            duration: '06:40',
            videoId: 'rfscVS0vtbw',
            start_seconds: 0,
            end_seconds: 400,
            description: 'Khám phá thế giới Python, hệ sinh thái trí tuệ nhân tạo Machine Learning, Deep Learning, Pandas và Scikit-Learn.',
            sampleCode: `// Bài tập logic Python bằng JavaScript
const aiTopics = ['Machine Learning', 'Computer Vision', 'NLP', 'LLM'];
console.log('Các lĩnh vực AI trọng tâm:', aiTopics.join(' -> '));`
          },
          {
            id: 402,
            title: '02. Cài đặt Python 3, PyCharm & Visual Studio Code',
            duration: '08:26',
            videoId: 'rfscVS0vtbw',
            start_seconds: 400,
            end_seconds: 906,
            description: 'Thiết lập môi trường Virtual Environment (venv), quản lý package với pip và cấu hình linter chuẩn PEP8.',
            sampleCode: `// Mô phỏng kiểm tra phiên bản môi trường
const pythonEnv = {
  version: 'Python 3.12.2',
  pipVersion: '24.0',
  virtualEnv: true
};
console.log('Môi trường sẵn sàng:', pythonEnv);`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Cú Pháp Nền Tảng & Kiểu Dữ Liệu',
        lessons: [
          {
            id: 403,
            title: '03. Biến số, Kiểu dữ liệu số và Chuỗi trong Python',
            duration: '69:09',
            videoId: 'rfscVS0vtbw',
            start_seconds: 906,
            end_seconds: 5055,
            description: 'Làm việc với số nguyên, số thực float, chuỗi string formatting f-string, slicing và các phương thức xử lý văn bản.',
            sampleCode: `// Xử lý chuỗi và số
const courseTitle = 'Python Cho Người Mới Bắt Đầu';
const durationHours = 45;
console.log(\`Khóa học "\${courseTitle}" có thời lượng \${durationHours} giờ.\`);`
          },
          {
            id: 404,
            title: '04. Hàm số Functions & Tham số Arguments',
            duration: '64:29',
            videoId: 'rfscVS0vtbw',
            start_seconds: 5055,
            end_seconds: 8924,
            description: 'Định nghĩa hàm def, tham số mặc định, *args, **kwargs và phạm vi biến toàn cục/cục bộ.',
            sampleCode: `// Hàm tính khoảng cách cosine similarity trong AI
function calculateAccuracy(correct, total) {
  return ((correct / total) * 100).toFixed(2) + '%';
}
console.log('Độ chính xác mô hình:', calculateAccuracy(945, 1000));`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: Cấu Trúc Điều Khiển & OOP',
        lessons: [
          {
            id: 405,
            title: '05. Cấu trúc If/Else & Vòng lặp For/While',
            duration: '69:30',
            videoId: 'rfscVS0vtbw',
            start_seconds: 8924,
            end_seconds: 13094,
            description: 'Thành thạo cấu trúc rẽ nhánh, list comprehension trong Python, vòng lặp for in và xử lý ngoại lệ try-except.',
            sampleCode: `// Phân loại điểm số
const scores = [8.5, 9.2, 7.0, 9.8];
const honorStudents = scores.filter(s => s >= 9.0);
console.log('Số học viên xuất sắc:', honorStudents.length);`
          },
          {
            id: 406,
            title: '06. Lập trình hướng đối tượng OOP trong Python',
            duration: '47:46',
            videoId: 'rfscVS0vtbw',
            start_seconds: 13094,
            end_seconds: 15960,
            description: 'Xây dựng Class, Constructor __init__, thuộc tính, phương thức, tính kế thừa và đa hình trong lập trình hướng đối tượng.',
            sampleCode: `// Lớp đối tượng AI Agent
class AIAgent {
  constructor(name, model) {
    this.name = name;
    this.model = model;
  }
  predict(input) {
    return \`[\${this.name} (\${this.model})]: Phân tích thành công cho input "\${input}"\`;
  }
}

const bot = new AIAgent('EduViet Assistant', 'GPT-4o');
console.log(bot.predict('Học Python mất bao lâu?'));`
          }
        ]
      }
    ]
  },

  // 5: DevOps Docker (Video ID: pTXWhryx4e8)
  5: {
    courseId: 5,
    defaultVideoId: 'pTXWhryx4e8',
    modules: [
      {
        moduleTitle: 'Chương 1: Containerization & Kiến Trúc Docker',
        lessons: [
          {
            id: 501,
            title: '01. Container là gì? So sánh Docker với Virtual Machine',
            duration: '12:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 0,
            end_seconds: 720,
            description: 'Khác biệt căn bản giữa máy ảo Hypervisor và Container chia sẻ Linux Kernel. Lợi ích giải quyết bài toán "Chạy được ở máy tôi".',
            sampleCode: `// Kiểm tra trạng thái Docker Daemon
const dockerStatus = { active: true, engineVersion: '25.0.3', containersRunning: 4 };
console.log('Docker Engine Status:', dockerStatus);`
          },
          {
            id: 502,
            title: '02. Cài đặt Docker Desktop & Kiến trúc Docker Daemon',
            duration: '18:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 720,
            end_seconds: 1800,
            description: 'Cấu hình Docker CLI, Docker Engine, Storage Driver và tích hợp WSL2 trên Windows.',
            sampleCode: `// Danh sách lệnh Docker cơ bản
const commands = ['docker build -t eduviet .', 'docker run -p 3000:3000 eduviet'];
console.log('Lệnh deploy:', commands.join(' && '));`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Dockerfile & Multi-Stage Builds',
        lessons: [
          {
            id: 503,
            title: '03. Viết Dockerfile chuẩn production cho Node.js & React',
            duration: '30:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 1800,
            end_seconds: 3600,
            description: 'Tối ưu layer caching, bảo mật non-root user và giảm kích thước image từ 1GB xuống dưới 60MB với Alpine Linux.',
            sampleCode: `// Mô phỏng cấu trúc Dockerfile
const dockerfileStages = ['1. Builder (node:20-alpine)', '2. Runner (nginx:alpine)'];
console.log('Quy trình Multi-Stage Build:', dockerfileStages);`
          },
          {
            id: 504,
            title: '04. Quản lý Docker Images, Containers & Volumes',
            duration: '30:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 3600,
            end_seconds: 5400,
            description: 'Bảo toàn dữ liệu cơ sở dữ liệu với Named Volumes và cấu hình Bind Mounts khi phát triển hot-reloading.',
            sampleCode: `// Kiểm tra dữ liệu volume
const volumeMount = { hostPath: './data/mysql', containerPath: '/var/lib/mysql' };
console.log('Mount CSDL:', volumeMount);`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: Docker-Compose & CI/CD GitHub Actions',
        lessons: [
          {
            id: 505,
            title: '05. Thiết lập Docker-Compose kết hợp Frontend + Backend + DB',
            duration: '30:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 5400,
            end_seconds: 7200,
            description: 'Điều phối đa container, định nghĩa mạng ảo network bridge và biến môi trường .env tập trung.',
            sampleCode: `// Cấu hình dịch vụ Docker-Compose
const services = ['frontend (port 80)', 'backend-api (port 3000)', 'mysql-db (port 3306)'];
console.log('Các microservice trong mạng Docker:', services.join(' | '));`
          },
          {
            id: 506,
            title: '06. Tích hợp CI/CD tự động deploy lên VPS Linux',
            duration: '30:00',
            videoId: 'pTXWhryx4e8',
            start_seconds: 7200,
            end_seconds: 9000,
            description: 'Tự động chạy unit test, build docker image, đẩy lên Docker Hub và SSH tự động deploy lên server sản phẩm.',
            sampleCode: `// Kết quả CI/CD Pipeline
const pipeline = { test: 'PASSED', build: 'SUCCESS', deploy: 'COMPLETED' };
console.log('Trạng thái CI/CD:', pipeline);`
          }
        ]
      }
    ]
  },

  // 6: Flutter & Dart (Video ID: IgTUncKx66M - freeCodeCamp Flutter)
  6: {
    courseId: 6,
    defaultVideoId: 'IgTUncKx66M',
    modules: [
      {
        moduleTitle: 'Chương 1: Tổng Quan Flutter & Ngôn Ngữ Dart',
        lessons: [
          {
            id: 601,
            title: '01. Giới thiệu Flutter & Cài đặt môi trường di động',
            duration: '15:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 0,
            end_seconds: 900,
            description: 'Hệ sinh thái Flutter đa nền tảng cho iOS, Android, Web & Desktop. Cài đặt Flutter SDK, Android Studio & Xcode.',
            sampleCode: `// Kiểm tra trạng thái flutter doctor
const doctor = { androidToolchain: true, xcode: true, vsCode: true };
console.log('Flutter Doctor status: Ready to build!');`
          },
          {
            id: 602,
            title: '02. Cú pháp ngôn ngữ Dart cốt lõi & OOP căn bản',
            duration: '25:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 900,
            end_seconds: 2400,
            description: 'Kiểu dữ liệu mạnh Static Typing, Sound Null Safety, Mixins, Async/Await Futures & Streams trong Dart.',
            sampleCode: `// Mô phỏng Null Safety trong Dart
function formatUserName(name) {
  const safeName = name ? name.trim() : 'Khách vãng lai';
  return \`Xin chào: \${safeName}\`;
}
console.log(formatUserName(' Nguyễn Văn A '));
console.log(formatUserName(null));`
          }
        ]
      },
      {
        moduleTitle: 'Chương 2: Xây Dựng Giao Diện Widget UI',
        lessons: [
          {
            id: 603,
            title: '03. Stateless & Stateful Widgets trong Flutter',
            duration: '30:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 2400,
            end_seconds: 4200,
            description: 'Tư duy "Everything is a Widget". Vòng đời của State: initState, build, setState, dispose.',
            sampleCode: `// Mô phỏng setState trong Flutter
let counter = 0;
function increment() {
  counter += 1;
  console.log('Giao diện cập nhật lại, counter =', counter);
}
increment();
increment();`
          },
          {
            id: 604,
            title: '04. Layouts: Row, Column, Stack, ListView & Responsive',
            duration: '30:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 4200,
            end_seconds: 6000,
            description: 'Tổ chức bố cục giao diện linh hoạt thích ứng các kích thước màn hình điện thoại và máy tính bảng.',
            sampleCode: `// Tạo danh sách thẻ hiển thị sản phẩm
const screenWidth = 390;
const isTablet = screenWidth > 600;
console.log('Chế độ màn hình:', isTablet ? 'Tablet Layout (2 cột)' : 'Mobile Layout (1 cột)');`
          }
        ]
      },
      {
        moduleTitle: 'Chương 3: State Management & Kết Nối REST API',
        lessons: [
          {
            id: 605,
            title: '05. Quản lý trạng thái với Provider / Bloc',
            duration: '30:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 6000,
            end_seconds: 7800,
            description: 'Quản lý state quy mô lớn, tách biệt logic nghiệp vụ khỏi UI widget, tránh render lại không cần thiết.',
            sampleCode: `// Quản lý trạng thái giỏ hàng mobile
let cartItems = [];
function addToCart(course) {
  cartItems.push(course);
  console.log(\`Đã thêm "\${course.title}" vào giỏ mobile. Tổng: \${cartItems.length} mục.\`);
}
addToCart({ title: 'Khóa học Flutter' });`
          },
          {
            id: 606,
            title: '06. Gọi REST API, parse JSON & Deploy lên Chợ ứng dụng',
            duration: '30:00',
            videoId: 'IgTUncKx66M',
            start_seconds: 7800,
            end_seconds: 9600,
            description: 'Kết nối API với thư viện Dio/Http, xử lý token, phân trang dữ liệu và đóng gói file .apk / .ipa xuất bản lên Store.',
            sampleCode: `// Xử lý JSON từ REST API
const apiResponse = '{"code":200,"data":{"courseId":6,"enrolled":true}}';
const parsed = JSON.parse(apiResponse);
console.log('Dữ liệu API phản hồi:', parsed.data);`
          }
        ]
      }
    ]
  }
};

// Hàm lấy curriculum theo courseId, có fallback mặc định nếu chưa định nghĩa
export function getCurriculumForCourse(course) {
  const courseId = Number(course?.course_id || 1);
  if (COURSE_CURRICULA[courseId]) {
    return COURSE_CURRICULA[courseId];
  }
  // Fallback an toàn dựa trên React Course
  return {
    ...COURSE_CURRICULA[1],
    courseId,
    courseTitle: course?.title || 'Khóa học lập trình EduViet'
  };
}
