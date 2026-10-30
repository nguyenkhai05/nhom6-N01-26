import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { ProjectSubmission } from './entities/project-submission.entity.js';

export const INITIAL_PROJECTS: any[] = [
  {
    project_id: 1,
    title: 'Xây Dựng Portfolio Cá Nhân Chuẩn SEO & Responsive Đa Thiết Bị',
    slug: 'xay-dung-portfolio-ca-nhan-chuan-seo',
    category: 'Frontend',
    difficulty: 'Beginner',
    brief: 'Thiết kế và triển khai trang web Portfolio giới thiệu bản thân, trình bày các dự án đã làm, kỹ năng chuyên môn và form liên hệ tương tác bằng React 19 kết hợp Bootstrap 5.',
    requirements: '- Tối ưu hóa điểm số Google Lighthouse: Performance > 90, Accessibility > 95.\n- Hỗ trợ giao diện Responsive hoàn hảo từ Mobile (375px) tới Desktop (1920px).\n- Tích hợp chế độ Dark Mode mượt mà.\n- Form liên hệ có kiểm tra tính hợp lệ dữ liệu phía client.',
    milestones: [
      'Thiết lập cấu trúc dự án React 19 + Vite và cài đặt UI components',
      'Xây dựng các section: Hero, About Me, Skills, Projects Showcase',
      'Tích hợp form liên hệ và hiệu ứng chuyển động mượt mà',
      'Đóng gói, tối ưu bundle size và deploy lên Vercel / Netlify',
    ],
    rubric: [
      { criterion: 'Giao diện & Trải nghiệm (UI/UX)', weight_percent: 30, description: 'Bố cục cân đối, tương thích di động, phối màu hài hòa.' },
      { criterion: 'Chất lượng mã nguồn (Clean Code)', weight_percent: 40, description: 'Tách component rõ ràng, đặt tên biến chuẩn BEM/semantic, không có mã thừa.' },
      { criterion: 'Hiệu năng & Tối ưu SEO', weight_percent: 30, description: 'Tối ưu ảnh WebP, thẻ Meta Open Graph đầy đủ, Lighthouse > 90.' },
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    is_published: true,
  },
  {
    project_id: 2,
    title: 'Ứng Dụng Mini E-Commerce: Giỏ Hàng, Lọc Sản Phẩm & Thanh Toán',
    slug: 'ung-dung-mini-e-commerce-gio-hang-thanh-toan',
    category: 'Fullstack',
    difficulty: 'Intermediate',
    brief: 'Xây dựng website bán hàng trực tuyến thu nhỏ với đầy đủ tính năng tìm kiếm, lọc theo dải giá/danh mục, quản lý giỏ hàng lưu server, áp dụng mã voucher và mô phỏng đặt hàng.',
    requirements: '- Quản lý trạng thái giỏ hàng đồng bộ với API Backend.\n- Kiểm tra điều kiện áp dụng mã giảm giá voucher tại server.\n- Xử lý trạng thái Loading, Empty state và Error boundary chuyên nghiệp.',
    milestones: [
      'Thiết kế giao diện danh mục và thẻ sản phẩm có hiệu ứng hover',
      'Lập trình thanh tìm kiếm và bộ lọc đa tiêu chí linh hoạt',
      'Xây dựng trang giỏ hàng và modal thanh toán trực quan',
      'Kiểm thử luồng thêm giỏ hàng, áp dụng voucher và hoàn tất đơn hàng',
    ],
    rubric: [
      { criterion: 'Kiến trúc State Management', weight_percent: 35, description: 'Đồng bộ state giỏ hàng chính xác, không gây re-render thừa.' },
      { criterion: 'Tích hợp API & Xử lý bất đồng bộ', weight_percent: 35, description: 'Gọi API chuẩn RESTful, xử lý lỗi mạng và hiển thị thông báo thân thiện.' },
      { criterion: 'Kiểm thử & Khả năng vận hành', weight_percent: 30, description: 'Không có lỗi console runtime, thao tác mượt mà trên mọi thiết bị.' },
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    is_published: true,
  },
  {
    project_id: 3,
    title: 'Hệ Thống RESTful API Quản Lý Công Việc & Dự Án (Task Manager)',
    slug: 'he-thong-restful-api-quan-ly-cong-viec',
    category: 'Backend',
    difficulty: 'Intermediate',
    brief: 'Thiết kế và xây dựng hệ thống Backend phân tầng bằng NestJS v12 kết hợp TypeORM & MySQL, hỗ trợ xác thực JWT RBAC, quản lý Kanban board, giao việc và theo dõi deadline.',
    requirements: '- Đăng ký, đăng nhập với mã hóa mật khẩu an toàn và JWT authentication.\n- Phân quyền theo vai trò: Admin, Project Manager, Member.\n- Tài liệu hóa toàn bộ API thông qua hợp đồng OpenAPI 3.0 / Swagger.\n- Kiểm thử tự động với Vitest / Jest đạt độ bao phủ kiểm thử > 80%.',
    milestones: [
      'Mô hình hóa ERD và khởi tạo schema bảng CSDL với TypeORM',
      'Xây dựng module Auth với Guard kiểm tra vai trò người dùng',
      'Hiện thực hóa các CRUD endpoints cho Task, Board và Column',
      'Viết tài liệu OpenAPI và chạy bộ Unit Tests kiểm thử tự động',
    ],
    rubric: [
      { criterion: 'Kiến trúc phân tầng Clean Architecture', weight_percent: 40, description: 'Tách biệt Controller, Service, Repository, DTO validation chặt chẽ.' },
      { criterion: 'Bảo mật & Phân quyền', weight_percent: 30, description: 'JWT an toàn, kiểm soát quyền truy cập tài nguyên theo đúng vai trò.' },
      { criterion: 'Kiểm thử tự động & Tài liệu hóa', weight_percent: 30, description: 'OpenAPI đầy đủ schemas, test coverage > 80% pass 100%.' },
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    is_published: true,
  },
  {
    project_id: 4,
    title: 'Ứng Dụng Quản Lý Tài Chính & Sổ Cái Thu Chi Cá Nhân',
    slug: 'ung-dung-quan-ly-tai-chinh-so-cai-ca-nhan',
    category: 'Fullstack',
    difficulty: 'Advanced',
    brief: 'Xây dựng ứng dụng theo dõi ngân sách thu chi cá nhân với biểu đồ trực quan hóa dữ liệu, quản lý nhiều ví tài khoản và hệ thống cảnh báo vượt hạn mức chi tiêu.',
    requirements: '- Biểu đồ thu chi phân loại theo thời gian (ngày/tuần/tháng) bằng Chart.js.\n- Lưu trữ và mã hóa giao dịch tài chính đảm bảo tính toàn vẹn.\n- Xuất báo cáo sao kê định dạng PDF hoặc Excel.',
    milestones: [
      'Xây dựng giao diện Dashboard tổng quan tài chính với Chart.js',
      'Thiết kế module giao dịch thu chi và chuyển tiền giữa các ví',
      'Tích hợp thuật toán tính toán ngân sách và cảnh báo chi tiêu',
      'Triển khai tính năng xuất sao kê báo cáo và kiểm thử toàn diện',
    ],
    rubric: [
      { criterion: 'Trực quan hóa dữ liệu & Biểu đồ', weight_percent: 35, description: 'Biểu đồ phản hồi nhanh, số liệu tính toán chính xác tuyệt đối.' },
      { criterion: 'Tính toàn vẹn dữ liệu tài chính', weight_percent: 35, description: 'Số dư luôn khớp với tổng lịch sử thu chi qua sổ cái ledger.' },
      { criterion: 'Trải nghiệm người dùng chuyên nghiệp', weight_percent: 30, description: 'Thao tác nhập số tiền nhanh, định dạng tiền tệ VND chuẩn xác.' },
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    is_published: true,
  },
];

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY') private readonly projectRepo: Repository<Project>,
    @Inject('PROJECT_SUBMISSION_REPOSITORY') private readonly submissionRepo: Repository<ProjectSubmission>,
  ) {}

  async findAll() {
    let projects: any[] = [];
    if (typeof this.projectRepo.find === 'function') {
      try {
        projects = await this.projectRepo.find({ where: { is_published: true } });
      } catch {
        projects = INITIAL_PROJECTS;
      }
    }
    if (!projects || projects.length === 0) {
      projects = INITIAL_PROJECTS;
    }
    return projects;
  }

  async findOne(slugOrId: string | number) {
    const all = await this.findAll();
    const found = all.find(
      (p) => String(p.project_id) === String(slugOrId) || p.slug === String(slugOrId),
    );
    if (!found) {
      throw new NotFoundException('Không tìm thấy dự án thực tế');
    }
    return found;
  }

  async getMySubmission(projectId: number, userId: number) {
    const submission = await this.submissionRepo.findOne({
      where: { project_id: projectId, user_id: userId },
    });
    return submission || null;
  }

  async saveSubmission(
    projectId: number,
    userId: number,
    dto: {
      repo_url?: string;
      demo_url?: string;
      notes?: string;
      completed_milestones?: string[];
      is_submit?: boolean;
      is_public?: boolean;
    },
  ) {
    const project = await this.findOne(projectId);
    let submission = await this.submissionRepo.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    const status = dto.is_submit ? 'SUBMITTED' : (submission?.status || 'DRAFT');

    if (submission) {
      submission.repo_url = dto.repo_url ?? submission.repo_url;
      submission.demo_url = dto.demo_url ?? submission.demo_url;
      submission.notes = dto.notes ?? submission.notes;
      submission.completed_milestones = dto.completed_milestones ?? submission.completed_milestones;
      submission.status = status;
      if (dto.is_public !== undefined) submission.is_public = dto.is_public;
      return this.submissionRepo.save(submission);
    }

    submission = this.submissionRepo.create({
      project_id: projectId,
      user_id: userId,
      repo_url: dto.repo_url,
      demo_url: dto.demo_url,
      notes: dto.notes,
      completed_milestones: dto.completed_milestones || [],
      status,
      is_public: dto.is_public || false,
    });

    return this.submissionRepo.save(submission);
  }

  async getShowcase() {
    const all = await this.submissionRepo.find({
      where: { is_public: true, status: 'ACCEPTED' as any },
    });
    return all.map((sub: any) => ({
      submission_id: sub.submission_id,
      project_title: sub.project?.title || 'Dự án thực tế',
      student_name: sub.user?.full_name || 'Học viên ẩn danh',
      repo_url: sub.repo_url,
      demo_url: sub.demo_url,
      notes: sub.notes,
      grade_score: sub.grade_score,
      created_at: sub.created_at,
    }));
  }

  async gradeSubmission(
    submissionId: number,
    dto: { score: number; feedback: string; status: 'ACCEPTED' | 'CHANGES_REQUESTED' },
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: submissionId },
    });
    if (!submission) {
      throw new NotFoundException('Không tìm thấy bài nộp dự án');
    }

    submission.grade_score = dto.score;
    submission.feedback = dto.feedback;
    submission.status = dto.status;

    return this.submissionRepo.save(submission);
  }
}
