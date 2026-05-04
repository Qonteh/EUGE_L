"use client"

import { useState } from "react"
import { Play, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onApplyNow: () => void
}

const successStories = [
  {
    name: "Jordan",
    achievement: "+$30,000 FTMO Payouts in Just 4 Weeks",
    payout: "$30,000",
    type: "PAYOUT",
  },
  {
    name: "Steve",
    achievement: "Funded and $9,000+ in Payouts",
    payout: "$9,000",
    type: "PAYOUT",
  },
  {
    name: "Ian",
    achievement: "Prop Firm Leaderboard and $24k in Payouts",
    payout: "$24,000",
    type: "PAYOUT",
  },
  {
    name: "Elijah",
    achievement: "Almost Lost His Funded Account Then Withdrew $7,857",
    payout: "$7,857",
    type: "PAYOUT",
  },
  {
    name: "George",
    achievement: "Now FTMO Prime Funded Trader!",
    payout: "FUNDED",
    type: "FUNDED",
  },
]

export function LandingPage({ onApplyNow }: LandingPageProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pre-headline */}
          <p className="mb-3 text-xs font-medium text-muted-foreground sm:mb-4 sm:text-sm md:text-base">
            If You Already Have $2K+ in Savings or Trade On the Side...
          </p>

          {/* Main Headline */}
          <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-balance">Your Trading Skills Could Be Generating </span>
            <span className="text-primary">$2K-$10K Profit Monthly</span>
          </h1>

          {/* Sub-headline */}
          <p className="mb-4 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl md:text-2xl">
            (In Just 90 Days, <em className="text-primary">Guaranteed</em>)
          </p>

          {/* Value Proposition */}
          <p className="mx-auto mb-6 max-w-2xl text-sm italic text-muted-foreground sm:mb-8 sm:text-base md:text-lg">
            Become a Profitable, Funded Trader Using Our Proven Accelerator System — Learn Once, Trade for Life.
          </p>

          {/* Video Section */}
          <div className="relative mx-auto mb-6 max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl shadow-primary/20 sm:mb-8 sm:rounded-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
              {!isVideoPlaying ? (
                <div className="relative h-full w-full">
                  {/* Mentor Image */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent sm:mb-4 sm:h-32 sm:w-32">
                        <span className="text-2xl font-bold text-primary-foreground sm:text-4xl">EL</span>
                      </div>
                      <p className="text-base font-medium text-white sm:text-lg">Eugene L</p>
                      <p className="text-xs text-gray-300 sm:text-sm">Trading Mentor</p>
                    </div>
                  </div>
                  {/* Play Button */}
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all hover:bg-black/40"
                    aria-label="Play video"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform hover:scale-110 sm:h-20 sm:w-20">
                      <Play className="ml-1 h-6 w-6 text-primary-foreground sm:h-8 sm:w-8" fill="currentColor" />
                    </div>
                  </button>
                  {/* Video Label */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-accent px-2 py-1 sm:bottom-4 sm:left-4 sm:px-3">
                    <span className="text-xs font-medium text-accent-foreground sm:text-sm">I&apos;m offering you a...</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-900">
                  <p className="text-white">Video would play here</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onApplyNow}
            size="lg"
            className="mb-3 h-12 w-full max-w-md rounded-xl bg-primary px-6 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/30 sm:mb-4 sm:h-14 sm:text-lg md:h-16 md:px-8 md:text-xl"
          >
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:mb-6">
            And Get Your Free Personalized Action Plan
          </p>

          {/* Trust Badge */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="font-medium text-foreground">Rated Excellent</span>
            <span className="font-bold text-primary">4.9</span>
            <span className="text-muted-foreground">out of 5</span>
            <div className="ml-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/50 text-yellow-400/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-secondary/30 px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10 md:mb-12">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              <span className="text-primary">300+</span> Trader Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Watch how everyday traders inside the Accelerator got funded, hit payouts, and changed their financial future in 90 days or less.
            </p>
            <p className="mt-2 text-xs italic text-muted-foreground sm:text-sm">
              (Watch on 1.5x speed - more results at the bottom of this section)
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-xl bg-card shadow-lg transition-all hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent sm:h-20 sm:w-20">
                      <span className="text-xl font-bold text-primary-foreground sm:text-2xl">{story.name[0]}</span>
                    </div>
                  </div>
                  {/* Payout Badge */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-accent px-2 py-1 sm:bottom-4 sm:left-4 sm:px-3">
                    <span className="text-sm font-bold text-accent-foreground sm:text-lg">{story.payout}</span>
                    {story.type === "PAYOUT" && <span className="ml-1 text-xs text-accent-foreground/80 sm:text-sm">PAYOUT</span>}
                  </div>
                  {/* Play Button */}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Play video">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 shadow-lg sm:h-14 sm:w-14">
                      <Play className="ml-0.5 h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" fill="currentColor" />
                    </div>
                  </button>
                </div>
                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-foreground sm:text-xl">{story.name}</h3>
                  <p className="text-sm text-primary sm:text-base">{story.achievement}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Watch More Results Button */}
          <div className="mt-8 text-center sm:mt-10">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-2 border-foreground px-6 text-base font-bold text-foreground hover:bg-foreground hover:text-background sm:h-14 sm:px-8 sm:text-lg"
            >
              Watch More Results
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
            <p className="text-xs italic text-muted-foreground sm:text-sm">
              <span className="font-semibold">Disclaimer:</span> Testimonials shared by the Company are not typical and should not be construed as a guarantee of performance. Any results shared are examples of individuals who have used elements from our Services. Individual results may vary. Past performance does not guarantee future results. Earnings and income examples provided by the Company are aspirational statements only. These results are not typical, and individual results may vary. The results presented on this page reflect our experiences, and we cannot guarantee that you will achieve the same or similar results.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
