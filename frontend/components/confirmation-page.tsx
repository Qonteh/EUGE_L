"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Play, Calendar, Mail, Bell, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationPageProps {
  bookingData: {
    date: Date
    time: string
    timezone: string
    name: string
    email: string
  }
  onClose: () => void
}

export function ConfirmationPage({ bookingData, onClose }: ConfirmationPageProps) {
  const [trainingVideo, setTrainingVideo] = useState<{
    title: string
    description?: string
    videoUrl: string
    thumbnailUrl?: string
  } | null>(null)

  const isDirectVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith("/uploads/videos/")
  }

  const buildBookingDateTime = () => {
    const [hours, minutes] = bookingData.time.split(":").map(Number)
    const date = new Date(bookingData.date)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const formatIcsDate = (date: Date) => {
    const year = date.getFullYear().toString().padStart(4, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }

  const downloadCalendarFile = (withReminder = false) => {
    const startDate = buildBookingDateTime()
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 1)

    const summary = "Zoom Call with Eugene L"
    const description = [
      "Your Zoom call with Eugene L has been scheduled.",
      "Add this event to your calendar and keep the reminder enabled.",
      "",
      `Email: ${bookingData.email}`,
      `Timezone: ${bookingData.timezone}`,
    ].join("\\n")

    const alarmBlock = withReminder
      ? `BEGIN:VALARM\nTRIGGER:-PT30M\nACTION:DISPLAY\nDESCRIPTION:Zoom call reminder\nEND:VALARM\n`
      : ""

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EUGE_L//Booking Confirmation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${bookingData.email}-${startDate.getTime()}@euge-l`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:Zoom meeting`,
      alarmBlock.trimEnd(),
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n")

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = withReminder ? "zoom-call-reminder.ics" : "zoom-call.ics"
    link.click()
    URL.revokeObjectURL(url)
  }

  const openEmail = () => {
    const subject = encodeURIComponent("Zoom Call Confirmation")
    const body = encodeURIComponent(
      `Hi Eugene L,\n\nI have received my booking confirmation.\n\nName: ${bookingData.name}\nEmail: ${bookingData.email}\nTime: ${formatDate(bookingData.date, bookingData.time)}\nTimezone: ${bookingData.timezone}\n\nThank you.`
    )
    window.location.href = `mailto:${bookingData.email}?subject=${subject}&body=${body}`
  }

  useEffect(() => {
    let mounted = true

    const loadTrainingVideo = async () => {
      try {
        const response = await fetch("/api/videos?category=training")
        if (!response.ok) {
          return
        }

        const payload = await response.json()
        const firstVideo = payload?.success && Array.isArray(payload.data) ? payload.data[0] : null

        if (mounted && firstVideo?.videoUrl) {
          setTrainingVideo(firstVideo)
        }
      } catch {
        // Keep the fallback placeholder if the live video load fails.
      }
    }

    loadTrainingVideo()

    return () => {
      mounted = false
    }
  }, [])

  const formatDate = (date: Date, time: string) => {
    const endHour = parseInt(time.split(":")[0]) + 1
    const endTime = `${endHour.toString().padStart(2, "0")}:00`
    return `${time} - ${endTime}, ${date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
  }

  return (
    <div className="min-h-screen bg-background px-3 py-8 sm:px-4 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 sm:mb-4 sm:h-16 sm:w-16">
            <CheckCircle className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            <span className="text-primary">Congratulations!</span> Your Zoom Call Has Been Scheduled.
          </h1>
        </div>

        {/* Training Video Section */}
        <div className="mb-6 rounded-xl bg-card p-4 shadow-lg shadow-primary/10 sm:mb-8 sm:rounded-2xl sm:p-6">
          <h2 className="mb-3 text-base font-bold text-primary sm:mb-4 sm:text-xl">
            Step 1: <span className="text-foreground">Watch the training video</span>
          </h2>

          <p className="mb-4 text-xs italic text-muted-foreground sm:mb-6 sm:text-sm">
            Watch the free training revealing the system that helped 300+ traders go from inconsistent to profitable in 90 days.
          </p>

          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="relative aspect-video bg-black">
              {trainingVideo?.videoUrl ? (
                isDirectVideoUrl(trainingVideo.videoUrl) ? (
                  <video
                    key={trainingVideo.videoUrl}
                    className="h-full w-full"
                    src={trainingVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    poster={trainingVideo.thumbnailUrl || undefined}
                  />
                ) : (
                  <iframe
                    className="h-full w-full"
                    src={trainingVideo.videoUrl.includes("youtube") ? trainingVideo.videoUrl : `${trainingVideo.videoUrl}?autoplay=0`}
                    title={trainingVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent sm:mb-4 sm:h-24 sm:w-24">
                      <span className="text-xl font-bold text-primary-foreground sm:text-3xl">EL</span>
                    </div>
                    <p className="text-sm font-medium text-white sm:text-lg">Eugene L</p>
                  </div>
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30"
                    aria-label="Play video"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 sm:h-16 sm:w-16">
                      <Play className="ml-0.5 h-5 w-5 text-primary-foreground sm:ml-1 sm:h-6 sm:w-6" fill="currentColor" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {trainingVideo?.title && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-3 sm:p-4">
              <p className="text-sm font-semibold text-foreground sm:text-base">{trainingVideo.title}</p>
              {trainingVideo.description && (
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{trainingVideo.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Step 2 - Booking Details */}
        <div className="mb-6 rounded-xl bg-card p-4 shadow-lg shadow-primary/10 sm:mb-8 sm:rounded-2xl sm:p-6">
          <h2 className="mb-3 text-base font-bold text-primary sm:mb-4 sm:text-xl">
            Step 2: <span className="text-foreground">Confirm your Zoom call details</span>
          </h2>

          <p className="mb-3 text-center text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            To Respect Your Time and Ours, Please Follow The Steps Below:
          </p>

          <div className="rounded-xl bg-secondary/50 p-3 sm:p-4">
            <p className="text-xs text-foreground sm:text-sm">
              <span className="font-bold">Important!</span> Make sure you add your booking to your calendar and set a
              reminder. This ensures you don&apos;t miss your call with Eugene L.
            </p>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="mb-6 rounded-xl bg-card p-4 shadow-lg shadow-primary/10 sm:mb-8 sm:rounded-2xl sm:p-6">
          <h3 className="mb-3 text-base font-bold text-foreground sm:mb-4 sm:text-lg">Your Booking Details</h3>
          <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              <span className="text-foreground">{formatDate(bookingData.date, bookingData.time)}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              <span className="text-foreground">1 hour call with Eugene L</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              <span className="text-foreground">{bookingData.email}</span>
            </div>
          </div>
        </div>

        {/* Special Bonus */}
        <div className="mb-6 rounded-xl bg-primary p-4 text-center text-primary-foreground shadow-xl shadow-primary/30 sm:mb-8 sm:rounded-2xl sm:p-6">
          <h2 className="mb-2 text-lg font-bold sm:mb-3 sm:text-xl md:text-2xl">
            Attend your scheduled call to receive a special bonus.
          </h2>
          <p className="text-xs opacity-90 sm:text-sm md:text-base">
            You will get a free $1,000 trading account. Ask your coach on the call to claim it.
          </p>
        </div>

        {/* Action Steps */}
        <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
          <h3 className="text-base font-bold text-foreground sm:text-lg">Next Steps:</h3>
          {[
            { icon: Calendar, text: "Add to your calendar", action: "Add to Calendar", onClick: () => downloadCalendarFile(false) },
            { icon: Bell, text: "Set a reminder 30 minutes before", action: "Set Reminder", onClick: () => downloadCalendarFile(true) },
            { icon: Mail, text: "Check your email for confirmation", action: "Check Email", onClick: openEmail },
          ].map((step, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                  <step.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <span className="text-sm font-medium text-foreground sm:text-base">{step.text}</span>
              </div>
              <Button variant="outline" size="sm" onClick={step.onClick} className="h-8 w-full border-primary text-xs text-primary hover:bg-primary hover:text-primary-foreground sm:h-9 sm:w-auto sm:text-sm">
                {step.action}
              </Button>
            </div>
          ))}
        </div>

        {/* What to Expect */}
        <div className="mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:mb-8 sm:rounded-2xl sm:p-6">
          <h3 className="mb-3 text-base font-bold text-foreground sm:mb-4 sm:text-lg">What to Expect on Your Call:</h3>
          <ul className="space-y-2 text-xs text-foreground sm:text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span>A personalized assessment of your trading experience</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span>Clear roadmap to achieve your trading goals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span>Exclusive insights from Eugene L&apos;s proven system</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span>No pressure - just valuable trading advice</span>
            </li>
          </ul>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <Button
            onClick={onClose}
            size="lg"
            className="h-11 w-full max-w-xs rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 sm:h-14 sm:px-8 sm:text-lg"
          >
            Return to Home
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
