"use client"

import { useState } from "react"
import { Play, Star, ArrowRight, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface LandingPageProps {
  onApplyNow: () => void
}

const successStories = [
  {
    name: "Jordan",
    achievement: "+$30,000 FTMO Payouts in Just 4 Weeks",
    payout: "$30,000",
  },
  {
    name: "Steve",
    achievement: "Funded and $9,000+ in Payouts",
    payout: "$9,000",
  },
  {
    name: "Ian",
    achievement: "Prop Firm Leaderboard and $24k in Payouts",
    payout: "$24,000",
  },
  {
    name: "Elijah",
    achievement: "Almost Lost His Funded Account Then Withdrew $7,857",
    payout: "$7,857",
  },
  {
    name: "George",
    achievement: "Now FTMO Prime Funded Trader!",
    payout: "FUNDED",
  },
  {
    name: "Marcus",
    achievement: "From Zero to $15k Monthly Income",
    payout: "$15,000",
  },
]

const faqs = [
  {
    question: "If you're already a profitable trader, why sell a program?",
    answer: "I trade every single day. But I realized that helping others achieve the same freedom I have is incredibly fulfilling. Plus, the program creates a community of like-minded traders who support each other. Trading can be lonely - this changes that."
  },
  {
    question: "Is this something I can actually learn?",
    answer: "Absolutely. Our system is designed to be simple and repeatable. We've had complete beginners go from zero knowledge to funded traders in 90 days. The key is following our proven process step by step."
  },
  {
    question: "What makes this different from other trading courses?",
    answer: "Three things: 1) You get direct 1-on-1 mentorship with me, not just pre-recorded videos. 2) We focus on getting you FUNDED with prop firms, not just educated. 3) Our results speak for themselves - 300+ success stories."
  },
  {
    question: "How does the funding process work?",
    answer: "We help you pass prop firm challenges like FTMO, where they give you capital to trade (up to $400k). You keep 80-90% of profits without risking your own money. We've perfected the exact strategy to pass these challenges."
  },
  {
    question: "What if I've already tried trading and lost money?",
    answer: "Most of our successful students were exactly where you are. The difference is they had a proven system and mentor to guide them. Past failures become valuable lessons when you have the right framework."
  },
  {
    question: "What if it doesn't work for me?",
    answer: "We offer a satisfaction guarantee because we're confident in our system. If you do the work and follow the process, you will see results. Our track record proves it."
  },
]

const benefits = [
  "Proven system used by 300+ funded traders",
  "1-on-1 mentorship with professional traders",
  "Pass prop firm challenges in 90 days or less",
  "Trade with up to $400k in funded capital",
  "Keep 80-90% of all profits you generate",
  "Lifetime access to trading community",
]

export function LandingPage({ onApplyNow }: LandingPageProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary sm:h-10 sm:w-10">
              <span className="text-sm font-bold text-primary-foreground sm:text-base">EL</span>
            </div>
            <span className="text-lg font-semibold text-foreground sm:text-xl">Eugene L</span>
          </div>
          <Button
            onClick={onApplyNow}
            className="h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 sm:h-11 sm:px-6 sm:text-base"
          >
            Apply Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 sm:mb-8">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              Limited spots available for 2026
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Your Trading Skills Could Be Generating{" "}
            <span className="text-accent">$2K-$10K Monthly</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mb-10 sm:text-lg md:text-xl">
            Join 300+ traders who transformed their skills into consistent profits 
            in just 90 days with our proven Accelerator System.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center gap-4 sm:mb-16 sm:flex-row sm:justify-center">
            <Button
              onClick={onApplyNow}
              size="lg"
              className="h-14 w-full rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl sm:h-16 sm:w-auto sm:text-lg"
            >
              Get Your Free Action Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Free consultation - No commitment required
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["J", "S", "I", "E"].map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="font-medium text-foreground">300+ Funded Traders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 5 ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-primary shadow-2xl sm:rounded-3xl">
            <div className="aspect-video">
              {!isVideoPlaying ? (
                <div className="relative flex h-full w-full items-center justify-center">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm sm:mb-6 sm:h-28 sm:w-28">
                      <span className="text-2xl font-bold text-primary-foreground sm:text-4xl">EL</span>
                    </div>
                    <p className="mb-1 text-lg font-semibold text-primary-foreground sm:text-2xl">Eugene L</p>
                    <p className="text-sm text-primary-foreground/70 sm:text-base">Professional Trader & Mentor</p>
                  </div>
                  
                  {/* Play Button */}
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center transition-all"
                    aria-label="Play video"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
                      <Play className="ml-1 h-6 w-6 text-primary sm:h-8 sm:w-8" fill="currentColor" />
                    </div>
                  </button>
                  
                  {/* Video Label */}
                  <div className="absolute bottom-4 left-4 rounded-full bg-accent px-3 py-1.5 sm:bottom-6 sm:left-6 sm:px-4 sm:py-2">
                    <span className="text-xs font-medium text-accent-foreground sm:text-sm">Watch my story</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-primary">
                  <p className="text-primary-foreground">Video would play here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-card px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              What You Get
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to become a consistently profitable, funded trader
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5 transition-all hover:border-accent/50 sm:p-6"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground sm:text-base">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
              Real Results
            </p>
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              300+ Trader Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              See how everyday people became funded traders and changed their financial future
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-[4/3] bg-primary">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:40px_40px]" />
                  <div className="relative flex h-full items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm sm:h-20 sm:w-20">
                      <span className="text-xl font-bold text-primary-foreground sm:text-2xl">{story.name[0]}</span>
                    </div>
                  </div>
                  {/* Payout Badge */}
                  <div className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 sm:bottom-4 sm:left-4">
                    <span className="text-sm font-bold text-accent-foreground sm:text-base">{story.payout}</span>
                    {story.payout !== "FUNDED" && <span className="ml-1 text-xs text-accent-foreground/80">PAYOUT</span>}
                  </div>
                  {/* Play Button */}
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100" aria-label="Play video">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/90 shadow-lg">
                      <Play className="ml-0.5 h-5 w-5 text-primary" fill="currentColor" />
                    </div>
                  </button>
                </div>
                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{story.name}</h3>
                  <p className="text-sm text-muted-foreground">{story.achievement}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center sm:mt-16">
            <Button
              onClick={onApplyNow}
              size="lg"
              className="h-14 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl sm:h-16 sm:text-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-muted/50 p-4 sm:mt-10 sm:p-5">
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              <span className="font-medium">Disclaimer:</span> Results shown are not typical and individual results may vary. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </section>

      {/* A Note From Eugene Section */}
      <section className="border-y border-border bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10 sm:h-20 sm:w-20">
              <span className="text-xl font-bold sm:text-2xl">EL</span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">A Personal Note</h2>
          </div>
          
          <div className="space-y-6 text-center text-base leading-relaxed sm:text-lg">
            <p className="opacity-90">
              If you&apos;re tempted to skip this, I understand. You&apos;ve probably seen countless 
              trading programs before.
            </p>
            
            <p className="font-medium">But the ones who skip? They keep repeating the same cycle.</p>
            
            <p className="opacity-90">
              The traders who move forward think for themselves. They take responsibility. 
              They commit to learning the skill properly, once and for all.
            </p>
            
            <div className="pt-4">
              <p className="font-semibold">Eugene L</p>
              <p className="text-sm opacity-70">Head Coach & Professional Trader</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center sm:mb-16">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
              FAQ
            </p>
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="rounded-xl border border-border bg-card px-5 py-1 data-[state=open]:border-accent/50"
              >
                <AccordionTrigger className="py-4 text-left text-base font-medium text-foreground hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border bg-muted px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            Ready to Transform Your Trading?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground sm:mb-10">
            Apply now to get your free personalized action plan and discover 
            how you can become a funded trader in the next 90 days.
          </p>
          <Button
            onClick={onApplyNow}
            size="lg"
            className="h-14 w-full rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl sm:h-16 sm:w-auto sm:text-lg"
          >
            Get Your Free Action Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Free consultation - No commitment required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground">EL</span>
              </div>
              <span className="font-semibold text-foreground">Eugene L Mentorship</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 Eugene L Mentorship. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
