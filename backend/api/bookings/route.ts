import { NextResponse } from "next/server"
import type { BookingData, ApiResponse } from "@/backend/types"
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getBookedSlots,
  getAvailabilitySettings,
  getBlockedDates,
} from "@/lib/db-queries"

export async function POST(request: Request) {
  try {
    const body: BookingData = await request.json()

    // Validate required fields
    if (!body.email || !body.name || !body.date || !body.time) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if slot is still available
    const bookedSlots = await getBookedSlots(body.date)
    if (bookedSlots.includes(body.time)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "This time slot is no longer available" },
        { status: 409 }
      )
    }

    // Create booking datetime
    const bookingDatetime = new Date(`${body.date}T${body.time}`)

    // Create booking in database
    const booking = await createBooking({
      application_id: body.applicationId,
      full_name: body.name,
      email: body.email,
      phone: body.phone,
      timezone: body.timezone,
      booking_date: body.date,
      booking_time: body.time,
      booking_datetime: bookingDatetime,
      duration_minutes: 30,
    })

    console.log("[v0] New booking saved to database:", {
      id: booking.id,
      email: booking.email,
      date: booking.booking_date,
      time: booking.booking_time,
    })

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: booking.id },
      message: "Booking confirmed successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const fromDate = searchParams.get("from_date") || undefined
    const toDate = searchParams.get("to_date") || undefined
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const result = await getBookings({
      status,
      from_date: fromDate,
      to_date: toDate,
      limit,
      offset,
    })

    // Transform to match frontend format
    const bookings = result.bookings.map((b) => ({
      id: b.id,
      applicationId: b.application_id,
      name: b.full_name,
      email: b.email,
      phone: b.phone,
      timezone: b.timezone,
      date: b.booking_date,
      time: b.booking_time,
      status: b.status,
      meetingLink: b.meeting_link,
      notes: b.post_call_notes,
      outcome: b.outcome,
      createdAt: b.created_at.toISOString(),
    }))

    return NextResponse.json<ApiResponse<{ bookings: typeof bookings; total: number }>>({
      success: true,
      data: { bookings, total: result.total },
    })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id || !status) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      )
    }

    const updated = await updateBookingStatus(id, status, notes)

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Booking updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
