"use client"

import { useState } from "react"
import { Play, Star, Clock, CheckCircle, ArrowRight, ChevronDown, ChevronUp, Quote } from "lucide-react"
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
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mni0OzRg8g7lKYHiQuF5S8bd4fuQOq.png",
    payout: "$30,000",
  },
  {
    name: "Steve",
    achievement: "Funded and $9,000+ in Payouts",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-31jROb3xw4uEGv4SqCuZv3fN5WuKkW.png",
    payout: "$9,000",
  },
  {
    name: "Ian",
    achievement: "Prop Firm Leaderboard and $24k in Payouts",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-31jROb3xw4uEGv4SqCuZv3fN5WuKkW.png",
    payout: "$24,000",
  },
  {
    name: "Elijah",
    achievement: "Almost Lost His Funded Account Then Withdrew $7,857",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PJSZfnxcw643UilK7GtaKWp7kV1V8K.png",
    payout: "$7,857",
  },
  {
    name: "George",
    achievement: "Now FTMO Prime Funded Trader!",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-31jROb3xw4uEGv4SqCuZv3fN5WuKkW.png",
    payout: "FUNDED",
  },
]

const faqs = [
  {
    question: "If you're already a profitable trader, why sell a program? Why not just trade?",
    answer: "I trade every single day. But I realized that helping others achieve the same freedom I have is incredibly fulfilling. Plus, the program creates a community of like-minded traders who support each other. Trading can be lonely - this changes that."
  },
  {
    question: "Trading sounds complicated... is this something I can actually learn?",
    answer: "Absolutely. Our system is designed to be simple and repeatable. We've had complete beginners go from zero knowledge to funded traders in 90 days. The key is following our proven process step by step."
  },
  {
    question: "What makes this different from other trading courses online?",
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
  {
    question: "Isn't trading risky? What if I lose?",
    answer: "With prop firm trading, you're not risking your own capital. We teach strict risk management - maximum 1-2% per trade. Our system is designed to protect your capital while maximizing gains."
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
            <span className="text-balance">Your Trading Skills Could Be Generating{" "}</span>
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
                  {/* Mentor Image Placeholder */}
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
                    {story.payout !== "FUNDED" && <span className="ml-1 text-xs text-accent-foreground/80 sm:text-sm">PAYOUT</span>}
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
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
            <p className="text-xs italic text-muted-foreground sm:text-sm">
              <span className="font-semibold">Disclaimer:</span> Testimonials shared by the Company are not typical and should not be construed as a guarantee of performance. Any results shared are examples of individuals who have used elements from our Services. Individual results may vary. Past performance does not guarantee future results. Earnings and income examples provided by the Company are aspirational statements only. These results are not typical, and individual results may vary. The results presented on this page reflect our experiences, and we cannot guarantee that you will achieve the same or similar results.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Star Reviews Section */}
      <section className="px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              <span className="text-primary">300+</span> 5-Star Verified Reviews
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              We&apos;ve held their hands to achieve these fantastic results...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-foreground sm:text-xl">Rated Excellent</span>
              <span className="text-lg text-muted-foreground sm:text-xl">4.9 out of 5</span>
              <div className="ml-2 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5" />
                ))}
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[
              { name: "morgster1", tag: "APP", time: "11:30", text: "Hello, trader! Congratulations on successfully completing the Evaluation. Your exceptional trading skills have brought you one step closer to becoming a Master trader." },
              { name: "sniper73", tag: "APP", time: "21/07/2025, 11:28", text: "Amazing @Adam - I know its not much but its the achievement. So fitting that its with you guys too." },
              { name: "matt.m0162", tag: "APP", time: "21/07/2025, 14:03", text: "FTMO 200k passed" },
            ].map((review, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 sm:h-10 sm:w-10">
                    <span className="text-xs font-bold text-primary sm:text-sm">{review.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground sm:text-base">{review.name}</span>
                      <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">{review.tag}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Note From Eugene Section */}
      <section className="bg-secondary/30 px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
            A Note From Eugene:
          </h2>
          
          <div className="space-y-4 text-center text-sm text-foreground sm:space-y-6 sm:text-base md:text-lg">
            <p className="font-medium">
              If you&apos;re tempted to skip this part, I get it. You&apos;ve probably seen countless trading programs and videos before
            </p>
            
            <p className="font-semibold">But the ones who skip?</p>
            
            <p className="text-muted-foreground">
              They keep repeating the same cycle — hoping something will suddenly work without changing how they trade.
            </p>
            
            <p className="font-bold text-foreground">The traders who move forward?</p>
            
            <div className="space-y-2">
              <p>They think for themselves.</p>
              <p>They take responsibility.</p>
              <p>They commit to learning the skill properly, once and for all.</p>
            </div>
            
            <div className="rounded-xl bg-card p-4 text-left shadow-sm sm:p-6">
              <p className="text-sm text-foreground sm:text-base">
                <span className="mr-1 text-yellow-500">&#x1F44D;</span> <span className="font-semibold">Watch the next video above</span> — inside, I&apos;ll show you the exact structure we use to help traders become consistent, disciplined, and profitable within 90 days.
              </p>
            </div>
            
            <p className="text-muted-foreground">
              Then take a few minutes to read the stories below from traders who <em>decided not to give up</em> — and how that decision transformed everything for them.
            </p>
            
            <p className="text-sm italic text-muted-foreground">
              P.S. If you&apos;d like to learn more about my journey and what makes this program different, there&apos;s a section about that below too.
            </p>
            
            <div className="pt-4">
              <p className="font-bold text-foreground">Eugene L</p>
              <p className="text-muted-foreground">Head Coach & Professional Trader</p>
              <p className="italic text-primary">Traders Accelerator Program</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured in Press Section */}
      <section className="px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Featured in the Press
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Respected news outlets have recognised our work and results
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[
              { title: '"I WENT FROM 0 TO $121,000 IN 1 MONTH"', source: "TOT", person: "Eugene L" },
              { title: "FULL STRATEGY BREAKDOWN", source: "Trading Analysis", person: "Eugene L" },
            ].map((press, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="aspect-video">
                  <div className="flex h-full items-center justify-center p-4 sm:p-6">
                    <div className="text-center">
                      <span className="mb-2 inline-block rounded bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black sm:px-3 sm:py-1">{press.source}</span>
                      <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">{press.title}</h3>
                      <p className="mt-2 font-script text-primary">{press.person}</p>
                    </div>
                  </div>
                  {/* Play Button */}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Play video">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 shadow-lg sm:h-14 sm:w-14">
                      <Play className="ml-0.5 h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" fill="currentColor" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/50 px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
            What You&apos;ll Get With Eugene L&apos;s Program
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "1-on-1 Mentorship", desc: "Personal guidance from Eugene L himself" },
              { title: "Proven Strategy", desc: "Battle-tested trading system that works" },
              { title: "Live Trading Sessions", desc: "Watch and learn in real-time" },
              { title: "Community Access", desc: "Join our exclusive traders network" },
              { title: "Funding Support", desc: "Get help securing trading capital" },
              { title: "Lifetime Access", desc: "Learn once, trade for life" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-card p-3 shadow-sm sm:p-4"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Bonus CTA */}
      <section className="px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-primary p-6 text-center text-primary-foreground shadow-xl shadow-primary/30 sm:p-8">
            <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
              Attend your scheduled call to receive a special bonus.
            </h2>
            <p className="text-sm opacity-90 sm:text-base md:text-lg">
              You will get a free $1,000 trading account. Ask your coach on the call to claim it.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary/30 px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border bg-card px-4 shadow-sm sm:px-6"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium text-foreground hover:no-underline sm:py-5 sm:text-base [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground sm:pb-5 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Takes 1 minute 30 seconds</span>
          </div>
          <Button
            onClick={onApplyNow}
            size="lg"
            className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/30 sm:h-14 sm:text-lg"
          >
            Start Application
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
