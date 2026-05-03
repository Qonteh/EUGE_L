"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Clock, Calendar, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface BookingCalendarProps {
  onComplete: (booking: BookingData) => void
  onClose: () => void
  formData: {
    firstName: string
    lastName: string
    email: string
  }
}

interface BookingData {
  date: Date
  time: string
  timezone: string
  name: string
  email: string
  message: string
  phone: string
}

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const timezones = [
  { value: "EAT", label: "East Africa Time", offset: "+03:00" },
  { value: "GMT", label: "Greenwich Mean Time", offset: "+00:00" },
  { value: "EST", label: "Eastern Standard Time", offset: "-05:00" },
  { value: "PST", label: "Pacific Standard Time", offset: "-08:00" },
  { value: "IST", label: "India Standard Time", offset: "+05:30" },
]

export function BookingCalendar({ onComplete, onClose, formData }: BookingCalendarProps) {
  const [step, setStep] = useState<"calendar" | "time" | "details">("calendar")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timezone, setTimezone] = useState("EST")
  const [bookingDetails, setBookingDetails] = useState({
    name: `${formData.firstName} ${formData.lastName}`.trim() || "",
    email: formData.email || "",
    message: "",
    phone: "",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1

    const days: (number | null)[] = []

    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayOfWeek = date.getDay()
    return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleDateSelect = (day: number) => {
    if (isDateAvailable(day)) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      setSelectedDate(date)
      setStep("time")
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNext = () => {
    if (step === "time" && selectedTime) {
      setStep("details")
    } else if (step === "details") {
      if (selectedDate && selectedTime) {
        onComplete({
          date: selectedDate,
          time: selectedTime,
          timezone,
          ...bookingDetails,
        })
      }
    }
  }

  const handleBack = () => {
    if (step === "time") {
      setStep("calendar")
      setSelectedTime(null)
    } else if (step === "details") {
      setStep("time")
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentTimezone = timezones.find((tz) => tz.value === timezone)
  const progressWidth = step === "calendar" ? "33%" : step === "time" ? "66%" : "100%"

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {step !== "calendar" && (
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {step === "calendar" ? "Select Date" : step === "time" ? "Select Time" : "Your Details"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-28 sm:px-6 sm:pb-32">
        {step === "calendar" && (
          <div className="mx-auto max-w-md pt-6 sm:pt-10">
            <div className="mb-6 text-center sm:mb-8">
              <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                Schedule Your Call
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Choose a date for your strategy session with Eugene L
              </p>
            </div>

            {/* Month Navigation */}
            <div className="mb-6 flex items-center justify-center gap-4 sm:mb-8">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-36 text-center text-base font-semibold text-foreground sm:text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
              {/* Day Headers */}
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground sm:text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || !isDateAvailable(day)}
                    className={cn(
                      "flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all sm:h-11 sm:text-base",
                      !day && "invisible",
                      day && isDateAvailable(day)
                        ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                        : "cursor-not-allowed text-muted-foreground/40",
                      day && isToday(day) && "ring-2 ring-accent ring-offset-2 ring-offset-card",
                      selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth.getMonth() &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Time zone</span>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === "time" && selectedDate && (
          <div className="mx-auto max-w-md pt-6 sm:pt-10">
            {/* Selected Date */}
            <div className="mb-6 rounded-xl border border-border bg-card p-4 sm:mb-8 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                  <Calendar className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-4 text-center sm:mb-6">
              <h3 className="mb-1 text-lg font-bold text-foreground sm:text-xl">
                Select a Time
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Duration: 1 hour</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border-2 px-4 py-4 text-base font-medium transition-all sm:py-5",
                    selectedTime === time
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-border bg-card text-foreground hover:border-accent/50"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && selectedDate && selectedTime && (
          <div className="mx-auto max-w-md pt-6 sm:pt-10">
            {/* Booking Summary */}
            <div className="mb-6 rounded-xl border border-border bg-card p-4 sm:mb-8 sm:p-5">
              <h3 className="mb-4 font-semibold text-foreground">Your Appointment</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-foreground">1 hour strategy session</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-foreground">
                    {selectedTime} - {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-accent" />
                  <span className="text-foreground">{currentTimezone?.label}</span>
                </div>
              </div>
            </div>

            {/* Details Form */}
            <h3 className="mb-4 text-lg font-bold text-foreground sm:text-xl">Confirm Your Details</h3>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={bookingDetails.name}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Phone Number (for reminders)
                </label>
                <Input
                  type="tel"
                  value={bookingDetails.phone}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+1 234 567 8900"
                  className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Anything you&apos;d like us to know? (optional)
                </label>
                <textarea
                  value={bookingDetails.message}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  placeholder="Share any context that would help prepare for our call..."
                />
              </div>

              <p className="text-xs text-muted-foreground">
                By scheduling, you agree to our{" "}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {(step === "time" || step === "details") && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background px-4 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto flex max-w-md gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="h-14 w-14 shrink-0 rounded-full border-2 p-0 sm:h-16 sm:w-16"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={step === "time" ? !selectedTime : !bookingDetails.name || !bookingDetails.email}
              className="h-14 flex-1 rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50 sm:h-16 sm:text-lg"
            >
              {step === "details" ? "Confirm Booking" : "Continue"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
