import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Table, Badge } from 'react-bootstrap';
import Header from './Header';
import Her from './Her';
import Offers from './Offers';
import CourseList from './components/CourseList';
import CodeArena from './components/CodeArena';
import CareerRoadmap from './components/CareerRoadmap';
import BundlesPage from './components/BundlesPage';
import ProjectsHub from './components/ProjectsHub';
import PracticeHub from './components/PracticeHub';
import CommunityHub from './components/CommunityHub';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { apiMe, clearToken, getToken, saveExtras, toFrontendUser } from './services/auth';
import UserProfile from './components/UserProfile';
import DepositHistoryModal from './components/DepositHistoryModal';
import ConversionTriggers from './components/ConversionTriggers';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import ChatSupport from './components/ChatSupport';
import CourseLearningRoom from './components/CourseLearningRoom';
import Footer from './Footer';
import useCatalog from './hooks/useCatalog';
import { getCourse } from './services/api';
import PlanSection from './components/home/PlanSection';
import BrowseSections from './components/home/BrowseSections';
import DealsSection from './components/home/DealsSection';
import SavingsAndPopular from './components/home/SavingsAndPopular';
import './home-sections.css';

// Dữ liệu khóa học lập trình thực chiến EduViet
const INITIAL_COURSES = [
  {
    course_id: 1,
    title: 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js',
    slug: 'lap-trinh-web-frontend-reactjs',
    description: 'Nắm vững React 19, React Router v7, Redux Toolkit, Tailwind CSS, tối ưu SEO với Next.js và hoàn thiện 3 dự án thực tế.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    price: 890000,
    old_price: 1200000,
    category: { name: 'Frontend' },
    level: 'Beginner',
    instructor: { name: 'Vũ Quốc Huy (Lead Frontend)' },
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
    category: { name: 'Backend' },
    level: 'Intermediate',
    instructor: { name: 'Nguyễn Tuấn Kiệt (Senior Architect)' },
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
    category: { name: 'Cơ sở dữ liệu' },
    level: 'Beginner',
    instructor: { name: 'Trần Minh Quang (DBA Expert)' },
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
    category: { name: 'Backend' },
    level: 'Beginner',
    instructor: { name: 'Lê Hoàng Long (AI Engineer)' },
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
    category: { name: 'DevOps' },
    level: 'Intermediate',
    instructor: { name: 'Phạm Đức Anh (DevOps Specialist)' },
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
    category: { name: 'Mobile' },
    level: 'Beginner',
    instructor: { name: 'Đỗ Tuấn Thành (Mobile Tech Lead)' },
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
    category: { name: 'Backend' },
    level: 'Advanced',
    instructor: { name: 'Lâm Gia Bách (Principal Backend Engineer)' },
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
    category: { name: 'Frontend' },
    level: 'Intermediate',
    instructor: { name: 'Vũ Quốc Huy (Lead Frontend)' },
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
    category: { name: 'Backend' },
    level: 'Beginner',
    instructor: { name: 'Lê Hoàng Long (AI Engineer)' },
    duration: '30 giờ',
    studentsCount: 450,
    rating: '4.91',
  },
];

export default function App() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('eduviet_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  // Người dùng đăng nhập. Chỉ khôi phục bản lưu khi còn token; vai trò thật sẽ được
  // máy chủ xác nhận lại bằng GET /auth/me ngay bên dưới (không tin dữ liệu ở localStorage).
  const [currentUser, setCurrentUser] = useState(() => {
    if (!getToken()) return null;
    try {
      const saved = JSON.parse(localStorage.getItem('eduviet_user') || 'null');
      return saved && typeof saved === 'object' ? saved : null;
    } catch {
      return null;
    }
  });

  const [currentRoute, setCurrentRoute] = useState('home');
  const [searchFilter, setSearchFilter] = useState({ keyword: '', techCategory: 'ALL', level: 'ALL' });

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showDepositHistoryModal, setShowDepositHistoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailStatus, setCourseDetailStatus] = useState('idle');
  const [courseDetailError, setCourseDetailError] = useState('');
  const [showEnrollConfirmModal, setShowEnrollConfirmModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [showEnrollSuccessModal, setShowEnrollSuccessModal] = useState(false);
  const [enrolledCourseSuccess, setEnrolledCourseSuccess] = useState(null);
  const [activeLearningCourse, setActiveLearningCourse] = useState(null);

  // Deposit history state (Lịch sử nạp tiền)
  const [depositHistory, setDepositHistory] = useState(() => {
    const saved = localStorage.getItem('eduviet_deposit_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    return [
      {
        id: 'DEP-98214',
        amount: 1000000,
        date: '15/10/2026, 08:30:15',
        method: 'Thưởng Thành Viên Mới',
        note: 'Ưu đãi đăng ký tài khoản EduViet',
        status: 'Thành công',
      },
      {
        id: 'DEP-98350',
        amount: 500000,
        date: '15/10/2026, 14:12:00',
        method: 'QR Ngân hàng (Vietcombank)',
        note: 'Nạp quỹ học Frontend Master',
        status: 'Thành công',
      },
    ];
  });

  // Form states
  const [depositAmount, setDepositAmount] = useState('500000');
  const [depositMethod, setDepositMethod] = useState('BANK_QR'); // 'BANK_QR' | 'MOMO'
  const [depositStep, setDepositStep] = useState('select'); // 'select' | 'confirm' | 'success'
  const [lastDepositTx, setLastDepositTx] = useState(null);

  // Course manage state for Admin
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAdminCourseModal, setShowAdminCourseModal] = useState(false);
  const [adminCourseTitle, setAdminCourseTitle] = useState('');
  const [adminCoursePrice, setAdminCoursePrice] = useState(500000);
  const [adminCourseCategory, setAdminCourseCategory] = useState('Frontend');
  const [adminCourseDesc, setAdminCourseDesc] = useState('');

  // Cart & Checkout state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('eduviet_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [checkoutData, setCheckoutData] = useState(null);

  // Orders state (Lịch sử đơn hàng toàn hệ thống)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('eduviet_orders');
    return saved ? JSON.parse(saved) : [
      { id: 'ORD-8821', userEmail: 'dev.nguyen@gmail.com', userName: 'Nguyễn Văn Dev', items: [{ course_id: 1, title: 'Lập Trình Web Frontend Chuyên Sâu', price: 890000 }], amount: 890000, method: 'Ví EduViet', status: 'Completed', date: '15/10/2026 21:30' },
      { id: 'ORD-8822', userEmail: 'tran.backend@gmail.com', userName: 'Trần Thị Backend', items: [{ course_id: 2, title: 'Backend & RESTful API cùng NestJS', price: 950000 }], amount: 950000, method: 'QR Ngân hàng (Vietcombank)', status: 'Completed', date: '15/10/2026 22:15' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('eduviet_courses', JSON.stringify(courses));
  }, [courses]);

  // Dữ liệu khóa học + danh mục lấy từ backend (GET /courses, GET /categories).
  // Nếu backend chưa bật thì giữ dữ liệu lưu sẵn ở trên để trang vẫn hoạt động.
  const catalog = useCatalog();
  useEffect(() => {
    if (catalog.status === 'ready') setCourses(catalog.courses);
  }, [catalog.status, catalog.courses]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduviet_user', JSON.stringify(currentUser));
      saveExtras(currentUser); // ví, khóa học đã mua... lưu theo từng tài khoản
    } else {
      localStorage.removeItem('eduviet_user');
    }
  }, [currentUser]);

  // Mở trang: nếu có token thì hỏi máy chủ xem còn hiệu lực không (GET /auth/me).
  // 401 = token hết hạn hoặc sai → đăng xuất. Lỗi mạng thì giữ nguyên trạng thái.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCurrentUser(null);
      return undefined;
    }
    let cancelled = false;
    apiMe(token)
      .then((me) => {
        if (!cancelled) setCurrentUser(toFrontendUser(me));
      })
      .catch((err) => {
        if (!cancelled && err.status === 401) {
          clearToken();
          setCurrentUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('eduviet_deposit_history', JSON.stringify(depositHistory));
  }, [depositHistory]);

  useEffect(() => {
    localStorage.setItem('eduviet_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('eduviet_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle Search Filter
  const handleSearch = (filterData) => {
    setSearchFilter(filterData);
  };

  // Bấm thẻ chuyên ngành / trình độ ở các khối trang chủ → lọc rồi cuộn tới danh sách khóa học
  const handleBrowse = (partial) => {
    setSearchFilter({ keyword: '', techCategory: 'ALL', level: 'ALL', ...partial });
    setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const openCourseDetail = async (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
    setCourseDetailStatus('loading');
    setCourseDetailError('');

    try {
      const detail = await getCourse(course.course_id);
      setSelectedCourse(detail);
      setCourseDetailStatus('ready');
    } catch (error) {
      setCourseDetailStatus('error');
      setCourseDetailError(error?.message || 'Không tải được chi tiết khóa học.');
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesKeyword =
      !searchFilter.keyword ||
      course.title.toLowerCase().includes(searchFilter.keyword.toLowerCase()) ||
      (course.description ?? '').toLowerCase().includes(searchFilter.keyword.toLowerCase());

    const matchesCategory =
      searchFilter.techCategory === 'ALL' ||
      course.category?.name.toLowerCase().includes(searchFilter.techCategory.toLowerCase());

    const matchesLevel =
      searchFilter.level === 'ALL' ||
      course.level === searchFilter.level;

    return matchesKeyword && matchesCategory && matchesLevel;
  });

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentRoute('home');
  };

  // Gọi khi AuthModal đăng nhập / đăng ký thành công. isNew = tài khoản vừa tạo → ghi nhận quà tặng.
  const handleAuthSuccess = (user, { isNew = false } = {}) => {
    setCurrentUser(user);
    if (isNew) {
      const bonusTx = {
        id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
        amount: 1000000,
        date: new Date().toLocaleString('vi-VN'),
        method: 'Thưởng Thành Viên Mới',
        note: 'Ưu đãi đăng ký tài khoản thành viên EduViet',
        status: 'Thành công',
      };
      setDepositHistory((prev) => [bonusTx, ...prev]);
    }
  };

  // Nạp tiền vào ví
  const handleDeposit = (e) => {
    e?.preventDefault?.();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;

    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: (prev.walletBalance || 0) + amount,
    }));

    // Ghi nhận giao dịch vào lịch sử nạp tiền
    const newTx = {
      id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
      amount,
      date: new Date().toLocaleString('vi-VN'),
      method: depositMethod === 'BANK_QR' ? 'Vietcombank VietQR 24/7' : 'Ví MoMo Auto-Pay',
      note: 'Nạp ví học tập EduViet Platform',
      status: 'Thành công',
    };
    setDepositHistory((prev) => [newTx, ...prev]);
    setLastDepositTx(newTx);
    setDepositStep('success');
  };

  // Đăng ký khóa học (Security Matrix: Mở Modal Xác Nhận Chi Tiết)
  const handleEnrollCourse = (course) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (currentUser.enrolledCourses?.includes(course.course_id)) {
      alert('Bạn đã sở hữu khóa học này rồi!');
      return;
    }

    setCourseToEnroll(course);
    setShowEnrollConfirmModal(true);
  };

  const handleFinalConfirmEnroll = () => {
    if (!courseToEnroll || !currentUser) return;

    if (currentUser.walletBalance < courseToEnroll.price) {
      setShowEnrollConfirmModal(false);
      const confirmDeposit = window.confirm(
        `Số dư ví (${currentUser.walletBalance.toLocaleString('vi-VN')} đ) không đủ để thanh toán khóa học (${courseToEnroll.price.toLocaleString('vi-VN')} đ). Bạn có muốn nạp thêm tiền không?`
      );
      if (confirmDeposit) {
        setShowDepositModal(true);
      }
      return;
    }

    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - courseToEnroll.price,
      enrolledCourses: [...(prev.enrolledCourses || []), courseToEnroll.course_id],
    }));

    // Thêm vào đơn hàng
    const autoOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      items: [{ course_id: courseToEnroll.course_id, title: courseToEnroll.title, price: courseToEnroll.price }],
      amount: courseToEnroll.price,
      method: 'Ví EduViet',
      status: 'Completed',
      date: new Date().toLocaleString('vi-VN'),
      coupon: null
    };
    setOrders((prev) => [autoOrder, ...prev]);

    setShowEnrollConfirmModal(false);
    setEnrolledCourseSuccess(courseToEnroll);
    setShowEnrollSuccessModal(true);
    setCourseToEnroll(null);
  };

  // Giỏ hàng handlers
  const handleAddToCart = (course) => {
    if (currentUser?.enrolledCourses?.includes(course.course_id)) {
      alert('Bạn đã sở hữu khóa học này rồi!');
      return;
    }

    if (cart.some((c) => c.course_id === course.course_id)) {
      setCart((prev) => prev.filter((c) => c.course_id !== course.course_id));
    } else {
      setCart((prev) => [...prev, course]);
    }
  };

  const handleRemoveFromCart = (courseId) => {
    setCart((prev) => prev.filter((c) => c.course_id !== courseId));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      setCart([]);
    }
  };

  const handleProceedToCheckout = (data) => {
    setCheckoutData(data);
    setCurrentRoute('checkout');
  };

  // Hoàn tất đơn hàng từ trang Checkout
  const handleCompleteOrder = (order) => {
    setOrders((prev) => [order, ...prev]);

    // Trừ ví nếu thanh toán bằng ví
    if (order.method === 'Ví EduViet') {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, (prev.walletBalance || 0) - order.amount),
        enrolledCourses: [
          ...(prev.enrolledCourses || []),
          ...order.items.map((it) => it.course_id)
        ]
      }));
    } else {
      // Nếu thanh toán bằng QR / MoMo, trực tiếp mở khóa học
      setCurrentUser((prev) => ({
        ...prev,
        enrolledCourses: [
          ...(prev.enrolledCourses || []),
          ...order.items.map((it) => it.course_id)
        ]
      }));
    }

    // Xóa giỏ hàng sau khi mua thành công
    setCart([]);
  };

  // Admin Course Management
  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === editingCourse.course_id
            ? {
                ...c,
                title: adminCourseTitle,
                price: Number(adminCoursePrice),
                description: adminCourseDesc,
                category: { name: adminCourseCategory },
              }
            : c
        )
      );
    } else {
      const newCourse = {
        course_id: Date.now(),
        title: adminCourseTitle,
        slug: adminCourseTitle.toLowerCase().replace(/\s+/g, '-'),
        description: adminCourseDesc,
        price: Number(adminCoursePrice),
        category: { name: adminCourseCategory },
        instructor: { name: currentUser.fullName },
        duration: '40 giờ',
        studentsCount: 0,
        rating: '5.0',
        thumbnail_url: 'https://images.unsplash.com/photo-1516116211227-bbc13c6041e0?w=600&auto=format&fit=crop&q=80',
      };
      setCourses((prev) => [newCourse, ...prev]);
    }
    setShowAdminCourseModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {currentRoute !== 'learning-room' && (
      <Header
        currentUser={currentUser}
        cartCount={cart.length}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenDeposit={() => setShowDepositModal(true)}
        onOpenDepositHistory={() => setShowDepositHistoryModal(true)}
        onLogout={handleLogout}
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
      />
      )}

      {/* Guest Alert Banner (Hiển thị khi chưa đăng nhập) */}
      {!currentUser && currentRoute !== 'learning-room' && (
        <div className="app-container pt-3">
          <div className="alert alert-info border-0 rounded-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mb-0">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
              <div>
                <strong className="text-dark">Bạn đang duyệt web với tư cách Khách (Guest):</strong>
                <span className="text-secondary small d-block">
                  Bạn có thể xem toàn bộ giáo trình & học thử. Để <strong>Đăng ký khóa học hoặc Nạp ví</strong>, vui lòng đăng nhập tài khoản.
                </span>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="fw-bold text-nowrap px-3"
              onClick={() => setShowLoginModal(true)}
            >
              <i className="bi bi-google me-1 text-warning"></i> Đăng nhập ngay
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-grow-1">
        {currentRoute === 'home' && (
          <div className="page-fade-in">
            <Her onSearch={handleSearch} />
            {catalog.status === 'error' && (
              <div className="app-container pt-3">
                <div className="alert alert-warning mb-0" role="alert">
                  Không kết nối được máy chủ API. Đang hiển thị dữ liệu lưu sẵn — hãy bật backend (<code>npm run start:dev</code> trong thư mục <code>lms</code>) rồi tải lại trang.
                </div>
              </div>
            )}
            <Offers
              onClaimVoucher={() => {
                if (!currentUser) {
                  setShowRegisterModal(true);
                } else {
                  setShowDepositModal(true);
                }
              }}
            />

            {/* Bốn Thẻ Truy Cập Nhanh Theo Đặc Tả Mới */}
            <div className="app-container my-4">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <div
                    className="p-3 bg-white rounded-4 border shadow-sm h-100 cursor-pointer text-center hover-shadow transition"
                    onClick={() => setCurrentRoute('practice')}
                  >
                    <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-block mb-2">
                      <i className="bi bi-code-slash fs-3"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">Luyện Bài Theo Chủ Đề</h6>
                    <small className="text-muted d-block">JavaScript, React, SQL</small>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div
                    className="p-3 bg-white rounded-4 border shadow-sm h-100 cursor-pointer text-center hover-shadow transition"
                    onClick={() => setCurrentRoute('practice')}
                  >
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle d-inline-block mb-2">
                      <i className="bi bi-clipboard2-check fs-3"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">Kiểm Tra Năng Lực</h6>
                    <small className="text-muted d-block">Chấm server & Skill Radar</small>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div
                    className="p-3 bg-white rounded-4 border shadow-sm h-100 cursor-pointer text-center hover-shadow transition"
                    onClick={() => setCurrentRoute('projects')}
                  >
                    <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-circle d-inline-block mb-2">
                      <i className="bi bi-kanban fs-3"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">Làm Dự Án Thực Tế</h6>
                    <small className="text-muted d-block">Brief, Rubric & Showcase</small>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div
                    className="p-3 bg-white rounded-4 border shadow-sm h-100 cursor-pointer text-center hover-shadow transition"
                    onClick={() => setCurrentRoute('community')}
                  >
                    <div className="p-3 bg-info-subtle text-info-emphasis rounded-circle d-inline-block mb-2">
                      <i className="bi bi-chat-dots fs-3"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">Hỏi Đáp Cộng Đồng</h6>
                    <small className="text-muted d-block">Hỏi đáp & Kinh nghiệm</small>
                  </div>
                </div>
              </div>
            </div>
            <CourseList
              courses={filteredCourses}
              onViewDetail={openCourseDetail}
              onEnroll={handleEnrollCourse}
              enrolledCourseIds={currentUser?.enrolledCourses || []}
              onAddToCart={handleAddToCart}
              cartCourseIds={cart.map((c) => c.course_id)}
              onStartLearning={(course) => {
                setActiveLearningCourse(course);
                setCurrentRoute('learning-room');
              }}
            />
            <PlanSection courses={courses} categories={catalog.categories} onViewDetail={openCourseDetail} onBrowse={handleBrowse} />
            <BrowseSections courses={courses} categories={catalog.categories} onBrowse={handleBrowse} />
            <DealsSection courses={courses} onViewDetail={openCourseDetail} onSelectCombo={() => setCurrentRoute('courses')} />
            <SavingsAndPopular
              courses={courses}
              categories={catalog.categories}
              currentUser={currentUser}
              onOpenLogin={() => setShowLoginModal(true)}
              onOpenRegister={() => setShowRegisterModal(true)}
              onBrowse={handleBrowse}
              onViewDetail={openCourseDetail}
            />
            <div className="app-container">
              <ConversionTriggers
                onClaimBonus={() => {
                  if (!currentUser) {
                    setShowRegisterModal(true);
                  } else {
                    alert(`Bạn đang đăng nhập với tài khoản ${currentUser.fullName}. Số dư ví hiện có: ${Number(currentUser.walletBalance || 0).toLocaleString('vi-VN')} đ.`);
                  }
                }}
                onExploreRoadmap={() => setCurrentRoute('roadmap')}
              />
            </div>
          </div>
        )}

        {currentRoute === 'courses' && (
          <div className="app-container py-4 page-fade-in">
            <div className="mb-4">
              <h1 className="fw-bold fs-3">Tất Cả Khóa Học Lập Trình EduViet</h1>
              <p className="text-secondary">Trang bị tư duy thuật toán, cấu trúc dữ liệu và công nghệ đón đầu làn sóng AI.</p>
            </div>
            <CourseList
              courses={courses}
              onViewDetail={openCourseDetail}
              onEnroll={handleEnrollCourse}
              enrolledCourseIds={currentUser?.enrolledCourses || []}
              onAddToCart={handleAddToCart}
              cartCourseIds={cart.map((c) => c.course_id)}
              onStartLearning={(course) => {
                setActiveLearningCourse(course);
                setCurrentRoute('learning-room');
              }}
            />
          </div>
        )}

        {currentRoute === 'roadmap' && (
          <div className="app-container py-5 text-center">
            <Alert variant="info" className="p-4 rounded-4 shadow-sm mx-auto" style={{ maxWidth: 700 }}>
              <h4 className="fw-bold mb-2"><i className="bi bi-info-circle me-2"></i> Lộ Trình Đã Được Chuyển Sang Combo Ưu Đãi</h4>
              <p className="mb-3 text-secondary">Các lộ trình nghề nghiệp đã được đóng gói thành các gói Combo ưu đãi có giá tiết kiệm và phân bổ giá thông minh.</p>
              <Button variant="primary" className="fw-bold px-4 rounded-pill" onClick={() => setCurrentRoute('bundles')}>
                Khám Phá Các Gói Combo Ngay
              </Button>
            </Alert>
          </div>
        )}

        {/* Phòng Học Trực Tuyến Tương Tác (Vào Học Ngay Lập Tức) */}
        {currentRoute === 'learning-room' && activeLearningCourse && currentUser && (
          <CourseLearningRoom
            course={activeLearningCourse}
            currentUser={currentUser}
            onBack={() => setCurrentRoute('my-learning')}
            onNavigate={setCurrentRoute}
          />
        )}

        {/* 4 Chức năng chính mới theo đặc tả */}
        {currentRoute === 'practice' && (
          <PracticeHub currentUser={currentUser} />
        )}

        {currentRoute === 'projects' && (
          <ProjectsHub currentUser={currentUser} onNavigate={setCurrentRoute} />
        )}

        {currentRoute === 'community' && (
          <CommunityHub currentUser={currentUser} />
        )}

        {currentRoute === 'bundles' && (
          <BundlesPage currentUser={currentUser} onNavigate={setCurrentRoute} onCourseSelect={openCourseDetail} />
        )}

        {currentRoute === 'docs' && (
          <div className="app-container py-5">
            <h2 className="fw-bold mb-4">
              <i className="bi bi-journal-code text-danger me-2"></i>
              Tài Liệu Kỹ Thuật & Cheat Sheet
            </h2>
            <div className="row g-3">
              {['React 19 Cheat Sheet', 'NestJS Architecture Guide', 'MySQL Query Optimization Notes', 'Git & Docker Command Quickref'].map((doc, idx) => (
                <div className="col-md-6" key={idx}>
                  <div className="p-3 bg-white border rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-file-earmark-code text-primary fs-4 me-2"></i>
                      <strong>{doc}</strong>
                    </div>
                    <Button variant="outline-primary" size="sm" onClick={() => alert(`Tải xuống tài liệu: ${doc}`)}>
                      Tải PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentRoute === 'my-learning' && currentUser && (
          <div className="app-container py-5 page-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">
                  <i className="bi bi-mortarboard-fill text-primary me-2"></i>
                  Quản Lý Khóa Học Của Tôi
                </h2>
                <p className="text-secondary small mb-0">
                  Danh sách khóa học bạn đã sở hữu. Bấm <strong>"Vào Học Ngay"</strong> để truy cập bài giảng và code studio.
                </p>
              </div>
              <Badge bg="success" className="px-3 py-2 fs-6 rounded-pill fw-bold">
                {currentUser.enrolledCourses?.length || 0} Khóa đã kích hoạt
              </Badge>
            </div>

            {currentUser.enrolledCourses?.length > 0 ? (
              <CourseList
                courses={courses.filter((c) => currentUser.enrolledCourses.includes(c.course_id))}
                onViewDetail={openCourseDetail}
                enrolledCourseIds={currentUser.enrolledCourses}
                onStartLearning={(c) => {
                  setActiveLearningCourse(c);
                  setCurrentRoute('learning-room');
                }}
              />
            ) : (
              <div className="p-5 text-center bg-white rounded-4 border shadow-sm">
                <i className="bi bi-journal-x display-4 text-muted d-block mb-3"></i>
                <h5 className="fw-bold text-dark">Bạn chưa đăng ký khóa học lập trình nào</h5>
                <p className="text-secondary small">Hãy khám phá danh mục khóa học để bắt đầu lộ trình của bạn.</p>
                <Button variant="primary" className="fw-bold rounded-pill px-4 shadow-sm" onClick={() => setCurrentRoute('courses')}>
                  <i className="bi bi-search me-1"></i> Khám Phá Khóa Học Ngay
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Quản lý hồ sơ cá nhân (Học viên & Admin) */}
        {currentRoute === 'profile' && currentUser && (
          <UserProfile
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            enrolledCoursesData={courses.filter((c) =>
              currentUser.enrolledCourses?.includes(c.course_id)
            )}
            onOpenDeposit={() => setShowDepositModal(true)}
            depositHistory={depositHistory}
            initialTab="info"
            onStartLearning={(c) => {
              setActiveLearningCourse(c);
              setCurrentRoute('learning-room');
            }}
          />
        )}

        {/* Lịch sử nạp tiền trực tiếp từ route */}
        {currentRoute === 'deposit-history' && currentUser && (
          <UserProfile
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            enrolledCoursesData={courses.filter((c) =>
              currentUser.enrolledCourses?.includes(c.course_id)
            )}
            onOpenDeposit={() => setShowDepositModal(true)}
            depositHistory={depositHistory}
            initialTab="deposits"
            onStartLearning={(c) => {
              setActiveLearningCourse(c);
              setCurrentRoute('learning-room');
            }}
          />
        )}

        {/* Giỏ Hàng Khóa Học */}
        {currentRoute === 'cart' && (
          <CartPage
            cart={cart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onProceedToCheckout={handleProceedToCheckout}
            onNavigate={setCurrentRoute}
          />
        )}

        {/* Xác Nhận Thanh Toán */}
        {currentRoute === 'checkout' && (
          <CheckoutPage
            checkoutData={checkoutData}
            currentUser={currentUser}
            onCompleteOrder={handleCompleteOrder}
            onOpenDeposit={() => setShowDepositModal(true)}
            onOpenLogin={() => setShowLoginModal(true)}
            onNavigate={setCurrentRoute}
          />
        )}

        {/* Admin Dashboard: Quản trị CSDL khóa học, học viên, ví tiền, đơn hàng */}
        {currentRoute === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminDashboard
            courses={courses}
            orders={orders}
            onAddCourse={(newC) => setCourses((prev) => [newC, ...prev])}
            onUpdateCourse={(updC) =>
              setCourses((prev) =>
                prev.map((c) => (c.course_id === updC.course_id ? updC : c))
              )
            }
            onDeleteCourse={(cId) => {
              if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
                setCourses((prev) => prev.filter((c) => c.course_id !== cId));
              }
            }}
          />
        )}
      </main>

      {currentRoute !== 'learning-room' && <Footer onNavigate={setCurrentRoute} />}

      {/* Floating Chat Support (Bottom-Left) */}
      <ChatSupport />

      {/* Auth Modal Chuyên Nghiệp (Đăng nhập / Đăng ký 3-Role RBAC) */}
      <AuthModal
        show={showLoginModal || showRegisterModal}
        initialMode={showRegisterModal ? 'register' : 'login'}
        onHide={() => {
          setShowLoginModal(false);
          setShowRegisterModal(false);
        }}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Modal Nạp Tiền Vào Ví Chi Tiết (Quy trình 2 bước: Chọn số tiền & Bảng Xác nhận chi tiết) */}
      <Modal
        show={showDepositModal}
        onHide={() => {
          setShowDepositModal(false);
          setDepositStep('select');
        }}
        centered
        size={depositStep === 'confirm' ? 'lg' : 'md'}
      >
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-bold fs-5 text-primary d-flex align-items-center gap-2">
            <i className="bi bi-wallet2 text-success fs-4"></i>
            {depositStep === 'select' ? 'Nạp Tiền Vào Ví EduViet' : 'XÁC NHẬN GIAO DỊCH NẠP TIỀN'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {depositStep === 'select' ? (
            <div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3 border">
                <div>
                  <span className="text-secondary small d-block">Tài khoản học viên:</span>
                  <strong className="text-dark">{currentUser?.fullName || 'Học viên'} ({currentUser?.email})</strong>
                </div>
                <div className="text-end">
                  <span className="text-secondary small d-block">Số dư khả dụng:</span>
                  <strong className="text-success font-monospace fs-6">
                    {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-dark">1. Chọn mức nạp tiện lợi:</Form.Label>
                <div className="row g-2 mb-2">
                  {[200000, 500000, 1000000, 2000000].map((amt) => (
                    <div key={amt} className="col-6">
                      <Button
                        type="button"
                        variant={Number(depositAmount) === amt ? 'primary' : 'outline-light'}
                        className={`w-100 py-2 fw-bold text-center border ${Number(depositAmount) === amt ? 'shadow-sm' : 'text-dark'}`}
                        onClick={() => setDepositAmount(String(amt))}
                      >
                        {amt.toLocaleString('vi-VN')} đ
                      </Button>
                    </div>
                  ))}
                </div>
                <Form.Control
                  type="number"
                  placeholder="Hoặc nhập số tiền khác (VNĐ)..."
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="rounded-3"
                  min="50000"
                  step="50000"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-dark">2. Chọn cổng thanh toán nạp ví:</Form.Label>
                <div className="d-flex flex-column gap-2">
                  <label
                    className={`d-flex align-items-center justify-content-between p-3 border rounded-3 cursor-pointer ${depositMethod === 'BANK_QR' ? 'border-primary bg-primary-subtle' : 'bg-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDepositMethod('BANK_QR')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="depositMethod"
                        checked={depositMethod === 'BANK_QR'}
                        onChange={() => setDepositMethod('BANK_QR')}
                      />
                      <div>
                        <strong className="d-block small text-dark">Chuyển khoản QR Ngân hàng (Vietcombank 24/7)</strong>
                        <span className="text-muted small">Quét mã VietQR nhận tiền sau 15-30 giây</span>
                      </div>
                    </div>
                    <Badge bg="success">Khuyên dùng</Badge>
                  </label>

                  <label
                    className={`d-flex align-items-center justify-content-between p-3 border rounded-3 cursor-pointer ${depositMethod === 'MOMO' ? 'border-primary bg-primary-subtle' : 'bg-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDepositMethod('MOMO')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="depositMethod"
                        checked={depositMethod === 'MOMO'}
                        onChange={() => setDepositMethod('MOMO')}
                      />
                      <div>
                        <strong className="d-block small text-dark">Ví điện tử MoMo Auto-Pay</strong>
                        <span className="text-muted small">Thanh toán an toàn qua app MoMo</span>
                      </div>
                    </div>
                    <Badge bg="secondary">Tiện lợi</Badge>
                  </label>
                </div>
              </Form.Group>

              <Button
                variant="primary"
                className="w-100 fw-bold py-2 rounded-pill shadow-sm"
                onClick={() => {
                  if (!depositAmount || Number(depositAmount) < 50000) {
                    alert('Số tiền nạp tối thiểu là 50.000 đ');
                    return;
                  }
                  setDepositStep('confirm');
                }}
              >
                Tiếp Tục & Kiểm Tra Thông Tin <i className="bi bi-arrow-right ms-1"></i>
              </Button>
            </div>
          ) : depositStep === 'confirm' ? (
            /* Bước 2: Bảng Xác Nhận Chi Tiết Nạp Tiền */
            <div>
              <Alert variant="warning" className="d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
                <i className="bi bi-shield-check fs-5 text-warning"></i>
                <span>Vui lòng kiểm tra kỹ chi tiết trước khi hệ thống tạo hóa đơn và cộng tiền vào ví.</span>
              </Alert>

              <div className="p-3 bg-light rounded-3 border mb-3">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  Thông Tin Khách Hàng Nạp Tiền
                </h6>
                <div className="row g-2 small text-secondary">
                  <div className="col-sm-6">
                    Tên chủ tài khoản: <strong className="text-dark">{currentUser?.fullName}</strong>
                  </div>
                  <div className="col-sm-6">
                    Email định danh: <strong className="text-dark">{currentUser?.email}</strong>
                  </div>
                  <div className="col-sm-6">
                    Số dư hiện tại: <strong className="text-success font-monospace">{Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="col-sm-6">
                    Thời điểm yêu cầu: <strong className="text-dark">{new Date().toLocaleString('vi-VN')}</strong>
                  </div>
                </div>
              </div>

              <div className="table-responsive border rounded-3 mb-3">
                <table className="table table-sm align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2 ps-3">Hạng mục</th>
                      <th className="py-2 text-end pe-3">Chi tiết giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Số tiền nạp dự kiến:</td>
                      <td className="text-end pe-3 py-2 fw-bold fs-6 font-monospace text-dark">
                        {Number(depositAmount).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Phí giao dịch cổng thanh toán:</td>
                      <td className="text-end pe-3 py-2 text-success fw-bold">
                        0 đ (EduViet đài thọ 100%)
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Phương thức xử lý:</td>
                      <td className="text-end pe-3 py-2 fw-bold text-primary">
                        {depositMethod === 'BANK_QR' ? 'Vietcombank 24/7 (VietQR Chuẩn NAPAS)' : 'Ví Điện Tử MoMo Auto'}
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Mã tham chiếu hệ thống:</td>
                      <td className="text-end pe-3 py-2 font-monospace text-secondary">
                        DEP-{Math.floor(10000 + Math.random() * 90000)}
                      </td>
                    </tr>
                    <tr className="table-success-subtle">
                      <td className="ps-3 py-2 fw-bold text-dark">SỐ TIỀN VÀO VÍ SAU XÁC NHẬN:</td>
                      <td className="text-end pe-3 py-2 fw-bold fs-5 text-success font-monospace">
                        +{(Number(depositAmount)).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Số dư ví sau khi cộng:</td>
                      <td className="text-end pe-3 py-2 fw-bold text-primary font-monospace">
                        {(Number(currentUser?.walletBalance || 0) + Number(depositAmount)).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-light rounded-3 small text-muted border mb-3">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-clock-history text-primary me-1"></i> Quy Trình Tự Động:
                </div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Hệ thống tự động kích hoạt số dư vào ví ngay khi nhận lệnh.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Có thể dùng số dư thanh toán ngay mọi khóa học trên EduViet Platform.</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="w-50 rounded-pill fw-bold"
                  onClick={() => setDepositStep('select')}
                >
                  <i className="bi bi-arrow-left me-1"></i> Sửa Lại Mức Nạp
                </Button>
                <Button
                  variant="success"
                  className="w-50 rounded-pill fw-bold shadow-sm"
                  onClick={(e) => {
                    handleDeposit(e);
                  }}
                >
                  <i className="bi bi-check2-circle me-1"></i> Xác Nhận Nạp Ngay
                </Button>
              </div>
            </div>
          ) : (
            /* Bước 3: Bảng Chúc Mừng Nạp Tiền Thành Công Chi Tiết */
            <div className="deposit-success-panel text-center page-fade-in py-2">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle shadow-sm"
                style={{ width: 80, height: 80, fontSize: '2.5rem' }}
              >
                <i className="bi bi-check2-circle"></i>
              </div>

              <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-bold mb-2">
                <i className="bi bi-patch-check-fill me-1"></i> GIAO DỊCH NẠP VÍ THÀNH CÔNG
              </span>

              <h4 className="fw-bold text-dark mb-1">
                NẠP THÀNH CÔNG {Number(depositAmount).toLocaleString('vi-VN')} Đ
              </h4>
              <p className="text-secondary small mb-3">
                Số dư đã được cập nhật thành công vào ví học tập cá nhân của bạn trên EduViet Platform.
              </p>

              {/* Chi tiết biên lai nạp tiền */}
              <div className="p-3 bg-light rounded-4 border text-start mb-3">
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Mã Giao Dịch:</span>
                  <strong className="text-primary font-monospace fs-6">
                    {lastDepositTx?.id || 'DEP-88350'}
                  </strong>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Chủ Tài Khoản Ví:</span>
                  <strong className="text-dark small">
                    {currentUser?.fullName} ({currentUser?.email})
                  </strong>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Cổng Thanh Toán:</span>
                  <span className="badge bg-primary-subtle text-primary border">
                    {lastDepositTx?.method || 'Vietcombank VietQR 24/7'}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Thời Điểm Xử Lý:</span>
                  <span className="text-dark small font-monospace">
                    {lastDepositTx?.date || new Date().toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <span className="small text-muted">Phí Giao Dịch:</span>
                  <span className="badge bg-success-subtle text-success">0 đ (Miễn phí)</span>
                </div>

                <div className="d-flex justify-content-between align-items-baseline pt-2">
                  <span className="fw-bold text-dark">SỐ DƯ VÍ KHẢ DỤNG MỚI:</span>
                  <strong className="text-success fs-3 font-monospace">
                    {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              {/* Gợi ý hành động tiếp theo */}
              <div className="p-3 bg-white rounded-3 border text-start small text-secondary mb-3 shadow-xs">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-lightbulb-fill text-warning me-1"></i> Sử Dụng Số Dư Ngay:
                </div>
                <div>Số dư ví EduViet có thể dùng ngay để kích hoạt bất kỳ khóa học nào mà không mất phí trung gian.</div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  className="w-50 rounded-pill fw-bold"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositStep('select');
                    setShowDepositHistoryModal(true);
                  }}
                >
                  <i className="bi bi-clock-history me-1"></i> Xem Sổ Giao Dịch
                </Button>
                <Button
                  variant="success"
                  className="w-50 rounded-pill fw-bold shadow-sm"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositStep('select');
                  }}
                >
                  <i className="bi bi-bag-check me-1"></i> Khám Phá Khóa Học
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Chi Tiết Khóa Học */}
      <Modal show={showDetailModal} onHide={() => { setShowDetailModal(false); setCourseDetailStatus('idle'); }} size="lg" centered>
        {courseDetailStatus === 'loading' && (
          <Modal.Body className="py-5 text-center" role="status">
            <div className="spinner-border text-primary mb-3" aria-hidden="true" />
            <p className="mb-0">Đang tải chi tiết khóa học...</p>
          </Modal.Body>
        )}
        {courseDetailStatus === 'error' && (
          <Modal.Body>
            <Alert variant="danger" className="mb-0">
              <strong>Không tải được chi tiết khóa học.</strong>
              <div className="small mt-1">{courseDetailError}</div>
              <Button variant="outline-danger" size="sm" className="mt-3" onClick={() => selectedCourse && openCourseDetail(selectedCourse)}>
                Thử lại
              </Button>
            </Alert>
          </Modal.Body>
        )}
        {courseDetailStatus === 'ready' && selectedCourse && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold fs-5">
                {selectedCourse.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row g-3">
                <div className="col-md-5">
                  <img
                    src={selectedCourse.thumbnail_url}
                    alt={selectedCourse.title}
                    className="img-fluid rounded-3 w-100 shadow-sm"
                  />
                  <div className="mt-3 p-3 bg-light rounded-3 text-center">
                    <span className="text-muted small d-block">Học phí trọn gói</span>
                    <span className="fs-4 fw-bold text-primary">
                      {Number(selectedCourse.price).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
                <div className="col-md-7">
                  <Badge bg="primary" className="mb-2">
                    {selectedCourse.category?.name}
                  </Badge>
                  <h5>Giới thiệu khóa học</h5>
                  <p className="text-secondary">{selectedCourse.description}</p>
                  <hr />
                  <div className="small text-secondary mb-2">
                    <i className="bi bi-person-video3 text-primary me-2"></i>
                    Giảng viên: <strong>{selectedCourse.instructor?.name}</strong>
                  </div>
                  <div className="small text-secondary mb-2">
                    <i className="bi bi-clock text-primary me-2"></i>
                    Thời lượng: <strong>{selectedCourse.duration || '40 giờ'}</strong>
                  </div>
                  <div className="small text-secondary mb-3">
                    <i className="bi bi-mortarboard text-primary me-2"></i>
                    Cấp chứng chỉ hoàn thành khóa học từ EduViet Platform.
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="rounded-pill px-3" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>

              {currentUser?.enrolledCourses?.includes(selectedCourse.course_id) ? (
                <Button
                  variant="success"
                  className="fw-bold rounded-pill px-4 shadow-sm"
                  onClick={() => {
                    const toLearn = selectedCourse;
                    setShowDetailModal(false);
                    setActiveLearningCourse(toLearn);
                    setCurrentRoute('learning-room');
                  }}
                >
                  <i className="bi bi-play-circle-fill me-1"></i> Vào Phòng Học Ngay
                </Button>
              ) : (
                <>
                  <Button
                    variant={cart.some((c) => c.course_id === selectedCourse.course_id) ? "warning" : "outline-primary"}
                    className="fw-bold rounded-pill px-3"
                    onClick={() => {
                      handleAddToCart(selectedCourse);
                    }}
                  >
                    <i className={`bi ${cart.some((c) => c.course_id === selectedCourse.course_id) ? "bi-cart-check-fill" : "bi-cart-plus"} me-1`}></i>
                    {cart.some((c) => c.course_id === selectedCourse.course_id) ? "Đã trong giỏ" : "Thêm vào giỏ"}
                  </Button>
                  <Button
                    variant="primary"
                    className="fw-bold rounded-pill px-4 shadow-sm"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEnrollCourse(selectedCourse);
                    }}
                  >
                    <i className="bi bi-lightning-charge-fill me-1"></i> Đăng ký học ngay
                  </Button>
                </>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Modal Lịch Sử Nạp Tiền & Giao Dịch Ví */}
      <DepositHistoryModal
        show={showDepositHistoryModal}
        onHide={() => setShowDepositHistoryModal(false)}
        depositHistory={depositHistory}
        currentUser={currentUser}
        onOpenDeposit={() => setShowDepositModal(true)}
      />

      {/* Modal Bảng Xác Nhận Đăng Ký Khóa Học Chi Tiết */}
      <Modal
        show={showEnrollConfirmModal}
        onHide={() => setShowEnrollConfirmModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title className="fw-bold fs-5 text-primary d-flex align-items-center gap-2">
            <i className="bi bi-patch-check-fill text-success fs-4"></i>
            XÁC NHẬN CHI TIẾT ĐĂNG KÝ KHÓA HỌC
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {courseToEnroll && (
            <div>
              <Alert variant="info" className="d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <span>Vui lòng kiểm tra lại thông tin học viên, quyền lợi khóa học và số dư thanh toán trước khi xác nhận kích hoạt bài học.</span>
              </Alert>

              {/* Thông tin học viên */}
              <div className="p-3 bg-light rounded-3 border mb-3">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-person-badge-fill text-primary me-2"></i>
                  Thông Tin Học Viên Kích Hoạt
                </h6>
                <div className="row g-2 small text-secondary">
                  <div className="col-sm-6">
                    Họ và tên: <strong className="text-dark">{currentUser?.fullName}</strong>
                  </div>
                  <div className="col-sm-6">
                    Email tài khoản: <strong className="text-dark">{currentUser?.email}</strong>
                  </div>
                  <div className="col-sm-6">
                    Số dư ví hiện tại: <strong className="text-success font-monospace">{Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="col-sm-6">
                    Thời điểm đăng ký: <strong className="text-dark">{new Date().toLocaleString('vi-VN')}</strong>
                  </div>
                </div>
              </div>

              {/* Chi tiết khóa học được chọn */}
              <div className="p-3 border rounded-3 bg-white mb-3 shadow-xs">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={courseToEnroll.thumbnail_url}
                      alt={courseToEnroll.title}
                      className="img-fluid rounded-3 border w-100"
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-primary-subtle text-primary border">{courseToEnroll.category?.name}</span>
                      <span className="badge bg-secondary-subtle text-secondary border">Mã #{courseToEnroll.course_id}</span>
                      <span className="badge bg-success-subtle text-success border">Thời hạn trọn đời</span>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{courseToEnroll.title}</h6>
                    <div className="small text-muted">
                      Giảng viên: <strong className="text-dark">{courseToEnroll.instructor?.name || 'Chuyên gia EduViet'}</strong> • Thời lượng: <strong>{courseToEnroll.duration || '40 giờ'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng chi phí & Đối soát số dư */}
              <div className="table-responsive border rounded-3 mb-3">
                <table className="table table-sm align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2 ps-3">Hạng mục thanh toán</th>
                      <th className="py-2 text-end pe-3">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Học phí niêm yết:</td>
                      <td className="text-end pe-3 py-2 fw-bold font-monospace">
                        {Number(courseToEnroll.price).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Phương thức thanh toán:</td>
                      <td className="text-end pe-3 py-2 fw-bold text-primary">
                        Ví học tập EduViet (Trừ trực tiếp số dư)
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-3 py-2 text-muted">Số dư ví khả dụng hiện tại:</td>
                      <td className="text-end pe-3 py-2 font-monospace fw-bold text-dark">
                        {Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                    <tr className={Number(currentUser?.walletBalance || 0) >= courseToEnroll.price ? 'table-success-subtle' : 'table-danger-subtle'}>
                      <td className="ps-3 py-2 fw-bold text-dark">SỐ DƯ DỰ KIẾN CÒN LẠI:</td>
                      <td className="text-end pe-3 py-2 fw-bold fs-5 font-monospace text-success">
                        {Number(currentUser?.walletBalance || 0) >= courseToEnroll.price
                          ? `${(Number(currentUser?.walletBalance || 0) - courseToEnroll.price).toLocaleString('vi-VN')} đ`
                          : 'Không đủ số dư ví'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {Number(currentUser?.walletBalance || 0) < courseToEnroll.price && (
                <Alert variant="danger" className="py-2 small rounded-3 d-flex align-items-center justify-content-between mb-3">
                  <span>
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    Số dư hiện tại còn thiếu <strong>{(courseToEnroll.price - Number(currentUser?.walletBalance || 0)).toLocaleString('vi-VN')} đ</strong>.
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="fw-bold rounded-pill"
                    onClick={() => {
                      setShowEnrollConfirmModal(false);
                      setShowDepositModal(true);
                    }}
                  >
                    + Nạp Tiền Vào Ví Ngay
                  </Button>
                </Alert>
              )}

              {/* Cam kết đào tạo */}
              <div className="p-3 bg-light rounded-3 small text-muted border">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-shield-check text-success me-1"></i> Quyền Lợi & Cam Kết Đào Tạo:
                </div>
                <ul className="mb-0 ps-3">
                  <li>Bài học và mã nguồn được mở khóa ngay lập tức trong mục <strong>"Khóa học của tôi"</strong>.</li>
                  <li>Nhận chứng chỉ Certificate có mã QR xác thực quốc tế sau khi hoàn thành 100% giáo trình.</li>
                  <li>Hỗ trợ 1-1 qua Mentor và Cố vấn AI kỹ thuật trọn đời bài giảng.</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4 fw-bold"
            onClick={() => setShowEnrollConfirmModal(false)}
          >
            Hủy Bỏ
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 fw-bold shadow-sm"
            onClick={handleFinalConfirmEnroll}
            disabled={!currentUser || Number(currentUser?.walletBalance || 0) < (courseToEnroll?.price || 0)}
          >
            <i className="bi bi-check2-circle me-1"></i> Đồng Ý & Kích Hoạt Khóa Học
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Chúc Mừng Đăng Ký Khóa Học Thành Công Chi Tiết */}
      <Modal
        show={showEnrollSuccessModal}
        onHide={() => {
          setShowEnrollSuccessModal(false);
          setEnrolledCourseSuccess(null);
        }}
        centered
        size="lg"
      >
        <Modal.Body className="p-4 text-center">
          {enrolledCourseSuccess && (
            <div className="enroll-success-content page-fade-in">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle shadow-sm"
                style={{ width: 85, height: 85, fontSize: '2.8rem' }}
              >
                <i className="bi bi-mortarboard-fill"></i>
              </div>

              <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-bold mb-2">
                <i className="bi bi-stars me-1"></i> KÍCH HOẠT KHÓA HỌC THÀNH CÔNG
              </span>

              <h3 className="fw-bold text-dark mb-1">
                CHÚC MỪNG BẠN ĐÃ TRỞ THÀNH HỌC VIÊN CHÍNH THỨC!
              </h3>
              <p className="text-secondary small mb-3">
                Bạn đã đăng ký thành công khóa học <strong>"{enrolledCourseSuccess.title}"</strong>. Toàn bộ bài giảng, tài liệu mã nguồn và bài tập thực hành đã được mở khóa 100%.
              </p>

              {/* Thẻ tóm tắt khóa học & quyền học tập */}
              <div className="p-3 bg-light rounded-4 border text-start mb-3">
                <div className="row g-3 align-items-center mb-3 pb-3 border-bottom">
                  <div className="col-sm-3">
                    <img
                      src={enrolledCourseSuccess.thumbnail_url}
                      alt={enrolledCourseSuccess.title}
                      className="img-fluid rounded-3 shadow-xs border w-100"
                      style={{ maxHeight: '90px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-sm-9">
                    <div className="badge bg-primary-subtle text-primary border mb-1">{enrolledCourseSuccess.category?.name}</div>
                    <h6 className="fw-bold text-dark mb-1">{enrolledCourseSuccess.title}</h6>
                    <div className="small text-muted">
                      Giảng viên cố vấn: <strong>{enrolledCourseSuccess.instructor?.name || 'EduViet Mentor'}</strong> • Quyền sở hữu: <strong className="text-success">Trọn đời (Lifetime)</strong>
                    </div>
                  </div>
                </div>

                <div className="row g-2 small text-secondary">
                  <div className="col-sm-6">
                    <i className="bi bi-person-check-fill text-primary me-1"></i> Học viên: <strong className="text-dark">{currentUser?.fullName}</strong>
                  </div>
                  <div className="col-sm-6">
                    <i className="bi bi-envelope-check-fill text-danger me-1"></i> Email: <strong className="text-dark font-monospace">{currentUser?.email}</strong>
                  </div>
                  <div className="col-sm-6">
                    <i className="bi bi-credit-card-2-front-fill text-warning me-1"></i> Học phí đã thanh toán: <strong className="text-success font-monospace">{Number(enrolledCourseSuccess.price).toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="col-sm-6">
                    <i className="bi bi-wallet2 text-success me-1"></i> Số dư ví còn lại: <strong className="text-primary font-monospace">{Number(currentUser?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>
              </div>

              {/* Hướng dẫn học tập */}
              <div className="p-3 bg-white border rounded-3 text-start small text-secondary mb-3 shadow-xs">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                  Lộ Trình Bắt Đầu Ngay Hôm Nay:
                </h6>
                <div className="d-flex align-items-center gap-2 mb-1 text-dark">
                  <i className="bi bi-check2-circle text-success"></i>
                  <span>Truy cập mục <strong>"Khóa học của tôi"</strong> trên thanh điều hướng để bắt đầu xem video bài học.</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-1 text-dark">
                  <i className="bi bi-check2-circle text-success"></i>
                  <span>Tải về toàn bộ Source Code mẫu và Slide bài giảng tại tab Tài liệu của khóa học.</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-dark">
                  <i className="bi bi-check2-circle text-success"></i>
                  <span>Nhận chứng chỉ Certificate EduViet có chữ ký số sau khi hoàn tất 100% bài thực hành.</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="w-50 rounded-pill fw-bold"
                  onClick={() => {
                    setShowEnrollSuccessModal(false);
                    setEnrolledCourseSuccess(null);
                  }}
                >
                  Tiếp Tục Khám Phá
                </Button>
                <Button
                  variant="success"
                  className="w-50 rounded-pill fw-bold shadow-sm"
                  onClick={() => {
                    const toLearn = enrolledCourseSuccess;
                    setShowEnrollSuccessModal(false);
                    setEnrolledCourseSuccess(null);
                    setActiveLearningCourse(toLearn);
                    setCurrentRoute('learning-room');
                  }}
                >
                  <i className="bi bi-play-circle-fill me-1"></i> Vào Học Ngay Lập Tức
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
}
