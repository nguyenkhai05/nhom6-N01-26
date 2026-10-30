import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const FAQ_TOPICS = [
  {
    topic_id: 'payment',
    topic_name: 'Đăng Ký & Thanh Toán Học Phí',
    icon: 'bi-credit-card-2-front-fill',
    items: [
      {
        question: 'Tôi có thể thanh toán khóa học bằng những phương thức nào?',
        answer: 'EduViet hỗ trợ thanh toán trực tiếp qua Số dư ví học tập nội bộ. Bạn có thể nạp tiền vào ví bằng mã QR Ngân hàng (Vietcombank, MB Bank, Techcombank...) hoặc qua cổng MoMo với giao dịch tức thời.',
      },
      {
        question: 'Chính sách hoàn học phí của EduViet được áp dụng như thế nào?',
        answer: 'Học viên được yêu cầu hoàn tiền 100% trong vòng 7 ngày kể từ khi thanh toán nếu tổng thời lượng học chưa vượt quá 20% và chưa hoàn thành bài thi cấp chứng chỉ.',
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
        answer: 'Hoàn toàn miễn phí 100% và không yêu cầu thẻ tín dụng. Bạn có thể làm quen với giao diện bài giảng, xem video đại diện và viết code trực tiếp trong Sandbox trước khi quyết định mua khóa.',
      },
      {
        question: 'Kết quả làm bài học thử có được lưu lại khi tôi đăng ký khóa không?',
        answer: 'Có. Khi bạn đăng nhập tài khoản sau khi hoàn thành bài học thử, hệ thống sẽ tự động đồng bộ kết quả vào tiến độ của khóa học chính.',
      },
    ],
  },
  {
    topic_id: 'tech_compiler',
    topic_name: 'Trình Soạn Thảo & Luyện Tập Code',
    icon: 'bi-code-square',
    items: [
      {
        question: 'Mã nguồn của tôi được thực thi như thế nào để đảm bảo an toàn?',
        answer: 'EduViet sử dụng cơ chế Web Worker Sandbox cách ly hoàn toàn với bộ nhớ trình duyệt, ngăn chặn truy cập cookie/token và tự động ngắt nếu có vòng lặp vô tận (infinite loop) sau 3000ms.',
      },
      {
        question: 'Tôi có thể làm bài tập trên điện thoại được không?',
        answer: 'Có. Giao diện được tối ưu với chế độ Tab View trên thiết bị di động, cho phép bạn chuyển đổi linh hoạt giữa màn hình xem Đề bài, Trình gõ code và Màn hình Console kiểm tra kết quả.',
      },
    ],
  },
];

@Injectable()
export class HelpService {
  private supportTickets: any[] = [];
  private dataFilePath: string;

  constructor() {
    const baseDir = process.cwd().endsWith('lms') ? process.cwd() : path.join(process.cwd(), 'lms');
    this.dataFilePath = path.join(baseDir, 'data', 'support_tickets.json');
    this.loadTickets();
  }

  private loadTickets() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf8');
        this.supportTickets = JSON.parse(raw);
      }
    } catch {
      this.supportTickets = [];
    }
  }

  private saveTickets() {
    try {
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.supportTickets, null, 2), 'utf8');
    } catch {
      // Giữ trong RAM nếu không ghi được đĩa
    }
  }

  getFaq() {
    return FAQ_TOPICS;
  }

  createSupportRequest(body: {
    fullName: string;
    email: string;
    courseId?: number;
    topic: string;
    message: string;
    userId?: number;
  }) {
    if (!body.email || !body.message) {
      throw new BadRequestException('Vui lòng cung cấp email và nội dung yêu cầu hỗ trợ');
    }

    const ticket = {
      ticket_id: 'TCK-' + Math.floor(100000 + Math.random() * 900000),
      fullName: body.fullName || 'Học viên EduViet',
      email: body.email.trim().toLowerCase(),
      courseId: body.courseId || null,
      topic: body.topic || 'Tư vấn trước khi mua khóa học',
      message: body.message.trim(),
      status: 'PENDING',
      created_at: new Date().toISOString(),
      user_id: body.userId || null,
    };

    this.supportTickets.unshift(ticket);
    this.saveTickets();

    return {
      success: true,
      ticket_id: ticket.ticket_id,
      ticket,
      message: 'Yêu cầu của bạn đã được tiếp nhận. Đội ngũ Chuyên viên & Giảng viên sẽ phản hồi qua email trong vòng 2-4 giờ làm việc.',
    };
  }

  getUserTickets(emailOrUserId?: string | number) {
    if (!emailOrUserId) return [];
    const query = String(emailOrUserId).toLowerCase().trim();
    return this.supportTickets.filter(
      (t) => (t.email && t.email.toLowerCase() === query) || (t.user_id && String(t.user_id) === query),
    );
  }

  getAllTickets() {
    return [...this.supportTickets];
  }
}
