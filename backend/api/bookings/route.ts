import { NextResponse } from "next/server"
import type { BookingData, ApiResponse } from "@/backend/types"

// In-memory storage for demo purposes
// In production, connect this to Supabase or another database
const bookings: (BookingData & { id: string })[] = []

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

    // Create booking record
    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
    }

    bookings.push(booking)

    // Log for demo purposes
    console.log("[v0] New booking created:", {
      id: booking.id,
      email: booking.email,
      date: booking.date,
      time: booking.time,
    })

    // In production, send confirmation email here
    // await sendConfirmationEmail(booking)

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

export async function GET() {
  try {
    // Return all bookings (in production, add authentication)
    return NextResponse.json<ApiResponse<typeof bookings>>({
      success: true,
      data: bookings,
    })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
