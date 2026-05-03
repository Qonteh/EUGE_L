"use client"

import { Clock, Star, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplicationStartProps {
  onStart: () => void
  onClose: () => void
}

export function ApplicationStart({ onStart, onClose }: ApplicationStartProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Close Button */}
      <div className="flex justify-end p-4 sm:p-6">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-6">
        <div className="mx-auto w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary sm:mb-10 sm:h-20 sm:w-20">
            <span className="text-xl font-bold text-primary-foreground sm:text-2xl">EL</span>
          </div>

          {/* Header */}
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
            Traders Accelerator Program
          </h1>
          
          <p className="mb-8 text-muted-foreground sm:mb-10 sm:text-lg">
            Application with Eugene L
          </p>

          {/* Rating */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:mb-12">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${star <= 5 ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground sm:text-base">4.9/5</span>
            <span className="text-sm text-muted-foreground sm:text-base">from 300+ traders</span>
          </div>

          {/* Card */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {/* Time Estimate */}
            <div className="mb-6 flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm sm:text-base">Takes about 2 minutes</span>
            </div>

            {/* Start Button */}
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl sm:h-16 sm:text-lg"
            >
              Start Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-muted-foreground sm:text-sm">
            Your information is secure and will only be used to assess your application.
          </p>
        </div>
      </div>
    </div>
  )
}
