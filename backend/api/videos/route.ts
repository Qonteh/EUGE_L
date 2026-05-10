import { NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import type { ApiResponse } from "@/backend/types"
import {
  getTrainingVideos,
  createTrainingVideo,
  updateTrainingVideo,
  deleteTrainingVideo,
  incrementVideoViewCount,
} from "@/lib/db-queries"

const videoUploadDir = path.join(process.cwd(), "public", "uploads", "videos")

async function saveUploadedVideo(file: File) {
  const ext = path.extname(file.name || "").toLowerCase()
  const safeExt = ext && ext.length <= 10 ? ext : ".mp4"
  const fileName = `${randomUUID()}${safeExt}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await mkdir(videoUploadDir, { recursive: true })
  await writeFile(path.join(videoUploadDir, fileName), buffer)

  return `/uploads/videos/${fileName}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined

    const videos = await getTrainingVideos(category, true)

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
      isActive: v.is_active,
      viewCount: v.view_count,
    }))

    return NextResponse.json<ApiResponse<typeof formattedVideos>>({
      success: true,
      data: formattedVideos,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error fetching videos:", errorMsg, error)
    }
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Failed to fetch videos: ${errorMsg}` },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const title = String(formData.get("title") || "").trim()
      const description = String(formData.get("description") || "").trim()
      const category = String(formData.get("category") || "training")
      const file = formData.get("video")

      if (!title) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Missing video title" },
          { status: 400 }
        )
      }

      if (!file || !(file instanceof File)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Missing video file" },
          { status: 400 }
        )
      }

      if (!file.type.startsWith("video/")) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Please upload a valid video file" },
          { status: 400 }
        )
      }

      const videoUrl = await saveUploadedVideo(file)

      const video = await createTrainingVideo({
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: null,
        category,
        tags: [],
        duration_seconds: undefined,
        is_free: false,
        access_level: "enrolled",
        display_order: undefined,
      })

      return NextResponse.json<ApiResponse<{ id: string; videoUrl: string }>>({
        success: true,
        data: { id: video.id, videoUrl },
        message: "Video uploaded successfully",
      })
    }

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
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (process.env.NODE_ENV !== 'development') {
      console.error("[v0] Error creating video:", errorMsg, error)
    }
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Failed to create video: ${errorMsg}` },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let id: string | undefined
    let data: Record<string, any> = {}

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      id = String(formData.get("id") || "").trim() || undefined
      data = {
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        category: String(formData.get("category") || "training"),
        videoUrl: String(formData.get("videoUrl") || "").trim(),
        thumbnailUrl: String(formData.get("thumbnailUrl") || "").trim() || undefined,
        isActive: formData.get("isActive") === "true",
      }

      const file = formData.get("video")
      if (file && file instanceof File) {
        if (!file.type.startsWith("video/")) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Please upload a valid video file" },
            { status: 400 }
          )
        }

        data.videoUrl = await saveUploadedVideo(file)
      }
    } else {
      const body = await request.json()
      id = body.id
      data = body
    }

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
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error updating video:", errorMsg, error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Failed to update video: ${errorMsg}` },
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
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error deleting video:", errorMsg, error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Failed to delete video: ${errorMsg}` },
      { status: 500 }
    )
  }
}
