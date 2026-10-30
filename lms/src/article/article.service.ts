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
  {
    article_id: 6,
    title: 'Làm Chủ State Management Hiện Đại: So Sánh Toàn Diện Zustand, Redux Toolkit và TanStack Query',
    slug: 'so-sanh-zustand-redux-toolkit-tanstack-query',
    summary: 'Phân loại ranh giới giữa Server State và Client State. Tại sao Redux không còn là lựa chọn duy nhất và cách kết hợp Zustand + TanStack Query tối giản code 70%.',
    content: `## 1. Cuộc cách mạng tái định nghĩa State Management
Trong nhiều năm, Redux được coi là chuẩn mực bắt buộc cho ứng dụng React. Tuy nhiên, sự xuất hiện của **Server State** (dữ liệu từ API) và **Client State** (UI state như modal, dark mode) đã thay đổi hoàn toàn cách chúng ta tư duy.

### Bảng phân loại State:
- **Server State (TanStack Query / SWR)**: Dữ liệu bất đồng bộ, cần caching, revalidation, optimistic update, pagination.
- **Client State (Zustand / Jotai)**: Trạng thái thuần túy của giao diện người dùng, không cần gắn chặt vào HTTP lifecycle.

\`\`\`jsx
// Ví dụ tạo store giỏ hàng siêu nhẹ với Zustand
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
\`\`\`

## 2. Lời khuyên chọn công cụ cho dự án năm 2026
1. **Dự án vừa & lớn**: Kết hợp **TanStack Query** (quản lý 90% dữ liệu API) + **Zustand** (quản lý 10% UI global state).
2. **Hệ thống di sản hoặc cần time-travel debugging khắt khe**: Tiếp tục gắn bó với **Redux Toolkit**.`,
    category: 'Frontend',
    author_name: 'Vũ Quốc Huy (Lead Frontend)',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    read_time: '8 phút đọc',
    views_count: 2150,
    likes_count: 275,
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    related_course_id: 1,
    tags: JSON.stringify(['Zustand', 'React', 'State Management', 'TanStack Query']),
    is_published: true,
  },
  {
    article_id: 7,
    title: 'Nghệ Thuật Xây Dựng Design System & UI Component Với Tailwind CSS, Radix UI và Storybook',
    slug: 'xay-dung-design-system-tailwind-radix-storybook',
    summary: 'Cách thiết kế bộ component headless chuẩn WCAG accessible, quản lý design tokens đồng nhất và tự động kiểm thử visual regression trên Storybook.',
    content: `## 1. Khái niệm Headless UI Components
Tại sao các công ty lớn như Vercel, Shopify, Airbnb đều chuyển sang mô hình Headless Component (Radix UI, Headless UI, React Aria)?
- **Tách biệt logic tương tác và giao diện**: Logic xử lý bàn phím (Keyboard Navigation ARIA), focus trap, screen reader đã được kiểm thử nghiêm ngặt.
- **Tự do tùy biến CSS**: Bạn có toàn quyền áp dụng Tailwind CSS để tạo phong cách thương hiệu độc bản mà không bị gò bó bởi CSS dựng sẵn.

\`\`\`jsx
// Component Accordion dễ tiếp cận (Accessible) với Radix UI + Tailwind
import * as Accordion from '@radix-ui/react-accordion';

export function FAQItem({ question, answer, value }) {
  return (
    <Accordion.Item value={value} className="border-b border-gray-200 py-3">
      <Accordion.Trigger className="flex justify-between w-full font-semibold text-left text-gray-900 hover:text-blue-600">
        {question}
      </Accordion.Trigger>
      <Accordion.Content className="pt-2 text-gray-600 text-sm leading-relaxed">
        {answer}
      </Accordion.Content>
    </Accordion.Item>
  );
}
\`\`\`

## 2. Kiểm thử thị giác (Visual Testing) với Storybook
Storybook đóng vai trò là "catalog sống" của nhóm phát triển: Nhà thiết kế (UI/UX) và lập trình viên Frontend có thể xem xét trạng thái hover, disabled, active, dark mode mà không cần khởi động toàn bộ ứng dụng.`,
    category: 'Frontend',
    author_name: 'Vũ Quốc Huy (Lead Frontend)',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    read_time: '11 phút đọc',
    views_count: 1780,
    likes_count: 195,
    thumbnail_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    related_course_id: 1,
    tags: JSON.stringify(['Design System', 'TailwindCSS', 'Radix UI', 'Storybook']),
    is_published: true,
  },
  {
    article_id: 8,
    title: 'Thiết Kế Cơ Sở Dữ Liệu Chịu Tải Cao: Indexing B-Tree, Phân Vùng Partitioning và Caching với Redis',
    slug: 'thiet-ke-database-chiu-tai-cao-mysql-redis',
    summary: 'Giải quyết bài toán nghẽn I/O khi hệ thống chạm mốc triệu records: Tối ưu slow query với EXPLAIN, Composite Indexing, phân tách Read/Write replica và Cache-Aside Pattern.',
    content: `## 1. Giải phẫu B-Tree Index và Leftmost Prefix Rule
Khi bảng dữ liệu tăng lên hơn 1.000.000 dòng, truy vấn \`SELECT * FROM orders WHERE user_id = ? AND status = ?\` sẽ rơi vào tình trạng **Full Table Scan** nếu không có Index phù hợp.

### Nguyên tắc vàng khi đánh Composite Index:
1. Đặt cột có độ đặc trưng (Cardinality) cao nhất hoặc cột dùng toán tử so bằng (\`=\`) lên đầu tiên.
2. Cột dùng phép so sánh dải (\`>\`, \`<\`, \`BETWEEN\`, \`LIKE 'abc%'\`) phải đặt ở cuối cùng của Composite Index.
3. Luôn chạy \`EXPLAIN ANALYZE\` trước và sau khi thêm Index để đo lường số lượng rows examined.

\`\`\`sql
-- Tạo Composite Index tối ưu cho truy vấn lọc đơn hàng theo người dùng và trạng thái
CREATE INDEX idx_orders_user_status_created 
ON orders (user_id, status, created_at DESC);
\`\`\`

## 2. Chiến lược Cache-Aside kết hợp Redis
- **Đọc dữ liệu**: Kiểm tra cache Redis trước. Nếu có (Cache Hit), trả về ngay trong 1-2ms. Nếu không có (Cache Miss), truy vấn MySQL, lưu vào Redis kèm thời gian hết hạn (TTL 300s) rồi trả về cho client.
- **Ghi dữ liệu**: Cập nhật MySQL trong Transaction ACID, sau đó chủ động xóa hoặc cập nhật key tương ứng trong Redis (Cache Invalidation).`,
    category: 'Backend',
    author_name: 'Trần Minh Quân (Senior Backend)',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    read_time: '10 phút đọc',
    views_count: 2840,
    likes_count: 380,
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    related_course_id: 2,
    tags: JSON.stringify(['Database', 'MySQL', 'Redis', 'Performance']),
    is_published: true,
  },
  {
    article_id: 9,
    title: 'Microservices Thực Chiến: Giao Tiếp Bất Đồng Bộ Với Apache Kafka & RabbitMQ Trong Node.js',
    slug: 'microservices-thuc-chien-kafka-rabbitmq-nodejs',
    summary: 'Mô hình Event-Driven Architecture: Xử lý idempotent consumers, dead-letter queue (DLQ), phân tích trade-off giữa Message Queue (RabbitMQ) vs Event Streaming (Kafka).',
    content: `## 1. Khi nào nên chuyển từ Monolith sang Event-Driven Architecture?
Khi hệ thống có nhiều tác vụ chạy ngầm mất thời gian (gửi email hóa đơn, trừ điểm ví, đồng bộ dữ liệu sang hệ thống phân tích BI), việc gọi HTTP đồng bộ giữa các service sẽ tạo ra điểm nghẽn dây chuyền (Cascading Failure).

### So sánh nhanh RabbitMQ vs Kafka:
- **RabbitMQ**: Message Broker truyền thống, đẩy tin nhắn (Push model), hỗ trợ định tuyến linh hoạt (Direct, Topic, Fanout exchanges), rất thích hợp cho tác vụ nền, xử lý đơn hàng.
- **Apache Kafka**: Nền tảng Event Streaming phân tán, cơ chế Pull model, lưu trữ log sự kiện bất biến trên đĩa cứng, có khả năng tua lại (replay events) và xử lý hàng triệu sự kiện/giây.

\`\`\`typescript
// Ví dụ phát sự kiện đặt hàng thành công qua EventEmitter / Message Broker
async function processCheckout(order: Order) {
  // 1. Lưu đơn hàng vào DB chính
  await this.orderRepo.save(order);
  
  // 2. Phát sự kiện bất đồng bộ
  this.eventBus.emit('order.created', {
    orderId: order.order_id,
    userId: order.user_id,
    amount: order.final_amount,
    timestamp: new Date(),
  });
}
\`\`\`

## 2. Xử lý Trùng lặp (Idempotent Consumer)
Trong môi trường mạng phân tán, thông điệp có thể bị gửi lặp lại (At-least-once delivery). Mỗi consumer phải kiểm tra \`message_id\` hoặc \`transaction_id\` trước khi thực hiện hành động trừ tiền để ngăn chặn gian lận.`,
    category: 'Backend',
    author_name: 'Trần Minh Quân (Senior Backend)',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    read_time: '12 phút đọc',
    views_count: 1920,
    likes_count: 230,
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    related_course_id: 2,
    tags: JSON.stringify(['Microservices', 'Kafka', 'RabbitMQ', 'EventDriven']),
    is_published: true,
  },
  {
    article_id: 10,
    title: 'Triển Khai & Giám Sát Production Với Kubernetes, Prometheus, Grafana và Cloudflare Zero Trust',
    slug: 'trien-khai-giam-sat-kubernetes-prometheus-grafana',
    summary: 'Xây dựng hạ tầng Cloud-Native kiên cố: Tự động scale Pods theo metric CPU/RAM, thu thập log với Loki, vẽ dashboard cảnh báo tức thời lên Telegram/Slack.',
    content: `## 1. Trụ cột quan sát hệ thống (Observability): Metrics, Logs & Traces
Đưa ứng dụng lên production mới chỉ là 50% chặng đường. 50% còn lại là năng lực phát hiện sự cố trước khi người dùng kịp phàn nàn.

### 3 công cụ nòng cốt:
1. **Prometheus**: Định kỳ kéo (scrape) các thông số CPU, RAM, HTTP Response Time, Error Rate từ endpoint \`/metrics\` của NestJS.
2. **Grafana**: Vẽ biểu đồ trực quan hóa Real-time, thiết lập ngưỡng báo động (ví dụ: HTTP 500 > 1% trong 2 phút -> gửi tin nhắn khẩn cấp qua Telegram Bot).
3. **Loki & Promtail**: Hệ thống lưu trữ và tìm kiếm log tập trung tương tự Elasticsearch nhưng nhẹ hơn 5 lần.

\`\`\`yaml
# Kubernetes Horizontal Pod Autoscaler (HPA)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: lms-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: lms-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

## 2. Bảo vệ cổng truy cập với Cloudflare Tunnel
Loại bỏ nguy cơ bị dò cổng mạng bằng cách đóng toàn bộ port công khai trên server và chỉ cho phép lưu lượng truy cập mã hóa đi qua Cloudflare Zero Trust Tunnel.`,
    category: 'DevOps',
    author_name: 'Phạm Đức Anh (DevOps Specialist)',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    read_time: '9 phút đọc',
    views_count: 1490,
    likes_count: 180,
    thumbnail_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    related_course_id: 5,
    tags: JSON.stringify(['Kubernetes', 'Prometheus', 'Grafana', 'DevOps']),
    is_published: true,
  },
  {
    article_id: 11,
    title: 'Fine-Tuning LLM Mã Nguồn Mở (Llama 3, Mistral) Với LoRA & Unsloth Cho Tác Vụ Lập Trình',
    slug: 'fine-tuning-llm-llama-3-unsloth-lora',
    summary: 'Tối ưu hóa mô hình ngôn ngữ lớn trên GPU cá nhân (VRAM 8GB-16GB): Chuẩn bị dataset dạng Instruction-Input-Output, kỹ thuật QLoRA 4-bit và benchmark độ chính xác.',
    content: `## 1. Tại sao cần Fine-Tuning thay vì Prompt Engineering thuần túy?
Khi doanh nghiệp có thư viện nội bộ hoặc quy chuẩn viết code nghiêm ngặt (như Clean Architecture NestJS của EduViet), prompt thông thường thường tốn quá nhiều tokens ngữ cảnh và phản hồi thiếu nhất quán.

### Ưu điểm vượt trội của Unsloth:
- **Tốc độ huấn luyện**: Nhanh gấp 2 - 5 lần so với HuggingFace PEFT tiêu chuẩn nhờ tối ưu hóa kernel Triton thủ công.
- **Tiết kiệm VRAM**: Giảm mức tiêu thụ bộ nhớ đồ họa hơn 70%, cho phép huấn luyện mô hình Llama 3 8B ngay trên card RTX 3060 / 4060 12GB.

\`\`\`python
# Cấu hình LoRA Adapter với thư viện Unsloth
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-bnb-4bit",
    max_seq_length=2048,
    load_in_4bit=True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
)
\`\`\`

## 2. Xuất bản và tích hợp vào VS Code / Cursor
Sau khi hoàn tất quá trình huấn luyện, xuất checkpoint sang định dạng GGUF để chạy offline siêu tốc trên máy trạm thông qua Ollama hoặc llama.cpp.`,
    category: 'AI',
    author_name: 'Lâm Gia Bách (Principal Engineer)',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    read_time: '13 phút đọc',
    views_count: 2450,
    likes_count: 340,
    thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    related_course_id: 4,
    tags: JSON.stringify(['AI', 'LLM', 'FineTuning', 'Llama3', 'Unsloth']),
    is_published: true,
  },
  {
    article_id: 12,
    title: 'Lộ Trình Trở Thành Software Architect Từ Con Số 0: Kỹ Năng Kỹ Thuật, Tư Duy Hệ Thống & Leadership',
    slug: 'lo-trinh-tro-thanh-software-architect-tu-con-so-0',
    summary: 'Từ lập trình viên Senior lên Architect: Cách ra quyết định ADR (Architectural Decision Records), cân bằng CAP Theorem, xử lý technical debt và giao tiếp kỹ thuật với ban giám đốc.',
    content: `## 1. Chân dung của một Software Architect thực thụ
Architect không phải là người ngồi trong "tháp ngà" vẽ biểu đồ rồi biến mất. Architect là người **chịu trách nhiệm về các quyết định kỹ thuật có chi phí sửa đổi đắt nhất**.

### 4 trụ cột kỹ năng cốt lõi:
1. **System Design & Trade-offs**: Hiểu rằng không có giải pháp hoàn hảo, chỉ có sự đánh đổi phù hợp (Consistency vs Availability trong CAP Theorem).
2. **ADR (Architectural Decision Records)**: Ghi lại rõ ràng: Tại sao chọn NestJS thay vì Express? Tại sao chọn PostgreSQL thay vì MongoDB? Hậu quả và phương án thoái lui là gì?
3. **Quản lý Nợ kỹ thuật (Technical Debt)**: Thuyết phục Product Manager dành 20% dung lượng mỗi sprint để refactor và nâng cấp bảo mật hệ thống.
4. **Cố vấn & Đào tạo (Mentorship)**: Nâng cao năng lực kỹ thuật của toàn bộ team lập trình viên cấp dưới.

\`\`\`markdown
# Cấu trúc mẫu một bản Architectural Decision Record (ADR)
## Tiêu đề: ADR-004 Chuyển đổi xác thực sang Stateless JWT với Scrypt Hashing
- **Trạng thái**: Đã phê duyệt (Approved)
- **Ngữ cảnh**: Cần mở rộng quy mô hệ thống sang nhiều server instance mà không bị phụ thuộc vào Session bộ nhớ đơn lẻ.
- **Quyết định**: Áp dụng JWT kết hợp thuật toán mã hóa mật khẩu Scrypt với Salt 16 bytes.
- **Hệ quả tích cực**: API hoàn toàn stateless, dễ dàng auto-scaling.
- **Rủi ro**: Không thể thu hồi JWT trước hạn nếu không có blacklist Redis.
\`\`\`

## 2. Lời khuyên phát triển tư duy
Hãy bắt đầu phân tích mã nguồn của các dự án nguồn mở hàng đầu thế giới, quan sát cách các kỹ sư Google, Microsoft, Meta cấu trúc package và quản lý giao tiếp giữa các mô-đun.`,
    category: 'Career',
    author_name: 'Lê Hoàng Long (AI & Tech Lead)',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    read_time: '14 phút đọc',
    views_count: 3820,
    likes_count: 520,
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    related_course_id: 3,
    tags: JSON.stringify(['Software Architect', 'Career', 'System Design', 'Leadership']),
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

    if (category && category !== 'ALL' && category !== 'undefined') {
      list = list.filter((a) => a.category?.toUpperCase() === category.toUpperCase());
    }

    if (keyword && keyword.trim() && keyword !== 'undefined') {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          (a.tags && a.tags.toLowerCase().includes(q)),
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
