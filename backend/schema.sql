-- ============================================================
-- LASU NAVIGATOR DATABASE SCHEMA
-- Backend: Node.js + Express + MySQL (Railway)
-- Auth: Firebase Authentication (kept as-is)
-- ============================================================

CREATE DATABASE IF NOT EXISTS lasu_navigator;
USE lasu_navigator;

-- 1. Students / Users Table
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    uid           VARCHAR(255) UNIQUE NOT NULL,     -- Firebase Auth UID
    full_name     VARCHAR(150) NOT NULL,
    matric_no     VARCHAR(50)  UNIQUE NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    role          ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
    department    VARCHAR(100) DEFAULT 'Computer Science',
    level         VARCHAR(10)  DEFAULT '300',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_uid   (uid)
);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    body          TEXT NOT NULL,
    author_uid    VARCHAR(255) NOT NULL,
    author_email  VARCHAR(150) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (created_at)
);

-- 3. Class Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    course_code    VARCHAR(50)  NOT NULL,
    course_name    VARCHAR(150) NOT NULL,
    lecturer_name  VARCHAR(150) NOT NULL,
    day_of_week    ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time     VARCHAR(20)  NOT NULL,
    duration_hours INT NOT NULL DEFAULT 2,
    venue          VARCHAR(100) NOT NULL,
    created_by_uid VARCHAR(255) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_day (day_of_week)
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_uid         VARCHAR(255) NOT NULL,
    announcement_id  INT NOT NULL,
    is_read          TINYINT(1) DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
    INDEX idx_user_uid (user_uid)
);

-- Sample admin user (replace uid with your actual Firebase UID)
INSERT IGNORE INTO users (uid, full_name, email, role) VALUES
('AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8', 'Nwankwo Kosiso Christopher', 'nwankwoc220@gmail.com', 'ADMIN');
