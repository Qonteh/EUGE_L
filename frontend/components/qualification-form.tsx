"use client"

import { useState } from "react"
import { X, ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QualificationFormProps {
  onComplete: (data: FormData) => void
  onDisqualified: () => void
  onClose: () => void
}

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

const questions = [
  {
    id: 1,
    question: "What is your current trading experience?",
    type: "choice",
    field: "experience",
    options: [
      { label: "A", value: "Complete Beginner - Never traded before" },
      { label: "B", value: "Some Experience - Traded a little" },
      { label: "C", value: "Intermediate - Trade regularly" },
      { label: "D", value: "Advanced - Profitable trader" },
    ],
  },
  {
    id: 2,
    question: "What is your #1 goal with trading right now?",
    subtitle: "Be specific - income targets, lifestyle changes, financial freedom, etc.",
    type: "text",
    field: "goal",
    placeholder: "Financial freedom, replace my job income...",
  },
  {
    id: 3,
    question: "Are you ready to commit to a 90-day intensive program?",
    type: "choice",
    field: "commitment",
    options: [
      { label: "A", value: "Yes, I'm fully committed" },
      { label: "B", value: "I need to think about it" },
      { label: "C", value: "No, not right now" },
    ],
    disqualifyOn: ["I need to think about it", "No, not right now"],
  },
  {
    id: 4,
    question: "How much are you able to invest in your trading education?",
    subtitle: "This program is designed for serious individuals ready to invest in their success.",
    type: "choice",
    field: "investment",
    options: [
      { label: "A", value: "$0-$999" },
      { label: "B", value: "$1,000-$2,999" },
      { label: "C", value: "$3,500-$4,999" },
      { label: "D", value: "$5,000+" },
    ],
    disqualifyOn: ["$0-$999"],
  },
  {
    id: 5,
    question: "What is your current annual income?",
    type: "choice",
    field: "income",
    options: [
      { label: "A", value: "Under $20,000" },
      { label: "B", value: "$20,000-$40,000" },
      { label: "C", value: "$40,000-$75,000" },
      { label: "D", value: "$75,000+" },
      { label: "E", value: "Retired" },
    ],
  },
  {
    id: 6,
    question: "What is your name?",
    type: "name",
    field: "name",
  },
  {
    id: 7,
    question: "What is your email address?",
    type: "email",
    field: "email",
    placeholder: "you@example.com",
  },
  {
    id: 8,
    question: "What is your phone number?",
    type: "phone",
    field: "phone",
    placeholder: "123 456 7890",
  },
]

const countryCodes = [
  { code: "+1", flag: "US", country: "United States" },
  { code: "+44", flag: "UK", country: "United Kingdom" },
  { code: "+255", flag: "TZ", country: "Tanzania" },
  { code: "+254", flag: "KE", country: "Kenya" },
  { code: "+234", flag: "NG", country: "Nigeria" },
  { code: "+27", flag: "ZA", country: "South Africa" },
  { code: "+91", flag: "IN", country: "India" },
  { code: "+61", flag: "AU", country: "Australia" },
  { code: "+49", flag: "DE", country: "Germany" },
  { code: "+33", flag: "FR", country: "France" },
  { code: "+86", flag: "CN", country: "China" },
  { code: "+81", flag: "JP", country: "Japan" },
  { code: "+82", flag: "KR", country: "South Korea" },
  { code: "+971", flag: "AE", country: "UAE" },
]

export function QualificationForm({ onComplete, onDisqualified, onClose }: QualificationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    experience: "",
    goal: "",
    commitment: "",
    investment: "",
    income: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
    setFormData((prev) => ({ ...prev, [currentQuestion.field]: value }))
  }

  const handleNext = () => {
    // Check for disqualification
    if (currentQuestion.disqualifyOn?.includes(selectedOption || "")) {
      onDisqualified()
      return
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setSelectedOption(null)
    }
  }

  const isNextDisabled = () => {
    switch (currentQuestion.type) {
      case "choice":
        return !selectedOption
      case "text":
        return !formData[currentQuestion.field as keyof FormData]
      case "name":
        return !formData.firstName || !formData.lastName
      case "email":
        return !formData.email || !formData.email.includes("@")
      case "phone":
        return !formData.phone
      default:
        return true
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {currentStep + 1} of {questions.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-28 pt-6 sm:px-6 sm:pb-32 sm:pt-10">
        <div className="mx-auto w-full max-w-lg">
          {/* Question Number Badge */}
          <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground sm:h-10 sm:w-10 sm:text-base">
            {currentQuestion.id}
          </div>

          {/* Question */}
          <h2 className="mb-2 text-xl font-bold leading-tight text-foreground sm:text-2xl md:text-3xl">
            {currentQuestion.question}
          </h2>

          {currentQuestion.subtitle && (
            <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">{currentQuestion.subtitle}</p>
          )}

          {/* Input based on type */}
          <div className="mt-6 sm:mt-8">
            {currentQuestion.type === "choice" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all sm:gap-4 sm:px-5 sm:py-5",
                      selectedOption === option.value
                        ? "border-accent bg-accent/5"
                        : "border-border bg-card hover:border-accent/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors sm:h-10 sm:w-10 sm:text-base",
                        selectedOption === option.value
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {option.label}
                    </span>
                    <span className={cn(
                      "text-sm font-medium sm:text-base",
                      selectedOption === option.value ? "text-foreground" : "text-foreground"
                    )}>
                      {option.value}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={formData[currentQuestion.field as keyof FormData] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [currentQuestion.field]: e.target.value,
                    }))
                  }
                  className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent sm:h-16 sm:text-lg"
                />
              </div>
            )}

            {currentQuestion.type === "name" && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground sm:text-base">
                    First name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent sm:h-16 sm:text-lg"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground sm:text-base">
                    Last name
                  </label>
                  <Input
                    type="text"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent sm:h-16 sm:text-lg"
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "email" && (
              <Input
                type="email"
                placeholder={currentQuestion.placeholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="h-14 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent sm:h-16 sm:text-lg"
              />
            )}

            {currentQuestion.type === "phone" && (
              <div className="flex gap-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
                  }
                  className="h-14 rounded-xl border-2 border-border bg-card px-3 text-base text-foreground focus:border-accent focus:outline-none sm:h-16 sm:px-4 sm:text-lg"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <Input
                  type="tel"
                  placeholder={currentQuestion.placeholder}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-14 flex-1 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent sm:h-16 sm:text-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background px-4 py-4 sm:px-6 sm:py-5">
        <div className="mx-auto flex max-w-lg gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="h-14 w-14 shrink-0 rounded-full border-2 p-0 sm:h-16 sm:w-16"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="h-14 flex-1 rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50 sm:h-16 sm:text-lg"
          >
            {currentStep === questions.length - 1 ? "Submit Application" : "Continue"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
