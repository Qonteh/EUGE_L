import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"
import { getSettings, updateSetting } from "@/lib/db-queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keys = searchParams.get("keys")?.split(",").filter(Boolean)

    const settings = await getSettings(keys)

    return NextResponse.json<ApiResponse<typeof settings>>({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.key || body.value === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing key or value" },
        { status: 400 }
      )
    }

    await updateSetting(body.key, String(body.value))

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Setting updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating setting:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    // Bulk update settings
    if (typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    for (const [key, value] of Object.entries(body)) {
      await updateSetting(key, String(value))
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating settings:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
