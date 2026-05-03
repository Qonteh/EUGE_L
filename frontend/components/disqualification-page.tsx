"use client"

import { ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DisqualificationPageProps {
  onClose: () => void
}

export function DisqualificationPage({ onClose }: DisqualificationPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          {/* Icon */}
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted sm:mb-8 sm:h-24 sm:w-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary sm:h-14 sm:w-14">
              <span className="text-lg font-bold text-primary-foreground sm:text-xl">EL</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Thanks for Your Interest
          </h1>
          
          <p className="mb-8 text-muted-foreground sm:mb-10 sm:text-lg">
            We understand that this may not be the right time for you. Our program is designed for traders who are ready 
            to make a committed investment in their education and future.
          </p>

          <p className="mb-8 text-muted-foreground sm:mb-10">
            If your situation changes, we&apos;d love to hear from you again. In the meantime, feel free to explore our 
            free resources and community.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={onClose}
              size="lg"
              className="h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground sm:h-16 sm:text-lg"
            >
              Return Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Questions? Contact us at{" "}</span>
              <a href="mailto:support@eugenel.com" className="font-medium text-accent hover:underline">
                support@eugenel.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4 text-center sm:px-6 sm:py-6">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <span className="text-xs font-bold text-primary-foreground">EL</span>
          </div>
          <span className="text-sm text-muted-foreground">Eugene L Mentorship</span>
        </div>
      </div>
    </div>
  )
}
