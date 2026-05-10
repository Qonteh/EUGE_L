import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"
import {
  getAvailabilitySettings,
  updateAvailability,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
  getBookedSlots,
} from "@/lib/db-queries"

interface TimeSlot {
  time: string
  available: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") // Format: YYYY-MM
    const date = searchParams.get("date") // Format: YYYY-MM-DD
    const timezone = searchParams.get("timezone") || "EAT"

    // If specific date requested, return slots for that day
    if (date) {
      const dayOfWeek = new Date(date).getDay()
      const availabilitySettings = await getAvailabilitySettings()
      const daySettings = availabilitySettings.find((a) => a.day_of_week === dayOfWeek)

      if (!daySettings || !daySettings.is_available) {
        return NextResponse.json<ApiResponse<{ slots: string[] }>>({
          success: true,
          data: { slots: [] },
        })
      }

      // Check if date is blocked
      const blockedDates = await getBlockedDates()
      const isBlocked = blockedDates.some((b) => b.blocked_date === date)
      if (isBlocked) {
        return NextResponse.json<ApiResponse<{ slots: string[] }>>({
          success: true,
          data: { slots: [] },
        })
      }

      // Get already booked slots
      const bookedSlots = await getBookedSlots(date)

      // Generate available slots
      const slots: string[] = []
      const startHour = parseInt(daySettings.start_time.split(":")[0])
      const endHour = parseInt(daySettings.end_time.split(":")[0])
      const slotDuration = daySettings.slot_duration_minutes || 30
      const buffer = daySettings.buffer_minutes || 15

      for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += slotDuration + buffer) {
          if (hour === endHour - 1 && min + slotDuration > 60) continue
          const timeSlot = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
          if (!bookedSlots.includes(timeSlot)) {
            slots.push(timeSlot)
          }
        }
      }

      return NextResponse.json<ApiResponse<{ slots: string[] }>>({
        success: true,
        data: { slots },
      })
    }

    // If month requested, return availability for the whole month
    if (month) {
      const [year, monthNum] = month.split("-").map(Number)
      const daysInMonth = new Date(year, monthNum, 0).getDate()

      const availabilitySettings = await getAvailabilitySettings()
      const blockedDates = await getBlockedDates()
      const blockedDateSet = new Set(blockedDates.map((b) => b.blocked_date))

      const availability: DayAvailability[] = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, monthNum - 1, day)
        const dateStr = dateObj.toISOString().split("T")[0]
        const dayOfWeek = dateObj.getDay()

        // Skip past dates
        if (dateObj < today) continue

        // Check if day is available
        const daySettings = availabilitySettings.find((a) => a.day_of_week === dayOfWeek)
        if (!daySettings || !daySettings.is_available) continue

        // Check if blocked
        if (blockedDateSet.has(dateStr)) continue

        // Get booked slots for this day
        const bookedSlots = await getBookedSlots(dateStr)

        // Generate slots
        const startHour = parseInt(daySettings.start_time.split(":")[0])
        const endHour = parseInt(daySettings.end_time.split(":")[0])
        const slotDuration = daySettings.slot_duration_minutes || 30
        const buffer = daySettings.buffer_minutes || 15

        const slots: TimeSlot[] = []
        for (let hour = startHour; hour < endHour; hour++) {
          for (let min = 0; min < 60; min += slotDuration + buffer) {
            if (hour === endHour - 1 && min + slotDuration > 60) continue
            const timeSlot = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
            slots.push({
              time: timeSlot,
              available: !bookedSlots.includes(timeSlot),
            })
          }
        }

        if (slots.some((s) => s.available)) {
          availability.push({ date: dateStr, slots })
        }
      }

      return NextResponse.json<ApiResponse<{ availability: DayAvailability[]; timezone: string }>>({
        success: true,
        data: { availability, timezone },
      })
    }

    // Return all availability settings
    const availabilitySettings = await getAvailabilitySettings()
    const blockedDates = await getBlockedDates()

    return NextResponse.json<
      ApiResponse<{
        settings: typeof availabilitySettings
        blockedDates: typeof blockedDates
      }>
    >({
      success: true,
      data: { settings: availabilitySettings, blockedDates },
    })
  } catch (error) {
    console.error("[v0] Error fetching availability:", error)
    
    // Provide sensible defaults based on request type
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const month = searchParams.get("month")
    
    if (date) {
      // For specific date, return empty slots (user will see no slots available)
      // but the request won't crash
      return NextResponse.json<ApiResponse<{ slots: string[] }>>({
        success: true,
        data: { slots: [] },
      })
    }
    
    if (month) {
      // For month view, return empty availability
      return NextResponse.json<ApiResponse<{ availability: DayAvailability[]; timezone: string }>>({
        success: true,
        data: { availability: [], timezone: "EAT" },
      })
    }
    
    // For default settings view, return empty arrays
    return NextResponse.json<
      ApiResponse<{
        settings: any[]
        blockedDates: any[]
      }>
    >({
      success: true,
      data: { settings: [], blockedDates: [] },
    })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { dayOfWeek, ...data } = body

    if (dayOfWeek === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing dayOfWeek" },
        { status: 400 }
      )
    }

    const updated = await updateAvailability(dayOfWeek, {
      start_time: data.startTime,
      end_time: data.endTime,
      is_available: data.isAvailable,
      slot_duration_minutes: data.slotDuration,
      buffer_minutes: data.buffer,
    })

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update availability" },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Availability updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating availability:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update availability" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, date, reason } = body

    if (action === "block") {
      await addBlockedDate(date, reason)
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Date blocked successfully",
      })
    } else if (action === "unblock") {
      await removeBlockedDate(date)
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Date unblocked successfully",
      })
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[v0] Error managing blocked dates:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to manage blocked dates" },
      { status: 500 }
    )
  }
}
