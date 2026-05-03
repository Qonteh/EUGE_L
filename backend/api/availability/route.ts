import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"

interface TimeSlot {
  time: string
  available: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

// Default available time slots
const defaultSlots = [
  "00:00", "01:00", "02:00", "03:00",
  "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00",
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") // Format: YYYY-MM
    const timezone = searchParams.get("timezone") || "EAT"

    if (!month) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Month parameter is required" },
        { status: 400 }
      )
    }

    // Parse the month
    const [year, monthNum] = month.split("-").map(Number)
    const daysInMonth = new Date(year, monthNum, 0).getDate()

    // Generate availability for each day
    const availability: DayAvailability[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day)
      const dayOfWeek = date.getDay()

      // Skip weekends and past dates
      if (dayOfWeek === 0 || dayOfWeek === 6 || date < today) {
        continue
      }

      // Generate slots for this day
      // In production, check against existing bookings
      const slots: TimeSlot[] = defaultSlots.map((time) => ({
        time,
        available: Math.random() > 0.3, // Simulate some slots being taken
      }))

      availability.push({
        date: date.toISOString().split("T")[0],
        slots,
      })
    }

    return NextResponse.json<ApiResponse<{ availability: DayAvailability[]; timezone: string }>>({
      success: true,
      data: { availability, timezone },
    })
  } catch (error) {
    console.error("[v0] Error fetching availability:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}
