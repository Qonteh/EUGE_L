// Database Types for Eugene L Trading Mentorship

// ============================================
// APPLICANT TYPES
// ============================================
export type TradingExperience = 'beginner' | 'intermediate' | 'advanced' | 'professional'
export type InvestmentReady = 'yes' | 'no' | 'maybe'
export type ApplicantStatus = 'pending' | 'qualified' | 'disqualified' | 'booked' | 'completed' | 'no_show'

export interface Applicant {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  country?: string
  trading_experience: TradingExperience
  current_situation?: string
  trading_goals?: string
  biggest_challenge?: string
  investment_ready?: InvestmentReady
  monthly_income?: string
  available_capital?: string
  time_commitment?: string
  how_did_you_hear?: string
  status: ApplicantStatus
  qualification_score: number
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreateApplicantInput {
  first_name: string
  last_name: string
  email: string
  phone?: string
  country?: string
  trading_experience: TradingExperience
  current_situation?: string
  trading_goals?: string
  biggest_challenge?: string
  investment_ready?: InvestmentReady
  monthly_income?: string
  available_capital?: string
  time_commitment?: string
  how_did_you_hear?: string
}

// ============================================
// BOOKING TYPES
// ============================================
export type MeetingType = 'discovery_call' | 'strategy_session' | 'follow_up'
export type BookingStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'

export interface Booking {
  id: number
  applicant_id: number
  booking_date: Date
  booking_time: string
  timezone: string
  duration: number
  meeting_type: MeetingType
  meeting_link?: string
  status: BookingStatus
  reminder_sent: boolean
  reminder_sent_at?: Date
  pre_call_notes?: string
  post_call_notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreateBookingInput {
  applicant_id: number
  booking_date: string
  booking_time: string
  timezone?: string
  duration?: number
  meeting_type?: MeetingType
}

export interface BookingWithApplicant extends Booking {
  applicant: Applicant
}

// ============================================
// AVAILABILITY TYPES
// ============================================
export interface Availability {
  id: number
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string
  end_time: string
  is_active: boolean
  created_at: Date
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

// ============================================
// BLOCKED DATES TYPES
// ============================================
export interface BlockedDate {
  id: number
  blocked_date: Date
  reason?: string
  created_at: Date
}

// ============================================
// TESTIMONIAL TYPES
// ============================================
export interface Testimonial {
  id: number
  client_name: string
  client_title?: string
  client_image_url?: string
  testimonial_text: string
  rating?: number
  profit_result?: string
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: Date
}

// ============================================
// ADMIN USER TYPES
// ============================================
export type AdminRole = 'super_admin' | 'admin' | 'viewer'

export interface AdminUser {
  id: number
  email: string
  password_hash: string
  full_name?: string
  role: AdminRole
  last_login?: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ============================================
// EMAIL LOG TYPES
// ============================================
export type EmailType = 'application_received' | 'qualified' | 'disqualified' | 'booking_confirmation' | 'reminder' | 'follow_up'
export type EmailStatus = 'pending' | 'sent' | 'failed' | 'bounced'

export interface EmailLog {
  id: number
  recipient_email: string
  applicant_id?: number
  email_type: EmailType
  subject?: string
  status: EmailStatus
  error_message?: string
  sent_at: Date
}

// ============================================
// SETTINGS TYPES
// ============================================
export type SettingType = 'string' | 'number' | 'boolean' | 'json'

export interface Setting {
  id: number
  setting_key: string
  setting_value?: string
  setting_type: SettingType
  description?: string
  updated_at: Date
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
