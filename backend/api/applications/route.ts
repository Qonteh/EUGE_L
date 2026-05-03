import { NextResponse } from "next/server"
import type { ApplicationData, ApiResponse, LeadData } from "@/backend/types"
import { 
  createApplication, 
  getApplications, 
  getQualificationQuestions,
  updateApplicationStatus 
} from "@/lib/db-queries"

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

    // Build disqualification reason if not qualified
    let disqualificationReason: string | undefined
    if (!isQualified) {
      if (body.investment === "$0-$999") {
        disqualificationReason = "Investment budget too low"
      } else if (body.commitment === "I need to think about it" || body.commitment === "No, not right now") {
        disqualificationReason = "Not ready to commit"
      }
    }

    // Create application in database
    const application = await createApplication({
      full_name: `${body.firstName} ${body.lastName || ""}`.trim(),
      email: body.email,
      phone: body.phone,
      country: body.country,
      timezone: body.timezone,
      trading_experience: body.experience,
      trading_capital: body.investment,
      why_join: body.goals,
      biggest_challenge: body.challenges,
      form_responses: body as Record<string, any>,
      is_qualified: isQualified,
      disqualification_reason: disqualificationReason,
      source: body.source,
    })

    console.log("[v0] New application saved to database:", {
      id: application.id,
      email: application.email,
      qualified: isQualified,
    })

    return NextResponse.json<ApiResponse<{ id: string; qualified: boolean }>>({
      success: true,
      data: { id: application.id, qualified: isQualified },
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const isQualified = searchParams.get("is_qualified")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const result = await getApplications({
      status,
      is_qualified: isQualified ? isQualified === "true" : undefined,
      limit,
      offset,
    })

    // Transform to match existing LeadData format for frontend compatibility
    const leads: LeadData[] = result.applications.map((app) => ({
      id: app.id,
      firstName: app.full_name.split(" ")[0],
      lastName: app.full_name.split(" ").slice(1).join(" "),
      email: app.email,
      phone: app.phone || "",
      country: app.country,
      timezone: app.timezone,
      experience: app.trading_experience,
      investment: app.trading_capital,
      goals: app.why_join,
      challenges: app.biggest_challenge,
      commitment: (app.form_responses as any)?.commitment,
      createdAt: app.created_at.toISOString(),
      qualified: app.is_qualified,
      status: app.status as any,
    }))

    return NextResponse.json<ApiResponse<{ applications: LeadData[]; total: number }>>({
      success: true,
      data: { applications: leads, total: result.total },
    })
  } catch (error) {
    console.error("[v0] Error fetching applications:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id || !status) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      )
    }

    const updated = await updateApplicationStatus(id, status, adminNotes)

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Application updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating application:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    )
  }
}
