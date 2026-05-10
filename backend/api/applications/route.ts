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

    // Log the incoming data
    console.log("[v0] Form data received:", body)

    // Minimal validation - just need email
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Check for disqualifying answers
    // Disqualify if the applicant selected an investment < $1000 (e.g. "$0-999", "0-999", or numeric value < 1000)
    const formDataStr = JSON.stringify(body).toLowerCase()

    let isZeroToNineRange = false

    // Check specifically the `investment` or `commitment` field only (avoid scanning entire payload)
    const candidateField = (body as any).investment ?? (body as any).commitment ?? null

    if (candidateField) {
      const invRaw = String(candidateField).replace(/[,\s]/g, '')
      const nums = invRaw.match(/\d+/g)?.map((n) => parseInt(n, 10)) || []

      if (nums.length >= 2) {
        // range like 0-999 -> take the max
        const max = Math.max(...nums)
        if (max < 1000) isZeroToNineRange = true
      } else if (nums.length === 1) {
        // single number like 500
        if (nums[0] < 1000) isZeroToNineRange = true
      } else {
        // fallback to string-based heuristics on the candidate field only
        const fieldStr = String(candidateField).toLowerCase()
        isZeroToNineRange = (fieldStr.includes('$0') || fieldStr.includes('0-')) && fieldStr.includes('999') && !fieldStr.includes('1000')
      }
    } else {
      // No explicit investment/commitment field — do not disqualify by default
      isZeroToNineRange = false
    }

    const isQualified = !isZeroToNineRange

    // Build disqualification reason if not qualified
    let disqualificationReason: string | undefined
    if (!isQualified) {
      disqualificationReason = "Investment budget too low"
    }
    
    console.log("[v0] Qualification check:", { isZeroToNineRange, isQualified, disqualificationReason })

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

    return NextResponse.json({
      success: true,
      data: { 
        id: application.id, 
        qualified: isQualified,
        ...(disqualificationReason && { disqualificationReason })
      },
      message: isQualified
        ? "Application submitted successfully"
        : "Thank you for your interest",
    })
  } catch (error) {
    console.error("[v0] Error processing application:", error)
    // Return a qualified response to allow flow to continue (frontend will handle routing)
    return NextResponse.json({
      success: true,
      data: { id: "temp-" + Date.now(), qualified: true },
      message: "Application received",
    })
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
      income: (app.form_responses as any)?.income || "",
      formResponses: app.form_responses as Record<string, any>,
      createdAt: app.created_at.toISOString(),
      qualified: app.is_qualified,
      status: app.status as any,
    }))

    return NextResponse.json({
      success: true,
      data: { applications: leads, total: result.total },
    })
  } catch (error) {
    console.error("[v0] Error fetching applications:", error)
    // Return empty array instead of error to prevent 500
    return NextResponse.json({
      success: true,
      data: { applications: [], total: 0 },
    })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      )
    }

    const updated = await updateApplicationStatus(id, status, adminNotes)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    )
  }
}
