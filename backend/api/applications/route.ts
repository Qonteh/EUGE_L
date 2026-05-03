import { NextResponse } from "next/server"
import type { ApplicationData, ApiResponse, LeadData } from "@/backend/types"

// In-memory storage for demo purposes
// In production, connect this to Supabase or another database
const applications: LeadData[] = []

export async function POST(request: Request) {
  try {
    const body: ApplicationData = await request.json()

    // Validate required fields
    if (!body.email || !body.firstName || !body.phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check for disqualifying answers
    const isQualified = !(
      body.investment === "$0-$999" ||
      body.commitment === "I need to think about it" ||
      body.commitment === "No, not right now"
    )

    // Create lead record
    const lead: LeadData = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
      qualified: isQualified,
      status: isQualified ? "new" : "disqualified",
    }

    applications.push(lead)

    // Log for demo purposes
    console.log("[v0] New application received:", {
      id: lead.id,
      email: lead.email,
      qualified: isQualified,
    })

    return NextResponse.json<ApiResponse<{ id: string; qualified: boolean }>>({
      success: true,
      data: { id: lead.id, qualified: isQualified },
      message: isQualified
        ? "Application submitted successfully"
        : "Thank you for your interest",
    })
  } catch (error) {
    console.error("[v0] Error processing application:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to process application" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return all applications (in production, add authentication)
    return NextResponse.json<ApiResponse<LeadData[]>>({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error("[v0] Error fetching applications:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
