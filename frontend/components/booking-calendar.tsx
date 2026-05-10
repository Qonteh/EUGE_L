"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Clock, Calendar, Globe } from "lucide-react"
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

// timeSlots will be fetched per-date from the server

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
  const [timezone, setTimezone] = useState("EAT")
  const [availableSlots, setAvailableSlots] = useState<string[] | null>(null)
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

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1

    const days: (number | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Only future dates, weekdays only
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
      // Fetch slots for this date
      const dateStr = date.toISOString().split('T')[0]
      fetch(`/api/availability?date=${dateStr}`)
        .then((res) => res.json())
        .then((payload) => {
          const slots = payload?.data?.slots || []
          setAvailableSlots(slots)
        })
        .catch(() => setAvailableSlots([]))
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: step === "calendar" ? "33%" : step === "time" ? "66%" : "100%" }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        {step !== "calendar" && (
          <button
            onClick={handleBack}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:h-10 sm:w-10"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-2"
          aria-label="Close"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-3 pb-20 sm:px-4 sm:pb-24">
        {step === "calendar" && (
          <div className="mx-auto max-w-md">
            <h2 className="mb-4 text-center text-xl font-bold text-foreground sm:mb-6 sm:text-2xl">
              Select a Day
            </h2>

            {/* Month Navigation */}
            <div className="mb-4 flex items-center justify-center gap-2 sm:mb-6 sm:gap-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                  )
                }
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-2"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <span className="min-w-28 text-center text-base font-semibold text-foreground sm:min-w-32 sm:text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                  )
                }
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-2"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4 sm:mb-6">
              {/* Day Headers */}
              <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-muted-foreground sm:mb-2 sm:gap-1 sm:text-xs">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                  <div key={day} className="py-1 sm:py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || !isDateAvailable(day)}
                    className={cn(
                      "flex h-9 w-full items-center justify-center rounded-lg text-xs font-medium transition-all sm:h-10 sm:text-sm",
                      !day && "invisible",
                      day && isDateAvailable(day)
                        ? "text-foreground hover:bg-primary hover:text-primary-foreground"
                        : "cursor-not-allowed text-muted-foreground/50",
                      day && isToday(day) && "relative",
                      selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth.getMonth() &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {day}
                    {day && isToday(day) && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary sm:bottom-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs font-medium sm:text-sm">Time zone</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="ml-auto rounded-lg border border-border bg-transparent px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none sm:text-sm"
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
          <div className="mx-auto max-w-md">
            {/* Selected Date Header */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Timezone */}
            <div className="mb-4 flex items-center gap-2 text-muted-foreground sm:mb-6">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {currentTimezone?.label} ({currentTimezone?.offset})
              </span>
            </div>

            <hr className="mb-4 border-border sm:mb-6" />

            {/* Time Selection */}
            <h4 className="mb-2 text-center text-lg font-bold text-foreground sm:text-xl">
              Select a Time
            </h4>
            <p className="mb-4 text-center text-xs text-muted-foreground sm:mb-6 sm:text-sm">
              Duration: 1 hr
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
              {availableSlots === null && (
                <div className="col-span-2 text-center text-sm text-muted-foreground">Loading slots…</div>
              )}
              {availableSlots && availableSlots.length === 0 && (
                <div className="col-span-2 text-center text-sm text-muted-foreground">No available slots for this date.</div>
              )}
              {availableSlots && availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all sm:gap-3 sm:px-4 sm:py-4 sm:text-base",
                    selectedTime === time
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-primary hover:border-primary/50"
                  )}
                >
                  {time}
                  {selectedTime === time && (
                    <span className="ml-auto rounded-lg bg-primary px-2 py-0.5 text-xs text-primary-foreground sm:px-4 sm:py-1 sm:text-sm">
                      Next
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && selectedDate && selectedTime && (
          <div className="mx-auto max-w-md">
            {/* Booking Summary */}
            <div className="mb-4 sm:mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground sm:mb-4 sm:text-xl">
                The Accelerator Assessment | Eugene L
              </h2>
              <div className="space-y-1.5 text-xs text-muted-foreground sm:space-y-2 sm:text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>1 hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    {selectedTime} - {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{currentTimezone?.label}</span>
                </div>
              </div>
            </div>

            <hr className="mb-4 border-border sm:mb-6" />

            {/* Details Form */}
            <h3 className="mb-3 text-base font-bold text-foreground sm:mb-4 sm:text-lg">Enter Details</h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground sm:text-sm">
                  Name *
                </label>
                <Input
                  type="text"
                  value={bookingDetails.name}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-10 border-2 border-border bg-card text-sm sm:h-12 sm:text-base"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-foreground sm:text-sm">
                  Email *
                </label>
                <Input
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-10 border-2 border-border bg-card text-sm sm:h-12 sm:text-base"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-foreground sm:text-sm">
                  Please share anything that will help prepare for our meeting.
                </label>
                <textarea
                  value={bookingDetails.message}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border-2 border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:text-base"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-foreground sm:text-sm">
                  Send text messages to
                </label>
                <Input
                  type="tel"
                  value={bookingDetails.phone}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+255 692 438 585"
                  className="h-10 border-2 border-primary bg-card text-sm sm:h-12 sm:text-base"
                />
              </div>

              <p className="text-[10px] text-muted-foreground sm:text-xs">
                By proceeding, you confirm that you have read and agree to{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Notice
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {(step === "time" || step === "details") && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center gap-2 bg-background px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="h-11 w-11 shrink-0 rounded-xl border-2 p-0 sm:h-14 sm:w-14"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={step === "time" ? !selectedTime : !bookingDetails.name || !bookingDetails.email}
            className="h-11 flex-1 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 sm:h-14 sm:text-lg"
          >
            {step === "details" ? "Schedule Event" : "Next"}
          </Button>
        </div>
      )}
    </div>
  )
}
