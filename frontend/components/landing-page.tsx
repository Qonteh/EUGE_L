"use client"

import { useState, useEffect } from "react"
import { Play, Star, ArrowRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onApplyNow: () => void
}

interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  category?: string
  tags?: string[]
  duration?: number
  isFree: boolean
  accessLevel: string
  order?: number
  isActive: boolean
  viewCount: number
}

interface LandingHero {
  id: string
  pre_headline?: string | null
  headline?: string | null
  sub_headline?: string | null
  description?: string | null
  hero_initials?: string | null
  mentor_name?: string | null
  mentor_title?: string | null
  cta_text?: string | null
  cta_link?: string | null
  video_id?: string | null
  is_active?: boolean
}

export function LandingPage({ onApplyNow }: LandingPageProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [landingHero, setLandingHero] = useState<LandingHero | null>(null)
  const [heroVideos, setHeroVideos] = useState<Video[]>([])
  const [successStories, setSuccessStories] = useState<Video[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedSuccessVideo, setSelectedSuccessVideo] = useState<Video | null>(null)

  const isDirectVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith("/uploads/videos/")
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoadingVideos(true)
        const [heroResponse, heroVideosResponse, successResponse] = await Promise.all([
          fetch("/api/landing-hero"),
          fetch("/api/videos?category=hero"),
          fetch("/api/videos?category=success_story"),
        ])

        if (heroResponse.ok) {
          const data = await heroResponse.json()
          if (data.success && data.data) {
            setLandingHero(data.data)
          }
        }

        if (successResponse.ok) {
          const data = await successResponse.json()
          if (data.success && data.data) {
            setSuccessStories(data.data)
          }
        }

        if (heroVideosResponse.ok) {
          const data = await heroVideosResponse.json()
          if (data.success && data.data) {
            setHeroVideos(data.data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setIsLoadingVideos(false)
      }
    }

    fetchVideos()
  }, [])

  const heroVideo =
    landingHero?.video_id
      ? heroVideos.find((video) => video.id === landingHero.video_id) || heroVideos[0]
      : heroVideos[0]

  const heroCopy = {
    preHeadline: landingHero?.pre_headline || "If You Already Have $2K+ in Savings or Trade On the Side...",
    headline: landingHero?.headline || "Your Trading Skills Could Be Generating",
    headlineHighlight: "$2K-$10K Profit Monthly",
    subHeadline: landingHero?.sub_headline || "(In Just 90 Days, Guaranteed)",
    description:
      landingHero?.description ||
      "Become a Profitable, Funded Trader Using Our Proven Accelerator System — Learn Once, Trade for Life.",
    ctaText: landingHero?.cta_text || "Apply Now",
    mentorName: landingHero?.mentor_name || "Eugene L",
    mentorTitle: landingHero?.mentor_title || "Trading Mentor",
    heroInitials: landingHero?.hero_initials || "EL",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pre-headline */}
          <p className="mb-3 text-xs font-medium text-muted-foreground sm:mb-4 sm:text-sm md:text-base">
            {heroCopy.preHeadline}
          </p>

          {/* Main Headline */}
          <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-balance">{heroCopy.headline} </span>
            <span className="text-primary">{heroCopy.headlineHighlight}</span>
          </h1>

          {/* Sub-headline */}
          <p className="mb-4 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl md:text-2xl">
            {heroCopy.subHeadline}
          </p>

          {/* Value Proposition */}
          <p className="mx-auto mb-6 max-w-2xl text-sm italic text-muted-foreground sm:mb-8 sm:text-base md:text-lg">
            {heroCopy.description}
          </p>

          {/* Video Section */}
          <div className="relative mx-auto mb-6 max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl shadow-primary/20 sm:mb-8 sm:rounded-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
              {!isVideoPlaying ? (
                <div className="relative h-full w-full">
                  {/* Video Thumbnail or Placeholder */}
                  {heroVideo?.thumbnailUrl ? (
                    <img
                      src={heroVideo.thumbnailUrl}
                      alt="Video thumbnail"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent sm:mb-4 sm:h-32 sm:w-32">
                          <span className="text-2xl font-bold text-primary-foreground sm:text-4xl">{heroCopy.heroInitials}</span>
                        </div>
                        <p className="text-base font-medium text-white sm:text-lg">{heroCopy.mentorName}</p>
                        <p className="text-xs text-gray-300 sm:text-sm">{heroCopy.mentorTitle}</p>
                      </div>
                    </div>
                  )}
                  {/* Play Button */}
                  <button
                    onClick={() => {
                      setIsVideoPlaying(true)
                      if (heroVideo) {
                        setSelectedVideo(heroVideo)
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all hover:bg-black/40"
                    aria-label="Play video"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform hover:scale-110 sm:h-20 sm:w-20">
                      <Play className="ml-1 h-6 w-6 text-primary-foreground sm:h-8 sm:w-8" fill="currentColor" />
                    </div>
                  </button>
                  {/* Video Label */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-accent px-2 py-1 sm:bottom-4 sm:left-4 sm:px-3">
                    <span className="text-xs font-medium text-accent-foreground sm:text-sm">
                      {heroVideo ? heroVideo.title : "I'm offering you a..."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-900">
                  {selectedVideo?.videoUrl ? (
                    isDirectVideoUrl(selectedVideo.videoUrl) ? (
                      <video
                        key={selectedVideo.id}
                        className="h-full w-full"
                        src={selectedVideo.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        poster={selectedVideo.thumbnailUrl || undefined}
                      />
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedVideo.videoUrl.includes("youtube") ? selectedVideo.videoUrl : `${selectedVideo.videoUrl}?autoplay=1`}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  ) : (
                    <p className="text-white">Loading video...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onApplyNow}
            size="lg"
            className="mb-3 h-12 w-full max-w-md rounded-xl bg-primary px-6 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/30 sm:mb-4 sm:h-14 sm:text-lg md:h-16 md:px-8 md:text-xl"
          >
            {heroCopy.ctaText}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:mb-6">
            And Get Your Free Personalized Action Plan
          </p>

          {/* Trust Badge */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="font-medium text-foreground">Rated Excellent</span>
            <span className="font-bold text-primary">4.9</span>
            <span className="text-muted-foreground">out of 5</span>
            <div className="ml-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/50 text-yellow-400/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-secondary/30 px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10 md:mb-12">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              <span className="text-primary">{successStories.length}+</span> Trader Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Watch how everyday traders inside the Accelerator got funded, hit payouts, and changed their financial future in 90 days or less.
            </p>
            <p className="mt-2 text-xs italic text-muted-foreground sm:text-sm">
              (Watch on 1.5x speed - more results at the bottom of this section)
            </p>
          </div>

          {/* Success Stories Grid */}
          {isLoadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-primary" size={40} />
            </div>
          ) : successStories.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {successStories.map((video) => (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-xl bg-card shadow-lg transition-all hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Video Player - Always Visible */}
                  <div className="relative aspect-video bg-black">
                    {selectedSuccessVideo?.id === video.id ? (
                      <>
                        {isDirectVideoUrl(video.videoUrl) ? (
                          <video
                            className="h-full w-full"
                            src={video.videoUrl}
                            controls
                            playsInline
                            poster={video.thumbnailUrl || undefined}
                            onPlay={() => setSelectedSuccessVideo(video)}
                          />
                        ) : (
                          <iframe
                            className="h-full w-full"
                            src={video.videoUrl.includes("youtube") ? video.videoUrl : `${video.videoUrl}?autoplay=1`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <div className="text-center">
                              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent sm:h-20 sm:w-20">
                                <span className="text-lg font-bold text-primary-foreground sm:text-2xl">
                                  {video.title.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Play Button Overlay */}
                        <button
                          onClick={() => setSelectedSuccessVideo(video)}
                          className="group absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100"
                          aria-label="Play video"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                            <Play className="ml-0.5 h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" fill="currentColor" />
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">{video.title}</h3>
                    <p className="text-sm text-primary sm:text-base">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border p-12">
              <p className="text-muted-foreground">No success stories available yet. Check back soon!</p>
            </div>
          )}

          {/* Watch More Results Button */}
          <div className="mt-8 text-center sm:mt-10">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-2 border-foreground px-6 text-base font-bold text-foreground hover:bg-foreground hover:text-background sm:h-14 sm:px-8 sm:text-lg"
            >
              Watch More Results
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
            <p className="text-xs italic text-muted-foreground sm:text-sm">
              <span className="font-semibold">Disclaimer:</span> Testimonials shared by the Company are not typical and should not be construed as a guarantee of performance. Any results shared are examples of individuals who have used elements from our Services. Individual results may vary. Past performance does not guarantee future results. Earnings and income examples provided by the Company are aspirational statements only. These results are not typical, and individual results may vary. The results presented on this page reflect our experiences, and we cannot guarantee that you will achieve the same or similar results.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
