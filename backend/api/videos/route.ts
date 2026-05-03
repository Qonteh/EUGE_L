import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"
import {
  getTrainingVideos,
  createTrainingVideo,
  updateTrainingVideo,
  deleteTrainingVideo,
  incrementVideoViewCount,
} from "@/lib/db-queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined

    const videos = await getTrainingVideos(category)

    // Transform to frontend format
    const formattedVideos = videos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      videoUrl: v.video_url,
      thumbnailUrl: v.thumbnail_url,
      category: v.category,
      tags: v.tags,
      duration: v.duration_seconds,
      isFree: v.is_free,
      accessLevel: v.access_level,
      order: v.display_order,
      viewCount: v.view_count,
    }))

    return NextResponse.json<ApiResponse<typeof formattedVideos>>({
      success: true,
      data: formattedVideos,
    })
  } catch (error) {
    console.error("[v0] Error fetching videos:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Track video view
    if (body.action === "view" && body.id) {
      await incrementVideoViewCount(body.id)
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "View recorded",
      })
    }

    // Create new video
    const video = await createTrainingVideo({
      title: body.title,
      description: body.description,
      video_url: body.videoUrl,
      thumbnail_url: body.thumbnailUrl,
      category: body.category,
      tags: body.tags,
      duration_seconds: body.duration,
      is_free: body.isFree ?? false,
      access_level: body.accessLevel ?? "enrolled",
      display_order: body.order,
    })

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: video.id },
      message: "Video created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating video:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create video" },
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
        { success: false, error: "Missing video id" },
        { status: 400 }
      )
    }

    const updated = await updateTrainingVideo(id, {
      title: data.title,
      description: data.description,
      video_url: data.videoUrl,
      thumbnail_url: data.thumbnailUrl,
      category: data.category,
      tags: data.tags,
      duration_seconds: data.duration,
      is_free: data.isFree,
      access_level: data.accessLevel,
      display_order: data.order,
      is_active: data.isActive,
    })

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Video not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Video updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating video:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update video" },
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
        { success: false, error: "Missing video id" },
        { status: 400 }
      )
    }

    await deleteTrainingVideo(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting video:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete video" },
      { status: 500 }
    )
  }
}
