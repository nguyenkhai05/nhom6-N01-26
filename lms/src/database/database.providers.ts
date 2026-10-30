import { DataSource } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Role } from '../role/role.entity.js';
import { Course } from '../course/course.entity.js';
import { Category } from '../category/category.entity.js';
import { CourseModule } from '../course-module/course-module.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';
import { Lesson } from '../lesson/lesson.entity.js';

export const INITIAL_CATEGORIES = [
  { category_id: 1, category_name: 'Frontend', order_index: 1 },
  { category_id: 2, category_name: 'Backend', order_index: 2 },
  { category_id: 3, category_name: 'Cơ sở dữ liệu', order_index: 3 },
  { category_id: 4, category_name: 'DevOps', order_index: 4 },
  { category_id: 5, category_name: 'Mobile', order_index: 5 },
];

export const INITIAL_COURSES = [
  {
    course_id: 1,
    instructor_id: 2,
    category_id: 1,
    title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
    slug: 'lap-trinh-web-frontend-reactjs',
    description: 'Nắm vững React 19, React Router v7, Redux Toolkit, Tailwind CSS, tối ưu SEO với Next.js và hoàn thiện 3 dự án thực tế.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    price: 890000,
    level: 'Beginner',
    status: 'Published',
    category: { category_id: 1, category_name: 'Frontend' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 2,
    instructor_id: 2,
    category_id: 2,
    title: 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL',
    slug: 'backend-nestjs-mysql-architecture',
    description: 'Kiến trúc Clean Architecture, Dependency Injection, TypeORM, xác thực JWT, Redis Caching, Microservices cơ bản.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    price: 950000,
    level: 'Intermediate',
    status: 'Published',
    category: { category_id: 2, category_name: 'Backend' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 3,
    instructor_id: 2,
    category_id: 3,
    title: 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL',
    slug: 'database-design-mysql-optimization',
    description: 'Mô hình hóa ERD, chuẩn hóa 3NF, đánh chỉ mục Indexing B-Tree, tối ưu câu lệnh truy vấn phức tạp, Transaction ACID.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    price: 490000,
    level: 'Beginner',
    status: 'Published',
    category: { category_id: 3, category_name: 'Cơ sở dữ liệu' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 4,
    instructor_id: 2,
    category_id: 2,
    title: 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản',
    slug: 'python-data-science-ai-machine-learning',
    description: 'Thành thạo NumPy, Pandas, Matplotlib, Seaborn và xây dựng mô hình dự đoán cơ bản với Scikit-Learn.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    price: 790000,
    level: 'Beginner',
    status: 'Published',
    category: { category_id: 2, category_name: 'Backend' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 5,
    instructor_id: 2,
    category_id: 4,
    title: 'DevOps Thực Chiến: Docker, Docker-Compose & CI/CD GitHub Actions',
    slug: 'devops-docker-cicd-github-actions',
    description: 'Container hóa ứng dụng Frontend/Backend, thiết lập quy trình tự động Build, Test và Deploy lên VPS Linux.',
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    price: 690000,
    level: 'Intermediate',
    status: 'Published',
    category: { category_id: 4, category_name: 'DevOps' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 6,
    instructor_id: 2,
    category_id: 5,
    title: 'Lập Trình Ứng Dụng Đa Nền Tảng Flutter & Dart Từ Số 0',
    slug: 'lap-trinh-mobile-flutter-dart',
    description: 'Xây dựng ứng dụng di động cho iOS & Android với Flutter Framework, State Management Bloc/Provider, tích hợp REST API.',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    price: 850000,
    level: 'Beginner',
    status: 'Published',
    category: { category_id: 5, category_name: 'Mobile' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 7,
    instructor_id: 2,
    category_id: 2,
    title: 'Lập Trình Hệ Thống Phân Tán Cao Cấp với Golang & gRPC',
    slug: 'golang-high-performance-microservices',
    description: 'Xây dựng Microservices hiệu năng cao, Goroutines & Channels, Kafka Message Queue, gRPC Protocol.',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    price: 990000,
    level: 'Advanced',
    status: 'Published',
    category: { category_id: 2, category_name: 'Backend' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
  {
    course_id: 8,
    instructor_id: 2,
    category_id: 1,
    title: 'Next.js 15 App Router Fullstack & Server Actions',
    slug: 'nextjs-15-app-router-fullstack',
    description: 'Chinh phục SSR/SSG chuẩn công nghiệp, React Server Components (RSC), tích hợp thanh toán, triển khai Vercel & AWS.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    price: 890000,
    level: 'Intermediate',
    status: 'Published',
    category: { category_id: 1, category_name: 'Frontend' },
    instructor: { user_id: 2, full_name: 'Vũ Quốc Huy' },
  },
];

function matchesCondition(item: any, condition: any): boolean {
  if (!condition || typeof condition !== 'object') return false;
  return Object.entries(condition).every(([k, v]) => {
    if (v === undefined) return true;
    if (v === null) return item[k] === null || item[k] === undefined;
    return String(item[k]) === String(v);
  });
}

export const INITIAL_MODULES = [
  { module_id: 1, course_id: 1, title: 'Chương 1: Tổng quan & Khởi tạo dự án React 19', order_index: 1 },
  { module_id: 2, course_id: 1, title: 'Chương 2: Thành thạo Component, Props & State Hooks', order_index: 2 },
  { module_id: 3, course_id: 1, title: 'Chương 3: State Management với Redux Toolkit & RTK Query', order_index: 3 },
  { module_id: 4, course_id: 1, title: 'Chương 4: Xây dựng dự án hoàn chỉnh & Tối ưu SEO Next.js', order_index: 4 },
  { module_id: 5, course_id: 2, title: 'Chương 1: Khởi động NestJS & Clean Architecture', order_index: 1 },
  { module_id: 6, course_id: 2, title: 'Chương 2: TypeORM, MySQL Migration & Relations', order_index: 2 },
  { module_id: 7, course_id: 2, title: 'Chương 3: Authentication & Authorization JWT RBAC', order_index: 3 },
  { module_id: 8, course_id: 3, title: 'Chương 1: Mô hình hóa ERD & Chuẩn hóa 3NF', order_index: 1 },
  { module_id: 9, course_id: 3, title: 'Chương 2: Kỹ thuật Indexing B-Tree & Query Plan', order_index: 2 },
];

export const INITIAL_LESSONS = [
  { lesson_id: 1, module_id: 1, title: '1.1 Giới thiệu lộ trình học và chuẩn bị công cụ', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration_seconds: 480, is_preview: true, order_index: 1 },
  { lesson_id: 2, module_id: 1, title: '1.2 Khởi tạo dự án Vite React với TypeScript', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration_seconds: 720, is_preview: false, order_index: 2 },
  { lesson_id: 3, module_id: 1, title: '1.3 Bài tập trắc nghiệm kiến thức khởi tạo', content_type: 'Quiz', content_url: '', duration_seconds: 300, is_preview: false, order_index: 3 },
  { lesson_id: 4, module_id: 2, title: '2.1 Vòng đời Component và UseEffect Hook', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration_seconds: 900, is_preview: false, order_index: 1 },
  { lesson_id: 5, module_id: 2, title: '2.2 Custom Hooks và Kỹ thuật Tối ưu Render', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration_seconds: 1100, is_preview: false, order_index: 2 },
  { lesson_id: 6, module_id: 2, title: '2.3 Thực hành code sandbox React trực tiếp', content_type: 'Article', content_url: '', duration_seconds: 600, is_preview: false, order_index: 3 },
  { lesson_id: 7, module_id: 5, title: '1.1 Giới thiệu kiến trúc NestJS Dependency Injection', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration_seconds: 650, is_preview: true, order_index: 1 },
  { lesson_id: 8, module_id: 5, title: '1.2 Cấu hình Modules, Controllers và Services', content_type: 'Video', content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', duration_seconds: 820, is_preview: false, order_index: 2 },
];

const INITIAL_ROLES = [
  { role_id: 1, role_name: 'Admin' },
  { role_id: 2, role_name: 'Instructor' },
  { role_id: 3, role_name: 'Student' },
];

const INITIAL_USERS = [
  {
    user_id: 1,
    full_name: 'Quản trị viên EduViet',
    email: 'admin@eduviet.vn',
    password_hash: '7d416cc472d0f256d92a5c8f1c7470019161d35020f65276e226e241188b7597',
    is_active: true,
    roles: [{ role_id: 1, role_name: 'Admin' }],
    created_at: new Date(),
  },
  {
    user_id: 2,
    full_name: 'Vũ Quốc Huy',
    email: 'giangvien@eduviet.vn',
    password_hash: '34356b03ebdbcff3e93eda08096d4a0f907e6b0919d1783df8530fdd8d594fe4',
    is_active: true,
    roles: [{ role_id: 2, role_name: 'Instructor' }],
    created_at: new Date(),
  },
  {
    user_id: 3,
    full_name: 'Nguyễn Văn Dev',
    email: 'dev.nguyen@gmail.com',
    password_hash: 'f0accdde0c5b36481cf143c72b22bb8fa7ad5a5cc93bfef380b2d6a59918be17',
    is_active: true,
    roles: [{ role_id: 3, role_name: 'Student' }],
    created_at: new Date(),
  },
];


function createMockRepository(initialData: any[], idField: string) {
  const store = [...initialData];
  return {
    find: async (options?: any) => {
      let items = [...store];
      if (options?.where) {
        items = items.filter((item) => matchesCondition(item, options.where));
      }
      return items;
    },
    findOne: async (options?: any) => {
      const where = options?.where ?? options;
      if (!where) return store[0] ?? null;
      return store.find((item) => matchesCondition(item, where)) ?? null;
    },
    findOneBy: async (where: any) => {
      if (!where) return null;
      return store.find((item) => matchesCondition(item, where)) ?? null;
    },
    
    createQueryBuilder: () => {
      let whereEmail = null;
      const builder = {
        addSelect: () => builder,
        leftJoinAndSelect: () => builder,
        where: (clause, params) => {
          if (params && params.email) whereEmail = params.email;
          return builder;
        },
        getOne: async () => {
          if (whereEmail) {
            return store.find((item) => item.email && item.email.toLowerCase() === whereEmail.toLowerCase()) || null;
          }
          return store[0] || null;
        },
      };
      return builder;
    },
    create: (data: any) => data,
    save: async (data: any) => {
      const id = data[idField] ?? (Math.max(0, ...store.map((s: any) => Number(s[idField]) || 0)) + 1);
      const saved = { ...data, [idField]: id };
      const existingIdx = store.findIndex((s) => s[idField] === id);
      if (existingIdx !== -1) {
        store[existingIdx] = saved;
      } else {
        store.push(saved);
      }
      return saved;
    },
    update: async (id: any, data: any) => {
      const idx = store.findIndex((item) => item[idField] === Number(id));
      if (idx !== -1) {
        store[idx] = { ...store[idx], ...data };
      }
      return { affected: idx !== -1 ? 1 : 0 };
    },
    delete: async (id: any) => {
      const idx = store.findIndex((item) => item[idField] === Number(id));
      if (idx !== -1) {
        store.splice(idx, 1);
        return { affected: 1 };
      }
      return { affected: 0 };
    },
  };
}

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const isDemoMode = process.env.DEMO_MODE === 'true';
      const dbHost = process.env.DB_HOST ?? 'localhost';
      const dbPort = Number(process.env.DB_PORT ?? 3306);
      const dbUser = process.env.DB_USERNAME ?? 'root';
      const dbPass = process.env.DB_PASSWORD ?? '';
      const dbName = process.env.DB_DATABASE ?? 'lms_db';

      const dataSource = new DataSource({
        type: 'mysql',
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPass,
        database: dbName,
        entities: [User, Role, Course, Category, CourseModule, Enrollment, Lesson],
        // R02: Tắt synchronize: true mặc định để bảo vệ schema CSDL và không drop cột users.created_at
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
      });

      try {
        const initialized = await dataSource.initialize();
        console.log(`✅ [Database] Kết nối MySQL thành công tới ${dbHost}:${dbPort}/${dbName}`);
        return initialized;
      } catch (err: any) {
        if (!isDemoMode) {
          console.error(
            `❌ [Database Fatal] Không kết nối được MySQL tại ${dbHost}:${dbPort}/${dbName}. ` +
              'Kiểm tra lms/.env hoặc đặt DEMO_MODE=true nếu chủ động muốn chạy dữ liệu mô phỏng.',
            err.message,
          );
          throw err;
        }

        console.warn(
          `⚠️ [Database Demo] Không kết nối MySQL tại ${dbHost}:${dbPort}/${dbName}. ` +
            'Backend đang dùng dữ liệu in-memory vì DEMO_MODE=true. API lúc này KHÔNG đọc dữ liệu MySQL.',
          err.message,
        );

        const courseRepo = createMockRepository(INITIAL_COURSES, 'course_id');
        const categoryRepo = createMockRepository(INITIAL_CATEGORIES, 'category_id');
        const userRepo = createMockRepository(INITIAL_USERS, 'user_id');
        const roleRepo = createMockRepository(INITIAL_ROLES, 'role_id');
        const moduleRepo = createMockRepository(INITIAL_MODULES, 'module_id');
        const lessonRepo = createMockRepository(INITIAL_LESSONS, 'lesson_id');
        const defaultRepo = createMockRepository([], 'id');

        return {
          isInitialized: true,
          getRepository: (entity: any) => {
            if (entity === Course || entity?.name === 'Course') return courseRepo;
            if (entity === Category || entity?.name === 'Category') return categoryRepo;
            if (entity === User || entity?.name === 'User') return userRepo;
            if (entity === Role || entity?.name === 'Role') return roleRepo;
            if (entity === CourseModule || entity?.name === 'CourseModule') return moduleRepo;
            if (entity === Lesson || entity?.name === 'Lesson') return lessonRepo;
            return defaultRepo;
          },
        } as unknown as DataSource;
      }
    },
  },
];
