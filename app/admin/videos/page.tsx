"use client"

import { useState, useRef } from "react"
import { Plus, Edit2, Trash2, Play, Upload, Eye, EyeOff, Link, X, FileVideo, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail?: string
  placement: "hero" | "success_story" | "training" | "press"
  isActive: boolean
  views: number
  sourceType: "link" | "upload"
  fileName?: string
}

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Main Hero Video - Introduction",
    description: "The main introduction video that plays on the landing page hero section",
    url: "https://youtube.com/watch?v=example1",
    placement: "hero",
    isActive: true,
    views: 15420,
    sourceType: "link",
  },
  {
    id: "2",
    title: "Jordan - $30,000 FTMO Payouts",
    description: "Success story: Jordan made $30,000 in FTMO payouts in just 4 weeks",
    url: "https://youtube.com/watch?v=example2",
    placement: "success_story",
    isActive: true,
    views: 8932,
    sourceType: "link",
  },
  {
    id: "3",
    title: "Steve - Funded and $9,000+ in Payouts",
    description: "Success story: Steve got funded and made over $9,000 in payouts",
    url: "https://youtube.com/watch?v=example3",
    placement: "success_story",
    isActive: true,
    views: 7654,
    sourceType: "link",
  },
  {
    id: "4",
    title: "Traders Accelerator Method Training",
    description: "The main training video shown on the confirmation page",
    url: "https://youtube.com/watch?v=example4",
    placement: "training",
    isActive: true,
    views: 12890,
    sourceType: "link",
  },
  {
    id: "5",
    title: "TOT Interview - 0 to $121,000",
    description: "Press feature: Eugene L's interview about going from 0 to $121,000",
    url: "https://youtube.com/watch?v=example5",
    placement: "press",
    isActive: true,
    views: 5421,
    sourceType: "link",
  },
]

const placements = [
  { value: "hero", label: "Hero Section" },
  { value: "success_story", label: "Success Stories" },
  { value: "training", label: "Training Video" },
  { value: "press", label: "Press Feature" },
]

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [showAddForm, setShowAddForm] = useState(false)
  const [sourceType, setSourceType] = useState<"link" | "upload">("link")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: "",
    description: "",
    url: "",
    placement: "success_story",
    isActive: true,
    sourceType: "link",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid video file (MP4, WebM, OGG, MOV, AVI)")
        return
      }
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert("File size must be less than 500MB")
        return
      }
      setSelectedFile(file)
      // Auto-fill title from filename if empty
      if (!newVideo.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, "")
        setNewVideo({ ...newVideo, title: fileName })
      }
    }
  }

  const handleUploadVideo = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append("video", selectedFile)
      formData.append("title", newVideo.title || "")
      formData.append("description", newVideo.description || "")
      formData.append("placement", newVideo.placement || "success_story")

      // In production, this would upload to your server/cloud storage
      // For now, we'll create a local object URL
      const videoUrl = URL.createObjectURL(selectedFile)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      clearInterval(progressInterval)
      setUploadProgress(100)

      const video: Video = {
        id: Date.now().toString(),
        title: newVideo.title || selectedFile.name,
        description: newVideo.description || "",
        url: videoUrl,
        placement: newVideo.placement as Video["placement"],
        isActive: true,
        views: 0,
        sourceType: "upload",
        fileName: selectedFile.name,
      }

      setVideos([...videos, video])

      // Reset form
      setTimeout(() => {
        setShowAddForm(false)
        setIsUploading(false)
        setUploadProgress(0)
        setSelectedFile(null)
        setSourceType("link")
        setNewVideo({
          title: "",
          description: "",
          url: "",
          placement: "success_story",
          isActive: true,
          sourceType: "link",
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
      alert("Upload failed. Please try again.")
    }
  }

  const handleAddVideo = () => {
    if (sourceType === "upload") {
      handleUploadVideo()
      return
    }

    if (!newVideo.title || !newVideo.url) return

    const video: Video = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description || "",
      url: newVideo.url,
      placement: newVideo.placement as Video["placement"],
      isActive: true,
      views: 0,
      sourceType: "link",
    }

    setVideos([...videos, video])
    setShowAddForm(false)
    setNewVideo({
      title: "",
      description: "",
      url: "",
      placement: "success_story",
      isActive: true,
      sourceType: "link",
    })
  }

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id))
  }

  const toggleVideoStatus = (id: string) => {
    setVideos(
      videos.map((v) =>
        v.id === id ? { ...v, isActive: !v.isActive } : v
      )
    )
  }

  const getPlacementLabel = (placement: string) => {
    return placements.find((p) => p.value === placement)?.label || placement
  }

  const getPlacementColor = (placement: string) => {
    switch (placement) {
      case "hero":
        return "bg-purple-100 text-purple-800"
      case "success_story":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "press":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage videos across your funnel
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {placements.map((placement) => {
          const count = videos.filter((v) => v.placement === placement.value).length
          const activeCount = videos.filter(
            (v) => v.placement === placement.value && v.isActive
          ).length
          return (
            <Card key={placement.value} className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{placement.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {activeCount}/{count}
                </p>
                <p className="text-xs text-muted-foreground">active videos</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <Card className="border-primary bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Add New Video</CardTitle>
            <CardDescription>Add a video from a link or upload from your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Source Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Video Source
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sourceType === "link" ? "default" : "outline"}
                  onClick={() => {
                    setSourceType("link")
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  className="flex-1 gap-2"
                >
                  <Link className="h-4 w-4" />
                  From Link
                </Button>
                <Button
                  type="button"
                  variant={sourceType === "upload" ? "default" : "outline"}
                  onClick={() => {
                    setSourceType("upload")
                    setNewVideo({ ...newVideo, url: "" })
                  }}
                  className="flex-1 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  From Device
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Video Title
              </label>
              <Input
                value={newVideo.title}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, title: e.target.value })
                }
                placeholder="Enter video title..."
                className="border-border"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                value={newVideo.description}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, description: e.target.value })
                }
                placeholder="Enter video description..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Conditional: Link Input or File Upload */}
            {sourceType === "link" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <Input
                  value={newVideo.url}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, url: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                  className="border-border"
                />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Upload Video File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                {!selectedFile ? (
                  <label
                    htmlFor="video-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8 transition-colors hover:border-primary hover:bg-accent"
                  >
                    <FileVideo className="mb-3 h-12 w-12 text-muted-foreground" />
                    <span className="mb-1 text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                      MP4, WebM, OGG, MOV, AVI (max 500MB)
                    </span>
                  </label>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileVideo className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Uploading...</span>
                          <span className="font-medium text-foreground">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Placement
              </label>
              <select
                value={newVideo.placement}
                onChange={(e) =>
                  setNewVideo({
                    ...newVideo,
                    placement: e.target.value as Video["placement"],
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                {placements.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddVideo}
                className="gap-2"
                disabled={
                  isUploading ||
                  (sourceType === "link" && (!newVideo.title || !newVideo.url)) ||
                  (sourceType === "upload" && !selectedFile)
                }
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : sourceType === "upload" ? (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Video
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setSourceType("link")
                  setSelectedFile(null)
                  setNewVideo({
                    title: "",
                    description: "",
                    url: "",
                    placement: "success_story",
                    isActive: true,
                    sourceType: "link",
                  })
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`border-border bg-card ${
              !video.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="flex h-full items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/80">
                  <Play className="ml-1 h-6 w-6 text-primary-foreground" fill="currentColor" />
                </div>
              </div>
              {/* Source Type Badge */}
              <div className="absolute left-2 top-2">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                  video.sourceType === "upload" 
                    ? "bg-blue-500 text-white" 
                    : "bg-white/90 text-gray-800"
                }`}>
                  {video.sourceType === "upload" ? (
                    <span className="flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      Uploaded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      Link
                    </span>
                  )}
                </span>
              </div>
              {!video.isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white">
                    Inactive
                  </span>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-medium text-foreground">
                  {video.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getPlacementColor(
                    video.placement
                  )}`}
                >
                  {getPlacementLabel(video.placement)}
                </span>
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                {video.description}
              </p>
              {video.fileName && (
                <p className="mb-2 truncate text-xs text-muted-foreground">
                  File: {video.fileName}
                </p>
              )}
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVideoStatus(video.id)}
                  className="flex-1 gap-1"
                >
                  {video.isActive ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteVideo(video.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
