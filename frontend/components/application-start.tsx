"use client"

import { Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplicationStartProps {
  onStart: () => void
  onClose: () => void
}

export function ApplicationStart({ onStart, onClose }: ApplicationStartProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Gradient Border Top */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-md text-center">
          {/* Header */}
          <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            Apply now to join the{" "}
            <span className="text-primary">Traders Accelerator Program</span>
          </h1>

          {/* Rating */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-1 sm:mb-12">
            <span className="text-sm font-medium text-foreground sm:text-base">Rated Excellent</span>
            <span className="text-sm font-bold text-primary sm:text-base">4.9</span>
            <span className="text-sm text-muted-foreground sm:text-base">out of 5</span>
            <div className="ml-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/50 text-yellow-400/50"}`}
                />
              ))}
            </div>
          </div>

          {/* Application Title */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              TAP Application | Eugene L
            </h2>
          </div>

          {/* Time Estimate */}
          <div className="mb-4 flex items-center justify-center gap-2 text-muted-foreground sm:mb-6">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Takes 1 minute 30 seconds</span>
          </div>

          {/* Start Button */}
          <Button
            onClick={onStart}
            size="lg"
            className="h-12 w-full max-w-xs rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/30 sm:h-14 sm:text-lg"
          >
            Start
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Gradient Border Bottom */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
    </div>
  )
}
