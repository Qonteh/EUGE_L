import { query, getClient } from './db';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

// =====================================================
// APPLICATION QUERIES
// =====================================================

export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  trading_experience?: string;
  years_trading?: number;
  trading_capital?: string;
  hours_per_week?: number;
  why_join?: string;
  biggest_challenge?: string;
  form_responses: Record<string, any>;
  status: string;
  is_qualified: boolean;
  disqualification_reason?: string;
  source?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export async function createApplication(data: {
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  trading_experience?: string;
  trading_capital?: string;
  hours_per_week?: number;
  why_join?: string;
  biggest_challenge?: string;
  form_responses: Record<string, any>;
  is_qualified: boolean;
  disqualification_reason?: string;
  source?: string;
  ip_address?: string;
  user_agent?: string;
}): Promise<Application> {
  try {
    console.log('[v0] createApplication: attempting DB insert for', { email: data.email })
    const result = await query<Application>(
      `INSERT INTO applications (
        full_name, email, phone, country, timezone, trading_experience,
        trading_capital, hours_per_week, why_join, biggest_challenge,
        form_responses, is_qualified, disqualification_reason, source, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        data.full_name,
        data.email,
        data.phone,
        data.country,
        data.timezone,
        data.trading_experience,
        data.trading_capital,
        data.hours_per_week,
        data.why_join,
        data.biggest_challenge,
        JSON.stringify(data.form_responses),
        data.is_qualified,
        data.disqualification_reason,
        data.source,
        data.ip_address,
        data.user_agent,
      ]
    );
    return result.rows[0];
  } catch (error: any) {
    console.error("[v0] Error creating application in DB:", error?.message || error, error?.stack || '')
    // Fall back to JSON file storage (sync)
    try {
      mkdirSync("data", { recursive: true });
      const appsPath = "data/applications.json";
      let applications = [];
      try {
        const content = readFileSync(appsPath, "utf-8");
        applications = JSON.parse(content);
      } catch {
        applications = [];
      }

      const newApplication: any = {
        id: randomUUID(),
        ...data,
        form_responses: data.form_responses,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      applications.push(newApplication);
      writeFileSync(appsPath, JSON.stringify(applications, null, 2));
      console.log("[v0] Application saved to JSON fallback:", newApplication.id);
      return {
        ...newApplication,
        created_at: new Date(newApplication.created_at),
        updated_at: new Date(newApplication.updated_at),
      };
    } catch (fallbackError) {
      console.error("[v0] Error saving application to JSON:", fallbackError);
      throw fallbackError;
    }
  }
}

export async function getApplications(filters?: {
  status?: string;
  is_qualified?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ applications: Application[]; total: number }> {
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (filters?.status) {
    whereClause += ` AND status = $${paramIndex++}`;
    params.push(filters.status);
  }

  if (filters?.is_qualified !== undefined) {
    whereClause += ` AND is_qualified = $${paramIndex++}`;
    params.push(filters.is_qualified);
  }

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) FROM applications ${whereClause}`,
    params
  );

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const result = await query<Application>(
    `SELECT * FROM applications ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return {
    applications: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function getApplicationById(id: string): Promise<Application | null> {
  try {
    const result = await query<Application>(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("[v0] Error fetching application from DB:", error);
    // Fall back to JSON file (sync)
    try {
      mkdirSync("data", { recursive: true });
      const appsPath = "data/applications.json";
      let applications: any[] = [];
      try {
        const content = readFileSync(appsPath, "utf-8");
        applications = JSON.parse(content);
      } catch {
        applications = [];
      }

      const app = applications.find(a => a.id === id);
      if (app) {
        return {
          ...app,
          created_at: app.created_at ? new Date(app.created_at) : new Date(),
          updated_at: app.updated_at ? new Date(app.updated_at) : new Date(),
        };
      }
      return null;
    } catch (fallbackError) {
      console.error("[v0] Error reading application from JSON:", fallbackError);
      return null;
    }
  }
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  adminNotes?: string
): Promise<Application | null> {
  const result = await query<Application>(
    `UPDATE applications SET status = $1, admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *`,
    [status, adminNotes, id]
  );
  return result.rows[0] || null;
}

// =====================================================
// BOOKING QUERIES
// =====================================================

export interface Booking {
  id: string;
  application_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  timezone?: string;
  booking_date: string;
  booking_time: string;
  booking_datetime: Date;
  duration_minutes: number;
  status: string;
  meeting_type: string;
  meeting_link?: string;
  pre_call_notes?: string;
  post_call_notes?: string;
  outcome?: string;
  created_at: Date;
  updated_at: Date;
}

export async function createBooking(data: {
  application_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  timezone?: string;
  booking_date: string;
  booking_time: string;
  booking_datetime: Date | string;
  duration_minutes?: number;
  meeting_link?: string;
  pre_call_notes?: string;
}): Promise<Booking> {
  try {
    // Ensure `application_id` is a valid UUID before inserting. If it's a temporary/fallback id (e.g. "temp-..."), insert NULL.
    const isValidUUID = (id: any) => typeof id === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
    const applicationIdForDb = isValidUUID(data.application_id) ? data.application_id : null

    const result = await query<Booking>(
      `INSERT INTO bookings (
        application_id, full_name, email, phone, timezone,
        booking_date, booking_time, booking_datetime, duration_minutes, meeting_link, pre_call_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        applicationIdForDb,
        data.full_name,
        data.email,
        data.phone,
        data.timezone,
        data.booking_date,
        data.booking_time,
        data.booking_datetime,
        data.duration_minutes || 30,
        data.meeting_link,
        data.pre_call_notes,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("[v0] Error creating booking in DB:", error);
    // Fall back to JSON file storage (sync)
    try {
      mkdirSync("data", { recursive: true });
      const bookingsPath = "data/bookings.json";
      let bookings = [];
      try {
        const content = readFileSync(bookingsPath, "utf-8");
        bookings = JSON.parse(content);
      } catch {
        bookings = [];
      }

      const bookingDateTime =
        data.booking_datetime instanceof Date
          ? data.booking_datetime
          : new Date(data.booking_datetime);

      if (isNaN(bookingDateTime.getTime())) {
        throw new Error("Invalid booking datetime")
      }
      
      const newBooking: any = {
        id: randomUUID(),
        ...data,
        booking_datetime: bookingDateTime.toISOString(),
        status: "scheduled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      bookings.push(newBooking);
      writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
      console.log("[v0] Booking saved to JSON fallback:", newBooking.id);
      return {
        ...newBooking,
        booking_datetime: bookingDateTime,
        created_at: new Date(newBooking.created_at),
        updated_at: new Date(newBooking.updated_at),
      };
    } catch (fallbackError) {
      console.error("[v0] Error saving booking to JSON:", fallbackError);
      throw fallbackError;
    }
  }
}

export async function getBookings(filters?: {
  status?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}): Promise<{ bookings: Booking[]; total: number }> {
  try {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    if (filters?.from_date) {
      whereClause += ` AND booking_date >= $${paramIndex++}`;
      params.push(filters.from_date);
    }

    if (filters?.to_date) {
      whereClause += ` AND booking_date <= $${paramIndex++}`;
      params.push(filters.to_date);
    }

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM bookings ${whereClause}`,
      params
    );

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    const result = await query<Booking>(
      `SELECT * FROM bookings ${whereClause} ORDER BY booking_datetime ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, limit, offset]
    );

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    console.error("[v0] Error fetching bookings from DB:", error);
    // Fall back to JSON file (sync)
    try {
      mkdirSync("data", { recursive: true });
      const bookingsPath = "data/bookings.json";
      let allBookings: any[] = [];
      try {
        const content = readFileSync(bookingsPath, "utf-8");
        allBookings = JSON.parse(content);
      } catch {
        allBookings = [];
      }

      // Apply filters
      let filtered = allBookings;
      
      if (filters?.status) {
        filtered = filtered.filter(b => b.status === filters.status);
      }
      if (filters?.from_date) {
        filtered = filtered.filter(b => b.booking_date >= filters.from_date!);
      }
      if (filters?.to_date) {
        filtered = filtered.filter(b => b.booking_date <= filters.to_date!);
      }

      // Apply pagination
      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      const paginated = filtered.slice(offset, offset + limit);

      const normalizedBookings = paginated.map((booking) => ({
        ...booking,
        booking_datetime: booking.booking_datetime ? new Date(booking.booking_datetime) : new Date(),
        created_at: booking.created_at ? new Date(booking.created_at) : new Date(),
        updated_at: booking.updated_at ? new Date(booking.updated_at) : new Date(),
      }));

      console.log("[v0] Fetched bookings from JSON fallback:", paginated.length);
      
      return {
        bookings: normalizedBookings,
        total: filtered.length,
      };
    } catch (fallbackError) {
      console.error("[v0] Error reading bookings from JSON:", fallbackError);
      return { bookings: [], total: 0 };
    }
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const result = await query<Booking>(
    'SELECT * FROM bookings WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function updateBookingStatus(
  id: string,
  status: string,
  notes?: string
): Promise<Booking | null> {
  try {
    const result = await query<Booking>(
      `UPDATE bookings SET status = $1, post_call_notes = COALESCE($2, post_call_notes) WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("[v0] Error updating booking in DB:", error);

    try {
      mkdirSync("data", { recursive: true });
      const bookingsPath = "data/bookings.json";
      let bookings: any[] = [];

      try {
        const content = readFileSync(bookingsPath, "utf-8");
        bookings = JSON.parse(content);
      } catch {
        bookings = [];
      }

      const bookingIndex = bookings.findIndex((booking) => booking.id === id);
      if (bookingIndex === -1) {
        return null;
      }

      const updatedBooking = {
        ...bookings[bookingIndex],
        status,
        post_call_notes: notes ?? bookings[bookingIndex].post_call_notes,
        updated_at: new Date().toISOString(),
      };

      bookings[bookingIndex] = updatedBooking;
      writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

      return {
        ...updatedBooking,
        booking_datetime: updatedBooking.booking_datetime
          ? new Date(updatedBooking.booking_datetime)
          : new Date(),
        created_at: updatedBooking.created_at
          ? new Date(updatedBooking.created_at)
          : new Date(),
        updated_at: updatedBooking.updated_at
          ? new Date(updatedBooking.updated_at)
          : new Date(),
      };
    } catch (fallbackError) {
      console.error("[v0] Error updating booking in JSON fallback:", fallbackError);
      return null;
    }
  }
}

export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    const result = await query<{ booking_time: string }>(
      `SELECT booking_time FROM bookings WHERE booking_date = $1 AND status NOT IN ('cancelled', 'rescheduled')`,
      [date]
    );
    return result.rows.map((row) => row.booking_time);
  } catch (error) {
    console.error("[v0] Error fetching booked slots:", error);
    // Return empty array if DB fails (all slots available as fallback)
    return [];
  }
}

// =====================================================
// AVAILABILITY QUERIES
// =====================================================

export interface AvailabilitySettings {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_duration_minutes: number;
  buffer_minutes: number;
}

export async function getAvailabilitySettings(): Promise<AvailabilitySettings[]> {
  try {
    const result = await query<AvailabilitySettings>(
      'SELECT * FROM availability_settings ORDER BY day_of_week'
    );
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.error("[v0] Error fetching availability settings:", error);
  }

  // Default fallback: Monday-Friday 9 AM - 5 PM, 30 min slots, 15 min buffer
  const defaultSettings: AvailabilitySettings[] = [
    { id: "sun", day_of_week: 0, start_time: "09:00", end_time: "17:00", is_available: false, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "mon", day_of_week: 1, start_time: "09:00", end_time: "17:00", is_available: true, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "tue", day_of_week: 2, start_time: "09:00", end_time: "17:00", is_available: true, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "wed", day_of_week: 3, start_time: "09:00", end_time: "17:00", is_available: true, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "thu", day_of_week: 4, start_time: "09:00", end_time: "17:00", is_available: true, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "fri", day_of_week: 5, start_time: "09:00", end_time: "17:00", is_available: true, slot_duration_minutes: 30, buffer_minutes: 15 },
    { id: "sat", day_of_week: 6, start_time: "09:00", end_time: "17:00", is_available: false, slot_duration_minutes: 30, buffer_minutes: 15 },
  ];
  return defaultSettings;
}

export async function updateAvailability(
  dayOfWeek: number,
  data: Partial<AvailabilitySettings>
): Promise<AvailabilitySettings | null> {
  const result = await query<AvailabilitySettings>(
    `UPDATE availability_settings 
     SET start_time = COALESCE($1, start_time),
         end_time = COALESCE($2, end_time),
         is_available = COALESCE($3, is_available),
         slot_duration_minutes = COALESCE($4, slot_duration_minutes),
         buffer_minutes = COALESCE($5, buffer_minutes)
     WHERE day_of_week = $6
     RETURNING *`,
    [data.start_time, data.end_time, data.is_available, data.slot_duration_minutes, data.buffer_minutes, dayOfWeek]
  );
  return result.rows[0] || null;
}

export async function getBlockedDates(): Promise<{ blocked_date: string; reason?: string }[]> {
  try {
    const result = await query<{ blocked_date: string; reason?: string }>(
      'SELECT blocked_date, reason FROM blocked_dates ORDER BY blocked_date'
    );
    return result.rows;
  } catch (error) {
    console.error("[v0] Error fetching blocked dates:", error);
    // Return empty array if DB fails
    return [];
  }
}

export async function addBlockedDate(date: string, reason?: string): Promise<void> {
  await query(
    'INSERT INTO blocked_dates (blocked_date, reason) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [date, reason]
  );
}

export async function removeBlockedDate(date: string): Promise<void> {
  await query('DELETE FROM blocked_dates WHERE blocked_date = $1', [date]);
}

// =====================================================
// QUALIFICATION QUESTIONS QUERIES
// =====================================================

export interface QualificationQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  placeholder?: string;
  is_required: boolean;
  is_disqualifying: boolean;
  disqualifying_answers?: string[];
  display_order: number;
  is_active: boolean;
}

export async function getQualificationQuestions(): Promise<QualificationQuestion[]> {
  const result = await query<QualificationQuestion>(
    'SELECT * FROM qualification_questions WHERE is_active = true ORDER BY display_order'
  );
  return result.rows;
}

export async function createQuestion(data: Partial<QualificationQuestion>): Promise<QualificationQuestion> {
  const result = await query<QualificationQuestion>(
    `INSERT INTO qualification_questions (
      question_text, question_type, options, placeholder,
      is_required, is_disqualifying, disqualifying_answers, display_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      data.question_text,
      data.question_type,
      data.options ? JSON.stringify(data.options) : null,
      data.placeholder,
      data.is_required ?? true,
      data.is_disqualifying ?? false,
      data.disqualifying_answers ? JSON.stringify(data.disqualifying_answers) : null,
      data.display_order,
    ]
  );
  return result.rows[0];
}

export async function updateQuestion(
  id: string,
  data: Partial<QualificationQuestion>
): Promise<QualificationQuestion | null> {
  const result = await query<QualificationQuestion>(
    `UPDATE qualification_questions SET
      question_text = COALESCE($1, question_text),
      question_type = COALESCE($2, question_type),
      options = COALESCE($3, options),
      placeholder = COALESCE($4, placeholder),
      is_required = COALESCE($5, is_required),
      is_disqualifying = COALESCE($6, is_disqualifying),
      disqualifying_answers = COALESCE($7, disqualifying_answers),
      display_order = COALESCE($8, display_order),
      is_active = COALESCE($9, is_active)
    WHERE id = $10
    RETURNING *`,
    [
      data.question_text,
      data.question_type,
      data.options ? JSON.stringify(data.options) : null,
      data.placeholder,
      data.is_required,
      data.is_disqualifying,
      data.disqualifying_answers ? JSON.stringify(data.disqualifying_answers) : null,
      data.display_order,
      data.is_active,
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteQuestion(id: string): Promise<void> {
  await query('UPDATE qualification_questions SET is_active = false WHERE id = $1', [id]);
}

// =====================================================
// SUCCESS STORIES QUERIES
// =====================================================

export interface SuccessStory {
  id: string;
  student_name: string;
  student_image_url?: string;
  student_location?: string;
  profit_amount?: number;
  profit_percentage?: number;
  timeframe?: string;
  headline?: string;
  short_quote?: string;
  full_story?: string;
  video_url?: string;
  is_featured: boolean;
  display_order?: number;
  is_active: boolean;
}

export async function getSuccessStories(onlyFeatured = false): Promise<SuccessStory[]> {
  let whereClause = 'WHERE is_active = true';
  if (onlyFeatured) {
    whereClause += ' AND is_featured = true';
  }
  const result = await query<SuccessStory>(
    `SELECT * FROM success_stories ${whereClause} ORDER BY display_order, created_at DESC`
  );
  return result.rows;
}

export async function createSuccessStory(data: Partial<SuccessStory>): Promise<SuccessStory> {
  const result = await query<SuccessStory>(
    `INSERT INTO success_stories (
      student_name, student_image_url, student_location, profit_amount,
      profit_percentage, timeframe, headline, short_quote, full_story,
      video_url, is_featured, display_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.student_name,
      data.student_image_url,
      data.student_location,
      data.profit_amount,
      data.profit_percentage,
      data.timeframe,
      data.headline,
      data.short_quote,
      data.full_story,
      data.video_url,
      data.is_featured ?? false,
      data.display_order,
    ]
  );
  return result.rows[0];
}

export async function updateSuccessStory(
  id: string,
  data: Partial<SuccessStory>
): Promise<SuccessStory | null> {
  const result = await query<SuccessStory>(
    `UPDATE success_stories SET
      student_name = COALESCE($1, student_name),
      student_image_url = COALESCE($2, student_image_url),
      student_location = COALESCE($3, student_location),
      profit_amount = COALESCE($4, profit_amount),
      profit_percentage = COALESCE($5, profit_percentage),
      timeframe = COALESCE($6, timeframe),
      headline = COALESCE($7, headline),
      short_quote = COALESCE($8, short_quote),
      full_story = COALESCE($9, full_story),
      video_url = COALESCE($10, video_url),
      is_featured = COALESCE($11, is_featured),
      display_order = COALESCE($12, display_order),
      is_active = COALESCE($13, is_active)
    WHERE id = $14
    RETURNING *`,
    [
      data.student_name,
      data.student_image_url,
      data.student_location,
      data.profit_amount,
      data.profit_percentage,
      data.timeframe,
      data.headline,
      data.short_quote,
      data.full_story,
      data.video_url,
      data.is_featured,
      data.display_order,
      data.is_active,
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteSuccessStory(id: string): Promise<void> {
  await query('UPDATE success_stories SET is_active = false WHERE id = $1', [id]);
}

// =====================================================
// TRAINING VIDEOS QUERIES
// =====================================================

export interface TrainingVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category?: string;
  tags?: string[];
  duration_seconds?: number;
  is_free: boolean;
  access_level: string;
  display_order?: number;
  is_active: boolean;
  view_count: number;
}

export async function getTrainingVideos(category?: string, includeInactive = false): Promise<TrainingVideo[]> {
  try {
    let whereClause = includeInactive ? 'WHERE 1=1' : 'WHERE is_active = true';
    const params: any[] = [];
    if (category) {
      whereClause += ' AND category = $1';
      params.push(category);
    }
    const result = await query<TrainingVideo>(
      `SELECT * FROM training_videos ${whereClause} ORDER BY display_order, created_at DESC`,
      params
    );
    return result.rows;
  } catch (error) {
    if (process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error fetching videos:", error);
    }
    return [];
  }
}

export async function createTrainingVideo(data: Partial<TrainingVideo>): Promise<TrainingVideo> {
  try {
    const result = await query<TrainingVideo>(
      `INSERT INTO training_videos (
        title, description, video_url, thumbnail_url, category,
        tags, duration_seconds, is_free, access_level, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.title,
        data.description,
        data.video_url,
        data.thumbnail_url,
        data.category,
        data.tags ? JSON.stringify(data.tags) : null,
        data.duration_seconds,
        data.is_free ?? false,
        data.access_level ?? 'enrolled',
        data.display_order,
      ]
    );
    return result.rows[0];
  } catch (error) {
    const errorCode = error instanceof Error ? (error as Error & { code?: string }).code : undefined
    if (errorCode !== 'DB_NOT_CONFIGURED' && process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error creating video in DB:", error);
    }
    // Fall back to JSON file storage
    try {
      mkdirSync("data", { recursive: true });
      const videosPath = "data/videos.json";
      let videos: TrainingVideo[] = [];
      try {
        const content = readFileSync(videosPath, "utf-8");
        videos = JSON.parse(content);
      } catch {
        videos = [];
      }

      const newVideo: TrainingVideo = {
        id: randomUUID(),
        title: data.title || "Untitled Video",
        description: data.description,
        video_url: data.video_url || "",
        thumbnail_url: data.thumbnail_url,
        category: data.category || "training",
        tags: data.tags || [],
        duration_seconds: data.duration_seconds,
        is_free: data.is_free ?? false,
        access_level: data.access_level ?? "enrolled",
        display_order: data.display_order,
        is_active: true,
        view_count: 0,
      };

      videos.push(newVideo);
      writeFileSync(videosPath, JSON.stringify(videos, null, 2));
      console.log("[v0] Video saved to JSON fallback:", newVideo.id);
      return newVideo;
    } catch (fallbackError) {
      console.error("[v0] Error saving video to JSON:", fallbackError);
      throw fallbackError;
    }
  }
}

export async function updateTrainingVideo(
  id: string,
  data: Partial<TrainingVideo>
): Promise<TrainingVideo | null> {
  try {
    const result = await query<TrainingVideo>(
      `UPDATE training_videos SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        video_url = COALESCE($3, video_url),
        thumbnail_url = COALESCE($4, thumbnail_url),
        category = COALESCE($5, category),
        tags = COALESCE($6, tags),
        duration_seconds = COALESCE($7, duration_seconds),
        is_free = COALESCE($8, is_free),
        access_level = COALESCE($9, access_level),
        display_order = COALESCE($10, display_order),
        is_active = COALESCE($11, is_active)
      WHERE id = $12
      RETURNING *`,
      [
        data.title,
        data.description,
        data.video_url,
        data.thumbnail_url,
        data.category,
        data.tags ? JSON.stringify(data.tags) : null,
        data.duration_seconds,
        data.is_free,
        data.access_level,
        data.display_order,
        data.is_active,
        id,
      ]
    );
    return result.rows[0] || null;
  } catch (error) {
    const errorCode = error instanceof Error ? (error as Error & { code?: string }).code : undefined
    if (errorCode !== 'DB_NOT_CONFIGURED' && process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error updating video in DB:", error);
    }
    // Fall back to JSON file storage
    try {
      mkdirSync("data", { recursive: true });
      const videosPath = "data/videos.json";
      let videos: TrainingVideo[] = [];
      try {
        const content = readFileSync(videosPath, "utf-8");
        videos = JSON.parse(content);
      } catch {
        return null;
      }

      const videoIndex = videos.findIndex(v => v.id === id);
      if (videoIndex === -1) return null;

      // Update the video
      videos[videoIndex] = {
        ...videos[videoIndex],
        ...data,
      };

      writeFileSync(videosPath, JSON.stringify(videos, null, 2));
      console.log("[v0] Video updated in JSON fallback:", id);
      return videos[videoIndex];
    } catch (fallbackError) {
      console.error("[v0] Error updating video in JSON:", fallbackError);
      return null;
    }
  }
}

export async function deleteTrainingVideo(id: string): Promise<void> {
  try {
    await query('UPDATE training_videos SET is_active = false WHERE id = $1', [id]);
  } catch (error) {
    const errorCode = error instanceof Error ? (error as Error & { code?: string }).code : undefined
    if (errorCode !== 'DB_NOT_CONFIGURED' && process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error deleting video in DB:", error);
    }
    // Fall back to JSON file storage
    try {
      mkdirSync("data", { recursive: true });
      const videosPath = "data/videos.json";
      let videos: TrainingVideo[] = [];
      try {
        const content = readFileSync(videosPath, "utf-8");
        videos = JSON.parse(content);
      } catch {
        return;
      }

      const videoIndex = videos.findIndex(v => v.id === id);
      if (videoIndex !== -1) {
        videos[videoIndex].is_active = false;
        writeFileSync(videosPath, JSON.stringify(videos, null, 2));
        console.log("[v0] Video deleted in JSON fallback:", id);
      }
    } catch (fallbackError) {
      console.error("[v0] Error deleting video in JSON:", fallbackError);
    }
  }
}

export async function incrementVideoViewCount(id: string): Promise<void> {
  try {
    await query('UPDATE training_videos SET view_count = view_count + 1 WHERE id = $1', [id]);
  } catch (error) {
    const errorCode = error instanceof Error ? (error as Error & { code?: string }).code : undefined
    if (errorCode !== 'DB_NOT_CONFIGURED' && process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error incrementing video view count in DB:", error);
    }
    // Fall back to JSON file storage
    try {
      mkdirSync("data", { recursive: true });
      const videosPath = "data/videos.json";
      let videos: TrainingVideo[] = [];
      try {
        const content = readFileSync(videosPath, "utf-8");
        videos = JSON.parse(content);
      } catch {
        return;
      }

      const videoIndex = videos.findIndex(v => v.id === id);
      if (videoIndex !== -1) {
        videos[videoIndex].view_count = (videos[videoIndex].view_count || 0) + 1;
        writeFileSync(videosPath, JSON.stringify(videos, null, 2));
      }
    } catch (fallbackError) {
      console.error("[v0] Error incrementing view count in JSON:", fallbackError);
    }
  }
}

// =====================================================
// SITE SETTINGS QUERIES
// =====================================================

export async function getSetting(key: string): Promise<string | null> {
  const result = await query<{ setting_value: string }>(
    'SELECT setting_value FROM site_settings WHERE setting_key = $1',
    [key]
  );
  return result.rows[0]?.setting_value || null;
}

export async function getSettings(keys?: string[]): Promise<Record<string, string>> {
  try {
    let sql = 'SELECT setting_key, setting_value FROM site_settings';
    const params: any[] = [];
    if (keys && keys.length > 0) {
      sql += ' WHERE setting_key = ANY($1)';
      params.push(keys);
    }
    const result = await query<{ setting_key: string; setting_value: string }>(sql, params);
    return result.rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('[db-queries] Error fetching settings from database, using JSON fallback:', error);
    try {
      const fileData = readFileSync('data/site_settings.json', 'utf-8');
      const jsonData = JSON.parse(fileData);
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(jsonData)) {
        result[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
      return result;
    } catch (fileError) {
      console.error('[db-queries] Error reading site_settings.json fallback:', fileError);
      return {};
    }
  }
}

export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    await query(
      `INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2`,
      [key, value]
    );
  } catch (error) {
    console.error('[db-queries] Error updating setting in database, using JSON fallback:', error);
    try {
      let fileData: any = {};
      try {
        const file = readFileSync('data/site_settings.json', 'utf-8');
        fileData = JSON.parse(file);
      } catch {
        // File doesn't exist yet, start with empty object
      }
      
      // Parse the value back to its original type if it's JSON
      let parsedValue: any = value;
      try {
        if (value.startsWith('[') || value.startsWith('{')) {
          parsedValue = JSON.parse(value);
        }
      } catch {
        // Keep as string if not JSON
      }
      
      fileData[key] = parsedValue;
      
      try {
        mkdirSync('data', { recursive: true });
      } catch {
        // Directory might already exist
      }
      
      writeFileSync('data/site_settings.json', JSON.stringify(fileData, null, 2), 'utf-8');
    } catch (fileError) {
      console.error('[db-queries] Error updating site_settings.json fallback:', fileError);
      throw new Error('Failed to update setting in both database and fallback');
    }
  }
}

// =====================================================
// ANALYTICS QUERIES
// =====================================================

export async function trackEvent(data: {
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
  referrer?: string;
  session_id?: string;
  visitor_id?: string;
  ip_address?: string;
  user_agent?: string;
}): Promise<void> {
  await query(
    `INSERT INTO analytics_events (
      event_type, event_data, page_url, referrer, session_id, visitor_id, ip_address, user_agent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      data.event_type,
      data.event_data ? JSON.stringify(data.event_data) : null,
      data.page_url,
      data.referrer,
      data.session_id,
      data.visitor_id,
      data.ip_address,
      data.user_agent,
    ]
  );
}

export async function getAnalyticsSummary(days = 30): Promise<{
  total_page_views: number;
  total_form_starts: number;
  total_form_completions: number;
  total_bookings: number;
  conversion_rate: number;
}> {
  const result = await query<{
    event_type: string;
    count: string;
  }>(
    `SELECT event_type, COUNT(*) as count 
     FROM analytics_events 
     WHERE created_at >= NOW() - INTERVAL '${days} days'
     AND event_type IN ('page_view', 'form_start', 'form_complete', 'booking_complete')
     GROUP BY event_type`
  );

  const counts = result.rows.reduce((acc, row) => {
    acc[row.event_type] = parseInt(row.count);
    return acc;
  }, {} as Record<string, number>);

  const formStarts = counts['form_start'] || 0;
  const formCompletions = counts['form_complete'] || 0;

  return {
    total_page_views: counts['page_view'] || 0,
    total_form_starts: formStarts,
    total_form_completions: formCompletions,
    total_bookings: counts['booking_complete'] || 0,
    conversion_rate: formStarts > 0 ? (formCompletions / formStarts) * 100 : 0,
  };
}

// =====================================================
// ADMIN USER QUERIES
// =====================================================

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  try {
    const result = await query<AdminUser>(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
    // If DB query succeeded but returned no rows, try JSON fallback
  } catch (err) {
    // Fallback to JSON file when DB is not configured
  }

  // Try JSON fallback
  try {
    mkdirSync("data", { recursive: true });
    const path = "data/admin_users.json";
    let admins: any[] = [];
    try {
      const content = readFileSync(path, 'utf-8');
      admins = JSON.parse(content);
    } catch {
      admins = [];
    }
    const found = admins.find(a => String(a.email).toLowerCase() === String(email).toLowerCase() && a.is_active !== false);
    if (!found) return null;
    return {
      id: found.id,
      email: found.email,
      password_hash: found.password_hash,
      name: found.name || found.email.split('@')[0],
      role: found.role || 'admin',
      is_active: found.is_active !== false,
      last_login: found.last_login ? new Date(found.last_login) : undefined,
      created_at: found.created_at ? new Date(found.created_at) : new Date(),
    };
  } catch (fallbackErr) {
    return null;
  }
}

export async function createAdminUser(data: {
  email: string;
  password_hash: string;
  name: string;
  role?: string;
}): Promise<AdminUser> {
  try {
    const result = await query<AdminUser>(
      `INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.email, data.password_hash, data.name, data.role || 'admin']
    );
    return result.rows[0];
  } catch (err) {
    // Fallback to JSON file when DB not configured
    try {
      mkdirSync("data", { recursive: true });
      const path = "data/admin_users.json";
      let admins: any[] = [];
      try {
        const content = readFileSync(path, 'utf-8');
        admins = JSON.parse(content);
      } catch {
        admins = [];
      }
      const newAdmin = {
        id: randomUUID(),
        email: data.email,
        password_hash: data.password_hash,
        name: data.name || data.email.split('@')[0],
        role: data.role || 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      admins.push(newAdmin);
      writeFileSync(path, JSON.stringify(admins, null, 2));
      return {
        id: newAdmin.id,
        email: newAdmin.email,
        password_hash: newAdmin.password_hash,
        name: newAdmin.name,
        role: newAdmin.role,
        is_active: true,
        created_at: new Date(newAdmin.created_at),
      };
    } catch (fallbackErr) {
      throw fallbackErr;
    }
  }
}

export async function updateAdminLastLogin(id: string): Promise<void> {
  try {
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [id]);
  } catch (err) {
    try {
      mkdirSync("data", { recursive: true });
      const path = "data/admin_users.json";
      let admins: any[] = [];
      try {
        const content = readFileSync(path, 'utf-8');
        admins = JSON.parse(content);
      } catch {
        admins = [];
      }
      const idx = admins.findIndex(a => a.id === id);
      if (idx === -1) return;
      admins[idx].last_login = new Date().toISOString();
      writeFileSync(path, JSON.stringify(admins, null, 2));
    } catch (fallbackErr) {
      // ignore
    }
  }
}

function syncAdminJsonUpdates(id: string, updates: { email?: string; password_hash?: string }): void {
  mkdirSync("data", { recursive: true });
  const path = "data/admin_users.json";
  let admins: any[] = [];
  try {
    const content = readFileSync(path, 'utf-8');
    admins = JSON.parse(content);
  } catch {
    admins = [];
  }

  const idx = admins.findIndex(a => a.id === id);
  if (idx === -1) return;

  if (updates.email !== undefined) admins[idx].email = updates.email;
  if (updates.password_hash !== undefined) admins[idx].password_hash = updates.password_hash;

  writeFileSync(path, JSON.stringify(admins, null, 2));
}

export async function updateAdmin(id: string, updates: { email?: string; password_hash?: string }): Promise<void> {
  try {
    const sets: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (updates.email !== undefined) {
      sets.push(`email = $${idx}`);
      params.push(updates.email);
      idx++;
    }
    if (updates.password_hash !== undefined) {
      sets.push(`password_hash = $${idx}`);
      params.push(updates.password_hash);
      idx++;
    }

    if (sets.length === 0) return;

    const sql = `UPDATE admin_users SET ${sets.join(', ')} WHERE id = $${idx}`;
    params.push(id);

    await query(sql, params);

    // Keep JSON fallback in sync so credentials remain consistent if DB is unavailable later.
    try {
      syncAdminJsonUpdates(id, updates);
    } catch {
      // Best-effort only.
    }
  } catch (err) {
    // Fallback to JSON file when DB not configured
    try {
      syncAdminJsonUpdates(id, updates);
    } catch (fallbackErr) {
      throw fallbackErr;
    }
  }
}

// =====================================================
// ACTIVITY LOG QUERIES
// =====================================================

export async function logActivity(data: {
  admin_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
}): Promise<void> {
  await query(
    `INSERT INTO activity_log (admin_id, action, entity_type, entity_id, details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      data.admin_id,
      data.action,
      data.entity_type,
      data.entity_id,
      data.details ? JSON.stringify(data.details) : null,
      data.ip_address,
    ]
  );
}

export async function getActivityLog(limit = 100): Promise<any[]> {
  const result = await query(
    `SELECT al.*, au.name as admin_name 
     FROM activity_log al 
     LEFT JOIN admin_users au ON al.admin_id = au.id 
     ORDER BY al.created_at DESC 
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}
