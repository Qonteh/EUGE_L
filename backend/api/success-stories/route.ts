import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"
import {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "@/lib/db-queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyFeatured = searchParams.get("featured") === "true"

    const stories = await getSuccessStories(onlyFeatured)

    // Transform to frontend format
    const formattedStories = stories.map((s) => ({
      id: s.id,
      name: s.student_name,
      imageUrl: s.student_image_url,
      location: s.student_location,
      profitAmount: s.profit_amount,
      profitPercentage: s.profit_percentage,
      timeframe: s.timeframe,
      headline: s.headline,
      quote: s.short_quote,
      fullStory: s.full_story,
      videoUrl: s.video_url,
      isFeatured: s.is_featured,
      order: s.display_order,
    }))

    return NextResponse.json<ApiResponse<typeof formattedStories>>({
      success: true,
      data: formattedStories,
    })
  } catch (error) {
    console.error("[v0] Error fetching success stories:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch success stories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const story = await createSuccessStory({
      student_name: body.name,
      student_image_url: body.imageUrl,
      student_location: body.location,
      profit_amount: body.profitAmount,
      profit_percentage: body.profitPercentage,
      timeframe: body.timeframe,
      headline: body.headline,
      short_quote: body.quote,
      full_story: body.fullStory,
      video_url: body.videoUrl,
      is_featured: body.isFeatured ?? false,
      display_order: body.order,
    })

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: story.id },
      message: "Success story created",
    })
  } catch (error) {
    console.error("[v0] Error creating success story:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create success story" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing story id" },
        { status: 400 }
      )
    }

    const updated = await updateSuccessStory(id, {
      student_name: data.name,
      student_image_url: data.imageUrl,
      student_location: data.location,
      profit_amount: data.profitAmount,
      profit_percentage: data.profitPercentage,
      timeframe: data.timeframe,
      headline: data.headline,
      short_quote: data.quote,
      full_story: data.fullStory,
      video_url: data.videoUrl,
      is_featured: data.isFeatured,
      display_order: data.order,
      is_active: data.isActive,
    })

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Story not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Success story updated",
    })
  } catch (error) {
    console.error("[v0] Error updating success story:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update success story" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing story id" },
        { status: 400 }
      )
    }

    await deleteSuccessStory(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Success story deleted",
    })
  } catch (error) {
    console.error("[v0] Error deleting success story:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete success story" },
      { status: 500 }
    )
  }
}
