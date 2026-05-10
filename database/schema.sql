-- =====================================================
-- EUGE_L Trading Mentorship Platform - Complete Database Schema
-- PostgreSQL Database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ADMIN USERS TABLE
-- For admin dashboard authentication
-- =====================================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. QUALIFICATION QUESTIONS TABLE
-- Dynamic questions for the qualification form
-- =====================================================
CREATE TABLE qualification_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('text', 'select', 'multi-select', 'number', 'email', 'phone', 'textarea')),
    options JSONB, -- For select/multi-select: ["Option 1", "Option 2"]
    placeholder VARCHAR(255),
    is_required BOOLEAN DEFAULT true,
    is_disqualifying BOOLEAN DEFAULT false,
    disqualifying_answers JSONB, -- Answers that disqualify: ["No", "Less than $1000"]
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. APPLICATIONS TABLE
-- Stores all qualification form submissions
-- =====================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    timezone VARCHAR(100),
    
    -- Trading Experience
    trading_experience VARCHAR(100), -- e.g., "beginner", "intermediate", "advanced"
    years_trading INTEGER,
    current_strategy TEXT,
    trading_capital VARCHAR(100), -- e.g., "$1,000 - $5,000"
    monthly_goal VARCHAR(100),
    
    -- Availability & Commitment
    hours_per_week INTEGER,
    preferred_schedule VARCHAR(255),
    start_date DATE,
    
    -- Goals & Motivation
    why_join TEXT,
    biggest_challenge TEXT,
    expectations TEXT,
    
    -- All form answers stored as JSON for flexibility
    form_responses JSONB NOT NULL,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'disqualified', 'contacted', 'booked', 'enrolled', 'rejected')),
    is_qualified BOOLEAN DEFAULT true,
    disqualification_reason TEXT,
    
    -- Tracking
    source VARCHAR(100), -- Where they came from (utm_source)
    utm_campaign VARCHAR(100),
    utm_medium VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Admin Notes
    admin_notes TEXT,
    reviewed_by UUID REFERENCES admin_users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. BOOKINGS TABLE
-- Calendar booking appointments
-- =====================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    
    -- Contact Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    timezone VARCHAR(100),
    
    -- Booking Details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    booking_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    
    -- Meeting Details
    meeting_type VARCHAR(50) DEFAULT 'discovery_call',
    meeting_link VARCHAR(500),
    calendar_event_id VARCHAR(255), -- External calendar integration ID
    
    -- Notes
    pre_call_notes TEXT,
    post_call_notes TEXT,
    outcome VARCHAR(100), -- e.g., "enrolled", "follow_up", "not_interested"
    
    -- Reminders
    reminder_sent_24h BOOLEAN DEFAULT false,
    reminder_sent_1h BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. AVAILABILITY SETTINGS TABLE
-- Admin's available time slots for bookings
-- =====================================================
CREATE TABLE availability_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    slot_duration_minutes INTEGER DEFAULT 30,
    buffer_minutes INTEGER DEFAULT 15, -- Time between appointments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(day_of_week)
);

-- =====================================================
-- 6. BLOCKED DATES TABLE
-- Specific dates when bookings are not available
-- =====================================================
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. SUCCESS STORIES / TESTIMONIALS TABLE
-- Student success stories displayed on landing page
-- =====================================================
CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    student_image_url VARCHAR(500),
    student_location VARCHAR(100),
    
    -- Results
    profit_amount DECIMAL(12, 2),
    profit_percentage DECIMAL(5, 2),
    timeframe VARCHAR(100), -- e.g., "3 months", "First week"
    
    -- Testimonial Content
    headline VARCHAR(255),
    short_quote TEXT,
    full_story TEXT,
    video_url VARCHAR(500),
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TRAINING VIDEOS TABLE
-- Video content for the platform
-- =====================================================
CREATE TABLE training_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    
    -- Categorization
    category VARCHAR(100), -- e.g., "fundamentals", "advanced", "psychology"
    tags JSONB, -- ["forex", "risk management"]
    
    -- Video Details
    duration_seconds INTEGER,
    
    -- Access Control
    is_free BOOLEAN DEFAULT false,
    access_level VARCHAR(50) DEFAULT 'enrolled' CHECK (access_level IN ('public', 'qualified', 'enrolled', 'premium')),
    
    -- Display
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SITE SETTINGS TABLE
-- Global configuration settings
-- =====================================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. LANDING PAGE CONTENT TABLE
-- Editable content for the landing page
-- =====================================================
CREATE TABLE landing_page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name VARCHAR(100) UNIQUE NOT NULL, -- e.g., "hero", "about", "cta"
    content JSONB NOT NULL, -- Flexible JSON for section content
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. EMAIL TEMPLATES TABLE
-- Email templates for automated communications
-- =====================================================
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables JSONB, -- Available variables: ["{{name}}", "{{date}}"]
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. ACTIVITY LOG TABLE
-- Audit trail for admin actions
-- =====================================================
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100), -- e.g., "application", "booking", "video"
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. ANALYTICS EVENTS TABLE
-- Track user interactions
-- =====================================================
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- e.g., "page_view", "form_start", "form_complete"
    event_data JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    session_id VARCHAR(255),
    visitor_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Applications
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_is_qualified ON applications(is_qualified);

-- Bookings
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_datetime ON bookings(booking_datetime);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_application_id ON bookings(application_id);

-- Success Stories
CREATE INDEX idx_success_stories_active ON success_stories(is_active, display_order);
CREATE INDEX idx_success_stories_featured ON success_stories(is_featured) WHERE is_featured = true;

-- Training Videos
CREATE INDEX idx_training_videos_active ON training_videos(is_active, display_order);
CREATE INDEX idx_training_videos_category ON training_videos(category);

-- Analytics
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- Activity Log
CREATE INDEX idx_activity_log_admin ON activity_log(admin_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- =====================================================
-- INITIAL DATA - DEFAULT SETTINGS
-- =====================================================

-- Default availability (Monday - Friday, 9 AM - 5 PM)
INSERT INTO availability_settings (day_of_week, start_time, end_time, is_available) VALUES
(0, '09:00', '17:00', false), -- Sunday
(1, '09:00', '17:00', true),  -- Monday
(2, '09:00', '17:00', true),  -- Tuesday
(3, '09:00', '17:00', true),  -- Wednesday
(4, '09:00', '17:00', true),  -- Thursday
(5, '09:00', '17:00', true),  -- Friday
(6, '09:00', '17:00', false); -- Saturday

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'EUGE Trading Academy', 'string', 'Website name'),
('site_tagline', 'Master the Markets with Proven Strategies', 'string', 'Website tagline'),
('contact_email', 'contact@example.com', 'string', 'Primary contact email'),
('booking_duration', '30', 'number', 'Default booking duration in minutes'),
('booking_buffer', '15', 'number', 'Buffer time between bookings in minutes'),
('max_bookings_per_day', '8', 'number', 'Maximum bookings per day'),
('timezone', 'America/New_York', 'string', 'Default timezone'),
('disqualification_message', 'Thank you for your interest. Unfortunately, our program may not be the right fit at this time.', 'string', 'Message shown when applicant is disqualified'),
('qualification_success_message', 'Congratulations! You qualify for our mentorship program. Book your free strategy call below.', 'string', 'Message shown when applicant qualifies');

-- Qualification questions are intentionally left empty.
-- Admin users add and manage them from the dashboard.

-- Default email templates
INSERT INTO email_templates (template_name, subject, body_html, body_text, variables) VALUES
('booking_confirmation', 'Your Strategy Call is Confirmed - {{booking_date}}', 
'<h1>Your call is confirmed!</h1><p>Hi {{name}},</p><p>Your strategy call has been scheduled for {{booking_date}} at {{booking_time}}.</p><p>Meeting Link: {{meeting_link}}</p>', 
'Your call is confirmed! Hi {{name}}, Your strategy call has been scheduled for {{booking_date}} at {{booking_time}}.', 
'["{{name}}", "{{booking_date}}", "{{booking_time}}", "{{meeting_link}}"]'),

('booking_reminder_24h', 'Reminder: Your Strategy Call is Tomorrow', 
'<h1>See you tomorrow!</h1><p>Hi {{name}},</p><p>This is a reminder that your strategy call is scheduled for tomorrow at {{booking_time}}.</p>', 
'See you tomorrow! Hi {{name}}, This is a reminder that your strategy call is scheduled for tomorrow at {{booking_time}}.', 
'["{{name}}", "{{booking_time}}", "{{meeting_link}}"]'),

('application_received', 'We Received Your Application!', 
'<h1>Application Received</h1><p>Hi {{name}},</p><p>Thank you for applying to our mentorship program. We will review your application and get back to you shortly.</p>', 
'Application Received. Hi {{name}}, Thank you for applying to our mentorship program. We will review your application and get back to you shortly.', 
'["{{name}}"]');

-- Sample success stories
INSERT INTO success_stories (student_name, student_location, profit_amount, profit_percentage, timeframe, headline, short_quote, is_featured, display_order, is_active) VALUES
('Michael R.', 'New York, USA', 15000.00, 45.00, '3 months', 'From Losing Trader to Consistent Profits', 'The strategies I learned completely transformed my trading. I went from losing money every month to consistent profits.', true, 1, true),
('Sarah K.', 'London, UK', 8500.00, 32.00, '2 months', 'Finally Found a System That Works', 'After trying countless courses, this mentorship finally gave me a proven system I can rely on.', true, 2, true),
('David L.', 'Toronto, Canada', 22000.00, 55.00, '4 months', 'Quit My Job to Trade Full-Time', 'The mentorship gave me the confidence and skills to become a full-time trader.', true, 3, true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qualification_questions_updated_at BEFORE UPDATE ON qualification_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_settings_updated_at BEFORE UPDATE ON availability_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_success_stories_updated_at BEFORE UPDATE ON success_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_videos_updated_at BEFORE UPDATE ON training_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_page_content_updated_at BEFORE UPDATE ON landing_page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
