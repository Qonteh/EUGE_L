-- EUGENE L TRADING MENTORSHIP - DATABASE SCHEMA
-- PostgreSQL Database Schema
-- Run this file to create all tables for the website

-- ============================================
-- 1. APPLICANTS TABLE
-- Stores all application form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    
    -- Trading Experience
    trading_experience VARCHAR(50) NOT NULL,
    -- Values: 'beginner', 'intermediate', 'advanced', 'professional'
    
    current_situation TEXT,
    -- What is your current trading situation?
    
    trading_goals TEXT,
    -- What are your trading goals?
    
    biggest_challenge TEXT,
    -- What is your biggest challenge in trading?
    
    investment_ready VARCHAR(50),
    -- Are you ready to invest in your trading education?
    -- Values: 'yes', 'no', 'maybe'
    
    monthly_income VARCHAR(50),
    -- Monthly income range
    
    available_capital VARCHAR(50),
    -- Trading capital available
    
    time_commitment VARCHAR(50),
    -- Hours per week available for trading
    
    how_did_you_hear VARCHAR(100),
    -- How did you hear about us?
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'pending',
    -- Values: 'pending', 'qualified', 'disqualified', 'booked', 'completed', 'no_show'
    
    qualification_score INTEGER DEFAULT 0,
    -- Score based on answers (used to qualify/disqualify)
    
    notes TEXT,
    -- Admin notes about the applicant
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. BOOKINGS TABLE
-- Stores all consultation call bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    
    -- Link to applicant
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    
    -- Booking Details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    timezone VARCHAR(100) DEFAULT 'UTC',
    
    -- Duration in minutes
    duration INTEGER DEFAULT 30,
    
    -- Meeting Details
    meeting_type VARCHAR(50) DEFAULT 'discovery_call',
    -- Values: 'discovery_call', 'strategy_session', 'follow_up'
    
    meeting_link VARCHAR(500),
    -- Zoom/Google Meet link
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled',
    -- Values: 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'
    
    -- Reminders
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    pre_call_notes TEXT,
    post_call_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. AVAILABILITY TABLE
-- Stores available time slots for bookings
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    
    -- Day of week (0 = Sunday, 1 = Monday, etc.)
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    
    -- Time slots
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Is this slot active?
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. BLOCKED_DATES TABLE
-- Stores dates when bookings are not available
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_dates (
    id SERIAL PRIMARY KEY,
    
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. TESTIMONIALS TABLE
-- Stores success stories and testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    
    -- Client Info
    client_name VARCHAR(200) NOT NULL,
    client_title VARCHAR(200),
    client_image_url VARCHAR(500),
    
    -- Testimonial Content
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Results/Stats
    profit_result VARCHAR(100),
    -- e.g., "+$50,000 in 3 months"
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. ADMIN_USERS TABLE
-- Stores admin login credentials
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) DEFAULT 'admin',
    -- Values: 'super_admin', 'admin', 'viewer'
    
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. EMAIL_LOGS TABLE
-- Tracks all emails sent
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    
    -- Recipient
    recipient_email VARCHAR(255) NOT NULL,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE SET NULL,
    
    -- Email Details
    email_type VARCHAR(100) NOT NULL,
    -- Values: 'application_received', 'qualified', 'disqualified', 'booking_confirmation', 'reminder', 'follow_up'
    
    subject VARCHAR(500),
    
    -- Status
    status VARCHAR(50) DEFAULT 'sent',
    -- Values: 'pending', 'sent', 'failed', 'bounced'
    
    error_message TEXT,
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. SETTINGS TABLE
-- Stores website configuration
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    -- Values: 'string', 'number', 'boolean', 'json'
    
    description VARCHAR(500),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_applicant_id ON bookings(applicant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_email_logs_applicant ON email_logs(applicant_id);

-- ============================================
-- INSERT DEFAULT AVAILABILITY
-- Monday to Friday, 9 AM to 5 PM
-- ============================================
INSERT INTO availability (day_of_week, start_time, end_time, is_active) VALUES
(1, '09:00', '17:00', TRUE),  -- Monday
(2, '09:00', '17:00', TRUE),  -- Tuesday
(3, '09:00', '17:00', TRUE),  -- Wednesday
(4, '09:00', '17:00', TRUE),  -- Thursday
(5, '09:00', '17:00', TRUE)   -- Friday
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Eugene L Trading Mentorship', 'string', 'Website name'),
('booking_duration', '30', 'number', 'Default booking duration in minutes'),
('timezone', 'UTC', 'string', 'Default timezone'),
('qualification_threshold', '60', 'number', 'Minimum score to qualify (out of 100)'),
('max_bookings_per_day', '8', 'number', 'Maximum bookings per day'),
('reminder_hours_before', '24', 'number', 'Hours before to send reminder email')
ON CONFLICT (setting_key) DO NOTHING;
