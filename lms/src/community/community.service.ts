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
    if (post.user_id !== currentUserId && currentUserId !== 1) {
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

  async reportContent(dto: { target_type: string; target_id: number; reason: string }, reporterId: number) {
    return {
      success: true,
      report_id: Date.now(),
      target_type: dto.target_type,
      target_id: dto.target_id,
      reporter_id: reporterId,
      message: 'Cảm ơn bạn đã gửi báo cáo. Ban quản trị sẽ rà soát nội dung này trong vòng 24 giờ.',
    };
  }
}
