"use client"

import { useEffect, useState } from "react"
import { LandingPage } from "@/frontend/components/landing-page"
import { ApplicationStart } from "@/frontend/components/application-start"
import { QualificationForm } from "@/frontend/components/qualification-form"
import { BookingCalendar } from "@/frontend/components/booking-calendar"
import { ConfirmationPage } from "@/frontend/components/confirmation-page"
import { DisqualificationPage } from "@/frontend/components/disqualification-page"

type FunnelStep =
  | "landing"
  | "application-start"
  | "qualification"
  | "booking"
  | "confirmation"
  | "disqualified"

interface BookingData {
  date: Date
  time: string
  timezone: string
  name: string
  email: string
  message: string
  phone: string
}

interface ApplicationResult {
  id: string
  qualified: boolean
  disqualificationReason?: string
}

interface StoredBookingData extends Omit<BookingData, "date"> {
  date: string
}

interface FunnelSnapshot {
  currentStep: FunnelStep
  formData: Record<string, any> | null
  bookingData: StoredBookingData | null
  disqualificationReason?: string
  applicationId: string | null
}

const FUNNEL_STORAGE_KEY = "euge-l-funnel-state"

function readStoredSnapshot(): FunnelSnapshot | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(FUNNEL_STORAGE_KEY)
    if (!raw) {
      return null
    }

    return JSON.parse(raw) as FunnelSnapshot
  } catch {
    return null
  }
}

function writeStoredSnapshot(snapshot: FunnelSnapshot) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(snapshot))
}

function clearStoredSnapshot() {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(FUNNEL_STORAGE_KEY)
}

export default function FunnelPage() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>("landing")
  const [formData, setFormData] = useState<Record<string, any> | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [disqualificationReason, setDisqualificationReason] = useState<string | undefined>(undefined)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const snapshot = readStoredSnapshot()
    if (snapshot) {
      setCurrentStep(snapshot.currentStep)
      setFormData(snapshot.formData)
      setApplicationId(snapshot.applicationId)
      setDisqualificationReason(snapshot.disqualificationReason)
      setBookingData(
        snapshot.bookingData
          ? {
              ...snapshot.bookingData,
              date: new Date(snapshot.bookingData.date),
            }
          : null
      )
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    writeStoredSnapshot({
      currentStep,
      formData,
      bookingData: bookingData
        ? {
            ...bookingData,
            date: bookingData.date.toISOString(),
          }
        : null,
      disqualificationReason,
      applicationId,
    })
  }, [hydrated, currentStep, formData, bookingData, disqualificationReason, applicationId])

  const handleApplyNow = () => {
    setCurrentStep("application-start")
  }

  const handleStartApplication = () => {
    setCurrentStep("qualification")
  }

  const handleFormComplete = async (data: Record<string, any>) => {
    setFormData(data)
    
    console.log("[v0] Form submitted with data:", data)

    // Submit application to API
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("[v0] API Response:", result)

      if (result.success && result.data?.id) {
        setApplicationId(result.data.id)
        if (result.data?.qualified) {
          console.log("[v0] User qualified, going to booking")
          setCurrentStep("booking")
        } else {
          console.log("[v0] User disqualified, reason:", result.data.disqualificationReason)
          setDisqualificationReason(result.data.disqualificationReason)
          setCurrentStep("disqualified")
        }
      } else {
        // If no valid response, treat as disqualified
        console.log("[v0] Invalid response, treating as disqualified")
        setCurrentStep("disqualified")
      }
    } catch (error) {
      console.error("[v0] Error submitting application:", error)
      // Proceed to booking anyway in demo mode
      setCurrentStep("booking")
    }
  }

  const handleDisqualified = () => {
    setCurrentStep("disqualified")
  }

  const handleBookingComplete = async (booking: BookingData) => {
    setBookingData(booking)

    // Submit booking to API with application ID if available
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          date: booking.date.toISOString(),
          applicationId: applicationId || undefined,
        }),
      })
    } catch (error) {
      console.error("[v0] Error submitting booking:", error)
    }

    setCurrentStep("confirmation")
  }

  const handleClose = () => {
    clearStoredSnapshot()
    setCurrentStep("landing")
    setFormData(null)
    setBookingData(null)
    setApplicationId(null)
    setDisqualificationReason(undefined)
  }

  if (!hydrated) {
    return <main className="min-h-screen bg-background" />
  }

  return (
    <main className="min-h-screen">
      {currentStep === "landing" && (
        <LandingPage onApplyNow={handleApplyNow} />
      )}

      {currentStep === "application-start" && (
        <ApplicationStart onStart={handleStartApplication} onClose={handleClose} />
      )}

      {currentStep === "qualification" && (
        <QualificationForm
          onComplete={handleFormComplete}
          onDisqualified={handleDisqualified}
          onClose={handleClose}
        />
      )}

      {currentStep === "booking" && formData && (
        <BookingCalendar
          onComplete={handleBookingComplete}
          onClose={handleClose}
          formData={{
            firstName: formData.firstName || formData.fullName || "",
            lastName: formData.lastName || "",
            email: formData.email || "",
          }}
        />
      )}

      {currentStep === "confirmation" && bookingData && (
        <ConfirmationPage
          bookingData={bookingData}
          onClose={handleClose}
        />
      )}

      {currentStep === "disqualified" && (
        <DisqualificationPage onClose={handleClose} reason={disqualificationReason} />
      )}
    </main>
  )
}
