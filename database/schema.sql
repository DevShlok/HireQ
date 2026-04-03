-- MySQL Conversion of the provided schema

CREATE DATABASE IF NOT EXISTS hireq_db;
USE hireq_db;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_description TEXT NOT NULL,
    interview_code VARCHAR(6) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Interview sessions table (enhanced with recording fields)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    interview_id CHAR(36) NOT NULL,
    candidate_name VARCHAR(255),
    candidate_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    recording_enabled BOOLEAN DEFAULT TRUE,
    total_duration INT,
    violation_count INT DEFAULT 0,
    camera_permission_granted BOOLEAN DEFAULT FALSE,
    microphone_permission_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    question_order INT NOT NULL,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question_id CHAR(36) NOT NULL,
    answer_text TEXT,
    transcript TEXT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Behavioral analytics table
CREATE TABLE IF NOT EXISTS behavioral_analytics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emotion_score JSON,
    posture_score JSON,
    gaze_data JSON,
    speech_data JSON,
    filler_count INT DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    overall_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    confidence_score DECIMAL(5,2),
    report_data JSON,
    pdf_path VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- NEW: Recording clips table (stores metadata for 15-second video clips)
CREATE TABLE IF NOT EXISTS recording_clips (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    clip_number INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    duration INT DEFAULT 15, -- in seconds
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mime_type VARCHAR(100) DEFAULT 'video/webm',
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- NEW: Security violations table (tracks tab switching, camera issues, etc.)
CREATE TABLE IF NOT EXISTS security_violations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    violation_type VARCHAR(100) NOT NULL, -- 'tab_switch', 'camera_off', 'fullscreen_exit'
    violation_message TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- NEW: Interview recording metadata table (overall recording session info)
CREATE TABLE IF NOT EXISTS recording_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    total_clips INT DEFAULT 0,
    total_violations INT DEFAULT 0,
    recording_started_at TIMESTAMP NULL,
    recording_ended_at TIMESTAMP NULL,
    camera_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'error'
    microphone_status VARCHAR(50) DEFAULT 'active',
    stream_quality JSON, -- store video/audio quality metrics
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_interviews_company_id ON interviews(company_id);
CREATE INDEX idx_interviews_code ON interviews(interview_code);
CREATE INDEX idx_sessions_interview_id ON interview_sessions(interview_id);
CREATE INDEX idx_sessions_recording_enabled ON interview_sessions(recording_enabled);
CREATE INDEX idx_questions_session_id ON questions(session_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_analytics_session_id ON behavioral_analytics(session_id);
CREATE INDEX idx_reports_session_id ON reports(session_id);

-- Create indexes for recording system
CREATE INDEX idx_recording_clips_session_id ON recording_clips(session_id);
CREATE INDEX idx_recording_clips_recorded_at ON recording_clips(recorded_at);
CREATE INDEX idx_security_violations_session_id ON security_violations(session_id);
CREATE INDEX idx_security_violations_type ON security_violations(violation_type);
CREATE INDEX idx_recording_sessions_session_id ON recording_sessions(session_id);

-- Views

-- View: Interview sessions with recording statistics
CREATE OR REPLACE VIEW interview_sessions_with_stats AS
SELECT 
    s.*, 
    i.title as interview_title, 
    i.interview_code, 
    c.name as company_name,
    COALESCE(rc.clip_count, 0) as total_clips,
    COALESCE(sv.violation_count, 0) as total_violations,
    CASE 
        WHEN s.ended_at IS NOT NULL THEN TIMESTAMPDIFF(SECOND, s.started_at, s.ended_at)
        ELSE s.total_duration 
    END as session_duration_seconds
FROM interview_sessions s
JOIN interviews i ON s.interview_id = i.id
JOIN companies c ON i.company_id = c.id
LEFT JOIN (
    SELECT session_id, COUNT(*) as clip_count 
    FROM recording_clips 
    GROUP BY session_id
) rc ON s.id = rc.session_id
LEFT JOIN (
    SELECT session_id, COUNT(*) as violation_count 
    FROM security_violations 
    GROUP BY session_id
) sv ON s.id = sv.session_id;

-- View: Company interview overview
CREATE OR REPLACE VIEW company_interview_overview AS
SELECT 
    c.id as company_id, 
    c.name as company_name, 
    i.id as interview_id, 
    i.title, 
    i.interview_code, 
    i.status as interview_status,
    COUNT(s.id) as total_sessions,
    SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
    COUNT(rc.id) as total_clips_recorded,
    AVG(CASE WHEN s.ended_at IS NOT NULL 
             THEN TIMESTAMPDIFF(SECOND, s.started_at, s.ended_at) 
        END) as avg_session_duration
FROM companies c
JOIN interviews i ON c.id = i.company_id
LEFT JOIN interview_sessions s ON i.id = s.interview_id
LEFT JOIN recording_clips rc ON s.id = rc.session_id
GROUP BY c.id, c.name, i.id, i.title, i.interview_code, i.status;
