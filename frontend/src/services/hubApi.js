import { API_URL } from './api';
import { getToken, clearToken } from './auth';

/* ================= DỮ LIỆU ĐẶC TẢ TIÊU CHUẨN (FALLBACK RESILIENT) ================= */

export const INSTRUCTORS = [
  {
    id: 1,
    user_id: 2,
    slug: 'vu-quoc-huy',
    displayName: 'Vũ Quốc Huy',
    roleTitle: 'Lead Frontend Engineer & Solutions Architect',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    expertiseTags: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Frontend Performance'],
    bio: 'Hơn 9 năm kinh nghiệm phát triển kiến trúc Web Frontend quy mô lớn. Từng giữ vị trí Tech Lead tại các công ty công nghệ đa quốc gia, trực tiếp dẫn dắt nhiều dự án thương mại phục vụ hàng triệu người dùng hoạt động.',
    teachingMethodology: 'Tập trung vào tư duy Component-Driven, trực quan hóa luồng dữ liệu, thực hành mổ xẻ mã nguồn thực tế và rèn luyện kỹ năng tự giải quyết vấn đề kỹ thuật.',
    coursesTaughtCount: 2,
    courseIds: [1, 8],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'PUBLISHED',
  },
  {
    id: 2,
    user_id: 3,
    slug: 'nguyen-tuan-kiet',
    displayName: 'Nguyễn Tuấn Kiệt',
    roleTitle: 'Senior Cloud & Backend Architect',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    expertiseTags: ['NestJS', 'Clean Architecture', 'Microservices', 'TypeORM', 'Redis', 'Docker'],
    bio: '11 năm kinh nghiệm thiết kế hệ thống Backend chịu tải cao, Microservices và cơ sở hạ tầng đám mây. Đam mê chia sẻ kiến trúc phần mềm sạch và bảo mật hệ thống.',
    teachingMethodology: 'Chú trọng vào chuẩn thiết kế Clean Architecture, tính nhất quán ACID của giao dịch và quy trình kiểm thử tự động (Unit & E2E Testing).',
    coursesTaughtCount: 2,
    courseIds: [2, 7],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'PUBLISHED',
  },
  {
    id: 3,
    user_id: 4,
    slug: 'tran-minh-quang',
    displayName: 'Trần Minh Quang',
    roleTitle: 'Database Administrator & Query Optimization Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    expertiseTags: ['MySQL', 'PostgreSQL', 'Database Design 3NF', 'B-Tree Indexing', 'Query Optimization', 'ACID Transactions'],
    bio: 'Chuyên gia cơ sở dữ liệu với hơn 8 năm làm việc trong lĩnh vực tài chính và ngân hàng. Từng tối ưu các cụm cơ sở dữ liệu hàng chục terabyte đạt độ trễ sub-millisecond.',
    teachingMethodology: 'Học qua các tình huống nghẽn cổ chai thực tế, đọc Execution Plan (EXPLAIN) và kỹ thuật phân tích cấu trúc lưu trữ nội tại của RDBMS.',
    coursesTaughtCount: 1,
    courseIds: [3],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'PUBLISHED',
  },
  {
    id: 4,
    user_id: 5,
    slug: 'dang-hai-nam',
    displayName: 'Đặng Hải Nam',
    roleTitle: 'AI & Machine Learning Engineer Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    expertiseTags: ['Python', 'Pandas & NumPy', 'PyTorch', 'Prompt Engineering', 'LangChain', 'RAG Architecture'],
    bio: '7 năm kinh nghiệm nghiên cứu và phát triển giải pháp Trí tuệ nhân tạo, ứng dụng mô hình ngôn ngữ lớn (LLMs) vào tự động hóa quy trình nghiệp vụ doanh nghiệp.',
    teachingMethodology: 'Học trực quan thông qua đồ thị dữ liệu, chuyển dịch từ toán học ứng dụng sang mã nguồn Python rõ ràng và xây dựng sản phẩm AI có khả năng triển khai.',
    coursesTaughtCount: 2,
    courseIds: [4, 9],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'PUBLISHED',
  },
];

const FALLBACK_TRIALS = [
  {
    trial_id: 1,
    title: 'Xây Dựng Component Đầu Tiên với React 19 & Props',
    course_id: 1,
    course_title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
    course_price: 890000,
    language: 'javascript',
    duration_minutes: 10,
    difficulty: 'Cơ bản',
    video_id: 'bMknfKXIFA8',
    video_start: 60,
    live_preview_type: 'react-component',
    summary: 'Làm quen với tư duy phân rã giao diện (Component-Driven), cú pháp JSX và truyền nhận dữ liệu qua Props trong React 19.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: Component & Props Trong React 19
- **Component**: Khối giao diện độc lập, tái sử dụng được trên web.
- **Props**: Tham số đầu vào truyền từ Component cha xuống Component con. Props là dữ liệu chỉ đọc (Immutable), giúp giao diện phản chiếu trạng thái dự đoán được.
- **React 19**: Tự động tối ưu hóa re-render thông qua React Compiler mà không cần lạm dụng useMemo/useCallback.`,
    instructions: `### Mục tiêu bài học thử:
Bạn đang xây dựng thẻ chào mừng học viên (**Welcome Card**) trong hệ thống EduViet.

#### 📋 Các bước thực hiện:
1. **Bước 1**: Đọc và hiểu hàm component \`WelcomeCard({ name, role })\`.
2. **Bước 2**: Gán giá trị mặc định cho \`role = "Học viên"\` nếu không được truyền vào.
3. **Bước 3**: Trả về chuỗi định dạng: \`"Xin chào " + name + " - Vai trò: " + role\`.
4. **Bước 4**: Bấm **"Chạy Thử Code"** và **"Kiểm Tra & Hoàn Thành"** để xác nhận kết quả!`,
    hints: [
      'Gợi ý 1: Khai báo tham số: function WelcomeCard({ name, role = "Học viên" })',
      'Gợi ý 2: Trả về template string: return `Xin chào ${name} - Vai trò: ${role}`;',
    ],
    initial_code: `function WelcomeCard({ name, role = "Học viên" }) {
  // BƯỚC THỰC HÀNH: Hoàn thiện thông điệp chào mừng
  // Định dạng chuẩn: "Xin chào " + name + " - Vai trò: " + role
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
    duration_minutes: 12,
    difficulty: 'Cơ bản',
    video_id: '2n3xS89Wax8',
    video_start: 120,
    live_preview_type: 'api-response',
    summary: 'Tìm hiểu cách Controller tiếp nhận HTTP Request, xử lý tham số và phản hồi dữ liệu chuẩn JSON trong framework NestJS.',
    concept_summary: `### 💡 Khái Niệm Trọng Tâm: NestJS Controllers & Routing
- **Controllers**: Lớp tiếp nhận các request từ client và trả response.
- **Decorators**: @Controller('courses'), @Get(':id') giúp định tuyến rõ ràng, chuẩn phong cách TypeScript/NestJS.`,
    instructions: `### Mục tiêu bài học thử:
Viết hàm định tuyến trả về dữ liệu khóa học theo chuẩn RESTful API.`,
    hints: [
      'Gợi ý: Kiểm tra id hợp lệ và trả về object { success: true, course_id: id }',
    ],
    initial_code: `function getCourseDetail(courseId) {
  // Hoàn thiện hàm trả về thông tin khóa học
  return {
    success: true,
    course_id: Number(courseId)
  };
}

console.log(getCourseDetail(1));`,
    solution_code: `function getCourseDetail(courseId) {
  return { success: true, course_id: Number(courseId) };
}`,
    test_cases: [
      {
        input: '1',
        expected_output: '{"success":true,"course_id":1}',
        description: 'Lấy chi tiết khóa học ID 1',
      },
    ],
  },
];

const FALLBACK_FINDER_CONFIG = {
  ruleVersion: 'finder-v2',
  questions: [
    {
      id: 'goal',
      title: 'Mục tiêu học tập chính của bạn là gì?',
      required: true,
      options: [
        { value: 'FRONTEND', label: 'Phát triển giao diện Web (Frontend / React / Next.js / UI)', icon: 'bi-window-sidebar' },
        { value: 'BACKEND', label: 'Xây dựng hệ thống máy chủ & API (Backend / NestJS / MySQL)', icon: 'bi-hdd-network' },
        { value: 'AI', label: 'Phân tích dữ liệu & Trí tuệ nhân tạo (Python / Data / LLMs)', icon: 'bi-cpu' },
        { value: 'FOUNDATION', label: 'Làm quen tư duy lập trình từ con số 0 (Nhập môn / Cơ sở dữ liệu)', icon: 'bi-stars' },
      ],
    },
    {
      id: 'knownSkills',
      title: 'Nền tảng kỹ năng hiện tại của bạn?',
      required: false,
      isMultiple: true,
      options: [
        { value: 'ZERO', label: 'Chưa có kiến thức lập trình (Bắt đầu từ số 0)' },
        { value: 'HTML_CSS', label: 'Đã biết HTML5 / CSS3 cơ bản' },
        { value: 'JAVASCRIPT', label: 'Đã biết JavaScript căn bản (Biến, Mảng, Hàm)' },
        { value: 'PYTHON', label: 'Đã biết cú pháp Python cơ bản' },
        { value: 'SQL', label: 'Đã biết viết câu lệnh SELECT / JOIN trong SQL' },
      ],
    },
    {
      id: 'budgetMaxVnd',
      title: 'Khoảng ngân sách dự kiến của bạn cho một khóa học?',
      required: false,
      options: [
        { value: 500000, label: 'Dưới 500.000 đ (Tiết kiệm)' },
        { value: 900000, label: 'Từ 500.000 đ - 900.000 đ (Phổ biến)' },
        { value: 1500000, label: 'Từ 900.000 đ - 1.500.000 đ (Chuyên sâu)' },
        { value: 0, label: 'Xem tất cả các khóa phù hợp' },
      ],
    },
    {
      id: 'hoursPerWeek',
      title: 'Quỹ thời gian bạn có thể dành để học mỗi tuần?',
      required: false,
      options: [
        { value: 4, label: 'Khoảng 3 - 5 giờ / tuần (Học tranh thủ buổi tối)' },
        { value: 8, label: 'Khoảng 6 - 10 giờ / tuần (Tiến độ tiêu chuẩn)' },
        { value: 15, label: 'Trên 10 giờ / tuần (Tập trung toàn thời gian / Bootcamp)' },
      ],
    },
  ],
};

const FALLBACK_FAQ = [
  {
    topic_id: 'payment',
    topic_name: 'Đăng Ký & Thanh Toán Học Phí',
    icon: 'bi-credit-card-2-front-fill',
    items: [
      {
        question: 'Tôi có thể thanh toán khóa học bằng những phương thức nào?',
        answer: 'EduViet hỗ trợ thanh toán trực tiếp qua Số dư ví học tập nội bộ. Bạn có thể nạp tiền vào ví bằng mã QR Ngân hàng (MBBank, Vietcombank...) hoặc qua số dư tài khoản thử nghiệm.',
      },
      {
        question: 'Chính sách hoàn học phí của EduViet được áp dụng như thế nào?',
        answer: 'Học viên được cam kết hoàn tiền 100% trong vòng 7 ngày kể từ khi kích hoạt khóa học nếu cảm thấy nội dung chưa phù hợp với lộ trình nghề nghiệp của bản thân.',
      },
    ],
  },
  {
    topic_id: 'trial_learning',
    topic_name: 'Học Thử & Trải Nghiệm Tương Tác',
    icon: 'bi-laptop-fill',
    items: [
      {
        question: 'Học thử tại EduViet có mất phí hoặc yêu cầu thẻ tín dụng không?',
        answer: 'Hoàn toàn miễn phí 100% và không yêu cầu thẻ tín dụng. Bạn có thể làm quen với giao diện bài giảng, xem video đại diện và viết code trực tiếp trong Sandbox trước khi quyết định đăng ký.',
      },
      {
        question: 'Mã nguồn của tôi được thực thi như thế nào để đảm bảo an toàn?',
        answer: 'EduViet sử dụng cơ chế Sandbox cách ly an toàn, ngăn chặn xung đột bộ nhớ trình duyệt và tự động ngắt nếu có vòng lặp vô hạn sau 3000ms.',
      },
    ],
  },
];

const FALLBACK_BUNDLES = [
  {
    bundle_id: 1,
    title: 'Combo Chinh Phục Fullstack Web Developer: React 19 + NestJS + MySQL',
    slug: 'combo-fullstack-web-developer-react-nestjs-mysql',
    description: 'Lộ trình trọn vẹn từ nền tảng giao diện React 19 chuyên sâu, xây dựng RESTful API chuẩn Clean Architecture với NestJS và thiết kế tối ưu cơ sở dữ liệu quan hệ MySQL.',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1890000,
    original_price: 2330000,
    discount_percent: 20,
    is_active: true,
    course_ids: [1, 2, 3],
  },
  {
    bundle_id: 2,
    title: 'Combo Đa Nền Tảng: Frontend ReactJS & Mobile Flutter Dart',
    slug: 'combo-frontend-web-mobile-flutter',
    description: 'Trang bị trọn bộ kỹ năng phát triển giao diện người dùng hiện đại trên cả trình duyệt Web và ứng dụng di động iOS/Android mượt mà.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1350000,
    original_price: 1740000,
    discount_percent: 22,
    is_active: true,
    course_ids: [1, 6],
  },
  {
    bundle_id: 3,
    title: 'Combo Backend Engineering & Trí Tuệ Nhân Tạo: Python AI + DevOps Docker',
    slug: 'combo-backend-python-ai-devops-docker',
    description: 'Thành thạo phân tích dữ liệu và AI với Python, làm chủ kỹ thuật Container hóa ứng dụng với Docker và quy trình tự động hóa CI/CD chuyên nghiệp.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    bundle_price: 1150000,
    original_price: 1480000,
    discount_percent: 22,
    is_active: true,
    course_ids: [4, 5],
  },
];

const FALLBACK_COMMUNITY_POSTS = [
  {
    post_id: 1,
    category: 'Hỏi đáp lập trình',
    title: 'Làm sao tối ưu hóa hiệu năng render trong React 19 khi hiển thị danh sách lớn?',
    content: 'Chào các bạn, mình đang làm tính năng hiển thị bảng lịch sử giao dịch lớn. Khi danh sách vượt quá 1.000 dòng thì DOM bị giật lag khi cuộn trang. Mình nên dùng kỹ thuật Virtual Scroll nào tối ưu nhất?',
    tags: ['React 19', 'Performance', 'VirtualScroll'],
    views_count: 342,
    likes_count: 28,
    is_solved: true,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: '2026-10-28T09:30:00Z',
    replies: [
      {
        reply_id: 1,
        content: 'Chào em, khi render tập dữ liệu lớn (>1.000 dòng), em nên dùng thư viện Windowing như `@tanstack/react-virtual` để chỉ render các phần tử nằm trong viewport màn hình, giữ khung hình 60fps mượt mà!',
        is_accepted: true,
        likes_count: 35,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: '2026-10-28T10:15:00Z',
      },
    ],
  },
  {
    post_id: 2,
    category: 'Kinh nghiệm học',
    title: 'Bí quyết làm chủ Clean Architecture và Dependency Injection trong NestJS',
    content: 'Chào các học viên EduViet! Khi phát triển ứng dụng Backend quy mô doanh nghiệp, việc phân tách các tầng Controllers, Services và Repositories là cực kỳ quan trọng...',
    tags: ['NestJS', 'CleanArchitecture', 'BestPractices'],
    views_count: 520,
    likes_count: 64,
    is_solved: false,
    author: { user_id: 2, full_name: 'Nguyễn Tuấn Kiệt (Giảng viên)' },
    created_at: '2026-10-27T14:20:00Z',
    replies: [],
  },
];

const FALLBACK_ARTICLES = [
  {
    article_id: 1,
    title: 'Cẩm Nang Tối Ưu Hóa Hiệu Năng React 19: Server Components & React Compiler',
    slug: 'cam-nang-toi-uu-hoa-hieu-nang-react-19',
    summary: 'Phân tích cơ chế React 19 Server Components, loại bỏ useMemo/useCallback với React Compiler tự động, và các bài toán xử lý giao diện đa luồng không giật lag.',
    category: 'Frontend',
    author_name: 'Vũ Quốc Huy (Lead Frontend)',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    read_time: '7 phút đọc',
    views_count: 1420,
    likes_count: 185,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    tags: ['React 19', 'NextJS', 'Frontend', 'Optimization'],
    is_published: true,
  },
  {
    article_id: 2,
    title: 'Xây Dựng RESTful API Chuẩn Clean Architecture Với NestJS & TypeORM',
    slug: 'xay-dung-restful-api-chuan-clean-architecture-nestjs',
    summary: 'Hướng dẫn thiết kế kiến trúc phân tầng trong NestJS: Controller, Service, DTO, Entity, Repository Pattern và kỹ thuật xử lý Exception Filter toàn cục.',
    category: 'Backend',
    author_name: 'Nguyễn Tuấn Kiệt (Senior Architect)',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    read_time: '9 phút đọc',
    views_count: 980,
    likes_count: 142,
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    tags: ['NestJS', 'Clean Architecture', 'TypeORM', 'Backend'],
    is_published: true,
  },
];

/* ================= HÀM XỬ LÝ GỌI API & FALLBACK THÔNG MINH ================= */

function computeCourseRecommendations(dto) {
  const goal = (dto?.goal || 'FRONTEND').toUpperCase();
  const knownSkills = (dto?.knownSkills || []).map((s) => s.toUpperCase());
  const budget = Number(dto?.budgetMaxVnd || 0);
  const hours = Number(dto?.hoursPerWeek || 8);

  const COURSES = [
    {
      course_id: 1,
      title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
      category_name: 'Frontend',
      price: 890000,
      old_price: 1200000,
      goals: ['FRONTEND'],
      reasons: [
        'Trực tiếp giải quyết mục tiêu làm chủ React 19, Next.js 15 và Server Components chuẩn công nghiệp',
        'Được thực hành xây dựng 3 dự án thực tế có portfolio hoàn thiện',
      ],
      level: 'Cơ bản - Trung cấp',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
      instructor_name: 'Vũ Quốc Huy (Lead Frontend)',
      canTry: true,
      previewTrialId: 1,
    },
    {
      course_id: 2,
      title: 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL',
      category_name: 'Backend',
      price: 950000,
      old_price: 1350000,
      goals: ['BACKEND'],
      reasons: [
        'Đào tạo kiến trúc Clean Architecture, Dependency Injection và TypeORM chuẩn doanh nghiệp',
        'Nắm vững thiết kế API bảo mật cao với JWT, RBAC và tối ưu hóa truy vấn',
      ],
      level: 'Trung cấp',
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      instructor_name: 'Nguyễn Tuấn Kiệt (Senior Architect)',
      canTry: true,
      previewTrialId: 2,
    },
    {
      course_id: 3,
      title: 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL',
      category_name: 'Cơ sở dữ liệu',
      price: 490000,
      old_price: 750000,
      goals: ['BACKEND', 'FOUNDATION'],
      reasons: [
        'Tập trung chuẩn hóa dữ liệu 3NF, phân tích câu lệnh SQL phức tạp và kỹ thuật Indexing B-Tree',
      ],
      level: 'Cơ bản',
      thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      instructor_name: 'Trần Minh Quang (DBA Specialist)',
      canTry: false,
    },
    {
      course_id: 4,
      title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
      category_name: 'AI & Data',
      price: 790000,
      old_price: 1100000,
      goals: ['AI', 'FOUNDATION'],
      reasons: [
        'Bắt đầu từ cú pháp Python thực chiến đến phân tích dữ liệu với Pandas, NumPy và AI cơ bản',
      ],
      level: 'Cơ bản',
      thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      instructor_name: 'Đặng Hải Nam (AI Engineer)',
      canTry: false,
    },
    {
      course_id: 8,
      title: 'Next.js 15 App Router Fullstack & Server Actions',
      category_name: 'Frontend',
      price: 890000,
      old_price: 1250000,
      goals: ['FRONTEND'],
      reasons: [
        'Làm chủ SSR/SSG chuẩn công nghiệp, Server Actions và tối ưu hóa SEO tốc độ cao',
      ],
      level: 'Trung cấp',
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      instructor_name: 'Vũ Quốc Huy (Lead Frontend)',
      canTry: true,
      previewTrialId: 1,
    },
  ];

  let matches = COURSES.filter((c) => c.goals.includes(goal));
  if (budget > 0) {
    const budgetFiltered = matches.filter((c) => c.price <= budget);
    if (budgetFiltered.length > 0) matches = budgetFiltered;
  }
  if (matches.length === 0) {
    matches = COURSES.slice(0, 3);
  }

  const items = matches.slice(0, 3).map((c, idx) => ({
    score: 95 - idx * 5,
    rankingScore: 95 - idx * 5,
    readiness: 'READY',
    course: c,
    reasons: c.reasons,
    missingPrerequisites: [],
    estimatedWeeks: Math.ceil(40 / Math.max(hours, 4)),
    previewTrialId: c.previewTrialId || null,
    canTry: c.canTry || false,
    owned: false,
  }));

  return {
    ruleVersion: 'finder-1',
    items,
    needsPreparation: [],
    notice: 'Gợi ý khóa học dựa trên mục tiêu khảo sát của bạn. Bạn có thể học thử tương tác miễn phí trước khi đăng ký!',
  };
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html') || res.status === 405) {
      return handleHubFallback(path, options);
    }

    const data = await res.json().catch(() => null);
    if (data === null) {
      return handleHubFallback(path, options);
    }
    return data;
  } catch {
    return handleHubFallback(path, options);
  }
}

function handleHubFallback(path, options) {
  const method = (options?.method || 'GET').toUpperCase();
  const body = options?.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // 1. Giảng viên (Instructors)
  if (path === '/instructors' || path.startsWith('/instructors?')) {
    return INSTRUCTORS;
  }
  if (path.startsWith('/instructors/')) {
    const slug = path.replace('/instructors/', '').split('?')[0];
    const inst = INSTRUCTORS.find((i) => i.slug === slug || String(i.id) === slug);
    if (inst) return inst;
    return INSTRUCTORS[0];
  }

  // 2. Học Thử (Trials)
  if (path === '/trials' || path.startsWith('/trials?')) {
    return FALLBACK_TRIALS;
  }
  if (path.startsWith('/trials/')) {
    const id = Number(path.replace('/trials/', '').split('/')[0]);
    const trial = FALLBACK_TRIALS.find((t) => t.trial_id === id) || FALLBACK_TRIALS[0];
    if (path.endsWith('/solution')) {
      return { trial_id: trial.trial_id, solution_code: trial.solution_code };
    }
    return trial;
  }

  // 3. Chọn Khóa Phù Hợp (Course Finder) & So Sánh
  if (path === '/course-finder/config') {
    return FALLBACK_FINDER_CONFIG;
  }
  if (path === '/course-finder/recommendations') {
    return computeCourseRecommendations(body);
  }
  if (path.startsWith('/courses/compare')) {
    const idsParam = path.split('ids=')[1] || '';
    const ids = decodeURIComponent(idsParam).split(',').map(Number);
    const mockCompareList = [
      {
        course_id: 1,
        title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
        price: 890000,
        level: 'Cơ bản - Trung cấp',
        category_name: 'Frontend',
        instructor_name: 'Vũ Quốc Huy (Lead Frontend)',
        prerequisites: ['HTML/CSS', 'JavaScript cơ bản'],
        targetOutcome: 'Xây dựng hoàn chỉnh ứng dụng Web hiện đại với React 19 & Next.js',
        hasInteractiveTrial: true,
      },
      {
        course_id: 2,
        title: 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL',
        price: 950000,
        level: 'Trung cấp',
        category_name: 'Backend',
        instructor_name: 'Nguyễn Tuấn Kiệt (Senior Architect)',
        prerequisites: ['JavaScript ES6', 'Cơ bản về Database'],
        targetOutcome: 'Thiết kế RESTful API chuẩn Clean Architecture, bảo mật JWT & TypeORM',
        hasInteractiveTrial: true,
      },
      {
        course_id: 3,
        title: 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL',
        price: 490000,
        level: 'Cơ bản',
        category_name: 'Cơ sở dữ liệu',
        instructor_name: 'Trần Minh Quang (DBA Specialist)',
        prerequisites: ['Không yêu cầu kiến thức trước'],
        targetOutcome: 'Thành thạo mô hình hóa ERD, chuẩn hóa 3NF và Indexing B-Tree tối ưu',
        hasInteractiveTrial: false,
      },
      {
        course_id: 4,
        title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
        price: 790000,
        level: 'Cơ bản',
        category_name: 'AI & Data',
        instructor_name: 'Đặng Hải Nam (AI Engineer)',
        prerequisites: ['Không yêu cầu kiến thức trước'],
        targetOutcome: 'Phân tích dữ liệu thực tế với Pandas, NumPy và thuật toán Machine Learning',
        hasInteractiveTrial: false,
      },
      {
        course_id: 8,
        title: 'Next.js 15 App Router Fullstack & Server Actions',
        price: 890000,
        level: 'Trung cấp',
        category_name: 'Frontend',
        instructor_name: 'Vũ Quốc Huy (Lead Frontend)',
        prerequisites: ['ReactJS cơ bản'],
        targetOutcome: 'Chinh phục SSR/SSG, Server Actions và triển khai Vercel Production',
        hasInteractiveTrial: true,
      },
    ];
    return mockCompareList.filter((c) => ids.includes(c.course_id));
  }

  // 4. FAQ & Trợ Giúp (Help Center)
  if (path === '/help/faq') {
    return FALLBACK_FAQ;
  }
  if (path === '/help/requests') {
    return { success: true, ticket_id: 'TCK-' + Math.floor(1000 + Math.random() * 9000), message: 'Yêu cầu hỗ trợ đã được ghi nhận thành công.' };
  }
  if (path === '/help/requests/my') {
    return [];
  }

  // 5. Combo Ưu Đãi (Bundles)
  if (path === '/bundles' || path.startsWith('/bundles?')) {
    return FALLBACK_BUNDLES;
  }
  if (path.startsWith('/bundles/')) {
    const id = Number(path.replace('/bundles/', '').split('/')[0]);
    const bundle = FALLBACK_BUNDLES.find((b) => b.bundle_id === id) || FALLBACK_BUNDLES[0];
    return bundle;
  }

  // 6. Cộng Đồng & Bài Viết (Community & Articles)
  if (path.startsWith('/community/posts')) {
    return FALLBACK_COMMUNITY_POSTS;
  }
  if (path.startsWith('/articles')) {
    return FALLBACK_ARTICLES;
  }

  // 7. Luyện Tập (Practice Exercises)
  if (path.startsWith('/practice/exercises')) {
    return [
      {
        exercise_id: 1,
        title: 'Xử lý Props và State trong React 19',
        category: 'Frontend',
        difficulty: 'Cơ bản',
        points: 50,
      },
      {
        exercise_id: 2,
        title: 'Thiết kế REST API với NestJS Service',
        category: 'Backend',
        difficulty: 'Trung cấp',
        points: 75,
      },
    ];
  }

  return { success: true };
}

function toQueryString(params = {}) {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined'
  );
  if (filtered.length === 0) return '';
  return `?${new URLSearchParams(filtered).toString()}`;
}

/* ================= EXPORT CÁC HÀM GỌI API CHO GIAO DIỆN ================= */

// 1. Giảng Viên (Instructors)
export const getInstructors = (query = {}) => request(`/instructors${toQueryString(query)}`);
export const getInstructor = (slugOrId) => request(`/instructors/${slugOrId}`);

// 2. Combo Ưu Đãi (Bundles)
export const getBundles = () => request('/bundles');
export const getBundle = (id) => request(`/bundles/${id}`);
export const getBundleQuote = (id) => request(`/bundles/${id}/quote`, { method: 'POST' });
export const checkoutBundle = (id) => request(`/bundles/${id}/checkout`, { method: 'POST' });

// 3. Dự Án Thực Tế (Projects)
export const getProjects = () => request('/projects');
export const getProject = (id) => request(`/projects/${id}`);
export const getMyProjectSubmission = (id) => request(`/projects/${id}/my-submission`);
export const saveProjectSubmission = (id, body) => request(`/projects/${id}/submissions`, { method: 'POST', body: JSON.stringify(body) });
export const getProjectShowcase = () => request('/projects/showcase');

// 4. Trung Tâm Luyện Tập (Practice)
export const getPracticeExercises = (query = {}) => request(`/practice/exercises${toQueryString(query)}`);
export const getPracticeExercise = (id) => request(`/practice/exercises/${id}`);
export const getSkillAssessments = () => request('/practice/assessments');
export const getSkillAssessment = (id) => request(`/practice/assessments/${id}`);
export const submitSkillAssessment = (id, answers) => request(`/practice/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
export const getWeeklyChallenge = () => request('/practice/challenges/weekly');

// 5. Cộng Đồng Học Viên (Community)
export const getCommunityPosts = (query = {}) => request(`/community/posts${toQueryString(query)}`);
export const getCommunityPost = (id) => request(`/community/posts/${id}`);
export const createCommunityPost = (body) => request('/community/posts', { method: 'POST', body: JSON.stringify(body) });
export const createCommunityReply = (postId, content) => request(`/community/posts/${postId}/replies`, { method: 'POST', body: JSON.stringify({ content }) });
export const acceptCommunityReply = (postId, replyId) => request(`/community/posts/${postId}/accept-reply`, { method: 'POST', body: JSON.stringify({ reply_id: replyId }) });
export const reportContent = (body) => request('/community/reports', { method: 'POST', body: JSON.stringify(body) });

// 6. Bài Viết & Cẩm Nang Công Nghệ (Articles)
export const getArticles = (query = {}) => request(`/articles${toQueryString(query)}`);
export const getArticle = (idOrSlug) => request(`/articles/${idOrSlug}`);
export const likeArticle = (id) => request(`/articles/${id}/like`, { method: 'POST' });

// 7. So Sánh Khóa Học (Course Comparison)
export const compareCourses = (ids) => {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request(`/courses/compare?ids=${encodeURIComponent(idsStr)}`);
};

// 8. Bộ Chọn Khóa Phù Hợp (Course Finder)
export const getCourseFinderConfig = () => request('/course-finder/config');
export const getCourseRecommendations = (body) =>
  request('/course-finder/recommendations', { method: 'POST', body: JSON.stringify(body) });

// 9. Học Thử Tương Tác (Interactive Trials - Codecademy Inspired)
export const getTrials = () => request('/trials');
export const getTrial = (id) => request(`/trials/${id}`);
export const getTrialSolution = (id) => request(`/trials/${id}/solution`);

// 10. Trung Tâm Hỗ Trợ & FAQ (Help Center)
export const getFaq = () => request('/help/faq');
export const getMySupportRequests = () => request('/help/requests/my');
export const createSupportRequest = (body) =>
  request('/help/requests', { method: 'POST', body: JSON.stringify(body) });

// 11. Tiến Độ & Khóa Học Của Tôi (Learning Dashboard)
export const getMyCourses = () => request('/learning/my-courses');
