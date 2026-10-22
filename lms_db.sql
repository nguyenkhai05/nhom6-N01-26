CREATE DATABASE IF NOT EXISTS `lms_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lms_db`;
SET NAMES utf8mb4;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `order_index` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `level` enum('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  `status` enum('Draft','Published','Archived') DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `progress_percent` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_type` enum('Video','Article','Quiz','Document') NOT NULL,
  `content_url` varchar(500) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT 0,
  `is_preview` tinyint(1) DEFAULT 0,
  `order_index` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `lesson_progress` (
  `progress_id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed','Failed','Refunded') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `parent_id` (`parent_id`);

ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `instructor_id` (`instructor_id`),
  ADD KEY `category_id` (`category_id`);

ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `module_id` (`module_id`);

ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `enrollment_id` (`enrollment_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

ALTER TABLE `modules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `course_id` (`course_id`);


ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `course_id` (`course_id`);


ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `transaction_code` (`transaction_code`),
  ADD KEY `order_id` (`order_id`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lesson_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `modules`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;


ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE;

ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;

ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
-- ===== DỮ LIỆU MẪU (Phần 1) =====
-- Mật khẩu lưu dạng SHA-256 (hex). Tài khoản mẫu:
--   admin@eduviet.vn / Eduenglish123 | giangvien@eduviet.vn / Giangvien@123 | dev.nguyen@gmail.com, tran.backend@gmail.com / Hocvien@123

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
  (1, 'Admin'),
  (2, 'Instructor'),
  (3, 'Student');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `is_active`) VALUES
  (1, 'Quản trị viên EduViet', 'admin@eduviet.vn', '7d416cc472d0f256d92a5c8f1c7470019161d35020f65276e226e241188b7597', 1),
  (2, 'Vũ Quốc Huy', 'giangvien@eduviet.vn', '34356b03ebdbcff3e93eda08096d4a0f907e6b0919d1783df8530fdd8d594fe4', 1),
  (3, 'Nguyễn Văn Dev', 'dev.nguyen@gmail.com', 'd224baed9fd603b160990cc96ef7b551a3ee05388777a7e16db0d2cf86417f19', 1),
  (4, 'Trần Thị Backend', 'tran.backend@gmail.com', 'd224baed9fd603b160990cc96ef7b551a3ee05388777a7e16db0d2cf86417f19', 1);

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 3);

INSERT INTO `categories` (`category_id`, `category_name`, `order_index`) VALUES
  (1, 'Frontend', 1),
  (2, 'Backend', 2),
  (3, 'Cơ sở dữ liệu', 3),
  (4, 'DevOps', 4),
  (5, 'Mobile', 5);

INSERT INTO `courses` (`course_id`, `instructor_id`, `category_id`, `title`, `slug`, `description`, `thumbnail_url`, `price`, `level`, `status`) VALUES
  (1, 2, 1, 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js', 'lap-trinh-web-frontend-reactjs', 'Nắm vững React 19, React Router v7, Redux Toolkit, Tailwind CSS, tối ưu SEO với Next.js và hoàn thiện 3 dự án thực tế.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', 890000, 'Beginner', 'Published'),
  (2, 2, 2, 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL', 'backend-nestjs-mysql-architecture', 'Kiến trúc Clean Architecture, Dependency Injection, TypeORM, xác thực JWT, Redis Caching, Microservices cơ bản.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', 950000, 'Intermediate', 'Published'),
  (3, 2, 3, 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL', 'database-design-mysql-optimization', 'Mô hình hóa ERD, chuẩn hóa 3NF, đánh chỉ mục Indexing B-Tree, tối ưu câu lệnh truy vấn phức tạp, Transaction ACID.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80', 490000, 'Beginner', 'Published'),
  (4, 2, 2, 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản', 'python-data-science-ai-machine-learning', 'Thành thạo NumPy, Pandas, Matplotlib, Seaborn và xây dựng mô hình dự đoán cơ bản với Scikit-Learn.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', 790000, 'Beginner', 'Published'),
  (5, 2, 4, 'DevOps Thực Chiến: Docker, Docker-Compose & CI/CD GitHub Actions', 'devops-docker-cicd-github-actions', 'Container hóa ứng dụng Frontend/Backend, thiết lập quy trình tự động Build, Test và Deploy lên VPS Linux.', 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80', 690000, 'Intermediate', 'Published'),
  (6, 2, 5, 'Lập Trình Ứng Dụng Đa Nền Tảng Flutter & Dart Từ Số 0', 'lap-trinh-mobile-flutter-dart', 'Xây dựng ứng dụng di động cho iOS & Android với Flutter Framework, State Management Bloc/Provider, tích hợp REST API.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80', 850000, 'Beginner', 'Published'),
  (7, 2, 2, 'Lập Trình Hệ Thống Phân Tán Cao Cấp với Golang & gRPC', 'golang-high-performance-microservices', 'Xây dựng Microservices hiệu năng cao, Goroutines & Channels, Kafka Message Queue, gRPC Protocol.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80', 990000, 'Advanced', 'Published'),
  (8, 2, 1, 'Next.js 15 App Router Fullstack & Server Actions', 'nextjs-15-app-router-fullstack', 'Chinh phục SSR/SSG chuẩn công nghiệp, React Server Components (RSC), tích hợp thanh toán, triển khai Vercel & AWS.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', 890000, 'Intermediate', 'Published');

INSERT INTO `modules` (`module_id`, `course_id`, `title`, `order_index`) VALUES
  (1, 1, 'Làm quen với React', 1),
  (2, 1, 'Next.js và dự án thực tế', 2),
  (3, 2, 'Nền tảng NestJS', 1),
  (4, 2, 'Làm việc với MySQL', 2),
  (5, 3, 'Thiết kế cơ sở dữ liệu', 1),
  (6, 3, 'Truy vấn và tối ưu', 2),
  (7, 4, 'Python cho dữ liệu', 1),
  (8, 4, 'Trực quan hóa và học máy', 2),
  (9, 5, 'Docker căn bản', 1),
  (10, 5, 'CI/CD', 2),
  (11, 6, 'Làm quen Flutter', 1),
  (12, 6, 'Xây dựng ứng dụng', 2),
  (13, 7, 'Golang căn bản', 1),
  (14, 7, 'Microservices', 2),
  (15, 8, 'App Router', 1),
  (16, 8, 'Fullstack thực chiến', 2);

INSERT INTO `lessons` (`lesson_id`, `module_id`, `title`, `content_type`, `duration_seconds`, `is_preview`, `order_index`) VALUES
  (1, 1, 'Giới thiệu React và cài đặt môi trường', 'Video', 840, 1, 1),
  (2, 1, 'Component, JSX và Props', 'Video', 1020, 0, 2),
  (3, 1, 'State và Hook useState', 'Video', 1200, 0, 3),
  (4, 2, 'Routing trong Next.js', 'Video', 900, 0, 1),
  (5, 2, 'Gọi API và hiển thị dữ liệu', 'Video', 1080, 0, 2),
  (6, 2, 'Triển khai dự án lên Vercel', 'Article', 0, 0, 3),
  (7, 3, 'Giới thiệu NestJS và cấu trúc dự án', 'Video', 840, 1, 1),
  (8, 3, 'Controller và Service', 'Video', 1020, 0, 2),
  (9, 3, 'Dependency Injection', 'Video', 1200, 0, 3),
  (10, 4, 'Kết nối MySQL bằng TypeORM', 'Video', 900, 0, 1),
  (11, 4, 'Xây dựng CRUD RESTful API', 'Video', 1080, 0, 2),
  (12, 4, 'Xác thực người dùng với JWT', 'Article', 0, 0, 3),
  (13, 5, 'Mô hình ERD', 'Video', 840, 1, 1),
  (14, 5, 'Chuẩn hóa 1NF đến 3NF', 'Video', 1020, 0, 2),
  (15, 5, 'Khóa chính và khóa ngoại', 'Video', 1200, 0, 3),
  (16, 6, 'Truy vấn JOIN và GROUP BY', 'Video', 900, 0, 1),
  (17, 6, 'Đánh chỉ mục (Index)', 'Video', 1080, 0, 2),
  (18, 6, 'Transaction và ACID', 'Article', 0, 0, 3),
  (19, 7, 'Cài đặt Python và Jupyter', 'Video', 840, 1, 1),
  (20, 7, 'NumPy cơ bản', 'Video', 1020, 0, 2),
  (21, 7, 'Xử lý dữ liệu với Pandas', 'Video', 1200, 0, 3),
  (22, 8, 'Vẽ biểu đồ với Matplotlib', 'Video', 900, 0, 1),
  (23, 8, 'Mô hình hồi quy với Scikit-Learn', 'Video', 1080, 0, 2),
  (24, 8, 'Đánh giá mô hình', 'Article', 0, 0, 3),
  (25, 9, 'Container là gì', 'Video', 840, 1, 1),
  (26, 9, 'Viết Dockerfile', 'Video', 1020, 0, 2),
  (27, 9, 'Docker Compose nhiều dịch vụ', 'Video', 1200, 0, 3),
  (28, 10, 'Giới thiệu GitHub Actions', 'Video', 900, 0, 1),
  (29, 10, 'Tự động build và test', 'Video', 1080, 0, 2),
  (30, 10, 'Tự động deploy lên VPS', 'Article', 0, 0, 3),
  (31, 11, 'Cài đặt Flutter và Dart cơ bản', 'Video', 840, 1, 1),
  (32, 11, 'Widget và bố cục giao diện', 'Video', 1020, 0, 2),
  (33, 11, 'Điều hướng giữa các màn hình', 'Video', 1200, 0, 3),
  (34, 12, 'Quản lý trạng thái với Provider', 'Video', 900, 0, 1),
  (35, 12, 'Gọi REST API', 'Video', 1080, 0, 2),
  (36, 12, 'Đóng gói ứng dụng', 'Article', 0, 0, 3),
  (37, 13, 'Cú pháp Go và kiểu dữ liệu', 'Video', 840, 1, 1),
  (38, 13, 'Goroutines và Channels', 'Video', 1020, 0, 2),
  (39, 13, 'Xây dựng HTTP server', 'Video', 1200, 0, 3),
  (40, 14, 'Giao tiếp gRPC', 'Video', 900, 0, 1),
  (41, 14, 'Kafka Message Queue', 'Video', 1080, 0, 2),
  (42, 14, 'Triển khai Microservices', 'Article', 0, 0, 3),
  (43, 15, 'Cấu trúc App Router', 'Video', 840, 1, 1),
  (44, 15, 'Server Components', 'Video', 1020, 0, 2),
  (45, 15, 'Server Actions', 'Video', 1200, 0, 3),
  (46, 16, 'Kết nối cơ sở dữ liệu', 'Video', 900, 0, 1),
  (47, 16, 'Xác thực và phân quyền', 'Video', 1080, 0, 2),
  (48, 16, 'Triển khai lên AWS', 'Article', 0, 0, 3);

COMMIT;