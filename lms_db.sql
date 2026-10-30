-- ========================================================
-- EDUVIET LMS PLATFORM - DATABASE SCHEMA (MYSQL 8 / MARIADB)
-- Auto-synchronized with TypeORM Entities (30 Tables Complete)
-- Project: Nhom 6 N01-26
-- ========================================================

CREATE DATABASE IF NOT EXISTS `lms_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lms_db`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: `categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `lessons`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_type` enum('Video','Article','Quiz','Document') NOT NULL,
  `content_url` varchar(500) DEFAULT NULL,
  `duration_seconds` int(11) NOT NULL DEFAULT 0,
  `is_preview` tinyint(1) NOT NULL DEFAULT 0,
  `order_index` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `modules`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `enrollments`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` datetime NOT NULL,
  `progress_percent` decimal(5,2) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','COMPLETED','REFUNDED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`enrollment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `courses`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `instructor_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0,
  `level` enum('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  `status` enum('Draft','Published','Archived') NOT NULL DEFAULT 'Draft',
  `rejection_reason` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `IDX_a3bb2d01cfa0f95bc5e034e1b7` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `roles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `reset_token_hash` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `cart_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `vouchers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `voucher_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('PERCENT','FIXED') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) NOT NULL DEFAULT 0,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `usage_limit` int(11) NOT NULL DEFAULT 100,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`voucher_id`),
  KEY `IDX_efc30b2b9169e05e0e1e19d6dd` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `wallets`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wallets`;
CREATE TABLE `wallets` (
  `wallet_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`wallet_id`),
  KEY `IDX_92558c08091598f7a4439586cd` (`user_id`),
  KEY `REL_92558c08091598f7a4439586cd` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `wallet_ledgers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wallet_ledgers`;
CREATE TABLE `wallet_ledgers` (
  `ledger_id` int(11) NOT NULL AUTO_INCREMENT,
  `wallet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('DEPOSIT','PURCHASE','REFUND') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `balance_before` decimal(12,2) NOT NULL,
  `balance_after` decimal(12,2) NOT NULL,
  `reference_type` varchar(50) NOT NULL,
  `reference_id` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`ledger_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `topup_requests`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `topup_requests`;
CREATE TABLE `topup_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `payment_method` varchar(50) NOT NULL DEFAULT 'DEMO_BANK',
  `transaction_ref` varchar(100) NOT NULL,
  `admin_note` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `IDX_527661fd0767e41bb856baa1fc` (`transaction_ref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `order_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `orders`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `final_amount` decimal(12,2) NOT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `status` enum('PENDING','PAID','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `payment_method` varchar(50) NOT NULL DEFAULT 'WALLET',
  `created_at` datetime NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `IDX_e462c2f2237b3049aa6be3fce0` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `refund_requests`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `refund_requests`;
CREATE TABLE `refund_requests` (
  `refund_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `admin_comment` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `processed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`refund_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `lesson_progress`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lesson_progress`;
CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `resume_position_seconds` int(11) NOT NULL DEFAULT 0,
  `watched_intervals` text NOT NULL DEFAULT '[]',
  `duration_seconds` int(11) NOT NULL DEFAULT 0,
  `completion_percent` decimal(5,2) NOT NULL DEFAULT 0,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `last_watched_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `lesson_notes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lesson_notes`;
CREATE TABLE `lesson_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `timestamp_seconds` int(11) NOT NULL DEFAULT 0,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `lesson_attachments`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lesson_attachments`;
CREATE TABLE `lesson_attachments` (
  `attachment_id` int(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL DEFAULT 'PDF',
  `file_url` varchar(500) NOT NULL,
  `file_size_bytes` int(11) NOT NULL DEFAULT 0,
  `is_preview` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`attachment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `quiz_questions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE `quiz_questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `options` text NOT NULL,
  `correct_answer_index` int(11) NOT NULL DEFAULT 0,
  `points` int(11) NOT NULL DEFAULT 10,
  `explanation` text DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `quiz_attempts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE `quiz_attempts` (
  `attempt_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL DEFAULT 0,
  `max_score` int(11) NOT NULL DEFAULT 100,
  `is_passed` tinyint(1) NOT NULL DEFAULT 0,
  `answers` text NOT NULL,
  `submitted_at` datetime NOT NULL,
  PRIMARY KEY (`attempt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `bundles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `bundles`;
CREATE TABLE `bundles` (
  `bundle_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `bundle_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bundle_id`),
  KEY `IDX_7da4ed9b523bde1ca02ff41225` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `bundle_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `bundle_items`;
CREATE TABLE `bundle_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bundle_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `projects`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `difficulty` varchar(50) NOT NULL DEFAULT 'Intermediate',
  `brief` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `milestones` json DEFAULT NULL,
  `rubric` json DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`project_id`),
  KEY `IDX_96e045ab8b0271e5f5a91eae1e` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `project_submissions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `project_submissions`;
CREATE TABLE `project_submissions` (
  `submission_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `repo_url` varchar(500) DEFAULT NULL,
  `demo_url` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `completed_milestones` json DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'DRAFT',
  `grade_score` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `practice_exercises`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `practice_exercises`;
CREATE TABLE `practice_exercises` (
  `exercise_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `difficulty` varchar(50) NOT NULL DEFAULT 'Beginner',
  `description` text NOT NULL,
  `initial_code` text DEFAULT NULL,
  `solution_code` text DEFAULT NULL,
  `test_cases` json DEFAULT NULL,
  `hint` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `skill_assessments`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `skill_assessments`;
CREATE TABLE `skill_assessments` (
  `assessment_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `duration_minutes` int(11) NOT NULL DEFAULT 15,
  `questions` json NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `community_posts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `community_posts`;
CREATE TABLE `community_posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `tags` json DEFAULT NULL,
  `views_count` int(11) NOT NULL DEFAULT 0,
  `likes_count` int(11) NOT NULL DEFAULT 0,
  `is_solved` tinyint(1) NOT NULL DEFAULT 0,
  `accepted_reply_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `community_replies`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `community_replies`;
CREATE TABLE `community_replies` (
  `reply_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `likes_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `articles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Frontend',
  `author_name` varchar(100) NOT NULL DEFAULT 'Ban Chuyên Môn EduViet',
  `author_avatar` varchar(255) NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  `read_time` varchar(50) NOT NULL DEFAULT '6 phút đọc',
  `views_count` int(11) NOT NULL DEFAULT 0,
  `likes_count` int(11) NOT NULL DEFAULT 0,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `related_course_id` int(11) DEFAULT NULL,
  `tags` varchar(255) NOT NULL DEFAULT '[]',
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`article_id`),
  KEY `IDX_1123ff6815c5b8fec0ba9fec37` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: `user_roles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `IDX_87b8888186ca9769c960e92687` (`user_id`),
  KEY `IDX_b23c65e50a758245a33ee35fda` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- FOREIGN KEY CONSTRAINTS
-- ========================================================

ALTER TABLE `categories` ADD CONSTRAINT `FK_88cea2dc9c31951d06437879b40` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `lessons` ADD CONSTRAINT `FK_35fb2307535d90a6ed290af1f4a` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `modules` ADD CONSTRAINT `FK_0a00005552998b16b7e89340843` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `enrollments` ADD CONSTRAINT `FK_307813fe255896d6ebf3e6cd55c` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `enrollments` ADD CONSTRAINT `FK_b79d0bf01779fdf9cfb6b092af3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `courses` ADD CONSTRAINT `FK_4fdc83dd6b261101401ec259342` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `courses` ADD CONSTRAINT `FK_e4c260fe6bb1131707c4617f745` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE `cart_items` ADD CONSTRAINT `FK_b7213c20c1ecdc6597abc8f1212` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `cart_items` ADD CONSTRAINT `FK_82206f0c18875a8d46fb35182d6` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `wallets` ADD CONSTRAINT `FK_92558c08091598f7a4439586cda` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `wallet_ledgers` ADD CONSTRAINT `FK_53d7833deb150cb6c9c8010ac77` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`wallet_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `order_items` ADD CONSTRAINT `FK_145532db85752b29c57d2b7b1f1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `order_items` ADD CONSTRAINT `FK_72050220d9ee042049b15d35e31` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE `lesson_progress` ADD CONSTRAINT `FK_0d9292b3eb40707950eeeba9617` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `lesson_progress` ADD CONSTRAINT `FK_980e74721039ebe210fee2eeca2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `lesson_progress` ADD CONSTRAINT `FK_112753761c2a01adab9677b717f` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `lesson_notes` ADD CONSTRAINT `FK_ec783a54bb94db53d307ff2ffb7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `lesson_notes` ADD CONSTRAINT `FK_cbf90f9bc2df522e19cab95cbd5` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `lesson_attachments` ADD CONSTRAINT `FK_f231647f246dbfb9ec67faa800c` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `quiz_questions` ADD CONSTRAINT `FK_6b835fb54232f4be619b4b2efd0` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `FK_1701aaf48f6a78e96bfe08dd395` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `FK_397adce2d4c97159ff231ad9f2f` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bundle_items` ADD CONSTRAINT `FK_204a2f0fd03ca0efbf9db586b7f` FOREIGN KEY (`bundle_id`) REFERENCES `bundles` (`bundle_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bundle_items` ADD CONSTRAINT `FK_e2691355ec7c1de34da69de40ee` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `project_submissions` ADD CONSTRAINT `FK_02d19d5650ca3af9e8d3ffe86a7` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `project_submissions` ADD CONSTRAINT `FK_3bc833788946ed9431caeac95db` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `community_posts` ADD CONSTRAINT `FK_7dfb219814306c1b40edc9f0c54` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `community_replies` ADD CONSTRAINT `FK_44c0a4dbcb280259b5216eeeb42` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `community_replies` ADD CONSTRAINT `FK_76a53eaeb0eb08c0f15a951c1bc` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `user_roles` ADD CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_roles` ADD CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ========================================================
-- SEED DATA & MOCK DATABASE FIXTURES
-- ========================================================

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
  (1, 'Admin'),
  (2, 'Instructor'),
  (3, 'Student');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `is_active`, `created_at`) VALUES
  (1, 'Quản trị viên EduViet', 'admin@eduviet.vn', '7d416cc472d0f256d92a5c8f1c7470019161d35020f65276e226e241188b7597', 1, NOW()),
  (2, 'Vũ Quốc Huy', 'giangvien@eduviet.vn', '34356b03ebdbcff3e93eda08096d4a0f907e6b0919d1783df8530fdd8d594fe4', 1, NOW()),
  (3, 'Nguyễn Văn Dev', 'dev.nguyen@gmail.com', 'd224baed9fd603b160990cc96ef7b551a3ee05388777a7e16db0d2cf86417f19', 1, NOW()),
  (4, 'Trần Thị Backend', 'tran.backend@gmail.com', 'd224baed9fd603b160990cc96ef7b551a3ee05388777a7e16db0d2cf86417f19', 1, NOW());

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 3);

INSERT INTO `wallets` (`wallet_id`, `user_id`, `balance`, `updated_at`) VALUES
  (1, 1, 5000000.00, NOW()),
  (2, 2, 2500000.00, NOW()),
  (3, 3, 1000000.00, NOW()),
  (4, 4, 1000000.00, NOW());

INSERT INTO `wallet_ledgers` (`ledger_id`, `wallet_id`, `user_id`, `amount`, `balance_before`, `balance_after`, `type`, `reference_type`, `reference_id`, `description`, `created_at`) VALUES
  (1, 1, 1, 5000000.00, 0, 5000000.00, 'TOPUP', 'ADMIN', 'INIT-ADMIN', 'Khởi tạo ví quản trị hệ thống', NOW()),
  (2, 2, 2, 2500000.00, 0, 2500000.00, 'TOPUP', 'INSTRUCTOR', 'INIT-INS', 'Khởi tạo ví giảng viên', NOW()),
  (3, 3, 3, 1000000.00, 0, 1000000.00, 'TOPUP', 'SYSTEM_GRANT', 'WELCOME-3', 'Quà tặng chào mừng học viên mới', NOW()),
  (4, 4, 4, 1000000.00, 0, 1000000.00, 'TOPUP', 'SYSTEM_GRANT', 'WELCOME-4', 'Quà tặng chào mừng học viên mới', NOW());

INSERT INTO `categories` (`category_id`, `category_name`, `order_index`) VALUES
  (1, 'Frontend', 1),
  (2, 'Backend', 2),
  (3, 'Cơ sở dữ liệu', 3),
  (4, 'DevOps', 4),
  (5, 'Mobile', 5);

INSERT INTO `courses` (`course_id`, `instructor_id`, `category_id`, `title`, `slug`, `description`, `thumbnail_url`, `price`, `level`, `status`, `created_at`) VALUES
  (1, 2, 1, 'Lập Trình Web Frontend Chuyên Sâu với ReactJS & Next.js', 'lap-trinh-web-frontend-reactjs', 'Nắm vững React 19, React Router v7, Redux Toolkit, Tailwind CSS, tối ưu SEO với Next.js và hoàn thiện 3 dự án thực tế.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', 890000.00, 'Beginner', 'Published', NOW()),
  (2, 2, 2, 'Xây Dựng Backend & RESTful API cùng NestJS & MySQL', 'backend-nestjs-mysql-architecture', 'Kiến trúc Clean Architecture, Dependency Injection, TypeORM, xác thực JWT, Redis Caching, Microservices cơ bản.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', 950000.00, 'Intermediate', 'Published', NOW()),
  (3, 2, 3, 'Thiết Kế CSDL Quan Hệ & Tối Ưu Hóa Truy Vấn MySQL', 'database-design-mysql-optimization', 'Mô hình hóa ERD, chuẩn hóa 3NF, đánh chỉ mục Indexing B-Tree, tối ưu câu lệnh truy vấn phức tạp, Transaction ACID.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80', 490000.00, 'Beginner', 'Published', NOW()),
  (4, 2, 2, 'Lập Trình Python Cho Phân Tích Dữ Liệu & AI Cơ Bản', 'python-data-science-ai-machine-learning', 'Thành thạo NumPy, Pandas, Matplotlib, Seaborn và xây dựng mô hình dự đoán cơ bản với Scikit-Learn.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', 790000.00, 'Beginner', 'Published', NOW()),
  (5, 2, 4, 'DevOps Thực Chiến: Docker, Docker-Compose & CI/CD GitHub Actions', 'devops-docker-cicd-github-actions', 'Container hóa ứng dụng Frontend/Backend, thiết lập quy trình tự động Build, Test và Deploy lên VPS Linux.', 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80', 690000.00, 'Intermediate', 'Published', NOW()),
  (6, 2, 5, 'Lập Trình Ứng Dụng Đa Nền Tảng Flutter & Dart Từ Số 0', 'lap-trinh-mobile-flutter-dart', 'Xây dựng ứng dụng di động cho iOS & Android với Flutter Framework, State Management Bloc/Provider, tích hợp REST API.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80', 850000.00, 'Beginner', 'Published', NOW()),
  (7, 2, 2, 'Lập Trình Hệ Thống Phân Tán Cao Cấp với Golang & gRPC', 'golang-high-performance-microservices', 'Xây dựng Microservices hiệu năng cao, Goroutines & Channels, Kafka Message Queue, gRPC Protocol.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80', 990000.00, 'Advanced', 'Published', NOW()),
  (8, 2, 1, 'Next.js 15 App Router Fullstack & Server Actions', 'nextjs-15-app-router-fullstack', 'Chinh phục SSR/SSG chuẩn công nghiệp, React Server Components (RSC), tích hợp thanh toán, triển khai Vercel & AWS.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', 890000.00, 'Intermediate', 'Published', NOW());

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

INSERT INTO `vouchers` (`voucher_id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount_amount`, `valid_from`, `valid_until`, `usage_limit`, `used_count`, `is_active`, `created_at`) VALUES
  (1, 'GIAM20', 'PERCENT', 20.00, 200000.00, 300000.00, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 100, 5, 1, NOW()),
  (2, 'CHAOHANG', 'FIXED', 50000.00, 100000.00, 50000.00, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 50, 0, 1, NOW());

INSERT INTO `quiz_questions` (`question_id`, `lesson_id`, `question_text`, `options`, `correct_answer_index`, `points`, `explanation`) VALUES
  (1, 3, 'Trong React 19, hàm/hook nào được dùng để thực hiện side effects?', '["useState","useEffect","useMemo","useReducer"]', 1, 50, 'useEffect được dùng để quản lý side-effects trong functional component.'),
  (2, 3, 'Thực thi typeof null trong JavaScript trả về kết quả gì?', '["\"null\"","\"undefined\"","\"object\"","\"boolean\""]', 2, 50, 'typeof null trả về "object" do thiết kế ban đầu của JavaScript.');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
