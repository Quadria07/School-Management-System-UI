-- BFOIA School Management System - Complete Database Schema (MySQL)
-- Version 2.0
--
-- INSTRUCTIONS:
-- 1. Create a database in your cPanel (e.g., "school_db").
-- 2. Go to phpMyAdmin and select that database.
-- 3. Click "Import" tab.
-- 4. Upload this file and click "Go".

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `profiles` (Users)
--
CREATE TABLE `profiles` (
  `id` CHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'teacher', 'parent', 'principal', 'proprietor', 'hr', 'bursar') NOT NULL,
  `phone_number` VARCHAR(50) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `staff_id` VARCHAR(50) DEFAULT NULL,
  `student_id` VARCHAR(50) DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `approval_status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `approved_by` CHAR(36) DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `staff_id` (`staff_id`),
  UNIQUE KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `classes`
--
CREATE TABLE `classes` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `class_teacher_id` CHAR(36) DEFAULT NULL,
  `capacity` INT(11) DEFAULT 40,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `class_teacher_id` (`class_teacher_id`),
  CONSTRAINT `fk_classes_teacher` FOREIGN KEY (`class_teacher_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `subjects`
--
CREATE TABLE `subjects` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `class_subjects`
--
CREATE TABLE `class_subjects` (
  `id` CHAR(36) NOT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `subject_id` CHAR(36) DEFAULT NULL,
  `teacher_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_assignment` (`class_id`, `subject_id`, `academic_session`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `fk_cs_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `enrollments`
--
CREATE TABLE `enrollments` (
  `id` CHAR(36) NOT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `enrollment_date` DATE DEFAULT (CURRENT_DATE),
  `status` ENUM('active', 'suspended', 'withdrawn', 'graduated') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`student_id`, `academic_session`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `fk_enr_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enr_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `student_attendance`
--
CREATE TABLE `student_attendance` (
  `id` CHAR(36) NOT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
  `marked_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`student_id`, `date`),
  CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `lesson_notes`
--
CREATE TABLE `lesson_notes` (
  `id` CHAR(36) NOT NULL,
  `teacher_id` CHAR(36) DEFAULT NULL,
  `subject_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` ENUM('First Term', 'Second Term', 'Third Term') DEFAULT NULL,
  `week` INT(11) DEFAULT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `sub_topic` VARCHAR(255) DEFAULT NULL,
  `duration` VARCHAR(50) DEFAULT NULL,
  `period` VARCHAR(50) DEFAULT NULL,
  `previous_knowledge` TEXT DEFAULT NULL,
  `instructional_materials` TEXT DEFAULT NULL,
  `learning_objectives_cognitive` TEXT DEFAULT NULL,
  `learning_objectives_affective` TEXT DEFAULT NULL,
  `learning_objectives_psychomotor` TEXT DEFAULT NULL,
  `set_induction` TEXT DEFAULT NULL,
  `presentation` TEXT DEFAULT NULL,
  `evaluation` TEXT DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `assignment` TEXT DEFAULT NULL,
  `teacher_reflection` TEXT DEFAULT NULL,
  `hod_remarks` TEXT DEFAULT NULL,
  `status` ENUM('draft', 'pending', 'approved', 'rejected', 'published') DEFAULT 'draft',
  `submitted_at` DATETIME DEFAULT NULL,
  `approved_by` CHAR(36) DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `shared_with_students` TINYINT(1) DEFAULT 0,
  `shared_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `subject_id` (`subject_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `fk_ln_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`),
  CONSTRAINT `fk_ln_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `fk_ln_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `cbt_exams`
--
CREATE TABLE `cbt_exams` (
  `id` CHAR(36) NOT NULL,
  `teacher_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `subject_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` VARCHAR(20) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `instructions` TEXT DEFAULT NULL,
  `duration` INT(11) NOT NULL,
  `total_marks` DECIMAL(5, 2) NOT NULL,
  `pass_mark` DECIMAL(5, 2) NOT NULL,
  `allowed_attempts` INT(11) DEFAULT 1,
  `shuffle_questions` TINYINT(1) DEFAULT 1,
  `show_results_immediately` TINYINT(1) DEFAULT 0,
  `status` ENUM('draft', 'pending_approval', 'approved', 'published', 'archived') DEFAULT 'draft',
  `submitted_for_approval_at` DATETIME DEFAULT NULL,
  `approved_by` CHAR(36) DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `fk_cbt_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`),
  CONSTRAINT `fk_cbt_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `cbt_questions`
--
CREATE TABLE `cbt_questions` (
  `id` CHAR(36) NOT NULL,
  `exam_id` CHAR(36) DEFAULT NULL,
  `question_number` INT(11) NOT NULL,
  `question_text` TEXT NOT NULL,
  `question_type` VARCHAR(50) DEFAULT 'multiple_choice',
  `option_a` TEXT DEFAULT NULL,
  `option_b` TEXT DEFAULT NULL,
  `option_c` TEXT DEFAULT NULL,
  `option_d` TEXT DEFAULT NULL,
  `correct_answer` TEXT NOT NULL,
  `points` DECIMAL(5, 2) DEFAULT 1.00,
  `explanation` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_question` (`exam_id`, `question_number`),
  CONSTRAINT `fk_cq_exam` FOREIGN KEY (`exam_id`) REFERENCES `cbt_exams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `cbt_attempts`
--
CREATE TABLE `cbt_attempts` (
  `id` CHAR(36) NOT NULL,
  `exam_id` CHAR(36) DEFAULT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `attempt_number` INT(11) NOT NULL,
  `started_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` DATETIME DEFAULT NULL,
  `time_spent` INT(11) DEFAULT NULL,
  `score` DECIMAL(5, 2) DEFAULT NULL,
  `total_marks` DECIMAL(5, 2) DEFAULT NULL,
  `percentage` DECIMAL(5, 2) DEFAULT NULL,
  `passed` TINYINT(1) DEFAULT NULL,
  `status` ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attempt` (`exam_id`, `student_id`, `attempt_number`),
  CONSTRAINT `fk_ca_exam` FOREIGN KEY (`exam_id`) REFERENCES `cbt_exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ca_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `cbt_answers`
--
CREATE TABLE `cbt_answers` (
  `id` CHAR(36) NOT NULL,
  `attempt_id` CHAR(36) DEFAULT NULL,
  `question_id` CHAR(36) DEFAULT NULL,
  `selected_answer` TEXT DEFAULT NULL,
  `is_correct` TINYINT(1) DEFAULT NULL,
  `points_awarded` DECIMAL(5, 2) DEFAULT 0.00,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_answer` (`attempt_id`, `question_id`),
  CONSTRAINT `fk_cans_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `cbt_attempts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cans_question` FOREIGN KEY (`question_id`) REFERENCES `cbt_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `results`
--
CREATE TABLE `results` (
  `id` CHAR(36) NOT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `subject_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` VARCHAR(20) NOT NULL,
  `ca_score` DECIMAL(5, 2) DEFAULT 0.00,
  `exam_score` DECIMAL(5, 2) DEFAULT 0.00,
  `total_score` DECIMAL(5, 2) DEFAULT 0.00,
  `grade` VARCHAR(5) DEFAULT NULL,
  `position` INT(11) DEFAULT NULL,
  `total_students` INT(11) DEFAULT NULL,
  `teacher_id` CHAR(36) DEFAULT NULL,
  `teacher_remarks` TEXT DEFAULT NULL,
  `status` ENUM('draft', 'submitted', 'approved', 'published') DEFAULT 'draft',
  `submitted_at` DATETIME DEFAULT NULL,
  `approved_by` CHAR(36) DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `published` TINYINT(1) DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_result` (`student_id`, `subject_id`, `academic_session`, `term`),
  CONSTRAINT `fk_res_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_res_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `fk_res_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `assignments`
--
CREATE TABLE `assignments` (
  `id` CHAR(36) NOT NULL,
  `teacher_id` CHAR(36) DEFAULT NULL,
  `class_id` CHAR(36) DEFAULT NULL,
  `subject_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` VARCHAR(20) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `instructions` TEXT DEFAULT NULL,
  `due_date` DATETIME NOT NULL,
  `total_marks` DECIMAL(5, 2) DEFAULT 100.00,
  `attachment_urls` JSON DEFAULT NULL,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assign_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assign_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `assignment_submissions`
--
CREATE TABLE `assignment_submissions` (
  `id` CHAR(36) NOT NULL,
  `assignment_id` CHAR(36) DEFAULT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `submission_text` TEXT DEFAULT NULL,
  `attachment_urls` JSON DEFAULT NULL,
  `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('draft', 'submitted', 'graded', 'late') DEFAULT 'submitted',
  `score` DECIMAL(5, 2) DEFAULT NULL,
  `feedback` TEXT DEFAULT NULL,
  `graded_by` CHAR(36) DEFAULT NULL,
  `graded_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_submission` (`assignment_id`, `student_id`),
  CONSTRAINT `fk_sub_assign` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `messages`
--
CREATE TABLE `messages` (
  `id` CHAR(36) NOT NULL,
  `sender_id` CHAR(36) DEFAULT NULL,
  `recipient_id` CHAR(36) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `attachment_urls` JSON DEFAULT NULL,
  `read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `replied_to` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `recipient_id` (`recipient_id`),
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `announcements`
--
CREATE TABLE `announcements` (
  `id` CHAR(36) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `priority` ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  `target_role` JSON DEFAULT NULL, -- Array of roles e.g. ["student", "teacher"]
  `target_classes` JSON DEFAULT NULL, -- Array of class IDs
  `published` TINYINT(1) DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `attachment_urls` JSON DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ann_creator` FOREIGN KEY (`created_by`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `notifications`
--
CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `action_url` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `fee_structures`
--
CREATE TABLE `fee_structures` (
  `id` CHAR(36) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` VARCHAR(20) NOT NULL,
  `tuition_fee` DECIMAL(10, 2) NOT NULL,
  `development_levy` DECIMAL(10, 2) DEFAULT 0.00,
  `exam_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `sports_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `library_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `ict_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `total_fee` DECIMAL(10, 2) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fee_struct` (`level`, `academic_session`, `term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `student_fees`
--
CREATE TABLE `student_fees` (
  `id` CHAR(36) NOT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `fee_structure_id` CHAR(36) DEFAULT NULL,
  `academic_session` VARCHAR(20) DEFAULT '2024/2025',
  `term` VARCHAR(20) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `amount_paid` DECIMAL(10, 2) DEFAULT 0.00,
  `balance` DECIMAL(10, 2) NOT NULL,
  `discount_percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `discount_reason` TEXT DEFAULT NULL,
  `due_date` DATE DEFAULT NULL,
  `payment_status` ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_fee` (`student_id`, `academic_session`, `term`),
  CONSTRAINT `fk_sf_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sf_structure` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `payments`
--
CREATE TABLE `payments` (
  `id` CHAR(36) NOT NULL,
  `student_fee_id` CHAR(36) DEFAULT NULL,
  `student_id` CHAR(36) DEFAULT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('cash', 'bank_transfer', 'online', 'pos', 'cheque') NOT NULL,
  `payment_reference` VARCHAR(255) DEFAULT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `verified_by` CHAR(36) DEFAULT NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `verification_date` DATETIME DEFAULT NULL,
  `receipt_number` VARCHAR(100) DEFAULT NULL,
  `receipt_url` VARCHAR(255) DEFAULT NULL,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `payer_name` VARCHAR(255) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_reference` (`payment_reference`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  CONSTRAINT `fk_pay_fee` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_student` FOREIGN KEY (`student_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `leave_requests`
--
CREATE TABLE `leave_requests` (
  `id` CHAR(36) NOT NULL,
  `staff_id` CHAR(36) DEFAULT NULL,
  `leave_type` ENUM('annual', 'sick', 'maternity', 'paternity', 'casual', 'unpaid') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_days` INT(11) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `reviewed_by` CHAR(36) DEFAULT NULL,
  `reviewed_at` DATETIME DEFAULT NULL,
  `review_notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lr_staff` FOREIGN KEY (`staff_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `payroll`
--
CREATE TABLE `payroll` (
  `id` CHAR(36) NOT NULL,
  `staff_id` CHAR(36) DEFAULT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT(11) NOT NULL,
  `basic_salary` DECIMAL(10, 2) NOT NULL,
  `allowances` DECIMAL(10, 2) DEFAULT 0.00,
  `deductions` DECIMAL(10, 2) DEFAULT 0.00,
  `net_salary` DECIMAL(10, 2) NOT NULL,
  `payment_status` ENUM('pending', 'processing', 'paid') DEFAULT 'pending',
  `payment_date` DATE DEFAULT NULL,
  `payment_reference` VARCHAR(100) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_payroll` (`staff_id`, `month`, `year`),
  CONSTRAINT `fk_pr_staff` FOREIGN KEY (`staff_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
