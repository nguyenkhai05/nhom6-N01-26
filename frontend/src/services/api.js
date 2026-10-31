// Dịch vụ gọi API backend NestJS (lms/). Đổi địa chỉ bằng biến VITE_API_URL trong frontend/.env
export const API_URL = import.meta.env.VITE_API_URL ?? '';

const FALLBACK_CATEGORIES = [
  { category_id: 1, category_name: 'Frontend', order_index: 1 },
  { category_id: 2, category_name: 'Backend', order_index: 2 },
  { category_id: 3, category_name: 'Cơ sở dữ liệu', order_index: 3 },
  { category_id: 4, category_name: 'Mobile', order_index: 4 },
  { category_id: 5, category_name: 'DevOps', order_index: 5 },
];

const FALLBACK_COURSES = [
  {
    course_id: 1,
    title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
    slug: 'lap-trinh-web-frontend-reactjs',
    description: 'Nắm vững React 19, React Router v7, Redux Toolkit, Tailwind CSS, tối ưu SEO với Next.js và hoàn thiện 3 dự án thực tế.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    price: 890000,
    old_price: 1200000,
    category: { id: 1, name: 'Frontend' },
    level: 'Beginner',
    instructor: { id: 2, name: 'Vũ Quốc Huy (Lead Frontend)' },
    duration: '52 giờ',
    studentsCount: 340,
    rating: '4.9',
  },
  {
    course_id: 2,
    title: 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL',
    slug: 'backend-nestjs-mysql-architecture',
    description: 'Kiến trúc Clean Architecture, Dependency Injection, TypeORM, xác thực JWT, Redis Caching, Microservices cơ bản.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    price: 950000,
    old_price: 1350000,
    category: { id: 2, name: 'Backend' },
    level: 'Intermediate',
    instructor: { id: 3, name: 'Nguyễn Tuấn Kiệt (Senior Architect)' },
    duration: '48 giờ',
    studentsCount: 285,
    rating: '4.95',
  },
  {
    course_id: 3,
    title: 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL',
    slug: 'database-design-mysql-optimization',
    description: 'Mô hình hóa ERD, chuẩn hóa 3NF, đánh chỉ mục Indexing B-Tree, tối ưu câu lệnh truy vấn phức tạp, Transaction ACID.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    price: 490000,
    old_price: 750000,
    category: { id: 3, name: 'Cơ sở dữ liệu' },
    level: 'Beginner',
    instructor: { id: 4, name: 'Trần Minh Quang (DBA Expert)' },
    duration: '32 giờ',
    studentsCount: 198,
    rating: '4.85',
  },
  {
    course_id: 4,
    title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
    slug: 'python-data-science-ai-machine-learning',
    description: 'Thành thạo NumPy, Pandas, Matplotlib, Seaborn và xây dựng mô hình dự đoán cơ bản với Scikit-Learn.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    price: 790000,
    old_price: 1100000,
    category: { id: 2, name: 'Backend' },
    level: 'Beginner',
    instructor: { id: 5, name: 'Lê Hoàng Long (AI Engineer)' },
    duration: '45 giờ',
    studentsCount: 412,
    rating: '4.9',
  },
  {
    course_id: 5,
    title: 'DevOps Thực Chiến: Docker, Docker-Compose & CI/CD GitHub Actions',
    slug: 'devops-docker-cicd-github-actions',
    description: 'Container hóa ứng dụng Frontend/Backend, thiết lập quy trình tự động Build, Test và Deploy lên VPS Linux.',
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    price: 690000,
    old_price: 990000,
    category: { id: 5, name: 'DevOps' },
    level: 'Intermediate',
    instructor: { id: 6, name: 'Phạm Đức Anh (DevOps Specialist)' },
    duration: '36 giờ',
    studentsCount: 165,
    rating: '4.92',
  },
  {
    course_id: 6,
    title: 'Lập Trình Ứng Dụng Đa Nền Tảng Flutter & Dart Từ Số 0',
    slug: 'lap-trinh-mobile-flutter-dart',
    description: 'Xây dựng ứng dụng di động cho iOS & Android với Flutter Framework, State Management Bloc/Provider, tích hợp REST API.',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    price: 850000,
    old_price: 1250000,
    category: { id: 4, name: 'Mobile' },
    level: 'Beginner',
    instructor: { id: 7, name: 'Đỗ Tuấn Thành (Mobile Tech Lead)' },
    duration: '50 giờ',
    studentsCount: 220,
    rating: '4.88',
  },
  {
    course_id: 7,
    title: 'Lập Trình Hệ Thống Phân Tán Cao Cấp với Golang & gRPC',
    slug: 'golang-high-performance-microservices',
    description: 'Xây dựng Microservices hiệu năng cao chịu tải hàng triệu request/giây, Goroutines & Channels, Kafka Message Queue, gRPC Protocol.',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    price: 990000,
    old_price: 1500000,
    category: { id: 2, name: 'Backend' },
    level: 'Advanced',
    instructor: { id: 8, name: 'Lâm Gia Bách (Principal Backend Engineer)' },
    duration: '46 giờ',
    studentsCount: 180,
    rating: '4.96',
  },
  {
    course_id: 8,
    title: 'Next.js 15 App Router Fullstack & Server Actions',
    slug: 'nextjs-15-app-router-fullstack',
    description: 'Chinh phục SSR/SSG chuẩn công nghiệp, React Server Components (RSC), tích hợp Stripe/Momo Checkout, triển khai Vercel & AWS.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    price: 890000,
    old_price: 1300000,
    category: { id: 1, name: 'Frontend' },
    level: 'Intermediate',
    instructor: { id: 2, name: 'Vũ Quốc Huy (Lead Frontend)' },
    duration: '44 giờ',
    studentsCount: 310,
    rating: '4.94',
  },
  {
    course_id: 9,
    title: 'Kỹ Thuật Prompt Engineering & Ứng Dụng LLMs Vào Doanh Nghiệp',
    slug: 'prompt-engineering-generative-ai-rag',
    description: 'Nắm vững kỹ thuật Few-shot/Chain-of-Thought Prompting, xây dựng hệ thống RAG với LangChain, nhúng Chatbot AI tự động hóa CSKH.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    price: 650000,
    old_price: 990000,
    category: { id: 2, name: 'Backend' },
    level: 'Beginner',
    instructor: { id: 5, name: 'Lê Hoàng Long (AI Engineer)' },
    duration: '30 giờ',
    studentsCount: 450,
    rating: '4.91',
  },
];

async function request(path, { signal } = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, { signal });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error(`API trả về Content-Type không hợp lệ hoặc lỗi ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // Fallback an toàn khi chạy trên Vercel Static Hosting hoặc khi server trả HTML SPA
    if (path.startsWith('/courses')) {
      if (path === '/courses' || path.startsWith('/courses?')) {
        return FALLBACK_COURSES;
      }
      const match = path.match(/\/courses\/(\d+)/);
      if (match) {
        const id = Number(match[1]);
        const course = FALLBACK_COURSES.find((c) => c.course_id === id);
        if (course) return course;
      }
    }
    if (path.startsWith('/categories')) {
      return FALLBACK_CATEGORIES;
    }
    throw err;
  }
}

// Backend trả category.category_name / instructor.full_name,
// còn giao diện hiện tại dùng category.name / instructor.name → quy về một dạng.
export function normalizeCourse(c) {
  return {
    ...c,
    price: Number(c.price) || 0,
    category: c.category ? { id: c.category.category_id || c.category.id, name: c.category.category_name || c.category.name } : null,
    instructor: c.instructor ? { id: c.instructor.user_id || c.instructor.id, name: c.instructor.full_name || c.instructor.name } : null,
  };
}

export async function getCourses(params = {}, opts) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  ).toString();
  const res = await request(`/courses${qs ? `?${qs}` : ''}`, opts);
  const items = Array.isArray(res) ? res : (res?.data ?? FALLBACK_COURSES);
  return items.map(normalizeCourse);
}

export async function getCourse(id, opts) {
  return normalizeCourse(await request(`/courses/${id}`, opts));
}

export async function getCategories(opts) {
  const data = await request('/categories', opts);
  const items = Array.isArray(data) ? data : FALLBACK_CATEGORIES;
  return items
    .map((c) => ({ id: c.category_id || c.id, name: c.category_name || c.name, order: c.order_index ?? 0 }))
    .sort((a, b) => a.order - b.order);
}
