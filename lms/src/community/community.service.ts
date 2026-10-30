import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity.js';
import { CommunityReply } from './entities/community-reply.entity.js';
import { User } from '../user/user.entity.js';

export const INITIAL_COMMUNITY_POSTS: any[] = [
  {
    post_id: 1,
    user_id: 3,
    category: 'Hỏi đáp lập trình',
    title: 'Làm sao tối ưu hóa hiệu năng render trong React 19 khi hiển thị danh sách hơn 10.000 phần tử?',
    content: 'Chào các bạn, mình đang làm tính năng hiển thị bảng lịch sử giao dịch lớn. Khi danh sách vượt quá 10.000 dòng thì DOM bị giật lag nghiêm trọng khi cuộn trang. Có bạn nào từng xử lý trường hợp này chưa, mình nên dùng `react-window` hay giải pháp Virtual Scroll nào tối ưu nhất?',
    tags: ['React', 'Performance', 'VirtualScroll'],
    views_count: 342,
    likes_count: 28,
    is_solved: true,
    accepted_reply_id: 1,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-28T09:30:00Z'),
    replies: [
      {
        reply_id: 1,
        post_id: 1,
        user_id: 2,
        content: 'Chào em, khi render tập dữ liệu lớn (>10.000 dòng), em tuyệt đối không nên đưa toàn bộ DOM nodes vào cây DOM cùng lúc. Giải pháp tối ưu nhất trong hệ sinh thái React hiện nay là dùng thư viện `@tanstack/react-virtual` hoặc `react-window`. Kỹ thuật này chỉ render đúng số lượng hàng vừa vặn với chiều cao viewport hiển thị của người dùng (khoảng 20-30 hàng) và tái sử dụng các node khi cuộn (Windowing Technique), giữ tốc độ khung hình ổn định 60fps.',
        is_accepted: true,
        likes_count: 35,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: new Date('2026-10-28T10:15:00Z'),
      },
    ],
  },
  {
    post_id: 2,
    user_id: 2,
    category: 'Kinh nghiệm học',
    title: 'Bí quyết làm chủ Clean Architecture và Dependency Injection trong NestJS',
    content: 'Chào các học viên EduViet! Khi phát triển ứng dụng Backend quy mô doanh nghiệp, việc phân tách các tầng Controllers, Services và Repositories là cực kỳ quan trọng. Hãy luôn đảm bảo Controller chỉ phụ trách validate DTO và HTTP Routing; toàn bộ nghiệp vụ và giao dịch ACID phải nằm trong Service; và tầng Database chỉ tương tác qua TypeORM DataSource.',
    tags: ['NestJS', 'CleanArchitecture', 'BestPractices'],
    views_count: 520,
    likes_count: 64,
    is_solved: false,
    author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
    created_at: new Date('2026-10-29T14:00:00Z'),
    replies: [],
  },
  {
    post_id: 3,
    user_id: 3,
    category: 'Chia sẻ dự án',
    title: 'Khoe sản phẩm: Mình vừa hoàn thành dự án Portfolio chuẩn SEO sau 2 tuần học khóa React!',
    content: 'Sau khi hoàn thành khóa học React 19 tại EduViet và làm theo rubric dự án thực tế, mình đã build thành công portfolio cá nhân đạt 98 điểm Google Lighthouse. Mời mọi người ghé thăm và cho mình xin góp ý hoàn thiện nhé!',
    tags: ['Portfolio', 'React', 'Showcase'],
    views_count: 215,
    likes_count: 42,
    is_solved: false,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T08:00:00Z'),
    replies: [],
  },
  {
    post_id: 4,
    user_id: 3,
    category: 'Hỏi đáp lập trình',
    title: 'Gặp lỗi CORS policy: No Access-Control-Allow-Origin header khi gọi API NestJS từ Vite localhost',
    content: 'Chào thầy và các bạn, mình tạo client Vite ở port 5173 và NestJS backend ở port 3000. Khi gửi request đăng nhập bằng fetch() thì trình duyệt báo lỗi CORS đỏ lừ và không nhận cookie JWT. Mình đã thử thêm header Access-Control-Allow-Origin: * ở client nhưng không được. Ai biết cách cấu hình chuẩn phía NestJS giúp mình với!',
    tags: ['CORS', 'NestJS', 'Vite', 'Troubleshooting'],
    views_count: 480,
    likes_count: 38,
    is_solved: true,
    accepted_reply_id: 2,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-29T11:20:00Z'),
    replies: [
      {
        reply_id: 2,
        post_id: 4,
        user_id: 1,
        content: `Chào bạn! Lỗi CORS là cơ chế bảo mật của TRÌNH DUYỆT áp đặt lên máy chủ, bạn không thể tự giải quyết bằng cách thêm header ở phía frontend.

Trong NestJS (file main.ts), bạn chỉ cần cấu hình app.enableCors() trước khi listen:

\`\`\`typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
\`\`\`
Chú ý: Khi credentials: true (cho phép gửi cookie hoặc Authorization header), origin bắt buộc phải là domain cụ thể, không được dùng ký tự đại diện "*"!`,
        is_accepted: true,
        likes_count: 45,
        author: { user_id: 1, full_name: 'Quản Trị Viên EduViet' },
        created_at: new Date('2026-10-29T12:05:00Z'),
      },
    ],
  },
  {
    post_id: 5,
    user_id: 3,
    category: 'Kinh nghiệm học',
    title: 'Phương pháp học lập trình hiệu quả theo Pomodoro và kỹ thuật Feynman giúp mình ghi nhớ syntax cực lâu',
    content: 'Trước đây mình hay học dồn 5-6 tiếng liên tục và hôm sau quên sạch cú pháp TypeScript lẫn cách dùng Hook. Sau khi áp dụng kỹ thuật Feynman: Mỗi khi học xong 1 khái niệm (như React useEffect hay TypeORM Transaction), mình tự mở file ghi chú hoặc video quay lại giải thích như đang dạy một người chưa biết gì. Kết hợp chia phiên 25 phút tập trung - 5 phút nghỉ ngơi. Kết quả sau 1 tháng tiến bộ vượt bậc! Có bạn nào có phương pháp học hay chia sẻ thêm không?',
    tags: ['KinhNghiem', 'Feynman', 'Productivity', 'HocLapTrinh'],
    views_count: 670,
    likes_count: 89,
    is_solved: false,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T09:15:00Z'),
    replies: [
      {
        reply_id: 3,
        post_id: 5,
        user_id: 2,
        content: 'Rất hoan nghênh tinh thần học tập chủ động của em! Kỹ thuật Feynman thực sự là vũ khí tối thượng của lập trình viên giỏi. Thầy khuyên em kết hợp thêm phương pháp "Active Recall" (tự viết lại code từ màn hình trống mà không nhìn mẫu) và lưu các code snippets mẫu vào GitHub Gist để tra cứu lại bất cứ lúc nào.',
        is_accepted: false,
        likes_count: 24,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: new Date('2026-10-30T10:00:00Z'),
      },
    ],
  },
  {
    post_id: 6,
    user_id: 3,
    category: 'Chia sẻ dự án',
    title: 'Showcase: Dự án Clone Booking.com tích hợp tìm kiếm khóa học và thanh toán QR tự động',
    content: 'Mình xin phép chia sẻ sản phẩm đồ án vừa làm: Hệ thống học trực tuyến với giao diện Header tràn viền chuẩn Booking.com, thanh tìm kiếm viền vàng #ffb700, hỗ trợ ví tiền nội bộ, giỏ hàng real-time, sinh mã QR VietQR chuyển khoản tự động và chạy thử code Python/JS ngay trên trình duyệt. Mời anh em review và ném đá nhẹ tay ạ!',
    tags: ['Showcase', 'BookingUI', 'Fullstack', 'VietQR'],
    views_count: 920,
    likes_count: 115,
    is_solved: false,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T14:30:00Z'),
    replies: [
      {
        reply_id: 4,
        post_id: 6,
        user_id: 1,
        content: 'UI làm rất chỉn chu, màu sắc hài hòa và tốc độ phản hồi rất mượt mà! Phần mã QR chuyển khoản và phòng học video đồng bộ thời gian rất ấn tượng. Tiếp tục phát huy nhé!',
        is_accepted: false,
        likes_count: 18,
        author: { user_id: 1, full_name: 'Quản Trị Viên EduViet' },
        created_at: new Date('2026-10-30T15:10:00Z'),
      },
    ],
  },
  {
    post_id: 7,
    user_id: 3,
    category: 'Hỏi đáp lập trình',
    title: 'Nên lưu JWT Token trong Cookie httpOnly hay localStorage? Đâu là giải pháp bảo mật tối ưu?',
    content: 'Mình đang phân vân giữa 2 cách lưu Access Token: 1 là để trong localStorage thì gọi API từ fetch() rất tiện nhưng sợ dính XSS; 2 là lưu trong Cookie httpOnly thì chống được XSS nhưng phải đối mặt với nguy cơ CSRF và cấu hình SameSite phức tạp. Mô hình chuẩn trong các dự án thực tế của các công ty công nghệ hiện nay là gì ạ?',
    tags: ['Security', 'JWT', 'XSS', 'CSRF', 'Auth'],
    views_count: 810,
    likes_count: 94,
    is_solved: true,
    accepted_reply_id: 5,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T16:00:00Z'),
    replies: [
      {
        reply_id: 5,
        post_id: 7,
        user_id: 2,
        content: `Chào bạn! Best Practice chuẩn bảo mật ngành hiện nay được khuyến nghị như sau:

1. **Access Token (Thời hạn ngắn: 10 - 15 phút)**: Lưu trong bộ nhớ (In-memory JavaScript variable) của frontend client. Khi người dùng reload trang, client dùng Refresh Token để lấy lại Access Token.
2. **Refresh Token (Thời hạn dài: 7 - 30 ngày)**: Lưu trong Cookie với các cờ bắt buộc: \`httpOnly: true\`, \`secure: true\` (HTTPS), \`sameSite: "strict"\` hoặc \`"lax"\`, kèm đường dẫn cụ thể \`/auth/refresh\`.
3. **Cơ chế Refresh Token Rotation**: Mỗi lần đổi token mới, token cũ bị thu hồi ngay lập tức để phát hiện hành vi đánh cắp phiên làm việc.`,
        is_accepted: true,
        likes_count: 67,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: new Date('2026-10-30T16:45:00Z'),
      },
    ],
  },
  {
    post_id: 8,
    user_id: 3,
    category: 'Tìm bạn học cùng',
    title: 'Tìm đồng đội lập nhóm 3 người cùng cày nát khóa Fullstack NestJS + React trong tháng tới',
    content: 'Mình đang dành toàn thời gian (full-time) để ôn luyện làm đồ án Fullstack chuẩn bị ứng tuyển kỳ thực tập sắp tới. Cần tìm 2 bạn có cùng chí hướng, học vào khung giờ 20h - 22h tối các ngày từ T2 đến T6 qua Google Meet/Discord, cùng chia sẻ code và làm mini-project hàng tuần. Bạn nào quan tâm nhắn mình nhé!',
    tags: ['StudyGroup', 'Fullstack', 'Teamwork', 'Discord'],
    views_count: 430,
    likes_count: 52,
    is_solved: false,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T18:40:00Z'),
    replies: [
      {
        reply_id: 6,
        post_id: 8,
        user_id: 1,
        content: 'Chào bạn, EduViet có kênh Discord và phòng voice study hub riêng cho học viên. Bạn có thể liên hệ bộ phận hỗ trợ hoặc vào kênh #find-a-team để ghim bài viết này nhé!',
        is_accepted: false,
        likes_count: 14,
        author: { user_id: 1, full_name: 'Quản Trị Viên EduViet' },
        created_at: new Date('2026-10-30T19:00:00Z'),
      },
    ],
  },
  {
    post_id: 9,
    user_id: 3,
    category: 'Góp ý khóa học',
    title: 'Đề xuất bổ sung thêm bài học về Next.js 15 App Router và Server Actions vào khóa React chuyên sâu',
    content: 'Khóa học React 19 của thầy dạy rất chi tiết về Hook và Component. Em hy vọng ban chuyên môn EduViet có thể cân nhắc cập nhật thêm 1 module chuyên sâu về Next.js 15 App Router (Server Components, Server Actions, Middleware, Caching & Revalidation) để học viên tự tin ứng tuyển các công ty dùng full-stack Next.js ạ.',
    tags: ['NextJS', 'CourseFeedback', 'AppRouter', 'Curriculum'],
    views_count: 560,
    likes_count: 78,
    is_solved: true,
    accepted_reply_id: 7,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T20:10:00Z'),
    replies: [
      {
        reply_id: 7,
        post_id: 9,
        user_id: 2,
        content: 'Chào em! Rất cảm ơn ý kiến đóng góp kịp thời của em. Đội ngũ giảng viên EduViet đã quay xong 5 bài học mới về Next.js 15 App Router và Server Actions kết hợp Prisma/TypeORM, dự kiến sẽ đưa lên nền tảng vào tuần tới và hoàn toàn miễn phí cho tất cả học viên đã đăng ký khóa React!',
        is_accepted: true,
        likes_count: 56,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: new Date('2026-10-30T20:45:00Z'),
      },
    ],
  },
  {
    post_id: 10,
    user_id: 3,
    category: 'Kinh nghiệm học',
    title: 'Review hành trình từ sinh viên trái ngành đến Offer Junior Web Developer mức lương 15M/tháng',
    content: 'Mình tốt nghiệp chuyên ngành Quản trị Kinh doanh, xuất phát điểm không biết gì về lập trình. Sau 5 tháng kiên trì tự học kết hợp lộ trình tại EduViet: hoàn thành 3 đồ án thực chiến (E-commerce, Chatbot AI và Booking Platform), chăm chỉ đăng bài lên GitHub và luyện 100 câu hỏi phỏng vấn... tuần trước mình đã nhận được offer Junior Frontend Developer tại một công ty công nghệ tại Cầu Giấy. Muốn nhắn nhủ với anh em là đừng nản lòng, cứ kiên trì từng dòng code mỗi ngày rồi quả ngọt sẽ đến!',
    tags: ['Review', 'CareerChange', 'Inspiration', 'SuccessStory'],
    views_count: 1520,
    likes_count: 230,
    is_solved: false,
    author: { user_id: 3, full_name: 'Nguyễn Văn Dev' },
    created_at: new Date('2026-10-30T22:00:00Z'),
    replies: [
      {
        reply_id: 8,
        post_id: 10,
        user_id: 2,
        content: 'Chúc mừng em! Đây là minh chứng rõ ràng nhất cho thấy sự kỷ luật và thực hành liên tục luôn mang lại thành quả xứng đáng. Chúc em tiếp tục vững bước trên con đường sự nghiệp phía trước!',
        is_accepted: false,
        likes_count: 48,
        author: { user_id: 2, full_name: 'Vũ Quốc Huy (Giảng viên)' },
        created_at: new Date('2026-10-30T22:30:00Z'),
      },
    ],
  },
];

@Injectable()
export class CommunityService {
  constructor(
    @Inject('COMMUNITY_POST_REPOSITORY') private readonly postRepo: Repository<CommunityPost>,
    @Inject('COMMUNITY_REPLY_REPOSITORY') private readonly replyRepo: Repository<CommunityReply>,
    @Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>,
  ) {}

  async getPosts(query?: { category?: string; tag?: string; q?: string }) {
    let posts = INITIAL_COMMUNITY_POSTS;
    if (query?.category && query.category !== 'All') {
      posts = posts.filter((p) => p.category.toLowerCase() === query.category!.toLowerCase());
    }
    if (query?.tag) {
      posts = posts.filter((p) => (p.tags || []).some((t: string) => t.toLowerCase() === query.tag!.toLowerCase()));
    }
    if (query?.q) {
      const kw = query.q.toLowerCase().trim();
      posts = posts.filter((p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw));
    }
    return posts.map((p) => ({
      ...p,
      replies_count: p.replies ? p.replies.length : 0,
    }));
  }

  async getPost(id: number) {
    const post = INITIAL_COMMUNITY_POSTS.find((p) => Number(p.post_id) === Number(id));
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài thảo luận');
    }
    post.views_count = (post.views_count || 0) + 1;
    return post;
  }

  async createPost(
    userId: number,
    dto: { category: string; title: string; content: string; tags?: string[] },
  ) {
    if (!dto.title?.trim() || !dto.content?.trim()) {
      throw new BadRequestException('Tiêu đề và nội dung bài viết không được để trống');
    }

    const user = await this.userRepo.findOneBy({ user_id: userId });
    const newPost: any = {
      post_id: Date.now(),
      user_id: userId,
      category: dto.category || 'Hỏi đáp lập trình',
      title: dto.title.trim(),
      content: dto.content.trim(),
      tags: dto.tags || ['General'],
      views_count: 1,
      likes_count: 0,
      is_solved: false,
      author: { user_id: userId, full_name: user?.full_name || 'Học viên EduViet' },
      created_at: new Date(),
      replies: [],
    };

    INITIAL_COMMUNITY_POSTS.unshift(newPost);
    return newPost;
  }

  async createReply(postId: number, userId: number, content: string) {
    if (!content?.trim()) {
      throw new BadRequestException('Nội dung câu trả lời không được để trống');
    }

    const post = INITIAL_COMMUNITY_POSTS.find((p) => Number(p.post_id) === Number(postId));
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết để bình luận');
    }

    const user = await this.userRepo.findOneBy({ user_id: userId });
    const newReply: any = {
      reply_id: Date.now(),
      post_id: postId,
      user_id: userId,
      content: content.trim(),
      is_accepted: false,
      likes_count: 0,
      author: { user_id: userId, full_name: user?.full_name || 'Học viên EduViet' },
      created_at: new Date(),
    };

    if (!post.replies) post.replies = [];
    post.replies.push(newReply);
    return newReply;
  }

  async acceptReply(postId: number, replyId: number, currentUserId: number) {
    const post = INITIAL_COMMUNITY_POSTS.find((p) => Number(p.post_id) === Number(postId));
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài thảo luận');
    }

    // Chỉ tác giả bài viết hoặc Admin mới được duyệt câu trả lời
    let isAdmin = false;
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: currentUserId },
        relations: { roles: true },
      });
      isAdmin = !!user?.roles?.some((r: any) => r.role_name === 'Admin' || r === 'Admin');
    } catch {
      const user: any = await this.userRepo.findOneBy({ user_id: currentUserId });
      isAdmin = !!user?.roles?.some((r: any) => r.role_name === 'Admin' || r === 'Admin');
    }

    if (post.user_id !== currentUserId && !isAdmin) {
      throw new ForbiddenException('Chỉ chủ bài viết mới có quyền chọn câu trả lời được chấp nhận');
    }

    const reply = (post.replies || []).find((r: any) => Number(r.reply_id) === Number(replyId));
    if (!reply) {
      throw new NotFoundException('Không tìm thấy câu trả lời');
    }

    (post.replies || []).forEach((r: any) => (r.is_accepted = false));
    reply.is_accepted = true;
    post.is_solved = true;
    post.accepted_reply_id = replyId;

    return {
      success: true,
      post_id: postId,
      accepted_reply_id: replyId,
      message: 'Đã chọn câu trả lời hữu ích nhất thành công!',
    };
  }

  private getReportsFilePath() {
    const baseDir = process.cwd().endsWith('lms') ? process.cwd() : path.join(process.cwd(), 'lms');
    return path.join(baseDir, 'data', 'community_reports.json');
  }

  private loadReports(): any[] {
    try {
      const file = this.getReportsFilePath();
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
      }
    } catch {
      // fallback
    }
    return [];
  }

  private saveReport(report: any) {
    try {
      const file = this.getReportsFilePath();
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const list = this.loadReports();
      list.unshift(report);
      fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf8');
    } catch {
      // fallback
    }
  }

  async reportContent(dto: { target_type: string; target_id: number; reason: string }, reporterId: number) {
    const report = {
      report_id: Date.now(),
      target_type: dto.target_type,
      target_id: dto.target_id,
      reporter_id: reporterId,
      reason: dto.reason || 'Nội dung vi phạm tiêu chuẩn cộng đồng',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    this.saveReport(report);

    return {
      success: true,
      report_id: report.report_id,
      report,
      message: 'Cảm ơn bạn đã gửi báo cáo. Ban quản trị sẽ rà soát nội dung này trong vòng 24 giờ.',
    };
  }

  async getReports() {
    return this.loadReports();
  }
}
