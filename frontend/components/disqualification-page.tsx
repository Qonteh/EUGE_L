"use client"

import { X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DisqualificationPageProps {
  onClose: () => void
  reason?: string
}

export function DisqualificationPage({ onClose, reason }: DisqualificationPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-end px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <span className="text-4xl text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </span>
          </div>

          <p className="mb-8 text-xl leading-relaxed text-foreground md:text-2xl">
            {reason === "Investment budget too low"
              ? "We understand that investing may not be possible for you at this time. Please feel free to connect with us in the future if your situation changes."
              : reason === "Not ready to commit"
              ? "Thank you for your interest. It seems you might not be ready for this commitment at the moment. Feel free to reach out when you're ready to take the next step."
              : "Thank you for your interest. Unfortunately, our program may not be the right fit at this time. Please feel free to connect with us in the future if your situation changes."}
          </p>

          <div className="space-y-4">
            <Button
              onClick={onClose}
              size="lg"
              className="h-14 w-full max-w-xs rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30"
            >
              Return Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground">
              Have questions? Contact us at{" "}
              <a href="mailto:support@eugenel.com" className="text-primary hover:underline">
                support@eugenel.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Eugene L Mentorship Program | High-Ticket Trading Education
        </p>
      </div>
    </div>
  )
}
