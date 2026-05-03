"use client"

import { useState } from "react"
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

interface FormData {
  experience: string
  goal: string
  commitment: string
  investment: string
  income: string
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
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

export default function FunnelPage() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>("landing")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  const handleApplyNow = () => {
    setCurrentStep("application-start")
  }

  const handleStartApplication = () => {
    setCurrentStep("qualification")
  }

  const handleFormComplete = async (data: FormData) => {
    setFormData(data)

    // Submit application to API
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.data.qualified) {
        setCurrentStep("booking")
      } else {
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

    // Submit booking to API
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          date: booking.date.toISOString(),
        }),
      })
    } catch (error) {
      console.error("[v0] Error submitting booking:", error)
    }

    setCurrentStep("confirmation")
  }

  const handleClose = () => {
    setCurrentStep("landing")
    setFormData(null)
    setBookingData(null)
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
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
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
        <DisqualificationPage onClose={handleClose} />
      )}
    </main>
  )
}
