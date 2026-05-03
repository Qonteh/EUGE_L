"use client"

import { Check, Play, Calendar, Mail, Bell, ArrowRight, Clock, Video } from "lucide-react"
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
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 sm:mb-6 sm:h-20 sm:w-20">
            <Check className="h-8 w-8 text-accent sm:h-10 sm:w-10" strokeWidth={3} />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
            You&apos;re All Set!
          </h1>
          <p className="text-muted-foreground sm:text-lg">
            Your strategy session with Eugene L has been confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mb-10 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground sm:mb-5">Appointment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                <Calendar className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">{formatDate(bookingData.date, bookingData.time)}</p>
                <p className="text-sm text-muted-foreground">{bookingData.timezone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                <Clock className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">1 Hour Strategy Session</p>
                <p className="text-sm text-muted-foreground">with Eugene L</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                <Video className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">Zoom Video Call</p>
                <p className="text-sm text-muted-foreground">Link will be sent to your email</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                <Mail className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">{bookingData.email}</p>
                <p className="text-sm text-muted-foreground">Confirmation sent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Video Section */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mb-10 sm:p-6">
          <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
            Prepare for Your Call
          </h3>
          <p className="mb-5 text-sm text-muted-foreground sm:mb-6 sm:text-base">
            Watch this short video to get the most out of your session.
          </p>
          
          <div className="relative aspect-video overflow-hidden rounded-xl bg-primary">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:40px_40px]" />
            <div className="relative flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm sm:mb-4 sm:h-20 sm:w-20">
                  <span className="text-xl font-bold text-primary-foreground sm:text-2xl">EL</span>
                </div>
                <p className="text-sm font-medium text-primary-foreground sm:text-base">What to Expect</p>
              </div>
            </div>
            <button
              className="absolute inset-0 flex items-center justify-center transition-all"
              aria-label="Play video"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground shadow-lg transition-transform hover:scale-110 sm:h-16 sm:w-16">
                <Play className="ml-1 h-6 w-6 text-primary sm:h-7 sm:w-7" fill="currentColor" />
              </div>
            </button>
          </div>
        </div>

        {/* Action Steps */}
        <div className="mb-8 sm:mb-10">
          <h3 className="mb-4 text-lg font-semibold text-foreground sm:mb-5">Next Steps</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: Calendar, text: "Add to your calendar", action: "Add to Calendar" },
              { icon: Bell, text: "Set a reminder 30 minutes before", action: "Set Reminder" },
              { icon: Mail, text: "Check your email for the Zoom link", action: "Check Email" },
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <step.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{step.text}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-full rounded-full border-2 text-sm font-medium hover:bg-muted sm:w-auto sm:px-5"
                >
                  {step.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:mb-10 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">What to Expect on Your Call</h3>
          <ul className="space-y-3">
            {[
              "A personalized assessment of your trading experience",
              "Clear roadmap to achieve your trading goals",
              "Exclusive insights from Eugene L's proven system",
              "No pressure - just valuable trading advice",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                </div>
                <span className="text-sm text-foreground sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Special Bonus */}
        <div className="mb-8 rounded-2xl bg-primary p-5 text-center text-primary-foreground sm:mb-10 sm:p-6">
          <h2 className="mb-2 text-lg font-bold sm:text-xl">
            Special Bonus for Attending
          </h2>
          <p className="text-sm opacity-90 sm:text-base">
            Attend your call to receive a free $1,000 trading account. Ask Eugene on the call to claim it.
          </p>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <Button
            onClick={onClose}
            size="lg"
            className="h-14 w-full rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground sm:h-16 sm:w-auto sm:text-lg"
          >
            Return to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
