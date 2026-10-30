import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity.js';

export const INITIAL_ARTICLES: any[] = [
  {
    article_id: 1,
    title: 'Cẩm Nang Tối Ưu Hóa Hiệu Năng React 19: useTransition, Server Actions & React Compiler',
    slug: 'cam-nang-toi-uu-hoa-hieu-nang-react-19',
    summary: 'Phân tích cơ chế React 19 Server Components, loại bỏ useMemo/useCallback với React Compiler tự động, và các bài toán xử lý giao diện đa luồng không giật lag.',
    content: `## 1. Giới thiệu làn sóng đổi mới từ React 19
React 19 mang đến một cuộc cách mạng lớn trong hệ sinh thái Frontend hiện đại. Điểm nổi bật nhất không chỉ dừng lại ở cú pháp gọn hơn, mà là cách React Compiler tự động memoize các component và dependency.

### Các cải tiến trọng tâm:
- **React Compiler (Forget)**: Bạn không còn phải đắn đo khi nào dùng \`useMemo\` hay \`useCallback\`. Trình biên dịch tự động tối ưu hóa re-render ở mức chi tiết nhất.
- **Server Actions**: Tích hợp trực tiếp logic mutate dữ liệu từ form HTML thẳng lên server mà không cần cấu hình boilerplate fetch rườm rà.
- **Hook useOptimistic & useActionState**: Quản lý phản hồi tức thời cho người dùng (Optimistic UI) cực kỳ mượt mà.

\`\`\`jsx
// Ví dụ sử dụng useActionState trong React 19
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await updateProfile(formData);
  return result;
}, null);
\`\`\`

## 2. Chiến lược áp dụng vào dự án thực tế
Khi bắt đầu dự án mới, hãy ưu tiên cấu trúc theo Feature-based Directory, kết hợp cùng state management gọn nhẹ như Zustand hoặc trực tiếp React Server Actions nếu dùng Next.js 15.`,
    category: 'Frontend',
    author_name: 'Vũ Quốc Huy (Lead Frontend)',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    read_time: '7 phút đọc',
    views_count: 1420,
    likes_count: 185,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    related_course_id: 1,
    tags: JSON.stringify(['React 19', 'NextJS', 'Frontend', 'Optimization']),
    is_published: true,
  },
  {
    article_id: 2,
    title: 'Xây Dựng RESTful API Chuẩn Clean Architecture Với NestJS & TypeORM',
    slug: 'xay-dung-restful-api-chuan-clean-architecture-nestjs',
    summary: 'Hướng dẫn thiết kế kiến trúc phân tầng trong NestJS: Controller, Service, DTO, Entity, Repository Pattern và kỹ thuật xử lý Exception Filter toàn cục.',
    content: `## 1. Clean Architecture trong thế giới Node.js & NestJS
NestJS là framework Node.js số một dành cho hệ thống quy mô lớn nhờ tích hợp sẵn Dependency Injection (DI) và mô đun hóa mạnh mẽ.

### Các tầng kiến trúc chuẩn:
1. **Controller Layer**: Tiếp nhận HTTP request, áp dụng ValidationPipe trên DTO, điều phối gọi Service và trả về response chuẩn.
2. **Service Layer (Domain Logic)**: Nơi chứa toàn bộ nghiệp vụ cốt lõi, không phụ thuộc vào giao thức HTTP hay khung UI.
3. **Data Access Layer (TypeORM Repositories)**: Truy vấn dữ liệu, xử lý transaction và bảo toàn tính toàn vẹn ACID.

\`\`\`typescript
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async checkout(userId: number, items: OrderItemDto[]) {
    // Thực thi logic nghiệp vụ và trừ tiền nguyên tử
  }
}
\`\`\`

## 2. Kỹ thuật chống rò rỉ dữ liệu (DTO & Class Serializer)
Luôn luôn sử dụng \`@Exclude()\` và \`@Expose()\` để đảm bảo các trường nhạy cảm như hash mật khẩu, token ngân hàng không bao giờ bị trả về client.`,
    category: 'Backend',
    author_name: 'Trần Minh Quân (Senior Backend)',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    read_time: '9 phút đọc',
    views_count: 1980,
    likes_count: 240,
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    related_course_id: 2,
    tags: JSON.stringify(['NestJS', 'Clean Architecture', 'TypeORM', 'Backend']),
    is_published: true,
  },
  {
    article_id: 3,
    title: 'Trọn Bộ 50 Câu Hỏi Phỏng Vấn Lập Trình Viên Fullstack & Tips Đàm Phán Lương 2026',
    slug: '50-cau-hoi-phong-van-lap-trinh-vien-fullstack-2026',
    summary: 'Tổng hợp các câu hỏi kỹ thuật hóc búa về Event Loop, Concurrency, Database Indexing, System Design cùng phương pháp trả lời STAR gây ấn tượng với nhà tuyển dụng.',
    content: `## 1. Bí quyết vượt qua vòng phỏng vấn kỹ thuật (Live Coding & System Design)
Các nhà tuyển dụng công nghệ hiện nay không chỉ tìm kiếm người biết gõ code, họ tìm kiếm người **hiểu bản chất vấn đề và giải quyết bài toán kinh doanh**.

### Top 3 câu hỏi phỏng vấn thường gặp:
1. **Event Loop trong JavaScript**: Giải thích cơ chế microtask vs macrotask, thứ tự thực thi của \`Promise.then\`, \`setTimeout\`, \`process.nextTick\`.
2. **Tối ưu truy vấn MySQL**: Khi nào nên đánh Index B-Tree? Composite Index tuân theo quy tắc nào (Leftmost Prefix Rule)?
3. **CORS và Security**: Trình duyệt xử lý Preflight request (OPTIONS) ra sao? Phân biệt Authentication vs Authorization với JWT.

## 2. Phương pháp STAR khi trả lời tình huống
- **Situation (Bối cảnh)**: Dự án gặp sự cố nghẽn mạng khi có 10.000 user đồng thời.
- **Task (Nhiệm vụ)**: Giảm response time từ 2.5s xuống dưới 200ms trong 48h.
- **Action (Hành động)**: Áp dụng Redis Caching cho endpoint catalog, cấu hình Connection Pooling cho MySQL.
- **Result (Kết quả)**: Hệ thống chịu tải mượt mà, p99 latency giảm còn 120ms.`,
    category: 'Career',
    author_name: 'Lê Hoàng Long (AI & Tech Lead)',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    read_time: '12 phút đọc',
    views_count: 3250,
    likes_count: 410,
    thumbnail_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    related_course_id: 3,
    tags: JSON.stringify(['Interview', 'Career', 'System Design', 'Tips']),
    is_published: true,
  },
  {
    article_id: 4,
    title: 'Container Hóa Ứng Dụng Đa Dịch Vụ Với Docker, Compose & Tự Động Hóa CI/CD',
    slug: 'container-hoa-ung-dung-docker-compose-cicd',
    summary: 'Cách tạo Multi-stage Dockerfile tối ưu dung lượng image từ 1.2GB xuống dưới 90MB, thiết lập mạng nội bộ Compose và deploy tự động bằng GitHub Actions.',
    content: `## 1. Tại sao Multi-stage build là tiêu chuẩn bắt buộc?
Khi build ứng dụng Node.js hay Golang, bạn không cần giữ lại toàn bộ source code hay thư viện devDependencies trong image chạy production.

\`\`\`dockerfile
# Stage 1: Build source
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime siêu nhẹ
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
CMD ["node", "dist/main.js"]
\`\`\`

## 2. Tự động hóa kiểm thử với GitHub Actions
Mỗi khi có Pull Request vào nhánh \`main\`, workflow sẽ tự động chạy linter, unit test và build image đẩy lên Docker Hub.`,
    category: 'DevOps',
    author_name: 'Phạm Đức Anh (DevOps Specialist)',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    read_time: '8 phút đọc',
    views_count: 1650,
    likes_count: 215,
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
    related_course_id: 5,
    tags: JSON.stringify(['Docker', 'CI/CD', 'DevOps', 'GitHub Actions']),
    is_published: true,
  },
  {
    article_id: 5,
    title: 'Ứng Dụng RAG & LangChain Trong Việc Xây Dựng Chatbot Hỏi Đáp Tài Liệu Doanh Nghiệp',
    slug: 'ung-dung-rag-langchain-xay-dung-chatbot-ai',
    summary: 'Khám phá Retrieval-Augmented Generation (RAG): Kỹ thuật chunking văn bản, tạo vector embedding với text-embedding-3-small và tìm kiếm ngữ nghĩa với Milvus/Pinecone.',
    content: `## 1. Cơ chế hoạt động của Retrieval-Augmented Generation (RAG)
Mô hình ngôn ngữ lớn (LLM) thường bị ảo giác (hallucination) hoặc không nắm được dữ liệu nội bộ riêng tư. RAG giải quyết triệt để vấn đề này bằng cách:
1. **Document Loading & Chunking**: Chia nhỏ tài liệu PDF/Docx thành các đoạn 500-1000 tokens kèm overlap.
2. **Vector Embeddings**: Mã hóa ngữ nghĩa văn bản thành các vector nhiều chiều.
3. **Similarity Search**: Khi người dùng hỏi, trích xuất 3-5 đoạn tài liệu tương đồng nhất đưa vào Context của prompt.
4. **Answer Generation**: LLM tổng hợp câu trả lời dựa trên chính xác ngữ cảnh được cung cấp.`,
    category: 'AI',
    author_name: 'Lâm Gia Bách (Principal Engineer)',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    read_time: '10 phút đọc',
    views_count: 2200,
    likes_count: 310,
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    related_course_id: 4,
    tags: JSON.stringify(['AI', 'RAG', 'LangChain', 'Python']),
    is_published: true,
  },
];

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private readonly articleRepo: Repository<Article>,
  ) {}

  async findAll(category?: string, keyword?: string): Promise<Article[]> {
    let list: Article[] = [];
    try {
      if (this.articleRepo?.find) {
        list = await this.articleRepo.find({ order: { article_id: 'ASC' } });
      }
    } catch {
      // fallback in-memory
    }

    if (!list || list.length === 0) {
      list = [...INITIAL_ARTICLES];
    }

    if (category && category !== 'ALL') {
      list = list.filter((a) => a.category?.toUpperCase() === category.toUpperCase());
    }

    if (keyword && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.toLowerCase().includes(q),
      );
    }

    return list;
  }

  async findOne(idOrSlug: string | number): Promise<Article> {
    let article: Article | null = null;
    const isId = !isNaN(Number(idOrSlug));

    try {
      if (this.articleRepo?.findOne) {
        if (isId) {
          article = await this.articleRepo.findOne({ where: { article_id: Number(idOrSlug) } });
        } else {
          article = await this.articleRepo.findOne({ where: { slug: String(idOrSlug) } });
        }
      }
    } catch {
      // fallback
    }

    if (!article) {
      article = isId
        ? INITIAL_ARTICLES.find((a) => a.article_id === Number(idOrSlug))
        : INITIAL_ARTICLES.find((a) => a.slug === idOrSlug);
    }

    if (!article) {
      throw new NotFoundException(`Không tìm thấy bài viết với định danh: ${idOrSlug}`);
    }

    // Tăng lượt xem
    article.views_count = (article.views_count || 0) + 1;
    return article;
  }

  async likeArticle(id: number): Promise<{ likes_count: number; message: string }> {
    const article = await this.findOne(id);
    article.likes_count = (article.likes_count || 0) + 1;
    try {
      if (this.articleRepo?.save) {
        await this.articleRepo.save(article);
      }
    } catch {
      // in-memory
    }
    return {
      likes_count: article.likes_count,
      message: 'Đã thích bài viết thành công!',
    };
  }
}
