"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Edit2, Trash2, Play, Eye, EyeOff, Loader2, Link, Upload, X, FileVideo } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Video {
  id: string
  title: string
  description: string
  url: string
  placement: "hero" | "success_story" | "training" | "press"
  isActive: boolean
  views: number
}

type VideoFormState = {
  title: string
  description: string
  url: string
  placement: Video["placement"]
}

type VideoSourceType = "link" | "upload"

const placements: Array<{ value: Video["placement"]; label: string }> = [
  { value: "hero", label: "Hero Section" },
  { value: "success_story", label: "Success Stories" },
  { value: "training", label: "Training Video" },
  { value: "press", label: "Press Feature" },
]

const emptyForm: VideoFormState = {
  title: "",
  description: "",
  url: "",
  placement: "training",
}

function normalizeVideo(video: any): Video {
  return {
    id: String(video.id),
    title: video.title || "Untitled video",
    description: video.description || "",
    url: video.videoUrl || video.video_url || "",
    placement: (video.category || "training") as Video["placement"],
    isActive: video.isActive ?? video.is_active ?? true,
    views: Number(video.viewCount ?? video.view_count ?? 0),
  }
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<VideoFormState>(emptyForm)
  const [sourceType, setSourceType] = useState<VideoSourceType>("link")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let mounted = true

    async function loadVideos() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/videos")
        const payload = await response.json()

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to load videos")
        }

        if (!mounted) return
        setVideos((payload.data || []).map(normalizeVideo))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : "Failed to load videos")
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadVideos()

    return () => {
      mounted = false
    }
  }, [])

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

  const refreshVideos = async () => {
    const response = await fetch("/api/videos")
    const payload = await response.json()

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error || "Failed to load videos")
    }

    setVideos((payload.data || []).map(normalizeVideo))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingVideoId(null)
    setSourceType("link")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openCreateForm = () => {
    resetForm()
    setShowAddForm(true)
  }

  const openEditForm = (video: Video) => {
    setEditingVideoId(video.id)
    setSourceType(video.url.startsWith("/uploads/videos/") ? "upload" : "link")
    setSelectedFile(null)
    setForm({
      title: video.title,
      description: video.description,
      url: video.url,
      placement: video.placement,
    })
    setShowAddForm(true)
  }

  const openPreview = (video: Video) => {
    setPreviewVideo(video)
  }

  const isDirectVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith("/uploads/videos/")
  }

  const saveVideo = async () => {
    if (!form.title.trim()) {
      return
    }

    if (sourceType === "link" && !form.url.trim()) {
      return
    }

    if (sourceType === "upload" && !selectedFile) {
      return
    }

    setIsSaving(true)

    try {
      const shouldUpload = sourceType === "upload"
      const method = editingVideoId ? "PATCH" : "POST"

      const response = shouldUpload
        ? await fetch("/api/videos", {
            method,
            body: (() => {
              const formData = new FormData()
              if (editingVideoId) {
                formData.append("id", editingVideoId)
              }
              formData.append("title", form.title.trim())
              formData.append("description", form.description.trim())
              formData.append("category", form.placement)
              if (selectedFile) {
                formData.append("video", selectedFile)
              }
              return formData
            })(),
          })
        : await fetch("/api/videos", {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              editingVideoId
                ? {
                    id: editingVideoId,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    videoUrl: form.url.trim(),
                    category: form.placement,
                  }
                : {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    videoUrl: form.url.trim(),
                    category: form.placement,
                  }
            ),
          })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to save video")
      }

      await refreshVideos()
      setShowAddForm(false)
      resetForm()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save video")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleVideoStatus = async (video: Video) => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/videos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: video.id,
          title: video.title,
          description: video.description,
          videoUrl: video.url,
          category: video.placement,
          isActive: !video.isActive,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update video status")
      }

      await refreshVideos()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update video status")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    const confirmed = window.confirm("Delete this video?")
    if (!confirmed) {
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to delete video")
      }

      await refreshVideos()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete video")
    } finally {
      setIsSaving(false)
    }
  }

  const stats = placements.map((placement) => {
    const count = videos.filter((video) => video.placement === placement.value).length
    const activeCount = videos.filter(
      (video) => video.placement === placement.value && video.isActive
    ).length

    return { ...placement, count, activeCount }
  })

  const totalVideos = videos.length
  const activeVideos = videos.filter((video) => video.isActive).length
  const inactiveVideos = totalVideos - activeVideos
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage the live video records stored in your backend.
          </p>
        </div>
        <Button onClick={openCreateForm} className="gap-2 bg-primary text-primary-foreground">
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-card">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Uploaded videos</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{totalVideos}</p>
            <p className="text-xs text-muted-foreground">All videos in the library</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active videos</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{activeVideos}</p>
            <p className="text-xs text-muted-foreground">Visible on the site</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Inactive videos</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{inactiveVideos}</p>
            <p className="text-xs text-muted-foreground">Hidden from visitors</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total views</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{totalViews}</p>
            <p className="text-xs text-muted-foreground">Combined video views</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((placement) => (
          <Card key={placement.value} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{placement.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {placement.activeCount}/{placement.count}
              </p>
              <p className="text-xs text-muted-foreground">active videos</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <Card className="border-primary bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingVideoId ? "Edit Video" : "Add New Video"}
            </CardTitle>
            <CardDescription>
              Save directly to the real videos table in your backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Video Source</label>
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
                    setForm((prev) => ({ ...prev, url: "" }))
                  }}
                  className="flex-1 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  From Device
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Video Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter video title..."
                className="border-border"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter video description..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {sourceType === "link" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Video URL
                </label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"]
                    if (!validTypes.includes(file.type)) {
                      alert("Please select a valid video file (MP4, WebM, OGG, MOV, AVI)")
                      return
                    }

                    if (file.size > 500 * 1024 * 1024) {
                      alert("File size must be less than 500MB")
                      return
                    }

                    setSelectedFile(file)
                    if (!form.title.trim()) {
                      const fileName = file.name.replace(/\.[^/.]+$/, "")
                      setForm((prev) => ({ ...prev, title: fileName }))
                    }
                  }}
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
                          <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
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
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Placement</label>
              <select
                value={form.placement}
                onChange={(e) =>
                  setForm({ ...form, placement: e.target.value as Video["placement"] })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                {placements.map((placement) => (
                  <option key={placement.value} value={placement.value}>
                    {placement.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={saveVideo}
                className="gap-2"
                disabled={
                  isSaving ||
                  !form.title.trim() ||
                  (sourceType === "link" && !form.url.trim()) ||
                  (sourceType === "upload" && !selectedFile)
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {editingVideoId ? "Update Video" : "Add Video"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading live video records...
          </CardContent>
        </Card>
      ) : videos.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No videos found in the database yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card
              key={video.id}
              className={`border-border bg-card ${!video.isActive ? "opacity-60" : ""}`}
            >
              <button
                type="button"
                onClick={() => openPreview(video)}
                className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900"
              >
                <div className="flex h-full items-center justify-center transition-transform duration-200 hover:scale-[1.02]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/80">
                    <Play className="ml-1 h-6 w-6 text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
                {!video.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white">
                      Inactive
                    </span>
                  </div>
                )}
              </button>

              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 font-medium text-foreground">{video.title}</h3>
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
                <p className="mb-2 truncate text-xs text-muted-foreground">URL: {video.url}</p>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleVideoStatus(video)}
                    className="flex-1 gap-1"
                    disabled={isSaving}
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
                    onClick={() => openEditForm(video)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    disabled={isSaving}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(previewVideo)} onOpenChange={(open) => !open && setPreviewVideo(null)}>
        <DialogContent className="max-w-4xl p-0 sm:max-w-4xl" showCloseButton>
          {previewVideo && (
            <div className="overflow-hidden rounded-lg bg-background">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>{previewVideo.title}</DialogTitle>
                <DialogDescription>
                  Click the player controls to pause, resume, or scrub the video.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6 pt-4">
                <div className="overflow-hidden rounded-xl bg-black">
                  {isDirectVideoUrl(previewVideo.url) ? (
                    <video
                      key={previewVideo.id}
                      className="h-full w-full max-h-[70vh]"
                      src={previewVideo.url}
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <iframe
                      className="h-[70vh] w-full"
                      src={previewVideo.url.includes("youtube") ? previewVideo.url : `${previewVideo.url}?autoplay=1`}
                      title={previewVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{getPlacementLabel(previewVideo.placement)}</span>
                  <span>{previewVideo.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
