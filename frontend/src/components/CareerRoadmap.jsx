import { useState } from 'react';
import { Row, Col, Card, Badge, Button, ProgressBar, Accordion } from 'react-bootstrap';

const ROADMAPS_DATA = [
  {
    id: 'frontend',
    title: 'Frontend Web Engineer (React 19 & Next.js)',
    subtitle: 'Từ Zero đến Senior Frontend: Làm chủ UI/UX, Component Architecture & Web Performance',
    badge: 'Phổ biến nhất',
    badgeVariant: 'primary',
    duration: '6 tháng (24 tuần)',
    estimatedSalary: '15.000.000 - 35.000.000 đ/tháng',
    totalLessons: '148 bài giảng',
    projectsCount: '5 đồ án thực tế',
    icon: 'bi-window-fullscreen',
    color: '#2563eb',
    stages: [
      {
        phase: 'Giai đoạn 1',
        title: 'Nền Tảng Web Hiện Đại (Tuần 1 - 4)',
        desc: 'Thành thạo bản chất cốt lõi của giao diện web responsive và tư duy lập trình căn bản.',
        skills: ['HTML5 Semantic', 'CSS3 Flexbox & Grid', 'Responsive Design', 'Git & GitHub Workflow'],
        project: 'Xây dựng Landing Page Clone Booking.com chuẩn Pixel-Perfect'
      },
      {
        phase: 'Giai đoạn 2',
        title: 'JavaScript ES6+ & TypeScript Chuyên Sâu (Tuần 5 - 10)',
        desc: 'Nắm vững bản chất JS Engine (Event Loop, Prototype, Closures, Async/Await) và Type Safety.',
        skills: ['ES6+ Modules', 'Asynchronous Programming', 'TypeScript Generics & Interfaces', 'DOM Manipulation'],
        project: 'Ứng dụng Web App quản lý công việc TodoKanban tương tác LocalStorage'
      },
      {
        phase: 'Giai đoạn 3',
        title: 'ReactJS 19 & State Management Ecosystem (Tuần 11 - 18)',
        desc: 'Kiến trúc Component hiện đại, Custom Hooks, Context API, Redux Toolkit & React Query.',
        skills: ['React 19 Hooks', 'Redux Toolkit / Zustand', 'TanStack React Query', 'Tailwind CSS & Bootstrap 5'],
        project: 'Hệ thống E-Commerce Storefront giỏ hàng thời gian thực & Checkout'
      },
      {
        phase: 'Giai đoạn 4',
        title: 'Next.js App Router, SSR & Production Deployment (Tuần 19 - 24)',
        desc: 'Server Side Rendering (SSR), Static Generation (SSG), SEO tối ưu hóa tốc độ tải trang 100 điểm Lighthouse.',
        skills: ['Next.js 15 App Router', 'Server Actions', 'Vercel Deployment', 'Performance Optimization'],
        project: 'Nền tảng Mạng Xã Hội Mini Fullstack kết nối REST API'
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend & Cloud Engineer (NestJS, Node.js & MySQL)',
    subtitle: 'Chinh phục kiến trúc dịch vụ doanh nghiệp, tối ưu hóa Database hàng triệu dòng dữ liệu',
    badge: 'Thu nhập cao',
    badgeVariant: 'success',
    duration: '7 tháng (28 tuần)',
    estimatedSalary: '18.000.000 - 45.000.000 đ/tháng',
    totalLessons: '162 bài giảng',
    projectsCount: '6 đồ án thực tế',
    icon: 'bi-server',
    color: '#10b981',
    stages: [
      {
        phase: 'Giai đoạn 1',
        title: 'Node.js Core & REST API Foundations (Tuần 1 - 5)',
        desc: 'Hiểu sâu Event-driven, Non-blocking I/O, Buffer, Stream, và thiết kế chuẩn chuẩn mực RESTful API.',
        skills: ['Node.js Runtime', 'Express.js', 'RESTful Standard', 'Middleware & Error Handling'],
        project: 'Hệ thống Auth API JWT (Access Token, Refresh Token, Rate Limiting)'
      },
      {
        phase: 'Giai đoạn 2',
        title: 'Cơ Sở Dữ Liệu MySQL Chuyên Sâu & ORM (Tuần 6 - 12)',
        desc: 'Mô hình hóa ERD, chuẩn hóa 3NF, phân trang Cursor, B-Tree Indexing và phòng chống SQL Injection.',
        skills: ['MySQL Query Optimization', 'TypeORM / Prisma', 'Transactions ACID', 'Database Migration'],
        project: 'CSDL Hệ thống đặt vé máy bay & phòng khách sạn với Transaction khóa dữ liệu'
      },
      {
        phase: 'Giai đoạn 3',
        title: 'NestJS Framework & Clean Architecture (Tuần 13 - 20)',
        desc: 'Xây dựng Backend theo chuẩn Clean Architecture, Dependency Injection (DI), Guard RBAC.',
        skills: ['NestJS Modules', 'DTO Validation', 'RBAC Permission', 'Unit Testing với Vitest/Jest'],
        project: 'Hệ thống Quản lý Đào tạo Trực Tuyến LMS hoàn chỉnh phân quyền 3 tầng'
      },
      {
        phase: 'Giai đoạn 4',
        title: 'Caching, Message Queue & Docker DevOps (Tuần 21 - 28)',
        desc: 'Tăng tốc độ chịu tải với Redis Caching, RabbitMQ Message Queue và Container hóa ứng dụng.',
        skills: ['Redis Caching', 'Docker & Docker Compose', 'CI/CD GitHub Actions', 'Microservices Basics'],
        project: 'Cổng thanh toán tự động xử lý hàng ngàn giao dịch/giây qua Webhook'
      }
    ]
  },
  {
    id: 'ai-data',
    title: 'Python for AI & Data Engineering',
    subtitle: 'Xây dựng pipeline xử lý dữ liệu và ứng dụng Generative AI / LLMs vào thực tế',
    badge: 'Xu hướng 2026',
    badgeVariant: 'warning',
    duration: '5 tháng (20 tuần)',
    estimatedSalary: '20.000.000 - 50.000.000 đ/tháng',
    totalLessons: '135 bài giảng',
    projectsCount: '4 đồ án AI',
    icon: 'bi-robot',
    color: '#f59e0b',
    stages: [
      {
        phase: 'Giai đoạn 1',
        title: 'Python Core & Thuật Toán Xử Lý Dữ Liệu (Tuần 1 - 4)',
        desc: 'Cú pháp Python chuẩn PEP8, OOP, Generator, List Comprehension và cấu trúc dữ liệu tối ưu.',
        skills: ['Python 3.12+', 'OOP in Python', 'Algorithms & Data Structures', 'Virtual Environment'],
        project: 'Bộ công cụ tự động cào dữ liệu Web Scraper đa luồng (Asyncio)'
      },
      {
        phase: 'Giai đoạn 2',
        title: 'Phân Tích Dữ Liệu Thực Tế với Pandas & NumPy (Tuần 5 - 10)',
        desc: 'Làm sạch dữ liệu bẩn, trực quan hóa biểu đồ kinh doanh và thống kê mô tả chuyên sâu.',
        skills: ['NumPy Matrix', 'Pandas Dataframe', 'Matplotlib & Seaborn', 'Data Cleaning'],
        project: 'Dashboard phân tích hành vi mua sắm khách hàng và doanh thu E-Commerce'
      },
      {
        phase: 'Giai đoạn 3',
        title: 'Machine Learning & Tích Hợp LLM / OpenAI API (Tuần 11 - 20)',
        desc: 'Xây dựng mô hình dự báo kinh doanh và tích hợp trợ lý AI thông minh qua RAG & LangChain.',
        skills: ['Scikit-Learn', 'OpenAI & Gemini API', 'LangChain Framework', 'Vector Database Chroma/Pinecone'],
        project: 'Trợ lý AI hỏi đáp tài liệu nội bộ doanh nghiệp thông minh (Chatbot RAG)'
      }
    ]
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Site Reliability Engineer (Docker, K8s & AWS)',
    subtitle: 'Tự động hóa CI/CD pipeline, vận hành cụm Kubernetes chịu tải lớn và bảo mật hạ tầng Cloud',
    badge: 'Khan hiếm nhân lực',
    badgeVariant: 'danger',
    duration: '6 tháng (24 tuần)',
    estimatedSalary: '22.000.000 - 55.000.000 đ/tháng',
    totalLessons: '140 bài giảng',
    projectsCount: '5 đồ án thực tế',
    icon: 'bi-cloud-check',
    color: '#ef4444',
    stages: [
      {
        phase: 'Giai đoạn 1',
        title: 'Linux Systems & Shell Scripting (Tuần 1 - 4)',
        desc: 'Quản trị hệ điều hành Ubuntu Server, bảo mật SSH, Networking, CronJob và tự động hóa Bash script.',
        skills: ['Linux Ubuntu/Debian', 'Bash Shell Script', 'Systemd Services', 'SSH & Firewall UFW'],
        project: 'Script tự động hóa sao lưu CSDL MySQL và xoay vòng log hệ thống lên S3'
      },
      {
        phase: 'Giai đoạn 2',
        title: 'Containerization & Docker Orchestration (Tuần 5 - 10)',
        desc: 'Đóng gói ứng dụng đa dịch vụ (Node, Python, MySQL, Nginx) tối ưu dung lượng Image nhiều tầng.',
        skills: ['Dockerfile Multi-stage', 'Docker Compose', 'Volume & Network Isolation', 'Container Security'],
        project: 'Môi trường phát triển và kiểm thử tự động Microservices khép kín'
      },
      {
        phase: 'Giai đoạn 3',
        title: 'CI/CD Pipelines & Infrastructure as Code (Tuần 11 - 18)',
        desc: 'Thiết lập quy trình tự động Build, Lint, Test, Quét lỗ hổng bảo mật và Auto Deploy qua GitHub Actions.',
        skills: ['GitHub Actions CI/CD', 'Terraform AWS/GCP', 'SonarQube Code Quality', 'Ansible Automation'],
        project: 'Hệ thống Zero-Downtime Deployment với Blue-Green / Canary Releases'
      },
      {
        phase: 'Giai đoạn 4',
        title: 'Kubernetes (K8s) Cluster & Monitoring (Tuần 19 - 24)',
        desc: 'Điều phối cụm Pods, Auto-scaling HPA, Ingress Controller Nginx và giám sát với Prometheus & Grafana.',
        skills: ['Kubernetes Pods & Deployments', 'Prometheus & Grafana', 'ELK Stack Logging', 'AWS EKS'],
        project: 'Cụm Production Kubernetes chịu tải 50.000 CCU giám sát cảnh báo Telegram'
      }
    ]
  }
];

export default function CareerRoadmap({ onSelectCourseTrack }) {
  const [selectedTrack, setSelectedTrack] = useState('frontend');
  const activeRoadmap = ROADMAPS_DATA.find((r) => r.id === selectedTrack) || ROADMAPS_DATA[0];

  return (
    <div className="app-container py-5 page-fade-in">
      {/* Tiêu đề mục lộ trình */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold mb-3">
          <i className="bi bi-compass-fill me-1"></i> BẢN ĐỒ SỰ NGHIỆP LẬP TRÌNH 2026
        </span>
        <h1 className="fw-bold display-6 mb-3">
          Lộ Trình Học Rõ Ràng Từ Con Số 0 Đến Đi Làm
        </h1>
        <p className="text-secondary fs-6 mb-0">
          Chương trình được thiết kế bám sát tiêu chuẩn phỏng vấn tại các doanh nghiệp hàng đầu. 
          Mỗi giai đoạn đều có đồ án thực chiến để đưa vào CV.
        </p>
      </div>

      {/* Tabs chọn lộ trình chuyên ngành */}
      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        {ROADMAPS_DATA.map((roadmap) => (
          <button
            key={roadmap.id}
            className={`btn px-4 py-3 rounded-4 d-flex align-items-center gap-2 fw-bold transition-all ${
              selectedTrack === roadmap.id
                ? 'btn-primary shadow-lg text-white'
                : 'btn-outline-secondary bg-white text-dark border'
            }`}
            style={{ minWidth: '240px' }}
            onClick={() => setSelectedTrack(roadmap.id)}
          >
            <i className={`bi ${roadmap.icon} fs-4`}></i>
            <div className="text-start">
              <div className="small opacity-75" style={{ fontSize: '0.75rem' }}>Lộ trình</div>
              <div>{roadmap.title.split('(')[0]}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Thông tin tổng quan lộ trình đang chọn */}
      <Card className="border-0 rounded-4 shadow-sm mb-5 overflow-hidden">
        <div className="p-4 p-md-5 bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
          <Row className="align-items-center">
            <Col lg={8}>
              <Badge bg={activeRoadmap.badgeVariant} className="px-3 py-2 mb-3">
                {activeRoadmap.badge}
              </Badge>
              <h2 className="fw-bold text-white mb-2">{activeRoadmap.title}</h2>
              <p className="text-light opacity-75 fs-6 mb-4">{activeRoadmap.subtitle}</p>

              <Row className="g-3">
                <Col xs={6} sm={3}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center border border-white border-opacity-10">
                    <span className="text-warning d-block small fw-bold">THỜI LƯỢNG</span>
                    <strong className="fs-6">{activeRoadmap.duration}</strong>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center border border-white border-opacity-10">
                    <span className="text-info d-block small fw-bold">BÀI HỌC</span>
                    <strong className="fs-6">{activeRoadmap.totalLessons}</strong>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center border border-white border-opacity-10">
                    <span className="text-success d-block small fw-bold">ĐỒ ÁN CV</span>
                    <strong className="fs-6">{activeRoadmap.projectsCount}</strong>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center border border-white border-opacity-10">
                    <span className="text-danger d-block small fw-bold">MỨC LƯƠNG KỲ VỌNG</span>
                    <strong className="small" style={{ fontSize: '0.85rem' }}>{activeRoadmap.estimatedSalary}</strong>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col lg={4} className="mt-4 mt-lg-0 text-center">
              <div className="p-4 bg-white rounded-4 text-dark shadow">
                <h5 className="fw-bold mb-2">Đăng Ký Toàn Bộ Lộ Trình</h5>
                <p className="small text-muted mb-3">Cam kết việc làm và hỗ trợ sửa CV cùng Mentor 1-1</p>
                <Button
                  variant="primary"
                  className="w-100 fw-bold py-2 mb-2"
                  onClick={() => onSelectCourseTrack?.(activeRoadmap.id)}
                >
                  <i className="bi bi-lightning-charge-fill me-1"></i> Bắt đầu học ngay
                </Button>
                <span className="small text-success fw-semibold">
                  <i className="bi bi-shield-check me-1"></i> Hoàn 100% học phí nếu không hài lòng
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Chi tiết từng Milestone / Giai đoạn (Timeline View) */}
      <div className="mb-4">
        <h3 className="fw-bold mb-4">
          <i className="bi bi-signpost-2-fill text-primary me-2"></i>
          Chi Tiết 4 Chặng Đường Phát Triển Kỹ Năng
        </h3>

        <div className="d-flex flex-column gap-4">
          {activeRoadmap.stages.map((stage, idx) => (
            <Card key={idx} className="border-0 rounded-4 shadow-sm hover-lift overflow-hidden">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={4} className="border-end-md pb-3 pb-md-0">
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1 rounded-pill mb-2">
                      {stage.phase}
                    </span>
                    <h5 className="fw-bold text-dark mb-2">{stage.title}</h5>
                    <p className="text-secondary small mb-0">{stage.desc}</p>
                  </Col>

                  <Col md={5} className="py-2 py-md-0">
                    <h6 className="small fw-bold text-uppercase text-muted mb-2">
                      <i className="bi bi-check-circle-fill text-success me-1"></i>Kỹ năng đạt được:
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {stage.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge bg-light text-dark border px-2 py-1 rounded-pill small">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Col>

                  <Col md={3} className="pt-3 pt-md-0 text-md-end">
                    <div className="p-3 bg-light rounded-3 text-start">
                      <span className="small text-danger fw-bold d-block mb-1">
                        <i className="bi bi-award-fill me-1"></i>Đồ án tốt nghiệp chặng:
                      </span>
                      <strong className="small text-dark">{stage.project}</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Câu hỏi thường gặp về lộ trình */}
      <div className="mt-5 p-4 bg-white rounded-4 border shadow-sm">
        <h4 className="fw-bold mb-4">
          <i className="bi bi-question-circle-fill text-primary me-2"></i>
          Giải Đáp Thắc Mắc Về Lộ Trình Lập Trình
        </h4>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0" className="border-bottom">
            <Accordion.Header>Người hoàn toàn chưa biết gì về code có học được lộ trình này không?</Accordion.Header>
            <Accordion.Body className="text-secondary small">
              Hoàn toàn được! Lộ trình được thiết kế theo phương pháp cuốn chiếu từ số 0, bắt đầu từ tư duy logic thuật toán căn bản và kiến thức cốt lõi nhất trước khi bước vào các Framework nâng cao.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="border-bottom">
            <Accordion.Header>Thời gian học mỗi ngày nên dành ra bao nhiêu tiếng?</Accordion.Header>
            <Accordion.Body className="text-secondary small">
              Bạn nên dành trung bình 2 đến 3 tiếng mỗi ngày (tương đương 15 - 20 giờ/tuần) để vừa xem video bài giảng, vừa thực hành gõ code trên hệ thống Code Arena để ghi nhớ sâu kiến thức.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Sau khi hoàn thành lộ trình có được hỗ trợ giới thiệu việc làm không?</Accordion.Header>
            <Accordion.Body className="text-secondary small">
              Học viên hoàn thành đủ các đồ án tốt nghiệp trong lộ trình sẽ được Mentor review CV, hướng dẫn phỏng vấn Mock Interview 1-1 và gửi CV trực tiếp đến mạng lưới hơn 50+ đối tác công nghệ của EduViet.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
